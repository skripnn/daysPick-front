import React, {useEffect, useState} from "react";
import {inject, observer} from "mobx-react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  LinearProgress,
  Snackbar
} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import ActionButton from "../Actions/ActionButton/ActionButton";

function InfoBar(props) {
  const {list, del, confirm, setConfirm} = props.InfoBar
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
    <Dialog open={!!confirm} onClose={() => setConfirm(null)}>
      {!!confirm && <DialogContent>
        <DialogContentText>{confirm.message}</DialogContentText>
        <DialogActions>
          <ActionButton
            onClick={() => setConfirm(null)}
            label={'Отмена'}
          />
          <ActionButton
            onClick={() => {
              confirm.action()
              setConfirm(null)
            }}
            label={'Ок'}
          />
        </DialogActions>
      </DialogContent>}
    </Dialog>
  </>)
}

export default inject('InfoBar')(observer(InfoBar))


function LoadingBarComponent({InfoBar}) {
  const {loading} = InfoBar
  if (!loading) return null
  return <LinearProgress color={'secondary'} style={{position: 'absolute', top: 0, width: "100%", zIndex: 1150, opacity: 0.5}}/>
}

export const LoadingBar = inject('InfoBar')(observer(LoadingBarComponent))
