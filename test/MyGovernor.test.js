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
        assert.equal(votingDelay.toString(), 1, "Voting Delay error")
    })

    it('Create a new proposal', async () => {
        const encodedFunction = await token.contract.methods.mint("0x986e386bE8c276945f43AF436F6213B5e7b332C6", 1000).encodeABI();
        const description = "Should we mint to address 0x8F36b5a1bEe8E110633b502687EC9c0e9143c391 with amount of 100 token?";

        const tx = await governance.propose([token.address], [0], [encodedFunction], description, { from: accounts[0]});

        const id = tx.logs[0].args.proposalId;
        console.log(`Created proposal: ${id.toString()}\n`);
        console.log(encodedFunction);
    })
})