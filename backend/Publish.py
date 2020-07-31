import os
from google.cloud import pubsub_v1
import json
from flask import jsonify 
import time

def hello_world(request):
    
    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        print("options")
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    if request.method == "POST":
        
        try:
            details = {}
            details['username'] = request.json['username']
            details['message'] = request.json['message']
            details['timestamp'] = request.json['timestamp']

            print(details)
            testAttribute = json.dumps(details)
            data = testAttribute.encode("utf-8")
            
            proj_id = "dallms-284316"
            topic_id = "MessageService"

            publisher = pubsub_v1.PublisherClient()
            topic_path = publisher.topic_path(proj_id, topic_id)

            future = publisher.publish(topic_path, data=data)
            headers = {
            'Access-Control-Allow-Origin': '*'
            }

            r = jsonify({"result": "Received Successfully"})
            return (r, 200, headers)
        except Exception as e:
            print(e)
        