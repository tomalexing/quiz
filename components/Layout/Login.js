import React, { PropTypes } from 'react';
import firebase from 'firebase';
import Button from './../Button';
import {provider} from './../../core/auth';
import store from "./../../core/store"
export default class Login extends React.Component{

    constructor(props){
      super(props);

      this.state = {
          bubbleOpen: false,
          user: {}
      }

      this.logoutUrl = "/logout";

      // bindings
      this.onLogout = this.onLogout.bind(this);
      this.onAvatarClick = this.onAvatarClick.bind(this);
      this.onLogin = this.onLogin.bind(this);
      
      // authenticized user from store
      store.subscribe(this.componentWillReceiveProps.bind(this))
    }

    componentWillReceiveProps(){
      
       this.setState({
         user: store.getState().user,
      });

    }


    onLogin(){
      event.preventDefault();
      firebase.auth().signInWithPopup(provider).then(function(result) {
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          // The signed-in user info.
          var user = result.user;
          store.dispatch({
            type: 'AUTHORIZE',
            user
          });
    
        }).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;

          store.dispatch({
            type: 'NOT_AUTHORIZE'
          });
        });
    }
    onLogout(){
      event.preventDefault();
      firebase.auth().signOut();
    }
    onAvatarClick(event) {
      this.setState({
         bubbleOpen: !this.state.bubbleOpen
      });
    }

    render(){
      var { bubbleOpen } = this.state
      var {displayName, email, photoURL, uid} =  this.state.user;
        
        return (
              ( !!displayName ? 
                  (<div className="login-status">
                      <Button onClick={this.onAvatarClick} className="login-details__button">
                        <img
                          className="avatar"
                          width="48" height="48"
                          src={`${photoURL}`}
                        />
                      </Button>
                      <div className={`login-bubble ${bubbleOpen ? 'login-bubble__active' : ''}`}>
                        <div className="login-bubble__hider">
                          <div className="login-bubble__frame">
                            <div className="login-bubble__profile">
                              <div className="login-user__name">{displayName}</div>
                              <div className="login-user__email">{email}</div>
                            </div>
                            <div className="login-bubble__options">
                             <Button onClick={this.onLogout} colored={true} className="login-bubble__unregister">sign out </Button>
                            </div>
                          </div>
                        </div>
                      </div>
              </div>) 
              : 

              (<Button  onClick={this.onLogin} primary={true} className={`mdl-button quiz-singin`}>sing in</Button>)
              )
      
      )
    }
}