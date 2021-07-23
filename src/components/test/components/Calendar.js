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
import TextLine from "./TextLine";
import YearText from "./YearText";
import MonthText from "./MonthText";
import Days from "./Days";
import Day from "./Day/Day";
import Button from "@material-ui/core/Button";

import {
  AddCircle,
  ArrowBackIos,
  Group, Person,
  ViewModule
} from "@material-ui/icons";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemIcon, ListItemSecondaryAction,
  ListItemText,
  Typography
} from "@material-ui/core";
import LazyList from "../../LazyList/LazyList";
import {inject, observer} from "mobx-react";
import UserAvatar from "../../UserAvatar/UserAvatar";
import DeleteIcon from "@material-ui/icons/Delete";
import ActionsPanel from "../../Actions/ActionsPanel/ActionsPanel";
import ActionButton from "../../Actions/ActionButton/ActionButton";
import {toJS} from "mobx";
import TextField from "../../Fields/TextField/TextField";
import TextLoop from "react-text-loop";
import UserFullName from "../../UserFullName/UserFullName";
import CloseButton from "../../CloseButton/CloseButton";
import UserProfile from "../../UserProfile/UserProfile";
import DaysNames from "../../Calendar/components/DaysNames";
import MoneyField from "../../Fields/MoneyField/MoneyField";
import mainStore from "../../../stores/mainStore";
import {useMobile} from "../../hooks";

let getTimeOut

