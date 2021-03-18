import React, { useState } from 'react';
import * as Icon from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/components/header.css';

const headerItems = [
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
      {headerItems.map((item, index) => <a href={item.url} className={item.cName} key={index}>{item.title}{item.icon}</a>)}
    </div>
  )
}

export default Header