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
import Login from './Login';
import Button from './../Button';

class Header extends React.Component {

  componentDidMount() {
    window.componentHandler.upgradeElement(this.root);

    var dialog = document.querySelector('dialog#header');
        var showDialogButton = document.querySelector('#show-dialog');
    if (! dialog.showModal) {
      dialogPolyfill.registerDialog(dialog);
    }
    showDialogButton.addEventListener('click', function() {
      dialog.showModal();
    });
    dialog.querySelector('.close').addEventListener('click', function() {
      dialog.close();
    });
  }

  componentWillUnmount() {
    window.componentHandler.downgradeElements(this.root);
  }


  render() {
    return (
      <header className={`mdl-layout__header quiz-header`} ref={node => (this.root = node)}>
        <div className={`mdl-layout__header-row quiz-header__row`}>
          <Link className={`mdl-layout-title quiz-header__logo`} to="/">
            <img className="logo" src="./img/quiz-logo.png" /> 
          </Link>
          <div className="mdl-layout-spacer"></div>
          <Button id={"show-dialog"} className="quiz-header__create"  > CREATE QUIZ </Button>
        </div>
      </header>

      
    );
  }

}

export default Header;
