# tiny-stack-vm

[![make.fun](https://make.fun/badge/tiny-stack-vm-01-run-20261122)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122)
[![score](https://make.fun/badge/tiny-stack-vm-01-run-20261122/score)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122)
[![size](https://make.fun/badge/tiny-stack-vm-01-run-20261122/size)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122)

A tiny stack virtual machine (ISA v1) for the [make.fun bounty](https://make.fun/bounty/tiny-stack-vm-01-run-20261122): one Node 22 program (`main.ts`) that runs all 40 bytecode programs of a set and writes each program's output bytes and exit code. Faithful to the written ISA spec: wrapping 32-bit arithmetic, unsigned ops, all ten traps with their own exit codes, step and output limits.
