import React, { PropTypes } from 'react';
import Button from '../../components/Button';
import cx from 'classnames';
import cookie from 'react-cookie';
import firebase from "firebase";
import store from "./../../core/store"
import { addClass, removeClass } from "./../../core/helper"

class Cart extends React.Component {

    constructor(props) {
        super(props);
        this.pickCart = this.pickCart.bind(this);
        this.pickCart1 = this.pickCart1.bind(this);
        this.pickCart2 = this.pickCart2.bind(this);
        this.url = window.location.href
        this.pathToCarts = firebase.database().ref(`quiz/${this.props.quiz.cartId}/answers`)
        this.dbRef = firebase.database().ref()
        let alreadyChecked = this._checkCookie()
        this.leftCartUID = this.props.quiz.leftCartUID
        this.rightCartUID = this.props.quiz.rightCartUID

        this.state = {
            activeLeft: false,
            activeRight: false,
            quantity1: 0,
            quantity2: 0,
            cartIsChoosedLeft: false || alreadyChecked.left,
            cartIsChoosedRight: false || alreadyChecked.right
        };

    }

    _vote(postRef, uid, inc) {
        postRef.transaction(function (post) {
            if (post && post[uid] && inc === "inc") {
                post[uid]['quantity']++;
            }
            if (post && post[uid] && inc === "dec") {
                post[uid]['quantity']--;
            }
            return post;
        });
    }

    _checkCookie() {
        let cObj = cookie.select(new RegExp(`cartIsChoosed-${this.props.quiz.cartId}`))
        if (Object.values(cObj).length > 0 && Object.values(cObj)[0] != "") {
            let val = Object.values(cObj)[0]
            return {
                left: val.trim() == "Left",
                right: val.trim() == "Right"
            }
        }
        return {
            left: false,
            right: false
        }
    }


    asyncLoop(o) {
        var i = -1;

        var loop = function () {
            i++;
            if (i == o.length) { o.callback(); return; }
            o.functionToLoop(loop, i);
        }
        loop();//init
    }

    pickCart(event) {
        let d, x, y
        let cart = event.currentTarget
        let {height, width, left, top} = cart.getBoundingClientRect()
        var ink = cart.querySelector('.ink')
        var percentage = cart.querySelector('.quiz-cart__questions__inner-score__pers')

        var progress = cart.querySelector('.progress');

        var step = 50
        var  anotherCart = (cart === this.clickInputLeft) ? this.clickInputRight : this.clickInputLeft

        addClass(this.rightNode, 'blackout')
        addClass(this.leftNode, 'blackout')

        if (!ink.style.height && !ink.style.width) {
            d = Math.max(height, width)
            ink.setAttribute("style", `height: ${d}px; width: ${d}px`);
        }
        x = event.pageX - left - width / 2
        y = event.pageY - top - height / 2
        d = Math.max(height, width)

        if (!ink.style.height && !ink.style.width) {
            ink.setAttribute("style", `height: ${d}px; width: ${d}px`);
        } else {
            ink.setAttribute("style", `height: ${d}px; width: ${d}px; left: ${x}px; top: ${y}px`);
        }

        addClass(ink, "animated")
        
        setTimeout((() => {   // animate  cart
            removeClass(ink, "animated");
            removeClass(this.rightNode, 'blackout') 
            removeClass(this.leftNode, 'blackout')


            var persHtml = cart.querySelector('.quiz-cart__questions__inner-score__pers')
            var pers = cart.querySelector('.quiz-cart__questions__inner-score__pers').innerText
            var valHtml = cart.querySelector('.quiz-cart__questions__inner-score__number')
            var val = cart.querySelector('.quiz-cart__questions__inner-score__number').innerText

            var persValue = pers.slice(0, pers.indexOf('.') > 0 ? pers.indexOf('.') : pers.lenght)
            persValue = +persValue / step

            var numVal = +val / step
            var _self = this
            this.asyncLoop({
                length: step,
                functionToLoop: function (loop, i) {
                    setTimeout(function () {
                        (i != step - 1) ? progress.setAttribute("style", `width: ${persValue * i}%;`) : progress.setAttribute("style", `width: ${~~pers}%;`);
                        (i != step - 1) ? persHtml.innerText = ~~(persValue * i) : persHtml.innerText = ~~pers;
                        (i != step - 1) ? valHtml.innerText = ~~(numVal * i) : valHtml.innerText = val;
                        loop();
                    }, 10);
                },
                callback: function () {  // animate another cart

        
                    var anotherProgress = anotherCart.querySelector('.progress')
                    var anotherPers = anotherCart.querySelector('.quiz-cart__questions__inner-score__pers').innerText
                    var anotherPersHtml = anotherCart.querySelector('.quiz-cart__questions__inner-score__pers')
                    var anotherValHtml = anotherCart.querySelector('.quiz-cart__questions__inner-score__number')
                    var anotherVal = anotherCart.querySelector('.quiz-cart__questions__inner-score__number').innerText


                    var anotherPersValue = anotherPers.slice(0, anotherPers.indexOf('.') > 0 ? anotherPers.indexOf('.') : anotherPers.lenght)
                    anotherPersValue = +anotherPersValue / step
                    var anotherNumVal = +anotherVal / step

                    _self.asyncLoop({
                        length: step,
                        functionToLoop: function (loop, i) {
                            setTimeout(function () {
                                (i != step - 1) ? anotherProgress.setAttribute("style", `width: ${anotherPersValue * i}%;`) : anotherProgress.setAttribute("style", `width: ${~~anotherPers}%;`);
                                (i != step - 1) ? anotherPersHtml.innerText = ~~(anotherPersValue * i) : anotherPersHtml.innerText = ~~anotherPers;
                                (i != step - 1) ? anotherValHtml.innerText = ~~(anotherNumVal * i) : anotherValHtml.innerText = anotherVal;
                                loop();
                            }, 10);
                        },
                        callback: function () {

                        }
                    });
                }
            });
        }).bind(this), 1000);

    }
    pickCart1(e) {

        if (!this.state.cartIsChoosedLeft) {
            this.pickCart(e);
            this.setState({
                quantity1: this.state.quantity1 + 1,
                quantity2: (this.state.cartIsChoosedRight) ? this.state.quantity2 - 1 : this.state.quantity2,
            })
            this.setState({
                cartIsChoosedLeft: true,
                cartIsChoosedRight: false,
            })

            this._vote(this.pathToCarts, this.leftCartUID, 'inc')
            if (this.state.cartIsChoosedRight) {
                this._vote(this.pathToCarts, this.rightCartUID, 'dec')
            }



        }

    }
    pickCart2(e) {


        if (!this.state.cartIsChoosedRight) {
            this.pickCart(e);
            this.setState({
                quantity2: this.state.quantity2 + 1,
                quantity1: (this.state.cartIsChoosedLeft) ? this.state.quantity1 - 1 : this.state.quantity1,
                cartIsChoosedLeft: false,
                cartIsChoosedRight: true
            })

            this._vote(this.pathToCarts, this.rightCartUID, 'inc')
            if (this.state.cartIsChoosedLeft) {
                this._vote(this.pathToCarts, this.leftCartUID, 'dec')
            }

        }
    }
    componentWillMount() {
        var { q1, q2, } = this.props.quiz
        this.setState({
            quantity1: q1.quantity,
            quantity2: q2.quantity
        })
    }


