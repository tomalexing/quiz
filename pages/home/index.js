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
import SS from "react-slick"
import store from "./../../core/store"
import {addClass, removeClass} from  "./../../core/helper"

class HomePage extends React.Component {

  static propTypes = {
    articles: PropTypes.array,
  };


  constructor(props) {
    super(props);
    window.firebase = firebase
    this.state = {
      quiz: null,
      initSlider: false
    }
    this.numberOfQuiz = -1
  
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
    }).then((quiz, err) => {
      if (quiz) {
        this.setState({ quiz: quiz });
        this.numberOfQuiz = Object.keys(quiz).length
      }

      if (err) console.log(err);

    })


  }

  animateOut(prev, next){
    let diff = next - prev
    let prevNode = document.querySelector(`.slick-slide[data-index='${prev}']`)
    let allNde = document.querySelectorAll(`.slick-slide`)

    // if(diff>0){
    //   let firstNode = document.querySelector(`.slick-slide[data-index='${next}']`) || document.querySelector(`.slick-slide[data-index='${(next)%next}']`)
    //   let secondNode = document.querySelector(`.slick-slide[data-index='${next+1}']`) || document.querySelector(`.slick-slide[data-index='${(next+1)%next}']`)
    //   let thirdNode = document.querySelector(`.slick-slide[data-index='${next+2}']`) || document.querySelector(`.slick-slide[data-index='${(next+2)%next}']`)
    // }else{
    //   let firstNode = document.querySelector(`.slick-slide[data-index='${next-1}']`) || document.querySelector(`.slick-slide[data-index='${(next-1)%next}']`)
    //   let secondNode = document.querySelector(`.slick-slide[data-index='${next-2}']`) || document.querySelector(`.slick-slide[data-index='${(next-2)%next}']`)
    //   let thirdNode = document.querySelector(`.slick-slide[data-index='${next-3}']`) || document.querySelector(`.slick-slide[data-index='${(next-3)%next}']`)
    // }
    // debugger;


    setTimeout(()=>Array.from(allNde).map( node => removeClass(node, "prev|next")),0)
    setTimeout(()=>addClass(prevNode, diff > 0 ? "next" : "prev"),0)
    setTimeout(()=>Array.from(allNde).map( node => removeClass(node, "prev|next")),1000)
  }
  

  componentDidMount() {   
    document.title = title
  }




 get leftArrow() {
    return React.createElement(Button, {type: 'fab', primary: true}, <i className="material-icons ">chevron_left</i>);
}



 get rigthArrow() {
       return React.createElement(Button, {type: 'fab', primary: true}, <i className="material-icons ">chevron_right</i>);
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
      },
      cartId: '-KPs0qRtYWworeGt1WD-'
    }
    const sliderConfig = {
      dots: false,
      lazyLoad: false,
      fade: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      centerMode: false,
      swipe: false,
      nextArrow: this.rigthArrow,
      prevArrow: this.leftArrow,
      beforeChange: this.animateOut,
      speed: 500 
    }
  
    return (
      <Layout className={"quiz-container"}>

        <div className="quiz">
          {
            (this.state.quiz)
              ?
              <SS {...sliderConfig} >{
                this.shuffle(Object.keys(this.state.quiz)).map((q, index) => {
                  window.that = this;
                  return <div data-index={index} key={index}><Cart key={q}  quiz={{
                    question: this.state.quiz[q]['question'],
                    q1: Object.values(this.state.quiz[q]['answers'])[0],
                    q2: Object.values(this.state.quiz[q]['answers'])[1],
                    cartId: q,
                    leftCartUID: Object.entries(that.state.quiz[q]['answers'])[0][0],
                    rightCartUID: Object.entries(that.state.quiz[q]['answers'])[1][0]
                  }} /></div>
                })
              }</SS>
              :
              <div className="preloading__cart">
                <img src={'./img/preview.png'}/>
                  <span>downloading...</span>
              </div> 
            
          }

        </div>

      </Layout>
    );
  }

}

export default HomePage;
