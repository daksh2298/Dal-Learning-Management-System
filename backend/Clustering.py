from google.cloud import storage
import pickle
from scipy.spatial import distance
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

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    # bucket_name = "your-bucket-name"

    storage_client = storage.Client()



    #start
    print(request)
    username = str(request.args.get('username'))

    bucket_name = 'user-bucket-' + username

    #end

    #bucket_name = 'clustering-files'





    # Note: Client.list_blobs requires at least package version 1.17.0.
    blobs = storage_client.list_blobs(bucket_name)


    documents = {}

    for blob in blobs:
        filename = '/tmp/' + blob.name
        blob.download_to_filename(filename)

        with open(filename) as file:
            documents[filename] = file.read()

    bucket = storage_client.get_bucket('dal-lms-ml-model')
    blob = bucket.blob('model.pkl')
    blob.download_to_filename('/tmp/ml-model.pkl')
    blob = bucket.blob('countvector.pkl')
    blob.download_to_filename('/tmp/ml-countvector.pkl')

    model = ""
    vectorizer = ""

    with open('/tmp/ml-model.pkl', 'rb') as file:
        model = pickle.load(file)

    with open('/tmp/ml-countvector.pkl', 'rb') as file:
        vectorizer = pickle.load(file)

    documents_vector = {}
    for k, v in documents.items():
        documents_vector[k] = vectorizer.transform([documents[k]]).toarray()[0]

    number_of_clusters = 20
    centroids = model.cluster_centers_.argsort()[:, ::-1]
    terms = vectorizer.get_feature_names()

    doc_cluster_map = {}
    num_terms_show = 10

    for k, v in documents_vector.items():
        cluster_number = 0
        min_diff = distance.euclidean(v,centroids[0])
        for i in range(0,len(centroids)):
            diff = distance.euclidean(v,centroids[i])
            if(diff<=min_diff):
                cluster_number = i
        terms_match = []
        for ind in centroids[cluster_number, :num_terms_show]:
            terms_match.append(terms[ind])
        doc_cluster_map[k] = (cluster_number,terms_match)
    result = {}
    for k,v in doc_cluster_map.items():
        cluster = str(v[0])
        filename = str(k)
        f = filename.split('/')

        if cluster in result:
            list = result[cluster]
            list.append(f[2])
            result[cluster] = list
        else:
            list = []
            list.append(f[2])
        result[cluster] = list

        #print(result)

        #print("Filename: "+str(k))
        #print("Cluster assigned: "+str(v[0]))
        #print("Some terms in cluster: "+str(v[1]))

    r = json.dumps(result)
    return (r, 200, headers)
    
