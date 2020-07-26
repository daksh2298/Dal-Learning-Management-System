import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, ListGroup, Container, Form, Row, Col, Table} from 'react-bootstrap';



class App extends Component {
	constructor(props){
		super(props);
		this.state = {
			resp : false,
			keys : [],
			username: 'akashbharti'
		}
	}
	
	
  formClusters = () => {

	let url = 'https://us-east1-dallms-284316.cloudfunctions.net/Clustering?username=' + this.state.username; 
    fetch(url)
    .then(response => response.json())
    .then(data => {
		console.log(data);
		var list = []
		this.setState({resp: data})
		for (var key in data){
			console.log(key);
			console.log(data[key]);
			list.push(key)
		}
		this.setState({keys: list});
    })
  }

  render() {
	var result = {
		display: this.state.resp ? 'block': 'none'
	}

	var tb ={
		"display": "flex"
	  }
    return (
      <div className="App">
	  	<Container>
			<hr/>
			<h2>Machine Learning Module</h2>
			<Row>
				<Col>
				<div>
					<Form action="https://us-east1-dallms-284316.cloudfunctions.net/uploadFile" method="post" enctype="multipart/form-data">
						Select File
						<input type="file" name="fileToUpload" id="fileToUpload"/>
						<input type="hidden" id="username" name="username" value={this.state.username}></input>
						<input type="submit" value="Upload File" name="submit"/>
					</Form>

					</div>
				</Col>
				<Col>
				<Button variant="primary" onClick = {this.formClusters}>Cluster Files</Button>
				</Col>
				</Row>
				<hr/>
				<Row className="justify-content-md-center">
					
					<div style={tb}>

						{this.state.keys.map((listitems, idx) => (
							<Table striped bordered hover variant="dark" >
							<div >
							<thead>
								<tr>
								
									<th>Cluster {idx}</th>
								
								</tr>
							</thead>

							{this.state.resp[listitems].map((name, idx) => (
							
								<tbody>
								<tr>
									<td>{name}</td>
									
								</tr>
								</tbody>
							))
							}
						
							
							</div>
							</Table>
						))}

								
					</div>
			</Row>
		</Container>
      </div>


    );
  }
}

export default App;
