import { ReactNode } from 'react';
import { SidebarInset } from '@/components/ui/sidebar';

import Header from './components/Header';
import Provider from './components/Provider';

export const metadata = {
  title: 'RainbowKit Layout',
  description: 'A layout component for RainbowKit with sidebar and header',
};

export default function RainbowkitLayout(props: { children: ReactNode }) {
  return (
    <SidebarInset>
      <Provider>
        {/* Header with navigation and connect button */}
        <Header />

        {/* Main content area */}
        <div className='flex flex-1 flex-col gap-4 p-4'>
          <div className='bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min'>
            {props.children}
          </div>
        </div>
      </Provider>
    </SidebarInset>
  );
}
