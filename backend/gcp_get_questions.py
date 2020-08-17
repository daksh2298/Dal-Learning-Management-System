__author__ = 'Daksh Patel'
import json
from google.cloud import firestore

db = firestore.Client()
col_ref=db.collection('questions')

def getQuestions(request):
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


    # if request.method == 'POST':
    docs=col_ref.stream()
    questions={}
    for doc in docs:
        questions[doc.id]=doc.to_dict()['question']
    return (json.dumps(questions), 200, headers)


    # else:
    #     return ("Method not allowed", 400, headers)
