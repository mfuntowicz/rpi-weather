from asyncio import ensure_future, get_event_loop

from sensors import Sensor
from utils.logging import DEBUG, DAEMON_LOGGER

__author__ = 'Morgan Funtowicz'
__email__ = 'morgan.funtowicz@naverlabs.com'


class WeatherDaemon(object):

    def __init__(self):
        self._logger = DAEMON_LOGGER
        self._looper = get_event_loop()
        self._sensors = []

        self._logger.debug('Created WeatherDaemon')

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        return self

    def register(self, sensor: Sensor) -> None:
        pass

    def run(self):
        self._logger.info('Starting the WeatherDaemon (%d sensors registered)', len(self._sensors))

        if self._logger.isEnabledFor(DEBUG):
            self._logger.debug('Registered sensor: %s', self._sensors)