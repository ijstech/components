# DECOM Nodes

A decentralized network of transparent nodes that serve as DApp serving points and processors.

## DECOM Node Featrues:

DECOM Nodes carry out the following tasks

* **Serve as end-point** for DECOM Doc and DECOM Dapp requests.
  DECOM Dapps and DECOM Docs point their Domains to Secure Launcher endpoints. This standard Secure Launcher has following features:
  * Fully auditable integrity checks
  * Zero Trust responses: only replies to request if the IPFS content has been untampered with
  * Provide SSL Certificates
* **Provide Processing & Indexing storage** for DApps that require non-blockchain based processing capabilities and storage&#x20;
* **Serve as IPFS** Pinning Node All DECOM nodes need to also pin IPFS content

## Mode of Operations

Nodes may be run in the following modes:


| Mode                   | Details                                                                                                             | Requirement                                                                                      |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| DECOM Network - Public | Node that is running as part of the DECOM Public node. Serves as a member of the decentralized network              | Specific qualification needs must be met (ie staking of $DECOM bond & passing of community vote) |
| Test-Net Public        | Node that is set up on a testnet environment to enable testing of DECOM Docs and DECOM Dapps. Performance may be slower | Community selection                                                                              |
| Private                | Projects may run nodes privately to serve own needs.                                                                | None                                                                                             |
