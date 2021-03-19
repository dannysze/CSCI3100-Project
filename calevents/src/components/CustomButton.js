import { ArrowRightCircle } from 'react-bootstrap-icons'
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
    <Link className="login-page-button signup-button" type={type} onClick={onClick} to='/signup'>
      {content}
    </Link>
  )
}

export { SignUpButton }