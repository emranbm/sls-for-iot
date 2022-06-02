import json
import subprocess
from typing import List

from metric_providers.container_metric_value import ContainerMetricValue
from metric_providers.metric_provider import MetricProvider


@MetricProvider.register(title="Memory percentage")
class MemoryUsageProvider(MetricProvider):
    def retrieve_metric_values(self) -> List[ContainerMetricValue]:
        cmd_output = subprocess.check_output([
            'docker',
            'stats',
            '--no-stream',
            '--format',
            '{ "ID": "{{.ID}}", "Name": "{{.Name}}", "MemPerc": "{{.MemPerc}}" }'
        ]).decode('utf-8')
        for info_str in cmd_output.strip().split('\n'):
            info = json.loads(info_str)
            yield ContainerMetricValue(info["ID"],
                                       info["Name"],
                                       info["MemPerc"][:-1])
