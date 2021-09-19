import React from "react";
import {Tabs} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Day from "../../Calendar/components/Day/Day";
import {newDate} from "../../../js/functions/date";
import './InfoField.css'
import TextField from "../TextField/TextField";


function TabPanel(props) {
  const style = props.height ? {
    height: props.plusSize ? props.height - 55 : props.height - 24 - 55
  } : undefined

  return (
    <TextField onChange={props.onChange}
               multiline
               name={props.index}
               label={props.label}
               value={props.value}
               inputProps={{style: style}}
               readOnly={props.readOnly}
               emptyNull
    />
  )
}

function InfoField({info, days={}, setInfo, is_folder, height, rowsHeight, readOnly}) {
  if (rowsHeight) height = rowsHeight * 69
  const [state, setState] = React.useState('info');

  if (state !== 'info' && !Object.keys(days).includes(state)) setState('info')


  function Tab({date}) {
    const pick = state === date
    function handleClick() {
      pick? setState('info') : setState(date)
    }

    return (
      <Box>
        <Day date={newDate(date)} pick={pick} onClick={handleClick}/>
      </Box>
    )
  }

  const tabPanel = (date) => {
    if (date === 'info') return (
      <TabPanel
        value={info}
        index={'info'}
        label={'Информация о проекте'}
        onChange={setInfo}
        plusSize={!Object.keys(days).length}
        height={height}
        readOnly={readOnly}
      />
    )

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fDate = (new Intl.DateTimeFormat('ru-RU', options).format(newDate(date)));
    return (
      <TabPanel
        value={days[date]}
        index={date}
        key={date}
        label={fDate}
        onChange={(v) => setInfo(v, date)}
        height={height}
        readOnly={readOnly}
      />
    )
  }

  return (
    <Box display={"flex"} flexDirection={'column'}>
      {!is_folder && <Tabs
        style={{minHeight: 'unset', marginBottom: 5}}
        value={false}
        TabScrollButtonProps={{className: "calendar-day"}}
        variant="scrollable"
        scrollButtons="auto"
      >
        {Object.keys(days).map(date => <Tab date={date} key={date}/>)}
      </Tabs>}
      {tabPanel(state)}
    </Box>
  )
}

// export default inject('ProjectStore')(observer(InfoField))
export default InfoField