function Calendar (props) {
  // React.component - Календарь
  let ref = useRef(null)
  const weeksOffset = 15  // количество недель за пределами видимого блока в каждую сторону
  const scrollOffset = weekWidth(weeksOffset)  // значение scrollLeft, позволяющее скрыть weeksOffset за пределы блока

  const [state, setState] = useState({
    offset: !props.noOffset,
    loading: true,
    check: 0,
    lastDay: null,
    shift: false,
    multiView: props.multiView
  })
  const [weeks, setWeeks] = useState(<span style={{width: window.innerWidth + scrollOffset}} key={'temp'}/>)
  const [texts, setTexts] = useState({})
  const [content, setContent] = useState({
    days: props.content ? props.content.days || {} : {},
    daysOff: sortSet(props.content ? props.content.daysOff : []),
    daysPick: sortSet(props.content ? props.content.daysPick : []),
  })
  // const fullScreen = useMediaQuery('(max-width:720px)');
  const [usersContent, setUsersContent] = useState({})
  const [users, setUsers] = useState([])
  const [usernames, setUsernames] = useState([])
  // const [dialog, setDialog] = useState({users: false, add: false})
  useEffect(() => {
    if (props.multiView) checkDaysPick(usersContent)
    // eslint-disable-next-line
  }, [usersContent])
  useEffect(() => {
    if (props.multiView) {
      const newUsernames = users.map(user => user.username).filter(username => !username.startsWith('-'))
      if (newUsernames.length === usernames.length) {
        newUsernames.forEach((i, n) => {
          if (usernames[n].username !== i.username) setUsernames(newUsernames)
        })
      }
      else setUsernames(newUsernames)
    }
    // eslint-disable-next-line
  }, [users])
  useEffect(() => {
    if (props.multiView) setUsers(props.usersContent.map(i => i.user))
  }, [props.usersContent])

  // eslint-disable-next-line
  useEffect(firstRender, [])
  // eslint-disable-next-line
  useEffect(refreshWeeks, [props.usersContent, usersContent, content.days, content.daysOff, content.daysPick, state.check, props.edit, props.onDay, state.shift])
  // eslint-disable-next-line
  useEffect(fromPropsToContent, [props.content.days, props.content.daysOff, props.content.daysPick])
  useEffect(fromPropsOffset, [props.noOffset])
  // eslint-disable-next-line
  useEffect(() => newWeeks(undefined, true, 0), [props.triggerNew, state.multiView, usernames])
  // eslint-disable-next-line
  useEffect(() => get(weeks, 0), [props.triggerGet])

  useEffect(() => setContent({
    days: props.content ? props.content.days || {} : {},
    daysOff: sortSet(props.content ? props.content.daysOff : []),
    daysPick: sortSet(props.content ? props.content.daysPick : []),
  // eslint-disable-next-line
  }), [props.triggerClear])
  // eslint-disable-next-line
  useEffect(getTexts, [weeks])

  const [intersection, setIntersection] = useState(false)
  const [el, setEl] = useState(null)
  const [observer, setObserver] = useState(null)

  function changeIntersection(a) {
    if (a[0].isIntersecting) setIntersection(true)
  }

  useEffect(() => {
    if (intersection) newWeeks(weeks, true)
    // eslint-disable-next-line
  }, [intersection])

  // eslint-disable-next-line
  useEffect(newElement, [weeks])

  function newElement() {
    if (observer && el) {
      observer.unobserve(el[0])
      observer.unobserve(el[1])
    }
    setEl([
      ref.current.firstElementChild.firstElementChild,
      ref.current.firstElementChild.lastElementChild,
    ])
  }

  // eslint-disable-next-line
  useEffect(setObservableTarget, [el, observer])

  function setObservableTarget() {
    if (observer && el) {
      observer.observe(el[0])
      observer.observe(el[1])
    }
    setIntersection(false)
  }

  // eslint-disable-next-line
  useEffect(setObservableRoot, [ref.current])

  function setObservableRoot() {
    if (observer) observer.disconnect()
    if (ref.current) setObserver(new IntersectionObserver(changeIntersection, {root: ref.current, threshold: 1.0}))
  }

  function firstRender() {
    const DeltaTouchX = new DeltaTouchClass('x')
    ref.current.addEventListener('wheel', e => wheelScroll(e), {passive: false})
    ref.current.addEventListener('touchstart', e => DeltaTouchX.start(e))
    ref.current.addEventListener('touchmove', e => DeltaTouchX.move(e, touchScroll))
    ref.current.addEventListener('touchend', e => DeltaTouchX.end(e, touchScroll))
    window.addEventListener('resize', () => updateState({check: new Date().getTime()}))
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Shift') updateState({shift: true})
    })
    window.addEventListener('keyup', (e) => {
      if (e.key === 'Shift') updateState({shift: false})
    })

    newWeeks(undefined, true, 0)
    updateState({loading: false})

    return (() => {
      window.removeEventListener('resize', () => updateState({check: new Date().getTime()}))
      window.removeEventListener('keydown', (e) => {
        if (e.key === 'Shift') updateState({shift: true})
      })
      window.removeEventListener('keyup', (e) => {
        if (e.key === 'Shift') updateState({shift: false})
      })
      if (observer) {
        if (observer[0]) observer[0].disconnect()
        if (observer[1]) observer[1].disconnect()
      }
    })
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

  function mMonday(date) {
    return state.multiView ? date : date.monday()
  }

  function mOffset(date, x) {
    return state.multiView ? date.offsetDays(x) : date.offsetWeeks(x)
  }

  function mDiff(date, x) {
    return state.multiView ? date.getDiffDays(x) : date.getDiffWeeks(x)
  }

  function getWeeks(prevWeeks) {
    // получение новых недель
    let weeksCount = weeksCounter(ref.current.clientWidth)  // сколько недель влезает в блок
    const startDate = props.startDate ? newDate(props.startDate) : null  // левая граница
    const endDate = props.endDate ? newDate(props.endDate).offsetDays(7) : null  // правая граница

    // 1 - получаем стартовую дату
    let start = mMonday(newDate())
    if (state.offset && content.daysPick.size > 0) start = mMonday(newDate([...content.daysPick][0]))
    if (prevWeeks) start = newDate(prevWeeks[0].key)

    let leftDate = newDate(start)
    if (!prevWeeks) mOffset(leftDate, -weeksOffset)
    else if (ref.current.scrollLeft === 0) mOffset(leftDate, -weeksOffset)  // влево
    else if (ref.current.scrollLeft === ref.current.scrollWidth - ref.current.clientWidth) mOffset(leftDate, weeksOffset)  // или вправо

    // 3 - обрабатывыаем новую стартовую дату
    if (startDate && leftDate < startDate) leftDate = newDate(startDate)  // если стартовая дата раньше левой границы - сдвигаем стартовую дату до границы
    let scrollLeft = weekWidth(mDiff(start, leftDate))
    if (!prevWeeks && start < leftDate) scrollLeft = 0
    weeksCount += weeksOffset * 2 // увеличиваем длину каленадря

    // 4 - обработчик наличия правой границы
    if (endDate) {
      let rightDate = mOffset(newDate(leftDate), weeksCount)  // вычисляем конечную дату
      if (endDate < rightDate) {  // если она дальше границы
        weeksCount = mDiff(endDate, leftDate)  // считаем новую длину календаря
        // 4.5 - проверка на наличие стартовой даты
        if (startDate) {
          let leftDateFromEnd = mOffset(newDate(endDate), -weeksCount)  // вычисляем стартовую дату от конечной
          if (leftDateFromEnd < startDate) {  // если она раньше левой границы
            leftDateFromEnd = newDate(startDate)  // меняем её
            const offset = mDiff(leftDate, startDate)
            scrollLeft += offset  // сдвигаем скролл
            weeksCount -= offset  // уменьшаем длину календаря
          }
          leftDate = leftDateFromEnd  // обновляем стартовую дату
        }
      }
    }

    // 5 - формируем недели
    let days = []
    for (let i = 0; i < weeksCount; i++) {
      let date = mOffset(newDate(leftDate), i)
      days.push(state.multiView? mWeek(date) : week(date))
    }

    // 6 - скроллим блок и возвращаем новые недели
    if (prevWeeks) scrollLeft += ref.current.scrollLeft
    ref.current.scrollLeft = scrollLeft
    return days
  }

  function getTexts(newWeeks = weeks) {
    if (!Array.isArray(newWeeks)) return
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
      let date = mOffset(newDate(start), i)
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

    setTexts({
      years: years,
      months: months
    })
  }

  function mWeek(date) {
    const fDate = date.format()
    let daysList = []
    for (const i of props.usersContent) {
      const username = i.user.username
      const day = {
        info: usersContent[username] ? usersContent[username].days[fDate] || null : null,
        off: usersContent[username] ? usersContent[username].daysOff.has(fDate) : false,
        pick: i.dates.includes(fDate)
      }
      daysList.push(<Day date={date} key={username} {...day}
                         onClick={(v) => onDayClickUser(v, username)} {...props.onDay} noLabel/>)
    }

    return (
      <div className="calendar-week"
           key={date.format()}>
        <Day date={date} key={fDate} pick={content.daysPick.has(fDate)} onClick={onDayClick}/>
        {daysList}
      </div>
    )
  }

  function week(start) {
    // неделя, начиная со start
    let daysList = []
    for (let i = 0; i < 7; i++) {
      let date = newDate(start).offsetDays(i)
      const fDate = date.format()
      const day = {
        info: (props.multiView ? usersContent[props.username].days[fDate] : content.days[fDate]) || null,
        off: props.multiView ? usersContent[props.username].daysOff.has(fDate) : content.daysOff.has(fDate),
        pick: props.multiView ? usersContent[props.username].daysPick.has(fDate) : content.daysPick.has(fDate)
      }
      if ((props.startDate && fDate < props.startDate) || (props.endDate && fDate > props.endDate)) daysList.push(<div
        className={'calendar-day hidden'} key={fDate}/>)
      else daysList.push(<Day date={date} key={fDate} {...day} onClick={props.multiView ? (v) => onDayClickUser(v, props.username) : onDayClick} {...props.onDay}/>)
    }

    return (
      <div className="calendar-week"
           key={start.format()}>
        {daysList}
      </div>
    )
  }

  function onDayClickUser(date, username) {
    // Нажатие на день
    if (!props.edit) return
    const fDate = date.format()
    let set = new Set(usersContent[username].daysPick)
    let pick = false
    let array
    if (state.lastDay && state.shift) {
      if (set.has(state.lastDay)) pick = true
      array = dateRange(state.lastDay, fDate).filter((day) => day !== state.lastDay)
      for (const d of array) {
        pick ? set.add(d) : set.delete(d)
      }
    } else {
      if (!set.has(fDate)) pick = true
      pick ? set.add(fDate) : set.delete(fDate)
    }
    set = sortSet(set)
    if (props.maxPick && set.size > props.maxPick) {
      props.onError('Превышено количество выбираемых дат')
      return
    }
    updateState({lastDay: fDate})
    const newUsers = {...usersContent}
    newUsers[username] = {...newUsers[username], daysPick: set}
    setUsersContent(newUsers)
  }

  function checkDaysPick(u) {
    let set = []
    for (const user of Object.keys(u)) {
      set = new Set([...set, ...u[user].daysPick])
    }
    set = sortSet(set)

    const f = prevState => ({...prevState, daysPick: set})
    props.setContent ? props.setContent(f) : setContent(f)
    props.onChange(users.map(user => ({user: user, dates: [...usersContent[user.username].daysPick]})), [...set])
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
        pick ? set.add(d) : set.delete(d)
      }
    } else {
      if (!set.has(fDate)) pick = true
      pick ? set.add(fDate) : set.delete(fDate)
    }
    set = sortSet(set)
    if (props.maxPick && set.size > props.maxPick) {
      props.onError('Превышено количество выбираемых дат')
      return
    }
    updateState({lastDay: fDate})
    if (props.multiView) {
      const newUsers = {...usersContent}
      for (const username of Object.keys(usersContent)) {
        for (const d of array || [fDate]) {
          pick ? newUsers[username].daysPick.add(d) : newUsers[username].daysPick.delete(d)
        }
      }
      setUsersContent(newUsers)
    }
    else {
      const f = prevState => ({...prevState, daysPick: set})
      props.setContent ? props.setContent(f) : setContent(f)
      props.onChange([...set], (array || [fDate]), pick)
    }
  }

  function updateContent(result, start, end) {
    const clearContent = (oldContent) => {
      let content
      if (oldContent instanceof Set) {
        if (!oldContent.size) return oldContent
        content = new Set([...oldContent])
      } else {
        if (!Object.keys(oldContent).length) return oldContent
        content = JSON.parse(JSON.stringify(oldContent))
        if (Array.isArray(content)) content = new Set(content)
      }
      if (start && end) {
        let date = newDate(start)
        while (date.getTime() <= end.getTime()) {
          (content instanceof Set) ? content.delete(date.format()) : delete content[date.format()]
          date.offsetDays(1)
        }
      }
      return content
    }


    const newUsers = {...usersContent}

    for (const [username, newData] of Object.entries(result)) {
      if (username === 'error') return

      if (props.multiView) {
        const oldData = newUsers[username]
        if (oldData) {
          newUsers[username] = {
            ...oldData,
            days: newData.days ? {...clearContent(oldData.days), ...newData.days} : oldData.days,
            daysOff: newData.daysOff ? sortSet([...clearContent(oldData.daysOff), ...newData.daysOff]) : oldData.daysOff,
            daysPick: newData.daysPick ? sortSet([...clearContent(oldData.daysPick), ...newData.daysPick]) : oldData.daysPick
          }
        } else {
          newUsers[username] = {
            days: newData.days ? newData.days : {},
            daysOff: newData.daysOff ? sortSet(newData.daysOff) : sortSet(),
            daysPick: newData.daysPick ? sortSet(newData.daysPick) : sortSet()
          }
        }

        setUsersContent(newUsers)
      } else {
        const f = prevState => ({
          ...prevState,
          days: newData.days ? {...clearContent(prevState.days), ...newData.days} : prevState.days,
          daysOff: newData.daysOff ? sortSet([...clearContent(prevState.daysOff), ...newData.daysOff]) : prevState.daysOff,
          daysPick: newData.daysPick ? sortSet([...clearContent(prevState.daysPick), ...newData.daysPick]) : prevState.daysPick
        })
        props.setContent ? props.setContent(f) : setContent(f)
      }
    }
  }

  function get(weeks, timeout = 500, usersList = usernames) {
    // GET
    if (!weeks || !weeks[0] || !weeks[0].key) return
    clearTimeout(getTimeOut)
    const start = newDate(weeks[0].key)
    const end = newDate(weeks[weeks.length - 1].key)
    getTimeOut = setTimeout(() => {
      if (props.get) {
        if (props.multiView && usersList.length) props.get(start, end, usersList).then((result) => updateContent(result, start, end))
        else if (!props.multiView) props.get(start, end).then((result) => updateContent(result, start, end))
      }
    }, timeout)
  }

  function reset() {
    // нажатие на ButtonScroll - reset state
    newWeeks(undefined, true)
    if (!props.noOffset) setState(prevState => ({...prevState, offset: !prevState.offset}))
  }

  function refreshWeeks() {
    // обновление недель
    setWeeks(prevState => getWeeks(prevState))
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

  function newWeeks(weeks, download = false, timeout) {
    const newWeeks = getWeeks(weeks)
    if (download && props.get) get(newWeeks, timeout)
    setWeeks(newWeeks)
  }

  function add(user, daysPick) {
    let newUsers = {...usersContent}
    newUsers[user.username] = {
      days: {},
      daysOff: sortSet([]),
      daysPick: sortSet(daysPick || []),
    }
    setUsersContent(newUsers)
    setUsers([...users, user].sort((a,b) => (a.full_name > b.full_name) ? 1 : ((b.full_name > a.full_name) ? -1 : 0)))
  }

  function replace(user, oldUser) {
    let newUsers = {...usersContent}
    newUsers[user.username] = {...newUsers[oldUser.username]}
    delete newUsers[oldUser.username]
    setUsersContent(newUsers)
    setUsers([...users.filter(u => u.username !== oldUser.username), user].sort((a,b) => (a.full_name > b.full_name) ? 1 : ((b.full_name > a.full_name) ? -1 : 0)))
  }

  function del(user) {
    let newUsers = {...usersContent}
    delete newUsers[user.username]
    setUsers(users.filter(u => u.username !== user.username))
    setUsersContent(newUsers)
  }

  function onMultiViewClick() {
    updateState({multiView: !state.multiView})
  }

  return (<>
    <div className={"calendar-block" + (state.loading ? " hidden" : "")}>
      <div className="calendar-left">
        <div style={{height: 40, display: "flex", flexDirection: 'column-reverse', alignItems: 'center', alignSelf: "flex-end", paddingRight: 2}}>
          <ButtonScroll onClick={reset}/>
          {!!props.username && !!users.find(user => user.username === props.username) && <div className="calendar-button-scroll" style={{padding: 0}}>
            <ViewModule style={{height: 20, width: 20}} onClick={onMultiViewClick}/>
          </div>}
        </div>
        <div style={{display: 'flex', flexDirection: 'column', margin: 1}}>
          {state.multiView ? props.multi
          //   <>
          // <Button style={{height: 22, fontSize: 12, margin: 1, whiteSpace: "nowrap", flexGrow: 1}} variant={"outlined"}
          //         onClick={() => setDialog({users: true, add: false})}>
          //   <Group/>
          // </Button>
          // {users.map(user => <UserButton user={user} onClick={setDialog} key={user.username}/>)}
          //   </>
            :
            <DaysNames/>
          }
        </div>
      </div>
      <div className="calendar-right">
        <TextLine children={texts.years}/>
        <TextLine children={texts.months}/>
        <div className="calendar-scroll"
             onScroll={() => getTexts()}
             ref={ref}>
          <Days>
            {weeks}
          </Days>
        </div>
      </div>
    </div>
    {/*<UsersDialog open={dialog.users} users={users} close={() => setDialog({users: false, add: false})} del={del}*/}
    {/*             add={add} replace={replace} days={[...content.daysPick]} fullScreen={fullScreen} usersContent={usersContent}/>*/}
    {/*<UserDialog user={dialog.user} onClose={() => setDialog({users: false, add: false})} fullScreen={fullScreen}/>*/}
  </>)
}


