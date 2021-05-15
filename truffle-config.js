const HDWalletProvider = require("@truffle/hdwallet-provider");
const fs = require("fs");

const mnemonic = fs.readFileSync(".secret").toString().trim();

const provider = new HDWalletProvider(
  mnemonic,
  "https://bsc-dataseed.binance.org/"
);

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    bsctest: {
      provider: () => provider,
      network_id: 97,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    bsc: {
      provider: () => provider,
      network_id: 56,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
  compilers: {
    solc: {
      version: "0.6.12",
    },
  },
};
