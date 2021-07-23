import React, {useEffect, useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle, List, ListItem, ListItemText, ListSubheader
} from "@material-ui/core";
import TextField from "../Fields/TextField/TextField";
import {Link} from "react-router-dom";
import './ClientDialog.css'
import {inject, observer} from "mobx-react";
import ActionButton from "../Actions/ActionButton/ActionButton";
import ActionsPanel from "../Actions/ActionsPanel/ActionsPanel";
import {ArrowBackIos, Delete, Save} from "@material-ui/icons";
import Fetch from "../../js/Fetch";
import {useMobile} from "../hooks";


function ClientDialog(props) {
  const [state, setState] = useState(props.client || props.ClientsPageStore.dialog)
  const [loading, setLoading] = useState(null)

  useEffect(() => {
    if (state.id) Fetch.get(['client', state.id]).then(client => setState(client))
    // eslint-disable-next-line
  }, [])

  const fullScreen = useMobile()

  function load(command) {
    setLoading(command)
    if (command === 'del') props.onDelete(state)
    else if (command === 'save') props.onSave(state)
  }

  const Actions = (
    <ActionsPanel
      bottom={fullScreen}
      left={<ActionButton
        onClick={props.close}
        label="Назад"
        icon={<ArrowBackIos/>}
      />}
      right={<>
        {state.id && <ActionButton
          // eslint-disable-next-line no-restricted-globals
          onClick={() => {if (confirm('Удалить клиента?')) load('del')}}
          label="Удалить" icon={<Delete/>}
          disabled={!!loading}
          loading={loading === 'del'}/>}
        <ActionButton
          onClick={() => load('save')}
          label="Сохранить"
          disabled={!state.name || !!loading}
          icon={<Save/>}
          loading={loading === 'save'}/>
      </>}
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
      <DialogContent style={{overflow: "hidden"}}>
        <TextField
          autoFocus={props.autoFocus}
          margin="dense"
          name="name"
          label="Имя"
          value={state.name || ''}
          onChange={(e) => setState(prevState => ({...prevState, name: e.target.value}))}
        />
        <TextField
          margin="dense"
          name="company"
          label="Компания"
          value={state.company || ''}
          onChange={(e) => setState(prevState => ({...prevState, company: e.target.value}))}
        />
        {state.projects && !!state.projects.length &&
        <List dense>
          <ListSubheader style={{background: "white"}}>Проекты</ListSubheader>
          <div style={{maxHeight: 270, overflow: "scroll"}}>
            {state.projects.map(project =>
              <Link to={`/project/${project.id}/`}>
                <ListItem button>
                  <ListItemText primary={project.title}/>
                </ListItem>
              </Link>
            )}
          </div>
        </List>
        }
      </DialogContent>
      {fullScreen && Actions}
    </Dialog>
  )
}

export default inject('ClientsPageStore')(observer(ClientDialog))
