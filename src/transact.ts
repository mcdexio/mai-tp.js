import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
import { SignerOrProvider, BigNumberish, normalizeBigNumberish, DECIMALS } from '@mcdex/mai2.js'
import { TOKENIZER_ABI } from './types'

export async function getTokenizerContract(
  tokenizerAddress: string,
  signerOrProvider: SignerOrProvider
): Promise<ethers.Contract> {
  return new ethers.Contract(tokenizerAddress, TOKENIZER_ABI, signerOrProvider)
}

export async function mint(
  tokenizerContract: ethers.Contract,
  tpAmount: BigNumberish, // should be a decimal number (ie: 1.234)
  gas: ethers.providers.TransactionRequest = {}
): Promise<ethers.providers.TransactionResponse> {
  const largeAmount = normalizeBigNumberish(tpAmount)
    .shiftedBy(DECIMALS)
    .dp(0, BigNumber.ROUND_DOWN)
  return await tokenizerContract.mint(largeAmount.toFixed(), gas)
}

export async function depositAndMint(
  tokenizerContract: ethers.Contract,
  depositAmount: BigNumberish, // should be a decimal number (ie: 1.234)
  collateralDecimals: number,
  tpAmount: BigNumberish, // should be a decimal number (ie: 1.234)
  gas: ethers.providers.TransactionRequest = {}
): Promise<ethers.providers.TransactionResponse> {
  const largeDepositAmount = normalizeBigNumberish(depositAmount)
    .shiftedBy(collateralDecimals)
    .dp(0, BigNumber.ROUND_DOWN)
  const largeAmount = normalizeBigNumberish(tpAmount)
    .shiftedBy(DECIMALS)
    .dp(0, BigNumber.ROUND_DOWN)
  return await tokenizerContract.depositAndMint(largeDepositAmount.toFixed(), largeAmount.toFixed(), gas)
}

export async function depositEtherAndMint(
  tokenizerContract: ethers.Contract,
  depositAmount: BigNumberish, // should be a decimal number (ie: 1.234)
  tpAmount: BigNumberish, // should be a decimal number (ie: 1.234)
  gas: ethers.providers.TransactionRequest = {}
): Promise<ethers.providers.TransactionResponse> {
  const largeDepositAmount = normalizeBigNumberish(depositAmount)
    .shiftedBy(DECIMALS)
    .dp(0, BigNumber.ROUND_DOWN)
  const largeAmount = normalizeBigNumberish(tpAmount)
    .shiftedBy(DECIMALS)
    .dp(0, BigNumber.ROUND_DOWN)
  gas.value = new ethers.utils.BigNumber(largeDepositAmount.toFixed())
  return await tokenizerContract.depositAndMint(largeDepositAmount.toFixed(), largeAmount.toFixed(), gas)
}

export async function redeem(
  tokenizerContract: ethers.Contract,
  tpAmount: BigNumberish, // should be a decimal number (ie: 1.234)
  gas: ethers.providers.TransactionRequest = {}
): Promise<ethers.providers.TransactionResponse> {
  const largeAmount = normalizeBigNumberish(tpAmount)
    .shiftedBy(DECIMALS)
    .dp(0, BigNumber.ROUND_DOWN)
  return await tokenizerContract.redeem(largeAmount.toFixed(), gas)
}

export async function redeemAndWithdraw(
  tokenizerContract: ethers.Contract,
  tpAmount: BigNumberish, // should be a decimal number (ie: 1.234)
  withdrawAmount: BigNumberish, // should be a decimal number (ie: 1.234)
  collateralDecimals: number,
  gas: ethers.providers.TransactionRequest = {}
): Promise<ethers.providers.TransactionResponse> {
  const largeAmount = normalizeBigNumberish(tpAmount)
    .shiftedBy(DECIMALS)
    .dp(0, BigNumber.ROUND_DOWN)
  const largeWithdrawAmount = normalizeBigNumberish(withdrawAmount)
    .shiftedBy(collateralDecimals)
    .dp(0, BigNumber.ROUND_DOWN)
  return await tokenizerContract.redeemAndWithdraw(largeAmount.toFixed(), largeWithdrawAmount.toFixed(), gas)
}

export async function settle(
  tokenizerContract: ethers.Contract,
  gas: ethers.providers.TransactionRequest = {}
): Promise<ethers.providers.TransactionResponse> {
  return await tokenizerContract.settle(gas)
}
