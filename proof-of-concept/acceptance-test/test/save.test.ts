import {strict as assert} from 'assert'
import { SlsSdk } from 'sls-sdk'
import * as fs from 'fs'
import { FileExistsError } from 'sls-sdk/src/errors/FileExistsError';
import { Utils } from './Utils';
const asyncfs = fs.promises

let sdk: SlsSdk = null

beforeEach(async function () {
    sdk = await Utils.prepareFreshEnvironment()
})

describe('save', function () {
    it('can save with single client', async function () {
        const CONTENT = "some-content"
        const PATH = "somefile.txt"
        await sdk.saveFile(CONTENT, PATH)
        const savedContent = await asyncfs.readFile(`${Utils.getStorageRootPath(sdk.clientId)}/${sdk.clientId}/${PATH}`)
        assert.equal(savedContent.toString(), CONTENT)
    });
    // TODO: Issue #7
    it.skip("can save on non-existing sub-directories", async function () {
        const CONTENT = "some-content"
        const PATH = "sub/dir/somefile.txt"
        await sdk.saveFile(CONTENT, PATH)
        const savedContent = await asyncfs.readFile(`${Utils.getStorageRootPath(sdk.clientId)}/${sdk.clientId}/${PATH}`)
        assert.equal(savedContent.toString(), CONTENT)
    })
    it('can save with multiple clients', async function () {
        const CONTENT = "some-content"
        const PATH = "somefile.txt"

        const sdk2 = Utils.newSDK()
        await sdk2.start()

        await sdk.saveFile(CONTENT, PATH)

        const FILE_PATH_ON_MAIN_CLIENT = `${Utils.getStorageRootPath(sdk.clientId)}/${sdk.clientId}/${PATH}`
        const FILE_PATH_ON_CLIENT2 = `${Utils.getStorageRootPath(sdk2.clientId)}/${sdk.clientId}/${PATH}`
        let savedContent: Buffer
        if (fs.existsSync(FILE_PATH_ON_MAIN_CLIENT))
            savedContent = await asyncfs.readFile(FILE_PATH_ON_MAIN_CLIENT)
        else if (fs.existsSync(FILE_PATH_ON_CLIENT2))
            savedContent = await asyncfs.readFile(FILE_PATH_ON_CLIENT2)
        else
            assert.fail("The saved file did not found in any client!")
        assert.equal(savedContent.toString(), CONTENT)
    });
    it("file overwrite should be prevented", async function () {
        const CONTENT = "some-content"
        const NEW_CONTENT = "some-new-content"
        const PATH = "somefile.txt"
        await sdk.saveFile(CONTENT, PATH)

        await assert.rejects(sdk.saveFile(NEW_CONTENT, PATH), FileExistsError)
    });
});
