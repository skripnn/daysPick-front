import Fetch from "../../js/Fetch";

export default function A({link, children, setter, noDiv, preLinkFunction, disabled, ...otherProps}) {
  let href = link
  if (Array.isArray(link)) href = link.join('/')

  function onClick(e) {
    e.preventDefault()
    if (preLinkFunction) preLinkFunction()
    if (!disabled) {
      Fetch.link(link, setter)
    }
  }

  if (!link) return children

  if (typeof children === 'string') return (
    <a href={`/${href}`} onClick={onClick} {...otherProps}>
      {children}
    </a>
  )

  return (
    <div>
      <a href={`/${href}`} onClick={onClick} {...otherProps}>
        {children}
      </a>
    </div>
  )
}
