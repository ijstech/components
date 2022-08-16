define("aws-sdk", ()=>{});
define("asn1.js", ()=>{});
define("bn.js", ()=>{});
define("ethereumjs-tx", ()=>{});
define("ethereumjs-util", ()=>{});
define("web3", (require,exports)=>{
    exports['web3'] = window["Web3"];
});
define("bignumber.js", (require,exports)=>{
    exports['BigNumber'] = window["BigNumber"];
});
define("@ijstech/eth-wallet",(require, exports)=>{
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[Object.keys(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// src/merkleTree.ts
var import_bignumber, MerkleTree, merkleTree_default;
var init_merkleTree = __esm({
  "src/merkleTree.ts"() {
    import_bignumber = __toModule(require("bignumber.js"));
    MerkleTree = class {
      constructor(wallet, leaves) {
        this.tree = [];
        this.tree.push(leaves);
        while (this.tree[this.tree.length - 1].length > 1) {
          let children = this.tree[this.tree.length - 1];
          let parent = [];
          for (let i = 0; i < children.length - 1; i += 2) {
            if (new import_bignumber.BigNumber(children[i]).lt(children[i + 1])) {
              parent.push(wallet.soliditySha3("0x" + children[i].replace("0x", "") + children[i + 1].replace("0x", "")));
            } else {
              parent.push(wallet.soliditySha3("0x" + children[i + 1].replace("0x", "") + children[i].replace("0x", "")));
            }
          }
          if (children.length % 2 == 1) {
            parent.push("0x" + children[children.length - 1].replace("0x", ""));
          }
          this.tree.push(parent);
        }
      }
      static create(wallet, leaves) {
        let tree = new this(wallet, leaves);
        return tree;
      }
      toString() {
        let arr = [];
        for (let i = this.tree.length - 1; i >= 0; i--) {
          arr.push(this.tree[i].join(","));
        }
        return arr.join(",");
      }
      getHexRoot() {
        return this.tree[this.tree.length - 1][0];
      }
      getHexProof(leaf) {
        let proof = [];
        if (this.tree.length == 1)
          return proof;
        let index = this.tree[0].indexOf(leaf);
        proof.push(this.tree[0][index % 2 == 0 ? index + 1 : index - 1]);
        for (let i = 1; i < this.tree.length - 1; i++) {
          index = Math.floor(index / 2);
          proof.push(this.tree[i][index % 2 == 0 ? index + 1 : index - 1]);
        }
        return proof;
      }
    };
    merkleTree_default = MerkleTree;
  }
});

// src/utils.ts
var utils_exports = {};
__export(utils_exports, {
  addressToBytes32: () => addressToBytes32,
  addressToBytes32Right: () => addressToBytes32Right,
  bytes32ToAddress: () => bytes32ToAddress,
  bytes32ToString: () => bytes32ToString,
  fromDecimals: () => fromDecimals,
  generateWhitelistTree: () => generateWhitelistTree,
  getWhitelistTreeProof: () => getWhitelistTreeProof,
  nullAddress: () => nullAddress,
  numberToBytes32: () => numberToBytes32,
  padLeft: () => padLeft,
  padRight: () => padRight,
  sleep: () => sleep,
  stringToBytes: () => stringToBytes,
  stringToBytes32: () => stringToBytes32,
  toDecimals: () => toDecimals,
  toNumber: () => toNumber,
  toString: () => toString
});
function Web3Lib() {
  if (typeof window !== "undefined" && window["Web3"])
    return window["Web3"];
  else
    return require("web3");
}
function sleep(millisecond) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(null);
    }, millisecond);
  });
}
function numberToBytes32(value, prefix) {
  let v = new import_bignumber2.BigNumber(value).toString(16);
  v = v.replace("0x", "");
  v = padLeft(v, 64);
  if (prefix)
    v = "0x" + v;
  return v;
}
function padLeft(string, chars, sign) {
  return new Array(chars - string.length + 1).join(sign ? sign : "0") + string;
}
function padRight(string, chars, sign) {
  return string + new Array(chars - string.length + 1).join(sign ? sign : "0");
}
function stringToBytes32(value) {
  if (Array.isArray(value)) {
    let result = [];
    for (let i = 0; i < value.length; i++) {
      result.push(stringToBytes32(value[i]));
    }
    return result;
  } else {
    if (value.length == 66 && value.startsWith("0x"))
      return value;
    return Web3.utils.padRight(Web3.utils.asciiToHex(value), 64);
  }
}
function stringToBytes(value, nByte) {
  if (Array.isArray(value)) {
    let result = [];
    for (let i = 0; i < value.length; i++) {
      result.push(stringToBytes(value[i]));
    }
    return result;
  } else {
    if (nByte) {
      if (new RegExp(`^0x[0-9a-fA-F]{${2 * nByte}}$`).test(value))
        return value;
      else if (/^0x([0-9a-fA-F][0-9a-fA-F])*$/.test(value)) {
        if (value.length >= nByte * 2 + 2)
          return value;
        else
          return "0x" + value.substring(2) + "00".repeat(nByte - (value.length - 2) / 2);
      } else if (/^([0-9a-fA-F][0-9a-fA-F])+$/.test(value)) {
        if (value.length >= nByte * 2)
          return value;
        else
          return "0x" + value + "00".repeat(nByte - value.length / 2);
      } else
        return Web3.utils.padRight(Web3.utils.asciiToHex(value), nByte * 2);
    } else {
      if (/^0x([0-9a-fA-F][0-9a-fA-F])*$/.test(value))
        return value;
      else if (/^([0-9a-fA-F][0-9a-fA-F])+$/.test(value))
        return "0x" + value;
      else
        return Web3.utils.asciiToHex(value);
    }
  }
}
function addressToBytes32(value, prefix) {
  let v = value;
  v = v.replace("0x", "");
  v = padLeft(v, 64);
  if (prefix)
    v = "0x" + v;
  return v;
}
function bytes32ToAddress(value) {
  return "0x" + value.replace("0x000000000000000000000000", "");
}
function bytes32ToString(value) {
  return Web3.utils.hexToUtf8(value);
}
function addressToBytes32Right(value, prefix) {
  let v = value;
  v = v.replace("0x", "");
  v = padRight(v, 64);
  if (prefix)
    v = "0x" + v;
  return v;
}
function toNumber(value) {
  if (typeof value == "number")
    return value;
  else if (typeof value == "string")
    return new import_bignumber2.BigNumber(value).toNumber();
  else
    return value.toNumber();
}
function toDecimals(value, decimals) {
  decimals = decimals || 18;
  return new import_bignumber2.BigNumber(value).shiftedBy(decimals);
}
function fromDecimals(value, decimals) {
  decimals = decimals || 18;
  return new import_bignumber2.BigNumber(value).shiftedBy(-decimals);
}
function toString(value) {
  if (Array.isArray(value)) {
    let result = [];
    for (let i = 0; i < value.length; i++) {
      result.push(toString(value[i]));
    }
    return result;
  } else if (typeof value === "number")
    return value.toString(10);
  else if (import_bignumber2.BigNumber.isBigNumber(value))
    return value.toFixed();
  else
    return value;
}
function getSha3HashBufferFunc(wallet, abi) {
  return (treeItem) => {
    let encodePackedInput = abi.map((abiItem) => {
      return {
        t: abiItem.type,
        v: treeItem[abiItem.name]
      };
    });
    let hex = wallet.soliditySha3.apply(wallet, [
      { t: "address", v: treeItem.account },
      ...encodePackedInput
    ]);
    return hex;
  };
}
function generateWhitelistTree(wallet, data, abi) {
  const hashFunc = getSha3HashBufferFunc(wallet, abi);
  const leaves = data.map((item) => hashFunc(item));
  const merkleTree = merkleTree_default.create(wallet, leaves);
  const merkleRoot = merkleTree.getHexRoot();
  return {
    root: merkleRoot,
    tree: merkleTree.toString()
  };
}
function getWhitelistTreeProof(wallet, inputRoot, rawData, abi) {
  const hashFunc = getSha3HashBufferFunc(wallet, abi);
  let accountLeaf;
  let leaves = [];
  for (let item of rawData) {
    let leaf = hashFunc(item);
    if (wallet.address == item.account) {
      accountLeaf = leaf;
    }
    leaves.push(leaf);
  }
  if (!accountLeaf)
    return null;
  const tree = merkleTree_default.create(wallet, leaves);
  const calculatedRoot = tree.getHexRoot();
  if (calculatedRoot != inputRoot)
    return null;
  const proof = tree.getHexProof(accountLeaf);
  return proof;
}
var import_bignumber2, Web3, nullAddress;
var init_utils = __esm({
  "src/utils.ts"() {
    import_bignumber2 = __toModule(require("bignumber.js"));
    init_merkleTree();
    Web3 = Web3Lib();
    nullAddress = "0x0000000000000000000000000000000000000000";
  }
});

