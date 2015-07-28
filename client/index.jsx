var React = require('react');
var CDAConsts = require('./CrewDriverAppConsts.js');
var Environment = require('./Environment.js')
var LoginComponent = require('./LoginComponent.jsx');

if(localStorage.getItem('agileAuth') !== null){
  chrome.tabs.executeScript({file: "agile_background.js"}, function() {
    console.log("salesdriver Loaded");
    window.close();    
  });
}else{
  React.render(<LoginComponent />,  document.getElementById('salesdriver'));
}