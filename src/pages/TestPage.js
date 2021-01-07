import {observer, inject} from "mobx-react";


function TestPage(props) {
  const store = props.TestPageStore

  return (
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
  )
}

export default inject('TestPageStore')(observer(TestPage))