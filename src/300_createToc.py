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

map = {}

for i in range(1, 18):

  map[i] = []
  print(i)
  url = "https://fr.wikisource.org/wiki/L%E2%80%99Encyclop%C3%A9die/1re_%C3%A9dition/Volume_{}".format(i)

  soup = BeautifulSoup(requests.get(url).text, "lxml")

  lis = soup.find(class_="mw-parser-output").find_all("li")

  for li in lis:

    map[i].append({
      "url" : li.find("a").get("href"),
      "label" : li.find("a").text
    })

with open("data/toc.json", 'w') as outfile:
    json.dump(map,  outfile, ensure_ascii=False,
        indent=4, sort_keys=True, separators=(',', ': '))