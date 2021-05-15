const Timelock = artifacts.require("Timelock");
const PequiToken = artifacts.require("PequiToken");
const MasterChef = artifacts.require("MasterChef");

let admin = "0x0"; // TODO add admin address here
let startBlock = 5881529;
let timelockEta = 46800;

module.exports = function (deployer) {
  // 1st deployment
  deployer.deploy(Timelock, admin, timelockEta).then(function (zero) {
    return deployer.deploy(PequiToken).then(function () {
      return deployer.deploy(
        MasterChef,
        PequiToken.address,
        admin,
        "1000000000000000000",
        startBlock
      );
    });
  });
} as Truffle.Migration;

// because of https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export {};
