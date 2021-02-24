// eslint-disable-next-line no-extend-native
Date.prototype.getDay2 = function () {
  // Date.getDay (Monday = 0)
  const day = this.getDay()
  if (day === 0) return 6
  else return day - 1
}

// eslint-disable-next-line no-extend-native
Date.prototype.getDiffWeeks = function (start) {
  // получение разницы между неделями
  return (this.getTime() - start.getTime()) / 604800000
}

// eslint-disable-next-line no-extend-native
Date.prototype.format = function () {
  // Date to String format YYYY-MM-DD
  let dd = this.getDate();
  if (dd < 10) dd = '0' + dd;

  let mm = this.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;

  let yyyy = this.getFullYear();

  return yyyy + '-' + mm + '-' + dd;
}

// eslint-disable-next-line no-extend-native
Date.prototype.monday = function () {
  // Set day to Monday
  this.setDate(this.getDate() - this.getDay2())
  return this
}

// eslint-disable-next-line no-extend-native
Date.prototype.offsetDays = function (x) {
  // Date + x days
  this.setDate(this.getDate() + x)
  return this
}

// eslint-disable-next-line no-extend-native
Date.prototype.offsetWeeks = function (x) {
  // Date + x weeks
  this.setDate(this.getDate() + x * 7)
  return this
}

export function newDate(date) {
  // Create new Date without time (00:00:00:000)
  let newDate = date? new Date(date) : new Date()
  newDate.setHours(0,0,0,0)
  return newDate
}

export function getMonth(m) {
  // format MM from M
  let mm = m + 1;
  if (mm < 10) mm = '0' + mm;
  return mm
}

export function dateRange(start, end, format=true) {
  // Возвращает список с датами между start и end включительно. При format=false - объекты Date.
  let date = newDate(start)
  let finish = newDate(end).getTime()
  if (finish < date.getTime()) {
    finish = date.getTime()
    date = newDate(end)
  }
  const dates = []
  while (date.getTime() <= finish) {
    dates.push(format? date.format() : newDate(date))
    date.offsetDays(1)
  }
  return dates
}