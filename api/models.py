from sqlalchemy import (
    Boolean,
    Column,
    Date,
    ForeignKey,
    Integer,
    String,
    JSON,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from .database import Base


class KnowledgeBase(Base):
    __tablename__ = "knowledge_base"

    uid = Column(
        String, primary_key=True, index=True, sqlite_on_conflict_primary_key="REPLACE"
    )
    name = Column(String, index=True)
    shortname = Column(String, index=True)
    website = Column(String, index=True)
    description = Column(String, index=True)
    license = Column(String, index=True)
    last_updated = Column(Date, index=True)
    tags = Column(JSON, index=True)
    sources = Column(JSON, index=True)


class Identifiable(Base):
    __tablename__ = "identifiable"

    uid = Column(Integer, primary_key=True, index=True, autoincrement=True)
    iri = Column(String, unique=True, index=True)

    labels = relationship("IdentifiableLabel", back_populates="identifiable")
    descriptions = relationship(
        "IdentifiableDescription", back_populates="identifiable"
    )


class IdentifiableLabel(Base):
    __tablename__ = "identifiable_label"
    __table_args__ = (UniqueConstraint("identifiable_iri", "literal", "lang", "kb_uid"),)

    uid = Column(Integer, primary_key=True, autoincrement=True)
    identifiable_iri = Column(String, ForeignKey("identifiable.iri"))
    literal = Column(String, index=True)
    lang = Column(String, index=True)
    kb_uid = Column(String, index=True)

    identifiable = relationship("Identifiable", back_populates="labels")


class IdentifiableDescription(Base):
    __tablename__ = "identifiable_description"
    __table_args__ = (UniqueConstraint("identifiable_iri", "literal", "lang", "kb_uid"),)

    uid = Column(Integer, primary_key=True, autoincrement=True)
    identifiable_iri = Column(String, ForeignKey("identifiable.iri"))
    literal = Column(String, index=True)
    lang = Column(String, index=True)
    kb_uid = Column(String, index=True)

    identifiable = relationship("Identifiable", back_populates="descriptions")
