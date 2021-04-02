import PropTypes from "prop-types";

export const propTypes = {
  // функция для получения значений - return Calendar Object
  get: PropTypes.func,
  // функция для записи изменений (что делать с daysPick при изменении)
  onChange: PropTypes.func,
  // можно ли менять daysPick
  edit: PropTypes.bool,
  // Максимальное количество выбранных дней
  maxPick: PropTypes.number,
  // функция обработки ошибок
  onError: PropTypes.func,
  // отмена рассчета календаря от началльной даты в daysPick
  noOffset: PropTypes.bool,
  // начальные значения - если есть, то к пустым значениям прибавляются те, что есть в init
  content: PropTypes.object,
  // функция для обновления внешнего хранилища
  setContent: PropTypes.func,
  // функции активности Day, которым передаётся информация о дне
  onDay: PropTypes.shape({
    onTouchHold: PropTypes.func,
    onMouseOver: PropTypes.func,
    onContextMenu: PropTypes.func
  }),
  // триггер хука выполнения запроса
  triggerGet: PropTypes.any,
  //триггер хука обновления
  triggerNew: PropTypes.any,
  // начало календаря (не скроллится раньше этой даты)
  startDate: (props, propName, componentName) => checkDateFormat(props, propName, componentName),
  // конец календаря (не скроллится дальше этой даты)
  endDate: (props, propName, componentName) => checkDateFormat(props, propName, componentName)
}

export const defaultProps = {
  onChange: () => {},
  onDay: {},
  edit: false,
  noOffset: false,
  content: {},
  maxPick: 366
}

function checkDateFormat(props, propName, componentName) {
  // проверка на соответствие формату даты YYYY-MM-DD
  if (props[propName]) {
    const m = props[propName].match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (m && Date.parse(props[propName])) {
      return
    }
    return new Error(
      componentName + ': Wrong date format "' + propName + '". Please use YYYY-MM-DD'
    );
  }
}