import { ethers } from 'ethers'
import { BigNumber } from 'bignumber.js'

import { TOKENIZER_ABI, TokenizerGov, TokenizerStorage, TokenizerAccountDetails } from './types'
import { _0, _1, DECIMALS } from '@mcdex/mai2.js'
import { BigNumberish, normalizeBigNumberish, normalizeAddress } from '@mcdex/mai2.js'
import { SUPPORTED_NETWORK_ID, GeneralProvider, getNetworkIdAndProvider, getContract } from '@mcdex/mai2.js'

export async function getTokenizer(
  address: string,
  generalProvider: GeneralProvider = SUPPORTED_NETWORK_ID.Mainnet
): Promise<ethers.Contract> {
  return getContract(address, TOKENIZER_ABI, generalProvider)
}

export async function getTokenizerGov(
  contractReader: ethers.Contract,
  tokenizerAddress: string,
): Promise<TokenizerGov> {
  const tokenizer: ethers.Contract = getContract(tokenizerAddress, TOKENIZER_ABI, contractReader.provider)
  
  function getMintFeeRate() external view returns (uint256) { return _mintFeeRate; }
  paused
  stopped

  const p = await contractReader.getGovParams(perpetualContractAddress)
  return {
    // addresses
    amm: p.amm,
    poolAccount: p.poolAccount,

    // perpetual
    initialMargin: normalizeBigNumberish(p.perpGovernanceConfig.initialMarginRate).shiftedBy(-DECIMALS),
    maintenanceMargin: normalizeBigNumberish(p.perpGovernanceConfig.maintenanceMarginRate).shiftedBy(-DECIMALS),
    liquidationPenaltyRate: normalizeBigNumberish(p.perpGovernanceConfig.liquidationPenaltyRate).shiftedBy(-DECIMALS),
    penaltyFundRate: normalizeBigNumberish(p.perpGovernanceConfig.penaltyFundRate).shiftedBy(-DECIMALS),
    makerDevRate: normalizeBigNumberish(p.perpGovernanceConfig.makerDevFeeRate).shiftedBy(-DECIMALS),
    takerDevRate: normalizeBigNumberish(p.perpGovernanceConfig.takerDevFeeRate).shiftedBy(-DECIMALS),
    lotSize: normalizeBigNumberish(p.perpGovernanceConfig.lotSize).shiftedBy(-DECIMALS),
    tradingLotSize: normalizeBigNumberish(p.perpGovernanceConfig.tradingLotSize).shiftedBy(-DECIMALS),

    // amm
    poolFeeRate: normalizeBigNumberish(p.ammGovernanceConfig.poolFeeRate).shiftedBy(-DECIMALS),
    poolDevFeeRate: normalizeBigNumberish(p.ammGovernanceConfig.poolDevFeeRate).shiftedBy(-DECIMALS),
    emaAlpha: normalizeBigNumberish(p.ammGovernanceConfig.emaAlpha).shiftedBy(-DECIMALS),
    updatePremiumPrize: normalizeBigNumberish(p.ammGovernanceConfig.updatePremiumPrize).shiftedBy(-DECIMALS),
    markPremiumLimit: normalizeBigNumberish(p.ammGovernanceConfig.markPremiumLimit).shiftedBy(-DECIMALS),
    fundingDampener: normalizeBigNumberish(p.ammGovernanceConfig.fundingDampener).shiftedBy(-DECIMALS)
  }
  return {
    tokenizer: tokenizerAddress
    perpetual: string
    cap: BigNumber

    perpetualGov: GovParams
  }
}


// export interface TokenizerGov {
//   // tp
//   tokenizer: string
//   perpetual: string
//   cap: BigNumber

//   // perpetual gov
//   perpetualGov: GovParams
// }

// export interface TokenizerStorage {
//   // tp
//   totalSupply: BigNumber

//   // perpetual
//   perpetual: PerpetualStorage
//   tokenizerAccount: AccountStorage
// }

// export interface TokenizerAccountDetails extends TokenizerStorage {
//   tokenizerComputed: AccountComputed
//   tokenizerPrice: BigNumber // the collateral required if mint/redeem 1 tp
// }
