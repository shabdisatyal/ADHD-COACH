
import { createClient } from '@supabase/supabase-js';
import { Signup } from './frontend/components/pages/signup';
import { Form } from 'react-router-dom';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);







