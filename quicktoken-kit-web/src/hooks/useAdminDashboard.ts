import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { 
  supabase,
  snakeToCamel
} from '../lib/supabase';
import { useWeb3React } from '@web3-react/core';

// Adapted types for our local usage
interface Client {
  id: string;
  name: string;
  email: string;
  created_at: string;
  [key: string]: any;
}

interface Project {
  id: string;
  name: string;
  status: string;
  client_id: string;
  created_at: string;
  [key: string]: any;
}

interface DeploymentData {
  id?: string;
  contractAddress: string;
  transactionHash: string;
  name: string;
  symbol: string;
  maxSupply: string;
  mintFee: string;
  lockDuration: string | number;
  network: string;
  deployerAddress?: string;
  deploymentDate?: string;
  timestamp?: string;
}

interface AdminDashboardState {
  initialized: boolean;
  clients: Client[];
  projects: Project[];
  deployments: DeploymentData[];
  stats: {
    totalClients: number;
    activeProjects: number;
    totalDeployments: number;
    walletBalance: string;
  };
  loading: boolean;
}

// Helper function to transform Supabase clients to our local format
function transformClients(clients: any[]): Client[] {
  return clients.map(client => {
    // Create a new object with the required Client properties
    const transformedClient: Client = {
      id: client.id,
      name: client.name,
      email: client.email,
      created_at: client.last_active || new Date().toISOString()
    };
    
    // Add any additional properties from the original client
    for (const key in client) {
      if (key !== 'id' && key !== 'name' && key !== 'email') {
        (transformedClient as any)[key] = client[key];
      }
    }
    
    return transformedClient;
  });
}

// Helper function to transform Supabase projects to our local format
function transformProjects(projects: any[]): Project[] {
  return projects.map(project => {
    // Create a new object with the required Project properties
    const transformedProject: Project = {
      id: project.id,
      name: project.name,
      status: project.status,
      client_id: project.client_id,
      created_at: project.created_at || new Date().toISOString()
    };
    
    // Add any additional properties from the original project
    for (const key in project) {
      if (key !== 'id' && key !== 'name' && key !== 'status' && 
          key !== 'client_id' && key !== 'created_at') {
        (transformedProject as any)[key] = project[key];
      }
    }
    
    return transformedProject;
  });
}

// Helper function to transform deployments to our expected format
function transformDeployments(deployments: any[]): DeploymentData[] {
  return deployments.map(deployment => {
    // Ensure all required fields are present
    const transformedDeployment: DeploymentData = {
      id: deployment.id,
      contractAddress: deployment.contract_address || '',
      transactionHash: deployment.deployment_tx || deployment.transaction_hash || '',
      name: deployment.name || deployment.token_name || '',
      symbol: deployment.symbol || deployment.token_symbol || '',
      maxSupply: deployment.supply || deployment.max_supply || '0',
      mintFee: deployment.mint_fee || '0',
      lockDuration: deployment.lock_duration || 0,
      network: deployment.network || 'unknown',
      deployerAddress: deployment.deployed_by || deployment.deployer_address || '',
      deploymentDate: deployment.deployment_date || deployment.created_at || new Date().toISOString()
    };
    
    return transformedDeployment;
  });
}

