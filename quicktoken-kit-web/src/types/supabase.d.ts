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