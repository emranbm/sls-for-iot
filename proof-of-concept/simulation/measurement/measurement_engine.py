from datetime import datetime, timedelta
from time import sleep
from typing import List

from metric_providers.metric_provider import MetricProvider
from metric_writer import MetricWriter


class MeasurementEngine:
    def __init__(self, container_names: List[str], step_seconds: int, count: int, output_path: str) -> None:
        self.container_names = container_names
        self._step_seconds = step_seconds
        self._count = count
        self._output_path = output_path
        self.metric_writer = MetricWriter(container_names)

    def start(self):
        print("Measurement started and will go off on "
              f"{datetime.now() + timedelta(seconds=self._step_seconds * self._count)}")
        for i in range(self._count):
            for title, metric_provider_cls in MetricProvider.get_registered_metric_providers().items():
                metric_provider = metric_provider_cls()
                metric_values = metric_provider.retrieve_metric_values()
                self.metric_writer.get_sheet_writer(title).write_record(metric_values)
            print(f"Round {i+1}/{self._count} of measurement done.")
            if i != self._count - 1:
                print(f"Waiting {self._step_seconds} seconds before next measurement...")
                sleep(self._step_seconds)
        self.metric_writer.save(self._output_path)
