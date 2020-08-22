import { ethers } from 'ethers'
import { BigNumber } from 'bignumber.js'
import { extendExpect } from './helper'
import { getTokenizerContract, depositEtherAndMint, redeemAndWithdraw } from '../src/transact'

const testTP = '0x82472Bef3b89D1a54d26389DB804DeBb453b386B'
const testRpc = 'http://10.30.206.10:8747'
const testUser1PK = '0xb7a0c9d2786fc4dd080ea5d619d36771aeb0c8c26c290afd3451b92ba2b7bc2c'

const rpcProvider = new ethers.providers.JsonRpcProvider(testRpc)
const walletWithProvider = new ethers.Wallet(testUser1PK, rpcProvider)
const testGas: ethers.providers.TransactionRequest = {
  gasLimit: 1234567,
  gasPrice: new ethers.utils.BigNumber('12345')
}

extendExpect()

it('depositAndMint', async function() {
  const c = await getTokenizerContract(testTP, walletWithProvider)
  const depositAmount = new BigNumber('1')
  const tpAmount = new BigNumber('100')
  const tx = await depositEtherAndMint(c, depositAmount, tpAmount, testGas)
  expect(tx.gasLimit.toString()).toEqual('1234567')
  expect(tx.gasPrice.toString()).toEqual('12345')
  await tx.wait()
})

it('redeemAndWithdraw', async function() {
  const c = await getTokenizerContract(testTP, walletWithProvider)
  const tpAmount = new BigNumber('100')
  const withdrawAmount = new BigNumber('1')
  const tx = await redeemAndWithdraw(c, tpAmount, withdrawAmount, 18, testGas)
  expect(tx.gasLimit.toString()).toEqual('1234567')
  expect(tx.gasPrice.toString()).toEqual('12345')
  await tx.wait()
})
