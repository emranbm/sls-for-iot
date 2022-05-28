# Sample device
Here a sample IoT device is developed to simulate the usage of SLS SDK.

## Build
Just run the `build-docker-image.sh` script. It creates the sample device as a docker image named `sample-device`.

## Usage
There are various scenarios that a device can simulate. For example, a no-op scenario (which doesn't do anything) can be executed by:  
```bash
docker run --rm sample-device no-op.js
```
