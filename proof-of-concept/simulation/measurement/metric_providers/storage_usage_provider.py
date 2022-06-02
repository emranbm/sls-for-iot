import json
import subprocess
from typing import Iterable

from metric_providers.container_metric_value import ContainerMetricValue
from metric_providers.metric_provider import MetricProvider


class StorageUsageProvider(MetricProvider):
    def retrieve_metric_values(self) -> Iterable[ContainerMetricValue]:
        cmd_output = subprocess.check_output(['docker', 'ps', '--size', '--format', '{{json .}}']).decode('utf-8')
        for info_str in cmd_output.strip().split('\n'):
            info = json.loads(info_str)
            yield ContainerMetricValue(info["ID"],
                                       info["Names"],
                                       self.convert_size_str_to_num_bytes(info["Size"].split(" ")[0]))

    @staticmethod
    def convert_size_str_to_num_bytes(size_str: str) -> str:
        if size_str.endswith("kB"):
            return str(int(float(size_str[:-2]) * 1024))
        elif size_str.endswith("MB"):
            return str(int(float(size_str[:-2]) * 1024 * 1024))
        elif size_str.endswith("GB"):
            return str(int(float(size_str[:-2]) * 1024 * 1024 * 1024))
        else:
            size_without_b = size_str[:-1]
            try:
                int(size_without_b)
            except ValueError:
                raise ValueError(f"Unexpected size value: {size_str}")
            return size_without_b
