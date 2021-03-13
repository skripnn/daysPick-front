import React, {useEffect, useRef, useState} from "react";

import {propTypes, defaultProps} from '../extention/propTypes'
import '../extention/Calendar.css'
import "../extention/date"
import {getMonth, newDate, dateRange} from "../extention/date";
import sortSet from "../extention/sortSet";
import weeksCounter from "../extention/weeksCounter";
import weekWidth from "../extention/weekWidth";
import DeltaTouchClass from "../extention/deltaTouch";

import ButtonScroll from "./ButtonScroll";
import DaysNames from "./DaysNames";
import TextLine from "./TextLine";
import YearText from "./YearText";
import MonthText from "./MonthText";
import Days from "./Days";
import Day from "./Day/Day";

let getTimeOut
let DeltaTouchX

function Calendar (props) {
  // React.component - Календарь
  let ref = useRef(null)
  const weeksOffset = 15  // количество недель за пределами видимого блока в каждую сторону
  const scrollOffset = weekWidth(weeksOffset)  // значение scrollLeft, позволяющее скрыть weeksOffset за пределы блока

  const [state, setState] = useState({
    weeks: <span style={{width: window.innerWidth + scrollOffset}} key={'temp'}/>,
    texts: {},

    offset: !props.noOffset,
    loading: true,
    check: 0,
    lastDay: null,
    shift: false
  })
  let [content, setContent] = useState({
    days: props.content ? props.content.days || {} : {},
    daysOff: sortSet(props.content ? props.content.daysOff : []),
    daysPick: sortSet(props.content ? props.content.daysPick : []),
  })
  // eslint-disable-next-line
  useEffect(firstRender, [])
  // eslint-disable-next-line
  useEffect(refreshWeeks, [content.days, content.daysOff, content.daysPick, state.check, props.edit, props.onDay, state.shift])
  // eslint-disable-next-line
  useEffect(fromPropsToContent, [props.content.days, props.content.daysOff, props.content.daysPick])
  useEffect(fromPropsOffset, [props.noOffset])
  // eslint-disable-next-line
  useEffect(() => newWeeks(undefined, true, 0), [props.triggerNew])
  // eslint-disable-next-line
  useEffect(() => get(state.weeks, 0), [props.triggerGet])

  function firstRender() {
    DeltaTouchX = new DeltaTouchClass('x')
    ref.current.addEventListener('wheel', e => wheelScroll(e), {passive: false})
    ref.current.addEventListener('touchstart', e => DeltaTouchX.start(e))
    ref.current.addEventListener('touchmove', e => DeltaTouchX.move(e, touchScroll))
    ref.current.addEventListener('touchend', e => DeltaTouchX.end(e, touchScroll))
    window.addEventListener('resize', () => updateState({check: new Date().getTime()}))
    window.addEventListener('keydown', (e) => {if (e.key === 'Shift') updateState({shift: true})})
    window.addEventListener('keyup', (e) => {if (e.key === 'Shift') updateState({shift: false})})

    newWeeks(undefined, true, 0)
    updateState({loading: false})
  }

  function updateState(obj) {
    // обновление state
    setState(prevState => ({
      ...prevState,
      ...obj
    }))
  }

  function fromPropsToContent() {
    // обновление при смене props.content
    if (props.content && props.setContent) {
      setContent({
        days: props.content.days || content.days,
        daysOff: sortSet(props.content.daysOff || content.daysOff),
        daysPick: sortSet(props.content.daysPick || content.daysPick),
      })
    }
  }



  function fromPropsOffset() {
    // обновление при смене props.noOffset
    updateState({offset: !props.noOffset})
  }

  function getWeeks(prevWeeks) {
    // получение новых недель
    let weeksCount = weeksCounter(ref.current.clientWidth)  // сколько недель влезает в блок
    const startDate = props.startDate? newDate(props.startDate).monday() : null  // левая граница
    const endDate = props.endDate? newDate(props.endDate).monday().offsetDays(7) : null  // правая граница

    // 1 - получаем стартовую дату
    let start = newDate().monday()
    if (state.offset && content.daysPick.size > 0) start = newDate([...content.daysPick][0]).monday()
    if (prevWeeks) start = newDate(prevWeeks[0].key)

    let leftDate = newDate(start)
    if (!prevWeeks) leftDate.offsetWeeks(-weeksOffset)
    else if (ref.current.scrollLeft === 0) leftDate.offsetWeeks(-weeksOffset)  // влево
    else if (ref.current.scrollLeft === ref.current.scrollWidth - ref.current.clientWidth) leftDate.offsetWeeks(weeksOffset)  // или вправо

    // 3 - обрабатывыаем новую стартовую дату
    if (startDate && leftDate < startDate) leftDate = newDate(startDate)  // если стартовая дата раньше левой границы - сдвигаем стартовую дату до границы
    let scrollLeft = weekWidth(start.getDiffWeeks(leftDate))
    if (!prevWeeks && start < leftDate) scrollLeft = 0
    weeksCount += weeksOffset * 2 // увеличиваем длину каленадря

    // 4 - обработчик наличия правой границы
    if (endDate) {
      let rightDate = newDate(leftDate).offsetWeeks(weeksCount)  // вычисляем конечную дату
      if (endDate < rightDate) {  // если она дальше границы
        weeksCount = endDate.getDiffWeeks(leftDate)  // считаем новую длину календаря
        // 4.5 - проверка на наличие стартовой даты
        if (startDate) {
          let leftDateFromEnd = newDate(endDate).offsetWeeks(-weeksCount)  // вычисляем стартовую дату от конечной
          if (leftDateFromEnd < startDate) {  // если она раньше левой границы
            leftDateFromEnd = newDate(startDate)  // меняем её
            const offset = leftDate.getDiffWeeks(startDate)
            scrollLeft += offset  // сдвигаем скролл
            weeksCount -= offset  // уменьшаем длину календаря
          }
          leftDate = leftDateFromEnd  // обновляем стартовую дату
        }
      }
    }

    // 5 - формируем недели
    let weeks = []
    for (let i = 0; i < weeksCount; i++) {
      let date = newDate(leftDate).offsetWeeks(i)
      weeks.push(week(date))
    }

    // 6 - скроллим блок и возвращаем новые недели
    if (prevWeeks) scrollLeft += ref.current.scrollLeft
    ref.current.scrollLeft = scrollLeft
    return weeks
  }

  function getTexts(newWeeks=state.weeks) {
    // получение новых текстовых компонентов
    let years = []
    let months = []
    let tempYear = {}
    let tempMonth = {}
    let textWidth = 0

    let mainWidth = ref.current.clientWidth
    let scrollLeft = ref.current.scrollLeft
    let wCount = weeksCounter(mainWidth)
    if (newWeeks && weekWidth(newWeeks.length) < mainWidth) mainWidth = weekWidth(newWeeks.length)
    let startIndex = weeksCounter(scrollLeft)
    let offset = scrollLeft % weekWidth()
    if (offset) {
      startIndex -= 1
      wCount += 1
    }
    let start = newDate(newWeeks[startIndex].key)


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

  function week(start) {
    // неделя, начиная со start
    let daysList = []
    for (let i = 0; i < 7; i++) {
      let date = newDate(start).offsetDays(i)
      const fDate = date.format()
      const day = {
        info: content.days[fDate] || null,
        off: content.daysOff.has(fDate),
        pick: content.daysPick.has(fDate)
      }
      if ((props.startDate && fDate < props.startDate) || (props.endDate && fDate > props.endDate)) daysList.push(<div className={'calendar-day hidden'} key={fDate}/>)
      else daysList.push(<Day date={date} key={fDate} {...day} onClick={onDayClick} {...props.onDay}/>)
    }

    return (
      <div className="calendar-week"
           key={start.format()}>
        {daysList}
      </div>
    )
  }

  function onDayClick(date) {
    // Нажатие на день
    if (!props.edit) return
    const fDate = date.format()
    let set = new Set(content.daysPick)
    let pick = false
    let array
    if (state.lastDay && state.shift) {
      if (set.has(state.lastDay)) pick = true
      array = dateRange(state.lastDay, fDate).filter((day) => day !== state.lastDay)
      for (const d of array) {
        pick? set.add(d) : set.delete(d)
      }
    }
    else {
      if (!set.has(fDate)) pick = true
      pick? set.add(fDate) : set.delete(fDate)
    }
    set = sortSet(set)
    updateState({lastDay: fDate})
    const f = prevState => ({...prevState, daysPick: set})
    props.setContent? props.setContent(f) : setContent(f)
    props.onChange([...set], (array || [fDate]), pick)
  }

  function updateContent(result, start, end) {

    const clearContent = (oldContent) => {
      let content
      if (oldContent instanceof Set) {
        if (!oldContent.size) return oldContent
        content = new Set(oldContent)
      }
      else {
        if (!Object.keys(oldContent).length) return oldContent
        content = JSON.parse(JSON.stringify(oldContent))
      }
      if (start && end) {
        let date = newDate(start)
        while (date.getTime() <= end.getTime()) {
          delete content[date.format()]
          date.offsetDays(1)
        }
      }
      return content
    }

    const f = prevState => ({
      ...prevState,
      days: result.days ? {...clearContent(prevState.days), ...result.days} : prevState.days,
      daysOff: result.daysOff ? sortSet([...clearContent(prevState.daysOff), ...result.daysOff]) : prevState.daysOff,
      daysPick: result.daysPick ? sortSet([...clearContent(prevState.daysPick), ...result.daysPick]) : prevState.daysPick
    })
    props.setContent? props.setContent(f) : setContent(f)
  }

  function get(weeks, timeout=500) {
    // GET
    if (!weeks || !weeks[0] || !weeks[0].key) return
    clearTimeout(getTimeOut)
    const start = newDate(weeks[0].key)
    const end = newDate(start).offsetWeeks(weeks.length).offsetDays(-1)
    getTimeOut = setTimeout(() => {
      if (props.get) props.get(start, end).then((result) => updateContent(result, start, end))
    }, timeout)
  }

  function reset() {
    // нажатие на ButtonScroll - reset state
    newWeeks(undefined, true)
    if (!props.noOffset) setState(prevState => ({...prevState, offset: !prevState.offset}))
  }

  function refreshWeeks() {
    // обновление недель
    setState(prevState => ({...prevState, weeks: getWeeks(prevState.weeks)}))
  }


  function wheelScroll(e) {
    // обработчик прокрутки колёсиком мыши
    e.preventDefault()
    let delta = e.deltaX + e.deltaY
    ref.current.scrollLeft += delta
  }

  function touchScroll(delta) {
    // обработчик прокрутки пррикосновением
    if (!ref.current) return
    ref.current.scrollLeft += delta
  }

  function onScroll() {
    // реакция на скролл
    if (ref.current.scrollLeft === 0 || ref.current.scrollLeft === ref.current.scrollWidth - ref.current.clientWidth) {
      newWeeks(state.weeks, true)
    }
    else {
      updateState({
        texts: getTexts()
      })
    }
  }

  function newWeeks(weeks, download=false, timeout) {
    const newWeeks = getWeeks(weeks)
    if (download && props.get) get(newWeeks, timeout)
    updateState({
      texts: getTexts(newWeeks),
      weeks: newWeeks
    })
  }

  return (
    <div className={"calendar-block" + (state.loading? " hidden": "")}>
      <div className="calendar-left">
        <ButtonScroll onClick={reset}/>
        <DaysNames/>
      </div>
      <div className="calendar-right">
        <TextLine children={state.texts.years}/>
        <TextLine children={state.texts.months}/>
        <div className="calendar-scroll"
             onScroll={onScroll}
             ref={ref}>
          <Days children={state.weeks}/>
        </div>
      </div>
    </div>
  )
}


Calendar.propTypes = propTypes
Calendar.defaultProps = defaultProps
export default Calendar