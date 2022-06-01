
from typing import List

from metric_providers.storage_usage_provider import StorageUsageProvider


class MeasurementEngine:
    def __init__(self, container_names: List[str]) -> None:
        self.container_names = container_names
    
    def start(self):
        storage_usages = StorageUsageProvider().retrieve_metric_values()
        raise NotImplementedError("Save values to excel")