export function useAdminDashboard() {
  const { account, active, library } = useWeb3React();
  
  const [state, setState] = useState<AdminDashboardState>({
    initialized: false,
    clients: [],
    projects: [],
    deployments: [],
    stats: {
      totalClients: 0,
      activeProjects: 0,
      totalDeployments: 0,
      walletBalance: '0.00 ETH'
    },
    loading: true
  });

  // Add a focus/visibility event handler to refresh data
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && state.initialized && active && account) {
        console.log('Window became visible, refreshing data...');
        // Only update the wallet balance without showing loading state
        updateWalletBalance(account);
      }
    };

    const handleFocus = () => {
      if (state.initialized && active && account) {
        console.log('Window focused, refreshing data...');
        // Only update the wallet balance without showing loading state
        updateWalletBalance(account);
      }
    };

    // Add event listeners for visibility and focus
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // Clean up event listeners
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [active, account, state.initialized]);

  // Improve initialization to fetch wallet balance immediately after login
  useEffect(() => {
    const fetchData = async () => {
      if (typeof window !== 'undefined' && (!state.initialized || (active && account && state.stats.walletBalance === 'Loading...'))) {
        try {
          // Only show loading state for initial data load, not wallet balance updates
          if (!state.initialized) {
            setState(prev => ({ 
              ...prev, 
              loading: true 
            }));
          }
          
          // Directly query Supabase for tokens table
          const { data: tokenData, error: tokenError } = await supabase
            .from('tokens')
            .select('*')
            .order('deployment_date', { ascending: false });
            
          if (tokenError) {
            console.error('Error fetching tokens:', tokenError);
          }
            
          // Get clients data - avoid complex joins that might fail
          const { data: clientsData, error: clientsError } = await supabase
            .from('clients')
            .select('*');
            
          if (clientsError) {
            console.error('Error fetching clients:', clientsError);
          }
          
          // Get projects data - avoid complex joins that might fail
          const { data: projectsData, error: projectsError } = await supabase
            .from('projects')
            .select('*');
            
          if (projectsError) {
            console.error('Error fetching projects:', projectsError);
          }
          
          // Transform data
          const transformedDeployments = tokenData ? transformDeployments(tokenData) : [];
          const clients = clientsData || [];
          const projects = projectsData || [];
          
          // First update state with the data
          setState(prevState => ({
            initialized: true,
            clients: transformClients(clients),
            projects: transformProjects(projects),
            deployments: transformedDeployments,
            stats: {
              totalClients: clients.length,
              activeProjects: projects.filter((p: any) => p.status !== 'complete').length,
              totalDeployments: transformedDeployments.length,
              // Keep existing wallet balance if updating
              walletBalance: state.initialized ? prevState.stats.walletBalance : (account ? 'Loading...' : 'Not connected')
            },
            loading: false
          }));
          
          // Then immediately fetch the wallet balance if we have an account
          if (account && active) {
            // Use multiple attempts to get the wallet balance
            const attemptBalanceUpdate = (attempts = 0) => {
              if (attempts >= 5) return; // Max 5 attempts
              
              updateWalletBalance(account)
                .then(balance => {
                  if (balance === 'Error loading') {
                    // If error, try again after delay
                    setTimeout(() => attemptBalanceUpdate(attempts + 1), 500);
                  }
                })
                .catch(() => {
                  // If error, try again after delay
                  setTimeout(() => attemptBalanceUpdate(attempts + 1), 500);
                });
            };
            
            // Start the attempts
            attemptBalanceUpdate();
          }
        } catch (error: unknown) {
          console.error('Error initializing admin dashboard:', 
            error instanceof Error ? error.message : error);
          setState(prev => ({
            ...prev,
            initialized: true,
            loading: false
          }));
        }
      }
    };
    
    fetchData();
  }, [account, active, state.initialized, state.stats.walletBalance]);
  
  // Modify refreshData to preserve the wallet balance during refresh
  const refreshData = async () => {
    if (typeof window !== 'undefined') {
      // Keep the current wallet balance during loading to prevent flickering
      setState(prev => ({ 
        ...prev, 
        loading: true,
        // Don't reset wallet balance to 'Loading...' here
      }));
      
      try {
        // Directly query Supabase for tokens table
        const { data: tokenData, error: tokenError } = await supabase
          .from('tokens')
          .select('*')
          .order('deployment_date', { ascending: false });
          
        if (tokenError) {
          console.error('Error fetching tokens:', tokenError);
        }
        
        // Get clients data directly
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select('*');
            
        if (clientsError) {
          console.error('Error fetching clients:', clientsError);
        }
        
        // Get projects data directly
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*');
            
        if (projectsError) {
          console.error('Error fetching projects:', projectsError);
        }
        
        const clients = clientsData || [];
        const projects = projectsData || [];
        const transformedDeployments = tokenData ? transformDeployments(tokenData) : [];
        
        // Update state but preserve the existing wallet balance
        setState(prevState => ({
          ...prevState,
          clients: transformClients(clients),
          projects: transformProjects(projects),
          deployments: transformedDeployments,
          stats: {
            ...prevState.stats, // Keep existing stats including wallet balance
            totalClients: clients.length,
            activeProjects: projects.filter((p: any) => p.status !== 'complete').length,
            totalDeployments: transformedDeployments.length,
          },
          loading: false
        }));

        // After updating the state with new data, refresh the wallet balance separately
        // This ensures we don't lose the balance during data refresh
        if (account && active) {
          updateWalletBalance(account);
        }
      } catch (error: unknown) {
        console.error('Error refreshing dashboard data:', 
          error instanceof Error ? error.message : error);
        setState(prev => ({ ...prev, loading: false }));
      }
    }
  };
  
  // Modify the updateWalletBalance function for better reliability
  const updateWalletBalance = async (walletAddress: string) => {
    console.log('Updating wallet balance for:', walletAddress);
    try {
      let balance;
      let provider;
      
      // First check if window.ethereum exists
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          // First try direct BrowserProvider
          provider = new ethers.BrowserProvider(window.ethereum as any);
          balance = await provider.getBalance(walletAddress);
        } catch (browserError) {
          console.warn('BrowserProvider failed, trying fallback:', browserError);
          
          try {
            // Fallback to basic JSON-RPC provider
            const networkId = await window.ethereum.request({ method: 'eth_chainId' });
            const networkMap: Record<string, string> = {
              '0x1': 'https://eth-mainnet.g.alchemy.com/v2/demo',
              '0xaa36a7': 'https://eth-sepolia.g.alchemy.com/v2/demo',
              '0x5': 'https://eth-goerli.g.alchemy.com/v2/demo',
              '0x89': 'https://polygon-mainnet.g.alchemy.com/v2/demo',
              '0x13881': 'https://polygon-mumbai.g.alchemy.com/v2/demo'
            };
            
            const rpcUrl = networkMap[networkId] || 'https://eth-mainnet.g.alchemy.com/v2/demo';
            provider = new ethers.JsonRpcProvider(rpcUrl);
            balance = await provider.getBalance(walletAddress);
          } catch (e) {
            console.error('Failed to get network ID:', e);
            // Last resort - use a hard-coded RPC URL
            provider = new ethers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/demo');
            balance = await provider.getBalance(walletAddress);
          }
        }
      } else {
        // If no window.ethereum, use a public RPC
        provider = new ethers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/demo');
        balance = await provider.getBalance(walletAddress);
      }
      
      const formattedBalance = `${parseFloat(ethers.formatEther(balance)).toFixed(4)} ETH`;
      console.log('Successfully got balance:', formattedBalance);
      
      // Use a functional state update to ensure we're working with the latest state
      setState(prevState => ({
        ...prevState,
        stats: {
          ...prevState.stats,
          walletBalance: formattedBalance
        }
      }));

      // Force a re-render by triggering a small state change
      setTimeout(() => {
        setState(prev => ({ ...prev }));
      }, 100);

      return formattedBalance;
    } catch (error: unknown) {
      console.error('Error fetching wallet balance:', 
        error instanceof Error ? error.message : error);
      
      // Only update if we don't already have a balance value (avoid overwriting a good value with an error)
      setState(prevState => {
        // Don't overwrite a valid balance with "Error loading"
        if (prevState.stats.walletBalance && 
            prevState.stats.walletBalance !== 'Loading...' && 
            prevState.stats.walletBalance !== 'Not connected') {
          return prevState;
        }
        
        return {
          ...prevState,
          stats: {
            ...prevState.stats,
            walletBalance: 'Error loading'
          }
        };
      });
      
      return 'Error loading';
    }
  };
  
  // Return state and helper functions
  return {
    ...state,
    isConnected: active,
    address: account,
    refreshData
  };
} 