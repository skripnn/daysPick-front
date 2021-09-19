import {useUsername} from "../stores/storeHooks";
import Fetch from "../js/Fetch";

export default function MainPage() {
  const username = useUsername()
  if (username) Fetch.autoLink(`@${username}`, true)
  else return Fetch.link('search', undefined, true)
  return null
}
