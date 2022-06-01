from dataclasses import dataclass


@dataclass
class ContainerMetricValue:
    container_id: str
    container_name: str
    value: str

    def is_for_container(self, container_id_or_name: str) -> bool:
        return container_id_or_name in (self.container_id, self.container_name)
