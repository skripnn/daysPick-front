import TextField from "@material-ui/core/TextField";
import React from "react";
import {Switch} from "@material-ui/core";
import Box from "@material-ui/core/Box";


export default function MoneyField(props) {
  const numValid = (str) => parseInt(str)? parseInt(str) : null

  return (
    <Box display={"flex"} flex-direction="row" justifyContent="center" alignItems="flex-end">
      <Box flexGrow={1}>
        <TextField size="small" fullWidth onChange={e => props.onChange({money: numValid(e.target.value)})} name='money' label='Гонорар' value={props.money || ''} autoComplete='off' disabled={!!props.money_calculating}/>
      </Box>
      <Box >
        <Switch onChange={e => props.onChange({money_calculating: e.target.checked})} checked={props.money_calculating} color={"default"}/>
      </Box>
      <Box flexGrow={1}>
        <TextField size="small" fullWidth onChange={e => props.onChange({money_per_day: numValid(e.target.value)})} name='money_per_day' label='Гонорар в день' value={props.money_per_day || ''} autoComplete='off' disabled={!props.money_calculating}/>
      </Box>
    </Box>
  )
}
