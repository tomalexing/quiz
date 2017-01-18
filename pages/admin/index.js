import React , { PropTypes } from "react"
import Layout from "./../../components/Layout"
import {title, html } from "./index.md"

export default class Admin extends React.Component{

    static propTypes = {
        active: PropTypes.string,
    } 
    componentDidMount() {
        document.title = title;
     
    }

    render(){
        return ( 
        <Layout  >
            <h1>{title}</h1>
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </Layout>
        );
    }
}  