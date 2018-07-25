import request from "../../utils/request";

export async function login(params) {
  return request("/v1/login", {
    method: "POST",
    body: params
  });
}

export async function logout() {
  return request("v1/logout");
}

export async function common() {
  return request("/v1/common");
}

// export async function queryMenus(params) {
//   return request('/v1/menus');
// }
//
//
// export async function query() {
//   return request('/api/users');
// }
//
// export async function queryCurrent() {
//   return request('/api/currentUser');
// }
