const { expectRevert, time } = require("@openzeppelin/test-helpers");
const { assert } = require("chai");
const PequiToken = artifacts.require("PequiToken");
const MasterChef = artifacts.require("MasterChef");
const MockBEP20 = artifacts.require("libs/MockBEP20");

contract("MasterChef", ([romeu, michael, victor, dev, fee, owner]) => {
  beforeEach(async () => {
    this.zeroAddress = "0x0000000000000000000000000000000000000000";
    this.pequi = await PequiToken.new({ from: owner });
    this.chef = await MasterChef.new(
      this.pequi.address,
      owner,
      owner,
      "100",
      "1000",
      {
        from: owner,
      }
    );

    await this.pequi.transferOwnership(this.chef.address, { from: owner });

    this.lp1 = await MockBEP20.new("LPToken", "LP1", "1000000", {
      from: owner,
    });
    this.lp2 = await MockBEP20.new("LPToken", "LP2", "1000000", {
      from: owner,
    });
    this.lp3 = await MockBEP20.new("LPToken", "LP3", "1000000", {
      from: owner,
    });
    this.lp4 = await MockBEP20.new("LPToken", "LP4", "1000000", {
      from: owner,
    });

    await this.lp1.transfer(romeu, "2000", { from: owner });
    await this.lp2.transfer(romeu, "2000", { from: owner });
    await this.lp3.transfer(romeu, "2000", { from: owner });
    await this.lp4.transfer(romeu, "2000", { from: owner });

    await this.lp1.transfer(michael, "2000", { from: owner });
    await this.lp2.transfer(michael, "2000", { from: owner });
    await this.lp3.transfer(michael, "2000", { from: owner });
    await this.lp4.transfer(michael, "2000", { from: owner });

    await this.lp1.transfer(victor, "2000", { from: owner });
    await this.lp2.transfer(victor, "2000", { from: owner });
    await this.lp3.transfer(victor, "2000", { from: owner });
    await this.lp4.transfer(victor, "2000", { from: owner });
  });

  it("deposit fee", async () => {
    assert.equal(await this.chef.owner(), owner);
    assert.equal(await this.chef.feeAddress(), owner);

    await this.chef.setFeeAddress(fee, { from: owner });
    assert.equal(await this.chef.feeAddress(), fee);

    await this.chef.add("1000", this.lp1.address, "400", true, {
      from: owner,
    });
    await this.chef.add("2000", this.lp2.address, "0", true, {
      from: owner,
    });

    await this.lp1.approve(this.chef.address, "1000", { from: romeu });
    await this.lp2.approve(this.chef.address, "1000", { from: romeu });

    assert.equal((await this.lp1.balanceOf(fee)).toString(), "0");
    await this.chef.deposit(0, "100", { from: romeu });
    assert.equal((await this.lp1.balanceOf(fee)).toString(), "4");

    assert.equal((await this.lp2.balanceOf(fee)).toString(), "0");
    await this.chef.deposit(1, "100", { from: romeu });
    assert.equal((await this.lp2.balanceOf(fee)).toString(), "0");
  });

  it("only dev", async () => {
    assert.equal(await this.chef.owner(), owner);
    assert.equal(await this.chef.devAddress(), owner);

    await expectRevert(
      this.chef.setDevAddress(dev, { from: dev }),
      "setDevAddress: FORBIDDEN"
    );
    await this.chef.setDevAddress(dev, { from: owner });
    assert.equal(await this.chef.devAddress(), dev);

    await expectRevert(
      this.chef.setDevAddress(this.zeroAddress, { from: dev }),
      "setDevAddress: ZERO"
    );
  });

  it("only fee", async () => {
    assert.equal(await this.chef.owner(), owner);
    assert.equal(await this.chef.feeAddress(), owner);

    await expectRevert(
      this.chef.setFeeAddress(fee, { from: fee }),
      "setFeeAddress: FORBIDDEN"
    );
    await this.chef.setFeeAddress(fee, { from: owner });
    assert.equal(await this.chef.feeAddress(), fee);

    await expectRevert(
      this.chef.setFeeAddress(this.zeroAddress, { from: fee }),
      "setFeeAddress: ZERO"
    );
  });
});
