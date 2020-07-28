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
import User from "./layouts/BlankTemplate/User";
import Login from "./views/Login";
import OnlineSupport from "./views/OnlineSupport";
import Home from "./views/Home";
import ChatModule from "./views/ChatModule";
import DataProcessing from "./views/DataProcessing";
import Amplify, { Auth } from 'aws-amplify';
import config from './config';

Amplify.configure({
	Auth: {

		// REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
		identityPoolId: config.identityPool,

		// REQUIRED - Amazon Cognito Region
		region: config.region,

		// OPTIONAL - Amazon Cognito Federated Identity Pool Region
		// Required only if it's different from Amazon Cognito Region
		//identityPoolRegion: 'XX-XXXX-X',

		// OPTIONAL - Amazon Cognito User Pool ID
		userPoolId: config.userPool,

		// OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
		userPoolWebClientId: config.clientId,

		// OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
		//mandatorySignIn: false,

		/*
		// OPTIONAL - Configuration for cookie storage
		// Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
		cookieStorage: {
				// REQUIRED - Cookie domain (only required if cookieStorage is provided)
				domain: '.yourdomain.com',
				// OPTIONAL - Cookie path
				path: '/',
				// OPTIONAL - Cookie expiration in days
				expires: 365,
				// OPTIONAL - Cookie secure flag
				// Either true or false, indicating if the cookie transmission requires a secure protocol (https).
				secure: true
		},

		// OPTIONAL - customized storage object
		storage: "MyStorage",

		// OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
		authenticationFlowType: 'USER_PASSWORD_AUTH',

		// OPTIONAL - Manually set key value pairs that can be passed to Cognito Lambda Triggers
		clientMetadata: { myCustomKey: 'myCustomValue' },

		// OPTIONAL - Hosted UI configuration
		oauth: {
				domain: 'your_cognito_domain',
				scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
				redirectSignIn: 'http://localhost:3000/',
				redirectSignOut: 'http://localhost:3000/',
				responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
		}
		*/
	},
	Storage: {
		AWSS3: {
			bucket: config.bucketName, //REQUIRED -  Amazon S3 bucket
			region: config.region, //OPTIONAL -  Amazon service region
		}
	}
});

// You can get the current config object
const currentConfig = Auth.configure();


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
