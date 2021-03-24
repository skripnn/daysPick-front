import React, {useEffect, useState} from "react";
import {inject, observer} from "mobx-react";
import {Snackbar} from "@material-ui/core";
import {Alert} from "@material-ui/lab";

function InfoBar(props) {
  const {list, del} = props.InfoBarStore
  const [open, setOpen] = useState([])
  useEffect(() => {
    setOpen(Object.keys(list).filter(id => !list[id].close))
  }, [list])

  return (<>
    {Object.keys(list).map(id =>
      <Snackbar open={open.includes(id)} autoHideDuration={3000} onClose={() => del(id)} key={id} anchorOrigin={{vertical: "top", horizontal: "center"}}>
        <Alert {...list[id]} close={undefined} onClose={() => del(id)}/>
      </Snackbar>
    )}
  </>)
}

export default inject('InfoBarStore')(observer(InfoBar))