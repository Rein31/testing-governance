const Token = artifacts.require('GovermentToken');

contract('Token', (accounts) => {
    
    before(async () => {
        token = await Token.deployed();
        let owner = await token.owner();
        console.log("Token address : ",token.address);
        console.log("Token owner : ", owner);
        console.log();
    })
    

    // it('Should deploy smart contract properly', async () => {
    //     const token = await Token.deployed();
    //     console.log("Token address : ",token.address);
    //     assert(token.address !== '');
    // })

    it("gives the owner of the token 10K tokens!", async () => {
        let balance = await token.balanceOf(accounts[0]);
        balance = web3.utils.fromWei(balance, 'ether');
        console.log(accounts[0], "balance : ", balance);
        assert.equal(balance, "100000", "Balance should be 10K tokens for contract creator!");
        console.log();
    })

    it("can tranfer tokens between accounts", async () => {
        let amount = web3.utils.toWei('1000', 'ether');
        await token.transfer(accounts[1], amount, { from : accounts[0] });

        let balance = await token.balanceOf(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');
        console.log(accounts[1], "balance : ", balance);
        assert.equal(balance, "1000", "Balance should be 1000 tokens for contract creator!");
        console.log();
    })

    it("checking the owner of token", async () => {
        // expect(token.owner()).to.equal(accounts[0]);
        let owner = await token.owner();
        assert.equal(owner, accounts[0], "Owner should be msg.sender")
    })

    

});