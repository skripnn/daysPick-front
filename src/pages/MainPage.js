import {Redirect} from "react-router-dom";
import {useAccount} from "../stores/storeHooks";
import Fetch from "../js/Fetch";
import {useState} from "react";

export default function MainPage() {
  const [loading, setLoading] = useState(false)
  const {username} = useAccount()
  if (username && !loading) {
    setLoading(true)
    Fetch.autoLink(`/@${username}`, true)
  }
  if (username) return null
  return <Redirect from="/" to='/search'/>
}
