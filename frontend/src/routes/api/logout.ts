import { users } from "$lib/services/users";
import * as cookie from "cookie";

/**  @type {import('@sveltejs/kit').RequestHandler}*/
export async function post({ headers }) {
  const userCookies = headers.cookie || "";

  if (!userCookies.session_id)
    return {
      status: 406,
      body: { message: "cookie necessary to perform logout" },
    };

  users.delCookie(userCookies.session_id);

  return {
    status: 303,
    "Set-Cookie": [
      cookie.serialize("session_id", "", {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
        path: "/",
      }),
    ],
    Location: "/auth/login",
  };
}
