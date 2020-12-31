import PropTypes from "prop-types";

export const propTypes = {
  // функция для получения значений - return Calendar Object
  get: PropTypes.func,
  // функция для записи изменений (что делать с daysPick при изменении)
  onChange: PropTypes.func,
  // можно ли менять daysPick
  edit: PropTypes.bool,
  // рассчет календаря от началльной даты в daysPick
  offset: PropTypes.bool,
  // начальные значения - если есть, то к пустым значениям прибавляются те, что есть в init
  init: PropTypes.object,
  // функция, которой передается информация о дне при наведении на день
  dayOver: PropTypes.func,
  // начало календаря (не скроллится раньше этой даты)
  startDate: (props, propName, componentName) => checkDateFormat(props, propName, componentName),
  // конец календаря (не скроллится дальше этой даты)
  endDate: (props, propName, componentName) => checkDateFormat(props, propName, componentName)
}

export const defaultProps = {
  onChange: () => {},
  dayOver: () => {},
  edit: false,
  offset: true
}

function checkDateFormat(props, propName, componentName) {
  // проверка на соответствие формату даты YYYY-MM-DD
  if (props[propName]) {
    const m = props[propName].match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (m && Date.parse(props[propName])) {
      return
    }
    return new Error(
      componentName + ': Неверный формат даты "' + propName + '". Ожидаемый формат YYYY-MM-DD'
    );
  }
}