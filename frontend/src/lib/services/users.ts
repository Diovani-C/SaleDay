import { LocalStorage } from "node-localstorage";

const localStorage = new LocalStorage("./database");

type User = {
  username: string;
  password: string;
};

type Cookie = {
  cookieId: string;
  username: string;
};

function createAuth() {
  return {
    addUser: (user: User) => {
      localStorage.setItem(user.username.toLowerCase(), user.password);
    },
    getPassword: (username: User["username"]) => {
      return localStorage.getItem(username.toLowerCase());
    },
    editUser: (user: User) => {
      localStorage.setItem(user.username.toLowerCase(), user.password);
    },
    delUser: (username: User["username"]) => {
      localStorage.removeItem(username.toLowerCase());
    },
    setCookie: (cookie: Cookie) => {
      localStorage.setItem(cookie.cookieId, cookie.username.toLowerCase());
    },
    findCookie: (cookieId: Cookie["cookieId"]) => {
      return localStorage.getItem(cookieId);
    },
    delCookie: (cookieId: Cookie["cookieId"]) => {
      localStorage.removeItem(cookieId);
    },
  };
}

export const users = createAuth();
