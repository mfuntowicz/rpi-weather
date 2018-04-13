from abc import abstractmethod, ABC
from typing import Dict

from weather.sensors import Sensor, SensorKind
from weather.utils import getLogger


class Output(ABC):
    def __init__(self):
        self._logger = getLogger(self.__class__.__name__)

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        return self

    @property
    @abstractmethod
    def name(self) -> str:
        raise NotImplemented()

    @abstractmethod
    async def save(self, sensor: Sensor, readouts: Dict[SensorKind, float]) -> None:
        raise NotImplemented()


class ConsoleOutput(Output):

    @property
    def name(self) -> str:
        pass

    async def save(self, sensor: Sensor, readouts: Dict[SensorKind, float]) -> None:
        print('%r(%s)' % (sensor, ", ".join(['%s: %.2f' %(kind, value) for kind, value in readouts.items()])))