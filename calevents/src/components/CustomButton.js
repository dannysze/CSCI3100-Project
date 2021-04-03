import { ArrowRightCircle, X } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom'
import '../styles/components/CustomButton.css'

const CustomButton = () => {
  return (
    <button></button>
  )
}

export default CustomButton

const LoginButton = ({ type, onClick, content }) => {
  return (
    <button className="login-page-button login-button" type={type} onClick={onClick}>
      {content}&nbsp;
      <ArrowRightCircle />
    </button>
  )
}

export { LoginButton }

const SignUpButton = ({ type, onClick, content }) => {
  return (
    <button className="login-page-button signup-button" type={type} onClick={onClick}>
      {content}
    </button>
  )
}

export { SignUpButton }

const CloseButton = ({ onClick, style }) => {
  return (
    <button onClick={onClick} className="login-page-button close-button" style={style}><X /></button>
  )
}

export { CloseButton }