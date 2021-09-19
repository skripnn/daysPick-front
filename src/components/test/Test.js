import React, {useEffect, useRef, useState} from "react";
import {getMonth, newDate} from "./extention/date";
import {has, useInteraction} from "./Calendar";
import Fetch from "../../js/Fetch";
import Day from "./components/Day/Day";
import TextLine from "./components/TextLine";
import weeksCounter from "./extention/weeksCounter";
import weekWidth from "./extention/weekWidth";
import MonthText from "./components/MonthText";
import YearText from "./components/YearText";



export default function Test(props) {
  const [date, setDate] = useState(null)
  const [row, setRow] = useState(true)
  const [calendars, setCalendars] = useState([
    {
      user: 'skripnn',
      daysPick: []
    },
    {
      user: null,
      daysPick: []
    }
  ])
  const [daysPick, setDaysPick] = useState([])

  useEffect(() => {
    const set = new Set()
    calendars.map(i => i.daysPick).forEach(i => {
      i.forEach(d => set.add(d))
    })
    setDaysPick([...set])
  }, [calendars])

  function onDayClick(date, n) {
    const fDate = date.format()
    const newCalendars = [...calendars]
    const set = new Set(newCalendars[n].daysPick)
    const pick = !set.has(fDate)
    pick ? set.add(fDate) : set.delete(fDate)
    newCalendars[n] = {...newCalendars[n], daysPick: [...set]}
    setCalendars(newCalendars)
  }

  function onLabelClick(date) {
    const fDate = date.format()
    const pick = !daysPick.includes(fDate)
    const newCalendars = []
    calendars.forEach((i, n) => {
      const set = new Set(i.daysPick)
      pick ? set.add(fDate) : set.delete(fDate)
      newCalendars.push({
        ...i, daysPick: [...set]
      })
    })
    setCalendars(newCalendars)
  }

  function setStartDate(e) {
    const value = e.target.valueAsDate
    if (!value) return
    const year = value.getFullYear()
    if (year > 999 && year < 10000) {
      setDate(e.target.value)
    }
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <input type={'date'} onChange={setStartDate} defaultValue={'2021-08-25'}/>
      <div><input type={'checkbox'} onChange={e => setRow(e.target.checked)} defaultChecked={true}/><span>row</span></div>
      {/*<UserCalendar startDate={date} row/>*/}
      {/*{row && <UserRowCalendarLabels startDate={date} daysPick={daysPick} onClick={onLabelClick}/>}*/}
      {/*{*/}
      {/*  calendars.map((i, n) => <UserCalendar startDate={date} row {...i} key={n} onClick={d => onDayClick(d, n)}/>)*/}
      {/*}*/}
      <CalendarRight startDate={date} />
    </div>
  )
}

function RowsCalendar({startDate, width=38, daysPick=[], children=[], onDayClick=() => {}, onLabelClick=() => {}}) {

  function day(date) {
    const fDate = date.format()
    return <Day date={date} key={fDate} pick={has(daysPick, fDate)} onClick={onLabelClick}/>
  }

  function getWeeks() {
    let days = []
    for (let i = 0; i < width; i++) {
      let date = newDate(startDate).offsetDays(i)
      days.push(day(date))
    }
    return days
  }

  return (
    <>
      <div style={{display: 'flex'}}>
        {getWeeks()}
      </div>
      {
        children.map((i, n) => <UserRowCalendar startDate={startDate} {...i} key={n} onClick={d => onDayClick(d, n)} width={width}/>)
      }
    </>
  )
}

function UserRowCalendar({startDate, user, width=38, daysPick=[], onClick=() => {}}) {
  const start = newDate(startDate)

  const [state, setState] = useState({
    days: {},
    daysOff: []
  })

  useEffect(() => {
    if (!user) return
    const start = newDate(startDate)
    const end = newDate(startDate).offsetDays(width)
    Fetch.getCalendar(start, end, user).then(r => {
      if (r && r[user] && !r.error) setState(r[user])
    })
  }, [startDate, user])

  function day(date) {
    const fDate = date.format()
    const day = {
      info: state.days[fDate] || null,
      off: has(state.daysOff, fDate),
      pick: has(daysPick, fDate)
    }
    return <Day date={date} key={fDate} {...day} onClick={onClick} noLabel/>
  }

  function getDays() {
    let days = []
    for (let i = 0; i < width; i++) {
      let date = newDate(start).offsetDays(i)
      days.push(day(date))
    }
    return days
  }

  return (
    <div style={{display: 'flex'}}>
      {getDays()}
    </div>
  )
}

