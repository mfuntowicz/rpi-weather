from abc import abstractmethod, ABC
from typing import Dict

from pyhocon import ConfigTree

from weather.sensors import Sensor, SensorKind
from weather.utils import getLogger

OUTPUT_REGISTER = {}


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


class OutputBuilder(ABC):
    @abstractmethod
    def from_config(self, config: ConfigTree) -> Output:
        raise NotImplemented()


def create_output(name: str) -> OutputBuilder:
    if name in OUTPUT_REGISTER:
        return OUTPUT_REGISTER[name]

    raise KeyError('Output %s doesn\'t exist (available: %s)' % (name, list(OUTPUT_REGISTER.keys())))


from .console import ConsoleOutput, ConsoleOutputBuilder
from .graphql import GraphQLOutput, GraphQLOutputBuilder