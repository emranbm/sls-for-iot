# SLS usage simulation
Here the SLS SDK usage is simulated using the [FogBed](https://github.com/fogbed/fogbed) tool.  
Various simulation cases are described in `cases` directory.

## Usage
To run a simulation case, just pass the case name (the corresponding file name without the extension `.py`) to the `run-simulation.sh` script.  
For example, the below command will run the simulation case described in `cases/base-case.py`:
```bash
./run-simulation.sh base-case
```

### Metrics measurement
In order to measure usage metrics, like CPU and HDD usage, the below docker commands may help.

#### Check disk space usage
The below command will show the *size* and *virtual size* of the running containers. (See [here](https://github.com/docker/docker.github.io/issues/1520#issuecomment-305179362) for differences)
```bash
docker ps --size
```

#### Check performance metrics
To check performance metrics (e.g. CPU%, MEM%, I/O), the below command may help.
```bash
docker stats
```
