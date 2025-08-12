"use server";

import { createServerSupabaseClient } from "@/utils/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

const generatePassword = (length: number): string => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

export async function createNewAccount(formData: {
  menu: string;
  submenu: string;
  email: string;
}) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "User not signed in" };
    }

    const password = generatePassword(12);

    // create user in clerk
    const clerk = await clerkClient();
    const user = await clerk.users.createUser({
      emailAddress: [formData.email],
      password: password,
      publicMetadata: {
        role: "user", // assign "user" role to new account
      },
    });

    // create profiles in supabase
    const supabase = createServerSupabaseClient();
    const { error: profileError } = await supabase.from("profiles").insert({
      clerk_id: user.id, // use clerk user ID as primary id
      email: formData.email,
    });

    if (profileError) {
      // delete the Clerk user if profile creation fails
      await clerk.users.deleteUser(user.id);
      return { success: false, error: profileError.message };
    }

    // create submenu record in Supabase
    const { error: submenuError } = await supabase.from("submenu").insert({
      title: formData.submenu,
      menu_id: formData.menu,
      user_id: user.id,
    });

    if (submenuError) {
      // delete profile and Clerk user if submenu creation fails
      await supabase.from("profiles").delete().eq("clerk_id", user.id);
      await clerk.users.deleteUser(user.id);

      if (submenuError?.code === "23505") {
        return { success: false, error: "Submenu already exists in this menu" };
      }
      return { success: false, error: submenuError.message };
    }

    // send account details on email
    try {
      const { error } = await supabase.functions.invoke(
        "send-account-details-email",
        {
          body: {
            email: formData.email,
            password: password,
            submenu: formData.submenu,
          },
        }
      );

      if (error) {
        console.error("Failed to send welcome email:", error);
        console.log('errr', error)
        // don't fail the account creation if email fails
      }
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      console.log('error', emailError)
      // don't fail the account creation if email fails
    }

    return {
      success: true,
      password,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // extract error message
    if (error.errors) {
      return { success: false, error: error.errors[0]?.message };
    }
    return { success: false, error: error.message };
  }
}
