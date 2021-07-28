import {useEffect} from "react";
import Fetch from "../js/Fetch";
import mainStore from "../stores/mainStore";
import Info from "../js/Info";
export default function TgAuthPage() {

  useEffect(() => {
    Info.loading(true)
    Fetch.getFromUrl()
      .then(r => {
          if (!localStorage.User) {
            const to = r.to
            delete r.to
            mainStore.UsersStore.setLocalUser(r)
            Fetch.autoLink(to, true)
          }
          else Fetch.autoLink(r.to || `/`, true)
        }
      )
  }, [])

  return null

}
