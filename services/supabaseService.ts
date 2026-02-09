import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials!');
  console.error('SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✓ Set' : '✗ Missing');
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
}

console.log('Supabase URL:', supabaseUrl);
console.log('Service Key:', supabaseKey.substring(0, 20) + '...');

export const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection
console.log("Checking Supabase connection...");
supabase.from('chat_logs').select('count', { count: 'exact', head: true })
  .then(({ error, count }) => {
    if (error) {
      console.error(' Supabase Connection Failed:', error.message);
    } else {
      console.log('Supabase Connection: ACTIVE');
      console.log(`Current logs in database: ${count || 0}`);
    }
  });

export const logToSupabase = async (message: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from('chat_logs')
      .insert([{ message, status, created_at: new Date().toISOString() }])
      .select();

    if (error) throw error;
    console.log('Logged to Supabase:', data);
    return data;
  } catch (err: any) {
    console.error('Supabase Error:', err.message);
    throw err;
  }
};  
