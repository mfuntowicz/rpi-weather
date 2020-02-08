from random import random
from typing import Dict, Tuple, Optional

from pyhocon import ConfigTree

from weather.sensors import Sensor, SensorKind, register_sensor, SensorFactory


class DummySensor(Sensor):

    def __init__(self, kinds: Tuple[SensorKind]=None):
        if kinds is None:
            kinds = (SensorKind.TEMPERATURE, SensorKind.PRESSURE, SensorKind.WIND)

        self._kinds = kinds

    @property
    def kind(self) -> Tuple[SensorKind, ...]:
        return self._kinds

    async def read(self) -> Dict[SensorKind, float]:
        return {kind: round(random() * 30, 2) for kind in self._kinds}

    def close(self) -> None:
        pass

    def __repr__(self):
        return 'DummySensor()'


class DummySensorFactory(SensorFactory):

    SENSOR_NAME = 'dummy'

    def build_from_config(self, config: ConfigTree) -> Optional[Sensor]:
        return DummySensor()


# Register the sensor
register_sensor(DummySensorFactory.SENSOR_NAME, DummySensorFactory())
