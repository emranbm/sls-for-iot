# Shared Local data Storage for IoT
[![Master Pipeline](https://github.com/emranbm/sls-for-iot/workflows/Main%20Workflow/badge.svg?branch=master)](https://github.com/emranbm/sls-for-iot/actions/workflows/main.yml)

A design for IoT devices to share their storage across a local network  
It's my Master of Science project at [Sharif university of technology](http://www.sharif.ir/).

## Roadmap
Here's my roadmap to get the project done. It's not fixed and is subject to change if required.
- [x] Define the project
- [x] Get the acceptance of the proposal
- [x] Create a dockerized simulation environment
- [ ] Design and semi-implement the shared storage
  - [ ] Save file -> Current state: Inform saved file to manager
  - [ ] Read file
  - [ ] Delete file
  - [ ] List files
- [ ] Test and Benchmark
- [ ] Revise the design and implementation, if needed
- [ ] Write down the paper
- [ ] Create presentation
- [ ] Defend the dissertation
- [ ] Enjoy the rest of your non-academic life!  
(Is it going to check ever? I hope so!)

## Assumptions and Relaxed Constraints
For the sake of simplicity and staying minimal, some assumptions are made by design. Here is a list of them.
1. Files are immutable. i.e. it's not possible to rewrite a file content; instead, it should be deleted first and created back with the new contents.
1. The order of messages (of a specific type) sent from a single source to a single destination is guaranteed.

## Optimization Opportunities
There are too many (if not infinite) cases to get optimized. Here is a memory of ones faced.
1. More efficient serialization protocols can be used instead of JSON. e.g. [protobuf](https://developers.google.com/protocol-buffers)
1. File contents can be compressed before transmission.  
But it should be tested whether it's worth doing computation over IO.
1. Consider any message from clients as a heart beat. So that the client can send the heart beats less frequently.