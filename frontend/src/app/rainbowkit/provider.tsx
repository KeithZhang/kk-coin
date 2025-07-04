"use client"

import { ReactNode, useState } from "react";
import { WagmiProvider } from "wagmi";
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { anvil, zksync, mainnet } from 'wagmi/chains'
import { RainbowKitProvider, ConnectButton } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import '@rainbow-me/rainbowkit/styles.css'


const config = getDefaultConfig({
  appName: "TSender",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  chains: [anvil, zksync, mainnet],
  ssr: false,
}) 


// const queryClient = new QueryClient()

export function Providers(props: { children: ReactNode}) {
  const [queryClient] = useState(() =>  new QueryClient())
  return (
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            { props.children }
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
  )
}