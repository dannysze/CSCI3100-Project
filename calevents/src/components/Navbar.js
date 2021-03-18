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
        cName: 'drop'
    },
    {
        title:'Search',
        url: '#',
        cName: 'navi'
    },
    
]
const dropItems = [
  {
    title:'Creat Event',
    url: '#',
    cName: 'drop-c'
},
{
  title:'Edit',
  url: '#',
  cName: 'drop-c'
},
{
title:'Remove?',
url: '#',
cName: 'drop-c'
},

]


function Navbar() {     
  return(
    <div className="navbar-n">
      {navItems.map((item, index) => {
        return(
          item.cName === 'drop' ?
            <a className={item.cName} href={item.url}>{item.title}
              <div className="dropcontent">
                {dropItems.map((item, index) => {
                  return(
                    <a className={item.cName} herf={item.url}>{item.title}</a>

                  )
                })}
            
              </div>
            </a>
            :<a className={item.cName} href={item.url}>{item.title}</a>
            
          
        )
      })}
    </div>

  )
}

export default Navbar