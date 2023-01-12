// SPDX-License-Identifier: MIT

/* global ethers */

// ==================== External Imports ====================

// const { ethers } = require('hardhat');

async function deployContract(name, args = [], signer) {
  // https://github.com/NomicFoundation/hardhat/blob/master/packages/hardhat-ethers/README.md#helpers
  const Implementation = await ethers.getContractFactory(name, signer?.address ? { signer } : {});
  const contract = await Implementation.deploy(...args);
  return contract.deployed();
}

module.exports = {
  deployContract,
};
