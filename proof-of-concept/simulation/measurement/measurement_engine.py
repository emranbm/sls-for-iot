from typing import List

from openpyxl import Workbook
from openpyxl.worksheet.worksheet import Worksheet

from metric_providers.memory_usage_provider import MemoryUsageProvider
from metric_providers.metric_provider import MetricProvider
from metric_providers.storage_usage_provider import StorageUsageProvider
from metric_writer import MetricWriter


class MeasurementEngine:
    def __init__(self, container_names: List[str], output_path: str) -> None:
        self.container_names = container_names
        self._output_path = output_path
        self.metric_writer = MetricWriter(container_names)

    def start(self):
        for title, metric_provider_cls in MetricProvider.get_registered_metric_providers().items():
            metric_provider = metric_provider_cls()
            metric_values = metric_provider.retrieve_metric_values()
            self.metric_writer.get_sheet_writer(title).write_record(metric_values)
        self.metric_writer.save(self._output_path)
