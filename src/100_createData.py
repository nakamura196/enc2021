from bs4 import BeautifulSoup
import json
import glob
import urllib.parse
from rdflib import URIRef, BNode, Literal, Graph
from rdflib.namespace import RDF, RDFS, FOAF, XSD
from rdflib import Namespace
import pandas as pd
import numpy as np
import os
import requests

json_open = open('data/vol2_pattern.json', 'r')
json_load = json.load(json_open)

keys = list(json_load.keys())

for i in range(len(keys)):

  key = keys[i]

  source = json_load[key]

  if i != 0:
    source["prev"] = keys[i - 1]

  if i != len(keys) - 1:
    source["next"] = keys[i + 1]

  path = "../static/data/json/"+key+".json"

  with open(path, 'w') as outfile:
      json.dump(source,  outfile, ensure_ascii=False,
          indent=4, sort_keys=True, separators=(',', ': '))