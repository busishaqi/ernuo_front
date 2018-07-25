import request from "../../utils/request";

//获取权限列表
export async function auth() {
  return request("/v1/auth");
}

//修改权限状态
export async function authStatus(params) {
  return request("v1/authStatus", {
    method: "PUT",
    params: params
  });
}

//修改权限
export async function updateAuth(params, payload) {
  return request("v1/auth", {
    method: "PUT",
    params: params,
    body: payload
  });
}

export async function addAuth(payload) {
  return request("v1/auth", {
    method: "POST",
    body: payload
  });
}
