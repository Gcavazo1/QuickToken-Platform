import { createClient } from '@supabase/supabase-js';
import { 
  Client, 
  ClientProject 
} from './clientManagement';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to convert snake_case to camelCase
export function snakeToCamel(obj: any): any {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel);
  }

  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    acc[camelKey] = snakeToCamel(obj[key]);
    return acc;
  }, {} as any);
}

// Helper function to convert camelCase to snake_case
export function camelToSnake(obj: any): any {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(camelToSnake);
  }

  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    acc[snakeKey] = camelToSnake(obj[key]);
    return acc;
  }, {} as any);
}

// Client Management Functions
export async function getClients(): Promise<Client[]> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('last_active', { ascending: false });
    
    if (error) throw error;
    return data ? snakeToCamel(data) : [];
  } catch (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
}

export async function getClientById(id: string): Promise<Client | null> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data ? snakeToCamel(data) : null;
  } catch (error) {
    console.error(`Error fetching client with ID ${id}:`, error);
    return null;
  }
}

export async function addClient(client: Omit<Client, 'id' | 'projectCount' | 'deploymentsCount' | 'lastActive'>): Promise<Client | null> {
  try {
    const snakeCaseClient = camelToSnake({
      ...client,
      project_count: 0,
      deployments_count: 0,
      last_active: new Date().toISOString()
    });
    
    const { data, error } = await supabase
      .from('clients')
      .insert([snakeCaseClient])
      .select()
      .single();
    
    if (error) throw error;
    return data ? snakeToCamel(data) : null;
  } catch (error) {
    console.error('Error adding client:', error);
    return null;
  }
}

export async function updateClient(client: Partial<Client> & { id: string }): Promise<Client | null> {
  try {
    const snakeCaseUpdates = camelToSnake({
      ...client,
      last_active: new Date().toISOString()
    });
    
    const { data, error } = await supabase
      .from('clients')
      .update(snakeCaseUpdates)
      .eq('id', client.id)
      .select()
      .single();
    
    if (error) throw error;
    return data ? snakeToCamel(data) : null;
  } catch (error) {
    console.error('Error updating client:', error);
    return null;
  }
}

export async function deleteClient(id: string): Promise<boolean> {
  try {
    // First, delete related projects
    const { error: projectsError } = await supabase
      .from('projects')
      .delete()
      .eq('client_id', id);
    
    if (projectsError) throw projectsError;
    
    // Then delete the client
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting client:', error);
    return false;
  }
}

// Project Management Functions
export async function getProjects(): Promise<ClientProject[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data ? snakeToCamel(data) : [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function getProjectById(id: string): Promise<ClientProject | null> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data ? snakeToCamel(data) : null;
  } catch (error) {
    console.error(`Error fetching project with ID ${id}:`, error);
    return null;
  }
}

export async function getProjectsByClientId(clientId: string): Promise<ClientProject[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('client_id', clientId)
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data ? snakeToCamel(data) : [];
  } catch (error) {
    console.error(`Error fetching projects for client ${clientId}:`, error);
    return [];
  }
}

export async function addProject(project: Omit<ClientProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<ClientProject | null> {
  try {
    const timestamp = new Date().toISOString();
    const snakeCaseProject = camelToSnake({
      ...project,
      created_at: timestamp,
      updated_at: timestamp
    });
    
    const { data, error } = await supabase
      .from('projects')
      .insert([snakeCaseProject])
      .select()
      .single();
    
    if (error) throw error;
    
    // Update client's project count
    await updateClientProjectCount(project.clientId);
    
    return data ? snakeToCamel(data) : null;
  } catch (error) {
    console.error('Error adding project:', error);
    return null;
  }
}

export async function updateProject(project: Partial<ClientProject> & { id: string }): Promise<ClientProject | null> {
  try {
    const snakeCaseUpdates = camelToSnake({
      ...project,
      updated_at: new Date().toISOString()
    });
    
    const { data, error } = await supabase
      .from('projects')
      .update(snakeCaseUpdates)
      .eq('id', project.id)
      .select()
      .single();
    
    if (error) throw error;
    
    // If the project has a clientId, update the client's project count
    if (project.clientId) {
      await updateClientProjectCount(project.clientId);
    }
    
    return data ? snakeToCamel(data) : null;
  } catch (error) {
    console.error('Error updating project:', error);
    return null;
  }
}

export async function deleteProject(id: string): Promise<boolean> {
  try {
    // First get the project to get the clientId
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('client_id')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Delete the project
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    // Update client's project count if clientId exists
    if (project?.client_id) {
      await updateClientProjectCount(project.client_id);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    return false;
  }
}

// Deployment Management Functions
export async function saveDeployment(deploymentData: any): Promise<boolean> {
  try {
    const snakeCaseDeployment = camelToSnake({
      ...deploymentData,
      created_at: new Date().toISOString()
    });
    
    const { error } = await supabase
      .from('deployments')
      .insert([snakeCaseDeployment]);
    
    if (error) throw error;
    
    // If the deployment is associated with a project, update project
    if (deploymentData.projectId) {
      // Get the project
      const { data: project } = await supabase
        .from('projects')
        .select('deployments, client_id')
        .eq('id', deploymentData.projectId)
        .single();
      
      if (project) {
        // Update project deployments array
        const deployments = [...(project.deployments || []), snakeCaseDeployment.id];
        
        await supabase
          .from('projects')
          .update({ deployments })
          .eq('id', deploymentData.projectId);
        
        // Update client deployment count
        if (project.client_id) {
          await updateClientDeploymentCount(project.client_id);
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error saving deployment:', error);
    return false;
  }
}

export async function getDeployments(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('deployments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data ? snakeToCamel(data) : [];
  } catch (error) {
    console.error('Error fetching deployments:', error);
    return [];
  }
}

// Helper functions
async function updateClientProjectCount(clientId: string): Promise<void> {
  try {
    // Count projects
    const { count: projectCount, error: countError } = await supabase
      .from('projects')
      .select('id', { count: 'exact', head: true })
      .eq('client_id', clientId);
    
    if (countError) throw countError;
    
    // Update client
    const { error } = await supabase
      .from('clients')
      .update({ 
        project_count: projectCount || 0,
        last_active: new Date().toISOString()
      })
      .eq('id', clientId);
    
    if (error) throw error;
  } catch (error) {
    console.error(`Error updating project count for client ${clientId}:`, error);
  }
}

async function updateClientDeploymentCount(clientId: string): Promise<void> {
  try {
    // Get all projects for this client
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('deployments')
      .eq('client_id', clientId);
    
    if (projectsError) throw projectsError;
    
    // Count all deployments
    let deploymentCount = 0;
    projects?.forEach(project => {
      deploymentCount += (project.deployments?.length || 0);
    });
    
    // Update client
    const { error } = await supabase
      .from('clients')
      .update({ 
        deployments_count: deploymentCount,
        last_active: new Date().toISOString()
      })
      .eq('id', clientId);
    
    if (error) throw error;
  } catch (error) {
    console.error(`Error updating deployment count for client ${clientId}:`, error);
  }
} 