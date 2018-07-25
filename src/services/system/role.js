import request from "../../utils/request";

export async function getRoleList() {
  return request("v1/role");
}

export async function changeRoleStatus(params, payload) {
  return request("v1/roleStatus", {
    method: "PUT",
    params: params,
    body: payload
  });
}

export async function addRole(payload) {
  return request("v1/role", {
    method: "POST",
    body: payload
  });
}