Calendar.propTypes = propTypes
Calendar.defaultProps = defaultProps
export default Calendar



function UsersDialog({open, users=[], close, del, add, days, replace, usersContent}) {
  const [addUser, setAddUser] = useState(false)

  const fullScreen = useMobile()

  const onClose = () => {
    setAddUser(false)
    close()
  }

  const text = users.length ? (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <span>Участники проекта</span>
      <Typography variant={"caption"} align={'center'}>Выбери участника для замены</Typography>
    </div>
  ) : 'Участники проекта'

  const Actions = (
    <ActionsPanel
      bottom={fullScreen}
      left={<ActionButton
        onClick={close}
        label="Назад"
        icon={<ArrowBackIos/>}
      />}
      right={<ActionButton
        className={!users.length ? 'pulse' : undefined}
        onClick={() => setAddUser(true)}
        label="Добавить"
        icon={<AddCircle/>}
      />}
      center={fullScreen ? text : undefined}
    />
  )

  return (
    <Dialog open={open} maxWidth={"sm"} onClose={onClose} fullScreen={fullScreen} fullWidth>
      {addUser ? <AddUserDialog
        users={users}
        close={() => setAddUser(false)}
        addClick={add}
        replaceClick={replace}
        days={typeof addUser !== 'boolean' ? [...usersContent[addUser.username].daysPick] : days}
        fullScreen={fullScreen}
        replaceUser={typeof addUser !== 'boolean' ? addUser : undefined}
      /> : <>
        <DialogTitle>{!fullScreen ? Actions : text}</DialogTitle>
        <DialogContent>
          <List dense>
            {users.length ? users.map(user => (
              <ListItem button key={user.username} onClick={() => setAddUser(user)}>
                <ListItemIcon style={{minWidth: "unset", paddingRight: 8}}>
                  {user.username.startsWith('-') ?
                    <UserAvatar/> :
                    <UserAvatar {...user}/>
                  }
                </ListItemIcon>
                <ListItemText primary={user.full_name} style={{wrap: "no-wrap"}}/>
                <ListItemSecondaryAction>
                  <IconButton size={"small"} onClick={() => del(user)}>
                    <DeleteIcon/>
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            )) : <Typography variant={"body2"} align={"center"}>В проекте нет участников</Typography>}
          </List>
        </DialogContent>
        {fullScreen && Actions}
      </>}
    </Dialog>
  )
}


