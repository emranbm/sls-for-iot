# Proof of concept
Here a minimal implementation of *SLS* as a software SDK has been done to meet these goals:
- Proof of Concept: That is the idea of shared storage between IoT devices is feasible.
- Enable simulation: That is the idea can be simulated and various aspects of its effect on an IoT system is measurable.

## Simulators
There are a few simulators out of the box, which may help simulating and measuring the current SDK.  
Here is a list of some:
- iFogSim ([paper](http://dx.doi.org/10.1002/spe.2509))
- EdgeCloudSim ([paper](http://dx.doi.org/10.1002/ett.3493))
- IOTSim ([paper](http://dx.doi.org/10.1016/j.sysarc.2016.06.008))

For more info and comparison, see *Table1* of [this paper](../references/simulation-and-metrics/futureinternet-11-00235.pdf).

### FogBed Simulator
The [FogBed](https://github.com/fogbed/fogbed) simulator is a good implementation for what we need in evaluating SLS.