function UserCalendar({startDate, user, width = 38, daysPick=[], onClick=() => {}}) {
  const start = newDate(startDate).monday()

  const [state, setState] = useState({
    days: {},
    daysOff: []
  })

  useEffect(() => {
    if (!user) return
    const start = newDate(startDate)
    const end = newDate(startDate).offsetWeeks(width)
    Fetch.getCalendar(start, end, user).then(r => {
      if (r && r[user] && !r.error) setState(r[user])
    })
  }, [startDate, user])

  function day(date) {
    const fDate = date.format()
    const day = {
      info: state.days[fDate] || null,
      off: has(state.daysOff, fDate),
      pick: has(daysPick, fDate)
    }
    return <Day date={date} key={fDate} {...day} onClick={onClick}/>
  }

  function week(start) {
    let daysList = []
    for (let i = 0; i < 7; i++) {
      let date = newDate(start).offsetDays(i)
      daysList.push(day(date))
    }

    return (
      <div className="calendar-week"
           key={start.format()}>
        {daysList}
      </div>
    )
  }

  function getWeeks() {
    let days = []
    for (let i = 0; i < width; i++) {
      let date = newDate(start).offsetWeeks(i)
      days.push(week(date))
    }
    return days
  }

  return (
    <div style={{display: 'flex'}}>
      {getWeeks()}
    </div>
  )
}


