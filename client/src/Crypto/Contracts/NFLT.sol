pragma solidity >=0.4.21 <0.7.0;

//import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract NFLT{
  string public name = "NFL Token";
  string public symbol = "NFLT";
  uint256 public totalSupply;
  mapping(address => uint256) public balanceOf;

  event Transfer(
  	address indexed _from,
  	address indexed _to,
  	uint256 _value
  );

  constructor(uint256 _initSupply) public {
  	balanceOf[msg.sender] = _initSupply;
    totalSupply = _initSupply;

  }

  function transfer(address _to, uint256 _value) public returns (bool success){
  	require(_value <= balanceOf[msg.sender]);

  	balanceOf[msg.sender] -= _value;
  	balanceOf[_to] += _value;

  	emit Transfer(msg.sender, _to, _value);

  	return true;
  }

}
