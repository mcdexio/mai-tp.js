import { ethers } from 'ethers'

import { TOKENIZER_ABI, TokenizerGov, TokenizerStorage } from './types'
import { _0, _1, DECIMALS, normalizeBigNumberish } from '@mcdex/mai2.js'
import { SUPPORTED_NETWORK_ID, GeneralProvider, getContract } from '@mcdex/mai2.js'
import { getGovParams, getPerpetualStorage, getAccountStorage } from '@mcdex/mai2.js'

export async function getTokenizer(
  address: string,
  generalProvider: GeneralProvider = SUPPORTED_NETWORK_ID.Mainnet
): Promise<ethers.Contract> {
  return await getContract(address, TOKENIZER_ABI, generalProvider)
}

export async function getTokenizerGov(
  contractReader: ethers.Contract,
  tokenizerAddress: string,
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

// export interface TokenizerAccountDetails extends TokenizerStorage {
//   tokenizerComputed: AccountComputed
//   tokenizerPrice: BigNumber // the collateral required if mint/redeem 1 tp
// }
