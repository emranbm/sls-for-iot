import * as assert from 'assert'
import * as fs from 'fs'
import { SlsSdk } from 'sls-sdk'
import { FileNotExistsError } from 'sls-sdk/src/errors/FileNotExistsError'
import { Utils } from './Utils'

let sdk: SlsSdk = null

beforeEach(async function () {
    sdk = await Utils.prepareFreshEnvironment()
})

describe('delete', function () {
    it('gets an appropriate error if file not exists', async function () {
        await assert.rejects(sdk.deleteFile('a/random/file.x'), FileNotExistsError)
    })
    it('Can delete what has been saved', async function () {
        const path = 'some/where/file.txt'
        console.log("0000")
        await sdk.saveFile('something', path)
        console.log("A")
        await sdk.deleteFile(path)
        console.log("B")
        const fileRealPath = `${Utils.getStorageRootPath(sdk.clientId)}/${sdk.clientId}/${path}`
        assert(fs.existsSync(fileRealPath))
    })
});
