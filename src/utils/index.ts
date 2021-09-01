import BigNumber from 'bignumber.js'

export { default as formatAddress } from './formatAddress'

export const bnToDec = (bn: BigNumber, decimals = 18): number => {
  return bn.dividedBy(new BigNumber(10).pow(decimals)).toNumber()
}

export const decToBn = (dec: number, decimals = 18) => {
  return new BigNumber(dec).multipliedBy(new BigNumber(10).pow(decimals))
}

export function toTrunc(value: any, n: number = 4) {
    if (!value) {
        return value;
    }

    return Math.floor(value * Math.pow(10, n)) / (Math.pow(10, n));
}