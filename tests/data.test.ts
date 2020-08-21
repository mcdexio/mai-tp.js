import { ethers } from 'ethers'
import { normalizeBigNumberish, getContractReader } from '@mcdex/mai2.js'
import { extendExpect } from './helper'
import { getTokenizerGov, getTokenizerStorage } from '../src/data'

const testTP = '0x82472Bef3b89D1a54d26389DB804DeBb453b386B'
const testPerpetual = '0x4CB3E13779B0D1806BF2e4348472670726bAb8BF'
const testRpc = 'http://10.30.206.10:8747'
// const testUser1 = '0x31ebd457b999bf99759602f5ece5aa5033cb56b3'
const testAdmin = '0x6766F3CFD606E1E428747D3364baE65B6f914D56'

const rpcProvider = new ethers.providers.JsonRpcProvider(testRpc)

extendExpect()

it('getTokenizerStorage', async function () {
  const contractReader: ethers.Contract = await getContractReader(rpcProvider)
  const g = await getTokenizerGov(contractReader, testTP)

  expect(g.tokenizerAddress).toEqual(testTP)
  expect(g.perpetualAddress).toEqual(testPerpetual)
  expect(g.devAddress).toEqual(testAdmin)
 
  expect(g.cap).toBeBigNumber(normalizeBigNumberish('2000000'))
  expect(g.mintFeeRate).toBeBigNumber(normalizeBigNumberish('0'))
  expect(g.isPaused).toBeFalsy()
  expect(g.isStopped).toBeFalsy()
  
  const p = g.perpetualGov
  expect(p.emaAlpha).toBeBigNumber(normalizeBigNumberish('0.003327787021630616')) // 2 / (600 + 1)
})

it('getTokenizerStorage', async function () {
  const contractReader: ethers.Contract = await getContractReader(rpcProvider)
  const g = await getTokenizerGov(contractReader, testTP)
  const s = await getTokenizerStorage(contractReader, g)
  expect(s.totalSupply).toBeBigNumber(s.tokenizerAccount.positionSize)
})
