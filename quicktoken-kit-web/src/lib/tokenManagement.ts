import { supabase, snakeToCamel, camelToSnake } from './supabase';

// Token interface matching our Supabase schema
export interface Token {
  id: string;
  contractAddress: string;
  name: string;
  symbol: string;
  supply: number;
  mintFee: number;
  lockDuration: number;
  clientId?: string;
  projectId?: string;
  deployedBy: string;
  network: string;
  deploymentTx?: string;
  deploymentDate: string;
  verified?: boolean;
}

// Extended token detail interface with additional metrics
export interface TokenDetail extends Token {
  clientName?: string;
  clientEmail?: string;
  clientCompany?: string;
  projectName?: string;
  holders?: number;
  transactions?: number;
  lastActivityDate?: string;
}

// Get all tokens
export async function getTokens(): Promise<Token[]> {
  try {
    // Query tokens table directly
    const { data, error } = await supabase
      .from('tokens')
      .select('*')
      .order('deployment_date', { ascending: false });
    
    if (error) throw error;
    
    // Transform the data into our token format
    const tokens = data ? data.map((item) => {
      const transformedItem = snakeToCamel(item);
      
      // Map directly to our Token interface from tokens table
      const token: Token = {
        id: transformedItem.id,
        contractAddress: transformedItem.contractAddress || '',
        name: transformedItem.name || '',
        symbol: transformedItem.symbol || '',
        supply: transformedItem.supply || 0,
        mintFee: transformedItem.mintFee || 0,
        lockDuration: transformedItem.lockDuration || 0,
        clientId: transformedItem.clientId || null,
        deployedBy: transformedItem.deployedBy || '',
        network: transformedItem.network || 'unknown',
        deploymentTx: transformedItem.deploymentTx || '',
        deploymentDate: transformedItem.deploymentDate || new Date().toISOString(),
        verified: false
      };
      
      return token;
    }) : [];
    
    return tokens;
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return [];
  }
}

// Get token by ID with extended details
export async function getTokenById(id: string): Promise<TokenDetail | null> {
  try {
    // Query tokens table directly instead of deployments
    const { data, error } = await supabase
      .from('tokens')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!data) return null;
    
    // Transform data to our TokenDetail format
    const transformedData = snakeToCamel(data);
    
    // Create the token detail object from the direct tokens table data
    const tokenDetail: TokenDetail = {
      id: transformedData.id,
      contractAddress: transformedData.contractAddress || '',
      name: transformedData.name || '',
      symbol: transformedData.symbol || '',
      supply: transformedData.supply || 0,
      mintFee: transformedData.mintFee || 0,
      lockDuration: transformedData.lockDuration || 0,
      clientId: transformedData.clientId || null,
      deployedBy: transformedData.deployedBy || '',
      network: transformedData.network || 'unknown',
      deploymentTx: transformedData.deploymentTx || '',
      deploymentDate: transformedData.deploymentDate || new Date().toISOString(),
      verified: false,
      
      // Fallback values for blockchain metrics
      holders: 0,
      transactions: 0,
      lastActivityDate: transformedData.deploymentDate || new Date().toISOString(),
    };
    
    // If there's a client ID, fetch client information separately
    if (transformedData.clientId) {
      try {
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('id', transformedData.clientId)
          .single();
        
        if (!clientError && clientData) {
          const client = snakeToCamel(clientData);
          tokenDetail.clientName = client.name;
          tokenDetail.clientEmail = client.email;
          tokenDetail.clientCompany = client.company;
        }
      } catch (clientError) {
        console.error('Error fetching client data:', clientError);
      }
    }
    
    return tokenDetail;
  } catch (error) {
    console.error(`Error fetching token with ID ${id}:`, error);
    return null;
  }
}

