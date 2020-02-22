from fastapi import FastAPI
import meilisearch
from starlette.graphql import GraphQLApp
from starlette.middleware.cors import CORSMiddleware
from typing import Optional
from tinydb import TinyDB
import ujson as json

from . import models, graphql_schemas
from .database import engine, db_session

models.Base.metadata.create_all(bind=engine)

client = meilisearch.Client("http://127.0.0.1:7700")
index = client.get_index("knowledge_bases")

KB_METADATA_FILENAME = "./data/kb_metadata.json"
with open(KB_METADATA_FILENAME) as f:
    kb_metadata = json.load(f)

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_route("/api/graphql", GraphQLApp(schema=graphql_schemas.schema))


@app.on_event("shutdown")
def shutdown_session():
    db_session.remove()


@app.get("/api/search")
def search(q: Optional[str] = None, skip: int = 0):
    if not q:
        resp = {"hits": index.get_documents({"offset": skip, "limit": 10})}
    else:
        resp = index.search({"q": q, "offset": skip, "limit": 10})
    return resp


@app.get("/api/kb/metadata/total_count")
def kb_sources():
    resp = kb_metadata["total_count"]
    return {"total_count": resp}


@app.get("/api/kb/metadata/sources")
def kb_sources():
    resp = kb_metadata["sources"]
    return resp
