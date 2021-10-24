import * as assert from 'assert'
import { SlsSdk } from 'sls-sdk'
import { Utils } from './Utils';

let sdk: SlsSdk = null

beforeEach(async function () {
    sdk = await Utils.prepareFreshEnvironment()
})

describe('delete', function () {
    it('place holder', async function () {
        await assert.rejects(sdk.deleteFile("somefile.txt"))
    });
});

describe('ls', function () {
    it('place holder', async function () {
        await assert.rejects(sdk.listFiles())
    });
});
