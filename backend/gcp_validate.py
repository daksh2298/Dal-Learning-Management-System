__author__ = 'Daksh Patel'

import json
from google.cloud import firestore
import re
import requests

db = firestore.Client()
col_ref = db.collection('users')

LAMBDA_REGISTRATION_URI = "https://1bp6xwdqph.execute-api.us-east-1.amazonaws.com/default/registerUser"

def validate_email(email):
    regex = '^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$'

    if (re.search(regex, email)):
        return True

    else:
        return False


def validate(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
    body = {}
    response = {}
    status = 400
    headers = {
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Max-Age': '3600'
    }

    if request.method == 'OPTIONS':
        return ('', 204, headers)

    if request.method in ['GET', 'PUT', 'PATCH', 'DELETE']:
        body['error'] = 'Method not supported'
        return (json.dumps(body), 405, headers)

    headers['Access-Control-Max-Age'] = '1296000'
    headers['Content-Type'] = 'application/json'

    try:

        request_json = request.get_json()
        print("request", request.get_json())
        # return json.dumps(request_json), 200, headers
        first_name = request_json.get('firstName')
        last_name = request_json.get('lastName')
        username = request_json.get('username')
        university = request_json.get('university')
        password = request_json.get('password')
        confirm_password = request_json.get('confirmPassword')
        email = request_json.get('email')
        questions = request_json.get('questions')
        answers = request_json.get('answers')
        #
        remaining_fields = []
        illegal_fields = []
        valid = True
        #
        if not first_name:
            remaining_fields.append('First Name')
        if not last_name:
            remaining_fields.append('Last Name')
        if not username:
            remaining_fields.append('Username')
        if not university:
            remaining_fields.append('University')
        if not password:
            remaining_fields.append('Password')
        if not confirm_password:
            remaining_fields.append('Confirm Password')
        if not email:
            remaining_fields.append('Email')
        if not questions:
            remaining_fields.append('Questions')
        if not answers:
            remaining_fields.append('Answers')
        #
        if len(remaining_fields):
            print('inside remaining if')
            message = f'{", ".join(remaining_fields)} are required' if len(
                remaining_fields) > 1 else f'{",".join(remaining_fields)} is required'
            body['message'] = message
            print(message)
            status = 400
            valid = False
            return (json.dumps(body), status, headers)
        #     print("data valid")
        #
        if valid and not validate_email(email):
            message = "Email address invalid!"
            body['message'] = message
            print(message)
            status = 400
            valid = False
            return (json.dumps(body), status, headers)
            # print("email valid")
        #
        if valid and password != confirm_password:
            message = "Password and confirm password did not match!"
            body['message'] = message
            print(message)
            status = 400
            valid = False
            return (json.dumps(body), status, headers)
            # print("print password and confirm password matched")
        #
        if valid and col_ref.document(email).get().to_dict():
            message = f'Email "{email}" already exists!'
            body['message'] = message
            status = 409
            valid = False
            return (json.dumps(body), status, headers)
        #     print("Email new")
        #
        if valid:
            col_ref.document(email).set({
                "questions": questions,
                "answers": answers
            })
            body['message'] = 'Questions successfully stored'
            status = 201
            valid = True

            response=requests.post(LAMBDA_REGISTRATION_URI,
                                   data=json.dumps(request_json),
                                   headers={'Content-Type': 'application/json'}
                                   )

            return (json.dumps(body), status, headers)
        print("Stored")
        # return (json.dumps(body), status, headers)
    except Exception as e:
        print("Exception", str(e))
        body['exception'] = str(e)
        return json.dumps(body), 500, headers
