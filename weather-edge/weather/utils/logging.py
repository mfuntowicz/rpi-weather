from logging import basicConfig, getLogger, DEBUG, INFO, Logger

__author__ = 'Morgan Funtowicz'
__email__ = 'morgan.funtowicz@naverlabs.com'

DAEMON_LOGGER_NAME = 'Daemon'
OUTPUT_LOGGER_NAME = 'Output'
SENSORS_LOGGER_NAME = 'Sensors'

DAEMON_LOGGER = getLogger(DAEMON_LOGGER_NAME)
OUTPUT_LOGGER = getLogger(OUTPUT_LOGGER_NAME)
SENSORS_LOGGER = getLogger(SENSORS_LOGGER_NAME)


def configure_logging(name: str, verbose: bool) -> Logger:
    if verbose:
        level = DEBUG
        fmt = '%(asctime)s %(levelname)s %(name)s %(filename)s:%(funcName)s::%(lineno)d %(message)s'
    else:
        level = INFO
        fmt = '%(asctime)s %(levelname)s %(name)s %(filename)s:%(funcName)s %(message)s'

    basicConfig(level=level, format=fmt)
    return getLogger(name)
