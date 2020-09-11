/*
  Simulate the smart contract's computation.
 */
import { AccountStorageOfTokenizer, TokenizerComputed, TokenizerGov, TokenizerStorage } from './types'
import {
  _0,
  _1,
  FundingResult,
  computeAccount,
  inversePrice,
  AccountStorage,
  BigNumberish, normalizeBigNumberish, computeTrade, TRADE_SIDE
} from '@mcdex/mai2.js'
import { BigNumber } from 'bignumber.js'

export function computeTokenizer(g: TokenizerGov, s: TokenizerStorage, f: FundingResult): TokenizerComputed {
  const tokenizerDetails = computeAccount(s.tokenizerAccount, g.perpetualGov, s.perpetualStorage, f)

  // calculate ctk if user want to mint/redeem 1 tp
  const totalSupply = s.totalSupply
  const positionSize = tokenizerDetails.accountStorage.positionSize
  const marginBalance = tokenizerDetails.accountComputed.marginBalance
  const markPrice = f.markPrice
  const tpAmount = _1
  let amount = _0
  let collateral = _0

  if (positionSize.eq(totalSupply)) {
    // normal. amount = tpAmount
    amount = tpAmount
  } else {
    // liquidated. amount = PositionSize * tpAmount / totalSupply
    if (totalSupply.eq(_0)) {
      console.warn(`tp.position (${positionSize.toFixed()}) != totalSupply (${totalSupply.toFixed()}), but totalSupply is zero`)
    } else {
      amount = tpAmount.times(positionSize).div(totalSupply)
    }
  }

  if (positionSize.eq(_0)) {
    // DeltaCash:= MarkPrice * Amount
    collateral = markPrice.times(amount)
  } else {
    // DeltaCash:= OldMarginBalance * Amount / PositionSize
    collateral = marginBalance.times(amount).div(positionSize)
  }

  const tokenizerPrice = collateral.div(tpAmount)
  return {
    details: tokenizerDetails,
    price: tokenizerPrice,
    inversePrice: inversePrice(tokenizerPrice)
  }
}

// computeMint
//   * deltaCash = tokenizerPrice * tpAmount
//   * tp.cashBalance += deltaCash * (1 + mintFeeRate)
//   * trade at MarkPrice. tp is always Long position

export function computeMint(g: TokenizerGov, s: TokenizerStorage, f: FundingResult, user: AccountStorageOfTokenizer, amount: BigNumberish):
  { tokenizer: AccountStorage, user: AccountStorage, balance: BigNumber } {
  const tokenizerDetails = computeAccount(s.tokenizerAccount, g.perpetualGov, s.perpetualStorage, f)

  let normalizedAmount = normalizeBigNumberish(amount)
  normalizedAmount.minus(normalizedAmount.mod(g.perpetualGov.lotSize))

  const markPrice = f.markPrice
  let normalizedCollateral: BigNumber
  if (s.totalSupply.eq(_0)) {
    normalizedCollateral = normalizedAmount.times(markPrice)
  } else {
    normalizedCollateral = tokenizerDetails.accountComputed.marginBalance.times(normalizedAmount).div(s.tokenizerAccount.positionSize)
  }

  const amm2 = { ...s.tokenizerAccount, cashBalance: s.tokenizerAccount.cashBalance.plus(normalizedCollateral) }
  const user2 = { ...user, cashBalance: user.account.cashBalance.minus(normalizedCollateral) }

  const newTokenizer = computeTrade(s.perpetualStorage, f, amm2, TRADE_SIDE.Buy, markPrice, normalizedAmount, g.mintFeeRate)
  const newUser = computeTrade(s.perpetualStorage, f, user2.account, TRADE_SIDE.Sell, markPrice, normalizedAmount, g.mintFeeRate)

  return {
    tokenizer: newTokenizer,
    user: newUser,
    balance: user.balance.plus(normalizedAmount)
  }
}

// computeRedeem
//   * deltaCash = tokenizerPrice * tpAmount
//   * tp.cashBalance -= deltaCash * (1 + mintFeeRate)
//   * trade at MarkPrice. tp is always Short position
export function computeRedeem(g: TokenizerGov, s: TokenizerStorage, f: FundingResult, user: AccountStorageOfTokenizer, amount: BigNumberish):
  { tokenizer: AccountStorage, user: AccountStorage, balance: BigNumber } {
  let normalizedAmount = normalizeBigNumberish(amount)
  normalizedAmount.minus(normalizedAmount.mod(g.perpetualGov.lotSize))

  const markPrice = f.markPrice
  let normalizedCollateral: BigNumber

  if (s.totalSupply.eq(s.tokenizerAccount.positionSize)) {
    normalizedCollateral = normalizedAmount.times(markPrice)
  } else {
    normalizedCollateral = s.tokenizerAccount.positionSize.times(normalizedAmount).div(s.totalSupply)
  }

  const tokenizer = { ...s.tokenizerAccount, cashBalance: s.tokenizerAccount.cashBalance.minus(normalizedCollateral) }
  const user2 = { ...user, cashBalance: user.account.cashBalance.plus(normalizedCollateral) }

  const newTokenizer = computeTrade(s.perpetualStorage, f, tokenizer, TRADE_SIDE.Sell, markPrice, normalizedAmount, g.mintFeeRate)
  const newUser = computeTrade(s.perpetualStorage, f, user2.account, TRADE_SIDE.Buy, markPrice, normalizedAmount, g.mintFeeRate)

  return {
    tokenizer: newTokenizer,
    user: newUser,
    balance: user.balance.minus(normalizedAmount)
  }
}