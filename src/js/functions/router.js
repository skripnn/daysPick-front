export function toHomePage() {
  // window.location.href = "/admin/"
  document.querySelector("a.router-href").click()
}

export function toProjectPage(id) {
  let path = "/admin/project/"
  if (id) path += (id + "/")
  window.history.pushState({}, "", path)
}