// SPDX-License-Identifier: MIT

/* global web3 */

// ==================== External Imports ====================

const hre = require('hardhat');
const dotenv = require('dotenv');

// ==================== Internal Imports ====================

const config = require(`./config.json`);
const { getDataTime, getDeployer, deployContract, getDeployedAddresses, writeDeployedAddresses } = require('./helpers');

dotenv.config();

const { DEPLOYER_PRIVATE_KEY } = process.env;
if (!DEPLOYER_PRIVATE_KEY) {
  throw new Error(`DEPLOYER_PRIVATE_KEY is not set in file .env !}`);
}

const CHAIN_NAME = hre.network.name;
const CHAIN_ID = hre.network.config.chainId;
const RPC_ENDPOINT = hre.network.config.url;
console.log(`\nCHAIN_NAME = ${CHAIN_NAME}, CHAIN_ID = ${CHAIN_ID}\n`);

const deployer = getDeployer(RPC_ENDPOINT, DEPLOYER_PRIVATE_KEY);

/// @param  name  The name of contract
/// @param  key   The key of contract instance in deployed json file
/// @param  args  The arguments of contract constructor function
async function quickDeployContract(name, key, args = []) {
  const { directory, filename, contractAddresses } = getDeployedAddresses(CHAIN_NAME, CHAIN_ID);
  const oldAddress = contractAddresses[key]?.address;

  if (oldAddress) {
    console.log(`[${getDataTime()}] SKIP: ${key}(${name}) is already deployed at ${oldAddress}\n`);
    return oldAddress;
  }

  if (!args) {
    args = [];
  }

  // Deploy contract
  console.log(`[${getDataTime()}] DO: Deploy ${name} to ${CHAIN_NAME}, args = ${JSON.stringify(args)}`);
  const instance = await deployContract(deployer, name, args);
  const address = instance.address;
  const hash = instance.deployTransaction.hash;
  const trx = await web3.eth.getTransaction(instance.deployTransaction.hash);
  const block = trx.blockNumber;
  console.log(`[${getDataTime()}] OK: ${name} is deployed at ${address}, block = ${block}`);

  // update addresses
  contractAddresses[key] = { address, block, hash };
  writeDeployedAddresses(directory, filename, contractAddresses);
  console.log(`[${getDataTime()}] OK: Write ${key} to file ${filename}\n`);

  return address;
}

function deployBlacklistToken(key, name, symbol, quantity) {
  const contractName = 'BlacklistToken';
  const args = [name, symbol, quantity];

  return quickDeployContract(contractName, key, args);
}

async function deployAll() {
  const { blacklist_tokens: blacklistTokens } = config;

  for (const token of blacklistTokens) {
    await deployBlacklistToken(token.key, token.name, token.symbol, token.quantity);
  }

  await quickDeployContract('BlacklistTokenFactory', 'blacklist_token_factory');
}

deployAll()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
