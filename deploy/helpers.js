// SPDX-License-Identifier: MIT

// ==================== External Imports ====================

const fs = require('fs');

const DIR = './deploy/deployed';

function getDataTime() {
  const dayjs = require('dayjs');

  return dayjs().format('YYYY-MM-DD HH:mm:ss');
}

function getEthers(hre) {
  if (!hre?.ethers) {
    hre = require('hardhat');
  }

  return hre.ethers;
}

function getDeployer(RPC_ENDPOINT, DEPLOYER_PRIVATE_KEY, hre) {
  const ethers = getEthers(hre);
  const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);
  const deployer = new ethers.Wallet(`0x${DEPLOYER_PRIVATE_KEY}`, provider);

  return deployer;
}

/// @param  name  The name of contract
/// @param  args  The arguments of contract constructor function
async function deployContract(signer, name, args = []) {
  // https://github.com/NomicFoundation/hardhat/blob/master/packages/hardhat-ethers/README.md#helpers
  const { ethers } = require('hardhat');
  const Implementation = await ethers.getContractFactory(name, signer);
  const contract = await Implementation.deploy(...args);

  return contract.deployed();
}

function getDeployedAddresses(chain_name, chain_id) {
  const filename = `${DIR}/${chain_name}.json`;

  let contractAddresses;

  try {
    contractAddresses = JSON.parse(fs.readFileSync(filename));
  } catch (e) {
    console.error(e);
    contractAddresses = {
      chain_name,
      chain_id,
    };
  }

  return { directory: DIR, filename, contractAddresses };
}

function writeDeployedAddresses(directory, filename, addresses) {
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(filename, JSON.stringify(addresses, null, 2));
}

module.exports = {
  getDataTime,
  getDeployer,
  deployContract,
  getDeployedAddresses,
  writeDeployedAddresses,
};
