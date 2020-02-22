import re
import requests
import ujson as json
import datetime

from retriever.util import to_iri_id


FILENAME = "data/cache/lod-cloud/lod-data.json"

with open(FILENAME, "r") as f:
    json_data = json.load(f)

output_data = {
    "metadata": {
        "source_id": "lod-cloud",
        "source_website": "https://lod-cloud.net/",
        "source_iris": ["https://lod-cloud.net/versions/2019-03-29/lod-data.json"],
        "source_license": "CC-BY-4.0",
        "timestamp_retrieved": datetime.datetime.now().isoformat(),
    },
    "collection": [],
}

for i, (item_id, item) in enumerate(json_data.items()):
    if not item["website"]:
        continue

    v = {
        "uid": to_iri_id(item["website"]),
        "name": item["title"],
        "shortname": None,
        "website": item["website"],
        "tags": item["keywords"],
        "description": item["description"].get("en", ""),
        "license": None,
        "last_updated": None,
    }
    # print(v)
    output_data["collection"].append(v)

output_json = json.dumps(output_data, indent=2)

print(output_json)
