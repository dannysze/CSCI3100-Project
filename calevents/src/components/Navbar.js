import React, { useState } from 'react';
import '../styles/components/navbar.css';

const navItems = [
    {
        title:'Main',
        url: '#',
        cName: 'navi'
    },
    {
        title:'My Calendar',
        url: '#',
        cName: 'navi'
    },
    {
        title:'Search',
        url: '#',
        cName: 'navi'
    },
]


function Navbar() {     
  return(
    <div className="navbar-n">
      {navItems.map((item, index) => {
        return(
          <a className={item.cName} href={item.url}>{item.title}</a>
        )
      })}
    </div>

  )
}

export default Navbar