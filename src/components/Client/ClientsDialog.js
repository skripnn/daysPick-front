import React, {useEffect, useState} from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {postClient} from "../../js/fetch/client";

export default function ClientsDialog(props) {
  const [state, setState] = useState(props.client)

  function save() {
    postClient(state).then((result) => {
      if (props.save) props.save(result)
    })
  }

  function close() {
    if (props.close) props.close()
    setState({})
  }

  return (
    <Dialog
      fullWidth
      maxWidth={'sm'}
      onClose={close}
      open={true}>
      <DialogTitle id="max-width-dialog-title">Заказчик</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Имя"
          fullWidth
          value={state.name || ''}
          onChange={(e) => setState(prevState => ({...prevState, name: e.target.value}))}
        />
        <TextField
          margin="dense"
          name="company"
          label="Компания"
          fullWidth
          value={state.company || ''}
          onChange={(e) => setState(prevState => ({...prevState, company: e.target.value}))}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={close} color="primary">
          Отмена
        </Button>
        <Button onClick={save} color="primary">
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  )
}