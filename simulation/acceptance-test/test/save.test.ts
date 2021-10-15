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

describe('save', function () {
    it('can save with single client', async function () {
        const CONTENT = "some-content"
        const PATH = "somefile.txt"
        await sdk.start()
        await sdk.saveFile(CONTENT, PATH)
        const savedContent = await fs.readFile(`${STORAGE_ROOT_MAIN}/${TEST_CLIENT_ID}/${PATH}`)
        assert.equal(savedContent.toString(), CONTENT)
    });
    it('can save with multiple clients', async function () {
        const CONTENT = "some-content"
        const PATH = "somefile.txt"
        const CLIENT2_ID = "client2"

        const sdk2 = new SlsSdk(BROKER_URL, CLIENT2_ID, `${STORAGE_ROOT}/2`)
        await sdk2.start()
        await sdk.start()

        await sdk.saveFile(CONTENT, PATH)
        
        const FILE_PATH_ON_MAIN_CLIENT = `${STORAGE_ROOT_MAIN}/${TEST_CLIENT_ID}/${PATH}`
        const FILE_PATH_ON_CLIENT2 = `${STORAGE_ROOT_MAIN}/${CLIENT2_ID}/${PATH}`
        let savedContent: Buffer
        if (fsLib.existsSync(FILE_PATH_ON_MAIN_CLIENT))
            savedContent = await fs.readFile(FILE_PATH_ON_MAIN_CLIENT)
        else if (fsLib.existsSync(FILE_PATH_ON_CLIENT2))
            savedContent = await fs.readFile(FILE_PATH_ON_CLIENT2)
        else
            assert.fail("The saved file did not found in any client!")
        assert.equal(savedContent.toString(), CONTENT)
    });
    it("TODO: file overwrite should be prevented", async function () {
        const CONTENT = "some-content"
        const NEW_CONTENT = "some-new-content"
        const PATH = "somefile.txt"
        await sdk.start()
        await sdk.saveFile(CONTENT, PATH)

        // TODO: switch to assert.rejects
        await assert.doesNotReject(sdk.saveFile(NEW_CONTENT, PATH), FileExistsError)
    });
});