// src/contract.ts
var require_contract = __commonJS({
  "src/contract.ts"(exports, module2) {
    init_utils();
    var Contract3;
    (function(_Contract) {
      const _Contract2 = class {
        async getContract() {
          let contract;
          if (this.address) {
            contract = _Contract2.contracts[await this.wallet.getChainId() + ":" + this.address];
            if (!contract) {
              contract = this.wallet.newContract(this._abi, this.address);
              _Contract2.contracts[await this.wallet.getChainId() + ":" + this.address] = contract;
            }
          } else {
            contract = this.wallet.newContract(this._abi);
          }
          return contract;
        }
        constructor(wallet, address, abi, bytecode) {
          this.wallet = wallet;
          if (typeof abi == "string")
            this._abi = JSON.parse(abi);
          else
            this._abi = abi;
          this._bytecode = bytecode;
          let self = this;
          if (address)
            this._address = address;
        }
        at(address) {
          this._address = address;
          return this;
        }
        set address(value) {
          this._address = value;
        }
        get address() {
          return this._address || "";
        }
        decodeEvents(receipt) {
          let events = this.getAbiEvents();
          let result = [];
          for (let name in receipt.events) {
            let events2 = Array.isArray(receipt.events[name]) ? receipt.events[name] : [receipt.events[name]];
            events2.forEach((e) => {
              let data = e.raw;
              let event = events2[data.topics[0]];
              result.push(Object.assign({ _name: name, _address: this.address }, this.wallet.decodeLog(event.inputs, data.data, data.topics.slice(1))));
            });
          }
          return result;
        }
        parseEvents(receipt, eventName) {
          let eventAbis = this.getAbiEvents();
          let topic0 = this.getAbiTopics([eventName])[0];
          let result = [];
          if (receipt.events) {
            for (let name in receipt.events) {
              let events = Array.isArray(receipt.events[name]) ? receipt.events[name] : [receipt.events[name]];
              events.forEach((event) => {
                if (topic0 == event.raw.topics[0] && (this.address && this.address == event.address)) {
                  result.push(this.wallet.decode(eventAbis[topic0], event, event.raw));
                }
              });
            }
          } else if (receipt.logs) {
            for (let i = 0; i < receipt.logs.length; i++) {
              let log = receipt.logs[i];
              if (topic0 == log.topics[0] && (this.address && this.address == log.address)) {
                result.push(this.wallet.decode(eventAbis[topic0], log));
              }
            }
          }
          return result;
        }
        get events() {
          let result = [];
          for (let i = 0; i < this._abi.length; i++) {
            if (this._abi[i].type == "event")
              result.push(this._abi[i]);
          }
          return result;
        }
        getAbiEvents() {
          if (!this._events) {
            this._events = {};
            let events = this._abi.filter((e) => e.type == "event");
            for (let i = 0; i < events.length; i++) {
              let topic = this.wallet.utils.sha3(events[i].name + "(" + events[i].inputs.map((e) => e.type == "tuple" ? "(" + e.components.map((f) => f.type) + ")" : e.type).join(",") + ")");
              this._events[topic] = events[i];
            }
          }
          return this._events;
        }
        getAbiTopics(eventNames) {
          if (!eventNames || eventNames.length == 0)
            eventNames = null;
          let result = [];
          let events = this.getAbiEvents();
          for (let topic in events) {
            if (!eventNames || eventNames.includes(events[topic].name)) {
              result.push(topic);
            }
          }
          if (result.length == 0 && eventNames && eventNames.length > 0)
            return ["NULL"];
          return [result];
        }
        registerEvents(handler) {
          if (this._address)
            this.wallet.registerEvent(this.getAbiEvents(), this._address, handler);
        }
        scanEvents(fromBlock, toBlock, eventNames) {
          let topics = this.getAbiTopics(eventNames);
          let events = this.getAbiEvents();
          return this.wallet.scanEvents(fromBlock, toBlock, topics, events, this._address);
        }
        async batchCall(batchObj, key, methodName, params, options) {
          let contract = await this.getContract();
          if (!contract.methods[methodName])
            return;
          let method = contract.methods[methodName].apply(this, params);
          batchObj.promises.push(new Promise((resolve, reject) => {
            batchObj.batch.add(method.call.request(__spreadValues({ from: this.wallet.address }, options), (e, v) => {
              return resolve({
                key,
                result: e ? null : v
              });
            }));
          }));
        }
        async call(methodName, params, options) {
          let contract = await this.getContract();
          params = params || [];
          let method = contract.methods[methodName].apply(this, params);
          return method.call(__spreadValues({ from: this.wallet.address }, options));
        }
        async txObj(methodName, params, options) {
          let contract = await this.getContract();
          params = params || [];
          let methodAbi = this._abi.find((e) => methodName ? e.name == methodName : e.type == "constructor");
          if (methodAbi)
            for (let i = 0; i < methodAbi.inputs.length; i++) {
              if (methodAbi.inputs[i].type.indexOf("bytes") == 0) {
                params[i] = params[i] || "";
                if (methodAbi.inputs[i].type.indexOf("[]") > 0) {
                  let a = [];
                  for (let k = 0; k < params[i].length; k++) {
                    let s = params[i][k] || "";
                    if (!params[i][k])
                      a.push("0x");
                    else
                      a.push(s);
                  }
                  params[i] = a;
                } else if (!params[i])
                  params[i] = "0x";
              } else if (methodAbi.inputs[i].type == "address") {
                if (!params[i])
                  params[i] = nullAddress;
              }
            }
          let method;
          if (!methodName)
            method = contract.deploy({ data: this._bytecode, arguments: params });
          else
            method = contract.methods[methodName].apply(this, params);
          let tx = {};
          tx.from = this.wallet.address;
          tx.to = this._address;
          tx.data = method.encodeABI();
          if (options && options.value) {
            tx.value = options.value;
          } else {
            tx.value = 0;
          }
          if (options && (options.gas || options.gasLimit)) {
            tx.gas = options.gas || options.gasLimit;
          } else {
            try {
              tx.gas = await method.estimateGas({ from: this.wallet.address, to: this.address ? this.address : void 0, value: options && options.value || 0 });
              tx.gas = Math.min(await this.wallet.blockGasLimit(), Math.round(tx.gas * 1.5));
            } catch (e) {
              if (e.message == "Returned error: out of gas") {
                console.log(e.message);
                tx.gas = Math.round(await this.wallet.blockGasLimit() * 0.5);
              } else {
                try {
                  await method.call(__spreadValues({ from: this.wallet.address }, options));
                } catch (e2) {
                  if (e2.message.includes("VM execution error.")) {
                    var msg = (e2.data || e2.message).match(/0x[0-9a-fA-F]+/);
                    if (msg && msg.length) {
                      msg = msg[0];
                      if (msg.startsWith("0x08c379a")) {
                        msg = this.wallet.decodeErrorMessage(msg);
                        throw new Error(msg);
                      }
                    }
                  }
                }
                throw e;
              }
            }
          }
          if (!tx.gasPrice) {
            tx.gasPrice = await this.wallet.getGasPrice();
          }
          if (options && options.nonce) {
            tx.nonce = options.nonce;
          } else {
            tx.nonce = await this.wallet.transactionCount();
          }
          return tx;
        }
        async _send(methodName, params, options) {
          let tx = await this.txObj(methodName, params, options);
          let receipt = await this.wallet.sendTransaction(tx);
          return receipt;
        }
        async __deploy(params, options) {
          let receipt = await this._send("", params, options);
          this.address = receipt.contractAddress;
          return this.address;
        }
        send(methodName, params, options) {
          let receipt = this._send(methodName, params, options);
          return receipt;
        }
        _deploy(...params) {
          return this.__deploy(params);
        }
        methods(methodName, ...params) {
          let method = this._abi.find((e) => e.name == methodName);
          if (method.stateMutability == "view" || method.stateMutability == "pure") {
            return this.call(methodName, params);
          } else if (method.stateMutability == "payable") {
            let value = params.pop();
            return this.call(methodName, params, { value });
          } else {
            return this.send(methodName, params);
          }
        }
      };
      let Contract4 = _Contract2;
      Contract4.contracts = {};
      _Contract.Contract = Contract4;
    })(Contract3 || (Contract3 = {}));
    module2.exports = Contract3;
  }
});

