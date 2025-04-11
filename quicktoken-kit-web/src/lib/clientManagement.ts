// Client interface
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

// Client project interface
export interface ClientProject {
  id: string;
  clientId: string;
  name: string;
  description: string;
  status: 'planning' | 'development' | 'deployed' | 'complete';
  createdAt: string;
  updatedAt: string;
  deployments: string[]; // Array of deployment IDs associated with this project
}

// Initial clients data for local storage
const initialClients: Client[] = [
  { 
    id: '1', 
    name: 'John Smith', 
    email: 'john@acmecorp.com',
    company: 'Acme Corporation',
    projectCount: 3,
    deploymentsCount: 7,
    lastActive: '2023-04-12T13:45:00Z',
    status: 'active',
    notes: 'Enterprise client with multiple token needs'
  },
  { 
    id: '2', 
    name: 'Sarah Jones', 
    email: 'sarah@globex.com',
    company: 'Globex Industries',
    projectCount: 1,
    deploymentsCount: 2,
    lastActive: '2023-04-10T09:20:00Z',
    status: 'active',
    notes: 'New client, starting with a basic token deployment'
  },
  { 
    id: '3', 
    name: 'Bruce Wayne', 
    email: 'bruce@wayne.com',
    company: 'Wayne Enterprises',
    projectCount: 2,
    deploymentsCount: 5,
    lastActive: '2023-04-05T16:30:00Z',
    status: 'inactive',
    notes: 'High-value client, on hold pending legal review'
  },
];

// Initial projects data for local storage
const initialProjects: ClientProject[] = [
  {
    id: '1',
    clientId: '1',
    name: 'Acme Rewards Token',
    description: 'Customer loyalty program token with redemption capabilities',
    status: 'deployed',
    createdAt: '2023-03-15T10:30:00Z',
    updatedAt: '2023-04-10T14:20:00Z',
    deployments: ['1', '2']
  },
  {
    id: '2',
    clientId: '1',
    name: 'Acme Governance',
    description: 'Governance token for community voting',
    status: 'development',
    createdAt: '2023-04-01T09:15:00Z',
    updatedAt: '2023-04-12T11:45:00Z',
    deployments: ['3']
  },
  {
    id: '3',
    clientId: '2',
    name: 'Globex Customer Token',
    description: 'Basic ERC-20 token for customer incentives',
    status: 'deployed',
    createdAt: '2023-03-22T13:40:00Z',
    updatedAt: '2023-04-05T10:30:00Z',
    deployments: ['4', '5']
  },
  {
    id: '4',
    clientId: '3',
    name: 'Wayne Enterprises Philanthropy',
    description: 'Token for tracking charitable giving and impact',
    status: 'planning',
    createdAt: '2023-04-02T15:20:00Z',
    updatedAt: '2023-04-02T15:20:00Z',
    deployments: []
  }
];

// Initialize local storage with default data if it doesn't exist
export const initializeClientData = (): void => {
  try {
    if (!localStorage.getItem('quicktoken_clients')) {
      localStorage.setItem('quicktoken_clients', JSON.stringify(initialClients));
    }
    
    if (!localStorage.getItem('quicktoken_projects')) {
      localStorage.setItem('quicktoken_projects', JSON.stringify(initialProjects));
    }
  } catch (error) {
    console.error('Error initializing client data:', error);
  }
};

// Get all clients
export const getClients = (): Client[] => {
  try {
    const data = localStorage.getItem('quicktoken_clients');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error retrieving clients:', error);
    return [];
  }
};

// Get client by ID
export const getClientById = (id: string): Client | null => {
  try {
    const clients = getClients();
    return clients.find(client => client.id === id) || null;
  } catch (error) {
    console.error(`Error retrieving client with ID ${id}:`, error);
    return null;
  }
};

// Add a new client
export const addClient = (client: Omit<Client, 'id' | 'projectCount' | 'deploymentsCount' | 'lastActive'>): Client => {
  try {
    const clients = getClients();
    
    // Generate a simple ID (in a real app, use UUID or similar)
    const newId = (clients.length + 1).toString();
    
    const newClient: Client = {
      id: newId,
      projectCount: 0,
      deploymentsCount: 0,
      lastActive: new Date().toISOString(),
      ...client
    };
    
    // Add to collection and save
    clients.push(newClient);
    localStorage.setItem('quicktoken_clients', JSON.stringify(clients));
    
    return newClient;
  } catch (error) {
    console.error('Error adding client:', error);
    throw new Error('Failed to add client');
  }
};

