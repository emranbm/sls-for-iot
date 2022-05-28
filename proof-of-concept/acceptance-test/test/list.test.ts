import {strict as assert} from 'assert'
import { SlsSdk } from 'sls-sdk'
import { Utils } from './Utils';

let sdk: SlsSdk = null

beforeEach(async function () {
    sdk = await Utils.prepareFreshEnvironment()
})

describe('list', function () {
    it('gets empty list when no file exists', async function () {
        const files = await sdk.listFiles()
        assert.deepEqual(files, [])
    });
    it('gets the list of saved files', async function () {
        await sdk.saveFile("content a", "a.txt")
        await sdk.saveFile("content b", "b.txt")
        const files = await sdk.listFiles()
        assert.deepEqual(files.sort(), ["a.txt", "b.txt"])
    });
});
