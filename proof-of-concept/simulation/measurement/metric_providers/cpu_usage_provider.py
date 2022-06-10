from typing import Dict

from metric_providers.docker_stats_metric_provider import DockerStatsMetricProvider
from metric_providers.metric_provider import MetricProvider


@MetricProvider.register(title="CPU percentage")
class CpuUsageProvider(DockerStatsMetricProvider):
    def _get_metric_value_from_info_json(self, info: Dict) -> str:
        return info['CPUPerc'][:-1]
