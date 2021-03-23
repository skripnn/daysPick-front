import {Facebook} from "@material-ui/icons";
import {makeStyles} from "@material-ui/core/styles";
import PropTypes from 'prop-types'

const useStyle = makeStyles({
  solid: {
    color: "#3b5998",
  },
  hovered: {
    '&:hover': {
      color: "#3b5998",
    },
  }
})

function FacebookIcon(props) {

  const {type, ...rest} = props

  const classes = useStyle()

  return (
    <Facebook
      className={type? classes[type] : undefined}
      {...rest}
    />
  )
}

FacebookIcon.propTypes = {
  type: PropTypes.oneOf(['hovered', 'solid'])
}

export default FacebookIcon