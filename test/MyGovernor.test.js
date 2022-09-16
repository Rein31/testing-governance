const web3 = require("web3");
const BigNumber = require('bignumber.js');

const Token = artifacts.require("GovermentToken");
const Timelock = artifacts.require("TimeLock");
const MyGovernor = artifacts.require("MyGovernor");

contract('MyGovernor', (accounts) => {
let token;
let timelock;
let governance;

    beforeEach(async () => {
        token = await Token.deployed();
        timelock = await Timelock.deployed(1,[
            "0x8F36b5a1bEe8E110633b502687EC9c0e9143c391",
            "0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef",
            "0x821aEa9a577a9b44299B9c15c88cf3087F3b5544",
            "0x0d1d4e623D10F9FBA5Db95830F7d3839406C6AF2"
        ], 
        ["0x986e386bE8c276945f43AF436F6213B5e7b332C6",
            "0x2932b7A2355D6fecc4b5c0B6BD44cC31df247a2e",
            "0x2191eF87E392377ec08E7c08Eb105Ef5448eCED5"
        ]);
        governance = await MyGovernor.deployed(token.address, timelock.address);
        console.log("MyGovernor address : ", governance.address);
        console.log();
    })

    it('Check voting period', async () => {
        let votingPeriod = await governance.votingPeriod();
        // console.log(votingPeriod.toString());
        assert.equal(votingPeriod.toString(), 45, "Voting Period error")
    })

    it('Check voting delay', async () => {
        let votingDelay = await governance.votingDelay();
        // console.log(votingPeriod.toString());
        assert.equal(votingDelay.toString(), 0, "Voting Delay error")
    })

    it('Create a new proposal and casting vote', async () => {
        const encodedFunction = await token.contract.methods.mint("0x986e386bE8c276945f43AF436F6213B5e7b332C6", 1000).encodeABI();
        const description = "Should we mint to address 0x8F36b5a1bEe8E110633b502687EC9c0e9143c391 with amount of 100 token?";

        const tx = await governance.propose([token.address], [0], [encodedFunction], description, { from: accounts[0]});

        const id = tx.logs[0].args.proposalId;
        console.log(`Created proposal: ${id.toString()}\n`);
        console.log(`Created proposal: ${BigNumber(id.toString())}\n`);
        console.log(`Created proposal: ${BigInt(id.toString())}\n`);
        console.log(id);

        await token.delegate(accounts[0], { from: accounts[0] })
        await token.delegate(accounts[6], { from: accounts[6] })
        await token.delegate(accounts[7], { from: accounts[7] })
        await token.delegate(accounts[8], { from: accounts[8] })
        await token.delegate(accounts[9], { from: accounts[9] })

        vote = await governance.castVote(id, 1, { from: accounts[0] })
        vote = await governance.castVote(BigInt(id.toString()), 1, { from: accounts[6] })
        vote = await governance.castVote(BigInt(id.toString()), 1, { from: accounts[7] })
        vote = await governance.castVote(BigInt(id.toString()), 0, { from: accounts[8] })
        vote = await governance.castVote(BigInt(id.toString()), 2, { from: accounts[9] })

        const { againstVotes, forVotes, abstainVotes } = await governance.proposalVotes.call(id)
        // console.log(`Votes For: ${web3.utils.fromWei(forVotes.toString(), 'ether')}`)
        console.log(`Votes For: ${forVotes.toString()}`)
        console.log(`Votes Against: ${web3.utils.fromWei(againstVotes.toString(), 'ether')}`)
        console.log(`Votes Neutral: ${web3.utils.fromWei(abstainVotes.toString(), 'ether')}\n`)

        proposalState = await governance.state.call(id)
        console.log(`Current state of proposal: ${proposalState.toString()} (Active) \n`)
        let balance = await token.balanceOf(accounts[0]);
        console.log(balance.toString());

        let delegates = await token.delegates(accounts[0])
        console.log(delegates.toString());
        
        // console.log(forVotes.toString());
        // console.log(tx.logs[0].args.proposalId);
        // assert.equal();
    })

})