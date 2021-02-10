import React from "react";
import {Switch} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import TextField from "../TextField/TextField";


export default function MoneyField(props) {
  const numValid = (str) => parseInt(str)? parseInt(str) : null

  return (
    <Box display={"flex"} flex-direction="row" justifyContent="center" alignItems="flex-end">
      <Box flexGrow={1}>
        <TextField onChange={e => props.setValue({money: numValid(e.target.value)})} label='Гонорар' value={props.money || ''} disabled={!!props.money_calculating}/>
      </Box>
      <Box >
        <Switch onChange={e => props.setValue({money_calculating: e.target.checked})} checked={props.money_calculating} color={"default"}/>
      </Box>
      <Box flexGrow={1}>
        <TextField onChange={e => props.setValue({money_per_day: numValid(e.target.value)})} label='Гонорар в день' value={props.money_per_day || ''} disabled={!props.money_calculating}/>
      </Box>
    </Box>
  )
}
