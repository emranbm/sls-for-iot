#!/usr/bin/env python3

import argparse
from measurement_engine import MeasurementEngine
from metric_providers.storage_usage_provider import StorageUsageProvider

arguments = None


def main():
    inflate_arguments()
    StorageUsageProvider().retrieve_metric_values()
    MeasurementEngine(arguments.containers).start()


def inflate_arguments():
    parser = argparse.ArgumentParser(description="A dedicated tool for measurement of SLS SDK simulation containers.")
    parser.add_argument("containers",
                        metavar="CONTAINER",
                        type=str,
                        nargs="+",
                        help="The container name or id to be monitored.")
    global arguments
    arguments = parser.parse_args()


if __name__ == "__main__":
    main()
