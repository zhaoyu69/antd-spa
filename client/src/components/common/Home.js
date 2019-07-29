import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {setCookie} from "../../helpers/cookies";

export default class Home extends Component{
    render(){
        return(
            setCookie("mspa_user")===null?
            <Redirect to="/login"/>:
            <Redirect to="/app"/>
        )
    }
}