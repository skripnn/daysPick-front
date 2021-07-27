import {Badge, withStyles} from "@material-ui/core";

function IconBadge({dot, content, children, rect, showed, ...props}) {
  if (!content) return children

  if (dot) return (
    <Badge
      color={'error'}
      overlap={rect ? 'rectangle' : 'circle'}
      variant={'dot'}
      {...props}
    >
      {children}
    </Badge>
  )

  return (
    <StyledBadge
      badgeContent={content}
      color={'error'}
      overlap={rect ? 'rectangle' : 'circle'}
      {...props}
    >
      {children}
    </StyledBadge>)
}

IconBadge.defaultProps = {
  showed: true
}

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: 0,
    top: 5,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px'
  },
}))(Badge);

export default IconBadge
