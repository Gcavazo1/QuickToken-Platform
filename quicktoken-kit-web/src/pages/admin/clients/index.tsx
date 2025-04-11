import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useWeb3React } from '@web3-react/core';
import Link from 'next/link';
import AdminLayout from '../../../components/admin/AdminLayout';
import { useAdminDashboard } from '../../../hooks/useAdminDashboard';

// Client interface
interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  projectCount: number;
  deploymentsCount: number;
  lastActive: string;
  status: 'active' | 'inactive' | 'pending';
}

export default function ClientsPage() {
  const { active } = useWeb3React();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    company: '',
  });
  
  // Use Admin Dashboard hook to get real client data
  const { 
    clients: supabaseClients, 
    loading,
    refreshData 
  } = useAdminDashboard();
  
  // Transform Supabase client data to match our Client interface
  const clients: Client[] = supabaseClients.map(client => ({
    id: client.id,
    name: client.name,
    email: client.email,
    company: client.company || '',
    projectCount: client.project_count || 0,
    deploymentsCount: client.deployments_count || 0,
    lastActive: client.last_active || new Date().toISOString(),
    status: client.status || 'active'
  }));

  // Auth check - redirect if not connected
  useEffect(() => {
    if (!active && typeof window !== 'undefined') {
      router.push('/admin');
    }
  }, [active, router]);

  // Handle search and filtering
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || 
      client.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Handle new client form change
  const handleNewClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClient({
      ...newClient,
      [name]: value
    });
  };

  // Add new client
  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Add client to Supabase (would be implemented in the supabase.ts file)
      // Instead of mocking, we'd call an API
      /*
      const newClientData = await addClient({
        name: newClient.name,
        email: newClient.email,
        company: newClient.company
      });
      */
      
      // For now, just close the modal and refresh data
      setShowNewClientModal(false);
      setNewClient({ name: '', email: '', company: '' });
      refreshData(); // Refresh data from Supabase
    } catch (error) {
      console.error('Error adding client:', error);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="animate-pulse text-light-cyan">Loading client data...</div>
      </div>
    );
  }

  if (!active) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="animate-pulse text-light-cyan">Checking authorization...</div>
      </div>
    );
  }

  return (
    <AdminLayout title="Client Management">
      <Head>
        <title>Client Management | QuickToken Admin</title>
        <meta name="description" content="Manage your clients" />
      </Head>
      
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-light-cyan mb-2">Client Management</h1>
            <p className="text-gray-400">
              Manage your clients and their token deployment projects.
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={refreshData}
              className="btn-secondary flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Refresh
            </button>
            
            <button 
              onClick={() => setShowNewClientModal(true)}
              className="btn-primary flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add New Client
            </button>
          </div>
        </div>
        
        {/* Filters and Search */}
        <div className="bg-space-navy rounded-lg p-4 mb-6 shadow-lg border border-deep-blue">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="p-3 pl-10 w-full rounded-md bg-dark-slate border border-deep-blue text-white focus:outline-none focus:ring-2 focus:ring-teal"
                  placeholder="Search by name, email, or company..."
                />
              </div>
            </div>
            
            <div className="w-full md:w-56">
              <label htmlFor="status" className="sr-only">Status</label>
              <select
                id="status"
                name="status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="p-3 w-full rounded-md bg-dark-slate border border-deep-blue text-white focus:outline-none focus:ring-2 focus:ring-teal"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Clients Table */}
        <div className="bg-space-navy rounded-lg overflow-hidden shadow-lg border border-deep-blue">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-deep-blue">
              <thead className="bg-deep-blue/60">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-teal uppercase tracking-wider">
                    Client Info
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-teal uppercase tracking-wider">
                    Projects
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-teal uppercase tracking-wider">
                    Deployments
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-teal uppercase tracking-wider">
                    Last Active
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-teal uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-teal uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-deep-blue">
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-deep-blue/30">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-lg font-medium text-light-cyan">{client.name}</div>
                        </div>
                        <div className="text-sm text-gray-400">{client.email}</div>
                        <div className="text-sm text-gray-400">{client.company}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{client.projectCount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{client.deploymentsCount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{formatDate(client.lastActive)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium 
                          ${client.status === 'active' ? 'bg-green-700/20 text-green-400' : ''}
                          ${client.status === 'inactive' ? 'bg-red-800/20 text-red-400' : ''}
                          ${client.status === 'pending' ? 'bg-yellow-700/20 text-yellow-400' : ''}
                        `}>
                          {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <Link 
                            href={`/admin/clients/${client.id}`}
                            className="text-teal hover:text-light-cyan"
                          >
                            View
                          </Link>
                          <button className="text-magenta hover:text-light-magenta">
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                      {searchTerm || filterStatus !== 'all' 
                        ? 'No clients found matching your search criteria.'
                        : 'No clients added yet. Add your first client to get started.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* New Client Modal */}
      {showNewClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-space-navy rounded-lg max-w-md w-full shadow-xl border border-deep-blue">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-light-cyan">Add New Client</h3>
                <button 
                  onClick={() => setShowNewClientModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleAddClient}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block mb-1 text-light-cyan">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={newClient.name}
                      onChange={handleNewClientChange}
                      className="w-full p-3 rounded bg-dark-slate border border-deep-blue text-white focus:outline-none focus:ring-2 focus:ring-teal"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block mb-1 text-light-cyan">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={newClient.email}
                      onChange={handleNewClientChange}
                      className="w-full p-3 rounded bg-dark-slate border border-deep-blue text-white focus:outline-none focus:ring-2 focus:ring-teal"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block mb-1 text-light-cyan">Company</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={newClient.company}
                      onChange={handleNewClientChange}
                      className="w-full p-3 rounded bg-dark-slate border border-deep-blue text-white focus:outline-none focus:ring-2 focus:ring-teal"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowNewClientModal(false)}
                    className="px-4 py-2 text-white bg-transparent border border-deep-blue hover:bg-deep-blue/30 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal text-white rounded hover:bg-light-cyan"
                  >
                    Add Client
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
} 