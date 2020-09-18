import { ethers } from 'ethers'

import { AccountStorageOfTokenizer, TOKENIZER_ABI, TokenizerGov, TokenizerStorage } from './types'
import { DECIMALS, normalizeBigNumberish } from '@mcdex/mai2.js'
import { getContract } from '@mcdex/mai2.js'
import { getGovParams, getPerpetualStorage, getAccountStorage } from '@mcdex/mai2.js'

export async function getTokenizerGov(
  contractReader: ethers.Contract,
  tokenizerAddress: string
): Promise<TokenizerGov> {
  const tokenizer: ethers.Contract = await getContract(tokenizerAddress, TOKENIZER_ABI, contractReader.provider)
  const [
    perpetualAddress,
    devAddress,
    mintFeeRate,
    cap,
    isPaused,
    isStopped
  ] = await tokenizer.dumpGov()
  const p = await getGovParams(contractReader, perpetualAddress)
  return {
    // addresses
    tokenizerAddress,
    perpetualAddress,

    // tp
    cap: normalizeBigNumberish(cap).shiftedBy(-DECIMALS),
    mintFeeRate: normalizeBigNumberish(mintFeeRate).shiftedBy(-DECIMALS),
    devAddress,
    isPaused,
    isStopped,

    // perpetual gov
    perpetualGov: p
  }
}

export async function getTokenizerStorage(
  contractReader: ethers.Contract,
  gov: TokenizerGov,
): Promise<TokenizerStorage> {
  const tokenizer: ethers.Contract = await getContract(gov.tokenizerAddress, TOKENIZER_ABI, contractReader.provider)
  const [
    totalSupply,
    perpetualStorage,
    tokenizerAccount
  ] = await Promise.all([
    tokenizer.totalSupply(),
    getPerpetualStorage(contractReader, gov.perpetualAddress),
    getAccountStorage(contractReader, gov.perpetualAddress, gov.tokenizerAddress)
  ])
  return {
    totalSupply: normalizeBigNumberish(totalSupply).shiftedBy(-DECIMALS),
    perpetualStorage,
    tokenizerAccount
  }
}

export async function getAccountStorageOfTokenizer(
  contractReader: ethers.Contract,
  gov: TokenizerGov,
  userAddress: string
): Promise<AccountStorageOfTokenizer> {
  const tokenizer: ethers.Contract = await getContract(gov.tokenizerAddress, TOKENIZER_ABI, contractReader.provider)
  const [
    totalSupply,
    account
  ] = await Promise.all([
    tokenizer.balanceOf(userAddress),
    getAccountStorage(contractReader, gov.perpetualAddress, userAddress)
  ])
  return {
    balance: normalizeBigNumberish(totalSupply).shiftedBy(-DECIMALS),
    account
  }
}
