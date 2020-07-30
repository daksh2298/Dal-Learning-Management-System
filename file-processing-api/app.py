from io import BytesIO
from flask import Flask, render_template, send_file
import boto3
import configparser
import os
import nltk
from wordcloud import WordCloud
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

app = Flask(__name__)

config = configparser.ConfigParser()
config.read('config.ini')
bucket_name = 'lms-data-files'

s3_client = boto3.client(
    's3',
    aws_access_key_id=config['default']['aws_access_key_id'],
    aws_secret_access_key=config['default']['aws_secret_access_key'],
    aws_session_token=config['default']['aws_session_token']
)

s3_resource = boto3.resource(
    's3',
    aws_access_key_id=config['default']['aws_access_key_id'],
    aws_secret_access_key=config['default']['aws_secret_access_key'],
    aws_session_token=config['default']['aws_session_token']
)

downloaded_files = []
lines = []
heading = "Word cloud"


def download_file_with_client(client, bucket_name, key, local_path):
    client.download_file(bucket_name, key, local_path)
    downloaded_files.append(local_path)
    print('Downloaded file with boto3 client')


def download_all_files(client, resource, bucket_name):
    bucket = resource.Bucket(bucket_name)
    for obj in bucket.objects.all():
        file_name = obj.key
        arr_file = file_name.split('/')
        arr_file_ext = file_name.split('.')
        local_filename = arr_file[len(arr_file) - 1]
        file_ext = arr_file_ext[len(arr_file_ext) - 1]
        if file_ext in ["txt", "csv"]:
            print('downloading %s', file_name)
            download_file_with_client(client, bucket_name, file_name, local_filename)


@app.route('/wordcloud')
def create_word_cloud():
    filtered_entities = []
    nltk.download('stopwords')
    nltk.download('punkt')
    download_all_files(s3_client, s3_resource, bucket_name)
    for file in downloaded_files:
        file = open(file, "r")
        arr_line = file.readlines()
        str_line = " ".join(arr_line)
        lines.append(str_line)
    text = " ".join(lines)
    stop_words = set(stopwords.words('english'))
    word_tokens = word_tokenize(text)

    # Remove Stop words
    filtered_sentence = [w for w in word_tokens if w not in stop_words]
    for word in filtered_sentence:
        if word[0].isupper():
            filtered_entities.append(word)

    # Generate a word cloud image
    wordcloud = WordCloud(min_font_size=10,
                          width=450,
                          height=500,
                          repeat=True
                          )
    wordcloud.generate(" ".join(filtered_entities))
    img = BytesIO()
    filename = wordcloud.to_image()
    filename.save(img, 'PNG')
    img.seek(0)
    return send_file(img, mimetype='image/png')


@app.route('/')
def index():
    return render_template("index.html", text=heading)


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5050)))
