const BN = require('bn.js')
const SimpleStore = artifacts.require('SimpleStore')
contract('Test', (accounts) => {
  let [alice] = accounts
  let contractInstance
    beforeEach(async () => {
        contractInstance = await SimpleStore.new()
    });
    it('should be able to set a value', async () => {
            let value = 4
            const result = await contractInstance.set(value, {from: alice})
            assert.equal(result.receipt.status, true)
            assert.equal(result.logs[0].args._value.toString(), value.toString())
    })
    it('should be able to set and then get a value', async () => {
            let value = 5
            await contractInstance.set(value, {from: alice})
            const result = await contractInstance.get({from: alice})
            assert.equal(result.toString(), value.toString())
    })
})