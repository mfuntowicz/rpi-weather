from dataclasses import dataclass


@dataclass
class WeatherForecast:
    temperature: float
    pressure: float
    wind: float
    humidity: float


from .models import MaybeSequence, WeatherForecaster
