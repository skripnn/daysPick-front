import ClientItem from "../../ClientItem/ClientItem";
import TextField from "../TextField/TextField";
import React, {useEffect, useState} from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle, List, ListSubheader} from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {getClients, postClient} from "../../../js/fetch/client";
import Button from "@material-ui/core/Button";
import ClearIcon from '@material-ui/icons/Clear';
import {isMobil} from "../../../js/functions/functions";

let searchTimer

function ClientField(props) {
  const [dialog, setDialog] = useState(null)

  function set(client) {
    props.set(client)
    setDialog(null)
  }

  function clear() {
    props.set(null)
    setDialog({
      name: '',
      company: ''
    })
  }

  return (<>
    <div style={{position: "relative"}}>
    {!!props.client &&
      <List dense style={{zIndex: !!props.client ? 5 : 0, paddingBottom: 'unset', paddingTop: 14, marginLeft: -8, marginRight: -8}}>
      <ClientItem
        disabled
        client={props.client}
        onDelete={() => props.set(null)}
        deleteIcon={<ClearIcon />}
        noTimeout
        showCompany={!isMobil()}
      />
      </List>
    }
    <TextField
      InputLabelProps={{shrink: !!props.client, disabled: false}}
      style={!!props.client? {position: "absolute", left: 0, bottom: 0} : {zIndex: 5}}
      inputProps={{disabled: true, style: {cursor: 'pointer', height: 24}}}
      InputProps={{disabled: false}}
      label={'Клиент'}
      onClick={clear}
    />
    </div>
    {!!dialog &&
    <ClientDialog2 client={dialog} set={set} close={() => setDialog(null)}/>
    }
  </>)
}


function ClientDialog2(props) {
  const [state, setState] = useState(props.client)
  const [clients, setClients] = useState(null)

  const fullScreen = useMediaQuery('(max-width:720px)');

  useEffect(() => {
    getClients().then(setClients)
  }, [])

  function handleChange(obj) {
    clearTimeout(searchTimer)
    const newState = {...state, ...obj}
    setState(newState)
    searchTimer = setTimeout(() => {
      getClients(newState).then(setClients)
    }, 100)
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth={'sm'}
      onClose={props.close}
      open={true}>
      <DialogTitle>Клиент</DialogTitle>
      <DialogContent style={{overflow: "scroll"}}>
        <TextField
          margin="dense"
          name="name"
          label="Имя"
          value={state.name}
          onChange={(e) => handleChange({name: e.target.value})}
        />
        <TextField
          margin="dense"
          name="company"
          label="Компания"
          value={state.company}
          onChange={(e) => handleChange({company: e.target.value})}
        />
        {!!clients && <ClientList clients={clients} onClick={props.set}/>}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.close} color="primary">
          Отмена
        </Button>
        <Button onClick={() => postClient(state).then(props.set)} color="primary" disabled={!state.name}>
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function ClientList(props) {
  function convert(clients=[]) {
    const list = [{company: null, clients: []}]
    clients.forEach(c => {
      if (c.company !== list[list.length - 1].company) list.push({company: c.company, clients: []})
      list[list.length - 1].clients.push(c)
    })
    return list
  }

  return (
    <List dense>
      {convert(props.clients).map(i => (
        <div key={i.company}>
          <ListSubheader disableSticky>{i.company}</ListSubheader>
          {i.clients.map(client => <ClientItem
            client={client}
            key={client.id}
            onClick={() => props.onClick(client)}
          />
          )}
        </div>
      ))}
    </List>
  )
}


export default ClientField