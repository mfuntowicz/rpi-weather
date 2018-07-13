import asyncio

from graphene import Boolean,DateTime, Field, Float, List, Mutation, ObjectType, Schema, String, relay
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField

from weather.data import session
from weather.data.sensors import SensorReadoutModel


# In Memory pub-sub
class AsyncioPubsub(object):

    def __init__(self):
        self.subscriptions = {}
        self.sub_id = 0

    async def publish(self, channel, payload):
        if channel in self.subscriptions:
            for q in self.subscriptions[channel].values():
                await q.put(payload)

    def subscribe_to_channel(self, channel):
        self.sub_id += 1
        q = asyncio.Queue()
        if channel in self.subscriptions:
            self.subscriptions[channel][self.sub_id] = q
        else:
            self.subscriptions[channel] = {self.sub_id: q}
        return self.sub_id, q

    def unsubscribe(self, channel, sub_id):
        if sub_id in self.subscriptions.get(channel, {}):
            del self.subscriptions[channel][sub_id]


DEFAULT_PUB_SUB = AsyncioPubsub()


class SensorReadout(SQLAlchemyObjectType):
    class Meta:
        model = SensorReadoutModel
        interfaces = (relay.Node, )


class CreateReadout(Mutation):
    class Arguments:
        timestamp = DateTime(required=False)
        kind = String(required=True)
        value = Float(required=True)

    readout = Field(lambda: SensorReadout)
    ok = Boolean()

    @classmethod
    def mutate(cls, _, info, kind, value, timestamp=None):
        if timestamp is None:
            from datetime import datetime
            timestamp = datetime.utcnow()

        DEFAULT_PUB_SUB.publish('READOUTS', (timestamp, kind, value))
        readout = SensorReadoutModel(created_at=timestamp, kind=kind, value=value)
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


class SensorReadoutSubscription(ObjectType):
    readouts = Field(SensorReadout)

    async def resolve_readouts(self, info):
        try:
            # pubsub subscribe_to_channel method returns
            # subscription id and an asyncio.Queue
            sub_id, q = DEFAULT_PUB_SUB.subscribe_to_channel('READOUTS')
            while True:
                payload = await q.get()
                yield payload
        except asyncio.CancelledError:
            # unsubscribe subscription id from channel
            # when coroutine is cancelled
            DEFAULT_PUB_SUB.unsubscribe('READOUTS', sub_id)


schema = Schema(mutation=SensorReadoutMutation, query=SensorReadoutQuery,
                subscription=SensorReadoutSubscription, types=[SensorReadout])
