from asyncio import gather
from datetime import datetime
from typing import Dict

from gql import Client, gql
from gql.transport.requests import RequestsHTTPTransport
from pyhocon import ConfigTree

from weather.outputs import Output, OutputBuilder, OUTPUT_REGISTER
from weather.sensors import Sensor, SensorKind
from weather.utils import OUTPUT_LOGGER


class GraphQLOutput(Output):

    NAME = 'GraphQLOutput'
    _CREATE_READOUT = 'mutation{ createReadout(timestamp: "%s", kind: "%s", value: %.3f){ ok }}'

    def __init__(self, endpoint):
        super().__init__()
        self._endpoint = endpoint

        self._client = Client(
            transport=RequestsHTTPTransport(url=self._endpoint, use_json=True),
            fetch_schema_from_transport=True
        )

        OUTPUT_LOGGER.info('Created GraphQLOutput bound to %s' % endpoint)

    @property
    def name(self) -> str:
        return GraphQLOutput.NAME

    async def save(self, sensor: Sensor, readouts: Dict[SensorKind, float]) -> None:
        if len(readouts) == 0:
            OUTPUT_LOGGER.warn('Received save request with 0 readouts')
            return

        OUTPUT_LOGGER.info('About to send %d mutations to %s', len(readouts), self._endpoint)

        when = datetime.utcnow().isoformat()
        starting_time = datetime.timestamp(datetime.utcnow())
        await gather(*[self._mutate(when, kind, value) for kind, value in readouts.items()])

        ending_time = datetime.timestamp(datetime.utcnow())
        OUTPUT_LOGGER.info('%d mutations sent in %dms', len(readouts), ending_time - starting_time)

    async def _mutate(self, when: str, kind: SensorKind, value: float):
        OUTPUT_LOGGER.debug('Executing createReadout mutation query with params: (%s, %s, %.4f)', when, kind, value)
        try:
            payload = gql(GraphQLOutput._CREATE_READOUT % (when, kind.name, value))
            self._client.execute(payload)
        except Exception as e:
            OUTPUT_LOGGER.warn('Error occur while executing createReadout mutation query: %s', e)
            return await None


class GraphQLOutputBuilder(OutputBuilder):

    def from_config(self, config: ConfigTree) -> Output:
        if 'endpoint' not in config:
            raise ValueError('You need to provide an endpoint entry in the configuration file')

        return GraphQLOutput(config['endpoint'])


# Register output
OUTPUT_REGISTER['graphql'] = GraphQLOutputBuilder()