function AddUserDialogComponent({users=[], close, f, addClick, days, fullScreen, replaceUser, replaceClick}) {
  const {list, set, add} = f
  const [daysPick, setDaysPick] = useState(days && days.length? days : null)
  const [create, setCreate] = useState(false)

  const text = replaceUser ?
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <span>Заменить участника</span>
      <Typography variant={"caption"} align={'center'}>{replaceUser.full_name}</Typography>
    </div> : 'Добавить участника'

  const Actions = (
    <ActionsPanel
      bottom={fullScreen}
      left={<ActionButton
        onClick={close}
        label="Назад"
        icon={<ArrowBackIos/>}
      />}
      right={<ActionButton
        onClick={() => setCreate(true)}
        label="Создать"
        icon={<AddCircle/>}
      />}
      center={fullScreen ? text : undefined}
    />
  )

  const onClick = (user) => {
      if (replaceUser) {
        replaceClick(toJS(user), replaceUser)
        close()
      }
      else addClick(toJS(user), daysPick)
  }

  return (
    <>
      {create? <CreateUser fullScreen={fullScreen} add={onClick} close={() => setCreate(false)} users={users} replaceUser={replaceUser}/> : <>
        <DialogTitle>{!fullScreen ? Actions : text}</DialogTitle>
        <DialogContent>
          <LazyList
            searchFieldParams={{
              set: set,
              placeholder: "Кого искать?",
              autoFocus: true,
              minFilter: 3,
              helperText: 'Введи имя, телефон или специализацию',
              initDays: daysPick,
              onChangeDays: (v) => setDaysPick(v)
            }}
            add={add}
            getLink={'users'}
          >
            {!!list && list.filter(user => !users.map(user => user.username).includes(user.username)).map(user => (
              <ListItem button key={user.username} onClick={() => onClick(user)}>
                <ListItemIcon style={{minWidth: "unset", paddingRight: 8}}>
                  <UserAvatar {...user}/>
                </ListItemIcon>
                <ListItemText primary={user.full_name} style={{wrap: "no-wrap"}} secondary={
                  <TextLoop children={user.tags.map(tag => tag.title)} springConfig={{stiffness: 180, damping: 8}} className={'text-loop'}/>
                }/>
              </ListItem>
            ))}
          </LazyList>
        </DialogContent>
        {fullScreen && Actions}
      </>}
    </>
  )
}

