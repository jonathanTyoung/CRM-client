"use server";

import { redirect } from "next/navigation";
import { loginAction } from "./actions";

export async function handleLogin(formData: FormData) {
  const result = await loginAction(formData);

  if (result?.error) {
    return result;
  }

  redirect("/dashboard"); // server-side redirect AFTER cookies are written
}
