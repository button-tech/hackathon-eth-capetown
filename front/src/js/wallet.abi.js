const wallet_abi = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "target",
                "type": "address[]"
            },
            {
                "name": "value",
                "type": "uint256[]"
            },
            {
                "name": "gasLimit",
                "type": "uint256[]"
            },
            {
                "name": "data",
                "type": "bytes[]"
            }
        ],
        "name": "execMultipleAny",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "weightUpdateRequest",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "target",
                "type": "address"
            },
            {
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "execView",
        "outputs": [
            {
                "name": "success",
                "type": "bool"
            },
            {
                "name": "result",
                "type": "bytes"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "hash",
                "type": "bytes32"
            }
        ],
        "name": "addWeightUpdateRequest",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "hash",
                "type": "bytes32"
            },
            {
                "name": "friends",
                "type": "address[]"
            },
            {
                "name": "weights",
                "type": "uint256[]"
            }
        ],
        "name": "finalizeWeightUpdateRequest",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "hash",
                "type": "bytes32"
            }
        ],
        "name": "discardWeightUpdateRequest",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "isOwner",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "newOwner",
                "type": "address"
            },
            {
                "name": "blockLimit",
                "type": "uint256"
            },
            {
                "name": "v",
                "type": "uint8[]"
            },
            {
                "name": "r",
                "type": "bytes32[]"
            },
            {
                "name": "s",
                "type": "bytes32[]"
            }
        ],
        "name": "moveOwner",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "target",
                "type": "address"
            },
            {
                "name": "value",
                "type": "uint256"
            },
            {
                "name": "gasLimit",
                "type": "uint256"
            },
            {
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "exec",
        "outputs": [
            {
                "name": "success",
                "type": "bool"
            },
            {
                "name": "result",
                "type": "bytes"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "target",
                "type": "address[]"
            },
            {
                "name": "value",
                "type": "uint256[]"
            },
            {
                "name": "gasLimit",
                "type": "uint256[]"
            },
            {
                "name": "data",
                "type": "bytes[]"
            }
        ],
        "name": "execMultipleAll",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "name": "weight",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "reqhash",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "name": "success",
                "type": "bool"
            },
            {
                "indexed": false,
                "name": "result",
                "type": "bytes"
            }
        ],
        "name": "Log",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "hash",
                "type": "bytes32"
            }
        ],
        "name": "AddWeightUpdateRequest",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "hash",
                "type": "bytes32"
            }
        ],
        "name": "RemoveWeightUpdateRequest",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    }
];