import { supabase } from "src/service/client";
import { createFolder } from "./storageService";
import { updateTable } from "./tableService";

export async function signUp(
  email: string,
  password: string,
  username: string
) {
  try {
  } catch (error) {}
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
  });
  alert("회원가입이 완료되었어요");

  await updateTable({
    tableName: "user",
    eqKey: "id",
    eqValue: data.user!.id,
    update: { username },
  });

  await createFolder({ bucketName: "image", path: data.user!.id });

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

export const getUserTable = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("user")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user data:", error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
};
