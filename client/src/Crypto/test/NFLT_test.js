var NFLT = artifacts.require("./NFLT.sol");

contract('NFLT', function(account) {
  it('sets totalSupply on deployment', function(){
    return NFLT.deployed().then(function(instance){
      tokenInstance = instance;
      return tokenInstance.totalSupply();
    }).then(function(totalSupply){
      assert.equal(totalSupply.toNumber(), 4800, 'sets total supply to 4800');
    })
  })
})
