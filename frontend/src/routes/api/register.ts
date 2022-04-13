import * as cookie from "cookie";
import stringHash from "string-hash";
import { v4 as uuidv4 } from "uuid";
import { users } from "$lib/services/users";

/**  @type {import('@sveltejs/kit').RequestHandler}*/
export async function post({ body }) {
  const username = body.username;
  const password = body.password;

  const localPassword = users.getPassword(username);

  if (localPassword != undefined) {
    return {
      status: 409,
      body: { message: "user already exists" },
    };
  }

  const cookieId = uuidv4();

  users.addUser({
    username,
    password: stringHash(password).toString(),
  });

  users.setCookie({ username, cookieId });

  return {
    status: 200,
    headers: {
      "Set-Cookie": [
        cookie.serialize("session_id", cookieId, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 365,
          sameSite: "lax",
          path: "/",
        }),
      ],
    },
    body: { message: "success" },
  };
}
