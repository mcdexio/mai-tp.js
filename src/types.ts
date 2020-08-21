import { BigNumber } from 'bignumber.js'
import { GovParams, PerpetualStorage, AccountStorage, AccountComputed } from '@mcdex/mai2.js'

import TokenizerABI from './abi/TokenizerImplV1.json'
export const TOKENIZER_ABI: string = JSON.stringify(TokenizerABI)

export interface TokenizerGov {
  // addresses
  tokenizer: string
  perpetual: string

  // tp
  cap: BigNumber
  mintFeeRate: BigNumber
  isPaused: boolean
  isStopped: boolean

  // perpetual gov
  perpetualGov: GovParams
}

export interface TokenizerStorage {
  // tp
  totalSupply: BigNumber

  // perpetual
  perpetual: PerpetualStorage
  tokenizerAccount: AccountStorage
}

export interface TokenizerAccountDetails extends TokenizerStorage {
  tokenizerComputed: AccountComputed
  tokenizerPrice: BigNumber // the collateral required if mint/redeem 1 tp
}
