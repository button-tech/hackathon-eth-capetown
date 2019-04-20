pragma solidity >=0.5.2;
 
import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-solidity/master/contracts/ownership/Ownable.sol";
 
contract P2POwnable is Ownable {
    uint constant BLOCK_EXPIRED_TIME = 5760;
    uint constant MOVE_OWNER_LIMIT = 1e18;
   
    mapping(address => uint) public weight;
    // request to update weights and protect from  
    mapping (bytes32 => uint) public weightUpdateRequest;
   
   
    event AddWeightUpdateRequest(bytes32 hash);
    event RemoveWeightUpdateRequest(bytes32 hash);
   
    function addWeightUpdateRequest(bytes32 hash) public onlyOwner returns(bool) {
        weightUpdateRequest[hash] = block.number;
        emit AddWeightUpdateRequest(hash);
        return true;
    }
   
    function discardWeightUpdateRequest(bytes32 hash) public onlyOwner returns(bool) {
        weightUpdateRequest[hash] = 0;
        emit RemoveWeightUpdateRequest(hash);
        return true;
    }
   
    function finalizeWeightUpdateRequest(bytes32 hash, address[] memory friends, uint[] memory weights) public onlyOwner returns(bool) {
        require(weightUpdateRequest[hash] > 0);
        require(weightUpdateRequest[hash] < (block.number - BLOCK_EXPIRED_TIME));
        require(friends.length == weights.length);
        require(hash == keccak256(abi.encodePacked(friends, weights)));
        for (uint i=0; i<friends.length; i++) {
            weight[friends[i]] = weights[i];
        }
        return true;
    }
   
    function moveOwner(address newOwner, uint blockLimit, address[] memory friends, uint8[] memory v, bytes32[] memory r, bytes32[] memory s) public returns(bool) {
        uint n = friends.length;
        require((n== v.length) && (n==r.length) &&(n==s.length));
        require(blockLimit < block.number);
        bytes32 msg = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n52", newOwner, blockLimit));
        uint totalWeight = 0;
        for (uint i =0; i<n; i++){
            require(friends[i] == ecrecover(msg, v[i], r[i], s[i]));
            totalWeight+=weight[friends[i]];
        }
        require(totalWeight>=MOVE_OWNER_LIMIT);
        _transferOwnership(newOwner);
        return true;
    }
   
}