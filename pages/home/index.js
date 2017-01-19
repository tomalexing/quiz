/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import Layout from '../../components/Layout';
import { title, html } from './index.md';
import Button from '../../components/Button';
import Link from '../../components/Link';
import Cart from "../../components/Cart";
import firebase from "firebase";
class HomePage extends React.Component {

  static propTypes = {
    articles: PropTypes.array,
  };


  constructor(props) {
    super(props);
    window.firebase = firebase; 
    this.state ={
      quiz: null
    }
  }


  componentWillMount() {

    const dbRef = firebase.database().ref();
    dbRef.child('quiz').limitToLast(10).once("value").then((quiz) => {
      this.setState({
        quiz: quiz.val()
      })
    })

  }

  componentDidMount() {
    document.title = title
   
  }



  render() {
    var quiz = {
      'question': "faadfafa",
      'q1': {
        quantity: 11,
        srcImg: "img/1.jpg",
        value: "asdasd"
      },
      'q2': {
        quantity: 2,
        srcImg: "img/2.png",
        value: "asdasd"
      }
    }
    return (
      <Layout className={"quiz-container"}>


        <div className="quiz">
          { [1,2,3,4,5].map((quiz, i) => {
               <Cart quiz={quiz} />
            })}
        </div>
 
        <Button ref={(left) => { this.left = left; } } className="leftleft" type={'fab'} primary={true}> <i className="material-icons ">chevron_left</i></Button>
        <Button type={'fab'} primary={true} > <i className="material-icons">chevron_right</i></Button>

      </Layout>
    );
  }

}

export default HomePage;