    render() {
        var {question, q1, q2, } = this.props.quiz

        var per1 = this.state.quantity1 * 100 / (this.state.quantity1 + this.state.quantity2)
        var per2 = this.state.quantity2 * 100 / (this.state.quantity1 + this.state.quantity2)


        let leftCartClasses = cx('quiz-cart__questions-in', { animate: this.state.activeLeft })
        let rightCartClasses = cx('quiz-cart__questions-in ', { animate: this.state.activeRight })

        cookie.save(`cartIsChoosed-${this.props.quiz.cartId}`, this.state.cartIsChoosedLeft ? `Left` :
            this.state.cartIsChoosedRight ? `Right` : '', { path: '/' })


        return (<div className="quiz-cart ">
            <div className="quiz-cart__title ">
                {question}
            </div>
            <div className="quiz-cart__questions ">
                <div  className={`quiz-cart__questions-left ${leftCartClasses}`} onClick={this.pickCart1} ref={input => this.clickInputLeft = input}>
                    <span className='ink'></span>
                    <div className={`quiz-cart__questions__inner ${this.state.cartIsChoosedLeft ? 'is__picked' : this.state.cartIsChoosedRight ? 'is__show' : ''} `}>
                        <div className="quiz-cart__questions__inner-score" ref={node => (this.leftNode = node)}>
                            <div className={`quiz-cart__questions__inner-choosed ${this.state.cartIsChoosedLeft ? 'is__active' : ''}`}>
                                <svg width="30px" height="21px" viewBox="68 132 30 21" version="1.1" xmlns="http://www.w3.org/2000/svg" >
                                    <path d="M69,141 L78,151 L97,133" stroke="#FFFFFF" strokeWidth="2" fill="none"></path>
                                </svg>
                            </div>
                            <div className="quiz-cart__questions__inner-score__number__cover" >
                                <span className="quiz-cart__questions__inner-score__number">{this.state.quantity1}</span>
                                <span className="quiz-cart__questions__inner-score__number__add"> votes</span>
                            </div>
                            <div className="quiz-cart__questions__inner-score__progress" > <div className="progress" style={{ 'width': `${per1}%` }} ></div></div>
                            <div className="quiz-cart__questions__inner-score__pers__cover" ><div className="quiz-cart__questions__inner-score__pers" >{~~per1}</div> <span>%</span></div>
                        </div>
                        <div className='quiz-cart__questions__inner-value'>{q1.value}</div>
                    </div>
                    <img height="240" width="300" src={q1.srcImg} />
                    <div className='quiz-cart__questions__inner-value'>{q1.value}</div>
                </div>
                <div className="quiz-cart__questions-between "> </div>
                <div className={`quiz-cart__questions-right ${rightCartClasses}`} onClick={this.pickCart2} ref={input => this.clickInputRight = input}>
                    <span className='ink'></span>
                    <div className={`quiz-cart__questions__inner ${this.state.cartIsChoosedRight ? 'is__picked' : this.state.cartIsChoosedLeft ? 'is__show' : ''} `}>
                        <div className="quiz-cart__questions__inner-score" ref={node => (this.rightNode = node)}>
                            <div className={`quiz-cart__questions__inner-choosed ${this.state.cartIsChoosedRight ? 'is__active' : ''}`}>
                                <svg width="30px" height="21px" viewBox="68 132 30 21" version="1.1" xmlns="http://www.w3.org/2000/svg" >
                                    <path d="M69,141 L78,151 L97,133" stroke="#FFFFFF" strokeWidth="2" fill="none"></path>
                                </svg>
                            </div>
                            <div className="quiz-cart__questions__inner-score__number__cover" >
                                <span className="quiz-cart__questions__inner-score__number">{this.state.quantity2}</span>
                                <span className="quiz-cart__questions__inner-score__number__add"> votes</span>
                            </div>
                            <div className="quiz-cart__questions__inner-score__progress" > <div className="progress" style={{ 'width': `${per2}%` }} ></div></div>
                            <div className="quiz-cart__questions__inner-score__pers__cover" ><div className="quiz-cart__questions__inner-score__pers" >{~~per2}</div> <span>%</span></div>
                        </div>
                        <div className='quiz-cart__questions__inner-value'>{q2.value}</div>
                    </div>
                    <img height="240" width="300" src={q2.srcImg} />
                    <div className='quiz-cart__questions__inner-value'>{q2.value}</div>
                </div>
            </div>
            <div className="quiz-cart__social">
                <ul className="quiz-cart__social-in">
                    <li className="quiz-social__btn quiz-social__btn-fb">
                        <a target="_blank" href={"https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(this.url) + ";src=sdkpreparse"}>

                            <svg width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.4,0 L3.6,0 C1.61496,0 0,1.61496 0,3.6 L0,14.4 C0,16.38504 1.61496,18 3.6,18 L14.4,18 C16.38504,18 18,16.38504 18,14.4 L18,3.6 C18,1.61496 16.38504,0 14.4,0 L14.4,0 Z M14.04,6.12 L12.96,6.12 C12.1878,6.12 11.88,6.30144 11.88,6.84 L11.88,7.92 L14.04,7.92 L13.68,10.08 L11.88,10.08 L11.88,17.28 L9.36,17.28 L9.36,10.08 L8.28,10.08 L8.28,7.92 L9.36,7.92 L9.36,6.84 C9.36,5.15628 9.92916,3.96 11.88,3.96 C12.92472,3.96 14.04,4.32 14.04,4.32 L14.04,6.12 L14.04,6.12 Z" id="Shape" stroke="none" fill="#FFFFFF" fillRule="evenodd"></path>
                            </svg>
                            Facebook
                        </a>
                    </li>
                    <li className="quiz-social__btn quiz-social__btn-tw">
                        <a target="_blank" href={"https://twitter.com/intent/tweet?text=" + encodeURIComponent(this.url)}>
                            <svg width="21px" height="17px" viewBox="0 0 21 17" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.000288,1.90486869 C19.2653387,2.23040181 18.4748376,2.44760906 17.6410062,2.55037975 C18.4887255,2.04708111 19.1409028,1.24435867 19.4469928,0.296090701 C18.6537142,0.76105865 17.7748858,1.10270177 16.8399503,1.28268936 C16.0933351,0.49107726 15.0284085,0 13.8484898,0 C11.5819794,0 9.74488382,1.82098559 9.74488382,4.06638636 C9.74488382,4.38414224 9.78210347,4.69356535 9.85209865,4.99410019 C6.44233369,4.82300087 3.41809772,3.2020015 1.39490385,0.742171063 C1.0393728,1.34324074 0.839386584,2.04708111 0.839386584,2.78980769 C0.839386584,4.20137706 1.56211454,5.44406917 2.66426079,6.17624092 C1.99152939,6.15568678 1.35823971,5.96847747 0.803833479,5.66849815 L0.803833479,5.71627263 C0.803833479,7.68891443 2.21873595,9.33157897 4.09416222,9.70544209 C3.75140807,9.79932451 3.38921082,9.85154313 3.01590322,9.85154313 C2.75092148,9.85154313 2.49260596,9.8215452 2.24262319,9.7765483 C2.76480942,11.3886594 4.27970499,12.5669115 6.07458126,12.6019091 C4.67023363,13.6907229 2.90146666,14.3429002 0.978265899,14.3429002 C0.646066576,14.3429002 0.321088978,14.3240126 0,14.2851264 C1.81709697,15.4356027 3.97472601,16.1100006 6.29067748,16.1100006 C13.8373795,16.1100006 17.9659838,9.91265003 17.9659838,4.53635396 C17.9659838,4.36025499 17.9604286,4.18471154 17.9520959,4.01139015 C18.7575959,3.44254048 19.4519925,2.72481217 20.000288,1.90486869" id="Shape" stroke="none" fill="#FFFFFF" fillRule="evenodd"></path>
                            </svg>
                            Twitter
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        )
    }

}

export default Cart;
