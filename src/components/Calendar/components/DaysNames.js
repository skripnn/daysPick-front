import React from "react";

function DaysNames() {
  // React.component - Названия дней недели
  const Days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  return (
    <div className="calendar-days-names">
      {Days.map((day) => <div key={day}>{day}</div>)}
    </div>
  )
}
export default DaysNames