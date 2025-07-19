'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FaPaperPlane, FaEthereum, FaInfoCircle } from 'react-icons/fa';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { MdError } from 'react-icons/md';
import Image from 'next/image';
import { useChainId, useConfig, useAccount, useWriteContract } from 'wagmi';
import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from '@wagmi/core';

import { chainsToTSender, tsenderAbi, erc20Abi } from './constants';

import calculateTotal from '@/utils/calculateTotal';

const TokenTransferPage = () => {
  const [tokenAddress, setTokenAddress] = useState<string>(
    '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
  );
  const [recipients, setRecipients] = useState<string>(
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
  );
  const [amounts, setAmounts] = useState<string>('1000000000000000000');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>(
    'idle'
  );
  const chainId = useChainId();
  const config = useConfig();
  const account = useAccount();
  const { data, isPending, writeContractAsync } = useWriteContract();

  const total = useMemo(() => {
    const totalAmount = calculateTotal(amounts);
    console.log('Total Amount:', totalAmount);
    return totalAmount;
  }, [amounts]);

  console.log('account...', account);
  console.log('recipients...', recipients);

  const tSenderAddress = chainsToTSender[chainId]['tsender'];

  const handleSendTokens = async () => {
    if (!tokenAddress || !recipients || !amounts) {
      setSendStatus('error');
      return;
    }

    setIsSending(true);

    try {
      const allowance = (await readContract(config, {
        address: tokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [account.address, tSenderAddress as `0x${string}`],
      })) as number;

      console.log('allowance...', allowance);
      console.log('allowance...', total);

      if (allowance < total) {
        const approvalHash = await writeContractAsync({
          address: tokenAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: 'approve',
          args: [tSenderAddress as `0x${string}`, BigInt(total)],
        });

        console.log('approvalHash...', approvalHash);

        const approvalReceipt = await waitForTransactionReceipt(config, {
          hash: approvalHash,
        });

        console.log('approvalReceipt...', approvalReceipt);

        await writeContractAsync({
          abi: tsenderAbi,
          address: tSenderAddress as `0x${string}`,
          functionName: 'airdropERC20',
          args: [
            tokenAddress,
            // Comma or new line separated
            recipients
              .split(/[,\n]+/)
              .map((addr) => addr.trim())
              .filter((addr) => addr !== ''),
            amounts
              .split(/[,\n]+/)
              .map((amt) => amt.trim())
              .filter((amt) => amt !== ''),
            BigInt(total),
          ],
        });
      } else {
        await writeContractAsync({
          abi: tsenderAbi,
          address: tSenderAddress as `0x${string}`,
          functionName: 'airdropERC20',
          args: [
            tokenAddress,
            // Comma or new line separated
            recipients
              .split(/[,\n]+/)
              .map((addr) => addr.trim())
              .filter((addr) => addr !== ''),
            amounts
              .split(/[,\n]+/)
              .map((amt) => amt.trim())
              .filter((amt) => amt !== ''),
            BigInt(total),
          ],
        });
      }
      setIsSending(false);
      setSendStatus('success');
      console.log('Tokens sent successfully!');
    } catch (error) {
      setIsSending(false);
      setSendStatus('error');

      throw error;
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-800'>Token Transfer</h1>
            <p className='text-gray-600 mt-2'>
              Send tokens to multiple recipients in one transaction
            </p>
          </div>
          <div className='bg-white p-3 rounded-lg shadow-sm border'>
            <div className='flex items-center'>
              <FaEthereum className='text-purple-600 text-xl mr-2' />
              <span className='font-medium'>Ethereum Mainnet</span>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* 左侧表单区域 */}
          <div className='space-y-6'>
            <Card className='border border-gray-200 shadow-sm'>
              <CardHeader>
                <CardTitle className='text-lg flex items-center'>
                  <FaInfoCircle className='text-blue-500 mr-2' />
                  Transfer Information
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-2'>
                  <Label
                    htmlFor='tokenAddress'
                    className='text-gray-700 font-medium'
                  >
                    Token Address
                  </Label>
                  <Input
                    id='tokenAddress'
                    placeholder='0x...'
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                    className='border-gray-300 focus:border-blue-500'
                  />
                  <p className='text-sm text-gray-500'>
                    Enter the ERC20 token contract address
                  </p>
                </div>

                <div className='space-y-2'>
                  <Label
                    htmlFor='recipients'
                    className='text-gray-700 font-medium'
                  >
                    Recipients (one per line)
                  </Label>
                  <Textarea
                    id='recipients'
                    placeholder='0x...'
                    rows={5}
                    value={recipients}
                    onChange={(e) => setRecipients(e.target.value)}
                    className='border-gray-300 focus:border-blue-500 min-h-[120px]'
                  />
                  <p className='text-sm text-gray-500'>
                    Enter recipient wallet addresses, one per line
                  </p>
                </div>

                <div className='space-y-2'>
                  <Label
                    htmlFor='amounts'
                    className='text-gray-700 font-medium'
                  >
                    Amounts (one per line, in wei)
                  </Label>
                  <Textarea
                    id='amounts'
                    placeholder='1000000000000000000'
                    rows={5}
                    value={amounts}
                    onChange={(e) => setAmounts(e.target.value)}
                    className='border-gray-300 focus:border-blue-500 min-h-[120px]'
                  />
                  <p className='text-sm text-gray-500'>
                    Enter amounts in wei (1 token = 10^18 wei)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧交易明细区域 */}
          <div>
            <Card className='border border-gray-200 shadow-sm h-full'>
              <CardHeader>
                <CardTitle className='text-lg'>Transactions Detail</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`p-4 rounded-lg border ${
                    isSending
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className='flex mt-2 space-x-4'>
                    <div>
                      <p className='text-xs text-gray-500'>Token Type</p>
                      <p className='text-sm font-medium'>{total}</p>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardContent>
                <div
                  className={`p-4 rounded-lg border ${
                    isSending
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div>
                    <p className='text-xs text-gray-500'>Amount (wei)</p>
                    <p className='text-sm font-medium'>{total}</p>
                  </div>
                </div>
              </CardContent>

              <CardContent>
                <div
                  className={`p-4 rounded-lg border ${
                    isSending
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div>
                    <p className='text-xs text-gray-500'>Amount (Token)</p>
                    <p className='text-sm font-medium'>{total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='col-span-1 lg:col-span-2 space-y-4'>
            <Button
              onClick={handleSendTokens}
              disabled={isSending}
              className='w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all'
            >
              {isSending ? (
                <div className='flex items-center'>
                  <svg
                    className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Sending Tokens...
                </div>
              ) : (
                <div className='flex items-center justify-center'>
                  <FaPaperPlane className='mr-3' />
                  <span className='text-lg'>Send Tokens</span>
                </div>
              )}
            </Button>

            {sendStatus === 'success' && (
              <div className='bg-green-50 border border-green-200 rounded-lg p-4 flex items-center'>
                <IoMdCheckmarkCircle className='text-green-500 text-2xl mr-3' />
                <div>
                  <h3 className='font-medium text-green-800'>
                    Transfer Successful!
                  </h3>
                  <p className='text-green-700 text-sm mt-1'>
                    Tokens have been successfully sent to all recipients.
                  </p>
                </div>
              </div>
            )}

            {sendStatus === 'error' && (
              <div className='bg-red-50 border border-red-200 rounded-lg p-4 flex items-center'>
                <MdError className='text-red-500 text-2xl mr-3' />
                <div>
                  <h3 className='font-medium text-red-800'>Transfer Failed</h3>
                  <p className='text-red-700 text-sm mt-1'>
                    Please check your inputs and try again. Make sure all fields
                    are filled correctly.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='mt-10 text-center text-gray-500 text-sm'>
          <p>Token Transfer DApp | Secured by Ethereum Blockchain</p>
        </div>
      </div>
    </div>
  );
};

export default TokenTransferPage;
