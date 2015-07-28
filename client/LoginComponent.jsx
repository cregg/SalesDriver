/** MyAwesomeReactComponent.jsx */
 
var React = require('react');
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();

var LoginComponent = React.createClass({
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },
  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },
  getInitialState: function(){
    return { visible : 'inline' };
  },
  setVisibleState: function(value){
    this.state.visible = value;
  },
  handleSubmit: function(e){
    e.preventDefault();
    var loginComponent = this;
    localStorage.setItem('agileAuth', '' + this.state.login + ':' + this.state.password);
    loginComponent.setState({visible : 'none'});
    chrome.tabs.executeScript({file: "agile_background.js"}, function() {
        console.log("salesdriver Loaded");
    });
  },
  handlePasswordChange: function(e){
    this.setState({password: e.target.value});
  },
  handleLoginChange: function(e){
    this.setState({login: e.target.value});
  },
  render: function() {
    var cx = React.addons.classSet;
    var fullRowInputClass = cx({
      'input-field' : true,
      'col': true,
      's12': true  
    });
    var buttonClass = cx({
      'waves-effect': true,
      'waves-light': true,
      'btn': true
    });
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