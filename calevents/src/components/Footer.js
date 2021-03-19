import { Github } from 'react-bootstrap-icons'
import '../styles/components/Footer.css';

const Footer = () => {
  return (
    <div className="footer">
      <p>CSCI 3100 Group E1 &copy; 2021&nbsp;&nbsp;&nbsp;&nbsp;
        <a href="https://github.com/dannysze/CSCI3100-Project" target="_blank">
          <Github />
        </a>
      </p>
    </div>
  )
}

export default Footer