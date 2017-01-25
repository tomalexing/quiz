/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Link from '../Link';
import firebase from 'firebase';

const dbRef = firebase.database().ref(`subscribers`)
const generateID = (prefix = '', len = 6) =>
  prefix + Math.random().toString(36).slice(2, len + 2);

const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

class Footer extends React.Component {

  constructor(props){
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
    this.state = {
      emailNotRecognized: false
    }
  }

  componentDidMount() {
    window.componentHandler.upgradeElement(this.root);

    this.dialog = document.querySelector('dialog#footer');
  
    if (! this.dialog.showModal) {
      dialogPolyfill.registerDialog(this.dialog);
    }

    this.dialog.querySelector('.close').addEventListener('click', () => {
      this.dialog.close();
    });
  }

  componentWillUnmount() {
    window.componentHandler.downgradeElements(this.root);
  }

  onSubmit(e) {
    e.preventDefault();
    let email = document.querySelector('#subscribe')
    if(EMAIL_RE.test(email.value)){
      dbRef.once('value').then(snap => {
        let Emails = snap.val() || {}
        let id = generateID('email-')
        Emails[id] = email.value
        dbRef.set(Object.assign(Emails))
        this.setState({emailNotRecognized: false})
        this.dialog.showModal();
        email.value = ""

      })
    }else{
        this.dialog.showModal();
        this.setState({emailNotRecognized: true})
    }
  }

  render() {
    return (
      <footer className="mdl-mini-footer">
        <div className="mdl-mini-footer__left-section">
          <div className="mdl-logo">© 2017 ION DIGITAL</div>
          <ul className="mdl-mini-footer__link-list">
            <span className="quiz-footer__devider" >·</span>
            <li><Link to="/about">TERMS OF SERVICE</Link></li>
          </ul>
        </div>
        <div className="mdl-mini-footer__right-section">
          <form className="quiz-subscribe" onSubmit={this.onSubmit}>
              <label className="quiz-subscribe__label" htmlFor="subscribe"> subscribe: </label>
              <fieldset className="quiz-subscribe__cover__input">
                <input id="subscribe" type="email" placeholder="Email" name="subscribe" />
                <input type="submit" value="subscribe" />
              </fieldset>
          </form>
          <dialog className="mdl-dialog" id="footer" ref={node => (this.root = node)}>{
              this.state.emailNotRecognized
              ?
              <h4 className="mdl-dialog__title">Denied</h4>
              :
             <h4 className="mdl-dialog__title"> Success!!!</h4>
            }
            <div className="mdl-dialog__content">{
              this.state.emailNotRecognized
              ?
               <p>Check email and try again.</p>
              :
               <p>Your subscription was accepted </p>
            }</div>
            <div className="mdl-dialog__actions">
              <button type="button" className="mdl-button close">Okey</button>
            </div>
          </dialog>
                    <dialog id="header" className="mdl-dialog">
                  <h4 className="mdl-dialog__title">Is Needed?</h4>
                  <div className="mdl-dialog__content">
                    <span> You can connect with us by email</span> <address>support@iondigi.com</address> <span> to share you vision of project or just subsribe and We'll consider such kind of functionallity.
                    </span>
                  </div>
                  <div className="mdl-dialog__actions">
                    <button type="button" className="mdl-button close">Close</button>
                  </div>
            </dialog>
        </div>
      </footer>

    );
  } 
}

export default Footer;
