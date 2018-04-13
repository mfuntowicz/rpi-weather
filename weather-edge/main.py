from argparse import ArgumentParser

from weather import WeatherDaemon
from weather.outputs import ConsoleOutput
from weather.sensors.bmp280 import BMP280Sensor
from weather.sensors.dummy import DummySensor
from weather.utils import configure_logging, DAEMON_LOGGER_NAME
from weather.utils.system import get_host_specs

__author__ = 'Morgan Funtowicz'

if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('-v', action='store_true', dest='verbose', help='Turn on verbose logging')
    parser.add_argument('-f', default=':memory', dest='dest', help='Path where the output will be saved')
    parser.add_argument('--debug', action='store_true', dest='debug', help='Debugging mode. Verbose & SQLite in-memory')

    args = parser.parse_args()

    # Setup verbose logging if debug mode
    args.verbose |= args.debug

    # Configure logging
    logger = configure_logging(DAEMON_LOGGER_NAME, args.verbose)
    logger.info('Initializing Weather Station Edge Puller (debug: %s)', args.debug)
    logger.debug('Device %(host)s: CPU: %(cpu)s (%(cores)d), Memory: %(memory)s Mb, Python: %(python)s', get_host_specs())

    # Start the daemon
    with ConsoleOutput() as output:
        with WeatherDaemon(output) as daemon:
            daemon.register(DummySensor(), 1)
            daemon.run()

    logger.info('Weather Station Edge Puller exiting')