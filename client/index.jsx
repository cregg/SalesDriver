var React = require('react');
var CDAConsts = require('./CrewDriverAppConsts.js');
var Environment = require('./Environment.js')
var LoginComponent = require('./LoginComponent.jsx');

chrome.cookies.get(
{
  url : "https://www.linkedin.com/",
  name : 'agileAuth',
},
function(cookie){
  if(cookie !== null){
    chrome.tabs.executeScript({file: "/public/javascripts/agile_background.js"}, function() {
      console.log("salesdriver Loaded");
      window.close();
    });
    return;          
  }
  React.render(<LoginComponent />,  document.getElementById('salesdriver'));
});