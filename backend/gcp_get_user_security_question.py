__author__ = 'Daksh Patel'

import os
from google.cloud import firestore
import json

db = firestore.Client()
col_ref=db.collection('users')

def hello_world(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
    request_json = request.get_json()
    email=request_json.get("email")
    if email:
        doc_ref=col_ref.document(email)
        if doc_ref.get().to_dict():
            return json.dumps(doc_ref.get().to_dict())
        else:
            return "Email doesnot exists"
    else:
        return "Email id is required"
