import * as assert from 'assert'
import * as sinon from 'sinon'
import * as MQTT from 'async-mqtt'
import { SlsSdk } from '../src/SlsSdk'
import { SdkNotStartedError } from '../src/errors/SdkNotStartedError';

let connectMethod = null

before(function () {
  connectMethod = sinon.stub(MQTT, "connectAsync")
})

describe('SlsSdk', function () {
  describe('#start', function () {
    it('should connect to the given broker', function () {
      const brokerUrl = "mqtt://test"
      const sdk = new SlsSdk(brokerUrl, '1')
      sdk.start()
      assert.equal(connectMethod.getCall(0).args[0], brokerUrl)
    });
    it('should check if the sdk has started before doing operations', async function () {
      const brokerUrl = "mqtt://test"
      const sdk = new SlsSdk(brokerUrl, '1')
      const assertFunc = err => err instanceof SdkNotStartedError
      const assertFailMessage = operationName => `Calling '${operationName}' should reject with a type 'SdkNotStartedError'`

      await assert.rejects(sdk.saveFile('some content', 'some/where.txt'), assertFunc, assertFailMessage('save'))
      await assert.rejects(sdk.readFile('some/where.txt'), assertFunc, assertFailMessage('readFile'))
      await assert.rejects(sdk.listFiles(), assertFunc, assertFailMessage('listFiles'))
      await assert.rejects(sdk.deleteFile('some/where.txt'), assertFunc, assertFailMessage('deleteFile'))
    })
  });
});