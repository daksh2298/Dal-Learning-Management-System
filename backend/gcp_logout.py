__author__ = 'Daksh Patel'

from google.cloud import firestore
import json
from pymysql import connect

db = firestore.Client()
col_ref = db.collection('users')


def hello_world(request):
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
        email = request_json.get('email')

        try:
            connection = connect(host="dal-lms.ct6zqkhmnhh1.us-east-1.rds.amazonaws.com",
                                 user="admin",
                                 password="serverless",
                                 db="dal_lms"
                                 )
        except Exception as e:
            print(e)
            body['message'] = "Internal server error!"
            print(e)
            print(body)
            status = 500
            return (json.dumps(body), status, headers)

        with connection.cursor() as cursor:
            query = "SELECT * FROM `table_users` WHERE email=%s;"
            cursor.execute(query, (email))
            row=cursor.fetchone()
            if len(row):
                user_id=row[0]

                query = "UPDATE `table_user_state` SET `is_active` = '0' WHERE (`user_id` = %s);"
                cursor.execute(query, (user_id))
                connection.commit()
            else:
                body['message'] = "Email doesnot exists!"
                print(e)
                print(body)
                status = 404
                return (json.dumps(body), status, headers)


        connection.close()
        body['message'] = "Successfully logged out!"
        print(body)
        status = 200
        return (json.dumps(body), status, headers)

    except Exception as e:
        body['message'] = "Internal server error!"
        print(e)
        print(body)
        status = 500
        return (json.dumps(body), status, headers)
