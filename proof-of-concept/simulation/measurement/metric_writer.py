from itertools import chain
from typing import Dict, Iterable, List

from openpyxl import Workbook
from openpyxl.worksheet.worksheet import Worksheet

from metric_providers.container_metric_value import ContainerMetricValue


class SheetWriter:
    def __init__(self, sheet: Worksheet, container_names):
        self._sheet = sheet
        self._container_names = container_names
        self.sequence_number = 0
        self._sheet.append(["#", *sorted(container_names)])

    def write_record(self, metric_value_of_containers: Iterable[ContainerMetricValue]) -> None:
        record = [self._get_sequence_number()]
        record += (metric_value.value
                   for metric_value in
                   sorted(metric_value_of_containers, key=lambda v: v.container_name)
                   if metric_value.container_name in self._container_names
                   )
        self._sheet.append(record)

    def _get_sequence_number(self) -> int:
        """
        Return the next sequence number. Each time the returned value is increased by 1.
        :return: Sequence number
        """
        self.sequence_number += 1
        return self.sequence_number


class MetricWriter:
    def __init__(self, container_names: List[str]):
        self._workbook = Workbook()
        self._workbook.remove_sheet(self._workbook.active)
        self._sheet_writers: Dict[str, SheetWriter] = {}
        self.container_names = container_names

    def get_sheet_writer(self, title: str) -> SheetWriter:
        if title not in self._sheet_writers.keys():
            self._sheet_writers[title] = SheetWriter(self._workbook.create_sheet(title), self.container_names)
        return self._sheet_writers[title]

    def save(self, path: str) -> None:
        self._workbook.save(path)
