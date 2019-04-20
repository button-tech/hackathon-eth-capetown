const wallet_abi = [
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
        "type": "function",
        "signature": "0x2f27c667"
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
        "type": "function",
        "signature": "0x421890c7"
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
        "type": "function",
        "signature": "0x61b16162"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x715018a6"
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
        "type": "function",
        "signature": "0x803ce9ae"
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
        "type": "function",
        "signature": "0x8da5cb5b"
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
        "type": "function",
        "signature": "0x8f32d59b"
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
        "type": "function",
        "signature": "0xa6960815"
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
        "type": "function",
        "signature": "0xf2fde38b"
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
        "type": "function",
        "signature": "0xf4396e2a"
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
        "type": "event",
        "signature": "0xcc34da7a0227a6f6fb7b56bf3e1f3c0220c77c85890bd05acf5f1a9256adf5d0"
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
        "type": "event",
        "signature": "0xb8641ae7dffc7457ae287f001b58a9697adfb52d5be04bf2b39cd1ef026221c0"
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
        "type": "event",
        "signature": "0xd0a9c5982c5c1a41d26376392c5b7133a1ef742786be7953a3fbde1567dd2a55"
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
        "type": "event",
        "signature": "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0"
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
        "type": "function",
        "signature": "0xcc789442"
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
        "name": "execMultipleAny",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            },
            {
                "name": "result",
                "type": "bytes"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x0af97b82"
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
        "type": "function",
        "signature": "0xe27384d5"
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
        "type": "function",
        "signature": "0xe27384d5"
    }
];

const test_token = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
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
                "name": "spender",
                "type": "address"
            },
            {
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "approve",
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
        "name": "totalSupply",
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
        "constant": false,
        "inputs": [
            {
                "name": "from",
                "type": "address"
            },
            {
                "name": "to",
                "type": "address"
            },
            {
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
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
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
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
                "name": "spender",
                "type": "address"
            },
            {
                "name": "addedValue",
                "type": "uint256"
            }
        ],
        "name": "increaseAllowance",
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
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
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
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
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
                "name": "spender",
                "type": "address"
            },
            {
                "name": "subtractedValue",
                "type": "uint256"
            }
        ],
        "name": "decreaseAllowance",
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
                "name": "to",
                "type": "address"
            },
            {
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
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
                "name": "owner",
                "type": "address"
            },
            {
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
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
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    }
];