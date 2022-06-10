import json
import subprocess
from abc import ABC, abstractmethod
from typing import Iterable, Dict

from metric_providers.container_metric_value import ContainerMetricValue
from metric_providers.metric_provider import MetricProvider


class DockerStatsMetricProvider(MetricProvider, ABC):

    @abstractmethod
    def _get_metric_value_from_info_json(self, info: Dict) -> str:
        pass

    def retrieve_metric_values(self) -> Iterable[ContainerMetricValue]:
        cmd_output = subprocess.check_output([
            'docker',
            'stats',
            '--no-stream',
            '--format',
            '{{json .}}'
        ]).decode('utf-8')
        for info_str in cmd_output.strip().split('\n'):
            info = json.loads(info_str)
            yield ContainerMetricValue(info['ID'], info['Name'], self._get_metric_value_from_info_json(info))
