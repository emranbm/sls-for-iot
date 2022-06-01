from abc import ABC, abstractmethod
from typing import List
from metric_providers.container_metric_value import ContainerMetricValue


class MetricProvider(ABC):
    @abstractmethod
    def retrieve_metric_values(self) -> List[ContainerMetricValue]:
        """Retrieve the value of the corresponding metric for each running container.

        Returns:
            List[ContainerMetricValue]: List of values for all running containers
        """
        pass
