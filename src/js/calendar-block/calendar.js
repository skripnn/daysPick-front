import React, {useEffect} from "react";
import "../functions/date"
import pick from "../functions/pick";
import IconButton from "@material-ui/core/IconButton";
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import "./calendar.css"

export function Calendar(props) {
  // React.Component - Календарь
  console.log(props)
  let dblClick
  let shiftDaysStart
  let shiftDaysEnd
  let touch = false
  let touchTimer
  let scrollTimer
  let days = props.days || {}
  let daysOff = props.daysOff || []
  let daysPick = props.daysPick? props.daysPick.slice() : []
  let noScroll = false

  function DaysNames() {
    // React.component - Названия дней недели
    const Days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    return (
      <div className="calendar-days-names">
        {Days.map((day) => <div key={day}>{day}</div>)}
      </div>
    )
  }

  function ButtonScroll() {
    // React.component - кнопка быстрой перемотки
    function onClick() {
      // Нажатие на кнопку - сброс календаря на начальное состояние
      const main = document.querySelector("div.calendar-days")
      const firstID = main.firstElementChild.firstElementChild.id
      const scroll = main.scrollLeft
      main.innerHTML = ""
      main.scrollLeft = 0
      filling()
      startScroll()
      if (main.scrollLeft === scroll &&main.firstElementChild.firstElementChild.id === firstID) {
        // Исключение, если второе нажатие кнопки подряд - перемотка на сегодня
        main.scrollTo(main.scrollLeft - (main.scrollLeft % 24), 0)
        let first = main.children[main.scrollLeft / 24].firstElementChild.id
        let weekDiff = new Date(first).getDiffWeeks(new Date())
        let x = weekDiff * 24
        while (x > 0) {
          let scroll = main.scrollLeft
          main.scrollTo(main.scrollLeft - x, 0)
          x -= (scroll - main.scrollLeft)
          onScroll()
        }
        while (x < 0) {
          let scroll = main.scrollLeft
          main.scrollTo(main.scrollLeft + x, 0)
          x -= (main.scrollLeft - scroll)
          onScroll()
        }
        main.scrollTo(main.scrollLeft + 1, 0)
      }
      resetTexts()
    }

    if (!!noScroll) return <div className="calendar-button-scroll"/>
    // Исключение, если запрет на ленивую загрузку - нет кнопки быстрой перемотки

    return (
      <div className="calendar-button-scroll">
        <IconButton size="small" onClick={onClick}>
          <SettingsBackupRestoreIcon fontSize="inherit"/>
        </IconButton>
      </div>
    )
  }

  function Day(date) {
    // День из даты
    let day = document.createElement("div")
    day.className = getDayClass(date)
    day.setAttribute("id", date.format())
    day.innerText = date.getDate().toString()
    return day
  }

  function Week(start) {
    // Столбец недели (7 дней, начиная с "start")
    start = new Date(start)

    let week = document.createElement("div")
    week.className = "calendar-week"
    for (let i = 0; i < 7; i++) {
      let date = new Date(start)
      date.setDate(date.getDate() + i)
      week.appendChild(Day(date))
    }
    return week
  }

  function addMonthText(date) {
    // Название месяца с фиксированной шириной из даты
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const main = document.getElementById("calendar-days")

    let firstD = document.getElementById(date.format())
    let left = firstD.getBoundingClientRect().left - main.getBoundingClientRect().left
    if (date.getDay2() !== 0) left += firstD.getBoundingClientRect().width / 2

    date.setMonth(date.getMonth() + 1)
    date.setDate(0)

    let lastD = document.getElementById(date.format())
    let right = lastD.getBoundingClientRect().right - main.getBoundingClientRect().left
    if (date.getDay2() !== 6) {
      right -= firstD.getBoundingClientRect().width / 2
    }

    let month = document.createElement("span")
    month.className = "calendar-month-text"
    month.id = "monthText" + date.getFullYear() + date.getMonth()
    let width = right - left
    month.setAttribute("style", "width: " + width + "px")
    month.innerText = monthNames[date.getMonth()]
    return month
  }

  function getMonthText() {
    // Получение или обновление названий месяцев
    const main = document.getElementById("calendar-days")

    let i = Math.trunc(main.scrollLeft / 24)
    if (i < 0) i = 0
    const start = new Date(main.children.item(i).firstElementChild.id)
    start.setHours(0,0,0,0)
    if (start.getDate() !== 1) {
      start.setFullYear(start.getFullYear(), start.getMonth() + 1, 1)
    }

    const end = new Date(main.children.item(i).firstElementChild.id)
    end.setHours(0,0,0,0)
    i = Math.trunc(main.getBoundingClientRect().width) / 24 * 7 + 6
    end.setDate(end.getDate() + i)
    let check = new Date(end)
    check.setMonth(check.getMonth() + 1)
    check.setDate(0)
    if (end !== check) {
      end.setDate(0)
    }

    let first = document.getElementById(start.format())
    let last = document.getElementById(end.format())

    if (first === null || last === null) return

    let paddingL = first.getBoundingClientRect().left - main.getBoundingClientRect().left
    let paddingR = main.getBoundingClientRect().right - last.getBoundingClientRect().right
    if (start.getDay2() !== 0) paddingL += first.getBoundingClientRect().width / 2
    if (end.getDay2() !== 6) paddingR += last.getBoundingClientRect().width / 2

    let root = document.querySelector("div.calendar-months-text")
    root.setAttribute("style", "margin: 0 " + paddingR + "px 0 " + paddingL + "px")


    if (root.childElementCount > 0) {
      const firstText = root.firstElementChild
      const firstTextYear = Number(firstText.id.slice(9, 13))
      const firstTextMonth = Number(firstText.id.slice(13))

      if (firstTextMonth > start.getMonth()) {
        const diff = (start.getDiffMonth(new Date(firstTextYear, firstTextMonth, 1)))
        if (diff > 1) {
          root.innerHTML = ""
          return
        }
        if (firstTextYear === start.getFullYear()) {
          root.insertBefore(addMonthText(start), firstText)
        } else {
          firstText.remove()
        }
      }
      else if (firstTextMonth < start.getMonth()) {
        const diff = (start.getDiffMonth(new Date(firstTextYear, firstTextMonth, 1)))
        if (diff > 1) {
          root.innerHTML = ""
          return
        }
        if (firstTextYear === start.getFullYear()) {
          firstText.remove()
        }
        else {
          root.insertBefore(addMonthText(start), firstText)
        }
      }

      const lastText = root.lastElementChild
      const lastTextYear = Number(lastText.id.slice(9, 13))
      const lastTextMonth = Number(lastText.id.slice(13))
      if (lastTextMonth > end.getMonth()) {
        const diff = (end.getDiffMonth(new Date(lastTextYear, lastTextMonth, 1)))
        if (diff > 1) {
          root.innerHTML = ""
          return
        }
        if (lastTextYear === end.getFullYear()) {
          lastText.remove()
        } else {
          end.setDate(1)
          root.appendChild(addMonthText(end))
        }
      }
      else if (lastTextMonth < end.getMonth()) {
        const diff = (end.getDiffMonth(new Date(lastTextYear, lastTextMonth, 1)))
        if (diff > 1) {
          root.innerHTML = ""
          return
        }
        if (lastTextYear === end.getFullYear()) {
          end.setDate(1)
          root.appendChild(addMonthText(end))
        } else {
          lastText.remove()
        }
      }
    }

    else if (root.childElementCount === 0 ) {
      for (let i = 0; i <= end.getDiffMonth(start); i++) {
        let date = new Date(start)
        date.setMonth(date.getMonth() + i)
        root.appendChild(addMonthText(date))
      }
    }
  }

  function getYearsText() {
    // Получение или обновление названий года с фиксированной шириной
    const main = document.getElementById("calendar-days")
    let i = Math.trunc(main.scrollLeft / 24)
    if (i < 0) i = 0
    const first = new Date(main.children.item(i).firstElementChild.id)
    let lastIndex = Math.trunc(main.scrollLeft  + main.getBoundingClientRect().width) / 24
    if (lastIndex >= main.children.length) lastIndex = main.children.length - 1
    const last = new Date(main.children.item(lastIndex).firstElementChild.id)

    if (document.querySelector("div.calendar-years-text").childElementCount > 1) {
      let check = document.querySelector("div.calendar-years-text").firstElementChild
      if (check.id !== "yearText" + first.getFullYear()) check.remove()
      check = document.querySelector("div.calendar-years-text").lastElementChild
      if (check.id !== "yearText" + last.getFullYear()) check.remove()
    }

    for (let i = 0; i <= last.getFullYear() - first.getFullYear(); i++) {
      let date = new Date(first.getFullYear() + i, 0, 1, 0,0,0,0)
      if (date.getDay2() > 0) date.setDate(date.getDate() + 7 - date.getDay2())

      let yearL = document.getElementById(date.format())
      if (yearL === null) yearL = main.getBoundingClientRect().left
      else if (yearL.getBoundingClientRect().left < main.getBoundingClientRect().left) yearL = main.getBoundingClientRect().left
      else yearL = yearL.getBoundingClientRect().left

      date = new Date(first.getFullYear() + i, 11, 31, 0,0,0,0)

      let yearR = document.getElementById(date.format())
      if (yearR === null) yearR = main.getBoundingClientRect().right
      else if (yearR.getBoundingClientRect().right > main.getBoundingClientRect().right) yearR = main.getBoundingClientRect().right
      else yearR = yearR.getBoundingClientRect().right

      let width = yearR - yearL
      let year = document.getElementById("yearText" + date.getFullYear())

      if (year === null) {
        year = document.createElement("span")
        year.className = "calendar-year-text"
        year.id = "yearText" + date.getFullYear()
        year.setAttribute("style", "width: " + width + "px")
        if (width >= 100) year.innerText = date.getFullYear().toString()
        document.querySelector("div.calendar-years-text").appendChild(year)
      }
      else {
        year.setAttribute("style", "width: " + width + "px")
        year.innerText = width >= 100 ? date.getFullYear().toString() : ""
      }
    }
  }

  function getDayClass(date) {
    // Формирование css-класса дня из даты
    let result = "calendar-day"
    result += date.getMonth() % 2 === 0 ? " color0" : " color1"
    if (date < (new Date()).setHours(0,0,0,0)) result += " past"
    if (days[date.format()]) result += " busy"
    else if (daysOff.includes(date.format())) result += " busy"
    if (daysPick.includes(date.format())) result += " pick"
    return result
  }

  function getRefScroll() {
    // Получение референсного значения - скролл на середину
    const main = document.getElementById("calendar-days")
    const l = main.firstElementChild.getBoundingClientRect().left
    const r = main.lastElementChild.getBoundingClientRect().right
    return (r - l) / 2 - main.getBoundingClientRect().width / 2
  }

  function lazyLoading() {
    const main = document.getElementById("calendar-days")
    const scroll = main.scrollLeft
    const refScroll = getRefScroll()
    if (Math.abs(refScroll - scroll) < 24 || noScroll) return
    // Исключение, если нет необходимости в обновлении или запрет на ленивую загрузку (noScroll)
    console.log("lazyLoading")
    const size = main.children[1].getBoundingClientRect().left - main.children[0].getBoundingClientRect().left
    // size - ширина одной недели (default = 24)
    const offset = Math.abs(refScroll - scroll) % size
    const count = Math.trunc(Math.abs(refScroll - scroll) / size)
    if (refScroll - scroll >= size) {
      // Скролл влево
      for (let i = 0; i < count; i++) {
        main.removeChild(main.lastElementChild)
      }
      const first = main.firstElementChild
      let date = new Date(first.firstElementChild.id)
      date.setHours(0, 0, 0, 0)
      date.setDate(date.getDate() - 7 * count)
      main.insertBefore(Weeks(date, count), first)
      main.scrollLeft = refScroll - offset
    }
    else if (scroll - refScroll >= size) {
      // Скролл вправо
      for (let i = 0; i < count; i++) {
        main.removeChild(main.firstElementChild)
      }
      const last = main.lastElementChild
      let date = new Date(last.firstElementChild.id)
      date.setHours(0, 0, 0, 0)
      date.setDate(date.getDate() + 7)
      main.appendChild(Weeks(date, count))
      main.scrollLeft = refScroll + offset
    }
  }

  function onScroll() {
    // Ленивая загрузка календаря от скроллинга
    if (dblClick) {
      // Исключение для возможности множественного выделения при скроллинге
      clearTimeout(dblClick)
      dblClick = setTimeout(() => props.changeDaysPick(daysPick), 400)
    }
    getYearsText()
    getMonthText()
    clearTimeout(scrollTimer)
    if (!touch) scrollTimer = setTimeout(() => lazyLoading(), 300)
  }

  function resetTexts() {
    // Обновление названий месяцев и лет
    document.querySelector("div.calendar-years-text").innerHTML = ""
    document.querySelector("div.calendar-months-text").innerHTML = ""
    getYearsText()
    getMonthText()
  }

  function setDayPick(day) {
    // Pick на день
    daysPick.push(day)
    if (document.getElementById(day)) document.getElementById(day).classList.add("pick")
  }

  function unsetDayPick(day) {
    // unPick с дня
    daysPick.splice(daysPick.indexOf(day), 1)
    if (document.getElementById(day)) document.getElementById(day).classList.remove("pick")
  }

  function onDayOver(e) {
    // Обработка onMouseOver для дня
    if (e.target.classList.contains("calendar-day") && e.target.classList.contains("busy") && !dblClick) {
      // Pick на проекты с этой датой
      let array = []
      if (props.daysOff.includes(e.target.id)) array.push("daysOff")
      if (props.days[e.target.id]) array = array.concat(props.days[e.target.id])
      pick("set", array)
      document.querySelectorAll(".calendar-day.hover").forEach((element) => element.classList.remove("hover"))
    }
    else {
      // unPick на проекты с этой датой
      const array = []
      document.querySelectorAll("tr.pick").forEach((project) => array.push(project.id))
      if (document.querySelector("div#daysOff.pick")) array.push("daysOff")
      pick("unset", array)
      document.querySelectorAll(".calendar-day.hover").forEach((element) => element.classList.remove("hover"))
    }

    if (e.target.classList.contains("calendar-day")) {
      e.target.classList.add("hover")
    }

    if (props.edit && e.target.classList.contains("calendar-day") && shiftDaysEnd) {
      // Множественное выделение
      clearTimeout(dblClick)
      let dateStart = new Date(shiftDaysStart.id)
      let dateEnd = new Date(shiftDaysEnd.id)
      let date = new Date(e.target.id)

      function changePick(day, set) {
        // Pick или unPick на день в зависимости от начального дня множественного выделения
        if (shiftDaysStart.classList.contains("pick")) {

          if (set === "unset") {
            if (!props.daysPick.includes(day)) {
              unsetDayPick(day)
            }
          } else if (set === "set") {
            if (!daysPick.includes(day)) {
              setDayPick(day)
            }
          }
        }
        else {
          if (set === "set") {
            if (daysPick.includes(day)) {
              unsetDayPick(day)
            }
          } else if (set === "unset") {
            if (props.daysPick.includes(day)) {
              setDayPick(day)
            }
          }
        }
      }

      // Pick и unPick на днях при множественно выделении
      if (date !== dateEnd) {
        if (date > dateStart && date > dateEnd) {
          while (date > dateEnd) {
            dateEnd.setDate(dateEnd.getDate() + 1)
            changePick(dateEnd.format(), "set")
          }
        } else if (date < dateStart && date < dateEnd) {
          while (date < dateEnd) {
            dateEnd.setDate(dateEnd.getDate() - 1)
            changePick(dateEnd.format(), "set")
          }
        } else {
          if (date < dateEnd) {
            while (date < dateEnd) {
              changePick(dateEnd.format(), "unset")
              dateEnd.setDate(dateEnd.getDate() - 1)
            }
          } else if (date > dateEnd) {
            while (date > dateEnd) {
              changePick(dateEnd.format(), "unset")
              dateEnd.setDate(dateEnd.getDate() + 1)
            }
          }
        }
      }
      shiftDaysEnd = e.target
    }
  }

  function onDayShift(e) {
    // Обработка зажатия дня
    if (props.edit && e.target.classList.contains("calendar-day")) {
      if (dblClick && shiftDaysStart === e.target) {
        // Если зажим от двойного нажатия - начало множесвенного выделения
        clearTimeout(dblClick)
        shiftDaysStart = e.target
        shiftDaysEnd = e.target
      }
      else {
        // иначе смена Pick на день
        if (e.target.classList.contains("pick")) {
          unsetDayPick(e.target.id)
        }
        else {
          setDayPick(e.target.id)
        }
      }
    }
  }

  function onDayUnshift(e) {
    // Обработка отжатия дня - обновление daysPick в пропсах
    if (props.edit && e.target.classList.contains("calendar-day")) {
      if (!shiftDaysStart) {
        // Если первичное отжатие - старт таймера для распознавания двойного нажатия
        shiftDaysStart = e.target
        dblClick = setTimeout(() => props.changeDaysPick(daysPick), 400)
      } else {
        props.changeDaysPick(daysPick)
      }
    }
  }

  function onMouseLeave() {
    // unPick на всё, кроме дней
    const array = []
    document.querySelectorAll("tr.pick").forEach((project) => array.push(project.id))
    if (document.querySelector(".daysOff.pick") !== null) array.push("daysOff")
    pick("unset", array)
  }

  function onCalendarLeave() {
    // Окончание множественного выделения при уходе с календаря
    if (shiftDaysStart) {
      dblClick = setTimeout(() => props.changeDaysPick(daysPick), 400)
    }
  }

  function startScroll() {
    // Начальный скролл сформировавшегося календаря
    const main = document.getElementById("calendar-days")
    let offset = 0
    if (main.getBoundingClientRect().right >= main.lastElementChild.getBoundingClientRect().right) return
    // Исключение, если ширина блока календаря больше, чем календарь - отмена скролла
    let start = new Date()
    start.setHours(0,0,0,0)
    if (props.dates && props.dates.length > 0) {
      // Исключение, если есть props.dates - скролл на первую дату
      const first = new Date(props.dates[0])
      first.setHours(0,0,0,0)
      start = first
      if (props.dates.length > 1) {
        // Если дат несколько - центрирование дат
        let last = new Date(props.dates[props.dates.length - 1])
        last.setHours(0,0,0,0)
        const firstElement = document.getElementById(first.format())
        const lastElement = document.getElementById(last.format())
        if (lastElement !== null) {
          const firstL = firstElement.getBoundingClientRect().left
          const lastR = lastElement.getBoundingClientRect().right
          const mainWidth = main.getBoundingClientRect().width
          if (lastR - firstL < mainWidth) {
            offset = (lastR - firstL) / 2 - mainWidth / 2
          }
        }
      }
    }
    // Старт перемотки. В случае недоскролла из-за короткого календаря - рекурсия, пока не доскроллит
    let x = document.getElementById(start.format()).getBoundingClientRect().left + offset - main.getBoundingClientRect().left - 1
    main.scrollTo(main.scrollLeft + x, 0)
    x -= main.scrollLeft
    lazyLoading()
    if (x > 0) startScroll()
  }

  function checkCalendar() {
    // Проверка правильности присвоения css-классов у каждого дня
    document.querySelectorAll("div.calendar-day").forEach((day) => {
      day.className = getDayClass(new Date(day.id))
    })
  }

  function getStartDate() {
    // Получение стартовой даты для формирования недель
    let today = new Date()
    let start = new Date(today)
    start.setHours(0,0,0,0)
    start.setDate(start.getDate() - start.getDay2())
    let diff = null
    if (props.dates) {
      // Исключение, если есть props.dates
      let first = new Date(props.dates[0])
      if (first < today) {
        // Если первая дата в прошлом - начало с неё
        first.setDate(1)
        first.setDate(first.getDate() - first.getDay2())
        start = first
      }
      const last = new Date(props.dates[props.dates.length - 1])
      if (last < today) {
        // Если последняя дата в прошлом - формируются только месяцы, где есть даты. Запрет на ленивую загрузку
        last.setMonth(last.getMonth() + 1)
        last.setDate(0)
        diff = last.getDiffWeeks(start) + 1
        noScroll = true
        document.querySelector(".calendar-button-scroll").firstElementChild.remove()
      }
    }
    return {start: start, diff: diff}
  }

  function touchStart(e) {
    clearTimeout(touchTimer)
    document.getElementById("calendar-days").addEventListener("scroll", touchScroll)
    touch = true
    onMouseLeave()
    onDayOver(e)
  }

  function touchScroll() {
    clearTimeout(touchTimer)
    touchTimer = setTimeout(onScroll, 300)
  }

  function touchEnd() {
    touchScroll()
    touch = false
  }

  function onWheel(e) {
    const main = document.getElementById("calendar-days")
    const scroll = e.deltaX + e.deltaY
    main.scrollLeft += scroll
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);
  }

  function Weeks(date, count) {
    let weeks = document.createDocumentFragment()
    for (let i = 0; i < count; i++) {
      weeks.appendChild(Week(date))
      date.setDate(date.getDate() + 7)
    }
    return weeks
  }

  function filling() {
    const main = document.getElementById("calendar-days")

    const dates = getStartDate()
    const start = dates.start

    let date = new Date(start)

    if (dates.diff !== null) {
      main.appendChild(Weeks(date, dates.diff))
      return
    }

    let width = 0
    while (width <= main.getBoundingClientRect().width) {
      main.appendChild(Week(date))
      date.setDate(date.getDate() + 7)
      width += 24
    }
    main.appendChild(Weeks(date, 52))
    date = new Date(start)
    date.setDate(date.getDate() - 7 * 52)
    const first = main.firstElementChild
    main.insertBefore(Weeks(date, 52), first)
  }

  useEffect(() => {
    // componentDidMount
    const main = document.getElementById("calendar-days")
    filling()
    startScroll()
    resetTexts()
    document.querySelector("div.calendar-block").classList.remove("shadow")
    window.addEventListener("resize", resetTexts)
    // Обновление названий месяцев и лет из-за смены размера окна
    main.addEventListener("selectstart", (e) => e.preventDefault())
    // Отмена изменения курсора движении с зажатием
  }, [],)

  useEffect(() => checkCalendar())
    // componentDidUpdate

  return (
    <div className="calendar-block shadow">
      <div className="calendar-left">
        <ButtonScroll/>
        <DaysNames/>
      </div>
      <div className="calendar-right" onMouseLeave={onCalendarLeave}>
        <div className="calendar-top-text">
          <div className="calendar-years-text"/>
          <div className="calendar-months-text"/>
        </div>
        <div className="calendar-days"
             id="calendar-days"
             onScroll={onScroll}
             onWheel={onWheel}
             onTouchStart={touchStart}
             onTouchEnd={touchEnd}
             onMouseDown={onDayShift}
             onMouseUp={onDayUnshift}
             onMouseOver={onDayOver}
             onMouseLeave={onMouseLeave}>
        </div>
      </div>
    </div>
  )
}
