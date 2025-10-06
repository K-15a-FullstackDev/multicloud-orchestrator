CREATE TABLE IF NOT EXISTS providers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,             
  display_name TEXT NOT NULL,
  enc_credentials BYTEA NOT NULL,  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deployments (
  id SERIAL PRIMARY KEY,
  provider TEXT NOT NULL,         
  stack TEXT NOT NULL,            
  status TEXT NOT NULL,           
  tf_workspace TEXT,               
  last_log TEXT,
  outputs JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
