import * as assert from 'assert'
import { SlsSdk } from 'sls-sdk'
import { promises as fs } from 'fs'

const BROKER_URL = process.env.BROKER_URL
const STORAGE_ROOT = './clients-storages/main/'
const TEST_CLIENT_ID = "acceptance-test-client"

let sdk: SlsSdk = null

beforeEach(function() {
    sdk = new SlsSdk(BROKER_URL, TEST_CLIENT_ID, STORAGE_ROOT)
})

describe('save', function () {
    it('can save with single client', async function () {
        const content = "some-content"
        const path = "somefile.txt"
        await sdk.start()
        await sdk.saveFile(content, path)
        const savedContent = await fs.readFile(`${STORAGE_ROOT}/${TEST_CLIENT_ID}/${path}`)
        assert.equal(savedContent.toString(), content)
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
