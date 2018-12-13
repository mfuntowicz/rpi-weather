from logging import getLogger, basicConfig, INFO, DEBUG

import torch
from argparse import ArgumentParser


def setup_torch():
    if args.cuda:
        device = torch.device('cuda')
        torch.backends.cudnn.enabled = torch.backends.cudnn.benchmark = args.cudnn

        gpu_props = torch.cuda.get_device_properties(device)
        gpu_name = gpu_props.name
        gpu_capa = '%d.%d' % (gpu_props.major, gpu_props.minor)
        gpu_memory = '%.2f' % (gpu_props.total_memory / 1024. / 1024. / 1024.)

        args.logger.debug('Found CUDA Device: {} ({}, {}Gb)'.format(gpu_name, gpu_capa, gpu_memory))
        args.logger.info('CuDNN status: {}'.format('Enabled' if args.cudnn else 'Disabled'))
    else:
        device = torch.device('cpu')

    args.logger.info('Setting device to: {}'.format(device))
    return device


if __name__ == '__main__':
    parser = ArgumentParser('Weather Forecast')
    parser.add_argument('--debug', action='store_true', help='Turn on debugging mode')
    parser.add_argument('--cuda', action='store_true', help='Turn on CUDA')
    parser.add_argument('--cudnn', action='store_true', help='Turn on CuDNN')
    parser.add_argument('train_file', type=str, help='Jena training data path')

    args = parser.parse_args()
    basicConfig(
        format='%(asctime)s %(levelname)s %(name)s:%(filename)s:%(lineno)d %(message)s',
        level=DEBUG if args.debug else INFO
    )

    # Extra variables
    args.logger = getLogger()
    args.cuda = args.cuda & torch.cuda.is_available()
    args.cudnn = args.cudnn & args.cuda
    args.device = setup_torch()