pragma solidity >=0.5.2;
pragma experimental ABIEncoderV2;
 
import "./P2POwnable.sol";
 
contract Wallet is P2POwnable {
  function exec(address target, uint value, uint gasLimit, bytes memory data) onlyOwner public  returns(bool success, bytes memory result) {
    /* solium-disable-next-line */
    (success, result) = target.call.value(value).gas((gasLimit == 0) ? gasleft() : gasLimit)(data);
  }


  event Log(bytes32 reqhash, bool success, bytes result);

  function execMultipleAny(address[] memory target, uint[] memory value, uint[] memory gasLimit, bytes[] memory data) onlyOwner public payable returns(bool){
    uint n = target.length;
    require((value.length == n) && (gasLimit.length == n) && (data.length == n));
    for (uint i=0; i<n; i++) {
      bytes32 reqhash = keccak256(abi.encodePacked(target[i], value[i], gasLimit[i], data[i]));
      /* solium-disable-next-line */
      (bool success, bytes memory result) = target[i].call.value(value[i]).gas((gasLimit[i] == 0) ? gasleft() : gasLimit[i])(data[i]);
      emit Log(reqhash, success, result);
    }
    return true;
  }

  function execMultipleAll(address[] memory target, uint[] memory value, uint[] memory gasLimit, bytes[] memory data) onlyOwner public payable returns(bool){
    uint n = target.length;
    require((value.length == n) && (gasLimit.length == n) && (data.length == n));
    for (uint i=0; i<n; i++) {
      bytes32 reqhash = keccak256(abi.encodePacked(target[i], value[i], gasLimit[i], data[i]));
      /* solium-disable-next-line */
      (bool success, bytes memory result) = target[i].call.value(value[i]).gas((gasLimit[i] == 0) ? gasleft() : gasLimit[i])(data[i]);
      emit Log(reqhash, success, result);
      require(success);
    }
    return true;
  }

  function() external payable {}

}
