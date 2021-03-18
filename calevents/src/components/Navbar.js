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
    
    <div className='navbar-n'>
        <a className='navi' herf='#'>Main</a>
        <div className='dropdown'>
          <button className='dropbtn'>My Calendar</button>
          <div className='dropcontent'>
            {dropItems.map((item, index) => {
              return(
                <a className={item.cName} herf={item.url}>{item.title}</a>
                )
              })}
          </div>
        </div>
        <a className='navi' herf='#'>Search</a>
        
        
    </div>
    


  )
}

export default Navbar