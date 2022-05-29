# SLS usage simulation
Here the SLS SDK usage is simulated using the [FogBed](https://github.com/fogbed/fogbed) tool.

## Usage
The simulation structure is described in `main.py`. Execute `run.sh` to start the simulation.

## Metrics measurement
In order to measure usage metrics, like CPU and HDD usage, the below docker commands may help.

### Check disk space usage
The below command will show the *size* and *virtual size* of the running containers. (See [here](https://github.com/docker/docker.github.io/issues/1520#issuecomment-305179362) for differences)
```bash
docker ps --size
```

### Check performance metrics
To check performance metrics (e.g. CPU%, MEM%, I/O), the below command may help.
```bash
docker stats
```

## Development
For IDEs to be able to lint and type check the FogBed-provided classes and utilities, the source code of FogBed needs to be present near the `main.py` file. (It's due to the lack of an appropriate package for FogBed to be used.)  
To prepare such an environment, just run the `download-fogbed-src.sh` script. It automatically downloads the required package and puts it in the appropriate location.
