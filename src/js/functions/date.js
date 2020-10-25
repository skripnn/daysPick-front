// eslint-disable-next-line no-extend-native
Date.prototype.getWeek = function () {
  // получение номера недели
  const first_day_in_year = new Date(this.getFullYear(), 0, 1);
  return Math.ceil((((this - first_day_in_year) / 86400000) + first_day_in_year.getDay2()) / 7) - 1;
};

// eslint-disable-next-line no-extend-native
Date.prototype.getDay2 = function () {
  const day = this.getDay()
  if (day === 0) return 6
  else return day - 1
}

// eslint-disable-next-line no-extend-native
Date.prototype.getWeeksInYear = function (i=0) {
  // получение количества недель в году
  const last_date_in_year = new Date(this.getFullYear() + i, 11, 31)
  return last_date_in_year.getWeek()
}

// eslint-disable-next-line no-extend-native
Date.prototype.getDiffWeeks = function (start) {
  // получение разницы между неделями
  const c = start.getWeeksInYear() - this.getWeeksInYear()
  let w = this.getWeek() - start.getWeek() + c
  if (this.getFullYear() !== start.getFullYear()) {
    for (let i = 0; i < this.getFullYear() - start.getFullYear(); i++) {
      w += start.getWeeksInYear(i)
    }
  }
  return w
}

// eslint-disable-next-line no-extend-native
Date.prototype.getDiffMonth = function (start) {
  // получение разницы между месяцами
  let more, less
  if (this.getTime() > start.getTime()) {
    more = this
    less = start
  }
  else if (start.getTime() > this.getTime()) {
    more = start
    less = this
  }
  else return 0

  let m = more.getMonth() - less.getMonth()
  if (more.getFullYear() !== less.getFullYear()) {
    for (let i = 0; i < more.getFullYear() - less.getFullYear(); i++) {
      m += 12
    }
  }
  return m
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

export function newDate(date) {
  let newDate = date? new Date(date) : new Date()
  newDate.setHours(0,0,0,0)
  return newDate
}