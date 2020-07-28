import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Container, Form} from 'react-bootstrap';
import { ChatFeed, Message } from 'react-chat-ui'

class Chat extends Component {

	constructor(props){
        super(props);
        this.state = {
            username: 'akash',
            messages: [
            ],
            is_typing: true,
            lastMessage: Date.now(),
            atag: false
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
        
        fetch('https://us-central1-dallms-284316.cloudfunctions.net/Publish' , {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                'username': this.state.username,
                'message': message,
                'timestamp': Date.now()
            }),
        })
        .then(response => response.json())
        .then(data => console.log(data)); 
   }

   componentDidMount(){

       setInterval(() => {
        var messages = this.state.messages;

        fetch("https://us-central1-dallms-284316.cloudfunctions.net/get-messages")
        .then(response => response.json())
        .then(data => {
            for(var i=0;i<data.length;i++){

                var message = data[i];
                console.log(message.timestamp)
                console.log(this.state);
                if (this.state.lastMessage < message.timestamp){
                    console.log("recieved lastest Message");
                    if (message.username != this.state.username){
                        messages.push(new Message({id: 1, message: message.message, senderName: message.username}));
                    }
                }
                else {
                    console.log("recieved old  Message");
                }
            }
           
            this.setState({
                lastMessage: data[data.length-1].timestamp,
                messages: messages
            })
            
        })
        
       }, 100000);
   }

   sentimentalAnalysis = () => {
       let url = "https://v9bvn40xu0.execute-api.us-east-1.amazonaws.com/default/sentimental-analysis-dallms";

       fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            this.setState({
                atag: true
            })

        });
       

   }

  render() {
      var atag = {
          display: this.state.atag ? 'block':'none'
      }

    return (
        <Container >
            <h1>Chat App</h1>
            <ChatFeed
            messages={this.state.messages}
            showSenderName = {true}
            isTyping = {true}
           
            />
            <Form >
                <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Control name="message" placeholder="Type a message" />
                </Form.Group>
                <Button variant="primary" onClick={this.sendMessage}>Send</Button>
            </Form>

            <Button onClick={this.sentimentalAnalysis} variant="primary">Sentimental Analysis</Button>
            <div style={atag}>
                <a href="https://tagged-chats.s3.amazonaws.com/message.json">Download tagged chat file</a>
            </div>
        </Container>

    );
  }
}

export default Chat;
