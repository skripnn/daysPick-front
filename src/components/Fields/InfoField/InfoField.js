import React from "react";
import {Tabs} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Day from "../../Calendar/components/Day/Day";
import {newDate} from "../../../js/functions/date";
import './InfoField.css'
import TextField from "../TextField/TextField";


function TabPanel(props) {
  return (
    <TextField onChange={props.onChange}
               multiline
               rows={props.plusSize ? 11 : 10}
               name={props.index}
               label={props.label}
               value={props.value || ''}/>
  )
}

export default function InfoField(props) {
  const [value, setValue] = React.useState('info');

  if (value !== 'info' && !props.dates.includes(value)) setValue('info')


  function Tab(props) {
    const pick = value === props.date
    function handleClick() {
      pick? setValue('info') : setValue(props.date)
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
        value={props.info}
        index={'info'}
        label={'Информация о проекте'}
        onChange={e => props.setValue({info: e.target.value})}
        plusSize={!props.dates.length}
      />
    )

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fdate = (new Intl.DateTimeFormat('ru-RU', options).format(newDate(date)));
    return (
      <TabPanel
        value={props.days[date]}
        index={date}
        key={date}
        label={fdate}
        onChange={(e) => props.setInfo(date, e.target.value)}
      />
    )
  }

  return (
    <Box display={"flex"} flexDirection={'column'}>
      <Tabs
        style={{minHeight: 'unset', marginBottom: 5}}
        value={false}
        TabScrollButtonProps={{className: "calendar-day"}}
        variant="scrollable"
        scrollButtons="auto"
      >
        {props.dates.map(date => <Tab date={date} key={date}/>)}
      </Tabs>
      {tabPanel(value)}
    </Box>
  )
}
