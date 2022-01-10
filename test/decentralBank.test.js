const { assert } = require('console')
const { default: Web3 } = require('web3')

const Tether = artifacts.require('Tether')
const RWD = artifacts.require('RWD')
const DecentralBank = artifacts.require('DecentralBank')
require('chai')
    .use(require('chai-as-promised'))
        .should()

contract('decentralBank',(owner,customer)=>{
    function tokens(numbers){
        Web3.utils.toWei(numbers)
    }
    let tether,rwd,decentralBank 
    before(()=>{
        tether = await Tether.new();
        rwd = await RWD.new();
        decentralBank = await DecentralBank.new(rwd.address,tether.address);
        await rwd.transfer(decentralBank.address,tokens('1000000'))

     await tether.transfer(customer,tokens('100'),{from:owner})
    })
    describe('Mock tether Deployement',async ()=>{
        it('deployes successfully',async ()=>{
            
            const name = await tether.name();
            assert.equal(name,'Mock Tether Tocken');
        })
    });
    describe('RWD Tether Deployemnt',async ()=>{
        it('it matches RWD Tocken successful',async ()=>{
            const name = await RWD.name();
            assert.equal(name,'Reward Tocken');
        })
    })

    describe('Decentral Bank Deployemnt',async ()=>{
        it('it matches Bank Tocken successfull',async ()=>{
            const name = await decentralBank.name();
            assert.equal(name,'Decentral Bank');
        })

        it('contract has tokens',async ()=>{
            const balance = await rwd.balanceOf(decentralBank.address);
            assert.equal(balance,tokens('1000000'));
        })
    })

    describe('Yield Farming',async ()=>{
        it('Reward Token for staking',async ()=>{
            let result;
             result = await tether.balanceOf(customer);
            assert.equal(result.toString(), tokens('100'),'Customer mock wallete before staking');

            await tether.approve(decentralBank.address, tokens('100'), {from:customer});
            await decentralBank.dipositTokens(tokens('100'),{from:customer})

            result = await tether.balanceOf(customer);
            assert.equal(result.toString(), tokens('0'),'Customer Mock wallet after staking');

            result = await tether.balanceOf(decentralBank.address);
            assert.equal(result.toString(), tokens('100'),'decentral mock wallet after staking');

            result = await decentralBank.isStaking(customer);
            assert.equal(result.toString(), 'true','Customer staking status');

            //issue tokens
            await decentralBank.issueTokens({from:owner});
            await decentralBank.issueTokens({from:customer}).should.be.rejected;

            await decentralBank.unStakingTokens({from:customer})

            result = await tether.balanceOf(customer);
            assert.equal(result.toString(), tokens('100'),'Customer Mock wallet after unstaking');

            result = await tether.balanceOf(decentralBank.address);
            assert.equal(result.toString(), tokens('0'),'decentral mock wallet after staking');

            result = await decentralBank.isStaking(customer);
            assert.equal(result.toString(), 'false','Customer staking status');

        })

       
    })

})