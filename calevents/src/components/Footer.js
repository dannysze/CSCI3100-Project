// Footer component used in every Pages
import { Github } from 'react-bootstrap-icons'
import '../styles/components/Footer.css';

// Main component
const Footer = () => {
  return (
    <div className="footer">
      <h1>C a l E v e n t</h1>
      <p>Copyright &copy; All right reserved by CSCI 3100 Group E1 2021 </p>
      <a href="https://github.com/dannysze/CSCI3100-Project" target="_blank">
        <Github />
      </a>
    </div>
  )
}

export default Footer