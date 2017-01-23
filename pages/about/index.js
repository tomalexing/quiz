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
import Layout from '../../components/Layout';
import { title, html } from './index.md';
import Slider from 'react-slick'


class AboutPage extends React.Component {

  componentDidMount() {
    document.title = title;
  }

  render() {
    
    const settings = {
      dots: true,
      fade: true,
      lazyLoad: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      initialSlide: 2
    };
    return (
      <Layout className={"quiz-container"}>
        <h1>{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <div>
          <h2>Fade</h2>
          <Slider {...settings}>
            <div><img src={'img/1.jpg'} /></div>
            <div><img src={'img/7.jpg'} /></div>
            <div><img src={'img/3.jpg'} /></div>
            <div><img src={'img/4.jpg'} /></div>
          </Slider>
        </div>
      </Layout>
    );
  }

}

export default AboutPage;
