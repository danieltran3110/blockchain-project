import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import web3 from 'web3'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const GAS_LIMIT = {
  STAKING: {
    DEFAULT: 200000,
    SNX: 850000,
  },
}

export const getMasterChefAddress = (sushi) => {
  return sushi && sushi.masterChefAddress
}
export const getSushiAddress = (sushi) => {
  return sushi && sushi.sushiAddress
}

export const getToanTokenAddress = (sushi) => {
    return sushi && sushi.toanTokenAddress
}

export const getToanTokenContract = (sushi) => {
    return sushi && sushi.contracts && sushi.contracts.toanTokenContract
}

export const getColorContractAddress = (sushi) => {
    return sushi && sushi.colorContractAddress
}

export const getColorContract = (sushi) => {
    return sushi && sushi.contracts && sushi.contracts.colorContract
}

export const getFarmAddress = (sushi) => {
    return sushi && sushi.farmAddress
}

export const getFarmContract = (sushi) => {
    return sushi && sushi.contracts && sushi.contracts.farmContract
}

export const getWethContract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.weth
}

export const getMasterChefContract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.masterChef
}
export const getSushiContract = (sushi) => {
  return sushi && sushi.contracts && sushi.contracts.sushi
}

export const approveNFT = async (tokenContract, operator, account) => {
    return tokenContract.methods
        .setApprovalForAll(operator, true)
        .send({ from: account })
        .on('transactionHash', (tx) => {
            return tx.transactionHash
        })
}

// is approved
export const isApprovedForAll = async (targetContract, operator, account) => {
    return await targetContract.methods
        .isApprovedForAll(
            account,
            operator
        )
        .call({ from: account })
}

export const getFarms = (sushi) => {
  return sushi
    ? sushi.contracts.pools.map(
        ({
          pid,
          name,
          symbol,
          icon,
          tokenAddress,
          tokenSymbol,
          tokenContract,
          lpAddress,
          lpContract,
        }) => ({
          pid,
          id: symbol,
          name,
          lpToken: symbol,
          lpTokenAddress: lpAddress,
          lpContract,
          tokenAddress,
          tokenSymbol,
          tokenContract,
          earnToken: 'sushi',
          earnTokenAddress: sushi.contracts.sushi.options.address,
          icon,
        }),
      )
    : []
}

export const getPoolWeight = async (masterChefContract, pid) => {
  const { allocPoint } = await masterChefContract.methods.poolInfo(pid).call()
  const totalAllocPoint = await masterChefContract.methods
    .totalAllocPoint()
    .call()
  return new BigNumber(allocPoint).div(new BigNumber(totalAllocPoint))
}

export const getEarned = async (masterChefContract, pid, account) => {
  return masterChefContract.methods.pendingSushi(pid, account).call()
}

export const getTotalLPWethValue = async (
  masterChefContract,
  wethContract,
  lpContract,
  tokenContract,
  pid,
) => {
  // Get balance of the token address
  const tokenAmountWholeLP = await tokenContract.methods
    .balanceOf(lpContract.options.address)
    .call()
  const tokenDecimals = await tokenContract.methods.decimals().call()
  // Get the share of lpContract that masterChefContract owns
  const balance = await lpContract.methods
    .balanceOf(masterChefContract.options.address)
    .call()
  // Convert that into the portion of total lpContract = p1
  const totalSupply = await lpContract.methods.totalSupply().call()
  // Get total weth value for the lpContract = w1
  const lpContractWeth = await wethContract.methods
    .balanceOf(lpContract.options.address)
    .call()
  // Return p1 * w1 * 2
  const portionLp = new BigNumber(balance).div(new BigNumber(totalSupply))
  const lpWethWorth = new BigNumber(lpContractWeth)
  const totalLpWethValue = portionLp.times(lpWethWorth).times(new BigNumber(2))
  // Calculate
  const tokenAmount = new BigNumber(tokenAmountWholeLP)
    .times(portionLp)
    .div(new BigNumber(10).pow(tokenDecimals))

  const wethAmount = new BigNumber(lpContractWeth)
    .times(portionLp)
    .div(new BigNumber(10).pow(18))
  return {
    tokenAmount,
    wethAmount,
    totalWethValue: totalLpWethValue.div(new BigNumber(10).pow(18)),
    tokenPriceInWeth: wethAmount.div(tokenAmount),
    poolWeight: await getPoolWeight(masterChefContract, pid),
  }
}

export const approve = async (lpContract, masterChefContract, account) => {
  return lpContract.methods
    .approve(masterChefContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account })
}

export const getSushiSupply = async (sushi) => {
  return new BigNumber(await sushi.contracts.sushi.methods.totalSupply().call())
}

export const stake = async (masterChefContract, pid, amount, account) => {
  return masterChefContract.methods
    .deposit(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const unstake = async (masterChefContract, pid, amount, account) => {
  return masterChefContract.methods
    .withdraw(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}
export const harvest = async (masterChefContract, pid, account) => {
  return masterChefContract.methods
    .deposit(pid, '0')
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const getStaked = async (masterChefContract, pid, account) => {
  try {
    const { amount } = await masterChefContract.methods
      .userInfo(pid, account)
      .call()
    return new BigNumber(amount)
  } catch {
    return new BigNumber(0)
  }
}

export const redeem = async (masterChefContract, account) => {
  let now = new Date().getTime() / 1000
  if (now >= 1597172400) {
    return masterChefContract.methods
      .exit()
      .send({ from: account })
      .on('transactionHash', (tx) => {
        console.log(tx)
        return tx.transactionHash
      })
  } else {
    alert('pool not active')
  }
}

export const farm = {
    deposit: async(farmContract, amount, account) => {
        return farmContract.methods
        .deposit(
            web3.utils.toWei(amount, "ether")
        )
        .send({ from: account, gasPrice: web3.utils.toWei('1', 'Gwei'), gas: '3000000' })
        .on('transactionHash', (tx) => {
        console.log(tx)
        return tx.transactionHash
        })
    },

    withdraw: async(farmContract, amount, account) => {
        return farmContract.methods
        .withdraw(
            web3.utils.toWei(amount, "ether")
        )
        .send({ from: account, gasPrice: web3.utils.toWei('1', 'Gwei'), gas: '3000000' })
        .on('transactionHash', (tx) => {
            console.log(tx)
            return tx.transactionHash
        })
    },

    balance: async(farmContract) => {
        return farmContract.methods
        .balance().call()
    }
}

export const toan = {
    allowance: async(ToanTokenContract, account, FarmTokenAddress) => {
        return await ToanTokenContract.methods.allowance(account, FarmTokenAddress)
        .call()
    },

    approveToDeposit: async(ToanTokenContract, account, FarmTokenAddress) => {
        return await ToanTokenContract.methods.approve(FarmTokenAddress, ethers.constants.MaxUint256)
        .send({ from: account, gasPrice: web3.utils.toWei('1', 'Gwei'), gas: '3000000' })
    },

    transfer: async(ToanTokenContract, address, amount, account) => {
        return ToanTokenContract.methods
        .transfer(
            address,
            web3.utils.toWei(amount, "ether")
        )
        .send({ from: account })
    }
}

export const colorFnc = {
    totalColors: async(colorContract) => {
        return await colorContract.methods
        .totalColors().call()
    },
    mint: async(colorContract, color, account) => {
        return await colorContract.methods.mint(color).send({from: account})
    },

}
