import React, {useEffect, useState} from "react";
import {getFromUrl} from "../js/fetch/core";
import {Typography} from "@material-ui/core";
import {Link} from "react-router-dom";

export default function ConfirmPage() {
  const [state, setState] = useState(false)

  useEffect(() => {
    getFromUrl().then((result) => {
      if (result.result) {
        if (!localStorage.User) {
          setState(true)
          setTimeout(() => window.location.href = '/login/', 2000)
        }
        else window.location.href = '/profile/'
      }
      else alert('error')
    })
  }, [])

  if (!state) return <></>

  return (
    <>
      <Typography variant="h3">
        Successful!
      </Typography>
      <Typography>
        Now you will redirect to <Link to="/login/">login</Link> page
      </Typography>
    </>
  )
}