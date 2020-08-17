import React, {Component} from 'react';
import Moment from 'react-moment';
import Amplify, {Auth, Storage} from 'aws-amplify';
import config from "../config";
import ProgressBar from 'react-bootstrap/ProgressBar';
import NotificationAlert from "react-notification-alert";
import Radium, {StyleRoot} from "radium";
import {fadeInDown, fadeInLeft, fadeInRight} from "react-animations";

export default class DataProcessing extends Component {

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

		Storage.list('')
			.then(result => {
				const files = result;
				this.setState({files: files});
			})
			.catch(error => {
				this.setState({toDashboard: true});
				console.log(error);
			});
		if (this.props.location.state) {
			this.setState({
				redirect: false
			})

		}
		// this.setState({
		// 	redirect:false
		// })
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
	notify = (message, type) => {
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
			autoDismiss: 7
		};
		this.refs.notificationAlert.notificationAlert(options);
		this.setState({redirect: false});
		setTimeout(() => {
			this.setState({
				percentage: 0,
			})
		}, 1000);
	};

	styles = {
		fadeInRight: {
			animation: 'x 1s',
			animationName: Radium.keyframes(fadeInRight, 'fadeInRight')
		},
		fadeInLeft: {
			animation: 'x 1s',
			animationName: Radium.keyframes(fadeInLeft, 'fadeInLeft')
		},
		fadeInDown: {
			animation: 'x 1s',
			animationName: Radium.keyframes(fadeInDown, 'fadeInDown')
		}
	}

	render() {

		console.log(this.props.location.state ? this.props.location.state.id : "Did not get props");
		return (
			<>
				<div className="content">
					<div className="react-notification-alert-container">
						<NotificationAlert ref="notificationAlert"/>
					</div>
					<h2>Data Processing Module</h2>
					<div className="card mx-auto">
						<div className="card-header">File Upload</div>
						<div className="card-body">
							<StyleRoot>
								<div style={this.styles.fadeInRight}>
									<form onSubmit={this.handleSubmit}>
										<div className="form-group">
											<div className="form-row">
												<div className="col-md-6">
													<div className="input-group input-group-lg">
														<div className="custom-file mt-1">
															<input type="file" onChange={this.handleChange} className="custom-file-input"
																		 id="fileInput"/>
															<label className="custom-file-label" id="fileLabel" htmlFor="fileInput">Choose
																file</label>
														</div>
													</div>
												</div>
												<div className="col-md-6">
													<div className="form-label-group">
														<button className="btn btn-primary btn-block" type="submit"
																		disabled={this.state.isLoading ? true : false}><i className="tim-icons icon-cloud-upload-94"></i>{" "}Upload &nbsp;&nbsp;&nbsp;
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
													<ProgressBar className={this.state.percentage > 0 ? "justify-content-center font-weight-bold text-dark": "justify-content-center font-weight-bold"} animated variant={this.state.percentage < 100 ? "info" : "success"}
																			 now={this.state.percentage} label={`${this.state.percentage}%`}/>
													{console.log("percentage ", this.state.percentage)}
												</div>
											</div>
										</div>
									</form>
									{this.state.redirect ? this.notify("File uploaded successfully", "success") : null}
									<div className="row">
										<div className="col-md-12">
											<a href="https://wordcloudv2-ch6r7tzjta-nn.a.run.app/" className="btn btn-success w-100"><i className="tim-icons icon-cloud-download-93"></i>{" "}Generate Word Cloud</a>
										</div>
									</div>

								</div>
							</StyleRoot>
						</div>
					</div>
					<div style={{padding: 10}}/>
					<div className="table">
						<table className="table table-bordered animate-bottom">
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
