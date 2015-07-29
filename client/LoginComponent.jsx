var React = require('react');
var classNames = require('classnames');

var LoginComponent = React.createClass({
  getInitialState: function(){
    return { visible : 'inline' };
  },
  setVisibleState: function(value){
    this.state.visible = value;
  },
  handleSubmit: function(e){
    e.preventDefault();
    var loginComponent = this;
    chrome.cookies.set(
      {
        url : "https://www.linkedin.com/",
        name : 'agileAuth',
        value : this.state.login + ':' + this.state.password,
        expirationDate : ((new Date().getTime()/1000) + (3600*24))
      }, 
      function(cookie){
        loginComponent.setState({visible : 'none'});
        chrome.tabs.executeScript({file: "/public/javascripts/agile_background.js"}, function() {
          console.log("salesdriver Loaded");
          window.close();
        });
    });
  },
  handlePasswordChange: function(e){
    this.setState({password: e.target.value});
  },
  handleLoginChange: function(e){
    this.setState({login: e.target.value});
  },
  render: function() {
    var fullRowInputClass = classNames('input-field', 'col', 's12');
    var buttonClass = classNames('waves-effect', 'waves-light', 'btn');
    return (
        <div style={{display : this.state.visible}}>
          <form onSubmit={this.handleSubmit}>
            <div className='row'>
              <div className={fullRowInputClass}>
                <input placeholder='Email' type="text" onChange={this.handleLoginChange}/>
              </div>
            </div>
            <div className='row'>
              <div className={fullRowInputClass}>
                <input placeholder='API Key' type="password" onChange={this.handlePasswordChange}/>
              </div>
            </div>
            <div style={{width: "100%"}}>
              <button className={buttonClass} type="submit" style={{color : "#5AC4A4", width : "100%"}}>Sign In</button>
            </div>
          </form>
        </div>
    );
  } 
});
 
module.exports = LoginComponent;