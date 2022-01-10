const DecentralBank = artifacts.require('DecentralBank');

module.exports =  async function(callback){
    let decentralBank = await DecentralBank.deployed();
    decentralBank.issueTokens();
    console.log('staking successfully');
    callback()
}