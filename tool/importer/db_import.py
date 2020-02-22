import click
from pathlib import Path
import ujson as json

from api.database import engine, db_session, Base
from api.models import KnowledgeBase

Base.metadata.create_all(bind=engine)


@click.group()
def cli():
    pass


@cli.command(name="import_kb")
@click.argument("source_dir")
@click.argument("metadata_dir")
def import_kb(source_dir, metadata_dir):

    metadata = {
        "total_count": None,
        "sources": [],
    }

    source_dir = Path(source_dir)
    for filename in source_dir.glob("**/*.json"):
        with open(filename, "r") as f:
            data = json.load(f)

        # TODO: Fix
        source_id = data["metadata"]["source_id"]

        source_metadata = data["metadata"]
        metadata["sources"].append(source_metadata)

        for item in data["collection"]:
            obj = KnowledgeBase(**item, sources=[source_id])
            db_session.add(obj)

        db_session.commit()

    metadata["total_count"] = db_session.query(KnowledgeBase.uid).count()

    with open(Path(metadata_dir).joinpath("./kb_metadata.json"), "w") as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    cli()
