import elasticsearch
from elasticsearch import Elasticsearch, RequestsHttpConnection

indexes = ["main"]

def main(INDEX):

  es = Elasticsearch(["https://site:110dbe2d6c1517d6aa68c3e9f59496c0@gimli-eu-west-1.searchly.com:443"])

  mapping = {
    "mappings": {
      "properties": {
        "after": {
          "type": "integer"
        },
        "before": {
          "type": "integer"
        }
      },
      
      "dynamic_templates": [
          {
              "my_dynamic_ja_analyzer_conf": {
                  "match_mapping_type": "*",
                  "match": "*",
                  "mapping": {
                      "analyzer": "my_ja_analyzer_conf",
                      "fields": {
                          "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                              }
                      }
                  }
              }
          }
          
      ]
    },
    "settings": {
      "analysis": {
        "analyzer": {
          "my_ja_analyzer_conf": {
            "type": "custom",
            "tokenizer": "kuromoji_tokenizer",
            "mode": "search",
            "char_filter": [
              "icu_normalizer",
              "kuromoji_iteration_mark"
            ],
            "filter": [
              "kuromoji_baseform",
              "kuromoji_part_of_speech",
              "ja_stop",
              "lowercase",
              "kuromoji_stemmer",
              "asciifolding"
            ]
          }
        },
        "char_filter" : {
        }
      }
    }
  }

  if es.indices.exists(index=INDEX):
      es.indices.delete(INDEX)
  es.indices.create(index=INDEX, body=mapping)



for INDEX in indexes:
  main(INDEX)