// Update a client
export const updateClient = (client: Client): Client => {
  try {
    const clients = getClients();
    const index = clients.findIndex(c => c.id === client.id);
    
    if (index === -1) {
      throw new Error(`Client with ID ${client.id} not found`);
    }
    
    // Update the client
    clients[index] = {
      ...clients[index],
      ...client,
      lastActive: new Date().toISOString()
    };
    
    // Save changes
    localStorage.setItem('quicktoken_clients', JSON.stringify(clients));
    
    return clients[index];
  } catch (error) {
    console.error('Error updating client:', error);
    throw new Error('Failed to update client');
  }
};

// Delete a client
export const deleteClient = (id: string): boolean => {
  try {
    const clients = getClients();
    const updatedClients = clients.filter(client => client.id !== id);
    
    if (updatedClients.length === clients.length) {
      throw new Error(`Client with ID ${id} not found`);
    }
    
    localStorage.setItem('quicktoken_clients', JSON.stringify(updatedClients));
    
    // Also delete related projects
    const projects = getProjects();
    const updatedProjects = projects.filter(project => project.clientId !== id);
    localStorage.setItem('quicktoken_projects', JSON.stringify(updatedProjects));
    
    return true;
  } catch (error) {
    console.error('Error deleting client:', error);
    return false;
  }
};

// Get all projects
export const getProjects = (): ClientProject[] => {
  try {
    const data = localStorage.getItem('quicktoken_projects');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error retrieving projects:', error);
    return [];
  }
};

// Get project by ID
export const getProjectById = (id: string): ClientProject | null => {
  try {
    const projects = getProjects();
    return projects.find(project => project.id === id) || null;
  } catch (error) {
    console.error(`Error retrieving project with ID ${id}:`, error);
    return null;
  }
};

// Get projects by client ID
export const getProjectsByClientId = (clientId: string): ClientProject[] => {
  try {
    const projects = getProjects();
    return projects.filter(project => project.clientId === clientId);
  } catch (error) {
    console.error(`Error retrieving projects for client ${clientId}:`, error);
    return [];
  }
};

// Add a new project
export const addProject = (project: Omit<ClientProject, 'id' | 'createdAt' | 'updatedAt'>): ClientProject => {
  try {
    const projects = getProjects();
    
    // Generate a simple ID
    const newId = (projects.length + 1).toString();
    
    const timestamp = new Date().toISOString();
    
    const newProject: ClientProject = {
      id: newId,
      createdAt: timestamp,
      updatedAt: timestamp,
      ...project
    };
    
    // Add to collection and save
    projects.push(newProject);
    localStorage.setItem('quicktoken_projects', JSON.stringify(projects));
    
    // Update client's project count
    updateClientProjectCount(project.clientId);
    
    return newProject;
  } catch (error) {
    console.error('Error adding project:', error);
    throw new Error('Failed to add project');
  }
};

// Update a project
export const updateProject = (project: ClientProject): ClientProject => {
  try {
    const projects = getProjects();
    const index = projects.findIndex(p => p.id === project.id);
    
    if (index === -1) {
      throw new Error(`Project with ID ${project.id} not found`);
    }
    
    // Update the project
    projects[index] = {
      ...projects[index],
      ...project,
      updatedAt: new Date().toISOString()
    };
    
    // Save changes
    localStorage.setItem('quicktoken_projects', JSON.stringify(projects));
    
    return projects[index];
  } catch (error) {
    console.error('Error updating project:', error);
    throw new Error('Failed to update project');
  }
};

// Delete a project
export const deleteProject = (id: string): boolean => {
  try {
    const projects = getProjects();
    const projectToDelete = projects.find(project => project.id === id);
    
    if (!projectToDelete) {
      throw new Error(`Project with ID ${id} not found`);
    }
    
    const clientId = projectToDelete.clientId;
    
    const updatedProjects = projects.filter(project => project.id !== id);
    localStorage.setItem('quicktoken_projects', JSON.stringify(updatedProjects));
    
    // Update client's project count
    updateClientProjectCount(clientId);
    
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    return false;
  }
};

// Helper to update a client's project and deployment counts
const updateClientProjectCount = (clientId: string): void => {
  try {
    const clients = getClients();
    const clientIndex = clients.findIndex(c => c.id === clientId);
    
    if (clientIndex === -1) return;
    
    // Count projects
    const projects = getProjects();
    const clientProjects = projects.filter(p => p.clientId === clientId);
    
    // Count deployments
    let deploymentCount = 0;
    clientProjects.forEach(project => {
      deploymentCount += project.deployments.length;
    });
    
    // Update client
    clients[clientIndex] = {
      ...clients[clientIndex],
      projectCount: clientProjects.length,
      deploymentsCount: deploymentCount,
      lastActive: new Date().toISOString()
    };
    
    // Save changes
    localStorage.setItem('quicktoken_clients', JSON.stringify(clients));
  } catch (error) {
    console.error(`Error updating project count for client ${clientId}:`, error);
  }
}; 