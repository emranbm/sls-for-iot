import * as assert from 'assert'
import { SlsSdk } from 'sls-sdk'
import { FileNotExistsError } from 'sls-sdk/src/errors/FileNotExistsError'
import { Utils } from './Utils'

let sdk: SlsSdk = null

beforeEach(async function () {
    sdk = await Utils.prepareFreshEnvironment()
})

describe('delete', function () {
    it('gets an appropriate error if file not exists', async function() {
        await assert.rejects(sdk.deleteFile('a/random/file.x'), FileNotExistsError)
    })
});
