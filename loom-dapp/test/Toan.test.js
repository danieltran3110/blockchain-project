const Toan = artifacts.require('../Toan.sol');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Toan', (accounts) => {
    describe('deployment', async() => {
        it('deploy successfully', async () => {
            contract = await Toan.deployed();
            const address = contract.address;
            console.log(address);
            assert.notEqual(address, '')
        })
    })
})