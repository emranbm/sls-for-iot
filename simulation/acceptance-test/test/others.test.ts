import * as assert from 'assert'
import { SlsSdk } from 'sls-sdk'

const BROKER_URL = process.env.BROKER_URL
const STORAGE_ROOT = './clients-storages'
const STORAGE_ROOT_MAIN = `./${STORAGE_ROOT}/main`
const TEST_CLIENT_ID = "acceptance-test-client"

let sdk: SlsSdk = null

beforeEach(async function () {
    sdk = new SlsSdk(BROKER_URL, TEST_CLIENT_ID, STORAGE_ROOT_MAIN, "info")
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
