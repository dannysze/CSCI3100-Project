// A set of customized buttons with CSS and changeable  
import { ArrowRightCircle, X, CaretLeftFill, CaretRightFill, ArrowRepeat } from 'react-bootstrap-icons'
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

const CalendarButton = ({ classes, clickHandler }) => {
  return (
    <button className={`calendar-button ${classes} flex-center`} onClick={clickHandler}>{classes === "calendar-button-reset" ? <ArrowRepeat /> : (classes === "calendar-button-left" ? <CaretLeftFill /> : <CaretRightFill />)}</button>
  )
}

export { CalendarButton }

const RedeemButton = ({ classes, clickHandler, content }) => {
  return (
    <button className={`redeem-button ${classes}`} onClick={clickHandler}>
      {content}
    </button>
  )
}

export { RedeemButton }

const FormButton = ({ classes, clickHandler, content, expired = false }) => {
  return (
    <button className={`form-button ${classes}`} onClick={clickHandler} disabled={expired} type="button">
      {content}
    </button>
  )
}

export { FormButton }