const AddUserDialog = inject(stores => ({
  f: stores.SearchPageStore.f,
}))(observer(AddUserDialogComponent))


function CreateUser({fullScreen, add, close, replaceUser}) {
  const [value, setValue] = useState('')

  const toUser = () => ({
    username: '-' + new Date().getTime(),
    full_name: value
  })

  const text = replaceUser ?
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <span>Создать участника</span>
      <Typography variant={"caption"} align={'center'}>{'Заменить ' + replaceUser.full_name}</Typography>
    </div> : 'Создать участника'

  const Actions =(
    <ActionsPanel
      bottom={fullScreen}
      left={<ActionButton
        onClick={close}
        label="Назад"
        icon={<ArrowBackIos/>}
      />}
      right={<ActionButton
        onClick={() => {
          add(toUser())
          close()
        }}
        label="Добавить"
        disabled={!value.length}
        icon={<AddCircle/>}
      />}
      center={fullScreen ? text : undefined}
    />
  )

  return (<>
    <DialogTitle>{!fullScreen ? Actions : text}</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        value={value}
        onChange={e => setValue(e.target.value)}
        label={"Имя"}
        onKeyUp={(e) => {
          if (!value.length) return
          if (e.key === 'Enter') {
            add(toUser())
            close()
          }
        }}
      />
    </DialogContent>
    {fullScreen && Actions}
  </>)
}

