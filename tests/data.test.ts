import { ethers } from 'ethers'
import { BigNumber } from 'bignumber.js'
import { SIDE, _0, _1, _1000, _0_1, _0_01, normalizeBigNumberish, getContractReader } from '@mcdex/mai2.js'
import { extendExpect } from './helper'
import { getTokenizerGov } from '../src/data'

const testTP = '0x8C965cb3137BcC97fB517dcAe15f4490d52Ae2B8'
const testRpc = 'http://10.30.206.10:8747'
const testUser1 = '0x31ebd457b999bf99759602f5ece5aa5033cb56b3'

const rpcProvider = new ethers.providers.JsonRpcProvider(testRpc)

extendExpect()

it('getTokenizerStorage', async function () {
  const contractReader: ethers.Contract = await getContractReader(rpcProvider)
  const gov = await getTokenizerGov(contractReader, testTP)

  const p: GovParams = await getGovParams(contractReader, dataTestAddress.perp)
  expect(p.amm).toEqual(dataTestAddress.amm)
  expect(p.poolAccount).toEqual(dataTestAddress.perpProxy)

  expect(p.initialMargin).toBeBigNumber(normalizeBigNumberish('0.1'))
  expect(p.maintenanceMargin).toBeBigNumber(normalizeBigNumberish('0.05'))
  expect(p.liquidationPenaltyRate).toBeBigNumber(normalizeBigNumberish('0.005'))
  expect(p.penaltyFundRate).toBeBigNumber(normalizeBigNumberish('0.005'))
  expect(p.makerDevRate).toBeBigNumber(normalizeBigNumberish('-0.00025'))
  expect(p.takerDevRate).toBeBigNumber(normalizeBigNumberish('0.00075'))
  expect(p.lotSize).toBeBigNumber(normalizeBigNumberish('1e-18'))
  expect(p.tradingLotSize).toBeBigNumber(normalizeBigNumberish('1e-18'))

  expect(p.poolFeeRate).toBeBigNumber(normalizeBigNumberish('0.000375'))
  expect(p.poolDevFeeRate).toBeBigNumber(normalizeBigNumberish('0.000375'))
  expect(p.emaAlpha).toBeBigNumber(normalizeBigNumberish('0.003327787021630616')) // 2 / (600 + 1)
  expect(p.markPremiumLimit).toBeBigNumber(normalizeBigNumberish('0.005'))
  expect(p.fundingDampener).toBeBigNumber(normalizeBigNumberish('0.0005'))
})
