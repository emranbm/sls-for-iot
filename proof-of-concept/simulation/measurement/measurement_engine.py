from typing import List

from openpyxl import Workbook
from openpyxl.worksheet.worksheet import Worksheet

from metric_providers.memory_usage_provider import MemoryUsageProvider
from metric_providers.storage_usage_provider import StorageUsageProvider
from metric_writer import MetricWriter


class MeasurementEngine:
    def __init__(self, container_names: List[str], output_path: str) -> None:
        self.container_names = container_names
        self._output_path = output_path
        self.metric_writer = MetricWriter(container_names)

    def start(self):
        storage_usages = StorageUsageProvider().retrieve_metric_values()
        self.metric_writer.get_sheet_writer("Storage Usage").write_record(storage_usages)
        memory_usages = MemoryUsageProvider().retrieve_metric_values()
        self.metric_writer.get_sheet_writer("Memory Percentage").write_record(storage_usages)
        self.metric_writer.save(self._output_path)