// src/contracts/bin/erc20.json
var require_erc20 = __commonJS({
  "src/contracts/bin/erc20.json"(exports, module2) {
    module2.exports = {
      abi: [{ inputs: [{ internalType: "string", name: "name", type: "string" }, { internalType: "string", name: "symbol", type: "string" }, { internalType: "address", name: "_minter", type: "address" }, { internalType: "uint256", name: "totalSupply", type: "uint256" }], stateMutability: "nonpayable", type: "constructor" }, { anonymous: false, inputs: [{ indexed: true, internalType: "address", name: "owner", type: "address" }, { indexed: true, internalType: "address", name: "spender", type: "address" }, { indexed: false, internalType: "uint256", name: "value", type: "uint256" }], name: "Approval", type: "event" }, { anonymous: false, inputs: [{ indexed: true, internalType: "address", name: "from", type: "address" }, { indexed: true, internalType: "address", name: "to", type: "address" }, { indexed: false, internalType: "uint256", name: "value", type: "uint256" }], name: "Transfer", type: "event" }, { inputs: [{ internalType: "address", name: "owner", type: "address" }, { internalType: "address", name: "spender", type: "address" }], name: "allowance", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" }, { inputs: [{ internalType: "address", name: "spender", type: "address" }, { internalType: "uint256", name: "amount", type: "uint256" }], name: "approve", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "nonpayable", type: "function" }, { inputs: [{ internalType: "address", name: "account", type: "address" }], name: "balanceOf", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" }, { inputs: [], name: "cap", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" }, { inputs: [], name: "decimals", outputs: [{ internalType: "uint8", name: "", type: "uint8" }], stateMutability: "view", type: "function" }, { inputs: [{ internalType: "address", name: "spender", type: "address" }, { internalType: "uint256", name: "subtractedValue", type: "uint256" }], name: "decreaseAllowance", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "nonpayable", type: "function" }, { inputs: [{ internalType: "address", name: "spender", type: "address" }, { internalType: "uint256", name: "addedValue", type: "uint256" }], name: "increaseAllowance", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "nonpayable", type: "function" }, { inputs: [{ internalType: "address", name: "account", type: "address" }, { internalType: "uint256", name: "amount", type: "uint256" }], name: "mint", outputs: [], stateMutability: "nonpayable", type: "function" }, { inputs: [], name: "minter", outputs: [{ internalType: "address", name: "", type: "address" }], stateMutability: "view", type: "function" }, { inputs: [], name: "name", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function" }, { inputs: [], name: "symbol", outputs: [{ internalType: "string", name: "", type: "string" }], stateMutability: "view", type: "function" }, { inputs: [], name: "totalSupply", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function" }, { inputs: [{ internalType: "address", name: "recipient", type: "address" }, { internalType: "uint256", name: "amount", type: "uint256" }], name: "transfer", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "nonpayable", type: "function" }, { inputs: [{ internalType: "address", name: "sender", type: "address" }, { internalType: "address", name: "recipient", type: "address" }, { internalType: "uint256", name: "amount", type: "uint256" }], name: "transferFrom", outputs: [{ internalType: "bool", name: "", type: "bool" }], stateMutability: "nonpayable", type: "function" }],
      bytecode: "60a06040523480156200001157600080fd5b50604051620012a0380380620012a0833981810160405260808110156200003757600080fd5b81019080805160405193929190846401000000008211156200005857600080fd5b9083019060208201858111156200006e57600080fd5b82516401000000008111828201881017156200008957600080fd5b82525081516020918201929091019080838360005b83811015620000b85781810151838201526020016200009e565b50505050905090810190601f168015620000e65780820380516001836020036101000a031916815260200191505b50604052602001805160405193929190846401000000008211156200010a57600080fd5b9083019060208201858111156200012057600080fd5b82516401000000008111828201881017156200013b57600080fd5b82525081516020918201929091019080838360005b838110156200016a57818101518382015260200162000150565b50505050905090810190601f168015620001985780820380516001836020036101000a031916815260200191505b506040908152602082810151929091015186519294509250829186918691620001c891600391908501906200025e565b508051620001de9060049060208401906200025e565b50506005805460ff19166012179055508062000241576040805162461bcd60e51b815260206004820152601560248201527f45524332304361707065643a2063617020697320300000000000000000000000604482015290519081900360640190fd5b6006555060601b6001600160601b03191660805250620003039050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10620002a157805160ff1916838001178555620002d1565b82800160010185558215620002d1579182015b82811115620002d1578251825591602001919060010190620002b4565b50620002df929150620002e3565b5090565b6200030091905b80821115620002df5760008155600101620002ea565b90565b60805160601c610f7a620003266000398061047f52806105f35250610f7a6000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c8063395093511161008c57806395d89b411161006657806395d89b4114610314578063a457c2d71461031c578063a9059cbb14610355578063dd62ed3e1461038e576100ea565b8063395093511461026d57806340c10f19146102a657806370a08231146102e1576100ea565b806318160ddd116100c857806318160ddd146101ea57806323b872dd14610204578063313ce56714610247578063355274ea14610265576100ea565b806306fdde03146100ef578063075461721461016c578063095ea7b31461019d575b600080fd5b6100f76103c9565b6040805160208082528351818301528351919283929083019185019080838360005b83811015610131578181015183820152602001610119565b50505050905090810190601f16801561015e5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61017461047d565b6040805173ffffffffffffffffffffffffffffffffffffffff9092168252519081900360200190f35b6101d6600480360360408110156101b357600080fd5b5073ffffffffffffffffffffffffffffffffffffffff81351690602001356104a1565b604080519115158252519081900360200190f35b6101f26104be565b60408051918252519081900360200190f35b6101d66004803603606081101561021a57600080fd5b5073ffffffffffffffffffffffffffffffffffffffff8135811691602081013590911690604001356104c4565b61024f61056b565b6040805160ff9092168252519081900360200190f35b6101f2610574565b6101d66004803603604081101561028357600080fd5b5073ffffffffffffffffffffffffffffffffffffffff813516906020013561057a565b6102df600480360360408110156102bc57600080fd5b5073ffffffffffffffffffffffffffffffffffffffff81351690602001356105db565b005b6101f2600480360360208110156102f757600080fd5b503573ffffffffffffffffffffffffffffffffffffffff1661068d565b6100f76106b5565b6101d66004803603604081101561033257600080fd5b5073ffffffffffffffffffffffffffffffffffffffff8135169060200135610734565b6101d66004803603604081101561036b57600080fd5b5073ffffffffffffffffffffffffffffffffffffffff81351690602001356107af565b6101f2600480360360408110156103a457600080fd5b5073ffffffffffffffffffffffffffffffffffffffff813581169160200135166107c3565b60038054604080516020601f60027fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff6101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156104735780601f1061044857610100808354040283529160200191610473565b820191906000526020600020905b81548152906001019060200180831161045657829003601f168201915b5050505050905090565b7f000000000000000000000000000000000000000000000000000000000000000081565b60006104b56104ae6107fb565b84846107ff565b50600192915050565b60025490565b60006104d1848484610946565b610561846104dd6107fb565b61055c85604051806060016040528060288152602001610eaf6028913973ffffffffffffffffffffffffffffffffffffffff8a166000908152600160205260408120906105286107fb565b73ffffffffffffffffffffffffffffffffffffffff168152602081019190915260400160002054919063ffffffff610b2216565b6107ff565b5060019392505050565b60055460ff1690565b60065490565b60006104b56105876107fb565b8461055c85600160006105986107fb565b73ffffffffffffffffffffffffffffffffffffffff908116825260208083019390935260409182016000908120918c16815292529020549063ffffffff610bd316565b3373ffffffffffffffffffffffffffffffffffffffff7f0000000000000000000000000000000000000000000000000000000000000000161461067f57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600f60248201527f4e6f742066726f6d206d696e7465720000000000000000000000000000000000604482015290519081900360640190fd5b6106898282610c4e565b5050565b73ffffffffffffffffffffffffffffffffffffffff1660009081526020819052604090205490565b60048054604080516020601f60027fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff6101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156104735780601f1061044857610100808354040283529160200191610473565b60006104b56107416107fb565b8461055c85604051806060016040528060258152602001610f20602591396001600061076b6107fb565b73ffffffffffffffffffffffffffffffffffffffff908116825260208083019390935260409182016000908120918d1681529252902054919063ffffffff610b2216565b60006104b56107bc6107fb565b8484610946565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260016020908152604080832093909416825291909152205490565b3390565b73ffffffffffffffffffffffffffffffffffffffff831661086b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526024815260200180610efc6024913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff82166108d7576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526022815260200180610e676022913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff808416600081815260016020908152604080832094871680845294825291829020859055815185815291517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259281900390910190a3505050565b73ffffffffffffffffffffffffffffffffffffffff83166109b2576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526025815260200180610ed76025913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff8216610a1e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401808060200182810382526023815260200180610e446023913960400191505060405180910390fd5b610a29838383610d8b565b610a7981604051806060016040528060268152602001610e896026913973ffffffffffffffffffffffffffffffffffffffff8616600090815260208190526040902054919063ffffffff610b2216565b73ffffffffffffffffffffffffffffffffffffffff8085166000908152602081905260408082209390935590841681522054610abb908263ffffffff610bd316565b73ffffffffffffffffffffffffffffffffffffffff8084166000818152602081815260409182902094909455805185815290519193928716927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef92918290030190a3505050565b60008184841115610bcb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825283818151815260200191508051906020019080838360005b83811015610b90578181015183820152602001610b78565b50505050905090810190601f168015610bbd5780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b505050900390565b600082820183811015610c4757604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b9392505050565b73ffffffffffffffffffffffffffffffffffffffff8216610cd057604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015290519081900360640190fd5b610cdc60008383610d8b565b600254610cef908263ffffffff610bd316565b60025573ffffffffffffffffffffffffffffffffffffffff8216600090815260208190526040902054610d28908263ffffffff610bd316565b73ffffffffffffffffffffffffffffffffffffffff83166000818152602081815260408083209490945583518581529351929391927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9281900390910190a35050565b610d96838383610e3e565b73ffffffffffffffffffffffffffffffffffffffff8316610e3e57610db9610574565b610dd182610dc56104be565b9063ffffffff610bd316565b1115610e3e57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601960248201527f45524332304361707065643a2063617020657863656564656400000000000000604482015290519081900360640190fd5b50505056fe45524332303a207472616e7366657220746f20746865207a65726f206164647265737345524332303a20617070726f766520746f20746865207a65726f206164647265737345524332303a207472616e7366657220616d6f756e7420657863656564732062616c616e636545524332303a207472616e7366657220616d6f756e74206578636565647320616c6c6f77616e636545524332303a207472616e736665722066726f6d20746865207a65726f206164647265737345524332303a20617070726f76652066726f6d20746865207a65726f206164647265737345524332303a2064656372656173656420616c6c6f77616e63652062656c6f77207a65726fa26469706673582212207fc226d6e4710807cc45df55579a0cf7761d5ad01ffb12d78b630a3ab9858ef364736f6c634300060b0033"
    };
  }
});

// src/contracts/erc20.ts
var import_contract, import_bignumber3, Abi, Bytecode, Erc20;
var init_erc20 = __esm({
  "src/contracts/erc20.ts"() {
    import_contract = __toModule(require_contract());
    import_bignumber3 = __toModule(require("bignumber.js"));
    init_utils();
    Abi = require_erc20().abi;
    Bytecode = require_erc20().bytecode;
    Erc20 = class extends import_contract.Contract {
      constructor(wallet, address, decimals) {
        super(wallet, address, Abi, Bytecode);
        this._decimals = decimals;
      }
      async deploy(params) {
        return this.__deploy([params.name, params.symbol, params.minter || this.wallet.address, this.wallet.utils.toWei(params.cap ? params.cap.toString() : "1000000000")]);
      }
      parseApprovalEvent(receipt) {
        return this.parseEvents(receipt, "Approval").map((e) => this.decodeApprovalEvent(e));
      }
      decodeApprovalEvent(event) {
        let result = event.data;
        return {
          owner: result.owner,
          spender: result.spender,
          value: new import_bignumber3.BigNumber(result.value),
          _event: event
        };
      }
      parseTransferEvent(receipt) {
        return this.parseEvents(receipt, "Transfer").map((e) => this.decodeTransferEvent(e));
      }
      decodeTransferEvent(event) {
        let result = event.data;
        return {
          from: result.from,
          to: result.to,
          value: new import_bignumber3.BigNumber(result.value),
          _event: event
        };
      }
      async allowance(params) {
        return fromDecimals(await this.methods("allowance", params.owner, params.spender), await this.decimals);
      }
      approve(params) {
        return new Promise(async (resolve, reject) => {
          try {
            resolve(this.methods("approve", params.spender, await toDecimals(params.amount, await this.decimals)));
          } catch (err) {
            reject(err);
          }
        });
      }
      get balance() {
        return this.balanceOf(this.wallet.address);
      }
      async balanceOf(address) {
        return new Promise(async (resolve, reject) => {
          try {
            resolve(await fromDecimals(await this.methods("balanceOf", address), await this.decimals));
          } catch (err) {
            reject(err);
          }
        });
      }
      get cap() {
        return new Promise(async (resolve, reject) => {
          try {
            resolve(await fromDecimals(await this.methods("cap"), await this.decimals));
          } catch (err) {
            reject(err);
          }
        });
      }
      get decimals() {
        return new Promise(async (resolve, reject) => {
          try {
            if (!this._decimals)
              this._decimals = new import_bignumber3.BigNumber(await this.methods("decimals")).toNumber();
            resolve(this._decimals);
          } catch (err) {
            reject(err);
          }
        });
      }
      mint(params) {
        return new Promise(async (resolve, reject) => {
          try {
            resolve(await this.methods("mint", params.address, await toDecimals(params.amount, await this.decimals)));
          } catch (err) {
            reject(err);
          }
        });
      }
      minter() {
        return this.methods("minter");
      }
      get name() {
        return this.methods("name");
      }
      get symbol() {
        return this.methods("symbol");
      }
      get totalSupply() {
        return new Promise(async (resolve, reject) => {
          try {
            resolve(await fromDecimals(await this.methods("totalSupply"), await this.decimals));
          } catch (err) {
            reject(err);
          }
        });
      }
      async transfer(params) {
        return this.methods("transfer", params.address, await toDecimals(params.amount, await this.decimals));
      }
    };
  }
});

// src/kms.ts
var require_kms = __commonJS({
  "src/kms.ts"(exports, module2) {
    var AwsSDK = __toModule(require("aws-sdk"));
    var asn1 = __toModule(require("asn1.js"));
    var import_bn = __toModule(require("bn.js"));
    var ethutil = __toModule(require("ethereumjs-util"));
    var import_ethereumjs_tx = __toModule(require("ethereumjs-tx"));
    var KMS;
    (function(_KMS) {
      const EcdsaSigAsnParse = asn1 && asn1.define ? asn1.define("EcdsaSig", function() {
        this.seq().obj(this.key("r").int(), this.key("s").int());
      }) : void 0;
      const EcdsaPubKey = asn1 && asn1.define ? asn1.define("EcdsaPubKey", function() {
        this.seq().obj(this.key("algo").seq().obj(this.key("a").objid(), this.key("b").objid()), this.key("pubKey").bitstr());
      }) : void 0;
      function recoverPubKeyFromSig(msg, r, s, v) {
        let rBuffer = r.toBuffer();
        let sBuffer = s.toBuffer();
        let pubKey = ethutil.ecrecover(msg, v, rBuffer, sBuffer);
        let addrBuf = ethutil.pubToAddress(pubKey);
        let recoveredEthAddr = ethutil.bufferToHex(addrBuf);
        return recoveredEthAddr;
      }
      class KMS3 {
        constructor(options) {
          this._options = options;
          this._sdk = new AwsSDK.KMS(options);
        }
        getEthereumAddress(publicKey) {
          let res = EcdsaPubKey.decode(publicKey, "der");
          let pubKeyBuffer = res.pubKey.data;
          pubKeyBuffer = pubKeyBuffer.slice(1, pubKeyBuffer.length);
          let buf = ethutil.keccak256(pubKeyBuffer);
          return "0x" + buf.slice(-20).toString("hex");
        }
        async sign(msgHash) {
          const params = {
            KeyId: this._options.keyId,
            Message: msgHash,
            SigningAlgorithm: "ECDSA_SHA_256",
            MessageType: "DIGEST"
          };
          return await this._sdk.sign(params).promise();
        }
        async signMessage(chainId, message) {
          let hash = ethutil.hashPersonalMessage(ethutil.toBuffer(message));
          let sig = await this.findEthereumSig(hash);
          let address = await this.getAddress();
          let recoveredPubAddr = this.findRightKey(hash, sig.r, sig.s, address);
          let r = sig.r.toBuffer();
          let s = sig.s.toBuffer();
          let v = new import_bn.default(recoveredPubAddr.v + (chainId > 1 ? 8 + chainId * 2 : 0)).toBuffer();
          return "0x" + Buffer.concat([r, s, v]).toString("hex");
        }
        async findEthereumSig(plaintext) {
          let signature = await this.sign(plaintext);
          if (signature.Signature == void 0) {
            throw new Error("Signature is undefined.");
          }
          let decoded = EcdsaSigAsnParse.decode(signature.Signature, "der");
          let r = decoded.r;
          let s = decoded.s;
          let secp256k1N = new import_bn.default("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141", 16);
          let secp256k1halfN = secp256k1N.div(new import_bn.default(2));
          if (s.gt(secp256k1halfN)) {
            s = secp256k1N.sub(s);
          }
          return { r, s };
        }
        findRightKey(msg, r, s, expectedEthAddr) {
          let v = 27;
          let pubKey = recoverPubKeyFromSig(msg, r, s, v);
          if (pubKey != expectedEthAddr) {
            v = 28;
            pubKey = recoverPubKeyFromSig(msg, r, s, v);
          }
          return { pubKey, v };
        }
        async getPublicKey() {
          return this._sdk.getPublicKey({
            KeyId: this._options.keyId
          }).promise();
        }
        async getAddress() {
          if (!this._address) {
            let pubKey = await this.getPublicKey();
            this._address = this.getEthereumAddress(pubKey.PublicKey);
          }
          return this._address;
        }
        async signTransaction(chainId, txData) {
          const tx = new import_ethereumjs_tx.Transaction(txData, {
            chain: chainId
          });
          let txHash = tx.hash(false);
          let sig = await this.findEthereumSig(txHash);
          let address = await this.getAddress();
          let recoveredPubAddr = this.findRightKey(txHash, sig.r, sig.s, address);
          tx.r = sig.r.toBuffer();
          tx.s = sig.s.toBuffer();
          tx.v = new import_bn.default(recoveredPubAddr.v + (chainId > 1 ? 8 + chainId * 2 : 0)).toBuffer();
          const serializedTx = tx.serialize().toString("hex");
          return "0x" + serializedTx;
        }
      }
      _KMS.KMS = KMS3;
    })(KMS || (KMS = {}));
    module2.exports = KMS;
  }
});

// src/wallet.ts
var require_wallet = __commonJS({
  "src/wallet.ts"(exports, module2) {
    var W3 = __toModule(require("web3"));
    var import_bignumber5 = __toModule(require("bignumber.js"));
    init_erc20();
    var import_kms = __toModule(require_kms());
    var Web32 = initWeb3Lib();
    var Web3Modal;
    var WalletConnectProvider;
    var RequireJS = {
      require(reqs, callback) {
        window.require(reqs, callback);
      }
    };
    function initWeb3Lib() {
      if (typeof window !== "undefined" && window["Web3"])
        return window["Web3"];
      else
        return require("web3");
    }
    function initWeb3ModalLib(callback) {
      if (typeof window !== "undefined") {
        RequireJS.require(["WalletConnectProvider", "Web3Modal"], (walletconnect, web3modal) => {
          window["WalletConnectProvider"] = walletconnect;
          window["Web3Modal"] = web3modal;
          callback();
        });
      }
    }
    var Wallet2;
    (function(_Wallet) {
      ;
      ;
      ;
      ;
      const WalletUtils = {
        fromWei(value) {
          return new import_bignumber5.BigNumber(W3.default.utils.fromWei(value));
        }
      };
      _Wallet.DefaultNetworksMap = {
        1: {
          chainId: 1,
          chainName: "Ethereum Mainnet",
          rpcUrls: ["https://mainnet.infura.io/v3/{INFURA_ID}"],
          blockExplorerUrls: ["https://etherscan.io/"],
          nativeCurrency: {
            decimals: 18,
            name: "ETH",
            symbol: "ETH"
          }
        },
        3: {
          chainId: 3,
          chainName: "Ropsten Test Network",
          rpcUrls: ["https://ropsten.infura.io/v3/{INFURA_ID}"],
          blockExplorerUrls: ["https://ropsten.etherscan.io"],
          nativeCurrency: {
            decimals: 18,
            name: "ETH",
            symbol: "ETH"
          }
        },
        4: {
          chainId: 4,
          chainName: "Rinkeby Test Network",
          rpcUrls: ["https://rinkeby.infura.io/v3/{INFURA_ID}"],
          blockExplorerUrls: ["https://rinkeby.etherscan.io"],
          nativeCurrency: {
            decimals: 18,
            name: "ETH",
            symbol: "ETH"
          }
        },
        42: {
          chainId: 42,
          chainName: "Kovan Test Network",
          rpcUrls: ["https://kovan.infura.io/v3/{INFURA_ID}"],
          blockExplorerUrls: ["https://kovan.etherscan.io/"],
          nativeCurrency: {
            decimals: 18,
            name: "ETH",
            symbol: "ETH"
          }
        },
        56: {
          chainId: 56,
          chainName: "Binance Mainnet",
          rpcUrls: ["https://bsc-dataseed.binance.org"],
          blockExplorerUrls: ["https://bscscan.com"],
          nativeCurrency: {
            decimals: 18,
            name: "BNB",
            symbol: "BNB"
          }
        },
        97: {
          chainId: 97,
          chainName: "Binance Testnet",
          rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
          blockExplorerUrls: ["https://testnet.bscscan.com"],
          nativeCurrency: {
            decimals: 18,
            name: "BNB",
            symbol: "BNB"
          }
        },
        137: {
          chainId: 137,
          chainName: "Polygon",
          rpcUrls: ["https://polygon-rpc.com"],
          blockExplorerUrls: ["https://polygonscan.com/"],
          nativeCurrency: {
            decimals: 18,
            name: "MATIC",
            symbol: "MATIC"
          }
        },
        1287: {
          chainId: 1287,
          chainName: "Moonbeam Testnet",
          rpcUrls: ["https://rpc.testnet.moonbeam.network"],
          blockExplorerUrls: ["https://moonbase-blockscout.testnet.moonbeam.network"],
          nativeCurrency: {
            decimals: 18,
            name: "MOON",
            symbol: "MOON"
          }
        },
        31337: {
          chainId: 31337,
          chainName: "Amino Testnet",
          rpcUrls: ["https://leucine0.node.alphacarbon.network"],
          blockExplorerUrls: ["https://leucine0.blockscout.alphacarbon.network"],
          nativeCurrency: {
            decimals: 18,
            name: "TACT",
            symbol: "TACT"
          }
        },
        80001: {
          chainId: 80001,
          chainName: "Mumbai",
          rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
          blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
          nativeCurrency: {
            decimals: 18,
            name: "MATIC",
            symbol: "MATIC"
          }
        },
        43113: {
          chainId: 43113,
          chainName: "Avalanche FUJI C-Chain",
          rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
          blockExplorerUrls: ["https://testnet.snowtrace.io/"],
          nativeCurrency: {
            decimals: 18,
            name: "AVAX",
            symbol: "AVAX"
          }
        },
        43114: {
          chainId: 43114,
          chainName: "Avalanche Mainnet C-Chain",
          rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
          blockExplorerUrls: ["https://snowtrace.io/"],
          nativeCurrency: {
            decimals: 18,
            name: "AVAX",
            symbol: "AVAX"
          }
        },
        4002: {
          chainId: 4002,
          chainName: "Fantom Testnet",
          rpcUrls: ["https://rpc.testnet.fantom.network/"],
          blockExplorerUrls: ["https://testnet.ftmscan.com/", "https://explorer.testnet.fantom.network/"],
          nativeCurrency: {
            decimals: 18,
            name: "FTM",
            symbol: "FTM"
          }
        },
        250: {
          chainId: 250,
          chainName: "Fantom Opera",
          rpcUrls: ["https://rpc.ftm.tools/"],
          blockExplorerUrls: ["https://ftmscan.com/", "https://explorer.fantom.network/"],
          nativeCurrency: {
            decimals: 18,
            name: "FTM",
            symbol: "FTM"
          }
        },
        13370: {
          chainId: 13370,
          chainName: "AminoX Testnet",
          rpcUrls: ["https://aminoxtestnet.node.alphacarbon.network"],
          blockExplorerUrls: ["https://aminoxtestnet.blockscout.alphacarbon.network/"],
          nativeCurrency: {
            decimals: 18,
            name: "TACT",
            symbol: "TACT"
          }
        }
      };
      let WalletPlugin2;
      (function(WalletPlugin3) {
        WalletPlugin3["MetaMask"] = "metamask";
        WalletPlugin3["Coin98"] = "coin98";
        WalletPlugin3["TrustWallet"] = "trustwallet";
        WalletPlugin3["BinanceChainWallet"] = "binancechainwallet";
        WalletPlugin3["ONTOWallet"] = "onto";
        WalletPlugin3["WalletConnect"] = "walletconnect";
        WalletPlugin3["BitKeepWallet"] = "bitkeepwallet";
      })(WalletPlugin2 = _Wallet.WalletPlugin || (_Wallet.WalletPlugin = {}));
      _Wallet.WalletPluginConfig = {
        [WalletPlugin2.MetaMask]: {
          provider: () => {
            return window["ethereum"];
          },
          installed: () => {
            let ethereum = window["ethereum"];
            return !!ethereum && !!ethereum.isMetaMask;
          },
          homepage: () => {
            return "https://metamask.io/download.html";
          }
        },
        [WalletPlugin2.Coin98]: {
          provider: () => {
            return window["ethereum"];
          },
          installed: () => {
            let ethereum = window["ethereum"];
            return !!ethereum && (!!ethereum.isCoin98 || !!window["isCoin98"]);
          },
          homepage: () => {
            return "https://docs.coin98.com/products/coin98-wallet";
          }
        },
        [WalletPlugin2.TrustWallet]: {
          provider: () => {
            return window["ethereum"];
          },
          installed: () => {
            let ethereum = window["ethereum"];
            return !!ethereum && !!ethereum.isTrust;
          },
          homepage: () => {
            return "https://link.trustwallet.com/open_url?url=" + window.location.href;
          }
        },
        [WalletPlugin2.BinanceChainWallet]: {
          provider: () => {
            return window["BinanceChain"];
          },
          installed: () => {
            return !!window["BinanceChain"];
          },
          homepage: () => {
            return "https://www.binance.org/en";
          }
        },
        [WalletPlugin2.ONTOWallet]: {
          provider: () => {
            return window["onto"];
          },
          installed: () => {
            return !!window["onto"];
          },
          homepage: () => {
            return "https://onto.app/en/download/?mode=app";
          }
        },
        [WalletPlugin2.BitKeepWallet]: {
          provider: () => {
            return window["bitkeep"]["ethereum"];
          },
          installed: () => {
            return !!window["isBitKeep"];
          },
          homepage: () => {
            return "https://bitkeep.com/download?type=2";
          }
        }
      };
      class ClientSideProvider {
        constructor(wallet, walletPlugin, events, options) {
          this._isConnected = false;
          this.wallet = wallet;
          this.walletPlugin = walletPlugin;
          this._events = events;
          this._options = options;
        }
        get installed() {
          return _Wallet.WalletPluginConfig[this.walletPlugin].installed();
        }
        initEvents() {
          let self = this;
          if (this.installed) {
            this.provider.on("accountsChanged", (accounts) => {
              let accountAddress;
              let hasAccounts = accounts && accounts.length > 0;
              if (hasAccounts) {
                accountAddress = self.wallet.web3.utils.toChecksumAddress(accounts[0]);
                self.wallet.web3.selectedAddress = accountAddress;
                self.wallet.account = {
                  address: accountAddress
                };
              }
              this._isConnected = hasAccounts;
              if (self.onAccountChanged)
                self.onAccountChanged(accountAddress);
            });
            this.provider.on("chainChanged", (chainId) => {
              self.wallet.chainId = parseInt(chainId);
              if (this._options && this._options.callWithDefaultProvider) {
                if (this._options.infuraId)
                  this.wallet.infuraId = this._options.infuraId;
                self.wallet.setDefaultProvider();
              }
              if (self.onChainChanged)
                self.onChainChanged(chainId);
            });
            this.provider.on("connect", (connectInfo) => {
              if (self.onConnect)
                self.onConnect(connectInfo);
            });
            this.provider.on("disconnect", (error) => {
              if (self.onDisconnect)
                self.onDisconnect(error);
            });
          }
          ;
        }
        async connect() {
          this.provider = _Wallet.WalletPluginConfig[this.walletPlugin].provider();
          this.wallet.chainId = parseInt(this.provider.chainId, 16);
          if (this._events) {
            this.onAccountChanged = this._events.onAccountChanged;
            this.onChainChanged = this._events.onChainChanged;
            this.onConnect = this._events.onConnect;
            this.onDisconnect = this._events.onDisconnect;
          }
          this.initEvents();
          let self = this;
          try {
            if (this.installed) {
              await this.provider.request({ method: "eth_requestAccounts" }).then((accounts) => {
                let accountAddress;
                let hasAccounts = accounts && accounts.length > 0;
                if (hasAccounts) {
                  accountAddress = self.wallet.web3.utils.toChecksumAddress(accounts[0]);
                  self.wallet.web3.selectedAddress = accountAddress;
                  self.wallet.account = {
                    address: accountAddress
                  };
                }
                this._isConnected = hasAccounts;
                if (self.onAccountChanged)
                  self.onAccountChanged(accountAddress);
              });
            }
          } catch (error) {
            console.error(error);
          }
          return this.provider;
        }
        async disconnect() {
          if (this.provider == null) {
            return;
          }
          if (this.provider.disconnect) {
            await this.provider.disconnect();
          }
          this.wallet.account = null;
          this._isConnected = false;
        }
        get isConnected() {
          return this._isConnected;
        }
        addToken(option, type) {
          return new Promise(async function(resolve, reject) {
            try {
              let result = await this.provider.request({
                method: "wallet_watchAsset",
                params: {
                  type: type || "ERC20",
                  options: option
                }
              });
              resolve(result);
            } catch (err) {
              reject(err);
            }
          });
        }
        switchNetwork(chainId, onChainChanged) {
          let self = this;
          if (onChainChanged) {
            this.onChainChanged = onChainChanged;
          }
          return new Promise(async function(resolve, reject) {
            try {
              let chainIdHex = "0x" + chainId.toString(16);
              try {
                let result = await self.provider.request({
                  method: "wallet_switchEthereumChain",
                  params: [{
                    chainId: chainIdHex
                  }]
                });
                resolve(!result);
              } catch (error) {
                if (error.code === 4902) {
                  try {
                    let network = self.wallet.networksMap[chainId];
                    if (!network)
                      resolve(false);
                    let { chainName, nativeCurrency, rpcUrls, blockExplorerUrls, iconUrls } = network;
                    if (!Array.isArray(rpcUrls))
                      rpcUrls = [rpcUrls];
                    if (blockExplorerUrls && !Array.isArray(blockExplorerUrls))
                      blockExplorerUrls = [blockExplorerUrls];
                    if (iconUrls && !Array.isArray(iconUrls))
                      iconUrls = [iconUrls];
                    let result = await self.provider.request({
                      method: "wallet_addEthereumChain",
                      params: [{
                        chainId: chainIdHex,
                        chainName,
                        nativeCurrency,
                        rpcUrls,
                        blockExplorerUrls,
                        iconUrls
                      }]
                    });
                    resolve(!result);
                  } catch (error2) {
                    reject(error2);
                  }
                } else
                  reject(error);
              }
            } catch (err) {
              reject(err);
            }
          });
        }
        addNetwork(options) {
          return new Promise(async function(resolve, reject) {
            try {
              options = JSON.parse(JSON.stringify(options));
              let chainIdHex = "0x" + options.chainId.toString(16);
              try {
                await this.provider.request({
                  method: "wallet_switchEthereumChain",
                  params: [{ chainId: chainIdHex }]
                });
                resolve(true);
              } catch (err) {
                let result = await this.provider.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    options
                  ]
                });
                resolve(!result);
              }
            } catch (err) {
              reject(err);
            }
          });
        }
      }
      _Wallet.ClientSideProvider = ClientSideProvider;
      class BinanceChainWalletProvider extends ClientSideProvider {
        switchNetwork(chainId, onChainChanged) {
          let self = this;
          if (onChainChanged) {
            this.onChainChanged = onChainChanged;
          }
          return new Promise(async function(resolve, reject) {
            try {
              let chainIdHex = "0x" + chainId.toString(16);
              try {
                let result = await self.provider.request({
                  method: "wallet_switchEthereumChain",
                  params: [{
                    chainId: chainIdHex
                  }]
                });
                resolve(!result);
              } catch (error) {
                if (error.code === 4902) {
                  try {
                    let network = self.wallet.networksMap[chainId];
                    if (!network)
                      resolve(false);
                    let { chainName, nativeCurrency, rpcUrls, blockExplorerUrls, iconUrls } = network;
                    if (!Array.isArray(rpcUrls))
                      rpcUrls = [rpcUrls];
                    if (blockExplorerUrls && !Array.isArray(blockExplorerUrls))
                      blockExplorerUrls = [blockExplorerUrls];
                    if (iconUrls && !Array.isArray(iconUrls))
                      iconUrls = [iconUrls];
                    let result = await self.provider.request({
                      method: "wallet_addEthereumChain",
                      params: [{
                        chainId: chainIdHex,
                        chainName,
                        nativeCurrency,
                        rpcUrls,
                        blockExplorerUrls,
                        iconUrls
                      }]
                    });
                    resolve(!result);
                  } catch (error2) {
                    reject(error2);
                  }
                } else
                  reject(error);
              }
            } catch (err) {
              reject(err);
            }
          });
        }
      }
      _Wallet.BinanceChainWalletProvider = BinanceChainWalletProvider;
      class Web3ModalProvider extends ClientSideProvider {
        constructor(wallet, walletPlugin, events, options) {
          super(wallet, walletPlugin, events);
          this.initializeWeb3Modal(options);
        }
        get installed() {
          return true;
        }
        initializeWeb3Modal(options) {
          let func = () => {
            WalletConnectProvider = window["WalletConnectProvider"];
            const providerOptions = {
              walletconnect: {
                package: WalletConnectProvider.default,
                options
              }
            };
            Web3Modal = window["Web3Modal"];
            this.web3Modal = new Web3Modal.default({
              cacheProvider: false,
              providerOptions
            });
          };
          initWeb3ModalLib(func);
        }
        async connect() {
          await this.disconnect();
          this.provider = await this.web3Modal.connectTo(WalletPlugin2.WalletConnect);
          this.wallet.chainId = this.provider.chainId;
          this.wallet.web3.setProvider(this.provider);
          if (this._events) {
            this.onAccountChanged = this._events.onAccountChanged;
            this.onChainChanged = this._events.onChainChanged;
            this.onConnect = this._events.onConnect;
            this.onDisconnect = this._events.onDisconnect;
          }
          this.initEvents();
          let self = this;
          try {
            await this.wallet.web3.eth.getAccounts((err, accounts) => {
              let accountAddress;
              let hasAccounts = accounts && accounts.length > 0;
              if (hasAccounts) {
                accountAddress = self.wallet.web3.utils.toChecksumAddress(accounts[0]);
                self.wallet.web3.selectedAddress = accountAddress;
                this.wallet.account = {
                  address: accountAddress
                };
              }
              this._isConnected = hasAccounts;
              if (self.onAccountChanged)
                self.onAccountChanged(accountAddress);
            });
          } catch (error) {
            console.error(error);
          }
          return this.provider;
        }
        async disconnect() {
          if (this.provider == null) {
            return;
          }
          if (this.provider.disconnect) {
            await this.provider.disconnect();
          }
          this.wallet.account = null;
          this._isConnected = false;
        }
      }
      _Wallet.Web3ModalProvider = Web3ModalProvider;
      function createClientSideProvider(wallet, walletPlugin, events, providerOptions) {
        if (Wallet3.isInstalled(walletPlugin)) {
          if (walletPlugin == WalletPlugin2.BinanceChainWallet) {
            return new BinanceChainWalletProvider(wallet, walletPlugin, events);
          }
          if (walletPlugin == WalletPlugin2.WalletConnect) {
            return new Web3ModalProvider(wallet, walletPlugin, events, providerOptions);
          } else {
            return new ClientSideProvider(wallet, walletPlugin, events);
          }
        }
        return null;
      }
      _Wallet.createClientSideProvider = createClientSideProvider;
      const _Wallet2 = class {
        constructor(provider, account) {
          this._eventTopicAbi = {};
          this._eventHandler = {};
          this._sendTxEventHandler = {};
          this._contracts = {};
          this._networksMap = {};
          this._abiHashDict = {};
          this._abiAddressDict = {};
          this._abiEventDict = {};
          this._provider = provider;
          this._web3 = new Web32(provider);
          if (Array.isArray(account)) {
            this._accounts = account;
            this._account = account[0];
          } else
            this._account = account;
          if (this._account && this._account.privateKey && !this._account.address)
            this._account.address = this._web3.eth.accounts.privateKeyToAccount(this._account.privateKey).address;
          this._networksMap = _Wallet.DefaultNetworksMap;
        }
        static getInstance() {
          return _Wallet2.instance;
        }
        static isInstalled(walletPlugin) {
          if (walletPlugin == WalletPlugin2.WalletConnect)
            return true;
          return _Wallet.WalletPluginConfig[walletPlugin] ? _Wallet.WalletPluginConfig[walletPlugin].installed() : false;
        }
        get isConnected() {
          return this.clientSideProvider ? this.clientSideProvider.isConnected : false;
        }
        async switchNetwork(chainId, onChainChanged) {
          let result;
          if (this.clientSideProvider) {
            result = await this.clientSideProvider.switchNetwork(chainId, onChainChanged);
          } else {
            this.chainId = chainId;
            this.setDefaultProvider();
            onChainChanged("0x" + chainId.toString(16));
          }
          return result;
        }
        setDefaultProvider() {
          var _a;
          if (!this.chainId)
            this.chainId = 56;
          if (this._networksMap[this.chainId] && this._networksMap[this.chainId].rpcUrls.length > 0) {
            let rpc = this._networksMap[this.chainId].rpcUrls[0];
            if (rpc.indexOf("{INFURA_ID}")) {
              rpc = rpc.replace("{INFURA_ID}", (_a = this._infuraId) != null ? _a : "");
            }
            this.provider = rpc;
          }
        }
        async connect(walletPlugin, events, providerOptions) {
          this.clientSideProvider = createClientSideProvider(this, walletPlugin, events, providerOptions);
          if (this.clientSideProvider) {
            await this.clientSideProvider.connect();
            if (providerOptions && providerOptions.callWithDefaultProvider) {
              if (providerOptions.infuraId)
                this._infuraId = providerOptions.infuraId;
              this.setDefaultProvider();
            } else {
              this.provider = this.clientSideProvider.provider;
            }
          } else {
            this.setDefaultProvider();
          }
          return this.clientSideProvider;
        }
        async disconnect() {
          if (this.clientSideProvider) {
            await this.clientSideProvider.disconnect();
          }
          this.setDefaultProvider();
        }
        get accounts() {
          return new Promise((resolve) => {
            if (this._accounts) {
              let result = [];
              for (let i = 0; i < this._accounts.length; i++) {
                if (!this._accounts[i].address && this._accounts[i].privateKey)
                  this._accounts[i].address = this._web3.eth.accounts.privateKeyToAccount(this._accounts[i].privateKey).address;
                result.push(this._accounts[i].address);
              }
              return resolve(result);
            } else if (this._account)
              return resolve([this._account.address]);
            resolve(this._web3.eth.getAccounts());
          });
        }
        get address() {
          if (this._account && this._account.privateKey) {
            if (!this._account.address)
              this._account.address = this._web3.eth.accounts.privateKeyToAccount(this._account.privateKey).address;
            return this._account.address;
          } else if (this._kms && this._account) {
            return this._account.address;
          } else if (this._web3.selectedAddress) {
            return this._web3.selectedAddress;
          } else if (this._web3.eth.defaultAccount) {
            return this._web3.eth.defaultAccount;
          }
          if (!this._account) {
            this._account = this.createAccount();
            return this._account.address;
          } else
            return this._account.address;
        }
        get account() {
          return {
            address: this.address
          };
        }
        set account(value) {
          this._kms = null;
          this._web3.eth.defaultAccount = "";
          this._account = value;
        }
        get infuraId() {
          return this._infuraId;
        }
        set infuraId(value) {
          this._infuraId = value;
          this.setDefaultProvider();
        }
        get networksMap() {
          return this._networksMap;
        }
        getNetworkInfo(chainId) {
          return this._networksMap[chainId];
        }
        setNetworkInfo(network) {
          this._networksMap[network.chainId] = network;
        }
        setMultipleNetworksInfo(networks) {
          for (let network of networks) {
            this.setNetworkInfo(network);
          }
        }
        createAccount() {
          let acc = this._web3.eth.accounts.create();
          return {
            address: acc.address,
            privateKey: acc.privateKey
          };
        }
        decodeLog(inputs, hexString, topics) {
          return this.web3.eth.abi.decodeLog(inputs, hexString, topics);
        }
        get defaultAccount() {
          if (this._account)
            return this._account.address;
          return this._web3.eth.defaultAccount;
        }
        set defaultAccount(address) {
          if (this._accounts) {
            for (let i = 0; i < this._accounts.length; i++) {
              if (!this._accounts[i].address && this._accounts[i].privateKey)
                this._accounts[i].address = this._web3.eth.accounts.privateKeyToAccount(this._accounts[i].privateKey).address;
              if (this._accounts[i].address && this._accounts[i].address.toLowerCase() == address.toLowerCase()) {
                this._account = this._accounts[i];
                return;
              }
            }
          } else if (this._account && this._account.address && this._account.address.toLowerCase() == address.toLowerCase()) {
            return;
          } else
            this._web3.eth.defaultAccount = address;
        }
        async getChainId() {
          if (!this.chainId)
            this.chainId = await this._web3.eth.getChainId();
          return this.chainId;
        }
        get provider() {
          return this._provider;
        }
        set provider(value) {
          this._web3.setProvider(value);
          this._provider = value;
        }
        sendSignedTransaction(tx) {
          let _web3 = this._web3;
          return _web3.eth.sendSignedTransaction(tx);
        }
        async signTransaction(tx, privateKey) {
          let _web3 = this._web3;
          let gas = tx.gas || await _web3.eth.estimateGas({
            from: this.address,
            to: tx.to,
            data: tx.data
          });
          let gasLimit = tx.gasLimit || gas;
          let nonce = tx.nonce || await _web3.eth.getTransactionCount(this.address);
          if (privateKey || this._account && this._account.privateKey) {
            let signedTx = await _web3.eth.accounts.signTransaction({
              nonce,
              gas,
              gasLimit,
              data: tx.data,
              from: this.address,
              to: tx.to
            }, privateKey ? privateKey : this._account.privateKey);
            return signedTx.rawTransaction;
          } else if (this._account && this._account.kms) {
            let chainId = await this.getChainId();
            let txHash = await this.kms.signTransaction(chainId, tx);
            return txHash;
          } else {
            let t = await _web3.eth.signTransaction({
              from: this.address,
              nonce,
              gasLimit,
              gas,
              to: tx.to,
              data: tx.data
            }, this.address);
            return t.raw;
          }
        }
        registerSendTxEvents(eventsOptions) {
          this._sendTxEventHandler = eventsOptions;
        }
        async _methods(...args) {
          let _web3 = this._web3;
          let result;
          let value;
          let method;
          let methodAbi;
          let byteCode;
          let abi = args.shift();
          let address = args.shift();
          let methodName = args.shift();
          if (methodName == "deploy")
            byteCode = args.shift();
          let contract;
          let hash;
          if (this._contracts[address])
            contract = this._contracts[address];
          else {
            hash = this._web3.utils.sha3(JSON.stringify(abi));
            if (this._contracts[hash]) {
              contract = this._contracts[hash];
            }
          }
          if (!contract) {
            contract = new this._web3.eth.Contract(abi);
            this._contracts[address] = contract;
            this._contracts[hash] = contract;
          }
          if (methodName == "deploy") {
            method = contract[methodName]({
              data: byteCode,
              arguments: args
            });
          } else {
            for (let i = 0; i < abi.length; i++) {
              if (abi[i].name == methodName) {
                methodAbi = abi[i];
                break;
              }
            }
            if (methodAbi.payable)
              value = args.pop();
            for (let i = 0; i < methodAbi.inputs.length; i++) {
              if (methodAbi.inputs[i].type.indexOf("bytes") == 0) {
                args[i] = args[i] || "";
                if (methodAbi.inputs[i].type.indexOf("[]") > 0) {
                  let a = [];
                  for (let k = 0; k < args[i].length; k++) {
                    let s = args[i][k] || "";
                    if (s.indexOf("0x") != 0)
                      a.push(_web3.utils.fromAscii(s));
                    else
                      a.push(s);
                  }
                  args[i] = a;
                } else if (args[i].indexOf("0x") != 0)
                  args[i] = _web3.utils.fromAscii(args[i]);
              } else if (methodAbi.inputs[i].type == "address") {
                if (!args[i])
                  args[i] = _web3.eth.abi.encodeParameter("address", 0);
              }
            }
            method = contract.methods[methodName].apply(contract, args);
          }
          let tx = {
            to: address,
            data: method.encodeABI()
          };
          return tx;
        }
        async methods(...args) {
          let _web3 = this._web3;
          if (_web3.methods) {
            return _web3.methods.apply(_web3, args);
          } else {
            let result;
            let value;
            let method;
            let methodAbi;
            let byteCode;
            let abi = args.shift();
            let address = args.shift();
            let methodName = args.shift();
            if (methodName == "deploy")
              byteCode = args.shift();
            let contract;
            let hash;
            if (address && this._contracts[address])
              contract = this._contracts[address];
            else {
              hash = this._web3.utils.sha3(JSON.stringify(abi));
              if (this._contracts[hash]) {
                contract = this._contracts[hash];
              }
            }
            ;
            if (!contract) {
              contract = new this._web3.eth.Contract(abi);
              if (address)
                this._contracts[address] = contract;
              this._contracts[hash] = contract;
            }
            ;
            if (methodName == "deploy") {
              method = contract[methodName]({
                data: byteCode,
                arguments: args
              });
            } else {
              for (let i = 0; i < abi.length; i++) {
                if (abi[i].name == methodName) {
                  methodAbi = abi[i];
                  break;
                }
              }
              if (methodAbi.payable)
                value = args.pop();
              for (let i = 0; i < methodAbi.inputs.length; i++) {
                if (methodAbi.inputs[i].type.indexOf("bytes") == 0) {
                  args[i] = args[i] || "";
                  if (methodAbi.inputs[i].type.indexOf("[]") > 0) {
                    let a = [];
                    for (let k = 0; k < args[i].length; k++) {
                      let s = args[i][k] || "";
                      if (s.indexOf("0x") != 0)
                        a.push(_web3.utils.fromAscii(s));
                      else
                        a.push(s);
                    }
                    args[i] = a;
                  } else if (args[i].indexOf("0x") != 0)
                    args[i] = _web3.utils.fromAscii(args[i]);
                } else if (methodAbi.inputs[i].type == "address") {
                  if (!args[i])
                    args[i] = _web3.eth.abi.encodeParameter("address", 0);
                }
              }
              method = contract.methods[methodName].apply(contract, args);
            }
            ;
            contract.options.address = address;
            if (methodAbi && (methodAbi.constant || methodAbi.stateMutability == "view")) {
              return method.call({ from: this.address });
            }
            if (!this._blockGasLimit) {
              this._blockGasLimit = (await _web3.eth.getBlock("latest")).gasLimit;
            }
            let gas;
            try {
              gas = await method.estimateGas({ from: this.address, to: address, value });
              gas = Math.min(this._blockGasLimit, Math.round(gas * 1.5));
            } catch (e) {
              if (e.message == "Returned error: out of gas") {
                console.log(e.message);
                gas = Math.round(this._blockGasLimit * 0.5);
              } else {
                try {
                  await method.call({ from: this.address, value });
                } catch (e2) {
                  if (e2.message.includes("VM execution error.")) {
                    var msg = (e2.data || e2.message).match(/0x[0-9a-fA-F]+/);
                    if (msg && msg.length) {
                      msg = msg[0];
                      if (msg.startsWith("0x08c379a")) {
                        msg = _web3.eth.abi.decodeParameter("string", "0x" + msg.substring(10));
                        throw new Error(msg);
                      }
                    }
                  }
                }
                throw e;
              }
            }
            let gasPrice = await _web3.eth.getGasPrice();
            if (this._account && this._account.privateKey) {
              let tx = {
                gas,
                gasPrice,
                data: method.encodeABI(),
                from: this.address,
                to: address,
                value
              };
              let signedTx = await _web3.eth.accounts.signTransaction(tx, this._account.privateKey);
              result = await _web3.eth.sendSignedTransaction(signedTx.rawTransaction);
              if (methodName == "deploy")
                return result.contractAddress;
              return result;
            } else if (this._account && this._account.kms) {
              let nonce = await _web3.eth.getTransactionCount(this.address);
              let price = _web3.utils.numberToHex(await _web3.eth.getGasPrice());
              let tx = {
                from: this.address,
                nonce,
                gasPrice: price,
                gasLimit: gas,
                gas,
                to: address,
                data: method.encodeABI()
              };
              let chainId = await this.getChainId();
              let txHash = await this.kms.signTransaction(chainId, tx);
              result = await _web3.eth.sendSignedTransaction(txHash);
              if (methodName == "deploy")
                return result.contractAddress;
              return result;
            } else {
              contract.options.address = address;
              let nonce = await _web3.eth.getTransactionCount(this.address);
              let tx = {
                from: this.address,
                nonce,
                gasPrice,
                gas,
                to: address,
                value,
                data: method.encodeABI()
              };
              let promiEvent = _web3.eth.sendTransaction(tx);
              promiEvent.on("error", (error) => {
                if (error.message.startsWith("Transaction was not mined within 50 blocks")) {
                  return;
                }
                if (this._sendTxEventHandler.transactionHash)
                  this._sendTxEventHandler.transactionHash(error);
              });
              promiEvent.on("transactionHash", (receipt) => {
                if (this._sendTxEventHandler.transactionHash)
                  this._sendTxEventHandler.transactionHash(null, receipt);
              });
              promiEvent.on("confirmation", (confNumber, receipt) => {
                if (this._sendTxEventHandler.confirmation && confNumber == 1)
                  this._sendTxEventHandler.confirmation(receipt);
              });
              result = await promiEvent;
              if (methodName == "deploy")
                return result.contractAddress;
              return result;
            }
          }
        }
        get balance() {
          let self = this;
          let _web3 = this._web3;
          return new Promise(async function(resolve) {
            try {
              let network = self._networksMap[self.chainId];
              let decimals = 18;
              if (network && network.nativeCurrency && network.nativeCurrency.decimals)
                decimals = network.nativeCurrency.decimals;
              let result = await _web3.eth.getBalance(self.address);
              resolve(new import_bignumber5.BigNumber(result).div(10 ** decimals));
            } catch (err) {
              resolve(new import_bignumber5.BigNumber(0));
            }
          });
        }
        balanceOf(address) {
          let self = this;
          let _web3 = this._web3;
          return new Promise(async function(resolve) {
            try {
              let network = self._networksMap[self.chainId];
              let decimals = 18;
              if (network && network.nativeCurrency && network.nativeCurrency.decimals)
                decimals = network.nativeCurrency.decimals;
              let result = await _web3.eth.getBalance(address);
              resolve(new import_bignumber5.BigNumber(result).div(10 ** decimals));
            } catch (err) {
              resolve(new import_bignumber5.BigNumber(0));
            }
          });
        }
        recoverSigner(msg, signature) {
          let _web3 = this._web3;
          return new Promise(async function(resolve, reject) {
            try {
              let signing_address = await _web3.eth.accounts.recover(msg, signature);
              resolve(signing_address);
            } catch (err) {
              reject(err);
            }
            ;
          });
        }
        getBlock(blockHashOrBlockNumber, returnTransactionObjects) {
          return this._web3.eth.getBlock(blockHashOrBlockNumber || "latest", returnTransactionObjects);
        }
        getBlockNumber() {
          return this._web3.eth.getBlockNumber();
        }
        async getBlockTimestamp(blockHashOrBlockNumber) {
          let block = await this._web3.eth.getBlock(blockHashOrBlockNumber || "latest", false);
          if (typeof block.timestamp == "string")
            return parseInt(block.timestamp);
          else
            return block.timestamp;
        }
        async initKMS(value) {
          value = value || this._account.kms;
          if (value) {
            this._kms = new import_kms.KMS(value);
            this._account = {
              address: await this._kms.getAddress(),
              kms: value
            };
          }
        }
        get kms() {
          if (this._account && !this._kms && this._account.kms)
            this._kms = new import_kms.KMS(this._account.kms);
          return this._kms;
        }
        set privateKey(value) {
          if (value) {
            this._kms = null;
            this._web3.eth.defaultAccount = "";
          }
          this._account = {
            address: "",
            privateKey: value
          };
        }
        registerEvent(eventMap, address, handler) {
          for (let topic in eventMap) {
            this._eventTopicAbi[topic] = eventMap[topic];
          }
          if (address && handler) {
            this._eventHandler[address] = handler;
          }
        }
        getAbiEvents(abi) {
          let _web3 = this._web3;
          let events = abi.filter((e) => e.type == "event");
          let eventMap = {};
          for (let i = 0; i < events.length; i++) {
            let topic = _web3.utils.soliditySha3(events[i].name + "(" + events[i].inputs.map((e) => e.type == "tuple" ? "(" + e.components.map((f) => f.type) + ")" : e.type).join(",") + ")");
            eventMap[topic] = events[i];
          }
          return eventMap;
        }
        getAbiTopics(abi, eventNames) {
          if (!eventNames || eventNames.length == 0)
            eventNames = null;
          let _web3 = this._web3;
          let result = [];
          let events = abi.filter((e) => e.type == "event");
          for (let i = 0; i < events.length; i++) {
            if (!eventNames || eventNames.indexOf(events[i].name) >= 0) {
              let topic = _web3.utils.soliditySha3(events[i].name + "(" + events[i].inputs.map((e) => e.type == "tuple" ? "(" + e.components.map((f) => f.type) + ")" : e.type).join(",") + ")");
              result.push(topic);
            }
          }
          if (result.length == 0 && eventNames && eventNames.length > 0)
            return ["NULL"];
          return [result];
        }
        getContractAbi(address) {
          return this._abiAddressDict[address];
        }
        getContractAbiEvents(address) {
          let events = this._abiEventDict[address];
          if (events)
            return events;
          let abi = this._abiHashDict[this._abiAddressDict[address]];
          if (abi) {
            events = this.getAbiEvents(abi);
            this._abiEventDict[address] = events;
            return events;
          }
        }
        registerAbi(abi, address, handler) {
          let hash = "";
          let eventMap;
          if (typeof abi == "string") {
            hash = this._web3.utils.sha3(abi);
            abi = JSON.parse(abi);
          } else {
            hash = this._web3.utils.sha3(JSON.stringify(abi));
          }
          eventMap = this.getAbiEvents(abi);
          for (let topic in eventMap) {
            this._eventTopicAbi[topic] = eventMap[topic];
          }
          this._abiHashDict[hash] = abi;
          if (address)
            this.registerAbiContracts(hash, address, handler);
          return hash;
        }
        registerAbiContracts(abiHash, address, handler) {
          if (address) {
            if (!Array.isArray(address))
              address = [address];
            for (let i = 0; i < address.length; i++) {
              this._abiAddressDict[address[i]] = abiHash;
              if (handler)
                this._eventHandler[address[i]] = handler;
            }
          }
        }
        decode(abi, event, raw) {
          if (!raw)
            raw = event;
          let d;
          try {
            if (abi) {
              d = this.web3.eth.abi.decodeLog(abi.inputs, raw.data, raw.topics.slice(1));
              if (d.__length__) {
                for (let k = 0; k < d.__length__; k++)
                  delete d[k];
                delete d["__length__"];
              }
            }
          } catch (err) {
          }
          let log = {
            address: event.address,
            blockNumber: event.blockNumber,
            topics: raw.topics,
            data: d ? d : raw.data,
            rawData: d ? raw.data : void 0,
            logIndex: event.logIndex,
            name: abi ? abi.name : void 0,
            transactionHash: event.transactionHash,
            transactionIndex: event.transactionIndex
          };
          return log;
        }
        async decodeEventData(data, events) {
          let _web3 = this._web3;
          let event;
          if (events)
            event = events[data.topics[0]];
          else {
            event = this._eventTopicAbi[data.topics[0]];
          }
          ;
          let log = this.decode(event, data);
          let handler = this._eventHandler[data.address];
          if (handler)
            await handler(this, log);
          return log;
        }
        scanEvents(fromBlock, toBlock, topics, events, address) {
          let _web3 = this._web3;
          return new Promise(async (resolve, reject) => {
            try {
              let logs = await _web3.eth.getPastLogs({
                fromBlock,
                toBlock,
                address,
                topics: topics ? topics : null
              });
              let result = [];
              for (let i = 0; i < logs.length; i++) {
                let e = logs[i];
                result.push(await this.decodeEventData(e, events));
              }
              resolve(result);
            } catch (err) {
              reject(err);
            }
          });
        }
        send(to, amount) {
          let _web3 = this._web3;
          let address = this.address;
          let self = this;
          return new Promise(async function(resolve, reject) {
            try {
              let value = _web3.utils.numberToHex(_web3.utils.toWei(amount.toString()));
              let result;
              if (self._account && self._account.privateKey || self.kms) {
                let nonce = await _web3.eth.getTransactionCount(address);
                let gas = await _web3.eth.estimateGas({
                  from: address,
                  nonce,
                  to,
                  value
                });
                let price = _web3.utils.numberToHex(await _web3.eth.getGasPrice());
                let tx = {
                  from: address,
                  nonce,
                  gasPrice: price,
                  gasLimit: gas,
                  gas,
                  to,
                  value
                };
                if (self.kms) {
                  let chainId = await self.getChainId();
                  let txHash = await self.kms.signTransaction(chainId, tx);
                  result = await _web3.eth.sendSignedTransaction(txHash);
                } else {
                  let signedTx = await _web3.eth.accounts.signTransaction(tx, self._account.privateKey);
                  result = await _web3.eth.sendSignedTransaction(signedTx.rawTransaction);
                }
                resolve(result);
              } else {
                result = await _web3.eth.sendTransaction({ from: address, to, value: _web3.utils.toWei(amount.toString()).toString() });
                resolve(result);
              }
            } catch (err) {
              reject(err);
            }
          });
        }
        setBlockTime(time) {
          return new Promise((resolve, reject) => {
            let method = time > 1e9 ? "evm_mine" : "evm_increaseTime";
            this._web3.currentProvider.send({
              jsonrpc: "2.0",
              method,
              params: [time],
              id: new Date().getTime()
            }, (err, result) => {
              if (err)
                return reject(err);
              if (method == "evm_mine") {
                return resolve(result);
              } else {
                this._web3.currentProvider.send({
                  jsonrpc: "2.0",
                  method: "evm_mine",
                  params: [],
                  id: new Date().getTime()
                }, (err2, result2) => {
                  if (err2)
                    return reject(err2);
                  return resolve(result2);
                });
              }
            });
          });
        }
        increaseBlockTime(value) {
          return new Promise((resolve, reject) => {
            this._web3.currentProvider.send({
              jsonrpc: "2.0",
              method: "evm_increaseTime",
              params: [value],
              id: new Date().getTime()
            }, (err, result) => {
              this._web3.currentProvider.send({
                jsonrpc: "2.0",
                method: "evm_mine",
                params: [],
                id: new Date().getTime()
              }, (err2, result2) => {
                resolve(result2);
              });
            });
          });
        }
        signMessage(msg) {
          let _web3 = this._web3;
          let address = this.address;
          let self = this;
          return new Promise(async function(resolve, reject) {
            try {
              let result;
              if (self._account && self._account.privateKey || self.kms) {
                if (self.kms) {
                  result = await self.kms.signMessage(self.chainId, _web3.utils.stringToHex(msg));
                  resolve(result);
                } else {
                  result = await _web3.eth.accounts.sign(msg, self._account.privateKey);
                  resolve(result.signature);
                }
              } else {
                result = await _web3.eth.sign(msg, address, null);
                resolve(result);
              }
            } catch (err) {
              reject(err);
            }
          });
        }
        token(tokenAddress, decimals) {
          return new Erc20(this, tokenAddress, decimals);
        }
        async tokenInfo(tokenAddress) {
          let erc20 = this.token(tokenAddress);
          return {
            decimals: await erc20.decimals,
            name: await erc20.name,
            symbol: await erc20.symbol,
            totalSupply: await erc20.totalSupply
          };
        }
        get utils() {
          return this._web3.utils;
        }
        verifyMessage(account, msg, signature) {
          let _web3 = this._web3;
          return new Promise(async function(resolve, reject) {
            try {
              let signing_address = await _web3.eth.accounts.recover(msg, signature);
              resolve(signing_address && account.toLowerCase() == signing_address.toLowerCase());
            } catch (err) {
              reject(err);
            }
            ;
          });
        }
        blockGasLimit() {
          return new Promise(async (resolve, reject) => {
            try {
              if (!this._gasLimit)
                this._gasLimit = (await this._web3.eth.getBlock("latest")).gasLimit;
              resolve(this._gasLimit);
            } catch (e) {
              reject(e);
            }
          });
        }
        getGasPrice() {
          return (async () => new import_bignumber5.BigNumber(await this._web3.eth.getGasPrice()))();
        }
        transactionCount() {
          return (async () => await this._web3.eth.getTransactionCount(this.address))();
        }
        async sendTransaction(transaction) {
          transaction.value = new import_bignumber5.BigNumber(transaction.value).toFixed();
          transaction.gasPrice = new import_bignumber5.BigNumber(transaction.gasPrice).toFixed();
          let currentProvider = this.provider;
          try {
            if (typeof window !== "undefined" && this.clientSideProvider) {
              this.provider = this.clientSideProvider.provider;
            }
            if (this._account && this._account.privateKey) {
              let signedTx = await this._web3.eth.accounts.signTransaction(transaction, this._account.privateKey);
              return await this._web3.eth.sendSignedTransaction(signedTx.rawTransaction);
            } else if (this._account && this._account.kms) {
              let chainId = await this.getChainId();
              let signedTx = await this.kms.signTransaction(chainId, transaction);
              return await this._web3.eth.sendSignedTransaction(signedTx);
            } else {
              let promiEvent = this._web3.eth.sendTransaction(transaction);
              promiEvent.on("error", (error) => {
                if (error.message.startsWith("Transaction was not mined within 50 blocks")) {
                  return;
                }
                if (this._sendTxEventHandler.transactionHash)
                  this._sendTxEventHandler.transactionHash(error);
              });
              promiEvent.on("transactionHash", (receipt) => {
                if (this._sendTxEventHandler.transactionHash)
                  this._sendTxEventHandler.transactionHash(null, receipt);
              });
              promiEvent.on("confirmation", (confNumber, receipt) => {
                if (this._sendTxEventHandler.confirmation && confNumber == 1)
                  this._sendTxEventHandler.confirmation(receipt);
              });
              return await promiEvent;
            }
          } catch (err) {
          }
          this.provider = currentProvider;
          return null;
        }
        async getTransaction(transactionHash) {
          let web3Receipt = await this._web3.eth.getTransaction(transactionHash);
          return {
            from: web3Receipt.from,
            to: web3Receipt.to,
            nonce: web3Receipt.nonce,
            gas: web3Receipt.gas,
            gasPrice: web3Receipt.gasPrice,
            data: web3Receipt.input,
            value: web3Receipt.value
          };
        }
        getTransactionReceipt(transactionHash) {
          return this._web3.eth.getTransactionReceipt(transactionHash);
        }
        call(transaction) {
          transaction.value = new import_bignumber5.BigNumber(transaction.value).toFixed();
          transaction.gasPrice = new import_bignumber5.BigNumber(transaction.gasPrice).toFixed();
          return this._web3.eth.call(transaction);
        }
        newContract(abi, address) {
          return new this._web3.eth.Contract(abi, address);
        }
        decodeErrorMessage(msg) {
          return this._web3.eth.abi.decodeParameter("string", "0x" + msg.substring(10));
        }
        async newBatchRequest() {
          return new Promise((resolve, reject) => {
            try {
              resolve({
                batch: new this._web3.BatchRequest(),
                promises: [],
                execute: (batch, promises) => {
                  batch.execute();
                  return Promise.all(promises);
                }
              });
            } catch (e) {
              reject(e);
            }
          });
        }
        soliditySha3(...val) {
          return this._web3.utils.soliditySha3(...val);
        }
        get web3() {
          return this._web3;
        }
      };
      let Wallet3 = _Wallet2;
      Wallet3.instance = new _Wallet2();
      _Wallet.Wallet = Wallet3;
    })(Wallet2 || (Wallet2 = {}));
    module2.exports = Wallet2;
  }
});

// src/index.ts
__export(exports, {
  BigNumber: () => import_bignumber4.BigNumber,
  Contract: () => import_contract2.Contract,
  Erc20: () => Erc20,
  Event: () => import_wallet.Event,
  IAccount: () => import_wallet.IAccount,
  IBatchRequestObj: () => import_wallet.IBatchRequestObj,
  IClientProviderOptions: () => import_wallet.IClientProviderOptions,
  INetwork: () => import_wallet.INetwork,
  ISendTxEventsOptions: () => import_wallet.ISendTxEventsOptions,
  IWallet: () => import_wallet.IWallet,
  IWalletUtils: () => import_wallet.IWalletUtils,
  Transaction: () => import_wallet.Transaction,
  TransactionReceipt: () => import_wallet.TransactionReceipt,
  Utils: () => utils_exports,
  Wallet: () => import_wallet.Wallet,
  WalletPlugin: () => import_wallet.WalletPlugin,
  WalletPluginConfig: () => import_wallet.WalletPluginConfig
});
var import_wallet = __toModule(require_wallet());
var import_contract2 = __toModule(require_contract());
var import_bignumber4 = __toModule(require("bignumber.js"));
init_erc20();
init_utils();

});