import click
from collections import defaultdict
import meilisearch
import ujson as json
import logging
from pathlib import Path
from tinydb import TinyDB, Query
from tinydb.storages import MemoryStorage


from api.models import Identifiable
from api.database import db_session

logger = logging.getLogger(__name__)
logger.addHandler(logging.StreamHandler())

client = meilisearch.Client("http://127.0.0.1:7700")

KB_INDEX_UID = "knowledge_bases"
KB_SCHEMA = {
    "uid": ["displayed", "identifier"],
    "name": ["displayed", "indexed"],
    "shortname": ["displayed", "indexed"],
    "tags": ["displayed", "indexed"],
    "website": ["displayed"],
    "description": ["displayed", "indexed"],
    "sources": ["displayed"],
}


INDEX_INDEX_UID = "index"
INDEX_SCHEMA = {
    "uid": ["displayed"],
    "iri": ["displayed", "indexed", "identifier"],
    "_labels": ["displayed", "indexed"],
    "_descriptions": ["indexed"],
}


def normalize(d, schema):
    r = {}
    for k, v in d.items():
        if k in schema and "indexed" in schema[k]:
            if v is None:
                r[k] = ""
            # elif isinstance(v, list):
            #     r["_" + k] = " ".join(v)
            else:
                r[k] = v
        else:
            r[k] = v
    return r


@click.group()
def cli():
    pass


@cli.command(name="reset_kb")
def reset_kb():
    try:
        index = client.get_index(KB_INDEX_UID)
        index.delete()
    except Exception:
        pass
    finally:
        index = client.create_index(
            name="knowledge_bases", uid=KB_INDEX_UID, schema=KB_SCHEMA
        )


@cli.command(name="reset_index")
def reset_index():
    try:
        index = client.get_index(INDEX_INDEX_UID)
        index.delete()
    except Exception:
        pass
    finally:
        index = client.create_index(
            name="index", uid=INDEX_INDEX_UID, schema=INDEX_SCHEMA
        )


@cli.command(name="import_kb")
@click.argument("source_dir")
def import_kb(source_dir):
    index = client.get_index(KB_INDEX_UID)

    db = TinyDB(storage=MemoryStorage)
    KB = Query()

    source_dir = Path(source_dir)
    for filename in source_dir.glob("**/*.json"):
        with open(filename, "r") as f:
            data = json.load(f)

        source_id = data["metadata"]["source_id"]
        collection_normalized = [normalize(v, KB_SCHEMA) for v in data["collection"]]

        for _item in collection_normalized:
            item = db.get(KB.uid == _item["uid"])
            item = item if item is not None else _item
            if "sources" in item:
                item["sources"] = list(set(item["sources"]) | set([source_id]))
            else:
                item.update({"sources": [source_id]})
            db.upsert(item, KB.uid == item["uid"])

    resp = index.add_documents(db.all())
    logger.info(resp)


@cli.command(name="import_index")
def import_index():
    index = client.get_index(INDEX_INDEX_UID)

    collection = []

    rows = db_session.query(Identifiable)
    for i, row in enumerate(rows):
        if i < 11700:
            continue

        if i % 100 == 0:
            if collection:
                collection_normalized = [normalize(v, INDEX_SCHEMA) for v in collection]
                print(collection_normalized)
                resp = index.add_documents(collection_normalized)
                print([i, resp])
            else:
                print(i)
            collection = []

        # print(row.iri, row.labels, row.descriptions)
        _labels = list(set([v.literal for v in row.labels]))
        _descriptions = list(set([v.literal for v in row.descriptions]))

        if not _labels and not _descriptions:
            continue

        v = {
            "uid": row.uid,
            "iri": row.iri,
            "_labels": _labels,  # "\n".join(_labels),
            "_descriptions": _descriptions,  # "\n".join(_descriptions),
        }
        collection.append(v)

        # print(v)


if __name__ == "__main__":
    cli()
