var $ = require('jquery');

debugger;

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function sendToAgile(button, nameArray, adminAuth, tags, email){
	console.log("Send To Agile");
	var employmentText = $(button.currentTarget).parents('li').find('.headline').text();
	var title = window.prompt('Enter Title', employmentText);
	var company = window.prompt('Enter Company', employmentText);
	var tags = window.prompt('Tags? (Separate by , i.e LinkedIn,Security,something Else, )', tags);
	tags = tags.split(','); 
	var createAjax = $.ajax({
		url: 'https://getworkers.agilecrm.com/dev/api/contacts',
		method: 'post',
		headers: { 'Accept': 'application/json' },
		contentType: 'application/json',
		beforeSend: function(xhr) { 
  		xhr.setRequestHeader("Authorization", "Basic " + btoa(adminAuth));
  	},
  	data: JSON.stringify(createContact(nameArray[0], nameArray[1], title, company, tags, email)),
	});
	createAjax.done(function(contact){
		postDeal(adminAuth, company, contact);
		alert('Succesfully added that lead.');
	});
	createAjax.error(function(response){
		alert(response.responseText);
	});
}

function searchContacts(adminAuth, tags){
	var buttonText = "<button class='action-btn save-lead add-to-agile'>Add To Agile</button>";
	var encodedName = [];
	var badgeWrappers = $(".badges");
	var ajaxNameSearches = [];

	$('.name > a').each(function(index){
		var nameArray = stripText(this.textContent).trim().split(' ');
		if(nameArray.length > 2){
			nameArray = [nameArray[0], nameArray[2]];
		}
		var nameSearch = $.ajax({
			url : 'https://getworkers.agilecrm.com/dev/api/search?page_size=15&type=PERSON&q=' + getEncodedName(nameArray),
			headers: { 'Accept': 'application/json' },
			beforeSend: function(xhr) { 
	  		xhr.setRequestHeader("Authorization", "Basic " + btoa(adminAuth)); 
	  	},
		});
		var thisPerson = this;
		ajaxNameSearches.push(nameSearch);
		nameSearch.done(function(contacts){
			if(contacts.length <= 0){
				$(badgeWrappers[index]).append(buttonText);
				$(thisPerson).parents('li').find('.add-to-agile').click(function(item){
					getEmail($(thisPerson).attr('href'), item, nameArray, adminAuth, tags);
				});
				return;
			}
			for(var i = 0; i < contacts.length; i++){
				if(contactExists(contacts[i].properties, nameArray)){
					return;
				}	
			}
			$(badgeWrappers[index]).append(buttonText);
			$(thisPerson).parents('li').find(".add-to-agile").click(function(item){
				getEmail($(thisPerson).attr('href'), item, nameArray, adminAuth, tags);
			});
		});
		nameSearch.error(function(){
			$(badgeWrappers[index]).append('Error Searching Agile For this Jabroni');
			alert("Error getting search ");
		});
	});
}

function getEncodedName(arrayOfName){
	return arrayOfName[0] + '%20' + arrayOfName[1];
}

function contactExists(properties, nameArray){
	var firstNameCheck = false;
	var lastNameCheck = false;
	if(nameArray === null){
		return false;
	}
	for(var i = 0; i < properties.length; i++){
		if(properties[i].name === 'first_name'){
			firstNameCheck = nameArray[0].toLowerCase() === stripText(properties[i].value).trim().toLowerCase() ? true : false;
		}
		if(properties[i].name === 'last_name'){
			lastNameCheck = nameArray[1].toLowerCase() === stripText(properties[i].value).trim().toLowerCase() ? true : false;
		}
	}
	return firstNameCheck && lastNameCheck;
}

function createContact(firstName, lastName, title, company, tags, email){
	var emailProperty;
	var contact = {
		'type': 'PERSON',
		'tags': tags,
		'properties': [
			{
				'type': 'SYSTEM',
				'name': 'first_name',
				'value': firstName,
			},
			{
				'type': 'SYSTEM',
				'name': 'last_name',
				'value': lastName,
			},
			{
				'type': 'SYSTEM',
				'name': 'company',
				'value': company,
			},
			{
				'type': 'SYSTEM',
				'name': 'title',
				'value': title,
			},
			{
				'type': 'CUSTOM',
				'name': 'Lead Status',
				'value': 'Lead'
			}
		]
	};
	if(email !== ""){
		emailProperty = {
				'type': 'SYSTEM',
				'name': 'website',
				'subtype': 'LinkedIn',
				'value': email,
			}
		contact.properties.push(emailProperty);
	}
	return contact;
}

function createDeal(companyName, contact){
	var contactArray = [];
	contactArray.push(contact.id);
	return {
		name: companyName,
		expected_value: '10',
		probability: '10',
		pipeline_id: '5693471696355328',
		milestone: 'Added',
		owner_id: '6490707728531456',
		contact_ids: contactArray,
	};
}

function stripText(text){
	return text.replace(/[^a-zA-Z | /s]/g, '').replace(/[^\x00-\x7F]]/g, '');
}

function postDeal(adminAuth, companyName, contact){
	return $.ajax(
	{
		url : 'https://getworkers.agilecrm.com/dev/api/opportunity',
		method: 'post',
		headers: { 'Content-Type': 'application/json' },
		data: JSON.stringify(createDeal(companyName, contact)),
		beforeSend: function(xhr) { 
			xhr.setRequestHeader("Authorization", "Basic " + btoa(adminAuth)); 
		},
		success: function(response){
			alert('Deal Created.');
		},
		error: function(response){
			alert('No Deal');
		}
	});
}
var tags = prompt('Default Tags - (Separate by , i.e LinkedIn,Security,something Else, )', '');
searchContacts(getCookie('agileAuth'), tags);

function getEmail(url, item, nameArray, adminAuth, tags){
	var newWindow = window.open(url);
	$(newWindow).load(function(){
		var newDoc = newWindow.document;
		$(newDoc).ready(function(){
			if($(newDoc).find('.more-info-tray').find('a')[0] == null){
				alert("Couldn't get Email for some reason...");
				$(newWindow).unload(function(){
					sendToAgile(item, nameArray, adminAuth, tags, "");
				});
				newWindow.close();
				return;	
			}
			var email = $(newDoc).find('.more-info-tray').find('a')[0].text;
			$(newWindow).unload(function(){
				sendToAgile(item, nameArray, adminAuth, tags, email);
			});
			newWindow.close();
		});
	});
}
