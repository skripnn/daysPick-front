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
  // Create new Date without time (00:00:00:000)
  let newDate = date? new Date(date) : new Date()
  newDate.setHours(0,0,0,0)
  return newDate
}
