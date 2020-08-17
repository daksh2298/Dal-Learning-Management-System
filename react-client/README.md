# Learning Management System
### CSCI 5410 - Serverless data processing

* Date Created: 26 July 2020
* Last Modification Date: 06 August 2020

## Authors
* [Aakash Bharti](B00837970) - (Contributor)
* [Akshay Singh Bharti](B00814753) - (Contributor)
* [Arthy Umapathy](B00840100) - (Contributor)
* [Daksh Patel](B00843468) - (Contributor)

## Getting Started

See deployment for notes on how to deploy the project on a live system.

### Prerequisites

To have a copy of this project up and running on your local machine, you will first need to install the following software / libraries / plug-ins

```
--Install git on your local machine (https://git-scm.com/downloads)
--Install Node.js on your local machine (https://nodejs.org/en/download/)
--Run the command
> git clone <http clone url> 
OR 
> git clone <ssh clone url>
--[optional] Remove the folder node_modules if the repo fails to start (might happen due to difference in node version)
--[optional] Go to the root of the cloned repo and run the command
> npm install 
for fresh install of all the dependencies.
Run the command
> npm run dev

The app should be up and running.
```
## Deployment

To deploy this on a live system follow the steps given below 

```
[option 1] Use Heroku GitHub integration facility:
1) Open Heroku
2) Navigate to apps 
3) Create new app 
4) Enter App details 
5) Go to "Deploy" 
6) Choose "GitHub" in Deployment method 
7) Connect to GitHub 
8) Enter your existing repo name and connect it 
9) Deploy your preferred branch

Your app is now deployed.

[option 2] Use Heroku CLI (MacBook):
1) Install Heroku CLI (brew tap heroku/brew && brew install heroku)
2) Clone your GitHub repo
3) Navigate to the cloned repo in terminal 
4) Enter command "heroku create" 
5) Enter commnad "git push heroku master"

Your app is now deployed.

```

## Built With

#### Front end
* Node.js Available at: https://nodejs.org/en/download/
* Create-React-App boilerplate.
* Black Dashboard by Creative Tim: https://demos.creative-tim.com/black-dashboard-react

#### Back end
* AWS Amplify: https://aws.amazon.com/amplify/
* Python boto3: https://boto3.amazonaws.com/v1/documentation/api/latest/index.html#
* Google Dialogflow: https://cloud.google.com/dialogflow
* Google Pub/Sub: https://cloud.google.com/pubsub
* Google AI and Machine Learning : https://cloud.google.com/products/ai
* Google cloud function: https://cloud.google.com/functions
* Google firestore: https://cloud.google.com/firestore
* Google cloud run: https://cloud.google.com/run
* Docker: https://www.docker.com/

## Pages of the app
Our group project definition is a Learning Management System. The current design of the application has the following designed and implemented pages:

* Login Page (http://localhost:3000/login)
* Register Page (http://localhost:3000/register)
* Home Page (after login) (http://localhost:3000/user/home)
* Machine Learning Module (after login) (http://localhost:3000/user/machinelearning)
* Data Processing Module (after login) (http://localhost:3000/user/dataprocessing)
* Chat Module (after login) (http://localhost:3000/user/chat)
* Online Support Module (after login) (http://localhost:3000/user/onlinesupport)

## Acknowledgments
* Designed using Black Dashboard (https://demos.creative-tim.com/black-dashboard-react)
