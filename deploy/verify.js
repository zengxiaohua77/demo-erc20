// SPDX-License-Identifier: MIT

// ==================== External Imports ====================

const hre = require('hardhat');
// const dotenv = require('dotenv');

// ==================== Internal Imports ====================

const config = require(`./config.json`);
const { getDataTime, getDeployedAddresses } = require('./helpers');

// dotenv.config();

const CHAIN_NAME = hre.network.name;
const CHAIN_ID = hre.network.config.chainId;
console.log(`\nCHAIN_NAME = ${CHAIN_NAME}, CHAIN_ID = ${CHAIN_ID}\n`);

async function verifyContract(address, args) {
  try {
    await hre.run('verify:verify', {
      network: CHAIN_NAME,
      address,
      constructorArguments: args,
    });
  } catch (e) {
    console.error(e);
  }

  // add space after each attempt
  console.log('\n');
}

async function quickVerifyContract(name, key, args = []) {
  const { filename, contractAddresses } = getDeployedAddresses(CHAIN_NAME, CHAIN_ID);
  const contractAddress = contractAddresses[key].address;

  if (!contractAddress) {
    throw new Error(`Fail to verify ${key}(${name}): must set ${key} in file ${filename} !`);
  }

  if (!args) {
    args = [];
  }

  console.log(`[${getDataTime()}] Verify ${key}(${name}) at ${contractAddress}, args = ${JSON.stringify(args)}`);
  await verifyContract(contractAddress, args);
}

async function verifyBlacklistToken() {
  const { blacklist_tokens: blacklistTokens } = config;

  for (const token of blacklistTokens) {
    const args = [token.name, token.symbol, token.quantity];
    await quickVerifyContract('BlacklistToken', token.key, args);
  }
}

async function verifyAll() {
  await quickVerifyContract('BlacklistTokenFactory', 'blacklist_token_factory');
  await verifyBlacklistToken();
}

async function verify() {
  const target = process.env.TARGET ? process.env.TARGET.toUpperCase() : 'ALL';

  switch (target) {
    case 'BlacklistTokenFactory'.toUpperCase():
    case 'blacklist_token_factory'.toUpperCase():
      await quickVerifyContract('BlacklistTokenFactory', 'blacklist_token_factory');
      break;

    case 'BlacklistToken'.toUpperCase():
    case 'blacklist_token'.toUpperCase():
      await verifyBlacklistToken();
      break;

    default:
      console.log(`verify all contracts\n`);
      await verifyAll();
  }
}

verify()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