// Add a new token deployment
export async function addTokenDeployment(
  tokenData: {
    contractAddress: string;
    name: string;
    symbol: string;
    supply: number;
    mintFee: number;
    lockDuration: number;
    network: string;
    deployerAddress: string;
    transactionHash: string;
    projectId?: string;
    clientId?: string;
  }
): Promise<Token | null> {
  try {
    // Prepare the data for insertion into tokens table
    const deploymentData = {
      contract_address: tokenData.contractAddress,
      name: tokenData.name,
      symbol: tokenData.symbol,
      supply: tokenData.supply,
      mint_fee: tokenData.mintFee,
      lock_duration: tokenData.lockDuration,
      network: tokenData.network,
      deployed_by: tokenData.deployerAddress,
      deployment_tx: tokenData.transactionHash,
      client_id: tokenData.clientId || null,
      deployment_date: new Date().toISOString()
    };
    
    // Insert into the tokens table
    const { data, error } = await supabase
      .from('tokens')
      .insert([deploymentData])
      .select()
      .single();
    
    if (error) throw error;
    
    // Transform and return the result
    if (data) {
      const transformedData = snakeToCamel(data);
      
      const token: Token = {
        id: transformedData.id,
        contractAddress: transformedData.contractAddress,
        name: transformedData.name,
        symbol: transformedData.symbol,
        supply: transformedData.supply,
        mintFee: transformedData.mintFee,
        lockDuration: transformedData.lockDuration,
        clientId: transformedData.clientId,
        deployedBy: transformedData.deployedBy,
        network: transformedData.network,
        deploymentTx: transformedData.deploymentTx,
        deploymentDate: transformedData.deploymentDate,
        verified: false
      };
      
      return token;
    }
    
    return null;
  } catch (error) {
    console.error('Error adding token deployment:', error);
    return null;
  }
}

// Update token details
export async function updateTokenDeployment(
  id: string, 
  updates: Partial<Token>
): Promise<Token | null> {
  try {
    // Transform the updates to match the database schema
    const dbUpdates: any = {};
    
    // Map the Token fields to database fields
    if (updates.verified !== undefined) {
      dbUpdates.verified = updates.verified;
    }
    
    if (updates.clientId !== undefined) {
      dbUpdates.client_id = updates.clientId;
    }
    
    if (updates.supply !== undefined) {
      dbUpdates.supply = updates.supply;
    }
    
    if (updates.mintFee !== undefined) {
      dbUpdates.mint_fee = updates.mintFee;
    }
    
    if (updates.lockDuration !== undefined) {
      dbUpdates.lock_duration = updates.lockDuration;
    }
    
    if (updates.deploymentTx !== undefined) {
      dbUpdates.deployment_tx = updates.deploymentTx;
    }
    
    // Perform the update on tokens table
    const { data, error } = await supabase
      .from('tokens')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Transform and return the result
    if (data) {
      const transformedData = snakeToCamel(data);
      
      const token: Token = {
        id: transformedData.id,
        contractAddress: transformedData.contractAddress,
        name: transformedData.name,
        symbol: transformedData.symbol,
        supply: transformedData.supply,
        mintFee: transformedData.mintFee,
        lockDuration: transformedData.lockDuration,
        clientId: transformedData.clientId,
        deployedBy: transformedData.deployedBy,
        network: transformedData.network,
        deploymentTx: transformedData.deploymentTx,
        deploymentDate: transformedData.deploymentDate,
        verified: transformedData.verified || false
      };
      
      return token;
    }
    
    return null;
  } catch (error) {
    console.error(`Error updating token deployment ${id}:`, error);
    return null;
  }
}

// Delete a token deployment
export async function deleteTokenDeployment(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('tokens')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting token deployment ${id}:`, error);
    return false;
  }
}

// Helper to get explorer URL based on network
export function getExplorerUrl(
  network: string, 
  address: string, 
  type: 'address' | 'tx' = 'address'
): string {
  const explorers: Record<string, string> = {
    'ethereum': `https://etherscan.io/${type === 'address' ? 'token' : 'tx'}/`,
    'goerli': `https://goerli.etherscan.io/${type === 'address' ? 'token' : 'tx'}/`,
    'sepolia': `https://sepolia.etherscan.io/${type === 'address' ? 'token' : 'tx'}/`,
    'polygon': `https://polygonscan.com/${type === 'address' ? 'token' : 'tx'}/`,
    'mumbai': `https://mumbai.polygonscan.com/${type === 'address' ? 'token' : 'tx'}/`,
    'arbitrum': `https://arbiscan.io/${type === 'address' ? 'token' : 'tx'}/`,
    'optimism': `https://optimistic.etherscan.io/${type === 'address' ? 'token' : 'tx'}/`,
  };
  
  return `${explorers[network.toLowerCase()] || explorers['ethereum']}${address}`;
}

// Helper to get network badge styling
export function getNetworkBadgeClass(network: string): string {
  const badges: Record<string, string> = {
    'ethereum': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'goerli': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    'sepolia': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'polygon': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    'mumbai': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
    'arbitrum': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    'optimism': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };
  
  return badges[network.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
} 