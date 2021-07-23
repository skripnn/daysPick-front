import TextField from "../TextField/TextField";
import React, {useEffect, useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  Typography
} from "@material-ui/core";
import CloseButton from "../../CloseButton/CloseButton";
import './DialogField.css'
import ActionsPanel from "../../Actions/ActionsPanel/ActionsPanel";
import {ArrowBackIos} from "@material-ui/icons";
import ActionButton from "../../Actions/ActionButton/ActionButton";
import {useMobile} from "../../hooks";

function DialogField({value, required, disabled, label, ItemContent, ChoiceContent, actionsPanelProps, open, setOpen}) {
  const [dialog, setDialog] = useState(open || false)

  const close = () => {
    setOpen ? setOpen(false) : setDialog(false)
  }

  const handleOpen = () => {
    setOpen ? setOpen(true) : setDialog(true)
  }

  //eslint-disable-next-line
  useEffect(close, [value])

  return (<>
    <div style={{position: "relative"}}>
      {!!value &&
      <List dense style={{
        zIndex: !!value ? 5 : 0,
        paddingBottom: 'unset',
        paddingTop: 14,
        marginLeft: 0,
        marginRight: 0
      }}>
        <span onClick={handleOpen}>
          {ItemContent}
        </span>
      </List>
      }
      <TextField
        required={required}
        InputLabelProps={{shrink: !!value, disabled: false}}
        style={!!value ? {position: "absolute", left: 0, bottom: 0} : {zIndex: 5}}
        inputProps={{disabled: true, style: {cursor: 'pointer', height: 24}}}
        InputProps={{disabled: false}}
        label={label}
        onClick={handleOpen}
      />
    </div>
    <ChoiceFieldDialog open={!disabled && (open? open : dialog)} close={close} label={label} actionsPanelProps={actionsPanelProps}>
      {ChoiceContent}
    </ChoiceFieldDialog>
  </>)
}


export default DialogField

function ChoiceFieldDialog({open, close, label, actionsPanelProps, children}) {

  const fullScreen = useMobile()
  const Actions = actionsPanelProps ?
    <ActionsPanel left={<ActionButton onClick={close} label="Назад" icon={<ArrowBackIos/>}/>} center={label} {...actionsPanelProps} bottom={fullScreen}/>
    : null

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth={'sm'}
      onClose={close}
      open={open}
    >
      {!actionsPanelProps && <DialogTitle>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-end"}}>
          <Typography>{label}</Typography>
          <CloseButton onClick={close}/>
        </div>
      </DialogTitle>}
      {!fullScreen && Actions}
      <DialogContent>
        {children}
      </DialogContent>
      {fullScreen && Actions}
    </Dialog>
  )
}
