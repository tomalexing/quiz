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

class HomePage extends React.Component {

  static propTypes = {
    articles: PropTypes.array,
  };
	

	constructor(props){
		super(props);

	}

  componentDidMount() {
    document.title = title; 	
  }
 


  render() {
		var quiz = {
					'question': "faadfafa",
					'q1': {
							quantity:  0,
							srcImg: 	 "img/1.jpg",
							value:   "asdasd"
				  	},
					'q2': {
							quantity:  0,
							srcImg: 	 "img/2.png",
							value:   "asdasd"
				  	}
		}
		
    return (
      <Layout className={"quiz-container"}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <h4>Articles YoTO</h4> 
        <p>
          <br /><br />
        </p> 
        
        <div className="quiz">
					<Cart quiz={quiz} />
				</div>

        
        <Button ref={(left) => { this.left = left; }} className="leftleft" type={'fab'} primary={true}> <i className="material-icons ">chevron_left</i></Button>
				<Button type={'fab'} primary={true} > <i className="material-icons">chevron_right</i></Button>
      </Layout>
    );
  }

}

export default HomePage;
