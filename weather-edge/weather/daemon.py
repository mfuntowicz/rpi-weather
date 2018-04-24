from asyncio import ensure_future, gather, get_event_loop, sleep, wait

from pyhocon import ConfigFactory, ConfigTree

from weather.outputs import Output, ConsoleOutput
from weather.sensors import Sensor
from weather.utils import DAEMON_LOGGER

__author__ = 'Morgan Funtowicz'
__email__ = 'morgan.funtowicz@naverlabs.com'


DEFAULT_CONFIG_FILE = 'default_config.json'


class WeatherDaemon(object):

    def __init__(self, config_file: str=None):
        if config_file is None:
            config_file = DEFAULT_CONFIG_FILE

        self._config = ConfigFactory.parse_file(config_file)
        self._logger = DAEMON_LOGGER
        self._looper = get_event_loop()

        if config_file is not DEFAULT_CONFIG_FILE:
            self._config.with_fallback(DEFAULT_CONFIG_FILE)

        self._output = None
        self._sensors = {}

        # Read from the config
        self._initialize_from_config(self._config)

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

    def _initialize_from_config(self, config: ConfigTree) -> None:
        # 1. Configure output
        self._output_from_config(config['output'] if 'output' in config else None)

        # 2. Configure sensors
        self._sensors_from_config(config['sensors'] if 'sensors' in config else None)

    def _output_from_config(self, config: ConfigTree) -> None:
        if config is None:
            self._logger.info('No output provided in configuration, defaulting to Console')
            self._output = ConsoleOutput()
        else:
            from weather.outputs import create_output
            builder = create_output(config['name'])
            self._output = builder.from_config(ConfigTree() if 'args' not in config else config['args'])

    def _sensors_from_config(self, config: ConfigTree) -> None:
        return

    async def _scheduled_readout(self, sensor: Sensor, delay: int):
        self._logger.debug('Scheduling readout with delay: %.2f', delay)

        while True:
            readouts = await sensor.read()
            await self._output.save(sensor, readouts)

            self._logger.debug('Finished reading from %r', sensor)
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
