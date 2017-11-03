import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory'
import { withRouter } from 'react-router'

import Home from './home';
import User from './user';
import Login from './login';
import NoMatch from './404';

const customHistory = createBrowserHistory();

export default class TestRoute extends Component{
    render(){
        return(
            <Router history={customHistory}>
                <Switch>
                    <Route path="/" exact component={Home}/>
                    <Route path="/user/:name" component={User}/>
                    <Route path="/login" component={Login}/>
                    <Route component={NoMatch}/>
                </Switch>
            </Router>
        )
    }
}