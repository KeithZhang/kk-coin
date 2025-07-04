'use client';

import { useState } from 'react';
import {
  createPublicClient,
  createWalletClient,
  http,
  custom,
  parseEther,
  formatEther,
} from 'viem';
import 'viem/window'
import { mainnet, anvil } from 'viem/chains';

import { Button } from "@/components/ui/button"

import { abi } from '@/abi/kk-coin-abi';

const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'; // Replace with your contract address


export default function Home() {
  const [balance, setBalance] = useState<string>('0');
  const [amount, setAmount] = useState<number>(0);

  const getBalance = async () => {
    if (window.ethereum) {
      // const walletClient = createWalletClient({
      //   chain: anvil,
      //   transport: custom(window.ethereum),
      // });

      const publicClient = createPublicClient({
        chain: anvil,
        transport: http(),
      });
      try {
          // const [currentAddress] = await walletClient.getAddresses();
          const balance = await publicClient.getBalance({ address: contractAddress });
          setBalance(balance.toString());
          console.log('Balance:', balance.toString());
          // If you want to convert the balance to ETH
          const balanceInEth = formatEther(balance);
          console.log('Balance in ETH:', balanceInEth.toString());

      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    } else {
      console.error(
        'Ethereum provider not found. Make sure you have a wallet extension installed.'
      );
    }
  };

  const withdraw = async () => {
    if (window.ethereum) {
      const walletClient = createWalletClient({
        chain: anvil,
        transport: custom(window.ethereum),
      });
      const publicClient = createPublicClient({
        chain: anvil,
        transport: custom(window.ethereum),
      });
      const [account] = await walletClient.requestAddresses();
      if (account) {
        const { request } = await publicClient.simulateContract({
          address: contractAddress,
          abi,
          functionName: 'withdraw',
          account,
        });
        console.log('Simulation request:', request);
        const hash = await walletClient.writeContract(request);
        console.log('Transaction hash:', hash);
      }
    } else {
      console.error(
        'Ethereum provider not found. Make sure you have a wallet extension installed.'
      );
    }
  };


  const buyCoffee = async () => {
    if (window.ethereum) {
      const walletClient = createWalletClient({
        chain: anvil,
        transport: custom(window.ethereum),
      });

      const publicClient = createPublicClient({
        chain: anvil,
        transport: custom(window.ethereum),
      });

      const [account] = await walletClient.requestAddresses();
      if (account) {
        const { request } = await publicClient.simulateContract({
          address: contractAddress,
          abi,
          functionName: 'fund',
          account,
          value: parseEther(amount.toString()), // Convert ETH to wei
        });
        console.log('Simulation request:', request);
        const hash = await walletClient.writeContract(request)
        console.log('Transaction hash:', hash);
      }
    } else {
      console.error(
        'Ethereum provider not found. Make sure you have a wallet extension installed.'
      );
    }
  };

  const getBlockNumber = async () => {
    const publicClient = createPublicClient({
      chain: mainnet,
      transport: http(),
    });

    const blockNumber = await publicClient.getBlockNumber();
    console.log('Current block number:', blockNumber);
  };

  const getAddress = async () => {
    if (window.ethereum) {
      const walletClient = createWalletClient({
        chain: mainnet,
        transport: custom(window.ethereum),
      });
      try {
        const accounts = await walletClient.getAddresses();
        if (accounts.length > 0) {
          const address = accounts[0];
          console.log('Connected address:', address);
          return address;
        }
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    } else {
      console.error(
        'Ethereum provider not found. Make sure you have a wallet extension installed.'
      );
    }
  };

  return (
    <div className='grid items-center justify-items-center p-8 pb-20 gap-16 '>
      <Button
        onClick={getBlockNumber}
      >
        getBlockNumber
      </Button>
      <Button
        onClick={getAddress}
      >
        getAddress
      </Button>
      <div>
        <label
          htmlFor='Balance'
          className='block mb-2 text-sm font-medium text-gray-700'
        >
          Balance: {balance}
        </label>
        <Button
          onClick={getBalance}

        >
          getBalance
        </Button>
      </div>

      <div>
        <label
          htmlFor='amount'
          className='block mb-2 text-sm font-medium text-gray-700'
        >
          Amount (in ETH):
        </label>
        <input
          type='number'
          id='amount'
          name='amount'
          className='border border-gray-300 rounded px-3 py-2 w-full'
          placeholder='Enter amount in ETH'
          style={{ fontFamily: 'var(--font-geist-sans)' }}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <Button
          onClick={buyCoffee}
        >
          Buy Coffee
        </Button>
      </div>

      <div>
        <Button
          onClick={withdraw}
        >
          Withdraw
        </Button>
      </div>
    </div>
  );
}
