/**
Following smart contract implements below fetures :- 
    1. One to one message communication
    2. Broadcast message
*/

pragma solidity 0.8.0;

contract deChat {

    struct Msg{
        address add;
        string message;
    }

    mapping(address => mapping(address => string)) msgBox; //Who send what msg to whom
    mapping(address => address) sentBox;
    mapping(address => address[]) inBox;
    mapping(address => address[]) outBox;
    mapping(address => string) broadcastMsg;
    mapping(address => Msg) msgs;
    address[] sentBoxDetail;
    address[] participants;      

    function signup() public returns(bool){
        participants.push(msg.sender);
        return true;
    }

    function showParticipants() public view returns(address[] memory){
        return participants;
    }

    function sendMsg(address receiver,string memory _message) public returns(bool) {
        if(contains(participants, receiver)){
            msgBox[msg.sender][receiver] = _message;
            sentBoxDetail.push(sentBox[msg.sender] = receiver);
            inBox[receiver].push(msg.sender);
            outBox[msg.sender] = sentBoxDetail;
            return true;
        } else {
            return false;
        }        
    }

    function broadcast(string memory _message) public returns(bool){
        broadcastMsg[msg.sender] = _message;

        for(uint i=0;i<participants.length;i++){ 
            address receiver = participants[i]; 
            if(msg.sender == receiver){
                continue;
            }  
            msgBox[msg.sender][receiver] = _message;
            sentBoxDetail.push(sentBox[msg.sender] = receiver);
            inBox[receiver].push(msg.sender);
            outBox[msg.sender] = sentBoxDetail;
        }        
        return true;
    }

    function checkMsg() public view returns(Msg[] memory m){
        if(inBox[msg.sender].length != 0){
            uint len = inBox[msg.sender].length;
            Msg[] memory obj = new Msg[](len);
            for(uint i=0;i<len;i++){
                address senderAddress = inBox[msg.sender][i];
                obj[i] = Msg({
                    add : senderAddress,
                    message : msgBox[senderAddress][msg.sender]
                });     
            }            
            return obj ;
        } 
    }

    function receiveMsg(address receiver) view public returns(string memory) {
        return msgBox[msg.sender][receiver];
    } 

    function outbox(address sender) view public returns(address[] memory) {
        return (outBox[sender]);        
    }

    function contains(address[] memory arr, address value) private pure returns (bool) {
        for (uint i = 0; i < arr.length; i++) {
            if (arr[i] == value) {
                return true;
            }
        }
    return false;
    }
}