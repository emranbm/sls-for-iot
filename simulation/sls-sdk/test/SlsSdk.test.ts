import * as assert from 'assert'
import * as sinon from 'sinon'
import * as MQTT from 'async-mqtt'
import { SlsSdk } from '../src/SlsSdk'

describe('SlsSdk', function () {
  describe('#start', function () {
    it('should subscribe to self topics', function () {
      const brokerUrl = "mqtt://test"
      const connectMethod = sinon.stub(MQTT, "connectAsync")
      const sdk = new SlsSdk(brokerUrl, '1')
      sdk.start()
      assert.equal(connectMethod.getCall(0).args[0], brokerUrl)
    });
  });
});