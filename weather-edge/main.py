from argparse import ArgumentParser
from logging import basicConfig, getLogger, DEBUG, INFO

from utils.system import get_host_specs
__author__ = 'Morgan Funtowicz'


def configure_logging(verbose):
    if verbose:
        level = DEBUG
        fmt = '%(asctime)s %(levelname)s:%(name)s %(filename)s:%(funcName)s::%(lineno)d %(message)s'
    else:
        level = INFO
        fmt = '%(asctime)s %(levelname)s:%(name)s %(filename)s:%(funcName)s %(message)s'

    basicConfig(level=level, format=fmt)
    return getLogger('Main')


if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('-v', action='store_true', dest='verbose', help='Turn on verbose logging')

    args = parser.parse_args()

    # Configure logging
    logger = configure_logging(args.verbose)
    logger.info('Initializing Weather Station Edge Puller')
    logger.debug('Device %(host)s: CPU: %(cpu)s (%(cores)d), Memory: %(memory)s Mb, Python: %(python)s', get_host_specs())

    logger.info('Weather Station Edge Puller exiting')