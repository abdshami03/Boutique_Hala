-- Create the abayas table
CREATE TABLE IF NOT EXISTS abayas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    sizes TEXT[] NOT NULL,
    colors TEXT[] NOT NULL,
    images TEXT[] NOT NULL,
    videos TEXT[] DEFAULT '{}',
    category TEXT NOT NULL,
    price TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE abayas ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for demo purposes)
-- In production, you should create more restrictive policies
CREATE POLICY "Allow all operations" ON abayas
    FOR ALL USING (true);

-- Create an index on category for better performance
CREATE INDEX IF NOT EXISTS idx_abayas_category ON abayas(category);

-- Create an index on created_at for ordering
CREATE INDEX IF NOT EXISTS idx_abayas_created_at ON abayas(created_at DESC);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_abayas_updated_at 
    BEFORE UPDATE ON abayas 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 