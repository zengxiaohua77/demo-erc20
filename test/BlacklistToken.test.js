// SPDX-License-Identifier: MIT

/* global describe context it ethers beforeEach afterEach */

// ==================== External Imports ====================

const chai = require('chai');

// ==================== Internal Imports ====================

const { keccak256 } = require('./helpers/hash');
const { deployContract } = require('./helpers/deploy');
const { snapshotBlockchain, revertBlockchain } = require('./helpers/evmUtil.js');

const { expect } = chai;

const adminRole = keccak256('ADMIN_ROLE'); // 0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775
const pauserRole = keccak256('PAUSER_ROLE'); // 0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a
const minterRole = keccak256('MINTER_ROLE'); // 0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6

describe('contract BlacklistToken', function () {
  const name = 'Demo Token';
  const symbol = 'DTK';
  const quantity = 1000000;

  let owner;
  let caller;
  let user1;
  let user2;
  let factory;
  let snapshotId;

  beforeEach(async () => {
    snapshotId = await snapshotBlockchain();
    [owner, caller, user1, user2] = await ethers.getSigners();

    factory = await deployContract('BlacklistToken', [name, symbol, quantity], owner);
  });

  afterEach(async () => {
    await revertBlockchain(snapshotId);
  });

  context('function addBlackUser', async () => {
    //
  });

  context('function removeBlackUser', async () => {
    //
  });
});
