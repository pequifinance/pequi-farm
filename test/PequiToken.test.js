const { assert } = require("chai");

const PequiToken = artifacts.require("PequiToken");

contract("PequiToken", ([romeu, michael, victor, dev, owner]) => {
  beforeEach(async () => {
    this.pequi = await PequiToken.new({ from: owner });
  });

  it("mint", async () => {
    await this.pequi.mint(romeu, 1000, { from: owner });
    assert.equal((await this.pequi.balanceOf(romeu)).toString(), "1000");
  });
});
