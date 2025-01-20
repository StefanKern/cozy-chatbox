import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zhhwerawgqotupgkqefw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoaHdlcmF3Z3FvdHVwZ2txZWZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzMzk5ODcsImV4cCI6MjA1MTkxNTk4N30.XmonY6Shbofh9eRjKOUyXUnNtBgHbd9xw5YkEg_Srr4';

export const supabase = createClient(supabaseUrl, supabaseKey);