import {SvgIcon} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import PropTypes from 'prop-types'

const useStyle = makeStyles({
  solid: {
    color: "#2787F5",
  },
  hovered: {
    '&:hover': {
      color: "#2787F5",
    },
  }
})

function VkIcon(props) {

  const {type, ...rest} = props

  const classes = useStyle()

  return (
    <SvgIcon className={type? classes[type] : undefined} {...rest} >
      <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.76 3C19.8 3 21 4.2 21 9.24v5.52C21 19.8 19.8 21 14.76 21H9.24C4.2 21 3 19.8 3 14.76V9.24C3 4.2 4.2 3 9.24 3h5.52zM7.688 8.625H6.375c-.375 0-.45.177-.45.371 0 .348.445 2.072 2.072 4.352C9.08 14.906 10.61 15.75 12 15.75c.834 0 .938-.188.938-.51v-1.178c0-.374.079-.45.343-.45.194 0 .528.098 1.307.849.89.89 1.037 1.289 1.537 1.289h1.313c.375 0 .562-.188.454-.557-.119-.37-.543-.904-1.107-1.539-.306-.361-.765-.75-.904-.945-.195-.25-.14-.362 0-.584l.023-.033c.198-.281 1.588-2.274 1.743-2.985.083-.278 0-.482-.397-.482h-1.313c-.333 0-.487.177-.57.371 0 0-.668 1.627-1.614 2.684-.305.306-.444.403-.611.403-.084 0-.204-.097-.204-.375v-2.6c0-.334-.097-.483-.376-.483H10.5c-.209 0-.334.155-.334.302 0 .316.473.389.521 1.279v1.933c0 .424-.076.5-.243.5-.445 0-1.527-1.634-2.17-3.504-.125-.363-.251-.51-.586-.51z" fill="currentColor"/>
      </svg>
    </SvgIcon>
  )
}

VkIcon.propTypes = {
  type: PropTypes.oneOf(['hovered', 'solid'])
}

export default VkIcon