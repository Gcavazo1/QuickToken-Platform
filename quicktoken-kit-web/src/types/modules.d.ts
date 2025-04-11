// Type declarations for modules without declaration files

// Wagmi declarations
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

// Web3-React declarations
declare module '@web3-react/core' {
  import { ReactNode } from 'react';
  import { ethers } from 'ethers';
  import { AbstractConnector } from '@web3-react/abstract-connector';
  
  export interface Web3ReactContextInterface {
    active: boolean;
    error: Error | undefined;
    account: string | null | undefined;
    library: ethers.BrowserProvider | undefined;
    chainId: number | undefined;
    activate: (connector: AbstractConnector, onError?: (error: Error) => void, throwErrors?: boolean) => Promise<void>;
    setError: (error: Error) => void;
    deactivate: () => void;
    connector: AbstractConnector | undefined;
  }
  
  export function useWeb3React<T = ethers.BrowserProvider>(): Web3ReactContextInterface;
  
  export interface Web3ReactProviderProps {
    getLibrary: (provider: any) => any;
    children: ReactNode;
  }
  
  export function Web3ReactProvider(props: Web3ReactProviderProps): JSX.Element;
}

declare module '@web3-react/abstract-connector' {
  export abstract class AbstractConnector {
    public abstract name: string;
    public abstract async activate(): Promise<{
      provider: any;
      account: string | null | undefined;
      chainId: number | undefined;
    }>;
    public abstract async getProvider(): Promise<any>;
    public abstract async getChainId(): Promise<number | string>;
    public abstract async getAccount(): Promise<string | null | undefined>;
    public abstract deactivate(): void;
  }
}

declare module '@web3-react/injected-connector' {
  import { AbstractConnector } from '@web3-react/abstract-connector';
  
  export interface InjectedConnectorOptions {
    supportedChainIds?: number[];
  }
  
  export class InjectedConnector extends AbstractConnector {
    constructor(options?: InjectedConnectorOptions);
    public isAuthorized(): Promise<boolean>;
  }
}

// Supabase lib declarations
declare module '@/lib/supabase' {
  export interface Client {
    id: string;
    name: string;
    email: string;
    company: string;
    projectCount: number;
    deploymentsCount: number;
    lastActive: string;
    status: 'active' | 'inactive' | 'pending';
    notes?: string;
    created_at?: string;
    [key: string]: any;
  }
  
  export interface Project {
    id: string;
    name: string;
    status: string;
    client_id: string;
    created_at: string;
    [key: string]: any;
  }
  
  export function getClients(): Promise<Client[]>;
  export function getProjects(): Promise<Project[]>;
  export function getDeployments(): Promise<any[]>;
  
  // Add other supabase functions as needed
}

// Token deployment lib declarations
declare module '@/lib/tokenDeployment' {
  import { ethers } from 'ethers';
  
  export interface TokenDeploymentParams {
    name: string;
    symbol: string;
    maxSupply: string;
    mintFee: string;
    lockDuration: number;
    owner?: string;
  }
  
  export interface TokenDeploymentResult {
    success: boolean;
    contractAddress?: string;
    transactionHash?: string;
    error?: string;
    errorDetails?: unknown;
  }
  
  export interface DeploymentData {
    contractAddress: string;
    transactionHash: string;
    name: string;
    symbol: string;
    maxSupply: string;
    mintFee: string;
    lockDuration: number;
    network: string;
    timestamp?: string;
    [key: string]: any;
  }
  
  export class TokenDeployer {
    constructor(provider?: ethers.BrowserProvider);
    initialize(provider: ethers.BrowserProvider): Promise<void>;
    estimateGas(params: TokenDeploymentParams): Promise<string>;
    deploy(params: TokenDeploymentParams): Promise<TokenDeploymentResult>;
  }
  
  export function deployToken(
    provider: ethers.BrowserProvider,
    params: TokenDeploymentParams
  ): Promise<TokenDeploymentResult>;
  
  export function createTokenDeployer(provider: ethers.BrowserProvider): TokenDeployer;
  export function trackDeployment(data: DeploymentData): Promise<boolean>;
  export function saveDeployment(data: any): Promise<boolean>;
  export function getDeployments(): DeploymentData[];
}
