import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default class User extends Component{
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    componentWillMount(){ 
        console.log(this.props.match.params.name);
    }
    handleClick(){
        this.props.history.push('/login');
        localStorage.removeItem("mspa_user");
    }
    render(){
        return(
            <div>Hello, { this.props.match.params.name } <span onClick={this.handleClick}>退出</span></div>
        )
    }
}