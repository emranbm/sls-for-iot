#!/usr/bin/python

import time

from src.fogbed.experiment import FogbedExperiment, FogbedDistributedExperiment
from src.fogbed.resourcemodel import CloudResourceModel, EdgeResourceModel, FogResourceModel, PREDEFINED_RESOURCES
from src.fogbed.topo import FogTopo
from src.mininet.link import TCLink
from src.mininet.log import setLogLevel
from src.mininet.node import OVSSwitch

setLogLevel('info')

topo = FogTopo()

e1 = topo.addVirtualInstance("edge")

erm = EdgeResourceModel(max_cu=20, max_mu=2048)

e1.assignResourceModel(erm)

device_image = "sample-device:latest"
d1 = e1.addDocker('d1', ip='10.0.0.251', dimage=device_image)
d2 = e1.addDocker('d2', ip='10.0.0.252', dimage=device_image)
d3 = e1.addDocker('d3', ip='10.0.0.253', dimage=device_image)

exp = FogbedExperiment(topo, switch=OVSSwitch)
exp.start()

try:
    # Waiting 5 seconds for routing algorithms on the controller to converge
    time.sleep(5)

    print(exp.get_node(d1).cmd("node no-op.js"))
    print(exp.get_node("edge.d2").cmd("node no-op.js"))
finally:
    exp.stop()
