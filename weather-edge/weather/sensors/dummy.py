from random import random
from typing import Dict, Tuple
from weather.sensors import Sensor, SensorKind


class DummySensor(Sensor):

    def __init__(self, kinds: Tuple[SensorKind]=None):
        if kinds is None:
            kinds = (SensorKind.TEMPERATURE, SensorKind.PRESSURE, SensorKind.WIND)

        self._kinds = kinds

    @property
    def kind(self) -> Tuple[SensorKind, ...]:
        return self._kinds

    async def read(self) -> Dict[SensorKind, float]:
        return {kind: round(random(), 2) for kind in self._kinds}

    def close(self) -> None:
        pass

    def __repr__(self):
        return 'DummySensor()'
