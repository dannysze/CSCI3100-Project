import React, { useState } from 'react';
import '../styles/components/navbar.css';

const navItems = [
    {
      title:'Main',
      url: '#',
      cName: 'nav__menu-item'
    },
    {
      title:'My Calendar',
      url: '#',
      cName: 'drop nav__menu-item'
    },
    {
      title:'Search',
      url: '#',
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

function Navbar() {     
  return(
    <nav className='nav'>
      <ul className='nav__menu'>
        {navItems.map((item, index) => {
          return ( 
            item.cName === 'drop nav__menu-item' ? 
              <li className={item.cName} key={index}>
                <a href={item.url}>{item.title}</a>
                <ul className='nav__submenu'>
                  {dropItems.map((item, index) => {
                    return <Submenu item={item} key={index} />
                  })}
                </ul>
              </li>
            : <li className={item.cName}>
                <a href={item.url} key={index}>{item.title}</a>
              </li>
          ) 
        })}
      </ul>
    </nav>
  )
}

export default Navbar

const Submenu = ({ item }) => {
  return (
    <li className={item.cName}>
      <a href={item.url}>{item.title}</a>
    </li>
  )
}