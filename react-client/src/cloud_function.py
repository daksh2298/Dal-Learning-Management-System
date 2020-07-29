
# Validate
import json
from google.cloud import firestore

db = firestore.Client()
col_ref=db.collection('users')

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
    status=400
    headers = {
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Max-Age': '3600'
    }
    headers['Access-Control-Max-Age'] = '1296000'
    headers['Content-Type']= 'application/json'

    request_json = request.get_json()

    email=request_json.get('email')
    questions=request_json.get('questions')
    answers=request_json.get('answers')

    remaining_fields=[]

    if not email:
        remaining_fields.append('Email')
    if not questions:
        remaining_fields.append('Questions')
    if not answers:
        remaining_fields.append('Answers')

    if len(remaining_fields):
        print('inside remaining if')
        message=f'{",".join(remaining_fields)} are required' if len(remaining_fields)>1 else f'{",".join(remaining_fields)} is required'
        body['message']=message
        print(message)
        status=400

    elif col_ref.document(email).get().to_dict():
        message=f'Email "{email}" already exists!'
        body['message']=message
        status=409

    else:
        col_ref.document(email).set({
            "questions":questions,
            "answers":answers
        })
        body['message']='Questions successfully stored'
        status=201

    return (json.dumps(body), status, headers)


# get questions
