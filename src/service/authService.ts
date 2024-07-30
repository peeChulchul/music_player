import { supabase } from "src/service/client";

export async function signUp(
  email: string,
  password: string,
  username: string
) {
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
  });
  alert("회원가입이 완료되었어요");

  await supabase.from("user").update({ username }).eq("id", data.user!.id);

  if (error) throw new Error(error.message);
}

export const signIn = async (email: string, password: string) => {
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw new Error(error.message);
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};

export const getSession = () => {
  const session = supabase.auth.getSession();
  return session;
};
