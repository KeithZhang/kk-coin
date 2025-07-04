import { ReactNode } from 'react';
import { Providers } from './provider';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@radix-ui/react-separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { FaGithub, FaBars } from 'react-icons/fa';

export default function RainbowkitLayout(props: { children: ReactNode }) {
  return (
    <SidebarInset>
      <Providers>
        <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
          <SidebarTrigger className='-ml-1' />
          <Separator
            orientation='vertical'
            className='mr-2 data-[orientation=vertical]:h-4'
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className='hidden md:block'>
                <BreadcrumbLink href='#'>
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className='hidden md:block' />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className='flex flex-1 items-center space-x-3 md:space-x-4 justify-end'>
            {/* 连接按钮 */}
            <div className='transform hover:-translate-y-0.5 transition-transform'>
              <ConnectButton
                label='Connect Wallet'
                accountStatus={{
                  smallScreen: 'avatar',
                  largeScreen: 'full',
                }}
                chainStatus={{
                  smallScreen: 'icon',
                  largeScreen: 'full',
                }}
                showBalance={{
                  smallScreen: false,
                  largeScreen: true,
                }}
              />
            </div>

            {/* GitHub推荐 */}
            <a
              href='https://github.com/KeithZhang'
              target='_blank'
              rel='noopener noreferrer'
              className='group flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-300'
              aria-label='View on GitHub'
            >
              <FaGithub className='w-5 h-5 text-gray-700 group-hover:text-black transition-colors' />
            </a>
          </div>
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4'>
          <div className='bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min'>
            {props.children}
          </div>
        </div>
      </Providers>
    </SidebarInset>
  );
}
