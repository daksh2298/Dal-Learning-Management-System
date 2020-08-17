__author__ = 'Daksh Patel'
import boto3
import hmac
import hashlib
import base64
import json
import requests
import random

CLIENT_ID="44b531knndifarunnohd2maqfn"
CLIENT_SECRET="175pj65102p2ubs2e68aank40i5u7apms2802hpd8khr24dci36j"

def get_secret_hash(username):
    # A keyed-hash message authentication code (HMAC) calculated using
    # the secret key of a user pool client and username plus the client
    # ID in the message.
    message = username + CLIENT_ID
    dig = hmac.new(bytes(CLIENT_SECRET.encode('utf-8')), msg=message.encode('UTF-8'),
                   digestmod=hashlib.sha256).digest()
    return base64.b64encode(dig).decode()

def lambda_handler(event, context):
    client = boto3.client('cognito-idp')
    print('evemt',event)

    headers = {}
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Content-Type'] = 'application/json'

    request_body=event.get("body")

    if type(request_body)==str:
        body=json.loads(request_body)
    elif type(request_body)==dict:
        body=request_body
    else:
        body={"message":"Request None"}
        return {"statusCode": 400, "headers": headers, "body": json.dumps(body)}

    email=body['email']
    password=body['password']
    print(email, password)
    headers = {}
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Content-Type'] = 'application/json'
    try:

        response = client.initiate_auth(
            AuthFlow='USER_PASSWORD_AUTH',
            AuthParameters={
                'USERNAME': email,
                'PASSWORD':password,
                "SECRET_HASH":get_secret_hash(email)
            },
            ClientId=CLIENT_ID
        )
        print(response)
        if response['ResponseMetadata']['HTTPStatusCode']==200:
            url="https://us-central1-dallms-283403.cloudfunctions.net/getUserSecurityQuestions"
            payload = {
                "email":email
            }

            response = requests.post(url, data=json.dumps(payload), headers={'Content-Type': 'application/json'})
            print(response.content)
            response_json=json.loads(response.content)

            question=response_json['questions'][random.randint(0,2)]

            return {"statusCode":200,"headers":headers, "body":json.dumps({"question":question})}

        else:
            return  response
    except client.exceptions.NotAuthorizedException as e:
        print(e)
        return {"statusCode":409,"headers":headers, "body":json.dumps({"message":str(e)})}

    except Exception as e:
        return {"statusCode":500,"headers":headers, "body":json.dumps({"message":str(e)})}