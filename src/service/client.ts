import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_KEY as string;

// Supabase 클라이언트를 생성합니다.
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
