import inspect
from abc import ABC, abstractmethod
from typing import List, Type, Dict
from metric_providers.container_metric_value import ContainerMetricValue


class MetricProvider(ABC):
    _registered_providers: Dict[str, Type["MetricProvider"]] = {}

    def __init__(self):
        pass

    @abstractmethod
    def retrieve_metric_values(self) -> List[ContainerMetricValue]:
        """
        Retrieve the value of the corresponding metric for each running container.

        :return: List of values for all running containers
        """
        pass

    @staticmethod
    def register(title: str):
        def decorator(metric_provider_cls: Type["MetricProvider"]):
            assert len(inspect.signature(metric_provider_cls.__init__).parameters) == 1, (
                "MetricProviders should not have constructor arguments!")
            if title in MetricProvider._registered_providers.keys():
                raise Exception(f"Duplicate title: {title}")
            MetricProvider._registered_providers[title] = metric_provider_cls
            return metric_provider_cls
        return decorator

    @staticmethod
    def get_registered_metric_providers() -> Dict[str, Type["MetricProvider"]]:
        return MetricProvider._registered_providers.copy()
