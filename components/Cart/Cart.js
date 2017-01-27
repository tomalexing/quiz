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
            cartIsChoosedRight: false || alreadyChecked.right,
            release: true
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
             var _self = this;
           
            (cart === _self.clickInputLeft) ?  removeClass(_self.leftNode, 'blackout') : removeClass(_self.rightNode, 'blackout')

            var persHtml = cart.querySelector('.quiz-cart__questions__inner-score__pers')
            var pers = cart.querySelector('.quiz-cart__questions__inner-score__pers').innerText
            var valHtml = cart.querySelector('.quiz-cart__questions__inner-score__number')
            var val = cart.querySelector('.quiz-cart__questions__inner-score__number').innerText

            var persValue = pers.slice(0, pers.indexOf('.') > 0 ? pers.indexOf('.') : pers.lenght)
            persValue = +persValue / step

            var numVal = +val / step

            this.asyncLoop({
                length: step,
                functionToLoop: function (loop, i) {
                    setTimeout(function () {
                        (i != step - 1) ? progress.setAttribute("style", `width: ${persValue * i}%;`) : progress.setAttribute("style", `width: ${~~pers}%;`);
                        (i != step - 1) ? persHtml.innerText = ~~(persValue * i) : persHtml.innerText = Math.round(pers);
                        (i != step - 1) ? valHtml.innerText = ~~(numVal * i) : valHtml.innerText = val;
                        loop();
                    }, 10);
                },
                callback: function () {  // animate another cart

                    (cart === _self.clickInputLeft) ? removeClass(_self.rightNode, 'blackout') : removeClass(_self.leftNode, 'blackout')

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
                                (i != step - 1) ? anotherPersHtml.innerText = ~~(anotherPersValue * i) : anotherPersHtml.innerText = Math.round(anotherPers);
                                (i != step - 1) ? anotherValHtml.innerText = ~~(anotherNumVal * i) : anotherValHtml.innerText = anotherVal;
                                loop();
                            }, 10);
                        },
                        callback: function () {
                            _self.setState({release: true})
                        }
                    });
                }
            });
        }).bind(this), 1000);

    }
    pickCart1(e) {
        
        if (!this.state.cartIsChoosedLeft) {
         
            this.setState({
                quantity1: this.state.quantity1 + 1,
                quantity2: (this.state.cartIsChoosedRight) ? this.state.quantity2 - 1 : this.state.quantity2,
                cartIsChoosedLeft: true,
                cartIsChoosedRight: false,
                release: false
            })

            this._vote(this.pathToCarts, this.leftCartUID, 'inc')
            if (this.state.cartIsChoosedRight) {
                this._vote(this.pathToCarts, this.rightCartUID, 'dec')
            }
            this.pickCart(e);



        }

    }
    pickCart2(e) {


        if (!this.state.cartIsChoosedRight) {
            this.pickCart(e);
            this.setState({
                quantity2: this.state.quantity2 + 1,
                quantity1: (this.state.cartIsChoosedLeft) ? this.state.quantity1 - 1 : this.state.quantity1,
                cartIsChoosedLeft: false,
                cartIsChoosedRight: true,
                release: false
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


    componentDidMount() {
        window.componentHandler.upgradeElement(this.share);
        if (! this.share.showModal) {
        dialogPolyfill.registerDialog(this.share);
        }
        this.openShare.addEventListener('click', () => this.share.showModal());
        this.share.querySelector('.close').addEventListener('click', () => this.share.close());
    }

    componentWillUnmount() {
        window.componentHandler.downgradeElements(this.share);
    }



    render() {
        var {question, q1, q2, } = this.props.quiz

        var per1 =  Math.floor(this.state.quantity1 * 100 / (this.state.quantity1 + this.state.quantity2))
        var per2 =  100 - per1


        let leftCartClasses = cx('quiz-cart__questions-in', { animate: this.state.activeLeft })
        let rightCartClasses = cx('quiz-cart__questions-in ', { animate: this.state.activeRight })

        cookie.save(`cartIsChoosed-${this.props.quiz.cartId}`, this.state.cartIsChoosedLeft ? `Left` :
            this.state.cartIsChoosedRight ? `Right` : '', { path: '/' })


        return (<div className="quiz-cart ">
            <div className="quiz-cart__title ">
                {question}
            </div>
            <div className="quiz-cart__questions ">
                <div  className={`quiz-cart__questions-left ${leftCartClasses}`} onTouchStart={this.pickCart1} onClick={this.pickCart1} ref={input => this.clickInputLeft = input}>
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
                <div className={`quiz-cart__questions-right ${rightCartClasses}`} onTouchStart={this.pickCart2} onClick={this.pickCart2} ref={input => this.clickInputRight = input}>
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
                                <path d="M20.000288,1.90486869 C19.2653387,2.23040181 18.4748376,2.44760906 17.6410062,2.55037975 C18.4887255,2.04708111 19.1409028,1.24435867 19.4469928,0.296090701 C18.6537142,0.76105865 17.7748858,1.10270177 16.8399503,1.28268936 C16.0933351,0.49107726 15.0284085,0 13.8484898,0 C11.5819794,0 9.74488382,1.82098559 9.74488382,4.06638636 C9.74488382,4.38414224 9.78210347,4.69356535 9.85209865,4.99410019 C6.44233369,4.82300087 3.41809772,3.2020015 1.39490385,0.742171063 C1.0393728,1.34324074 0.839386584,2.04708111 0.839386584,2.78980769 C0.839386584,4.20137706 1.56211454,5.44406917 2.66426079,6.17624092 C1.99152939,6.15568678 1.35823971,5.96847747 0.803833479,5.66849815 L0.803833479,5.71627263 C0.803833479,7.68891443 2.21873595,9.33157897 4.09416222,9.70544209 C3.75140807,9.79932451 3.38921082,9.85154313 3.01590322,9.85154313 C2.75092148,9.85154313 2.49260596,9.8215452 2.24262319,9.7765483 C2.76480942,11.3886594 4.27970499,12.5669115 6.07458126,12.6019091 C4.67023363,13.6907229 2.90146666,14.3429002 0.978265899,14.3429002 C0.646066576,14.3429002 0.321088978,14.3240126 0,14.2851264 C1.81709697,15.4356027 3.97472601,16.1100006 6.29067748,16.1100006 C13.8373795,16.1100006 17.9659838,9.91265003 17.9659838,4.53635396 C17.9659838,4.36025499 17.9604286,4.18471154 17.9520959,4.01139015 C18.7575959,3.44254048 19.4519925,2.72481217 20.000288,1.90486869" stroke="none" fill="#FFFFFF" fillRule="evenodd"></path>
                            </svg>
                            Twitter
                         </a>
                    </li>
                    <li className="quiz-social__btn quiz-social__btn-all">
                      <buttom className="share__dialog" ref={node => (this.openShare = node)}>
                            
                            <svg width="19px" height="20px" viewBox="28 11 19 20" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                <g  stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" transform="translate(37.700000, 21.000000) scale(-1, 1) translate(-37.700000, -21.000000) translate(29.700000, 12.000000)">
                                    <path d="M11.5714286,3.21428571 L3.85714286,7.71428571" id="Line" stroke="#FFF" strokeWidth="2" strokeLinecap="square"></path>
                                    <path d="M3.85714286,10.2857143 L11.5714286,14.7857143" id="Line" stroke="#FFF" strokeWidth="2" strokeLinecap="square"></path>
                                    <ellipse  stroke="#FFF" strokeWidth="2" cx="13.5" cy="16.0714286" rx="1.92857143" ry="1.92857143"></ellipse>
                                    <circle  stroke="#FFF" strokeWidth="2" cx="1.92857143" cy="9" r="1.92857143"></circle>
                                    <ellipse  stroke="#FFF" strokeWidth="2" cx="13.5" cy="1.92857143" rx="1.92857143" ry="1.92857143"></ellipse>
                                </g>
                            </svg>
                            Share
                        </buttom>
                    </li>
                </ul>
            </div>
            <dialog id="share" className="mdl-dialog"  ref={node => (this.share = node)}>
                  <h4 className="mdl-dialog__title">Share</h4>
                  <div className="mdl-dialog__content">
                    <div className="quiz-dialog__cart__social">
                        <ul className="quiz-dialog__cart__social-in">
                            <li className="quiz-dialog__social__btn ">
                                <a target="_blank" href={"https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(this.url) + ";src=sdkpreparse"}>

                                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1"  x="0px" y="0px" viewBox="0 0 474.294 474.294"  style={{enableBackground: 'new 0 0 474.294 474.294'}} >
                                        <circle xmlns="http://www.w3.org/2000/svg" style={{fill: '#3A5A98'}} cx="237.111" cy="236.966" r="236.966"/>
                                        <path style={{fill: '#345387'}} d="M404.742,69.754c92.541,92.541,92.545,242.586-0.004,335.134  c-92.545,92.541-242.593,92.541-335.134,0L404.742,69.754z"/>
                                        <path style={{fill: '#2E4D72'}} d="M472.543,263.656L301.129,92.238l-88.998,88.998l5.302,5.302l-50.671,50.667l41.474,41.474  l-5.455,5.452l44.901,44.901l-51.764,51.764l88.429,88.429C384.065,449.045,461.037,366.255,472.543,263.656z"/>
                                        <path style={{fill: '#FFFFFF'}} d="M195.682,148.937c0,7.27,0,39.741,0,39.741h-29.115v48.598h29.115v144.402h59.808V237.276h40.134  c0,0,3.76-23.307,5.579-48.781c-5.224,0-45.485,0-45.485,0s0-28.276,0-33.231c0-4.962,6.518-11.641,12.965-11.641  c6.436,0,20.015,0,32.587,0c0-6.623,0-29.481,0-50.592c-16.786,0-35.883,0-44.306,0C194.201,93.028,195.682,141.671,195.682,148.937  z"/>
                                    </svg>
                                    
                                </a>
                            </li>
                            <li className="quiz-dialog__social__btn">
                                <a target="_blank" href={"https://twitter.com/intent/tweet?text=" + encodeURIComponent(this.url)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1"  x="0px" y="0px" viewBox="0 0 474.006 474.006"  style={{enableBackground: 'new  0 0 474.006 474.006'}} >
                                        <circle  style={{fill: '#13B3CA'}} cx="237.003" cy="237.003" r="237.003"/>
                                        <path  style={{fill: '#10ABB6'}} d="M404.567,69.421c92.545,92.541,92.552,242.59-0.004,335.142  c-92.545,92.549-242.601,92.549-335.142,0.007L404.567,69.421z"/>
                                        <path  style={{fill: '#0EA2A4'}} d="M471.821,268.565l-64.048-64.048l-5.28,5.276l-80.684-80.68l-4.183,4.18l-9.684-9.684l-11.831,11.831  l-9.586-9.583l-15.42,15.416l18.817,18.814l-72.257,72.265l-70.42-70.412l-15.416,15.412l20.295,20.292l-14.282,14.279l23.3,23.3  l-10.271,10.271l28.385,28.389l-4.632,4.636l26.054,26.058l-30.604,30.608l-22.799-22.795l-22.02,22.02l-27.322-27.326l-5.493,5.497  l160.787,160.787C365.993,465.726,457.071,379.242,471.821,268.565z"/>
                                        <path  style={{fill: '#FFFFFF'}} d="M370.487,226.792c18.941-1.56,31.783-10.174,36.729-21.856c-6.836,4.198-28.044,8.774-39.756,4.412  c-0.572-2.746-1.212-5.366-1.841-7.719c-8.924-32.774-39.479-59.168-71.494-55.984c2.589-1.044,5.224-2.021,7.839-2.892  c3.521-1.265,24.198-4.632,20.946-11.929c-2.746-6.417-28.007,4.853-32.763,6.327c6.279-2.361,16.662-6.425,17.77-13.639  c-9.62,1.317-19.061,5.867-26.353,12.483c2.63-2.84,4.629-6.294,5.055-10.013c-25.665,16.389-40.654,49.432-52.778,81.488  c-9.523-9.227-17.964-16.497-25.541-20.531c-21.242-11.397-46.641-23.285-86.513-38.084c-1.224,13.19,6.522,30.735,28.845,42.398  c-4.838-0.647-13.672,0.801-20.756,2.492c2.885,15.113,12.288,27.562,37.773,33.586c-11.644,0.767-17.661,3.416-23.113,9.126  c5.295,10.511,18.237,22.881,41.504,20.34c-25.867,11.15-10.541,31.812,10.514,28.729c-35.921,37.103-92.556,34.379-125.076,3.349  c84.908,115.699,269.485,68.422,296.98-43.019c20.61,0.172,32.725-7.139,40.235-15.199  C396.817,232.674,379.609,230.593,370.487,226.792z"/>
                                    </svg>
                                </a>
                            </li>
                            <li className="quiz-dialog__social__btn ">
                                <a target="_blank" href={"https://plus.google.com/share?url=" + encodeURIComponent(this.url)}>
                                   <svg xmlns="http://www.w3.org/2000/svg"  version="1.1"  x="0px" y="0px" viewBox="0 0 473.939 473.939" style={{enableBackground: 'new 0 0 473.939 473.939'}} >
                                    <circle style={{fill: '#BC2B2A'}}  cx="236.969" cy="236.967" r="236.967"/>
                                    <path style={{fill: '#BC2B2A'}}  d="M404.527,69.384c92.542,92.542,92.546,242.588-0.004,335.137  c-92.546,92.542-242.595,92.542-335.137,0L404.527,69.384z"/>
                                    <path style={{fill: '#A52728'}} d="M471.95,267.16L336.396,131.606l-28.06,28.06l-29.938-29.938l-38.013,6.93l-13.122,5.545  l-42.379-8.037l-38.043,23.697l-7.296,72.067l59.244,59.244l-36.355,7.76l-34.926,16.838l-9.167,55.85l103.808,103.812  c4.905,0.299,9.83,0.505,14.806,0.505C357.59,473.935,457.102,383.769,471.95,267.16z"/>
                                        <path style={{fill: '#FFFFFF'}} d="M235.648,141.99c2.193,1.355,4.636,3.33,7.36,5.931c2.615,2.713,5.171,6.05,7.682,9.991   c2.402,3.734,4.531,8.127,6.391,13.212c1.523,5.078,2.286,11.012,2.286,17.788c-0.198,12.423-2.945,22.357-8.232,29.818   c-2.574,3.611-5.321,6.941-8.217,9.998c-3.207,3.035-6.619,6.151-10.23,9.31c-2.08,2.144-3.981,4.569-5.744,7.285   c-2.065,2.821-3.102,6.092-3.102,9.815c0,3.641,1.059,6.623,3.188,8.988c1.792,2.26,3.555,4.239,5.253,5.934l11.783,9.654   c7.315,6.002,13.736,12.572,19.255,19.805c5.197,7.353,7.899,16.947,8.131,28.797c0,16.827-7.439,31.727-22.301,44.729   c-15.394,13.448-37.639,20.382-66.694,20.827c-24.325-0.221-42.484-5.407-54.484-15.536c-12.093-9.478-18.159-20.801-18.159-33.99   c0-6.417,1.961-13.594,5.92-21.482c3.809-7.876,10.728-14.817,20.752-20.793c11.237-6.413,23.053-10.702,35.438-12.853   c12.258-1.792,22.432-2.818,30.54-3.035c-2.507-3.3-4.741-6.818-6.698-10.559c-2.286-3.637-3.42-8.019-3.42-13.111   c0-3.065,0.43-5.635,1.302-7.667c0.76-2.17,1.474-4.135,2.118-5.964c-3.944,0.445-7.667,0.681-11.147,0.681   c-18.492-0.236-32.583-6.05-42.278-17.448c-10.159-10.63-15.233-22.993-15.233-37.1c0-17.059,7.184-32.52,21.571-46.413   c9.871-8.127,20.127-13.418,30.765-15.925c10.537-2.144,20.411-3.214,29.616-3.214h69.451l-21.444,12.524h-21.422V141.99z    M249.055,341.883c0-8.819-2.874-16.486-8.61-23.034c-6.092-6.208-15.596-13.826-28.535-22.874   c-2.223-0.236-4.819-0.341-7.798-0.341c-1.77-0.217-6.305,0-13.598,0.677c-7.188,1.018-14.548,2.657-22.065,4.917   c-1.774,0.674-4.251,1.695-7.457,3.046c-3.203,1.471-6.466,3.566-9.789,6.271c-3.207,2.821-5.92,6.32-8.12,10.511   c-2.556,4.408-3.809,9.714-3.809,15.918c0,12.206,5.512,22.26,16.565,30.17c10.514,7.899,24.879,11.962,43.132,12.198   c16.363-0.236,28.86-3.843,37.474-10.844C244.853,361.595,249.055,352.738,249.055,341.883z M200.648,240.092   c9.141-0.337,16.759-3.63,22.847-9.856c2.945-4.412,4.831-8.939,5.669-13.579c0.505-4.64,0.763-8.535,0.763-11.716   c0-13.68-3.506-27.502-10.507-41.403c-3.289-6.668-7.615-12.112-12.977-16.295c-5.474-3.944-11.768-6.047-18.877-6.275   c-9.414,0.228-17.227,4.019-23.472,11.379c-5.261,7.689-7.779,16.292-7.543,25.8c0,12.554,3.667,25.613,11.016,39.203   c3.562,6.335,8.146,11.708,13.788,16.123C186.979,237.892,193.404,240.092,200.648,240.092z"/>
                                        <polygon style={{fill: '#FFFFFF'}} points="372.59,167.4 336.157,167.4 336.157,130.948 318.499,130.948 318.499,167.4 282.065,167.4    282.065,185.05 318.499,185.05 318.499,221.488 336.157,221.488 336.157,185.05 372.59,185.05  "/>

                                    </svg>
                                    
                                </a>
                            </li>
                            <li className="quiz-dialog__social__btn ">
                                <a target="_blank" href={"https://www.linkedin.com/shareArticle?mini=true&title=Quizion&summary=Discover%20answers%20to%20the%20most%20provocative%20question.%20Settle%20the%20old%20dispute.%20Express%20your%20opinion%20and%20share%20it%20with%20your%20friends&url=" + encodeURIComponent(this.url)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 473.931 473.931" style={{enableBackground: 'new 0 0 473.931 473.931'}} >
                                        <circle style={{fill: '#4A86C5'}} cx="236.966" cy="236.966" r="236.966"/>
                                        <path style={{fill: '#3D80B2'}} d="M404.518,69.383c92.541,92.549,92.549,242.59,0,335.138c-92.541,92.541-242.593,92.541-335.134,0  L404.518,69.383z"/>
                                        <path style={{fill: '#4A86C5'}} d="M462.646,309.275c0.868-2.713,1.658-5.456,2.432-8.206  C464.307,303.823,463.496,306.562,462.646,309.275z"/>
                                        <g>
                                            <polygon style={{fill: '#377CA5'}} points="465.097,301.017 465.097,301.017 465.082,301.07  "/>
                                            <path style={{fill: '#377CA5'}} d="M465.097,301.017L336.721,172.641l-29.204,29.204l-20.303-20.303l-16.946,16.946L171.032,99.25   l-6.155-2.346l-38.08,38.08l45.968,45.964l-44.998,44.995l43.943,43.943l-48.048,48.052L276.475,470.59   c87.984-14.78,159.5-77.993,186.175-161.311c0.849-2.716,1.658-5.452,2.432-8.206C465.082,301.055,465.09,301.032,465.097,301.017z   "/>
                                        </g>
                                        <path style={{fill: '#FFFFFF'}} d="M358.565,230.459v87.883h-50.944v-81.997c0-20.595-7.375-34.656-25.811-34.656  c-14.084,0-22.458,9.474-26.147,18.634c-1.343,3.278-1.688,7.835-1.688,12.423v85.593H203.02c0,0,0.681-138.875,0-153.259h50.952  V186.8c-0.094,0.161-0.236,0.34-0.329,0.498h0.329V186.8c6.769-10.425,18.862-25.324,45.923-25.324  C333.432,161.479,358.565,183.384,358.565,230.459z M149.7,91.198c-17.429,0-28.838,11.439-28.838,26.473  c0,14.716,11.072,26.495,28.164,26.495h0.344c17.766,0,28.823-11.779,28.823-26.495C177.857,102.636,167.137,91.198,149.7,91.198z   M123.886,318.341h50.944V165.083h-50.944V318.341z"/>
                                    </svg>
                                    
                                </a>
                            </li>
                            <li className="quiz-dialog__social__btn ">
                                <a target="_blank" href={"https://pinterest.com/pin/create/button/?url=http%3A//quiz.iondigi.com/Facebook.jpg&media=http%3A//quiz.iondigi.com/Facebook.jpg&description=Discover%20answers%20to%20the%20most%20provocative%20question.%20Settle%20the%20old%20dispute.%20Express%20your%20opinion%20and%20share%20it%20with%20your%20friends"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 473.931 473.931"  style={{enableBackground: 'new 0 0 473.931 473.931'}}  >
                                        <circle style={{fill: '#D42028'}}  cx="236.966" cy="236.966" r="236.966"/>
                                        <path style={{fill: '#C52232'}} d="M404.518,69.383c92.545,92.541,92.549,242.586,0,335.135  c-92.545,92.549-242.593,92.549-335.134,0.004L404.518,69.383z"/>
                                        <path style={{fill: '#B21F2F'}} d="M471.54,270.32l-123.28-123.28l-32.43,32.43l-42.405-42.405l-13.096,13.096l-28.688-28.688  l-99.905,99.905l28.688,28.688l-35.55,35.547l42.409,42.405l-7.484,7.484l23.072,23.075l-20.58,20.583l93.933,93.929  C366.977,464.165,456.203,379.145,471.54,270.32z"/>
                                        <path style={{fill: '#FFFFFF'}} d="M173.427,123.059c-35.622,14.11-59.816,41.29-66.577,77.903c-4.15,22.499-2.574,47.023,7.353,68.029  c2.215,4.666,4.868,9.164,8.026,13.321c1.53,2.028,3.173,3.966,4.954,5.807c3.162-1.13,6.211-2.537,9.122-4.183  c12.041-6.795,20.924-17.268,31.236-26.065c-34.469-39.932,2.058-89.409,47.749-100.44c42.536-10.252,100.186,7.442,113.087,51.21  c5.336,18.125,1.841,38.162-12.939,51.285c-7.727,6.87-17.541,11.409-27.914,13.257c-6.058,1.074-12.277,1.242-18.402,0.644  c-3.413-0.344-6.803-0.921-10.144-1.706c-5.658-1.332-10.69-1.137-10.69-7.24c0-15.944,0-31.895,0-47.85c0-7.966,0-15.947,0-23.929  c0-4.89,0.479-3.97-3.577-4.471c-3.203-0.393-6.398-0.703-9.605-0.958c-11.285-0.883-23.083-1.489-34.275,0.438  c-4.187,0.722-4.453,0.049-4.453,4.591c0,3.678,0,7.356,0,11.023c0,8.943,0,17.882,0,26.825c0,26.724,2.013,53.762,0.909,80.444  c-0.322,7.951-0.543,27.034-9.44,30.971c-10.312,4.561-19.431-5.085-28.946-7.094c1.31,13.396-7.072,39.932,8.542,46.693  c14.316,6.196,30.791,8.505,45.881,3.386c31.622-10.724,41.848-45.915,37.84-74.831c48.811,14.585,101.495-9.815,122.367-53.889  c14.866-31.386,8.587-70.368-13.792-97.054C317.821,109.173,232.745,99.587,173.427,123.059z"/>
                                    </svg>
                                    
                                </a>
                            </li>
                            <li className="quiz-dialog__social__btn ">
                                <a href={`mailto:${this.url}?`} >
                                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512" style={{enableBackground: 'new 0 0 512 512'}}  >
                                        <g>
                                            <polygon style={{fill: '#F2F2F2'}}  points="484.973,122.808 452.288,451.017 59.712,451.017 33.379,129.16 256,253.802  "/>
                                            <polygon style={{fill: '#F2F2F2'}}  points="473.886,60.983 256,265.659 38.114,60.983 256,60.983  "/>
                                        </g>
                                        <path style={{fill: '#F14336'}}  d="M59.712,155.493v295.524H24.139C10.812,451.017,0,440.206,0,426.878V111.967l39,1.063L59.712,155.493  z"/>
                                        <path style={{fill: '#D32E2A'}}  d="M512,111.967v314.912c0,13.327-10.812,24.139-24.152,24.139h-35.56V155.493l19.692-46.525  L512,111.967z"/>
                                        <path style={{fill: '#F14336'}}  d="M512,85.122v26.845l-59.712,43.526L256,298.561L59.712,155.493L0,111.967V85.122  c0-13.327,10.812-24.139,24.139-24.139h13.975L256,219.792L473.886,60.983h13.962C501.188,60.983,512,71.794,512,85.122z"/>
                                        <polygon style={{fill: '#D32E2A'}}  points="59.712,155.493 0,146.235 0,111.967 "/>
                                    </svg>
                                    
                                </a>
                            </li>
                        </ul>
                    </div>
                  </div>
                  <div className="mdl-dialog__actions">
                    <button type="button" className="mdl-button close">Close</button>
                  </div>
            </dialog>
        </div>
        )
    }

}

export default Cart;
