from argparse import ArgumentParser

from daemon import WeatherDaemon
from utils.logging import configure_logging, DAEMON_LOGGER_NAME
from utils.system import get_host_specs

__author__ = 'Morgan Funtowicz'


if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('-v', action='store_true', dest='verbose', help='Turn on verbose logging')

    args = parser.parse_args()

    # Configure logging
    logger = configure_logging(DAEMON_LOGGER_NAME, args.verbose)
    logger.info('Initializing Weather Station Edge Puller')
    logger.debug('Device %(host)s: CPU: %(cpu)s (%(cores)d), Memory: %(memory)s Mb, Python: %(python)s', get_host_specs())

    # Start the daemon
    with WeatherDaemon() as daemon:
        daemon.run()

    logger.info('Weather Station Edge Puller exiting')