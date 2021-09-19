import React, {useState, useEffect} from "react";
import IconButton from "@material-ui/core/IconButton";
import {CircularProgress} from "@material-ui/core";

export default function FetchIconButton({fetch, children, confirmText, onChangeLoading=() => {}, ...otherProps}) {
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    onChangeLoading(loading)
  // eslint-disable-next-line
  }, [loading])

  return (
    <IconButton
      disabled={loading}
      onClick={() => {
        setLoading(true)
        // eslint-disable-next-line no-restricted-globals
        if (confirmText && !confirm(confirmText)) setLoading(false)
        else fetch().then(() => setLoading(false))
      }}
      {...otherProps}
    >
      {loading ? <CircularProgress size={24} color={'secondary'}/> : children}
    </IconButton>
  )
}
