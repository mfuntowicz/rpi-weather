from abc import ABC, abstractmethod
from enum import Enum
from typing import Dict, Tuple, Optional
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


from .bmp280 import BMP280, BMP280_ULTRALOWPOWER, BMP280_STANDARD, BMP280_HIGHRES, BMP280_ULTRAHIGHRES