function UserButton({user, onClick}) {
  const real = !user.username.startsWith('-')
  return (
    <Button
      style={{height: 22, fontSize: 12, margin: 1, whiteSpace: "nowrap"}}
      variant={"outlined"}
      startIcon={real ? <Person/> : undefined}
      onClick={real? () => onClick(prevState => ({...prevState, user: user})) : undefined}
    >
      {user.full_name}
    </Button>
  )
}

function UserDialog({user, onClose, fullScreen}) {
  const [value, setValue] = useState({
    money: null,
    money_calculating: false,
    money_per_day: null
  })

  const set = (obj) => setValue(prevState => ({...prevState, ...obj}))

  return (
    <Dialog open={!!user} maxWidth={"sm"} onClose={onClose} fullWidth fullScreen={fullScreen}>
      {!!user && <>
      <DialogTitle>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <UserFullName user={user} avatar={'left'}/>
          <CloseButton onClick={onClose}/>
        </div>
      </DialogTitle>
      <DialogContent style={{padding: 8}}>
        <div style={{padding: "0 16px"}}>
          <MoneyField {...value} setValue={set}/>
        </div>
        <UserProfile user={user}/>
      </DialogContent>
      </>}
    </Dialog>
  )
}

export function UsersList({projects, project, onChange, setProject}) {
  const [dialog, setDialog] = useState(null)
  const [addUser, setAddUser] = useState(false)
  const sortFn = (a, b) => (a.user.full_name > b.user.full_name) ? 1 : ((b.user.full_name > a.user.full_name) ? -1 : 0)
  const fullScreen = useMobile()
  const onClose = () => {
    setAddUser(false)
    setDialog(null)
  }

  function add(user, dates) {
    const newProject = {
      user: user,
      dates: dates || []
    }
    onChange([...projects, newProject].sort(sortFn))
  }

  function replace(newUser, oldUser) {
    projects.find(i => i.user.username === oldUser.username).user = newUser
    onChange([...projects].sort(sortFn))
  }

  function del(project) {
    onChange(projects.filter(i => i.user.username !== project.user.username))
  }

  function projectChange(obj) {
    const newProject = {...dialog, ...obj}
    replace(newProject, dialog)
    setDialog(newProject)
  }

  function onProjectClick(project) {
    setProject(toJS(mainStore.ProjectStore))
    mainStore.ProjectStore.setProject(project)
    setDialog(project)
  }

  function onProjectClose() {
    replace(toJS(mainStore.ProjectStore), dialog)
    onClose()
    mainStore.ProjectStore.setProject(project)
  }

  return (<>
    <Button style={{height: 22, fontSize: 12, margin: 1, whiteSpace: "nowrap", flexGrow: 1}} variant={"outlined"}
            onClick={() => setDialog('users')}>
      <Group/>
    </Button>
    {projects.map(p => <UserButton2 project={p} onClick={onProjectClick} key={p.user.username}/>)}
    <Dialog open={!!dialog} maxWidth={"sm"} onClose={onClose} fullWidth fullScreen={fullScreen}>
      {dialog === 'users' && <>
        {addUser ?
          <AddUserDialog2
            fullScreen={fullScreen}
            addClick={add}
            replaceClick={replace}
            close={() => setAddUser(false)}
            days={typeof addUser !== 'boolean' ? [...addUser.dates] : projects.dates}
            replaceUser={typeof addUser !== 'boolean' ? addUser.user : undefined}
            filter={i => !projects.map(i => i.user.username).includes(i.username)}
          /> :
          <UsersDialog2
            fullScreen={fullScreen}
            addClick={setAddUser}
            close={() => setDialog(null)}
            del={del}
            projects={projects}
          />
        }
        {!!dialog && dialog !== 'users' && <UserProjectDialog
          project={dialog}
          close={onProjectClose}
          onChange={projectChange}
        />}
      </>}
    </Dialog>
  </>)
}

