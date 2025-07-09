// Supabase Configuration Template
// Copy this file to supabase-config.js and add your actual credentials

const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database table name
const TABLE_NAME = "abayas";

// Export for use in other files
window.supabase = supabase;
window.TABLE_NAME = TABLE_NAME;
