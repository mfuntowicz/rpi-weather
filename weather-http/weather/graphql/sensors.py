from graphene import Boolean, ClientIDMutation, DateTime, Field, Float, List, ObjectType, Schema, String, relay
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField

from weather.data import session
from weather.data.sensors import SensorReadoutModel


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

    all_readouts = SQLAlchemyConnectionField(SensorReadout)
    all_readouts_of = List(SensorReadout, kind=String())
    all_readouts_of_between = List(SensorReadout, kind=String(), start=DateTime(), end=DateTime())

    def resolve_all_readouts_of(_, info, **kwargs):
        kind = kwargs['kind'].upper()

        # Get query and filter
        readouts_query = SensorReadout.get_query(info)
        return readouts_query.filter(
            SensorReadoutModel.kind.like(kind)
        ).order_by(SensorReadoutModel.created_at).all()

    def resolve_all_readouts_of_between(_, info, **kwargs):
        kind, start, end = kwargs['kind'].upper(), kwargs['start'], kwargs['end']

        # Get query and filter
        readouts_query = SensorReadout.get_query(info)
        return readouts_query.filter(
            SensorReadoutModel.kind.like(kind) &
            SensorReadoutModel.created_at.between(start, end)
        ).order_by(SensorReadoutModel.created_at).all()


class SensorReadoutMutation(ObjectType):
    createReadout = CreateReadout.Field()


schema = Schema(mutation=SensorReadoutMutation, query=SensorReadoutQuery, types=[SensorReadout])
