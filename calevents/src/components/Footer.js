import { Github } from 'react-bootstrap-icons'
import '../styles/components/Footer.css';

const Footer = () => {
  return (
    <div className="footer">
      <p>Copyright &copy; All right reserved by CSCI 3100 Group E1 2021 </p>
      <a href="https://github.com/dannysze/CSCI3100-Project" target="_blank">
        <Github />
      </a>
    </div>
  )
}

export default Footer