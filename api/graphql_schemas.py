import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField

from .models import KnowledgeBase as KnowledgeBaseModel


class KnowledgeBaseNode(SQLAlchemyObjectType):
    class Meta:
        model = KnowledgeBaseModel
        interfaces = (relay.Node,)


class KnowledgeBaseConnection(relay.Connection):
    class Meta:
        node = KnowledgeBaseNode


class Query(graphene.ObjectType):
    node = relay.Node.Field()
    all_knowledge_bases = SQLAlchemyConnectionField(KnowledgeBaseConnection)
    knowledge_base = graphene.Field(KnowledgeBaseNode, uid=graphene.String())

    def resolve_knowledge_base(self, info, uid):
        query = KnowledgeBaseNode.get_query(info)
        return query.filter(KnowledgeBaseModel.uid == uid).first()


schema = graphene.Schema(query=Query)