function UserButton2({project, onClick}) {
  const real = !project.user.username.startsWith('-')
  return (
    <Button
      style={{height: 22, fontSize: 12, margin: 1, whiteSpace: "nowrap"}}
      variant={"outlined"}
      startIcon={real ? <Person/> : undefined}
      onClick={real? () => onClick(project) : undefined}
    >
      {project.user.full_name}
    </Button>
  )
}

function UsersDialog2({fullScreen, addClick, projects, del, close}) {
  const text = projects.length ? (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <span>Участники проекта</span>
      <Typography variant={"caption"} align={'center'}>Выбери участника для замены</Typography>
    </div>
  ) : 'Участники проекта'

  const Actions = (
    <ActionsPanel
      bottom={fullScreen}
      left={<ActionButton
        onClick={close}
        label="Назад"
        icon={<ArrowBackIos/>}
      />}
      right={<ActionButton
        className={!projects.length ? 'pulse' : undefined}
        onClick={() => addClick(true)}
        label="Добавить"
        icon={<AddCircle/>}
      />}
      center={fullScreen ? text : undefined}
    />
  )

  return (<>
    <DialogTitle>{!fullScreen ? Actions : text}</DialogTitle>
    <DialogContent>
      <List dense>
        {projects.length ? projects.map(i => (
          <ListItem button key={i.user.username} onClick={() => addClick(i)}>
            <ListItemIcon style={{minWidth: "unset", paddingRight: 8}}>
              {i.user.username.startsWith('-') ?
                <UserAvatar/> :
                <UserAvatar {...i.user}/>
              }
            </ListItemIcon>
            <ListItemText primary={i.user.full_name} style={{wrap: "no-wrap"}}/>
            <ListItemSecondaryAction>
              <IconButton size={"small"} onClick={() => del(i)}>
                <DeleteIcon/>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        )) : <Typography variant={"body2"} align={"center"}>В проекте нет участников</Typography>}
      </List>
    </DialogContent>
    {fullScreen && Actions}
  </>)
}

