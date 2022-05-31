# Simulation cases
In this directory, various cases of SLS usage simulations are described as python scripts. 

## Development
As mentioned above, each simulation case is described as a single python script that can use the [FogBed](https://github.com/fogbed/fogbed) library to define the IoT network structure. For more details on how to work with FogBed see [FogBed documentation](https://fogbed.readthedocs.io/en/latest/).  
For IDEs to be able to lint and type check the FogBed-provided classes and utilities, the source code of FogBed needs to be present near the script file. (It's due to the lack of an appropriate package for FogBed to be used.)  
To prepare such an environment, just run the `download-fogbed-src.sh` script. It automatically downloads the required package and puts it in the appropriate location.  
Note that the FogBed's `src` folder only helps development and is not needed for the simulation run.  
For samples of simulation cases, see the current files in this directory.

### Node object methods
The `FogbedExperiment` class has a method named `get_node` which can retrieve a *mininet* node object.  
For the list of available attributes of a mininet node object, see [here](http://mininet.org/api/classmininet_1_1node_1_1Node.html).  
