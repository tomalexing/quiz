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

  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  componentWillMount() {

    const dbRef = firebase.database().ref()
    let quizObj = {};
    dbRef.child('quiz').limitToLast(10).once("value").then((quiz) => {
        return quiz.val();
      }).then((quiz, err ) => {
      if( quiz ) this.setState({quiz: quiz});
      if( err ) console.log(err);
     
    })

  }

  componentDidMount() {
    document.title = title
  }



  render() {
    var quizTest = {
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
          { 
            (this.state.quiz)  
            ? 
            this.shuffle(Object.keys(this.state.quiz)).map((q, i) => {
              window.that = this;
                return  <Cart key={q} quiz={{
                  question : this.state.quiz[q]['question'],
                  q1 : Object.values(this.state.quiz[q]['answers'])[0],
                  q2: Object.values(this.state.quiz[q]['answers'])[1],
                  cartId: q
                }} />
              })
            : 
            <div>Downloading</div>
          }
        </div>
 
        <Button ref={(left) => { this.left = left; } } className="leftleft" type={'fab'} primary={true}> <i className="material-icons ">chevron_left</i></Button>
        <Button type={'fab'} primary={true} > <i className="material-icons">chevron_right</i></Button>

      </Layout>
    );
  }

}

export default HomePage;
