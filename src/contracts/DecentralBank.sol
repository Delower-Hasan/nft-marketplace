pragma solidity ^0.5.0;
import './RWD.sol';
import './Tether.sol';

contract DecentralBank {
    string public name = 'Decentral Bank';
    address public owner;
    Tether public tether;
    RWD public rwd;

    address [] public stakers;

    mapping(address =>uint) public stakingBalance;
    mapping(address=>bool) public hasStaked;
    mapping(address=>bool) public isStaking;

    constructor (RWD _rwd,Tether _tether) public {
        rwd = _rwd;
        tether = _tether;
        msg.sender = owner;
    }
    
    function dipositTokens(uint _ammount) public {
        require(_amount>0, 'Amount Can not be 0');
        tether.transferFrom(msg.sender, address(this), _ammount);
        stakingBalance[msg.sender] +=_ammount;
        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }
        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
    }

    function unStakingTokens() public {
        uint balance = stakingBalance[msg.sender];
        require(balance>0, 'Balance must be zero');
        
        tether.transfer(msg.sender,balance);
        stakingBalance[msg.sender] = 0;
        isStaking[msg.sender] = false;
    }

    function issueTokens() public{
        require(owner == msg.sender, 'Contruact must be called by wonder');
        for(uint i; i< stakers.length; i++){
            address recipent = stakers[i];
            uint balance = stakingBalance[i]/9;
            if(balance>0){
                rwd.transfer(recipent,balance);
            }
        }
    }

  
}