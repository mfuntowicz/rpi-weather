__author__ = 'Morgan Funtowicz'
__email__ = 'morgan.funtowicz@naverlabs.com'


def get_host_specs() -> dict:
    from os import cpu_count
    from platform import processor, uname
    from psutil import virtual_memory
    from sys import version

    return {
        'host': uname()[1],
        'cpu': processor(),
        'cores': cpu_count(),
        'memory': virtual_memory().total // (1000 ** 2),
        'python': version.replace('\n', ' ')
    }