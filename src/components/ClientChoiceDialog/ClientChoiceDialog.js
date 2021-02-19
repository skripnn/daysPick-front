import React, {useEffect, useState} from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {getClients, postClient} from "../../js/fetch/client";
import ActionsPanel from "../Actions/ActionsPanel/ActionsPanel";
import ActionButton from "../Actions/ActionButton/ActionButton";
import {ArrowBackIos, PersonAdd} from "@material-ui/icons";
import {Dialog, DialogContent, DialogTitle, List, ListSubheader} from "@material-ui/core";
import TextField from "../Fields/TextField/TextField";
import {convertClients} from "../../js/functions/functions";
import ClientItem from "../ClientItem/ClientItem";
import Loader from "../../js/functions/Loader";

function ClientChoiceDialog(props) {
  const [state, setState] = useState(props.client)
  const [clients, setClients] = useState(null)

  const fullScreen = useMediaQuery('(max-width:720px)');

  useEffect(() => {
    getClients().then(setClients)
  }, [])

  function handleChange(obj) {
    const newState = {...state, ...obj}
    setState(newState)
    Loader.set(() => {
      getClients(newState).then(setClients)
    }, 100)
  }

  const Actions = (
    <ActionsPanel
      bottom={fullScreen}
      left={<ActionButton onClick={props.close} label="Назад" icon={<ArrowBackIos/>}/>}
      right={<ActionButton onClick={() => postClient(state).then(props.set)} label="Создать" disabled={!state.name} icon={<PersonAdd />}/>}
    />
  )

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth={'sm'}
      onClose={props.close}
      open={true}>
      {!fullScreen && <DialogTitle>{Actions}</DialogTitle>}
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
        {!!clients &&
        <List dense>
          {convertClients(clients).map(i => (
            <div key={i.company}>
              <ListSubheader disableSticky>{i.company}</ListSubheader>
              {i.clients.map(client => <ClientItem
                  client={client}
                  key={client.id}
                  onClick={() => props.set(client)}
                />
              )}
            </div>
          ))}
        </List>
        }
      </DialogContent>
      {fullScreen && Actions}
    </Dialog>
  )
}

export default ClientChoiceDialog