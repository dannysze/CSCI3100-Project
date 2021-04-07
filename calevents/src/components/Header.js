import React, { useState } from 'react';
import * as Icon from 'react-bootstrap-icons';
import '../styles/components/Header.css';

const headerItems = [
  {
      title: '$0.00 ',
      url: '#',
      icon: <></>,
      cName: 'header-items'
  },
  {
      title: 'Username ',
      url: '#',
      icon: <Icon.PersonCircle />,
      cName: 'header-items'
  },
  {
      title: '',
      url: '#',
      icon: <Icon.QuestionCircle />,
      cName: 'header-items'
  },
  {
      title: '',
      url: '#',
      icon: <Icon.Gear />,
      cName: 'header-items'
  },
]

const Header = () => {
  return (
    <div className="header">
      <h1 style={{left: '10px', position: 'absolute'}}>CalEvent</h1>
      {headerItems.map((item, index) => <a href={item.url} className={item.cName} key={index}>{item.title}{item.icon}</a>)}
    </div>
  )
}

export default Header