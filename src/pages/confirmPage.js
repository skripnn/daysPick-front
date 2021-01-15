import React, {useState} from "react";
import {getFromUrl} from "../js/fetch/core";
import {Typography} from "@material-ui/core";
import {Link} from "react-router-dom";

export default function ConfirmPage() {
  const [state, setState] = useState(false)

  getFromUrl().then((result) => {
    if (result.result) {
      setState(true)
      setTimeout(() => window.location.href = '/login/', 2000)
    }
    else alert('error')
  })

  if (!state) return <></>

  return (
    <>
      <Typography variant="h3">
        Successful!
      </Typography>
      <Typography>
        Now we will redirect to <Link to="/login/">login</Link> page
      </Typography>
    </>
  )
}