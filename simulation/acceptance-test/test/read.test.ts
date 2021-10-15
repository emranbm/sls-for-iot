import * as assert from 'assert'
import { SlsSdk } from 'sls-sdk'
import * as fsLib from 'fs'
import { FileExistsError } from 'sls-sdk/src/errors/FileExistsError';
const fs = fsLib.promises

const BROKER_URL = process.env.BROKER_URL
const STORAGE_ROOT = './clients-storages'
const STORAGE_ROOT_MAIN = `./${STORAGE_ROOT}/main`
const TEST_CLIENT_ID = "acceptance-test-client"

let sdk: SlsSdk = null

beforeEach(async function () {
    await fs.rm(STORAGE_ROOT,{recursive: true, force: true})
    sdk = new SlsSdk(BROKER_URL, TEST_CLIENT_ID, STORAGE_ROOT_MAIN, "info")
})

describe('read', function () {
    it('TODO: can read what has been saved', async function () {
        const CONTENT = "some-content"
        const PATH = "somefile.txt"
        await sdk.start()
        await sdk.saveFile(CONTENT, PATH)
        // TODO: Uncomment below
        // const savedContent = await sdk.readFile(PATH)
        // assert.equal(savedContent.toString(), CONTENT)
    });
});
