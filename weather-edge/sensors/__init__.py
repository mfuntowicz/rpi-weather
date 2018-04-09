from abc import ABC, abstractmethod

__author__ = 'Morgan Funtowicz'


class Sensor(ABC):

    @abstractmethod
    def read(self):
        raise NotImplemented()

    @abstractmethod
    def close(self):
        raise NotImplemented()


from .bmp280 import BMP280, BMP280_ULTRALOWPOWER, BMP280_STANDARD, BMP280_HIGHRES, BMP280_ULTRAHIGHRES
