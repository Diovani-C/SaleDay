import * as cookie from "cookie";
import { users } from "$lib/services/users";

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ request, resolve }) {
  try {
    const cookies = cookie.parse(request.headers.cookie || "");

    const username = users.findCookie(cookies.session_id);

    request.locals.authenticated = username != undefined;

    if (request.locals.authenticated) request.locals.username = username;

    const response = await resolve(request);

    return response;
  } catch (err) {
    console.error(err);
  }
}

/** @type {import('@sveltejs/kit').GetSession} */
export function getSession(request) {
  if (!request.locals?.authenticated)
    return { authenticated: request.locals?.authenticated };

  return {
    authenticated: request.locals?.authenticated,
    username: request.locals?.username,
  };
}
