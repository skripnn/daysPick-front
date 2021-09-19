import {useEffect} from "react";
import Fetch from "../js/Fetch";
import {useLocation} from "react-router-dom";
import mainStore from "../stores/mainStore";
import Info from "../js/Info";

export default function EmailLinkPage() {
  const location = useLocation()
  const params = new URLSearchParams(location.search);
  const link = params.get('to')

  useEffect(() => {
    localStorage.clear()
    Info.loading(true)
    Fetch.getFromUrl().then(r => {
      if (r.error) Info.error(r.error)
      if (r.token) localStorage.setItem("Authorization", `Token ${r.token}`)
      if (r.account) {
        localStorage.setItem("User", r.account.username)
        mainStore.Account.setValue(r.account)
      }
      if (r.message) Info.success(r.message)
      Fetch.autoLink(!!r.error || !link ? '/' : link)
    })
  //eslint-disable-next-line
  }, [])

  return null
}
