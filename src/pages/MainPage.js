import {Redirect} from "react-router-dom";
import {useUsername} from "../stores/storeHooks";

export default function MainPage() {
  const username = useUsername()
  if (username) return <Redirect to={`@${username}/`}/>
  else return <Redirect to={`/search/`}/>
}