function UserProjectDialog({project, close}) {

  return (<>
    <DialogTitle>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <UserFullName user={project.user} avatar={'left'}/>
        <CloseButton onClick={close}/>
      </div>
    </DialogTitle>
    <DialogContent style={{padding: 8}}>
      <div style={{padding: "0 16px"}}>
        <MoneyField />
      </div>
      <UserProfile user={project.user}/>
    </DialogContent>
  </>)
}


function AddUserDialogComponent2({close, f, addClick, days, fullScreen, replaceUser, replaceClick, filter}) {
  const {list, set, add} = f
  const [daysPick, setDaysPick] = useState(days && days.length? days : null)
  const [create, setCreate] = useState(false)

  const text = replaceUser ?
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <span>Заменить участника</span>
      <Typography variant={"caption"} align={'center'}>{replaceUser.full_name}</Typography>
    </div> : 'Добавить участника'

  const Actions = (
    <ActionsPanel
      bottom={fullScreen}
      left={<ActionButton
        onClick={close}
        label="Назад"
        icon={<ArrowBackIos/>}
      />}
      right={<ActionButton
        onClick={() => setCreate(true)}
        label="Создать"
        icon={<AddCircle/>}
      />}
      center={fullScreen ? text : undefined}
    />
  )

  const onClick = (user) => {
    if (replaceUser) {
      replaceClick(toJS(user), replaceUser)
      close()
    }
    else addClick(toJS(user), daysPick)
  }

  return (
    <>
      {create? <CreateUser fullScreen={fullScreen} add={onClick} close={() => setCreate(false)} replaceUser={replaceUser}/> : <>
        <DialogTitle>{!fullScreen ? Actions : text}</DialogTitle>
        <DialogContent>
          <LazyList
            searchFieldParams={{
              set: set,
              placeholder: "Кого искать?",
              autoFocus: true,
              minFilter: 3,
              helperText: 'Введи имя, телефон или специализацию',
              initDays: daysPick,
              onChangeDays: (v) => setDaysPick(v)
            }}
            add={add}
            getLink={'users'}
          >
            {!!list && list.filter(filter).map(user => (
              <ListItem button key={user.username} onClick={() => onClick(user)}>
                <ListItemIcon style={{minWidth: "unset", paddingRight: 8}}>
                  <UserAvatar {...user}/>
                </ListItemIcon>
                <ListItemText primary={user.full_name} style={{wrap: "no-wrap"}} secondary={
                  <TextLoop children={user.tags.map(tag => tag.title)} springConfig={{stiffness: 180, damping: 8}} className={'text-loop'}/>
                }/>
              </ListItem>
            ))}
          </LazyList>
        </DialogContent>
        {fullScreen && Actions}
      </>}
    </>
  )
}

const AddUserDialog2 = inject(stores => ({
  f: stores.SearchPageStore.f,
}))(observer(AddUserDialogComponent2))
