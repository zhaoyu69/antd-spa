import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../components/history';

import App from '../components/App';
import Login from '../components/Login';
import Home from  '../components/Home';
import NoMatch from '../components/404';

export default class MRoute extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/app" component={App}/>
          <Route path="/login" component={Login}/>
          <Route component={NoMatch}/>
        </Switch>
      </Router>
    );
  }
}
