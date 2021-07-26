import React from "react";
import {Tabs} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Day from "../../Calendar/components/Day/Day";
import {newDate} from "../../../js/functions/date";
import './InfoField.css'
import TextField from "../TextField/TextField";
import {inject, observer} from "mobx-react";


function TabPanel(props) {
  const style = props.height ? {
    height: props.plusSize ? props.height - 55 : props.height - 24 - 55
  } : undefined

  return (
    <TextField onChange={props.onChange}
               multiline
               name={props.index}
               label={props.label}
               value={props.value || ''}
               inputProps={{style: style}}
    />
  )
}

function InfoField(props) {
  const [state, setState] = React.useState('info');
  const {info, days, dates, setInfo, is_folder} = props.ProjectStore
  const {height} = props

  if (state !== 'info' && !dates.includes(state)) setState('info')


  function Tab(props) {
    const pick = state === props.date
    function handleClick() {
      pick? setState('info') : setState(props.date)
    }

    return (
      <Box>
        <Day date={newDate(props.date)} pick={pick} onClick={handleClick}/>
      </Box>
    )
  }

  const tabPanel = (date) => {
    if (date === 'info') return (
      <TabPanel
        value={info}
        index={'info'}
        label={'Информация о проекте'}
        onChange={e => setInfo(e.target.value)}
        plusSize={!dates.length}
        height={height}
      />
    )

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fdate = (new Intl.DateTimeFormat('ru-RU', options).format(newDate(date)));
    return (
      <TabPanel
        value={days[date]}
        index={date}
        key={date}
        label={fdate}
        onChange={(e) => setInfo(e.target.value, date)}
        height={height}
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
        {dates.map(date => <Tab date={date} key={date}/>)}
      </Tabs>}
      {tabPanel(state)}
    </Box>
  )
}

export default inject('ProjectStore')(observer(InfoField))
