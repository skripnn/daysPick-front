import React from "react";
import {Switch} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import TextField from "../TextField/TextField";
import {inject, observer} from "mobx-react";


function MoneyField(props) {
  const numValid = (str) => parseInt(str) || null
  const {money, money_calculating, money_per_day, setValue} = props.ProjectStore

  return (
    <Box display={"flex"} flex-direction="row" justifyContent="center" alignItems="flex-end">
      <Box flexGrow={1}>
        <TextField onChange={e => setValue({money: numValid(e.target.value)})} label='Гонорар' value={money || ''} disabled={!!money_calculating}/>
      </Box>
      <Box >
        <Switch onChange={e => setValue({money_calculating: e.target.checked})} checked={money_calculating} color={"default"}/>
      </Box>
      <Box flexGrow={1}>
        <TextField onChange={e => setValue({money_per_day: numValid(e.target.value)})} label='Гонорар в день' value={money_per_day || ''} disabled={!money_calculating}/>
      </Box>
    </Box>
  )
}

export default inject('ProjectStore')(observer(MoneyField))