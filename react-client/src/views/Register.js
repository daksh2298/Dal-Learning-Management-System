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
// reactstrap components
import {Button, Card, CardBody, CardFooter, CardHeader, Col, Container, Form, FormGroup, Input, Row} from "reactstrap";
import CardImg from "reactstrap/es/CardImg";
import CardTitle from "reactstrap/es/CardTitle";
// import axiosInstance from "../AxiosSingletonInstance";
import axios from "axios";


const _ = require('lodash');

class Register extends React.Component {
	constructor(props) {
		super(props);
		this.allQuestions = {
			1: "question 1",
			2: "question 2",
			3: "question 3",
			4: "question 4",
			5: "question 5"
		}
		this.state = {
			remainingQuestionIds: [],
			form: {
				firstName: "",
				lastName: "",
				email: "",
				username: "",
				university: "",
				password: "",
				confirmPassword: "",
				questions: {
					question1: "",
					question2: "",
					question3: ""
				},
				answers: {
					answer1: "",
					answer2: "",
					answer3: ""
				}
			}
		}
		this.questions = {
			question1: null,
			question2: null,
			question3: null,
		}
	}

	componentDidMount() {
		console.log(localStorage.getItem('username'));
		if (localStorage.getItem('username') && localStorage.getItem('username').length > 0) {
			console.log('here');
			this.props.history.push('/user/machinelearning');
		}
		const body = {
			email: 'patel@dal.ca'
		}
		axios.post("https://us-central1-dallms-283403.cloudfunctions.net/getQuestions", body)
			.then((response) => {

				console.log(response);
				// this.setState({
				// 	allQuestions:response.data
				// });
				this.allQuestions = response.data;
			})
			.catch((err) => {
				console.log(err.response);
			})
	}

	onSelectMouseEnterHandler = () => {
		const allQuestionIds = _.keys(this.allQuestions);
		let usedQuestionIds = _.values(this.state.form.questions);
		let remainingQuestionIds = [];
		let state = this.state;
		allQuestionIds.forEach((val) => {
			if (!usedQuestionIds.includes(val)) {
				remainingQuestionIds.push(val);
			}
		});
		state['remainingQuestionIds'] = remainingQuestionIds;
		this.setState(state);
		console.log("on select click", this.state);
	}

	onChangeHandler = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		let state = this.state;

