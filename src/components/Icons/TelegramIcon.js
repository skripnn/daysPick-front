import {Telegram} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import PropTypes from 'prop-types'

const useStyle = makeStyles({
  solid: {
    color: "#0088CC",
  },
  hovered: {
    '&:hover': {
      color: "#0088CC",
    },
  }
})

function FacebookIcon(props) {

  const {type, ...rest} = props

  const classes = useStyle()

  return (
    <Telegram
      className={type? classes[type] : undefined}
      {...rest}
    />
  )
}

FacebookIcon.propTypes = {
  type: PropTypes.oneOf(['hovered', 'solid'])
}

export default FacebookIcon
