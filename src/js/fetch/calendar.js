import {url, requestAuthHeaders} from "./core";


export async function getCalendar(dateStart, dateEnd, user, project) {
  let urlGet = url + "/calendar/?"
  urlGet += "&start=" + dateStart.format()
  urlGet += "&end=" + dateEnd.format()
  urlGet += "&user=" + user
  if (project) urlGet += "&project_id=" + project
  return fetch(urlGet, {headers: requestAuthHeaders()}).then(res => res.json())
}
