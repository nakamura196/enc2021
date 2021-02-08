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

df = pd.read_excel("data/Liste bibliographique des ouvrages mentionnés dans le premier volume de l’Encyclopédie.xlsx", sheet_name=0, header=None, index_col=None, engine='openpyxl')

r_count = len(df.index)
c_count = len(df.columns)

auths = {}
titles = {}

for j in range(2, r_count):
    auth1 = df.iloc[j, 7]
    auth2 = df.iloc[j, 11]

    if not pd.isnull(auth1) and not pd.isnull(auth2):
      if auth1 not in auths:
        auths[auth1] = []

      arr = auths[auth1]
      if auth2 not in arr:
        arr.append(auth2)

    title1 = df.iloc[j, 8]
    title2 = df.iloc[j, 12]

    if not pd.isnull(title1) and not pd.isnull(title2):
      if title1 not in titles:
        titles[title1] = []

      arr = titles[title1]
      if title2 not in arr:
        arr.append(title2)


print(auths)

with open("../static/data/auteur.json", 'w') as outfile:
    json.dump(auths,  outfile, ensure_ascii=False,
            indent=4, sort_keys=True, separators=(',', ': '))

with open("../static/data/title.json", 'w') as outfile:
    json.dump(titles,  outfile, ensure_ascii=False,
            indent=4, sort_keys=True, separators=(',', ': '))