import {useContext, useEffect, useState} from "react";
import {MobXProviderContext} from "mobx-react";
import {parseUser} from "../js/functions/functions";
import mainStore from "./mainStore";
import {autorun} from "mobx";
import Fetch from "../js/Fetch";

export function useAccount() {
  return useContext(MobXProviderContext).Account
}

export function useUserPage() {
  const username = parseUser()
  const stores = useContext(MobXProviderContext)
  return stores.UserPage.get(username)
}

export function useUsername() {
  const [state, setState] = useState(mainStore.Account.username)
  autorun(() => {
    if (mainStore.Account.username !== state) setState(mainStore.Account.username)
  })
  return state
}

export function useUserLink() {
  const username = useUsername()
  return username ? `@${username}` : null
}

export function useAuthorization() {
  const username = useUsername()
  useEffect(() => {
    if (localStorage.Authorization) Fetch.get('account').then(mainStore.Account.setValue)
    // eslint-disable-next-line
  }, [])
  return localStorage.Authorization ? !!username : true
}

export function useMobile() {
  const stores = useContext(MobXProviderContext)
  return stores.InfoBar.mobile
}

export function usePreLoader() {
  const [loading, setLoading] = useState(true)
  let setter = Fetch.getSetter(window.location.pathname)

  useEffect(() => {
    if (setter) Fetch.getFromUrl().then((r) => {
      if (r.error) Fetch.link('/')
      else setter(r)
      setLoading(false)
    })
    else setLoading(false)
  //eslint-disable-next-line
  }, [])
  return !!loading
}
