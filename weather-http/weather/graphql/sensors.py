from graphene import Boolean, ClientIDMutation, DateTime, Field, Float, ObjectType, Schema, String, relay
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField

from weather.data import session
from weather.data.sensors import SensorReadoutModel


class FilterableConnectionField(SQLAlchemyConnectionField):
    RELAY_ARGS = ['first', 'last', 'before', 'after']

    @classmethod
    def get_query(cls, model, info, **args):
        query = super(FilterableConnectionField, cls).get_query(model, info, **args)
        for field, value in args.items():
            if field not in cls.RELAY_ARGS:
                query = query.filter(getattr(model, field) == value)
        return query


class SensorReadout(SQLAlchemyObjectType):
    class Meta:
        model = SensorReadoutModel
        interfaces = (relay.Node, )


class CreateReadout(ClientIDMutation):
    class Input(object):
        timestamp = DateTime(required=False)
        kind = String(required=True)
        value = Float(required=True)

    readout = Field(SensorReadout)
    ok = Boolean()

    @classmethod
    def mutate(cls, _, info, input):
        if 'timestamp' not in input:
            from datetime import datetime
            input['timestamp'] = datetime.utcnow().isoformat()

        readout = SensorReadoutModel(created_at=input.get('timestamp'), kind=input.get('kind'), value=input.get('value'))
        session.add(readout)
        session.commit()
        ok = True
        return CreateReadout(readout=readout, ok=ok)


class SensorReadoutQuery(ObjectType):
    node = relay.Node.Field()
    readouts = FilterableConnectionField(SensorReadout, created_at=DateTime(), kind=String())


class SensorReadoutMutation(ObjectType):
    createReadout = CreateReadout.Field()


schema = Schema(mutation=SensorReadoutMutation, query=SensorReadoutQuery, types=[SensorReadout])
