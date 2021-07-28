import {FacebookProvider, Login} from "react-facebook";
import IconButton from "@material-ui/core/IconButton";
import {CircularProgress} from "@material-ui/core";
import PropTypes from 'prop-types'
import React, {useState} from "react";
import FacebookIcon from "../../Icons/FacebookIcon";
import Keys from "../../../js/Keys";
import Info from "../../../js/Info";
import Button from "@material-ui/core/Button";


function FacebookLogin(props) {
  const {id, onClick, disabled, children, ...rest} = props

  const handleError = (e) => Info.error(e.message)

  return (
    <FacebookProvider appId={props.id.toString()}>
      <Login
        {...Login.defaultProps}
        spinner
        scope="email, public_profile"
        onCompleted={(r) => props.onClick(r.profile)}
        onError={handleError}
      >
        {({ loading, handleClick }) => (<>
          {children? <div onClick={handleClick}>{children}</div> : <FbButton onClick={handleClick} loading={loading} disabled={disabled} {...rest}/>}
        </>)}
      </Login>
    </FacebookProvider>
  );
}

FacebookLogin.propTypes = {
  id: PropTypes.number.isRequired,
  onClick: PropTypes.func
}

FacebookLogin.defaultProps = {
  id: Keys.fb
}

export default FacebookLogin

function FbButton(props) {
  const {loading, icon, ...rest} = props
  const [hover, setHover] = useState(false)

  if (icon) return (
    <IconButton
      size={"small"}
      onClick={props.onClick}
      disabled={props.disabled || loading}
      {...rest}
    >
      {loading ?
        <CircularProgress size={24} color={'inherit'}/>
        :
        <FacebookIcon type={'hovered'}/>
      }
    </IconButton>
  )

  return (
    <Button
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onTouchStart={() => setHover(true)}
      onTouchEnd={() => setHover(false)}
      style={{zoom: 0.8}}
      variant={"text"}
      color={'secondary'}
      size={"small"}
      fullWidth
      onClick={props.onClick}
      disabled={props.disabled || loading}
      startIcon={loading ? <CircularProgress size={14} color={'inherit'}/> : <FacebookIcon type={hover? 'solid' : undefined}/>}
    >
      Продолжить с Facebook
    </Button>
  )
}
