import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wdtcsoowgqpuirazapvw.supabase.co';
const supabaseKey = 'sb_publishable_AeA-0PkGA339lCUNZE7f_g_g2MTGUkz';

export const supabase = createClient(supabaseUrl, supabaseKey);
