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

describe('contract BlacklistTokenFactory', function () {
  const name = 'Demo Token';
  const symbol = 'DTK';
  const quantity = 1000000;

  let owner;
  let caller;
  let factory;
  let snapshotId;

  beforeEach(async () => {
    snapshotId = await snapshotBlockchain();
    [owner, caller] = await ethers.getSigners();
    factory = await deployContract('BlacklistTokenFactory', [], owner);
  });

  afterEach(async () => {
    await revertBlockchain(snapshotId);
  });

  context('function createBlacklistToken', async () => {
    async function getTokenAddress(txnHash) {
      if (!txnHash) {
        throw new Error('Invalid transaction hash');
      }

      const topic = ethers.utils.id('CreateBlacklistToken(address,address,string,string,uint256)');
      const logs = await ethers.provider.getLogs({
        fromBlock: 'latest',
        toBlock: 'latest',
        topics: [topic],
      });

      const abi = ['event CreateBlacklistToken(address indexed creater, address indexed token, string name, string symbol, uint256 quantity)'];

      const interface = new ethers.utils.Interface(abi);
      const lastLog = interface.parseLog(logs[logs.length - 1]);

      return lastLog.args.token;
    }

    async function createBlacklistToken() {
      return await factory.connect(caller).createBlacklistToken(name, symbol, quantity);
    }

    it(`should emit event CreateBlacklistToken`, async () => {
      const promise = createBlacklistToken();
      const tokenAddress = await getTokenAddress((await promise).hash);
      await expect(promise).emit(factory, 'CreateBlacklistToken').withArgs(caller.address, tokenAddress, name, symbol, quantity);
    });

    it(`should save token address`, async () => {
      const promise = createBlacklistToken();
      const tokenAddress = await getTokenAddress((await promise).hash);
      expect(tokenAddress).eq(await factory.blacklistTokens(0));
    });

    it(`should has right name and symbol`, async () => {
      await createBlacklistToken();
      const tokenAddress = await factory.blacklistTokens(0);
      const tokenContract = await ethers.getContractFactory('BlacklistToken');
      const tokenInstance = await tokenContract.attach(tokenAddress);

      expect(await tokenInstance.name()).eq(name);
      expect(await tokenInstance.symbol()).eq(symbol);
    });

    it(`should mint correct tokens to caller`, async () => {
      await createBlacklistToken();
      const tokenAddress = await factory.blacklistTokens(0);
      const tokenContract = await ethers.getContractFactory('BlacklistToken');
      const tokenInstance = await tokenContract.attach(tokenAddress);

      const balanceOfCaller = await tokenInstance.balanceOf(caller.address);
      console.log(`balanceOfCaller = ${balanceOfCaller}`);
      expect(balanceOfCaller).eq(BigInt(quantity) * 10n ** 18n);
    });

    it(`should grant correct rights to caller`, async () => {
      await createBlacklistToken();
      const tokenAddress = await factory.blacklistTokens(0);
      const tokenContract = await ethers.getContractFactory('BlacklistToken');
      const tokenInstance = await tokenContract.attach(tokenAddress);

      expect(await tokenInstance.hasRole(adminRole, caller.address)).is.true;
      expect(await tokenInstance.hasRole(pauserRole, caller.address)).is.true;
      expect(await tokenInstance.hasRole(minterRole, caller.address)).is.true;
    });
  });
});
