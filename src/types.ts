import { BigNumber } from 'bignumber.js'
import { GovParams, PerpetualStorage, AccountStorage, AccountComputed, AccountDetails } from '@mcdex/mai2.js'

import TokenizerABI from './abi/TokenizerImplV1.json'
export const TOKENIZER_ABI: string = JSON.stringify(TokenizerABI)

export interface TokenizerGov {
  // addresses
  tokenizerAddress: string
  perpetualAddress: string
  
  // tp
  cap: BigNumber
  mintFeeRate: BigNumber
  devAddress: string
  isPaused: boolean
  isStopped: boolean

  // perpetual gov
  perpetualGov: GovParams
}

export interface TokenizerStorage {
  // tp
  totalSupply: BigNumber

  // perpetual
  perpetualStorage: PerpetualStorage
  tokenizerAccount: AccountStorage
}

export interface TokenizerAccountDetails {
  gov: TokenizerGov
  storage: TokenizerStorage
  details: AccountDetails
  price: BigNumber // the collateral required if mint/redeem 1 tp
  inversePrice: BigNumber // the collateral required if mint/redeem 1 tp
}
