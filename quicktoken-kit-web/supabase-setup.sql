-- Drop tables if they exist (useful for setup/reset)
DROP TABLE IF EXISTS deployments;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS clients;
DROP TABLE IF EXISTS admin_wallets;

-- Create admin_wallets table
CREATE TABLE admin_wallets (
  address TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE
);

-- Create clients table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  project_count INTEGER DEFAULT 0
);

-- Create projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deployment_count INTEGER DEFAULT 0
);

-- Create deployments table
CREATE TABLE deployments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  network TEXT NOT NULL,
  contract_address TEXT NOT NULL,
  token_name TEXT NOT NULL,
  token_symbol TEXT NOT NULL,
  deployment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deployer_address TEXT NOT NULL,
  transaction_hash TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  explorer_url TEXT,
  metadata JSONB
);

-- Add indexes for performance
CREATE INDEX clients_name_idx ON clients(name);
CREATE INDEX projects_client_id_idx ON projects(client_id);
CREATE INDEX deployments_project_id_idx ON deployments(project_id);
CREATE INDEX deployments_contract_address_idx ON deployments(contract_address);
CREATE INDEX admin_wallets_address_idx ON admin_wallets(address);

-- Add initial test data (optional)
INSERT INTO clients (name, email) VALUES
  ('Demo Client', 'demo@example.com'),
  ('Test Organization', 'test@example.org');

INSERT INTO projects (client_id, name, description) VALUES
  ((SELECT id FROM clients WHERE name = 'Demo Client'), 'Demo Project', 'A demonstration project'),
  ((SELECT id FROM clients WHERE name = 'Test Organization'), 'Test Token', 'Testing token deployment');

-- Add initial admin wallet (replace with your wallet address)
INSERT INTO admin_wallets (address, label) VALUES
  ('0x0000000000000000000000000000000000000000', 'Default Admin Wallet');

-- Create a function to update project_count in clients table
CREATE OR REPLACE FUNCTION update_client_project_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE clients SET project_count = project_count + 1 WHERE id = NEW.client_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE clients SET project_count = project_count - 1 WHERE id = OLD.client_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create a function to update deployment_count in projects table
CREATE OR REPLACE FUNCTION update_project_deployment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE projects SET deployment_count = deployment_count + 1 WHERE id = NEW.project_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE projects SET deployment_count = deployment_count - 1 WHERE id = OLD.project_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for the count update functions
CREATE TRIGGER update_client_project_count_trigger
AFTER INSERT OR DELETE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_client_project_count();

CREATE TRIGGER update_project_deployment_count_trigger
AFTER INSERT OR DELETE ON deployments
FOR EACH ROW
EXECUTE FUNCTION update_project_deployment_count(); 