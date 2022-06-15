#!/usr/bin/python

import sys
import time

from src.fogbed.experiment import FogbedExperiment
from src.fogbed.resourcemodel import EdgeResourceModel
from src.fogbed.topo import FogTopo
from src.mininet.log import setLogLevel
from src.mininet.node import OVSSwitch

setLogLevel('info')

topo = FogTopo()

e1 = topo.addVirtualInstance("edge")

erm = EdgeResourceModel(max_cu=20, max_mu=2048)

e1.assignResourceModel(erm)

device_image = "sample-device:latest"
devices = [
    e1.addDocker('d1', ip='10.0.0.251', dimage=device_image),
    e1.addDocker('d2', ip='10.0.0.252', dimage=device_image),
    e1.addDocker('d3', ip='10.0.0.253', dimage=device_image),
]

broker = e1.addDocker('br', ip="10.0.0.254", dimage="sample-broker:latest")

exp = FogbedExperiment(topo, switch=OVSSwitch)
exp.start()

try:
    # Waiting 5 seconds for routing algorithms on the controller to converge
    time.sleep(5)

    exp.get_node(broker).sendCmd("mosquitto -c /mosquitto-no-auth.conf")
    for device in devices:
        exp.get_node(device).sendCmd("node just-load-sdk.js")
    print("Simulation started!")
    sys.stdout.flush()
    while True:
        time.sleep(1)
finally:
    exp.stop()
