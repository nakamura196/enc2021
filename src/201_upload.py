import elasticsearch
from elasticsearch import Elasticsearch, RequestsHttpConnection, helpers
import json
import hashlib

indexes = ["main"]

es = Elasticsearch(["https://site:110dbe2d6c1517d6aa68c3e9f59496c0@gimli-eu-west-1.searchly.com:443"])

actions = []

main_path = "/Users/nakamurasatoru/git/d_omeka/omekac_kunshujo/docs/curation/test.json"

with open(main_path) as f:
    curation = json.load(f)

st_path = "/Users/nakamurasatoru/git/d_omeka/omekac_kunshujo/src/campus/data/structured.json"

with open(st_path) as f:
    st = json.load(f)

selections = curation["selections"]

for selection in selections:
    members = selection["members"]

    manifest = selection["within"]["@id"]
    label = selection["within"]["label"]

    for member in members:

        member_id = member["@id"]

        hash = hashlib.md5(member_id.encode('utf-8')).hexdigest()

        metadata = member["metadata"]

        tags = []
        mtags = []

        agentials = []
        places = []
        times = []
        keywords = []
        types = []
        orgs = []
        events = []

        for m in metadata:
            if m["label"] == "タグ":
                value = m["value"]
                tags.append(value)

                if value in st:
                    value2 = st[value]["uri"]
                    value2_sp = value2.split(":")
                    prefix = value2_sp[0]
                    value3 = value2_sp[1]

                    if prefix == "chname":
                        agentials.append(value3)
                    elif prefix == "keyword":
                        keywords.append(value3)
                    elif prefix == "place":
                        places.append(value3)
                    elif prefix == "time":
                        times.append(value3)
                    elif prefix == "type":
                        types.append(value3)
                    elif prefix == "event":
                        events.append(value3)
                    elif prefix == "org":
                        orgs.append(value3)

            if m["label"] == "機械タグ":
                mtags.append(m["value"])        

        '''
        member_id_spl = member_id.split("#xywh=")

        canvasId = member_id_spl[0]
        xywh = member_id_spl[1]

        related = "http://codh.rois.ac.jp/software/iiif-curation-viewer/demo/?manifest=" + manifest + "&canvas="+canvasId + "&xywh=" + xywh + "&xywh_highlight=border"
        '''

        obj = {
            # "id": hash,
            "_label": [member["label"]],
            "tags": tags,
            "mtags" : mtags,
            "_thumbnail": [member["thumbnail"]],
            "manifest" : [manifest],
            "member" : [member_id],
            "label" : [label],
            "agentials" : agentials,
            "keywords" : keywords,
            "places" : places,
            "times" : times,
            "events" : events,
            "orgs" : orgs,
            "type" : types,
            "_url" : ["https://kunshujo.web.app/item/"+hash],
            
        }

        if "images" in member:
            images = []
            for image in member["images"]:
                images.append(hashlib.md5(image.encode('utf-8')).hexdigest())
            obj["images"] = images[0:10] # 5

        actions.append({
            "_index": "main",
            "_id": hash,
            "_source" : obj
        })


res = elasticsearch.helpers.streaming_bulk(client=es, actions=actions, chunk_size=1000, max_retries=5,
                                                    initial_backoff=2, max_backoff=600, request_timeout=3600)

for ok, response in res:
    print(ok, response)

with open("data/es.json", 'w') as outfile:
    json.dump(actions, outfile, ensure_ascii=False,
                indent=4, sort_keys=True, separators=(',', ': '))