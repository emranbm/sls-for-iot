import * as assert from 'assert'
import { SlsSdk } from 'sls-sdk'

let sdk: SlsSdk = null

beforeEach(function() {
    sdk = new SlsSdk("TODO", "acceptance-test-client")
})

describe('save', function () {
    it('happy path', async function () {
        await assert.rejects(sdk.saveFile("some-content", "somefile.txt"))
    });
});

describe('read', function () {
    it('place holder', async function () {
        await assert.rejects(sdk.readFile("somefile.txt"))
    });
});

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
