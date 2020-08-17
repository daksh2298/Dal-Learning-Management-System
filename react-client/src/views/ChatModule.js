import React, {Component} from 'react';
// import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import {Button, Container, Form} from 'react-bootstrap';
import {ChatFeed, Message} from 'react-chat-ui';
import {Button, Card, CardHeader} from "reactstrap";
import CardBody from "reactstrap/es/CardBody";
import CardFooter from "reactstrap/es/CardFooter";

class ChatModule extends Component {

	constructor(props) {
		super(props);
		this.state = {
			form: {
				message: ""
			},
			username: localStorage.getItem('username'),
			messages: [],
			is_typing: true,
			lastMessage: Date.now(),
			inputBoxMessage: ""
		};

	}

	sendMessage = (event) => {

		let temp = event.target;
		let message = temp.form.elements.message.value;
		var messages = this.state.messages;
		messages.push(new Message({id: 0, message: message, senderName: this.state.username}))

		this.setState({
			messages: messages,
			lastMessage: Date.now()
		});

		fetch('https://us-central1-dallms-284316.cloudfunctions.net/Publish', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				'username': this.state.username,
				'message': message,
				'timestamp': Date.now()
			}),
		})
			.then(response => response.json())
			.then(data => {
				console.log(data);
				this.setState({
					form: {
						message: ""
					}
				})
			});
	}

	componentDidMount() {

		setInterval(() => {
			var messages = this.state.messages;

			fetch("https://us-central1-dallms-284316.cloudfunctions.net/get-messages")
				.then(response => response.json())
				.then(data => {
					for (var i = 0; i < data.length; i++) {

						var message = data[i];
						console.log(message.timestamp)
						console.log(this.state);
						if (this.state.lastMessage < message.timestamp) {
							console.log("recieved lastest Message");
							if (message.username != this.state.username) {
								messages.push(new Message({id: 1, message: message.message, senderName: message.username}));
							}
						} else {
							console.log("recieved old  Message");
						}
					}

					this.setState({
						lastMessage: data[data.length - 1].timestamp,
						messages: messages
					})

				})

		}, 2000);
	}

	render() {

		return (
			<>
				<div className="content">
					{/*Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda atque commodi natus nisi. Accusantium atque delectus dicta illo odit sint velit! Aliquid delectus dignissimos quibusdam sint totam? Accusantium quasi, ratione!*/}
					<h2>Chat App</h2>
					<Card className="mb-0" >
						<CardHeader>Dal LMS Group chat</CardHeader>
						<CardBody style={{height:"27rem", overflowY:"scroll"}}>
							<ChatFeed
								messages={this.state.messages}
								showSenderName={true}
								isTyping={false}
							/>
						</CardBody>
						<CardFooter>
							<form>
								<div className="form-group">
									<div className="row">
										<div className="col-9">
											<input
												onChange={this.handleChange}
												className="form-control w-100" name="message" placeholder="Type a message" value={this.state.form.message}/>
										</div>
										<div className="col-3">
											<Button className=" w-100 m-0 btn-success" type="button" onClick={this.sendMessage}>Send</Button>
										</div>
									</div>
								</div>
							</form>
						</CardFooter>
					</Card>
				</div>
			</>

		);
	}

	handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		this.setState({
			form: {
				[name]: value
			}
		})
	}
}

export default ChatModule;
