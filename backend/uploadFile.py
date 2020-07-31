from google.cloud import storage
from flask import jsonify 

def hello_world(request):
    print(request.form)
    headers = {
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Max-Age': '3600'
    }
    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        print("options")
        f = request.files['fileToUpload']
        
        """Uploads a file to the bucket."""
       
        print(request)

        dir = '/tmp/' + f.filename
        f.save(dir)

        username = request.form['username']
        bucket_name = 'user-bucket-' + username
        storage_client = storage.Client()

        buckets_list = storage_client.list_buckets()

        buckets = []
        for bucket in buckets_list:
            buckets.append(bucket.name)
        print(buckets)
        if bucket_name not in buckets:
            print("bucket does not exist")
            bucket = storage_client.create_bucket(bucket_name)
       

        source_file_name = f.filename
        destination_blob_name = f.filename
        storage_client = storage.Client()
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(destination_blob_name)

        blob.upload_from_filename(dir)

        # headers = {
        # 'Access-Control-Allow-Origin': '*'
        # }

        r = jsonify({"result": "Uploaded Successfully"})
        return (r, 200, headers)
        # return ('', 204, headers)

    headers['Access-Control-Max-Age'] = '1296000'
    headers['Content-Type'] = 'application/json'

    if request.method == 'POST':
        print("post request")
        f = request.files['fileToUpload']
        
        """Uploads a file to the bucket."""
       
        print(request)

        dir = '/tmp/' + f.filename
        f.save(dir)

        username = request.form['username']
        bucket_name = 'user-bucket-' + username
        storage_client = storage.Client()

        buckets_list = storage_client.list_buckets()

        buckets = []
        for bucket in buckets_list:
            buckets.append(bucket.name)
        print(buckets)
        if bucket_name not in buckets:
            print("bucket does not exist")
            bucket = storage_client.create_bucket(bucket_name)
       

        source_file_name = f.filename
        destination_blob_name = f.filename
        storage_client = storage.Client()
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(destination_blob_name)

        blob.upload_from_filename(dir)

        # headers = {
        # 'Access-Control-Allow-Origin': '*'
        # }

        r = jsonify({"result": "Uploaded Successfully"})
        return (r, 200, headers)

        
  
    

 

