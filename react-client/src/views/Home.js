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
// nodejs library that concatenates classes
// react plugin used to create charts
// reactstrap components
import {Button, Col, Form, Row} from "reactstrap";
import Input from "reactstrap/lib/Input";
import NotificationAlert from "react-notification-alert";
// core components
import "../assets/css/App.css"
import logo from '../assets/img/logo.svg';

const _ = require('lodash');

class Home extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			file: null,
			resp: false,
			keys: [],
			username: 'akashbharti',
			showLoading: false,
			showNotif: false
		}
	}


	render() {
		return (
			<>
				<div className="content">
					<h2>Welcome to DAL LMS</h2>
					{/*<header className="App-header">*/}
					{/*  <h1 className="App-title">Welcome to LMS VirtualHelp</h1>*/}
					{/*</header>*/}


				</div>
			</>
		);
	}

}

export default Home;
