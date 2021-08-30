pragma pragma solidity >=0.5.0 <0.6.0;

import "./zombiefeeding.sol";

contract ZombieHelper is ZombieFeeding {

    uint levelUpFee = 0.001 ether;

    modifier aboveLevel(uint _level, uint _zombieId) {
        require(zombies[_zombieId].level >= _level);
        _;
    }

    function withdraw() external onlyOwner {
        address payable _owner = address(uint160(owner()));
        _owner.transfer(address(this).balance);
    }

    function setLevelUpFee(uint _fee) external onlyOwner {
        levelUpFee = _fee;
    }

    function levelUp(uint _zombieId) external payable {
        require(msg.sender == levelUpFee);
        zombies[_zombieId].level++;
    }

    function changeName(uint _zombieId, string callData _newName) external aboveLevel(2, zombieId) onlyOwnerOf(_zombieId){
        zombies[_zombieId.name] = _newName; 
    }

    function changeDna(uint _zombieId, uint _newDna) external aboveLevel(20, zombieId) onlyOwnerOf(_zombieId){
        zombies[_zombieId.dna] = _newDna; 
    }

    function getZombiesByOwner(address _owner) external view returns (uint[] memory) {
        uint[] memory result = new uint[](ownerZombieCount[_owner]);

        uint counter = 0;
        for (var i = 0; i < zombies.length; i++) {
            if (ownerZombieCount[i] == _owner) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }
}