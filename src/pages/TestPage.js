import {observer, inject} from "mobx-react";
import Calendar from "../components/Calendar";
import {getCalendar} from "../js/fetch/calendar";
import {getUser} from "../js/functions/functions";

let array = []
for (let i=0; i<100; i++) {
  array.push(<p key={i}>{i.toString()}</p>)
}

function TestPage(props) {
  const store = props.store

  return (
    <>
      <Calendar
        {...props.calendar}
        edit
        get={(start, end) => getCalendar(start, end, 'skripnn')}
      />
      <div>
        <fieldset>
          <legend>store</legend>
          <p>{store.int}</p>
          <p>{store.bool.toString()}</p>
        </fieldset>
        <button
          onClick={() => store.setValue({int: store.int + 1})}
        >
          int + 1
        </button>

        <button
          onClick={() => store.setValue({bool: !store.bool})}
        >
          bool toggle
        </button>

        <button
          onClick={() => store.setValue({bool: !store.bool, int: store.int + 2})}
        >
          bool toggle
          and
          int + 2
        </button>
      </div>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        {array}
      </div>
    </>
  )
}

export default inject(stores => ({
  store: stores.TestPageStore,
  calendar: stores.CalendarStore.getUser(getUser('skripnn')),
  test: stores.CalendarStore
}))(observer(TestPage))