/*!

=========================================================
* Black Dashboard React v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import AdminLayout from "layouts/Admin/Admin.js";
import RTLLayout from "layouts/RTL/RTL.js";

import "assets/scss/black-dashboard-react.scss";
import "assets/demo/demo.css";
import "assets/css/nucleo-icons.css";
import Register from "./views/Register";
import User from "./layouts/User/User";
import Login from "./views/Login";
import OnlineSupport from "./views/OnlineSupport";
import Home from "./views/Home";
import ChatModule from "./views/ChatModule";
import DataProcessing from "./views/DataProcessing";
import Amplify, { Auth } from 'aws-amplify';
import config from './config';



const hist = createBrowserHistory();


ReactDOM.render(
  <Router history={hist}>
    <Switch>
			<Route path="/register" component={Register}/>
			<Route path="/login" component={Login}/>
			<Route path="/onlinesupport" component={OnlineSupport}/>
			<Route path="/home" component={Home}/>
			<Route path="/chat" component={ChatModule}/>
			<Route path="/dataprocessing" component={DataProcessing}/>
			<Route path="/user" render={props => <User {...props} />}/>
      <Route path="/admin" render={props => <AdminLayout {...props} />} />
      {/*<Route path="/rtl" render={props => <RTLLayout {...props} />} />*/}
      <Redirect from="/" to="/register" />
    </Switch>
  </Router>,
  document.getElementById("root")
);
