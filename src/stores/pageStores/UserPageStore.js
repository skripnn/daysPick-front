const UserPageStore = {
  edit: false,
  profile: false,
  user: {},
  loading: true,
  dayInfo: null,
  dayOffOver: false,

  calendar: {
    days: {},
    daysOff: [],
    daysPick: []
  }
}

export default UserPageStore
