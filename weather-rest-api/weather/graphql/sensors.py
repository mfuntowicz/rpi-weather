from graphene import List, ObjectType, Schema, relay
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField

from weather.data.sensors import SensorReadoutModel


class SensorReadout(SQLAlchemyObjectType):
    class Meta:
        model = SensorReadoutModel
        interfaces = (relay.Node, )


class SensorReadoutQuery(ObjectType):
    node = relay.Node()
    all_readouts = SQLAlchemyConnectionField(SensorReadout)


schema = Schema(query=SensorReadoutQuery)