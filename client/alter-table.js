var $ = require('jquery');

debugger;

var adminAuth = localStorage.getItem('adminAuth');

function sendToAgile(button, nameArray){
	console.log("Send To Agile");
	var employmentText = $(button.currentTarget).parents('.entity-content').find('.headline').text();
	var title = window.prompt('Enter Title', employmentText);
	var company = window.prompt('Enter Company', employmentText);
	var tags = window.prompt('Tags? (Separate by , i.e LinkedIn,Security,something Else, )', 'LinkedIn');
	tags = tags.split(','); 
	var createAjax = $.ajax({
		url: 'https://getworkers.agilecrm.com/dev/api/contacts',
		method: 'post',
		headers: { 'Accept': 'application/json' },
		contentType: 'application/json',
		beforeSend: function(xhr) { 
  		xhr.setRequestHeader("Authorization", "Basic " + btoa(adminAuth));
  	},
  	data: JSON.stringify(createContact(nameArray[0], nameArray[1], title, company, tags))
	});
	createAjax.done(function(response){
		console.log('Complete');
	});
	createAjax.error(function(response){
		console.log('Error');
	});
}

var buttonText = "<button class='action-btn save-lead add-to-agile'>Add To Agile</button>";

var encodedName = [];

var badgeWrappers = $(".badge-wrapper");

var ajaxNameSearches = [];

$('.name a').each(function(index){
	var nameArray = this.text.split(' ');
	var nameSearch = $.ajax({
		url : 'https://getworkers.agilecrm.com/dev/api/search?page_size=10&type=PERSON&q=' + getEncodedName(nameArray),
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
			$(thisPerson).parents('h3').find(".add-to-agile").click(function(item){
				sendToAgile(item, nameArray);   
			});
			return;
		}
		for(var i = 0; i < contacts.length; i++){
			if(contactExists(contacts[i].properties, nameArray)){
				return;
			}	
		}
		$(badgeWrappers[index]).append(buttonText);
		$(thisPerson).parents('.entity-content').find(".add-to-agile").click(function(item){
			sendToAgile(item, nameArray);   
		});
	});
});

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
			firstNameCheck = nameArray[0].toLowerCase() === properties[i].value.toLowerCase() ? true : false;
		}
		if(properties[i].name === 'last_name'){
			lastNameCheck = nameArray[1].toLowerCase() === properties[i].value.toLowerCase() ? true : false;
		}
	}
	return firstNameCheck && lastNameCheck;
}

function createContact(firstName, lastName, title, company, tags){
	return {
		'type': 'PERSON',
		'tags': tags,
		'lead_score': '1',
		'star_value': '1',
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
		]
	};
}






