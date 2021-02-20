import {makeStyles} from "@material-ui/core/styles";

export const useStyle = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  button: {
    backgroundColor: "#cae3fc",
    color: "rgba(0, 0, 0, 0.8)"
  },
  error: {
    color: "#ff6c6c",
    lineHeight: "unset"
  },
  confirm: {
    color: "#4db34b",
    lineHeight: "unset"
  },
  popover: {
    padding: 10
  }
})