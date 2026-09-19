"use server";

import { cookies } from "next/headers";

export const getNewAccessToken = async () => {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    // throw new Error("User not logged in!");
    return {
      success: false,
      message: "User not logged in!",
    };
  }

  // console.log(refreshToken)
  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/auth/refresh-token`,
    {
                method: "POST",
      headers: {

        cookie: `accessToken=${refreshToken}`,
      },
      cache: "no-cache",
    },
  );
  const result = await res.json();
  console.log(result);

  return result;
};
