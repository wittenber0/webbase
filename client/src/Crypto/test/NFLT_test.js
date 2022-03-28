var NFLT = artifacts.require("./NFLT.sol");

contract('NFLT', function(accounts) {
  it('sets totalSupply on deployment', function(){
    return NFLT.deployed().then(function(instance){
      tokenInstance = instance;
      return tokenInstance.totalSupply();
    }).then(function(totalSupply){
      assert.equal(totalSupply.toNumber(), 4800, 'sets total supply to 4800');
      return tokenInstance.balanceOf(accounts[0])
    }).then(function(adminBalance){
    	assert.equal(adminBalance.toNumber(), 4800, 'it allocates initial supply');
    })
  });

  it('initializes contract', function(){
  	return NFLT.deployed().then(function(token){
  		tokenInstance = token
  		return tokenInstance.name();
  	}).then(function(name){
  		assert.equal(name, 'NFL Token', 'has the correct name');
  		return tokenInstance.symbol();
  	}).then(function(symbol){
  		assert.equal(symbol, 'NFLT');
  	})
  });

  it('transfers ownership', function(){
  	return NFLT.deployed().then(function(token){
  		tokenInstance = token;
  		return tokenInstance.transfer.call(accounts[1], 4801);
  	}).then(assert.fail).catch(function(error){
  		assert(error.message.indexOf('revert')>= 0, 'error message must contain revert');
  		return tokenInstance.transfer.call(accounts[1], 10, {from : accounts[0]});
  	}).then(function(response){
  		assert.equal(response, true, 'returns true upon success');
  		return tokenInstance.transfer(accounts[1], 10, {from : accounts[0]});
  	}).then(function(receipt){
  		assert.equal(receipt.logs.length, 1, 'triggers one event');
  		assert.equal(receipt.logs[0].event, 'Transfer', 'triggers "Transfer" event');
  		assert.equal(receipt.logs[0].args._from, accounts[0], 'checks sender');
  		assert.equal(receipt.logs[0].args._to, accounts[1], 'checks receiver');
  		assert.equal(receipt.logs[0].args._value, 10, 'checks value');

  		return tokenInstance.balanceOf(accounts[1]);
  	}).then(function(balance){
  		assert.equal(balance, 10, 'increments account of recipient');
  		return tokenInstance.balanceOf(accounts[0]);
  	}).then(function(balance){
  		assert.equal(balance, 4790);
  	})
  });

  it('approves tokens for delegated transfer', function(){
  	return NFLT.deployed().then(function(token){
  		tokenInstance = token;
  		return tokenInstance.approve.call(accounts[1], 100);
  	}).then(function(success){
  		assert.equal(success, true, 'it returns true');
  		return tokenInstance.approve(accounts[1], 100);
  	}).then(function (receipt){
  		assert.equal(receipt.logs.length, 1, 'triggers one event');
  		assert.equal(receipt.logs[0].event, 'Approval', 'triggers "Approval" event');
  		assert.equal(receipt.logs[0].args._owner, accounts[0], 'checks authorized owner');
  		assert.equal(receipt.logs[0].args._spender, accounts[1], 'checks authorized sender');
  		assert.equal(receipt.logs[0].args._value, 100, 'checks value');
  		return tokenInstance.allowance(accounts[0], accounts[1]);
  	})
  });

  it('performs delegated transfer', function(){
  	return NFLT.deployed().then(function(token){
  		tokenInstance = token;
  		return tokenInstance.approve(accounts[1], 100);
  	}).then(function(receipt){
  		return tokenInstance.transferFrom(accounts[0]);
  	})
  })
})
