from google.cloud import pubsub_v1
from google.cloud import storage
import json

def hello_pubsub(event, context):
    try: 
        proj_id = "dallms-284316"
        sub_id = "recieve-msgs"
        ack=[]
        
        subscriber = pubsub_v1.SubscriberClient()
        subscription_path = subscriber.subscription_path(proj_id, sub_id)
        
        response = subscriber.pull(subscription_path, max_messages=5)
        content = []
        for msg in response.received_messages:
            x = msg.message.data.decode("utf-8")
            x = json.loads(x)
            content.append(x)
            print("Received message:",x)

        print('content')
        print(content)
        ack_ids = [msg.ack_id for msg in response.received_messages]
        subscriber.acknowledge(subscription_path, ack_ids)
        
        storage_client = storage.Client()

        bucket = storage_client.bucket('chat-module-dallms')
        blob = bucket.blob('message.json')
        blob.download_to_filename("/tmp/message.json")
        blob.delete()

        with open("/tmp/message.json") as json_file:
            data = json.load(json_file)

        data.append(x)

        with open("/tmp/message.json", 'w') as file:
            json.dump(data, file)

        destination = 'message.json'
        storage_client = storage.Client()
        bucket = storage_client.bucket('chat-module-dallms')
        blob = bucket.blob(destination)

        blob.upload_from_filename("/tmp/message.json")

    except Exception as e:
            print(e)
        
