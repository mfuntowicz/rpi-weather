from abc import ABC, abstractmethod
from enum import Enum
from typing import Dict, Tuple, Optional, Mapping
from pyhocon import ConfigTree

__author__ = 'Morgan Funtowicz'


class SensorKind(Enum):
    TEMPERATURE = 'temperature'
    PRESSURE = 'pressure'
    WIND = 'wind'


class Sensor(ABC):

    @property
    @abstractmethod
    def kind(self) -> Tuple[SensorKind, ...]:
        raise NotImplemented()

    @abstractmethod
    async def read(self) -> Dict[SensorKind, float]:
        raise NotImplemented()

    @abstractmethod
    def close(self) -> None:
        raise NotImplemented()


class SensorFactory(ABC):

    @abstractmethod
    def build_from_config(self, config: ConfigTree) -> Optional[Sensor]:
        raise NotImplemented()


_SENSORS_REGISTER: Mapping[str, SensorFactory] = {}
def register_sensor(name: str, factory: SensorFactory):
    if name in _SENSORS_REGISTER:
        raise KeyError("{} is already registered".format(name))

    _SENSORS_REGISTER[name] = factory


def get_sensor_from_config(name: str, config: ConfigTree) -> Sensor:
    if name not in _SENSORS_REGISTER:
        raise KeyError("{} is not a valid sensor identifier (valid identifiers are: {}"
                       .format(name, _SENSORS_REGISTER.keys()))

    return _SENSORS_REGISTER[name].build_from_config(config)

from .bmp280 import *
from .dummy import *