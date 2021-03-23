import {FacebookProvider, Login} from "react-facebook";
import IconButton from "@material-ui/core/IconButton";
import {CircularProgress} from "@material-ui/core";
import PropTypes from 'prop-types'
import React from "react";
import FacebookIcon from "../../Icons/FacebookIcon";


function FacebookLogin(props) {
  const {id, onClick, disabled, children, ...rest} = props

  const handleError = (e) => alert(e)


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
          {children? <div onClick={handleClick}>{children}</div> : <IconButton
            size={"small"}
            onClick={handleClick}
            disabled={disabled || loading}
            {...rest}
          >
            {loading ?
              <CircularProgress size={24} color={'inherit'}/>
              :
              <FacebookIcon type={'hovered'}/>
            }
          </IconButton>}
        </>)}
      </Login>
    </FacebookProvider>
  );
}

FacebookLogin.propTypes = {
  id: PropTypes.number.isRequired,
  onClick: PropTypes.func
}

export default FacebookLogin