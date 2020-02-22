from rdflib import Graph, RDF, RDFS, Literal, URIRef
import re
import requests
import ujson as json
import datetime

from retriever.util import to_iri_id


FILENAME = "data/cache/lov/lov.n3"

output_data = {
    "metadata": {
        "source_id": "lov",
        "source_website": "https://lov.linkeddata.es/",
        "source_iris": ["https://lov.linkeddata.es/lov.n3.gz"],
        "source_license": "CC-BY-4.0",
        "timestamp_retrieved": datetime.datetime.now().isoformat(),
    },
    "collection": [],
}


g = Graph()
g.parse(FILENAME, format="n3")

for s, p, _ in g.triples(
    (None, RDF.type, URIRef("http://purl.org/vocommons/voaf#Vocabulary"))
):
    website = re.sub(r"<(.*)>", r"\1", s.n3())
    uid = to_iri_id(website)

    name = None
    for o in g.objects(s, URIRef("http://purl.org/dc/terms/title")):
        if o.language == "en" or o.language == None:
            name = o.value
            break

    tags = []
    for o in g.objects(s, URIRef("http://www.w3.org/ns/dcat#keyword")):
        tags.append(o.value)

    description = None
    for o in g.objects(s, URIRef("http://purl.org/dc/terms/description")):
        if o.language == "en" or o.language == None:
            description = o.value
            break

    v = {
        "uid": uid,
        "name": name,
        "shortname": None,
        "website": website,
        "tags": tags,
        "description": description,
        "license": None,
        "last_updated": None,
    }
    # print(v)
    output_data["collection"].append(v)

output_json = json.dumps(output_data, indent=2)

print(output_json)
