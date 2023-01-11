/* global task */

require('hardhat-contract-sizer');
require('@nomiclabs/hardhat-web3');
require('@nomiclabs/hardhat-etherscan');
require('@nomicfoundation/hardhat-toolbox');
require('@nomicfoundation/hardhat-chai-matchers');

require('dotenv').config();

const { ALCHEMY_API_KEY, ETHERSCAN_API_KEY, INFURA_PROJECT_ID, RPC_INDEX, POLYGONSCAN_API_KEY } = process.env;

if (!POLYGONSCAN_API_KEY) {
  console.log('Please set POLYGONSCAN_API_KEY in file .env !');
}

const enableGasReport = process.env.REPORT_GAS ? true : false;
if (enableGasReport) {
  require('hardhat-gas-reporter');
}

const rpcIndex = RPC_INDEX && parseInt(RPC_INDEX) ? parseInt(RPC_INDEX) : 0;

const MUMBAI_RPC_LIST = [
  `https://rpc-mumbai.matic.today`,
  `https://rpc-mumbai.maticvigil.com`,
  `https://rpc.ankr.com/polygon_mumbai`,
  `https://matic-mumbai.chainstacklabs.com`,
  `https://polygon-testnet.public.blastapi.io`,
  `https://matic-testnet-archive-rpc.bwarelabs.com`,
  `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
];

const GOERLI_RPC_LIST = [
  `https://rpc.goerli.mudit.blog`,
  `https://rpc.ankr.com/eth_goerli`,
  `https://eth-goerli.public.blastapi.io`,
  `https://eth-goerli.g.alchemy.com/v2/demo`,
  `https://goerli.infura.io/v3/${INFURA_PROJECT_ID}`,
];

const ether = (n) => `${n}${'0'.repeat(18)}`;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.8.17',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.7.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      blockGasLimit: 2e7,
      allowUnlimitedContractSize: true,
      accounts: {
        count: 10,
        accountsBalance: ether(1000000),
      },
    },
    local: {
      url: 'http://localhost:8545',
    },
    mumbai: {
      url: MUMBAI_RPC_LIST[rpcIndex],
      chainId: 80001,
    },
    goerli: {
      url: GOERLI_RPC_LIST[rpcIndex],
      chainId: 5,
    },
  },
  gasReporter: {
    enabled: enableGasReport,
    currency: 'USD',
  },
  etherscan: {
    apiKey: {
      mainnet: ETHERSCAN_API_KEY,
      goerli: ETHERSCAN_API_KEY,
      polygon: POLYGONSCAN_API_KEY,
      polygonMumbai: POLYGONSCAN_API_KEY,
    },
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: true,
    runOnCompile: false,
    strict: false,
  },
  mocha: {
    timeout: 20000,
  },
};
