import supabase from "@services/supabase";

export const signIn = async (
  email: string,
  password: string,
  role: "admin" | "faculty",
) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  const { data: userFromTable, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();
  if (userError) throw userError;
  if (userFromTable.role !== role)
    throw new Error("You are not authorized to login as " + role);
  return data;
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};
