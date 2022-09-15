const Timelock = artifacts.require('TimeLock');

contract('Timelock', () => {
let timelock;

    beforeEach(async () => {
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
        console.log("Timelock address : ",timelock.address);
        assert(timelock.address !== '');
    })

    it('Check minDelay function', async () => {
      
            let minDelay = await timelock.getMinDelay();
            // console.log(await timelock.getMinDelay().toString());
            // console.log(minDelay.toString());
            assert.equal(minDelay.toString(), 1, "minDelay error")
        
        
    })
})