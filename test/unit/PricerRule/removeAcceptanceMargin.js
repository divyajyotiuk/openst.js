'use strict';

const Web3 = require('web3');
const sinon = require('sinon');
const { assert } = require('chai');

const Spy = require('../../../utils/Spy');
const PricerRule = require('../../../lib/ContractInteract/PricerRule');
const AssertAsync = require('../../../utils/AssertAsync');
const Utils = require('../../../utils/Utils');

describe('PricerRule.removeAcceptanceMargin()', () => {
  let pricerRule;
  let web3;

  beforeEach(() => {
    web3 = new Web3();
    const address = '0x0000000000000000000000000000000000000002';
    pricerRule = new PricerRule(web3, address);
  });

  it('should pass with correct params', async () => {
    const payCurrencyCode = 'USD';
    const mockRawTx = 'mockRawTx';

    const rawTx = sinon.replace(pricerRule, 'removeAcceptanceMarginRawTx', sinon.fake.resolves(mockRawTx));

    const spySendTransaction = sinon.replace(Utils, 'sendTransaction', sinon.fake.resolves(true));
    const txOptions = {
      from: '0x0000000000000000000000000000000000000006'
    };

    const response = await pricerRule.removeAcceptanceMargin(payCurrencyCode, txOptions);
    assert.isTrue(response, 'removeAcceptanceMargin should return true');
    Spy.assert(rawTx, 1, [[payCurrencyCode]]);
    Spy.assert(spySendTransaction, 1, [[mockRawTx, txOptions]]);
    sinon.restore();
  });

  it('should throw an error when transaction options is undefined', async () => {
    const payCurrencyCode = 'USD';
    const txOptions = undefined;

    await AssertAsync.reject(
      pricerRule.removeAcceptanceMargin(payCurrencyCode, txOptions),
      'Invalid transaction options: undefined.'
    );
  });

  it('should throw an error when account address is undefined', async () => {
    const payCurrencyCode = 'USD';
    const txOptions = {};
    await AssertAsync.reject(
      pricerRule.removeAcceptanceMargin(payCurrencyCode, txOptions),
      `Invalid from address ${txOptions.from} in transaction options.`
    );
  });

  it('should throw an error when account address is invalid', async () => {
    const payCurrencyCode = 'USD';
    const txOptions = {
      from: '0x123'
    };
    await AssertAsync.reject(
      pricerRule.removeAcceptanceMargin(payCurrencyCode, txOptions),
      `Invalid from address ${txOptions.from} in transaction options.`
    );
  });
});
