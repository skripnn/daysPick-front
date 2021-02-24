import Calendar from "../components/Calendar";

export default function TestPage() {
  return <>
    <Calendar edit onChange={(a, b) => console.log('change', a, b.format())}/>
  </>
}