import React, { PropTypes } from 'react';
import Button from '../../components/Button';
import cx from 'classnames';

class Cart extends React.Component {

    constructor(props) {
        super(props);
        this.pickCart = this.pickCart.bind(this);
        this.url = window.location.href;
        this.state = {
            activeLeft: false,
            activeRight: false
        };
    }

    classRegex(classname){
        return new RegExp("(^|\\s+)" + classname + "(\\s+|$)");
    }
    hasClass(el, c) {
          return  this.classRegex(c).test( el.className );
    }
    addClass(el, c) {
        if (!this.hasClass(el, c))
        el.className =  el.className + " " + c;
    }
    removeClass(el, c) {
        el.className = el.className.replace(this.classRegex(c), ' ')
    }


	pickCart(event){
        let d, x, y
        let cart =  event.currentTarget
        let {height, width, left, top} = cart.getBoundingClientRect()
        var ink = cart.querySelector('.ink')
        if(!ink.style.height && !ink.style.width){
            d = Math.max(height, width)
            ink.setAttribute("style", `height: ${d}px; width: ${d}px`);
        }
        x = event.pageX - left - width/2
        y = event.pageY - top - height/2
        
        ink.setAttribute("style", `${ink.getAttribute("style")}; left: ${x}px; top: ${y}px`);
        this.addClass(ink, "animated")
        setTimeout( (()=>{this.removeClass(ink, "animated")}).bind(this), 1000);
        
    }

    render() {
        var {question, q1, q2, } = this.props.quiz;
        let leftCartClasses = cx('quiz-cart__questions-in', { animate: this.state.activeLeft });
         let rightCartClasses = cx('quiz-cart__questions-in ', { animate: this.state.activeRight });
        console.log(question);
        return (<div className="quiz-cart ">
            <div className="quiz-cart__title ">
                {question}
            </div>
            <div className="quiz-cart__questions ">
                <div id="quiz-cart__questions-left" className={leftCartClasses}  onClick={this.pickCart} > 
                    <span  className='ink'></span>
                    <img height="240" width="300" src={q1.srcImg} /> 
                </div>
                <div className="quiz-cart__questions-between "> </div>
                <div className="quiz-cart__questions-in "> 
                     <span className='ink'></span>
                    <img height="240" width="300" src={q2.srcImg} /> 
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
