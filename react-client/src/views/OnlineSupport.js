import React, {Component} from "react";
import Amplify from "aws-amplify";
import {AmplifyTheme, ChatBot} from "aws-amplify-react";

Amplify.configure({
	Auth: {
		identityPoolId: "us-east-1:b1a8323b-e58d-4838-b338-3fab21295a29",
		region: "us-east-1",
	},
	Interactions: {
		bots: {
			VirtualHelp: {
				name: "VirtualHelp",
				alias: "VirtualHelp",
				region: "us-east-1",
			},
		},
	},
});

const myTheme = {
	...AmplifyTheme,
	sectionHeader: {
		...AmplifyTheme.sectionHeader,
		backgroundColor: "blue",
	},
};

class OnlineSupport extends Component {
	render() {
		return (
			<>
				<div className="content">
					<h2>Welcome to Online Support of Dal LMS</h2>
					{/*<header className="App-header">*/}
					{/*  <h1 className="App-title">Welcome to LMS VirtualHelp</h1>*/}
					{/*</header>*/}
					<ChatBot
						title="My Bot"
						theme={myTheme}
						botName="VirtualHelp"
						welcomeMessage="Hey there, need any help?"
						clearOnComplete={true}
						conversationModeOn={false}
					/>
				</div>
			</>
		);
	}
}

export default OnlineSupport;
