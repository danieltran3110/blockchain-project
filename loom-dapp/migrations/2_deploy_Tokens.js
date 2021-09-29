// const MyToken = artifacts.require("MyToken")
// const FarmToken = artifacts.require("FarmToken")
const ColorContract = artifacts.require("Color")

module.exports = async function (deployer, network, accounts) {
  // // Deploy MyToken
  // await deployer.deploy(MyToken)
  // const myToken = await MyToken.deployed()
  //
  // // Deploy Farm Token
  // await deployer.deploy(FarmToken, myToken.address)
  // const farmToken = await FarmToken.deployed()

  // Deploy Color Contract
  await deployer.deploy(ColorContract)
  const colorContract = await ColorContract.deployed()
}