const setPick = function (id) {
  try {document.getElementById(id).classList.add("pick")}
  catch {
    if (id === "daysOff") {
      document.querySelectorAll(".daysOff").forEach(item => item.classList.add("pick"))
    }
  }
}

const unsetPick = function (id) {
  try {document.getElementById(id).classList.remove("pick")}
  catch {
    if (id === "daysOff") {
      document.querySelectorAll(".daysOff").forEach(item => item.classList.remove("pick"))
    }
  }
}

const changePick = function (id) {
  try {document.getElementById(id).classList.toggle("pick")} catch {}
}


function pick(action, elements) {
  if (action === "set") action = setPick
  else if (action === "unset" && !!elements) action = unsetPick
  else if (action === "unset" && !elements) {
    document.querySelectorAll(".pick").forEach(item => item.classList.remove("pick"))
    return
  }
  else if (action === "change") action = changePick
  else return

  if (Array.isArray(elements)) {
    elements.forEach(id => action(id))
  }
  else action(elements)
}

export default pick