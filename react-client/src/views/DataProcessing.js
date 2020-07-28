import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import Moment from 'react-moment';
import {Storage} from 'aws-amplify';
import config from "../config";
import ProgressBar from 'react-bootstrap/ProgressBar';

export default class Upload extends Component {

	constructor(props) {
		super(props);
		this.file = '';
		this.fileName = '';
		this.fileType = '';
		this.url = 'https://' + config.bucketName + '.s3.amazonaws.com/public/';
		this.token = localStorage.getItem('token');
	}

	state = {
		files: [],
		redirect: false,
		isLoading: false,
		percentage: 0,
	};

	componentDidMount() {

		Storage.list('')
			.then(result => {
				const files = result;
				this.setState({files: files});
			})
			.catch(error => {
				this.setState({toDashboard: true});
				console.log(error);
			});
	}

	listFiles = async () => {
		const files = await Storage.list('')
		let signedFiles = files.map(f => Storage.get(f.key))
		signedFiles = await Promise.all(signedFiles)
		console.log('signedFiles: ', signedFiles)
		this.setState({files: signedFiles})
	}

	handleChange = event => {
		event.preventDefault();
		this.file = event.target.files[0];
		this.fileName = event.target.files[0].name;
		this.fileType = event.target.files[0].type;
		document.getElementById('fileLabel').innerHTML = event.target.files[0].name;
	};

	progressCallback(progress) {

	}

	handleSubmit = event => {
		event.preventDefault();
		this.setState({isLoading: true});
		const context = this;
		Storage.put(this.fileName, this.file, {
			contentType: this.fileType,
			progressCallback(progress) {
				console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
				let percentageProgress = progress.loaded * 100 / progress.total;
				context.setState({percentage: percentageProgress.toFixed(2)})
			},
		})
			.then(result => {
				if (result) {
					console.log(result);
					this.componentDidMount();
					this.setState({redirect: true, isLoading: false});
					document.getElementById('fileInput').value = "";
					document.getElementById('fileLabel').innerHTML = "Choose file";
				}
			})
			.catch(error => {
				this.setState({toDashboard: true});
				console.log(error);
			});
	};

	getYear() {
		return new Date().getFullYear();
	};

	renderRedirect = () => {
		if (this.state.redirect) {
			return <Redirect to='/upload'/>
		}
	};

	handleClickDelete = event => {
		const id = event.target.value;
		console.log("id", id);
		const span = document.getElementById('delete' + id);
		span.classList.remove('d-none');
		const file = span.dataset.file;
		console.log("file to delete", file);
		const preview = document.querySelectorAll('.delete' + id);
		preview[0].setAttribute("disabled", true);
		Storage.remove(file)
			.then(result => {
				console.log(result)
				this.componentDidMount();
			})
			.catch(err => {
				console.log(err)
				this.componentDidMount();
			});
	};

	render() {
		// const isLoading = this.state.isLoading;
		// if (this.state.toDashboard === true) {
		// 	return <Redirect to='/'/>
		// }
		return (
			<>
				<div className="content">
					<div className="card mx-auto">
						<div className="card-header">File Upload</div>
						<div className="card-body">
							<form onSubmit={this.handleSubmit}>
								<div className="form-group">
									<div className="form-row">
										<div className="col-md-6">
											<div className="input-group input-group-lg">
												<div className="custom-file">
													<input type="file" onChange={this.handleChange} className="custom-file-input" id="fileInput"/>
													<label className="custom-file-label" id="fileLabel" htmlFor="fileInput">Choose file</label>
												</div>
											</div>
										</div>
										<div className="col-md-6">
											<div className="form-label-group">
												<button className="btn btn-primary btn-block" type="submit"
																disabled={this.state.isLoading ? true : false}>Upload &nbsp;&nbsp;&nbsp;
													{/*{isLoading ? (*/}
													{/*	<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/>*/}
													{/*) : (*/}
													{/*	<span/>*/}
													{/*)}*/}
												</button>
											</div>
										</div>
									</div>
									<div style={{padding: 8}}/>
									<div className="form-row">
										<div className="col-md-12">
											<ProgressBar animated variant={this.state.percentage < 100 ? "info" : "success"}
																	 now={this.state.percentage} label={`${this.state.percentage}%`}/>
											{console.log("percentage ", this.state.percentage)}
										</div>
									</div>
								</div>

							</form>
							{this.renderRedirect()}
						</div>
					</div>
					<div style={{padding: 10}}/>
					<div className="table">
						<table className="table table-bordered">
							<thead>
							<tr>
								<th>Name</th>
								<th>Download Link</th>
								<th>Created</th>
								<th className="text-center">Action</th>
							</tr>
							</thead>
							<tbody>
							{this.state.files.map((file, index) =>
								<tr key={index}>
									<td>{file.key}</td>
									{/*
                                            <td><img key={index} src={this.url + file.key} style={{height: 50}} alt={file.key}/></td>
                                            */}
									<td><a href={this.url + file.key}>{file.key}</a></td>
									<td>
										<Moment format="YYYY-MM-DD">{file.lastModified}</Moment>
									</td>
									<td className="text-center">
										<button value={file.eTag.slice(1, -1)}
														className={'btn btn-sm btn-danger delete' + file.eTag.slice(1, -1)}
														onClick={this.handleClickDelete}>Delete &nbsp;&nbsp;&nbsp;
											<span data-file={file.key} className="spinner-border spinner-border-sm d-none"
	id={'delete' + file.eTag.slice(1, -1)} role="status" aria-hidden="true"/>
										</button>
									</td>
								</tr>)
							}
							</tbody>
						</table>
					</div>
				</div>
			</>
		);
	}
}
