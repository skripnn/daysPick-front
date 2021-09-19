import React from "react";
import {Switch} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import TextField from "../TextField/TextField";


function MoneyField({money, money_calculating, money_per_day, setValue, readOnly}) {

  const toMoneyObj = (x) => {
    if (!x) return ''
    return new Intl.NumberFormat('ru-RU', {maximumFractionDigits: 0}).format(x)
  }
  const fromMoneyObj = (x, name) => {
    if (!x) return Object.fromEntries([[name, null]])
    if (/^[0-9\s]+[.,]?[0-9]{0,2}$/.test(x)) {
      const y = [...x.matchAll(/[0-9.,]+/g)].join('')
      return Object.fromEntries([[name, parseFloat(y)]])
    }
    return {}
  }

  return (
    <Box display={"flex"} flex-direction="row" justifyContent="center" alignItems="flex-end">
      <Box flexGrow={1}>
        <TextField
          onChange={v => setValue(fromMoneyObj(v, 'money'))}
          label='Гонорар' value={toMoneyObj(money)}
          disabled={!!money_calculating}
          readOnly={!!money_calculating || readOnly}
        />
      </Box>
      <Box >
        <Switch
          disabled={readOnly}
          onChange={!readOnly ? e => setValue({money_calculating: e.target.checked}) : undefined}
          checked={money_calculating}
          color={"default"}
        />
      </Box>
      <Box flexGrow={1}>
        <TextField
          onChange={v => setValue(fromMoneyObj(v, 'money_per_day'))}
          label='Гонорар в день'
          value={toMoneyObj(money_per_day)}
          disabled={!money_calculating}
          readOnly={!money_calculating || readOnly}
        />
      </Box>
    </Box>
  )
}

export default MoneyField
