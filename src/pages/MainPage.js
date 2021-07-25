import {Redirect} from "react-router-dom";

export default function MainPage() {
  if (localStorage.User) return <Redirect to={`@${localStorage.User}/`}/>
  else return <Redirect to={`/search/`}/>
}
