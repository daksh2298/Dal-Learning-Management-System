__author__ = 'Daksh Patel'
import json
import time

import boto3
import hmac
import hashlib
import base64
import json
from pymysql import connect
import logging
logging.basicConfig(format='%(levelname)s:%(message)s', level=logging.DEBUG)

CLIENT_ID = "44b531knndifarunnohd2maqfn"
CLIENT_SECRET = "175pj65102p2ubs2e68aank40i5u7apms2802hpd8khr24dci36j"


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
    print(event)

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

    first_name = body['firstName']
    last_name = body['lastName']
    username = body['username']
    password = body['password']
    email = body['email']
    university = body['university']

    if university.lower().find("dal") != -1:
        uni_id = 1
    else:
        uni_id = 2
    print(body)
    print(email, get_secret_hash(email))
    try:
        response = client.sign_up(
            ClientId=CLIENT_ID,
            SecretHash=get_secret_hash(email),
            Username=email,
            Password=password,
            UserAttributes=[
                {
                    'Name': 'email',
                    'Value': email
                },
            ]
        )
        print(response)
        print('User saved in cognito')
        logging.info('User saved in cognito')
        print('Connecting to RDS')
        logging.info('Connecting to RDS')
        if response:
            logging.info('Connected to RDS')
            connection = connect(host="dal-lms.ct6zqkhmnhh1.us-east-1.rds.amazonaws.com",
                                 user="admin",
                                 password="serverless",
                                 db="dal_lms"
                                 )
            with connection.cursor() as cursor:
                logging.info('Cursor created')
                query = "INSERT INTO `table_users` (`first_name`, `last_name`, `username`, `email`, `password`, `role_id`, `uni_id`) VALUES (%s, %s, %s, %s, %s, %s, %s);"
                cursor.execute(query, (first_name, last_name, username, email, password, 1, uni_id))
                connection.commit()
                logging.info('Inserted user')
                latest_user_id = cursor.lastrowid
                logging.info('Last inserted user id: {}'.format(latest_user_id))
                current_timestamp = int(time.time())
                query = "INSERT INTO `table_user_state` (`is_active`, `last_active`, `user_id`) VALUES (%s, %s, %s);"
                cursor.execute(query, (1, current_timestamp, latest_user_id))
                logging.info('Inserted user state')
                connection.commit()
                body={"message": "Successfully Registered User!"}
            connection.close()
            body={}
            return {"statusCode": 200, "headers": headers, "body": json.dumps(body)}
        else:
            body["message"] = "Something went wrong!"
            return {"statusCode": 500, "headers": headers, "body": json.dumps(body)}

    except client.exceptions.UsernameExistsException as e:
        print(str(e))
        body = {"message": "Email already exists"}
        return {"statusCode": 409, "headers": headers, "body": json.dumps(body)}


    except client.exceptions.InternalErrorException as e:
        print(str(e))
        body = {"message": "Internal Server error!!!!"}
        return {"statusCode": 500, "headers": headers, "body": json.dumps(body)}

    except client.exceptions.InvalidPasswordException as e:
        print(str(e))
        body = {"message": "Password invalid"}
        return {"statusCode": 400, "headers": headers, "body": json.dumps(body)}

    except Exception as e:
        print(str(e))
        body = {"message": "Internal Server error!!!!!!"}
        return {"statusCode": 500, "headers": headers, "body": json.dumps(body)}

