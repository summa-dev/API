import { helloWorld } from '../src/index';

describe("Incremental Merkle Tree", () => {


    beforeEach(() => {
    })

    it("Should not initialize a tree with wrong parameters", async () => {

        const ret = await helloWorld();

        expect(ret).toEqual('helloWorld');
    })

})