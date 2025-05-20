import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kbqcqsabopvpacmlyjkw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImticWNxc2Fib3B2cGFjbWx5amt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczNTA0NDYsImV4cCI6MjA2MjkyNjQ0Nn0.DPTxsKzToKdY3HXsskUwEvQxZIC41UxuwQ8I3jPeWNw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);