import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";

const { VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY } = import.meta.env;

const supabase = createClient<Database>(
  VITE_SUPABASE_URL,
  VITE_SUPABASE_PUBLISHABLE_KEY,
);

export default supabase;
