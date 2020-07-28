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
import {Button, Card, CardBody, CardHeader, CardTitle, Col, Form, Row} from "reactstrap";
import Input from "reactstrap/lib/Input";
import NotificationAlert from "react-notification-alert";
// core components
import "../assets/css/App.css"
import logo from '../assets/img/logo.svg';
import {Bar} from "react-chartjs-2";
import {clusterChart} from "../variables/charts";

const _ = require('lodash');

class MachineLearningModule extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			file: null,
			resp: false,
			keys: [],
			username: localStorage.getItem('username').split('.').join('-'),
			showLoading: false,
			showNotif: false,
			showFileUploadNotif: false,
			showUploadLoading: false,
			showChart: false
		}
	}

	onFormSubmit = (e) => {
		e.preventDefault() // Stop form submit
		console.log('submit called');
		if (this.state.file) {
			this.fileUpload(this.state.file);
		} else {
			this.showNotif("Please select the file", "danger")
		}
	}
	showNotif = (message, type) => {
		console.log('show notif called');
		var options = {};
		options = {
			place: "br",
			message: (
				<div>
					<div>
						{message}
					</div>
				</div>
			),
			type: type,
			icon: "tim-icons icon-bell-55",
			autoDismiss: 4
		};
		console.log('before set interval');
		setTimeout(this.changeShowNotif, 4000);
		console.log('after set interval');
		this.refs.notificationAlert.notificationAlert(options);
	}

	changeShowNotif = () => {
		this.setState({
			showNotif: false
		})
	}


	formClusters = () => {

		let url = 'https://us-east1-dallms-284316.cloudfunctions.net/Clustering?username=' + this.state.username;
		this.setState({
			showLoading: true,
			showNotif: false,
			showChart: false
		})
		fetch(url)
			.then(response => response.json())
			.then(data => {
				console.log(data);
				var list = []
				this.setState({resp: data})
				for (var key in data) {
					console.log(key);
					console.log(data[key]);
					list.push(key);
				}
				this.setState({keys: list});
				this.setState({
					showLoading: false,
					showNotif: true,
					showChart: true
				})
				console.log(this.state);
			})
	}


	render() {
		var result = {
			display: this.state.resp ? 'block' : 'none'
		}

		var tb = {
			"display": "flex"
		}

		const table = <Col md={8}>
			<Card>
				<Row>
					{this.state.keys.map((listitems, idx) => (
						<Col md={4}>
							<Card>
								<CardHeader>
									<h5 className="card-category">Cluster of files</h5>
									<CardTitle tag="h3">
										<i className="tim-icons icon-molecule-40 text-primary"/>{" "}Clusters {idx}
									</CardTitle>
								</CardHeader>
								<CardBody>
									{this.state.resp[listitems].map((name, idx) => (
										<p>
											<i className="tim-icons icon-paper"/> {name}
										</p>
									))
									}
								</CardBody>
							</Card>
						</Col>
					))}
				</Row>
			</Card>
		</Col>
		const labels = this.state.keys ? this.state.keys.map((key, idx) => {
			return `Cluster ${idx}`
		}) : [];
		const values = this.state.keys ? this.state.keys.map((listitems, idx) => {
			return this.state.resp[listitems].length;
		}) : [];
		clusterChart.labels = labels;
		clusterChart.values = values;

		console.log(labels, values);

		const chart = <Col md="4">
			<Card className="card-chart">
				<CardHeader>
					<h5 className="card-category">Cluster Analysis</h5>
					<CardTitle tag="h3">
						<i className="tim-icons icon-chart-bar-32 text-primary"/>{" "}
						{labels.length ? `${labels.length} clusters` : ""}
					</CardTitle>
				</CardHeader>
				<CardBody>
					<div className="chart-area">
						<Bar
							data={clusterChart.data}
							options={clusterChart.options}
						/>
					</div>
				</CardBody>
			</Card>
		</Col>
		return (
			<>
				<div className="content">
					<div className="react-notification-alert-container">
						<NotificationAlert ref="notificationAlert"/>
					</div>
					{this.state.showNotif ? this.showNotif("Clusters formed successfully.", "success") : null}
					<h2>Machine Learning Module</h2>
					<Row>
						<Col md={8}>
							<Form
								onSubmit={this.onFormSubmit}
							>
								<Row>
									<Col md={8}>
										<div className="custom-file mt-1">
											<label className="custom-file-label" htmlFor="fileToUpload"><i
												className="tim-icons icon-upload"/> {this.state.file ? this.state.file.name : "Choose file"}
											</label>
											<Input type="file" name="fileToUpload" className="custom-file-input" id="fileToUpload"
														 onChange={this.onChangeHandler}
											/>
										</div>
									</Col>
									<Col md={4}>
										{/*{this.state.showUploadLoading ? <div className="loader"></div> : null}*/}
										<Button type="submit" className="btn btn-neutral" name="submit"><i
											className="tim-icons icon-cloud-upload-94"/>{" "}{this.state.showUploadLoading ? "Uploading file..." : "Upload File"}
										</Button>
										<input type="hidden" id="username" name="username" value={this.state.username}/>
									</Col>
								</Row>
							</Form>
						</Col>
						<Col>
							<Button className={"btn-success"} onClick={this.formClusters}><i
								className="tim-icons icon-molecule-40 font-weight-bold"/> Cluster Files</Button>
						</Col>
					</Row>
					<Row className={this.state.showLoading ? "justify-content-md-center row mt-3" : "row mt-3 animate-bottom"}>
							{this.state.showChart ? chart : null}
							{this.state.showLoading ?
								<div className="animate-bottom"><h3 className="text-success">Loading clusters...</h3>  <img src={logo} className="App-logo"
																																								 alt="logo"/></div> : table}

					</Row>
					<hr/>

				</div>
			</>
		);
	}

	onChangeHandler = (e) => {
		console.log(e.target.files[0]);
		this.setState({file: e.target.files[0]});
	}

	fileUpload = (file) => {
		console.log(file);
		this.setState({
			showUploadLoading: true
		});
		var myHeaders = new Headers();
		myHeaders.append("Authorization", "Basic ZXlKaGJHY2lPaUpTVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmZhV1FpT2lJMVpqRmpPR1kzWXpZeE9XUm1aakl6TXpSaFl6VTJOekFpTENKeWIyeGxjeUk2V3lKemRIVmtaVzUwSWwwc0ltbGhkQ0k2TVRVNU5UY3dOekkyTUN3aVpYaHdJam94TlRrMU56RXdPRFl3ZlEuSE5GRVpkMHE5WFV5V1Y4dXNuZ0R0NDZQMXNndlBqaUZ2UUNCa3pVMUtzWkFzRkFnSkxHNzFSWTA4dGNnX25TUWJWanc5d1FTZzNMSWxrbjUxUUl3V2c6c29tZXRoaW5n");

		var formdata = new FormData();
		formdata.append("fileToUpload", file, file.name);
		formdata.append("username", this.state.username);

		var requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: formdata,
			redirect: 'follow'
		};

		fetch("https://us-central1-dallms-284316.cloudfunctions.net/uploadFileTest", requestOptions)
			.then(response => response.text())
			.then(result => {
				console.log(result);
				this.showNotif("File uploaded successfully", "success")
				this.setState({
					file: null,
					showUploadLoading: false,
					showFileUploadNotif: true
				});
			})
			.catch(error => console.log('error', error));

	}
}

export default MachineLearningModule;
