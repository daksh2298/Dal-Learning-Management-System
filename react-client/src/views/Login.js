import React, {Component} from 'react';
import {Button, Card, CardBody, CardFooter, CardHeader, Col, Container, Form, FormGroup, Input, Row} from "reactstrap";
import CardImg from "reactstrap/es/CardImg";
import axios from "axios";

const _ = require('lodash');

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			form: {
				email: "",
				username: "",
				university: "",
				password: "",
			},
			MfaForm: {
				question: "",
				answer: "",
				display: false
			}
		}
	}

	componentDidMount() {
		const mfaDone = localStorage.getItem("mfaDone");
		const username = localStorage.getItem('username');
		console.log(username, mfaDone);
		if (username && username.length > 0) {
			if (mfaDone && parseInt(mfaDone)  === 1 ){
				console.log('here');
				this.props.history.push('/user/machinelearning');
			} else{
				const question=localStorage.getItem("question")
				this.setState({
					MfaForm: {
						display: true,
						question:question
					}
				})
			}
		}
	}

	onChangeHandler = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		let state = this.state;
		console.log(name, value);
		if (name === 'answer') {
			state.MfaForm[name] = value;
			this.setState(state);
		} else {
			if (name === 'email') {
				state.form['username'] = value.replace('@', '.')
			}
			state.form[name] = value;
			this.setState(state);
		}
	}

	render() {
		const loginForm = <Card>
			<CardHeader>
				<h2 className="title">Login to your account</h2>
			</CardHeader>
			<CardBody>
				<Form>
					<Row>
						<Col className="pr-md-1" md="6">
							<FormGroup>
								<label htmlFor="exampleInputEmail1">
									Email address
								</label>
								<Input
									name="email"
									value={this.state.form.email}
									placeholder="Eg: mike@email.com"
									type="email"
									onChange={this.onChangeHandler}
									required
								/>
							</FormGroup>
						</Col>
						<Col className="pl-md-1" md="6">
							<FormGroup>
								<label>Username</label>
								<Input
									name="username"
									value={this.state.form.username}
									// onChange={this.onChangeHandler}
									type="text"
									disabled
									className="text-white-50"

								/>
							</FormGroup>
						</Col>
					</Row>
					<Row>
						<Col md="12">
							<FormGroup>
								<label>Select University</label>
								<Input
									type="select"
									name="university"
									id="university"
									value={this.state.form.university}
									onChange={this.onChangeHandler}
									required
								>
									<option>-------- Please Select University --------</option>
									<option value="dal">Dalhousie University</option>
									<option value="stmary">St. Mary University</option>
								</Input>
							</FormGroup>
						</Col>
					</Row>
					<Row>
						<Col className="pr-md-1" md="6">
							<FormGroup>
								<label>Password</label>
								<Input
									name="password"
									value={this.state.form.password}
									placeholder="Eg: mike@dal"
									type="password"
									required
									onChange={this.onChangeHandler}
								/>
							</FormGroup>
						</Col>
					</Row>
					<hr/>
				</Form>
			</CardBody>
			<CardFooter>
				<Row>
					<Col md={3}>
						<Button
							className="btn-fill m-0"
							color="primary" type="button"
							onClick={this.signIn}
						>
							Submit
						</Button>
					</Col>
					<Col md={{span:9, offset:4}} className="mt-1 pt-1">

						<span className="text-white-50">Dont have an account?</span> <Button
						className="btn btn-link p-0 pl-1 pb-1"
						color="primary" type="button"
						onClick={()=>{this.props.history.push('/register')}}
					>
						Register here
					</Button>
					</Col>
				</Row>
			</CardFooter>
		</Card>
		const MfaForm = <Card>
			<CardHeader>
				<h2 className="title">One more step, please provide the answer to security question</h2>
			</CardHeader>
			<CardBody>
				<Form>
					<Row>
						<Col className="pr-md-1" md="12">
							<FormGroup>
								<label htmlFor="exampleInputQuestion">
									Security Question
								</label>
								<Input
									name="question"
									value={this.state.MfaForm.question}
									type="text"
									disabled
									className="text-white-50"
								/>
							</FormGroup>
						</Col>
					</Row>
					<Row>
						<Col className="pr-md-1" md="12">
							<FormGroup>
								<label>Answer</label>
								<Input
									name="answer"
									value={this.state.MfaForm.answer}
									type="text"
									onChange={this.onChangeHandler}
									required
								/>
							</FormGroup>
						</Col>
					</Row>
					<hr/>
				</Form>
			</CardBody>
			<CardFooter>
				<Button className="btn-fill" color="success" type="button"
								onClick={this.verifyAnswer}
				>
					Submit
				</Button>
			</CardFooter>
		</Card>
		return (
			<Container className={"mt-4"}>
				{/*<Container className={"mt-4"}>*/}
				<div className="content">
					<Row>
						<Col md="3">
							<Card>
								<CardImg top src={require("assets/img/university.png")}/>
								<CardHeader>
									<h3>Dal-LMS</h3>
								</CardHeader>
								<CardBody className="mt-0 pt-0 pb- mb-4 text-light">
									Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam corporis deserunt dicta dolorem
									dolorum ducimus eaque excepturi, exercitationem hic ipsam nemo nesciunt nihil quos repellat

								</CardBody>
							</Card>
						</Col>
						<Col md="9">
							{this.state.MfaForm.display ? MfaForm : loginForm}
						</Col>
					</Row>
				</div>
			</Container>
		);
	}

	signIn = () => {
		console.log("state", this.state);
		let form = JSON.parse(JSON.stringify(this.state.form));
		let questions = []
		console.log(form);
		if (form.email===""){
			alert('Please enter email!');
			return;
		}
		if (form.password===""){
			alert('Please enter password!');
			return;
		}
		if (form.university===""){
			alert('Please select university');
		}
		let data = {
			body: form
		}
		let config = {
			method: 'post',
			url: 'https://7vd6sbsllk.execute-api.us-east-1.amazonaws.com/production/authenticate',
			headers: {
				'Content-Type': 'application/json',
				"Accept": "*/*"
			},
			data: data
		};
		axios(config)
			.then((response) => {
				console.log(response);
				const statusCode = response.data.statusCode;
				if (statusCode===200){
					localStorage.setItem("username", this.state.form.username);
					localStorage.setItem("email", this.state.form.email);
					localStorage.setItem("mfaDone", "0");
					// alert('Login successful');
					this.showQuestionForm(response);
				} else if (statusCode===409){
					alert("Incorrect username or password!");
				} else{
					alert("Something went wrong! Please try again later");
				}
				// this.props.history.push('/user/machinelearning');
			})
			.catch((err) => {
				console.log(err.response);
				alert(err.response.data.message);
			});
	}

	showQuestionForm = (response) => {
		let state = this.state;
		let body = JSON.parse(response.data.body);
		state.MfaForm.question = body.question;
		localStorage.setItem("question",body.question);
		state.MfaForm.display = true;
		this.setState(state);
	}

	verifyAnswer = () => {
		let form = JSON.parse(JSON.stringify(this.state.MfaForm));
		form['email']=localStorage.getItem('email');
		let questions = []
		console.log(form);
		// let data = {
		// 	body: form
		// }
		let config = {
			method: 'post',
			url: 'https://us-central1-dallms-283403.cloudfunctions.net/verifyAnswer',
			headers: {
				'Content-Type': 'application/json',
				"Accept": "*/*"
			},
			data: form
		};
		axios(config)
			.then((response) => {
				console.log(response)
				localStorage.setItem("username", this.state.form.username);
				localStorage.setItem("mfaDone", "1");
				alert('Login Successful');
				this.props.history.push('/user/machinelearning');
			})
			.catch((err) => {
				console.log(err.response);
				alert(err.response.data.message);
			});
	}
}


export default Login;
