from datetime import datetime
from typing import Dict

from aiohttp import ClientSession
from pyhocon import ConfigTree

from weather.outputs import Output, OutputBuilder, OUTPUT_REGISTER
from weather.sensors import Sensor, SensorKind
from weather.utils import OUTPUT_LOGGER


class HttpOutput(Output):

    HTTP_OUTPUT_NAME = 'http'

    def __init__(self, url: str):
        super().__init__()
        self.url = url if url.startswith('http') else 'http://' + url

    @property
    def name(self) -> str:
        return HttpOutput.HTTP_OUTPUT_NAME

    async def save(self, sensor: Sensor, readouts: Dict[SensorKind, float]) -> None:
        if len(readouts) == 0:
            OUTPUT_LOGGER.warn('Received save request with 0 readouts')
            return

        async with ClientSession() as session:
            payload = [{
                "kind": kind.value.upper(),
                "created_at": datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
                "readout": value
            } for kind, value in readouts.items()]

            async with session.post(url=self.url, json=payload) as response:
                await response.text()


class HttpOutputBuilder(OutputBuilder):

    def from_config(self, config: ConfigTree) -> Output:
        if 'endpoint' not in config:
            raise ValueError('You need to provide an endpoint entry in the configuration file')

        return HttpOutput(config['endpoint'])


# Register output
OUTPUT_REGISTER['http'] = HttpOutputBuilder()
