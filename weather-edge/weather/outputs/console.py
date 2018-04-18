from pyhocon import ConfigTree
from typing import Dict

from weather.outputs import OutputBuilder, Output, OUTPUT_REGISTER
from weather.sensors import Sensor, SensorKind


class ConsoleOutput(Output):

    @property
    def name(self) -> str:
        return 'console'

    async def save(self, sensor: Sensor, readouts: Dict[SensorKind, float]) -> None:
        print('%r(%s)' % (sensor, ", ".join(['%s: %.2f' %(kind, value) for kind, value in readouts.items()])))


class ConsoleOutputBuilder(OutputBuilder):
    def from_config(self, config: ConfigTree) -> Output:
        from weather.utils.logging import OUTPUT_LOGGER
        OUTPUT_LOGGER.debug('Allocating ConsoleOutput')

        return ConsoleOutput()


# Register output
OUTPUT_REGISTER['console'] = ConsoleOutputBuilder()