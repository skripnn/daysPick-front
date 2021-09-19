import React, {useEffect, useState} from "react";
import {Dialog, DialogContent, DialogTitle, List} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import {Add, ArrowBackIos, Clear} from "@material-ui/icons";
import TextField from "../TextField/TextField";
import {useMobile, useSearchList} from "../../hooks";
import {Loader} from "../../../js/Loader";
import ActionsPanel from "../../Actions/ActionsPanel/ActionsPanel";
import ActionButton from "../../Actions/ActionButton/ActionButton";
import LazyList from "../../LazyList/LazyList";
import HeaderText from "../../Text/HeaderText";

export default function ItemField({label, value, onChange=()=>{}, itemRender, getLink, getParams, listRender, createDialog, readOnly=false, emptyLoading, helperText, disabled, onDialogChange, ...otherProps}) {
  const [dialog, setDialog] = useState(false)
  useEffect(() => setDialog(false), [value, readOnly])
  useEffect(() => {
    if (onDialogChange) onDialogChange(dialog)
  // eslint-disable-next-line
  }, [dialog])

  return (
    <div style={{position: "relative", height: helperText? 68 : undefined}}>
      {!!value &&
      <List dense style={{
        zIndex: 5,
        paddingBottom: 'unset',
        paddingTop: 7,
        marginLeft: 0,
        marginRight: 0
      }} {...otherProps}>
        {React.cloneElement(itemRender(value), {
          button: !readOnly,
          slim: true,
          onClick: !disabled ? () => setDialog(!readOnly) : undefined,
          action: !readOnly ? <IconButton size={'small'} onClick={() => onChange(null)}><Clear/></IconButton> : null
        })}
      </List>
      }
      <TextField
        InputLabelProps={{shrink: !!value, disabled: false}}
        style={!!value ? {position: "absolute", left: 0, bottom: 0} : {zIndex: 5}}
        inputProps={{disabled: true, style: {cursor: !readOnly ? 'pointer' : undefined, height: value ? 24 : undefined}}}
        InputProps={{disabled: false, disableUnderline: readOnly, ...otherProps}}
        label={label}
        onClick={!disabled ? () => setDialog(!readOnly) : undefined}
        helperText={helperText}
      />
      {!readOnly &&
        <ChooseDialog
          label={label}
          open={dialog}
          onClose={() => setDialog(false)}
          getLink={getLink}
          getParams={getParams}
          listRender={listRender}
          createDialog={createDialog}
          emptyLoading={emptyLoading}
        />
      }
    </div>
  )
}

export function ChooseDialog({label, open, onClose, getLink, getParams, listRender, createDialog, emptyLoading}) {
  const {fullListSet, filteredListSet, list, page, pages, add, reset} = useSearchList()
  const [create, setCreate] = useState(false)
  const mobile = useMobile()

  useEffect(() => {
    if (!open) {
      new Loader().set(() => {
        reset()
        setCreate(false)
      })
    }
    //eslint-disable-next-line
  }, [open])

  if (create) return (
    React.cloneElement(createDialog, {
      openState: createDialog.props.openState || create,
      onClose: onClose,
      onBack: () => setCreate(false),
    })
  )

  return (
    <Dialog
      maxWidth={'sm'}
      onClose={onClose}
      open={open}
      fullWidth
      fullScreen={mobile}
    >
      <DialogTitle>
        {mobile && !!label && <HeaderText center>{label}</HeaderText>}
        <ActionsPanel
          left={
            <ActionButton
              onClick={onClose}
              label="Назад"
              icon={<ArrowBackIos/>}
            />
          }
          center={!mobile && !!label ? <HeaderText>{label}</HeaderText> : undefined}
          right={!!createDialog ?
          <ActionButton
            onClick={() => setCreate(true)}
            label="Создать"
            icon={<Add/>}
          /> : <ActionButton empty/>
          }
        />
      </DialogTitle>
      <DialogContent>
        <LazyList
          searchFieldParams={{
            set: filteredListSet,
            noFilter: true,
            autoFocus: true
          }}
          getLink={getLink}
          getParams={getParams}
          pages={pages}
          page={page}
          set={emptyLoading && fullListSet}
          add={add}
          preLoader={emptyLoading}
        >
          {listRender(list)}
        </LazyList>
        <span className={'bottom-space'}/>
      </DialogContent>
    </Dialog>
  )
}
