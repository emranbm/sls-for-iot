# Shared Local data Storage for IoT
[![SLS SDK test](https://github.com/emranbm/sls-for-iot/actions/workflows/sls-sdk-test.yml/badge.svg)](https://github.com/emranbm/sls-for-iot/actions/workflows/sls-sdk-test.yml)
[![Simulated device build](https://github.com/emranbm/sls-for-iot/actions/workflows/simulated-device-build.yml/badge.svg)](https://github.com/emranbm/sls-for-iot/actions/workflows/simulated-device-build.yml)
[![UML diagrams build](https://github.com/emranbm/sls-for-iot/actions/workflows/uml-diagrams-build.yml/badge.svg)](https://github.com/emranbm/sls-for-iot/actions/workflows/uml-diagrams-build.yml)

A design for IoT devices to share their storage across a local network  
It's my Master of Science project at [Sharif university of technology](http://www.sharif.ir/).

## Roadmap
Here's my roadmap to get the project done. It's not fixed and is subject to change if required.
- [x] Define the project
- [x] Get the acceptance of the proposal
- [x] Create a dockerized simulation environment
- [x] Design and semi-implement the shared storage
  - [x] Save file
  - [x] Read file
  - [x] Delete file
  - [x] List files
- [ ] Test and Benchmark
  - [ ] Run FogBed simulation without SLS and note metrics (HDD usage, CPU usage, Memory usage, etc.)
    - [x] Design and implement measurement script.
  - [ ] Run FogBed simulation with different scenarios of using SLS
- [ ] Revise the design and implementation, if needed
- [ ] Write down the paper
  - **Current State:** Revise and complete the *Introduction* section.
- [ ] Create presentation
- [ ] Defend the dissertation
- [ ] Enjoy the rest of your non-academic life!  
(Is it going to check ever? I hope so!)

## Assumptions and Relaxed Constraints
For the sake of simplicity and staying minimal, some assumptions are made by design. Here is a list of them.
1. Files are immutable. i.e. it's not possible to rewrite a file content; instead, it should be deleted first and created back with the new contents.
1. The order of messages (of a specific type) sent from a single source to a single destination is guaranteed.
1. Files don't save in sub-directories but in the root of each client's (virtual) storage. i.e. it's not possible to save a file somewhere like `sub/dir/file.txt`, but `file.txt`. (See [issue #7](https://github.com/emranbm/sls-for-iot/issues/7) for more details)

## Enhancement Opportunities
There are too many (if not infinite) cases to get optimized. Here is a memory of ones faced.
1. **Optimize protocol:** More efficient serialization protocols can be used instead of JSON. e.g. [protobuf](https://developers.google.com/protocol-buffers)
1. **Compress contents:** File contents can be compressed before transmission.  
But it should be tested whether it's worth doing computation over IO.
1. **Optimize heartbeats:** Consider any message from clients as a heartbeat. So the client can send the heartbeats less frequently.
1. **Don't keep content in memory:** Currently, the SDK holds file contents in memory before saving. It should also support other forms like file handles, etc.
1. **Remove SLS manager:** SLS manager can be omitted! Its only usage is the clients' book-keeping, which can be handled between the clients themselves. i.e. clients can subscribe for the heartbeats in a general channel and keep track of the others health.
1. **Optimize local operations:** Don't loop back content through the network when it should be handled locally.
1. **Disk-based `FileInfoRepo`:** Keep file infos in disk instead of memory.

## Future Work
1. Provide file overwrite.
1. Allow using sub-directories ([#7](https://github.com/emranbm/sls-for-iot/issues/7))
1. Add ability to divide huge files into chunks to be saved in multiple devices.