function CalendarRight({startDate}) {
  const ref = useRef()
  const weeksOffset = 15
  let weeksCount = ref.current ? weeksCounter(ref.current.clientWidth) + weeksOffset * 2 : 38
  // const [scroll, setScroll] = useState(0)
  const [start, setStart] = useState(newDate(startDate).monday())
  // useEffect(() => {setStart(newDate(startDate).offsetDays(-weeksOffset))}, [startDate])

  // console.log(ref.current? ref.current.scrollLeft : null)

  function func() {
    setTexts(textsRender())
    let leftDate = newDate(start)
    console.log(ref.current.scrollLeft)
    if (ref.current.scrollLeft === 0) leftDate.offsetDays(-weeksOffset)  // влево
    else if (ref.current.scrollLeft === ref.current.scrollWidth - ref.current.clientWidth) leftDate.offsetDays(weeksOffset)  // или вправо
    let scrollLeft = weekWidth(start.getDiffDays(leftDate))
    setStart(leftDate)
    ref.current.scrollLeft += scrollLeft
  }

  useEffect(() => {
    console.log('first')
  }, [])
  // useInteraction(startDate, func, ref)

  const [calendars, setCalendars] = useState([
    {
      user: 'skripnn',
      daysPick: []
    },
    {
      user: null,
      daysPick: []
    }
  ])
  const [daysPick, setDaysPick] = useState([])

  useEffect(() => {
    const set = new Set()
    calendars.map(i => i.daysPick).forEach(i => {
      i.forEach(d => set.add(d))
    })
    setDaysPick([...set])
  }, [calendars])

  function textsRender() {
    // if (!Array.isArray(newWeeks)) return
    // получение новых текстовых компонентов
    let years = []
    let months = []
    let tempYear = {}
    let tempMonth = {}
    let textWidth = 0

    let mainWidth = ref.current ? ref.current.clientWidth : 38 * weekWidth()
    let scrollLeft = ref.current ? ref.current.scrollLeft : 0
    // let wCount = weeksCounter(mainWidth)
    let wCount = weeksCount
    // if (newWeeks && weekWidth(newWeeks.length) < mainWidth) mainWidth = weekWidth(newWeeks.length)
    let startIndex = weeksCounter(scrollLeft)
    let offset = scrollLeft % weekWidth()
    if (offset) {
      startIndex -= 1
      wCount += 1
    }

    let start = newDate(startDate).offsetWeeks(startIndex)

    for (let i = 0; i < wCount; i++) {
      let date = newDate(start).offsetWeeks(i)
      if (textWidth < mainWidth) {
        let width = weekWidth()
        if (i === 0) {
          width -= offset
        }

        // месяц
        const month = date.getMonth()
        if (month !== tempMonth.month) {
          if (tempMonth.width) {
            months.push(<MonthText key={tempYear.year + '-' + getMonth(tempMonth.month)} {...tempMonth}/>)
          }
          tempMonth = {
            month: month,
            width: 0
          }
        }
        tempMonth.width += width

        // год
        const year = date.getFullYear()
        if (year !== tempYear.year) {
          if (tempYear.width) {
            years.push(<YearText key={tempYear.year} {...tempYear}/>)
          }
          tempYear = {
            year: year,
            width: 0
          }
        }
        tempYear.width += width

        // счетчик ширины блока с текстом
        textWidth += width
      }
    }
    // добавление последних текстовых компонентов
    const width = textWidth - mainWidth

    // месяц
    tempMonth.width -= width
    months.push(<MonthText key={tempYear.year + '-' + getMonth(tempMonth.month)} {...tempMonth}/>)

    // год
    tempYear.width -= width
    years.push(<YearText key={tempYear.year} {...tempYear}/>)

    return {
      years: years,
      months: months
    }
  }
  const [texts, setTexts] = useState(textsRender())
  useEffect(() => setTexts(textsRender()), [start])

  function onDayClick(date, n) {
    const fDate = date.format()
    const newCalendars = [...calendars]
    const set = new Set(newCalendars[n].daysPick)
    const pick = !set.has(fDate)
    pick ? set.add(fDate) : set.delete(fDate)
    newCalendars[n] = {...newCalendars[n], daysPick: [...set]}
    setCalendars(newCalendars)
  }

  function onLabelClick(date) {
    const fDate = date.format()
    const pick = !daysPick.includes(fDate)
    const newCalendars = []
    calendars.forEach((i, n) => {
      const set = new Set(i.daysPick)
      pick ? set.add(fDate) : set.delete(fDate)
      newCalendars.push({
        ...i, daysPick: [...set]
      })
    })
    setCalendars(newCalendars)
  }

  console.log(new Array(weeksCount))

  return (
      <div className="calendar-right">
        <TextLine children={texts.years}/>
        <TextLine children={texts.months}/>
        <div className="calendar-scroll"
             onScroll={func}
             ref={ref}>
          {/*<RowsCalendar*/}
          {/*  startDate={start}*/}
          {/*  daysPick={daysPick}*/}
          {/*  onLabelClick={onLabelClick}*/}
          {/*  onDayClick={onDayClick}*/}
          {/*  width={weeksCount}*/}
          {/*>*/}
          {/*  {calendars}*/}
          {/*</RowsCalendar>*/}
          {/*<UserCalendar startDate={start} daysPick={daysPick} onClick={d => onDayClick(d, 0)} width={weeksCount}/>*/}
          <div style={{display: 'flex'}}>
            {[...Array(weeksCount).keys()].map((i, n1) => (
              <div className="calendar-week"
                   key={n1.toString()}>
                {[...Array(7).keys()].map((i, n2) => (
                  <Day date={newDate(start).offsetWeeks(n1).offsetDays(n2)} key={n2} />
                ))}
              </div>
            ))}
          </div>
            {/*<AutoUserCalendar*/}
            {/*  row={row}*/}
            {/*  startDate={start}*/}
            {/*  daysPick={daysPick}*/}
            {/*  onLabelClick={onLabelClick}*/}
            {/*  onDayClick={onDayClick} width={weeksCount}*/}
            {/*  calendars={calendars}*/}
            {/*/>*/}
        </div>
      </div>
  )
}

function AutoUserCalendar({row, startDate, daysPick=[], onLabelClick=() => {}, onDayClick=() => {}, width=38, calendars=[]}) {
  const start = row ? newDate(startDate) : newDate(startDate).monday()
  return (
    row ?
        <RowsCalendar startDate={start} daysPick={daysPick} onLabelClick={onLabelClick} onDayClick={onDayClick} width={width}>
          {calendars}
        </RowsCalendar> :
        <UserCalendar startDate={start} daysPick={daysPick} onClick={d => onDayClick(d, 0)} width={width}/>

  )
}
