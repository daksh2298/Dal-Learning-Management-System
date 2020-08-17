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
        question = request_json.get('question')
        answer = request_json.get('answer')
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

        doc_ref = col_ref.document(email)
        doc = doc_ref.get().to_dict()
        if doc:
            questions = doc.get('questions')
            answers = doc.get('answers')
            if question in questions:
                question_index = questions.index(question)
                user_answer = answers[question_index]
                if user_answer == answer:
                    with connection.cursor() as cursor:
                        query = "SELECT * FROM `table_users` WHERE email=%s;"
                        cursor.execute(query, (email))
                        row=cursor.fetchone()
                        user_id=row[0]
                        connection.commit()

                        query = "UPDATE `table_user_state` SET `is_active` = '1' WHERE (`user_id` = %s);"
                        cursor.execute(query, (user_id))
                        connection.commit()
                    connection.close()
                    body['message'] = "Answer matched. 2FA successful!"
                    print(body)
                    status = 200
                    return (json.dumps(body), status, headers)

                else:
                    body['message'] = "Answer did not matched. Please try again!"
                    print(body)
                    status = 400
                    return (json.dumps(body), status, headers)
            else:
                body['message'] = "Question doesnot exist!"
                print(body)
                status = 404
                return (json.dumps(body), status, headers)
        else:
            body['message'] = "Email doesnot exist!"
            print(body)
            status = 404
            return (json.dumps(body), status, headers)
    except Exception as e:
        body['message'] = "Internal server error!"
        print(e)
        print(body)
        status = 500
        return (json.dumps(body), status, headers)
