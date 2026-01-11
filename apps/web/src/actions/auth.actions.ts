"use server";

import { cookies } from "next/headers";

const BACKEND_URL = process.env.HTTP_BACKEND_URL!;

// --------------------------------------------> SIGN IN USER ACTION <--------------------------------------------

// nextjs managing cookies for us
// export async function signinUserAction(email: string, password: string) {
//   try {
//     const res = await fetch(`${BACKEND_URL}/api/v1/signin`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email, password }),
//       cache: "no-store",
//       credentials: "include",
//     });

//     if (!res.ok) {
//       return { success: false, error: "Invalid credentials" };
//     }

//     const data = await res.json();

//     const cookieStore = await cookies();

//     cookieStore.set("session", data.token, {
//       httpOnly: true,
//       sameSite: "lax",
//       secure: process.env.NODE_ENV === "production",
//       path: "/",
//       maxAge: 60 * 60 * 24 * 7,
//     });

//     return {
//       success: true,
//       user: data.user,
//     };
//   } catch (err) {
//     console.error("signinUserAction fetch error:", err);
//     return { success: false, error: "Internal server error" };
//   }
// }

// http backend managing cookies for us
export async function signinUserAction(email: string, password: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
      credentials: "include", // IMPORTANT: allow backend cookie to flow
    });

    if (!res.ok) {
      return { success: false, error: "Invalid credentials" };
    }

    // Backend already set cookie via Set-Cookie header
    const data = await res.json();

    return {
      success: true,
      user: data.user,
    };
  } catch (err) {
    console.error("signinUserAction fetch error:", err);
    return { success: false, error: "Internal server error" };
  }
}

// --------------------------------------------> LOGOUT USER ACTION <--------------------------------------------
export async function logoutUserAction() {
  try {
    const cookieStore = await cookies();

    cookieStore.set("session", "", {
      maxAge: 0,
      path: "/",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production" ? true : false,
    });

    return { success: true };
  } catch (error) {
    console.error("Error logging out user:", error);
    return { success: false, error: "Failed to logout user" };
  }
}
