import re


def to_iri_id(iri):
    iri = re.sub(r"^.*://", "", iri)
    iri = re.sub(r"#$", "", iri)
    iri = re.sub(r"\/+$", "", iri)
    return iri
