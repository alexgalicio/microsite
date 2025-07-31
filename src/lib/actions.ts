"use server";

import { createServerSupabaseClient } from "@/utils/server";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
// import { randomBytes } from "crypto";

export async function addNewMenu(title: string) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not signed in" };
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("menu")
    .insert({ title: title })
    .select();

  if (error) {
    if (error.code === "23505") {
      return { error: "Menu already exist" };
    }
    return { error: error.message };
  }

  return { data: data };
}

export async function editMenu(id: string, title: string) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not signed in" };
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("menu")
    .update({ title: title })
    .eq("id", id)
    .select();

  if (error) {
    if (error.code === "23505") {
      return { error: "Menu already exist" };
    }
    return { error: error.message };
  }

  return { data: data };
}

export async function editSubmenu(id: string, title: string, menu_id: string) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not signed in" };
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("submenu")
    .update({ title: title, menu_id: menu_id })
    .eq("id", id)
    .select();

  if (error) {
    if (error.code === "23505") {
      return { error: "Submenu already exist on the menu" };
    }
    return { error: error.message };
  }

  return { data: data };
}

export async function deleteMenu(id: string) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not signed in" };
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("menu")
    .delete()
    .eq("id", id)
    .select();

  if (error) return { error: error.message };

  return { data: data };
}

export async function deleteSubmenu(id: string) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not signed in" };
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("submenu")
    .delete()
    .eq("id", id)
    .select();

  if (error) return { error: error.message };

  return { data: data };
}

export async function getAllMenu() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from("menu").select("id, title");

  if (error) throw error; //TODO: properly handle error

  return data;
}

export async function getMenuTitle(menuId: string) {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("menu")
    .select("title")
    .eq("id", menuId)
    .single();

  if (error) return { error: error.message };

  return { data: data.title };
}

// auto generate password for new account
// function generatePassword(length = 12) {
//   return randomBytes(length).toString("base64").slice(0, length);
// }

export async function createUser(formData: {
  menu: string;
  submenu: string;
  email: string;
}) {
  try {
    // const password = generatePassword();
    const password = "m!cr0site";

    // create user in clerk
    const clerk = await clerkClient();
    const user = await clerk.users.createUser({
      emailAddress: [formData.email],
      password: password,
      publicMetadata: {
        role: "user", // assign user role to new account
      },
    });

    // create profiles in supabase
    const supabase = createServerSupabaseClient();
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .insert({
        clerk_id: user.id, // use clerk user ID
        email: formData.email,
      })
      .select()
      .single();

    if (profileError) {
      // delete the Clerk user if profile creation fails
      await clerk.users.deleteUser(user.id);
      return { success: false, error: profileError.message };
    }

    // create submenu record in Supabase
    const { data: submenu, error: submenuError } = await supabase
      .from("submenu")
      .insert({
        title: formData.submenu,
        menu_id: formData.menu,
        user_id: user.id,
      })
      .select()
      .single();

    if (submenuError) {
      // delete profile and Clerk user if submenu creation fails
      await supabase.from("profiles").delete().eq("clerk_id", user.id);
      await clerk.users.deleteUser(user.id);

      if (submenuError?.code === "23505") {
        return { success: false, error: "Submenu already exists in this menu" };
      }

      return { success: false, error: submenuError.message };
    }

    console.log("ceate account hit");
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

export async function createSite(title: string, subdomain: string) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not signed in" };
  }

  if (subdomain.toLocaleLowerCase() === "www") {
    return { error: "Not allowed to use www as subdomain" };
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("sites")
    .insert({
      title: title,
      subdomain: subdomain.toLowerCase(),
      user_id: userId,
    })
    .select();

  if (error) {
    if (error.code === "23505") {
      return { error: "Site already exist" };
    }
    return { error: error.message };
  }

  return { data: data };
}

export async function editSite(id: string, title: string, subdomain: string) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not signed in" };
  }

  if (subdomain.toLocaleLowerCase() === "www") {
    return { error: "Not allowed to use www as subdomain" };
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("sites")
    .update({
      title: title,
      subdomain: subdomain.toLowerCase(),
    })
    .eq("id", id)
    .select();

  if (error) {
    if (error.code === "23505") {
      return { error: "Site already exist" };
    }
    return { error: error.message };
  }

  return { data: data };
}

export async function getSiteBySubdomain(subdomain: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("sites")
    .select()
    .eq("subdomain", subdomain);

  if (error) return { error: error.message };

  return { data: data };
}

export async function getSiteById(id: string) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not signed in" };
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("sites")
    .select("*")
    .eq("user_id", id);

  if (error) return { error: error.message };

  return { data: data };
}

export async function getAllSite() {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not signed in" };
  }

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from("sites").select();

  if (error) return { error: error.message };

  return { data: data };
}
