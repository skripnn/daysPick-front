import React, {useEffect, useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle, Grid,
} from "@material-ui/core";
import TextField from "../Fields/TextField/TextField";
import ActionButton from "../Actions/ActionButton/ActionButton";
import ActionsPanel from "../Actions/ActionsPanel/ActionsPanel";
import {ArrowBackIos, Save} from "@material-ui/icons";
import Fetch from "../../js/Fetch";
import {useMobile} from "../hooks";
import HeaderText from "../Text/HeaderText";
import InfoField from "../Fields/InfoField/InfoField";
import MoneyField from "../Fields/MoneyField/MoneyField";
import ClientField from "../Fields/ItemField/ClientField";
import Info from "../../js/Info";

export function NewSeriesDialog({openState, onClose, onBack, onSave}) {
  const [loading, setLoading] = useState(null)
  const [hidden, setHidden] = useState(false)
  const [state, setState] = useState({
    title: null,
    info: null,
    money: null,
    money_calculating: false,
    money_per_day: null,
    client: null,
    is_series: true,
  })
  const mobile = useMobile()

  function changeValue(obj) {
    setState(prevState => ({...prevState, ...obj}))
    if (Object.keys(obj).includes('money_calculating')) changeValue({
      money: state.money_per_day,
      money_per_day: state.money
    })
  }

  function onSubmit() {
    setLoading(true)
    Fetch.post('project', state).then((r) => {
      if (r.error) Info.error(r.error)
      else {
        onSave(r)
        onBack ? onBack() : onClose()
      }
      setLoading(false)
    })
  }

  useEffect(() => {
    if (!openState) setState({
      title: null,
      info: null,
      money: null,
      money_calculating: false,
      money_per_day: null,
      client: null,
      is_series: true
    })
    else setState(prevState => ({...prevState, ...openState}))
  }, [openState])

  return (
    <Dialog
      hidden={hidden}
      fullScreen={mobile}
      fullWidth
      maxWidth={'sm'}
      onClose={onClose}
      open={!!openState}>
      <DialogTitle>
        {!!mobile && <HeaderText center>{'Новая серия'}</HeaderText>}
        <ActionsPanel
          left={<ActionButton
            onClick={onBack || onClose}
            label="Назад"
            icon={<ArrowBackIos/>}
          />}
          center={!mobile && <HeaderText>{'Новая серия'}</HeaderText>}
          right={
            <ActionButton
              onClick={onSubmit}
              label="Сохранить"
              disabled={!state.title || !!loading}
              icon={<Save/>}
              loading={loading}/>
          }
        />
      </DialogTitle>
      <DialogContent style={{overflow: "hidden"}}>
        <Grid container direction={'column'} spacing={3}>
          <Grid item xs>
            <TextField label="Название" value={state.title} onChange={changeValue} changeName={'title'} emptyNull
                       required autoFocus/>
          </Grid>
          <Grid item xs>
            <InfoField info={state.info} setInfo={v => changeValue({info: v})} rowsHeight={3} is_folder/>
          </Grid>
          <Grid item xs>
            <HeaderText center>Значения по умолчанию</HeaderText>
          </Grid>
          <Grid item xs>
            <MoneyField money={state.money} money_per_day={state.money_per_day}
                        money_calculating={state.money_calculating} setValue={changeValue}/>
          </Grid>
          <Grid item xs>
            <ClientField label={'Клиент'} value={state.client} onChange={v => changeValue({client: v})} onDialogChange={setHidden}/>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}
