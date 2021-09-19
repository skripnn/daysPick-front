import React, {useEffect, useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle, List, ListItem, ListItemText, ListSubheader
} from "@material-ui/core";
import TextField from "../Fields/TextField/TextField";
import './ClientDialog.css'
import ActionButton from "../Actions/ActionButton/ActionButton";
import ActionsPanel from "../Actions/ActionsPanel/ActionsPanel";
import {ArrowBackIos, Delete, Save} from "@material-ui/icons";
import Fetch from "../../js/Fetch";
import {useMobile} from "../hooks";
import A from "../core/A";
import {Autocomplete} from "@material-ui/lab";
import HeaderText from "../Text/HeaderText";

export default function ClientDialog({openState, onClose, onBack, onDelete, onSave}) {
  const opened = !!openState
  const [loading, setLoading] = useState(null)
  const [state, setState] = useState({})
  const [options, setOptions] = useState([])
  const mobile = useMobile()
  useEffect(() => {
    if (opened) Fetch.get(['clients', 'companies']).then(setOptions)
  }, [opened])

  useEffect(() => {
    if (openState && openState.id) Fetch.get(['client', openState.id]).then(client => setState(client))
    setState(openState || {})
    setLoading(null)
    // eslint-disable-next-line
  }, [openState])

  function load(command) {
    setLoading(command)
    if (command === 'del') Fetch.delete(['client', state.id]).then(() => onDelete(state))
    else if (command === 'save') Fetch.post(['client', state.id], state).then(() => onSave(state))
  }

  return (
    <Dialog
      fullScreen={mobile}
      fullWidth
      maxWidth={'sm'}
      onClose={onClose}
      open={!!openState}>
      <DialogTitle>
        {!!mobile && <HeaderText center>{'Новый клиент'}</HeaderText>}
        <ActionsPanel
          left={<ActionButton
            onClick={onBack || onClose}
            label="Назад"
            icon={<ArrowBackIos/>}
          />}
          center={!mobile && <HeaderText>{'Новый клиент'}</HeaderText>}
          right={<>
            {!!state.id && <ActionButton
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
      </DialogTitle>
      <DialogContent style={{overflow: "hidden"}}>
        <TextField
          autoFocus={!state.id}
          margin="dense"
          name="name"
          label="Имя"
          value={state.name || ''}
          changeName={'name'}
          onChange={(obj) => setState(prevState => ({...prevState, ...obj}))}
        />
        <Autocomplete
          options={options}
          onChange={(e, newValue) => setState(prevState => ({...prevState, company: newValue}))}
          autoHighlight
          disableClearable
          freeSolo
          renderInput={(params) =>
            <TextField
              {...params}
              margin="dense"
              name="company"
              label="Компания"
              changeName={'company'}
              onChange={(obj) => setState(prevState => ({...prevState, ...obj}))}
            />
          }
        />
        {state.projects && !!state.projects.length &&
        <List dense>
          <ListSubheader style={{background: "white", textAlign: 'center'}}>Проекты</ListSubheader>
          <div style={{maxHeight: 270, overflow: "scroll"}}>
            {state.projects.map(project =>
              <A link={['project', project.id]} key={project.id.toString()}>
                <ListItem button>
                  <ListItemText primary={project.title}/>
                </ListItem>
              </A>
            )}
          </div>
        </List>
        }
      </DialogContent>
    </Dialog>
  )
}
