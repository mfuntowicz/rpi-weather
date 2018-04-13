from asyncio import ensure_future, gather, get_event_loop, sleep, wait
from functools import partial
from weather.outputs import Output
from weather.sensors import Sensor
from weather.utils import DAEMON_LOGGER

__author__ = 'Morgan Funtowicz'
__email__ = 'morgan.funtowicz@naverlabs.com'


class WeatherDaemon(object):

    def __init__(self, output: Output):
        if not isinstance(output, Output):
            raise ValueError('output has to be instance of Output')

        self._output = output
        self._logger = DAEMON_LOGGER
        self._looper = get_event_loop()
        self._sensors = {}

        self._logger.debug('Created WeatherDaemon')

    def __enter__(self):
        from sys import platform

        if platform != 'win32':
            from signal import SIGTERM, SIGINT
            self._looper.add_signal_handler(SIGINT, lambda: ensure_future(self.shutdown('SIGKILL')))
            self._looper.add_signal_handler(SIGTERM, lambda: ensure_future(self.shutdown('SIGTERM')))

        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        from sys import platform

        if platform != 'win32':
            from signal import SIGTERM, SIGINT
            self._looper.remove_signal_handler(SIGINT)
            self._looper.remove_signal_handler(SIGTERM)

        return self

    async def _scheduled_readout(self, sensor: Sensor, delay: int):
        self._logger.debug('Scheduling readout with delay: %.2f', delay)

        while True:
            readouts = await sensor.read()
            await self._output.save(sensor, readouts)

            self._logger.debug('%r: %s', sensor, readouts)
            await sleep(delay)

    def register(self, sensor: Sensor, delay: float) -> None:
        if sensor is None:
            raise ValueError('sensor cannot be None')

        self._logger.info('Registering sensor %s' % sensor)
        self._sensors[sensor] = delay

    def run(self) -> None:
        self._logger.info('Starting the WeatherDaemon (%d sensors registered)', len(self._sensors))
        self._logger.debug('Registered sensor: %s', self._sensors)

        gathered_futures = gather(*[self._scheduled_readout(sensor, delay) for sensor, delay in self._sensors.items()])
        self._looper.run_until_complete(gathered_futures)

    def shutdown(self, origin=None):
        self._logger.info('Shutting down Daemon (origin: %s)', origin)
        self._looper.stop()
