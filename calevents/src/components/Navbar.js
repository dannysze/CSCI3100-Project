import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { CaretDownFill } from 'react-bootstrap-icons';
import '../styles/components/Navbar.css';

const navItems = [
    {
      title:'Home',
      url: '/',
      cName: 'nav__menu-item'
    },
    {
      title:'My Calendar',
      url: '/myCalendar',
      cName: 'drop nav__menu-item'
    },
    {
      title:'Search',
      url: '/search',
      cName: 'nav__menu-item'
    },
]
const dropItems = [
  {
    title:'Creat Event',
    url: '#',
    cName: 'nav__submenu-items'
  },
  {
    title:'Edit',
    url: '#',
    cName: 'nav__submenu-items'
  },
  {
    title:'Remove?',
    url: '#',
    cName: 'nav__submenu-items'
  },
]

const Navbar = () => {    
  
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);

  return(
    <nav className='nav'>
      <ul className='nav__menu'>
        {navItems.map((item, index) => {
          return ( 
            item.cName === 'drop nav__menu-item' ? 
              <li 
                className={item.cName} 
                key={index} 
                onMouseOver={() => setShowDropdownMenu(true)} 
                onMouseLeave={() => setShowDropdownMenu(false)}
              >
                <Link to={item.url}>
                  {item.title}&nbsp;
                  <CaretDownFill />
                </Link>
                <CSSTransition 
                  in={showDropdownMenu}
                  timeout={300}
                  classNames='dropdown'
                  unmountOnExit={false}
                >
                  <ul className='nav__submenu'>
                    {dropItems.map((dropDownItem, idx) => {
                      return (
                        <li className={dropDownItem.cName} key={idx}>
                          <Link to={dropDownItem.url}>{dropDownItem.title}</Link>
                        </li>
                      )
                    })}
                  </ul>
                </CSSTransition>
              </li>
            : <li className={item.cName} key={index}>
                <Link to={item.url} key={index}>{item.title}</Link>
              </li>
          ) 
        })}
      </ul>
    </nav>
  )
}

export default Navbar