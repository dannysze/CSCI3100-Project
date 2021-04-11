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

  const redeemCard = (event) => {
    event.preventDefault();
    // send request POST /add_value
    const form = new FormData(document.getElementById("redeem-form"))
    const requestOptions = {
      method: 'POST',
      body: form
    };
    fetch(getaddr()+'add_value', requestOptions)
      .then(response => {
        if (!response.ok) {
          throw new Error(response.message);
        }
        if (response.status === 200) {
          console.log(JSON.stringify(response))
        } else {
          alert("err")
        }
      })
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      });
    // console.log(data);
  }

  return (
      <div className="add-value--background" onClick={closeModal}>
        <div className="add-value--container" onClick={event => { event.stopPropagation(); }}>
          <h2 className="flex-center" style={{justifyContent: 'flex-start'}}>Redeem gift card&nbsp;<Icon.Cash /></h2>
          <form id="redeem-form" onSubmit={redeemCard}>
            <div>
              <input type="text" name="number" placeholder="Card number" onChange={onChangeHandler}/>
            </div>
            <div>
              <input type="password" name="password" placeholder="Password" onChange={onChangeHandler}/>
            </div>
            <RedeemButton classes={''} content={`Redeem`} />
          </form>
        </div>
      </div>
    )
  }
  
  export default Header