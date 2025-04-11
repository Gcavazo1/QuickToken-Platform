declare module 'wagmi' {
  import { ethers } from 'ethers';
  
  export function useAccount(): {
    address: string | undefined;
    isConnected: boolean;
    [key: string]: any;
  };
  
  export function useProvider(): unknown;
  
  // Add other wagmi hooks as needed
} 