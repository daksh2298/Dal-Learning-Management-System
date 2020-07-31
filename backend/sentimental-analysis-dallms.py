import json
import boto3
import urllib
import io

comprehend = boto3.client('comprehend')




def lambda_handler(event, context):
  
    try:
    
        storage_client = boto3.client(
        's3',
        endpoint_url='https://storage.googleapis.com',
        aws_access_key_id='GOOG1EABQEX5TALG554JJMSPNGRIGIM23HZFIL77UMAZZ5IEV3L5P6MZS4FII',
        aws_secret_access_key="hegJdAV/pKXa1BDFQA+Bu52f58iSRkMxT7WeUUcg")
        
        bucket = "chat-module-dallms"
        key = "message.json"
        response = storage_client.list_objects(Bucket="chat-module-dallms")
        
        # Print object names
        print("Objects:")
        for blob in response["Contents"]:
            print(blob)
       
        f = io.BytesIO()
        storage_client.download_fileobj(bucket, "message.json",f)
        
        s3 = boto3.resource('s3')
        obj = json.loads(f.getvalue().decode())
        list = []
        for message in obj:
            dict = {}
            message_text = message['message']
            sentiment=comprehend.detect_sentiment(Text=message_text,LanguageCode='en')['Sentiment']
            
            dict['username'] = message['username']
            dict['message'] = message_text
            dict['sentiment'] = sentiment
            list.append(dict)
        
        print(list)
        
        outputBucketName = 'tagged-chats'
        s3.Bucket(outputBucketName).put_object(Key=key, Body=json.dumps(list), ACL='public-read')
        
        headers = {
            'Access-Control-Allow-Origin': '*'
        }

        
        r = json.dumps({"result": "Performed Successfully"})
        return (r, 200, headers)
        

    except Exception as e:
        print(e)