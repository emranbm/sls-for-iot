import {strict as assert} from 'assert'
import { SlsSdk } from 'sls-sdk'
import { FileNotExistsError } from 'sls-sdk/src/errors/FileNotExistsError'
import { Utils } from './Utils';


let sdk: SlsSdk = null

beforeEach(async function () {
    sdk = await Utils.prepareFreshEnvironment()
})

describe('read', function () {
    it('gets an appropriate error if file not exists', async function() {
        await assert.rejects(sdk.readFile('a/random/file.x'), FileNotExistsError)
    })
    it('can read what has been saved', async function () {
        const CONTENT = "some-content"
        const PATH = "somefile.txt"
        await sdk.saveFile(CONTENT, PATH)
        const savedContent = await sdk.readFile(PATH)
        assert.equal(savedContent, CONTENT)
    });
});
