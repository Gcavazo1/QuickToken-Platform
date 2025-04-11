import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Types for admin wallet authentication
 */
export interface AdminWallet {
  address: string;
  label: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

// Get admin wallet address from environment variables
const ADMIN_WALLET_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_WALLET_ADDRESS || '';
const ADMIN_ADDRESSES = ADMIN_WALLET_ADDRESS ? 
  [ADMIN_WALLET_ADDRESS.toLowerCase()] : 
  [];

// Log on startup to debug (anonymized)
if (typeof window !== 'undefined') {
  if (ADMIN_ADDRESSES.length > 0) {
    console.log('Admin wallet configured:', 
      ADMIN_ADDRESSES.map(addr => `${addr.substring(0, 6)}...${addr.substring(38)}`));
  } else {
    console.warn('No admin wallet configured! Set NEXT_PUBLIC_ADMIN_WALLET_ADDRESS in environment variables.');
  }
}

/**
 * Checks if the provided wallet address is authorized as an admin
 * In a real application, this would check against a database or contract
 * 
 * @param address - Ethereum wallet address to check
 * @returns Promise<boolean> - Whether the address is authorized
 */
export async function isAuthorizedAdmin(address: string): Promise<boolean> {
  if (!address) return false;
  
  // Normalize the address for comparison
  const normalizedAddress = address.toLowerCase();
  
  // Debug log when checking authorization
  console.log('Checking authorization for wallet:', 
    `${normalizedAddress.substring(0, 6)}...${normalizedAddress.substring(38)}`);
  console.log('Against configured admin wallets:', 
    ADMIN_ADDRESSES.map(addr => `${addr.substring(0, 6)}...${addr.substring(38)}`));
  
  // Check if address is in the approved list
  const isAuthorized = ADMIN_ADDRESSES.includes(normalizedAddress);
  console.log('Authorization result:', isAuthorized ? 'Authorized' : 'Unauthorized');
  
  return isAuthorized;
}

/**
 * Logs the user out by clearing any stored authentication tokens
 * 
 * @returns Promise<void>
 */
export async function logoutAdmin(): Promise<void> {
  // In a real app, you might clear tokens from localStorage, cookies, etc.
  // This is a placeholder for now
  console.log('Admin logged out');
  
  // If you're using localStorage for any auth data:
  localStorage.removeItem('quicktoken-admin-auth');
}

/**
 * Register a new admin wallet
 * Only callable by existing admins
 * 
 * @param address Ethereum address to add as admin
 * @param label Optional label for the admin
 * @returns Promise<boolean> Success status
 */
export async function registerAdminWallet(
  address: string, 
  label: string = 'Admin User'
): Promise<boolean> {
  if (!address) return false;
  
  try {
    const normalizedAddress = address.toLowerCase();
    
    const { error } = await supabase
      .from('admin_wallets')
      .insert([
        { 
          address: normalizedAddress, 
          label, 
          is_active: true,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        }
      ]);
    
    if (error) {
      console.error('Error registering admin wallet:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in registerAdminWallet:', error);
    return false;
  }
}

/**
 * Deactivate an admin wallet
 * 
 * @param address Ethereum address to deactivate
 * @returns Promise<boolean> Success status
 */
export async function deactivateAdminWallet(address: string): Promise<boolean> {
  if (!address) return false;
  
  try {
    const normalizedAddress = address.toLowerCase();
    
    const { error } = await supabase
      .from('admin_wallets')
      .update({ is_active: false })
      .eq('address', normalizedAddress);
    
    if (error) {
      console.error('Error deactivating admin wallet:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deactivateAdminWallet:', error);
    return false;
  }
}

/**
 * Get all admin wallets
 * @returns Array of admin wallets
 */
export async function getAdminWallets(): Promise<AdminWallet[]> {
  try {
    const { data, error } = await supabase
      .from('admin_wallets')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    // Convert from snake_case to camelCase
    return data ? data.map(wallet => ({
      address: wallet.address,
      label: wallet.label,
      isActive: wallet.is_active,
      createdAt: wallet.created_at,
      lastLogin: wallet.last_login,
    })) : [];
  } catch (error) {
    console.error('Error fetching admin wallets:', error);
    return [];
  }
}

/**
 * Add a new admin wallet
 * @param wallet Admin wallet data
 * @returns True if successful
 */
export async function addAdminWallet(wallet: { address: string; label: string }): Promise<boolean> {
  try {
    // Normalize the address to lowercase
    const normalizedAddress = wallet.address.toLowerCase();
    
    const { error } = await supabase
      .from('admin_wallets')
      .insert([{
        address: normalizedAddress,
        label: wallet.label,
        is_active: true,
        created_at: new Date().toISOString()
      }]);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error adding admin wallet:', error);
    return false;
  }
}

/**
 * Update an admin wallet's status
 * @param address Wallet address to update
 * @param isActive New active status
 * @returns True if successful
 */
export async function updateAdminWalletStatus(address: string, isActive: boolean): Promise<boolean> {
  try {
    const normalizedAddress = address.toLowerCase();
    
    const { error } = await supabase
      .from('admin_wallets')
      .update({ is_active: isActive })
      .eq('address', normalizedAddress);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating admin wallet status:', error);
    return false;
  }
}

/**
 * Remove an admin wallet
 * @param address Wallet address to remove
 * @returns True if successful
 */
export async function removeAdminWallet(address: string): Promise<boolean> {
  try {
    const normalizedAddress = address.toLowerCase();
    
    const { error } = await supabase
      .from('admin_wallets')
      .delete()
      .eq('address', normalizedAddress);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing admin wallet:', error);
    return false;
  }
} 