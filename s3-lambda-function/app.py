import json

import json
import urllib.parse
import boto3
import os

s3 = boto3.client('s3')


def file_tag(ext):
    switcher = {
        '.txt': 'Text File',
        '.csv': 'Comma Separated File',
        '.doc': 'Document',
        '.docx': 'Document',
        '.pdf': 'PDF Document',
        '.png': 'Image',
        '.jpeg': 'Image',
        '.zip': 'Archive file',
        '.jpg': 'Image'
    }
    return switcher.get(ext, "Invalid file format")


def lambda_handler(event, context):
    print("Recevied event: " + json.dumps(event, indent=2))
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')

    file_ext = os.path.splitext(key)[1]
    print(file_ext)
    tagValue = file_tag(file_ext.lower())
    tagName = "Category"

    try:
        response = s3.put_object_tagging(
            Bucket=bucket,
            Key=key,
            Tagging={
                'TagSet': [
                    {
                        'Key': tagName,
                        'Value': str(tagValue)
                    },
                ]
            }
        )
    except Exception as e:
        print(e)
        print('Error applying tag {} to {}.'.format(tagName, key))
        raise e

