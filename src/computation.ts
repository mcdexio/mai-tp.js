/*
  Simulate the smart contract's computation.
 */
import { TokenizerAccountDetails, TokenizerGov, TokenizerStorage } from './types'
import { _0, _1, FundingResult, computeAccount, inversePrice } from '@mcdex/mai2.js'

export function computeTokenizerAccount(g: TokenizerGov, s: TokenizerStorage, f: FundingResult): TokenizerAccountDetails {
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
    gov: g,
    storage: s,
    details: tokenizerDetails,
    price: tokenizerPrice,
    inversePrice: inversePrice(tokenizerPrice)
  }
}

// computeMint
//   * deltaCash = tokenizerPrice * tpAmount
//   * tp.cashBalance += deltaCash * (1 + mintFeeRate)
//   * trade at MarkPrice. tp is always Long position

// computeRedeem
//   * deltaCash = tokenizerPrice * tpAmount
//   * tp.cashBalance -= deltaCash * (1 + mintFeeRate)
//   * trade at MarkPrice. tp is always Short position
