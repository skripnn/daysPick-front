import React, {useEffect, useRef, useState} from "react";
import ActionsPanel from "../Actions/ActionsPanel/ActionsPanel";
import ActionButton from "../Actions/ActionButton/ActionButton";
import {ArrowBackIos, PersonAdd} from "@material-ui/icons";
import {Dialog, DialogContent, DialogTitle, ListSubheader} from "@material-ui/core";
import TextField from "../Fields/TextField/TextField";
import {convertClients} from "../../js/functions/functions";
import ClientItem from "../ClientItem/ClientItem";
import Loader from "../../js/Loader";
import Fetch from "../../js/Fetch";
import LazyList from "../LazyList/LazyList";
import {inject, observer} from "mobx-react";
import './ClientChoiceDialog.css'
import {useMobile} from "../hooks";

function ClientChoiceDialog(props) {
  const [state, setState] = useState(props.client)

  const fullScreen = useMobile()

  const ref = useRef()

  useEffect(() => {
    return (props.f.set(null))
    // eslint-disable-next-line
  }, [])

  function handleChange(obj) {
    const newState = {...state, ...obj}
    setState(newState)
    Loader.set(() => {
      Fetch.get('clients', newState).then(props.f.set)
    }, 100)
  }

  const Actions = (
    <ActionsPanel
      bottom={fullScreen}
      left={<ActionButton onClick={props.close} label="Назад" icon={<ArrowBackIos/>}/>}
      right={<ActionButton onClick={() => Fetch.post('client', state).then(props.set)} label="Создать" disabled={!state.name} icon={<PersonAdd />}/>}
    />
  )

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth={'sm'}
      onClose={props.close}
      open={true}
    >
      {!fullScreen && <DialogTitle>{Actions}</DialogTitle>}
      <DialogContent className={'client-choice-dialog-content'} ref={ref}>
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
        <LazyList
          getLink={'clients'}
          getParams={state}
          set={props.f.set}
          add={props.f.add}
          page={props.f.page}
          pages={props.f.pages}
          observableRoot={ref.current || undefined}
        >
          {convertClients(props.f.list).map(i => (
            <>
              <ListSubheader disableSticky key={i.company}>{i.company}</ListSubheader>
              {i.clients.map(client => <ClientItem
                  client={client}
                  key={client.id}
                  onClick={() => props.set(client)}
                />
              )}
            </>
          ))}
        </LazyList>
      </DialogContent>
      {fullScreen && Actions}
    </Dialog>
  )
}

export default inject(stores => ({
  f: stores.ClientsPageStore.f
}))(observer(ClientChoiceDialog))