		if (name.includes("answer")) {
			state.form.answers[name] = value;
		} else if (name.includes("question")) {
			state.form.questions[name] = value;
		} else {
			if (name === 'email') {
				state.form[e.target.name] = value
				state.form['username'] = value.replace('@', '.')
			} else {

				state.form[e.target.name] = value
			}
		}
		this.setState(state);
	}


	render() {
		// this.questions["1"]="4";
		// this.getRemainingQuestions();
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
							<Card>
								<CardHeader>
									<h2 className="title">Register today to get started</h2>
								</CardHeader>
								<CardBody>
									<Form>
										<Row>
											<Col className="pr-md-1" md="6">
												<FormGroup>
													<label>First Name</label>
													<Input
														name="firstName"
														value={this.state.form.firstName}
														onChange={this.onChangeHandler}
														placeholder="Eg: Mike"
														type="text"
													/>
												</FormGroup>
											</Col>
											<Col className="pl-md-1" md="6">
												<FormGroup>
													<label>Last Name</label>
													<Input
														name="lastName"
														value={this.state.form.lastName}
														onChange={this.onChangeHandler}
														placeholder="Eg: Andrew"
														type="text"
													/>
												</FormGroup>
											</Col>
										</Row>
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
														placeholder="mike_a"
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
														onChange={this.onChangeHandler}
													/>
												</FormGroup>
											</Col>
											<Col className="pl-md-1" md="6">
												<FormGroup>
													<label>Confirm Password</label>
													<Input
														name="confirmPassword"
														value={this.state.form.confirmPassword}
														onChange={this.onChangeHandler}
														placeholder="Eg: mike@dal"
														type="password"
													/>
												</FormGroup>
											</Col>
										</Row>
										<hr/>
										<CardTitle>
											Security Questions
										</CardTitle>
										<Row>
											<Col md="4">
												<FormGroup>
													<label>Qeustion 1</label>
													<Input
														type="select"
														name="question1"
														id="question1"
														onChange={this.onChangeHandler}
														onMouseEnter={this.onSelectMouseEnterHandler}
														value={this.state.form.questions["question1"]}
													>
														<option value="">--- SELECT QUESTION ---</option>
														{this.state.form.questions["question1"].length > 0 ? <option
															value={this.state.form.questions["question1"]}>{this.allQuestions[this.state.form.questions["question1"]]}</option> : null}
														{this.state.remainingQuestionIds.map((val) => {
															return <option key={val} value={val}>{this.allQuestions[val]}</option>
														})}
													</Input>
												</FormGroup>
											</Col>
											<Col md="4">
												<FormGroup>
													<label>Qeustion 2</label>
													<Input
														type="select"
														name="question2"
														id="question2"
														onChange={this.onChangeHandler}
														onMouseEnter={this.onSelectMouseEnterHandler}
														value={this.state.form.questions["question2"]}
													>
														<option value="">--- SELECT QUESTION ---</option>
														{this.state.form.questions["question2"].length > 0 ? <option
															value={this.state.form.questions["question2"]}>{this.allQuestions[this.state.form.questions["question2"]]}</option> : null}
														{this.state.remainingQuestionIds.map((val) => {
															return <option key={val} value={val}>{this.allQuestions[val]}</option>
														})}
													</Input>
												</FormGroup>
											</Col>
											<Col md="4">
												<FormGroup>
													<label>Qeustion 3</label>
													<Input
														type="select"
														name="question3"
														id="question3"
														onChange={this.onChangeHandler}
														onMouseEnter={this.onSelectMouseEnterHandler}
														value={this.state.form.questions["question3"]}
													>
														<option value="">--- SELECT QUESTION ---</option>
														{this.state.form.questions["question3"].length > 0 ? <option
															value={this.state.form.questions["question3"]}>{this.allQuestions[this.state.form.questions["question3"]]}</option> : null}
														{this.state.remainingQuestionIds.map((val) => {
															return <option key={val} value={val}>{this.allQuestions[val]}</option>
														})}
													</Input>
												</FormGroup>
											</Col>
										</Row>
										<Row>
											<Col md="4">
												<FormGroup>
													<label>Answer 1</label>
													<Input
														name="answer1"
														id="answer1"
														onChange={this.onChangeHandler}
														value={this.state.form.answers['answer1']}
														type="text"
													/>
												</FormGroup>
											</Col>
											<Col md="4">
												<FormGroup>
													<label>Answer 2</label>
													<Input
														name="answer2"
														id="answer2"
														onChange={this.onChangeHandler}
														value={this.state.form.answers['answer2']}
														type="text"
													/>
												</FormGroup>
											</Col>
											<Col md="4">
												<FormGroup>
													<label>Answer 3</label>
													<Input
														name="answer3"
														id="answer3"
														onChange={this.onChangeHandler}
														value={this.state.form.answers['answer3']}
														type="text"
													/>
												</FormGroup>
											</Col>
										</Row>
									</Form>
								</CardBody>
								<CardFooter>
									<Row>
										<Col md={3}>
											<Button
												className="btn-fill m-0"
												color="primary" type="button"
												onClick={this.signUp}
											>
												Submit
											</Button>
										</Col>
										<Col md={{span:9, offset:4}}  className="mt-1 pt-1">

											<span className="text-white-50">Already have an account?</span> <Button
												className="btn btn-link p-0 pl-1 pb-1"
												color="primary" type="button"
												onClick={()=>{this.props.history.push('/login')}}
											>
												Login here
											</Button>
										</Col>
									</Row>

								</CardFooter>
							</Card>
						</Col>
					</Row>
				</div>
				{/*</Container>*/}
			</Container>
		);
	}

	signUp = () => {
		console.log("state", this.state);
		let form = JSON.parse(JSON.stringify(this.state.form));
		let questions = []
		console.log(form);
		let answers = _.values(form.answers);
		for (const [key, value] of Object.entries(form.questions)) {
			console.log(`${key}: ${value}`);
			questions.push(this.allQuestions[value]);
		}
		console.log(questions);
		console.log(answers);

		form.questions = questions;
		form.answers = answers;
		console.log(form);
		var config = {
			method: 'post',
			url: 'https://us-central1-dallms-283403.cloudfunctions.net/validate',
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
				alert('Registration successful');
				this.props.history.push('/user/machinelearning');
			})
			.catch((err) => {
				console.log(err.response);
				alert(err.response.data.message);
			});
	}
}

export default Register;
