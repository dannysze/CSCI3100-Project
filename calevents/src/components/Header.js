import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import * as Icon from 'react-bootstrap-icons';
import { RedeemButton, CloseButton } from './CustomButton';
import getaddr from './getaddr';
import '../styles/components/Header.css';

const Header = () => {
  const headerItems = [
    {
        title: '$0.00 ',
        url: '#',
        icon: <Icon.Plus />,
        cName: 'header-items',
        onclick: () => { setShowRedeem(true) }
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
  const [showRedeem, setShowRedeem] = useState(false);

  const closeModal = () => {
    setShowRedeem(false);
  }

  return (
    <div className="header">
      <h1 style={{left: '10px', position: 'absolute'}}>CalEvent</h1>
      <CSSTransition
        in={showRedeem}
        timeout={500}
        classNames={'add-value-box-'}
        unmountOnExit
      >
        <AddValueBox closeModal={closeModal}/>
      </CSSTransition>
      {headerItems.map((item, index) => <a href={item.url} className={`flex-center ${item.cName}`} key={index} onClick={item.onclick}>{item.title}{item.icon}</a>)}
    </div>
  )
}

const AddValueBox = ({ closeModal }) => {
  
  // const [prePaidCard, setPrePaidCard] = useState({ 'number': '', 'password': '' })
  const [cardNumber, setCardNumber] = useState('');
  const [password, setPassword] = useState('');
  
  const onChangeHandler = (event) => {
    event.target.name === 'number' ? setCardNumber(event.target.value) : setPassword(event.target.value);
  } 

  const redeemCard = async (event) => {
    event.preventDefault();
    // send request POST /add_value
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: 40, // to be changed
        card_id: cardNumber,
        card_pw: password
      })
    };
    const response = await fetch(getaddr()+'add_value', requestOptions);
    const data = await response.json();
    // console.log(data);
  }

  return (
      <div className="add-value--background" onClick={closeModal}>
        <div className="add-value--container" onClick={event => { event.stopPropagation(); }}>
          <h2>Redeem gift card</h2>
          <form className="redeem-form">
            <div>
              <input type="text" name="number" placeholder="Card number" onChange={onChangeHandler}/>
            </div>
            <div>
              <input type="password" name="password" placeholder="Password" onChange={onChangeHandler}/>
            </div>
            <RedeemButton classes={''} clickHandler={redeemCard} content={`
  Redeem`} />
          </form>
        </div>
      </div>
    )
  }
  
  export default Header