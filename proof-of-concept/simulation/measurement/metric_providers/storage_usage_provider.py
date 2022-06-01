import json
import subprocess
from typing import List

from metric_providers.metric_provider import MetricProvider
from metric_providers.container_metric_value import ContainerMetricValue


class StorageUsageProvider(MetricProvider):
    def retrieve_metric_values(self) -> List[ContainerMetricValue]:
        cmd_output = subprocess.check_output(['docker', 'ps', '--size', '--format', '{{json .}}']).decode('utf-8')
        container_infos = []
        for info_str in cmd_output.strip().split('\n'):
            container_infos.append(json.loads(info_str))
        return [ContainerMetricValue(i["ID"], i["Names"], i["Size"].split(" ")[0],) for i in container_infos]
