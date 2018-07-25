// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  return localStorage.getItem("jade-dragon-F82DnQOk0VZc6x-secret") || "";
}

export function setAuthority(authority) {
  return localStorage.setItem("jade-dragon-F82DnQOk0VZc6x-secret", authority);
}
