import BigNumber from 'bignumber.js'
import {
  computeFunding,
  normalizeBigNumberish
} from '@mcdex/mai2.js'
import { _0, _1, SIDE } from '@mcdex/mai2.js'
import {
  FundingParams,
  PerpetualStorage,
  AccountStorage,
  GovParams
} from '@mcdex/mai2.js'
import { computeTokenizer } from '../src/computation'
import { extendExpect, getBN } from './helper'
import { TokenizerGov, TokenizerStorage } from '../src/types'

extendExpect()

const govParams: GovParams = {
  initialMargin: new BigNumber(0.1),
  maintenanceMargin: new BigNumber(0.05),
  liquidationPenaltyRate: new BigNumber(0.005),
  penaltyFundRate: new BigNumber(0.005),
  makerDevRate: new BigNumber(-0.0005),
  takerDevRate: new BigNumber(0.0015),
  lotSize: new BigNumber(1),
  tradingLotSize: new BigNumber(1),
  poolFeeRate: new BigNumber(0.001),
  poolDevFeeRate: new BigNumber(0.0015),
  markPremiumLimit: new BigNumber('0.005'), //0.5%
  fundingDampener: new BigNumber('0.0005'), // 0.05%
  emaAlpha: getBN('3327787021630616'), // 2 / (600 + 1)
  updatePremiumPrize: _0,
  amm: '0x0000000000000000000000000000000000000000',
  poolAccount: '0x0000000000000000000000000000000000000000'
}

const tpGov: TokenizerGov = {
  tokenizerAddress: '0x0000000000000000000000000000000000000000',
  perpetualAddress: '0x0000000000000000000000000000000000000000',
  cap: new BigNumber('2000000'),
  mintFeeRate: new BigNumber('0.001'),
  devAddress: '0x0000000000000000000000000000000000000000',
  isPaused: false,
  isStopped: false,
  perpetualGov: govParams
}

//[ '-70000000000000000000', '70000000000000000000', '86', '-35106643857103393523', '-2709000000000000000000' ],
const fundingParams: FundingParams = {
  accumulatedFundingPerContract: new BigNumber('10'),
  lastEMAPremium: getBN('-70000000000000000000'),
  lastPremium: getBN('70000000000000000000'),
  lastIndexPrice: getBN('7000000000000000000000'),
  lastFundingTimestamp: 1579601290
}

const timestamp = fundingParams.lastFundingTimestamp + 86

const perpetualStorage: PerpetualStorage = {
  collateralTokenAddress: 'xxxx',
  totalSize: new BigNumber('1000'),
  longSocialLossPerContract: new BigNumber('0.1'),
  shortSocialLossPerContract: new BigNumber('0.5'),
  insuranceFundBalance: new BigNumber('0.0'),
  isEmergency: false,
  isGlobalSettled: false,
  globalSettlePrice: new BigNumber(0),
  isPaused: false,
  isWithdrawDisabled: false,
  oraclePrice: getBN('7000000000000000000000'),
  oracleTimestamp: 1579601290,
  shareTokenAddress: '',
  ...fundingParams
}

const fundingResult = computeFunding(perpetualStorage, govParams, timestamp)

const accountStorage1: AccountStorage = {
  cashBalance: new BigNumber('10000'),
  positionSide: SIDE.Buy,
  positionSize: new BigNumber('2.3'),
  entryValue: new BigNumber('2300.23'),
  entrySocialLoss: new BigNumber('0.1'),
  entryFundingLoss: new BigNumber('-0.91'),
}

const tpStorage1: TokenizerStorage = {
  totalSupply: accountStorage1.positionSize,
  perpetualStorage,
  tokenizerAccount: accountStorage1
}

const tpStorage2: TokenizerStorage = {
  totalSupply: accountStorage1.positionSize.times(2),
  perpetualStorage,
  tokenizerAccount: accountStorage1
}

const accountStorage4: AccountStorage = {
  cashBalance: new BigNumber('10000'),
  positionSide: SIDE.Flat,
  positionSize: _0,
  entryValue: _0,
  entrySocialLoss: _0,
  entryFundingLoss: _0,
}

const tpStorage4: TokenizerStorage = {
  totalSupply: accountStorage4.positionSize,
  perpetualStorage,
  tokenizerAccount: accountStorage4
}

describe('computeTokenizer', function () {
  interface ExpectedOutput {
    price: BigNumber
    inversePrice: BigNumber
  }
  
  interface Case {
    storage: TokenizerStorage
    expectedOutput: ExpectedOutput
  }

  const expectOutput1: ExpectedOutput = {
    // marginBalance 23695.44634375, positionSize = 2.3
    price: normalizeBigNumberish('10302.36797554347826086956522'),
    inversePrice: normalizeBigNumberish('0.00009706506333047643332599546949')
  }
  const expectOutput2: ExpectedOutput = {
    price: normalizeBigNumberish('5151.18398777173913043478261'),
    inversePrice: normalizeBigNumberish('0.0001941301266609528666519909390')
  }
  const expectOutput4: ExpectedOutput = {
    // markPrice = 6965
    price: normalizeBigNumberish('6965'),
    inversePrice: normalizeBigNumberish('0.00014357501794687725')
  }

  const successCases: Array<Case> = [
    {
      storage: tpStorage1,
      expectedOutput: expectOutput1
    },
    {
      storage: tpStorage2,
      expectedOutput: expectOutput2
    },
    {
      storage: tpStorage4,
      expectedOutput: expectOutput4
    },
  ]

  successCases.forEach((element, index) => {
    it(`computeAccount.${index}`, function () {
      const expectedOutput = element.expectedOutput
      const computed = computeTokenizer(tpGov, element.storage, fundingResult)
      expect(computed.price).toApproximate(expectedOutput.price)
      expect(computed.inversePrice).toApproximate(expectedOutput.inversePrice)
    })
  })
})
