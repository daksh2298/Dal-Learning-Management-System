from google.cloud import storage
import json

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

    if request.method == 'GET':
        try:

            # Set CORS headers for the main request
            headers = {
                'Access-Control-Allow-Origin': '*'
            }

            storage_client = storage.Client()

            bucket = storage_client.bucket('chat-module-dallms')
            blob = bucket.blob('message.json')
            blob.download_to_filename("/tmp/message.json")

            with open("/tmp/message.json") as json_file:
                data = json.loads(json_file.read())

            print(data)

            r = json.dumps(data)

            return (r, 200, headers)

        except Exception as e:
            print(e)