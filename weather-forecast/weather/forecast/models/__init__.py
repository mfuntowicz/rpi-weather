from abc import ABC, abstractmethod
from typing import Union, Sequence

from torch.nn import Module

from weather.forecast import WeatherForecast

MaybeSequence = Union[float, Sequence[float]]


class WeatherForecaster(ABC, Module):

    def __init__(self):
        super().__init__()

    @abstractmethod
    def forward(self, month: int, hour: int, temperature: MaybeSequence,
                pressure: MaybeSequence, wind: MaybeSequence, humidity: MaybeSequence) -> WeatherForecast:
        raise NotImplementedError()

    def forward_multiple(self, month: int, hour: int, temperature: MaybeSequence,
                         pressure: MaybeSequence, wind: MaybeSequence,
                         humidity: MaybeSequence, steps: int = 2) -> WeatherForecast:
        raise NotImplementedError()