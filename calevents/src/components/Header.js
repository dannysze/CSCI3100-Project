import React, { useState, useEffect, useContext } from 'react';
import { CSSTransition } from 'react-transition-group';
import * as Icon from 'react-bootstrap-icons';
import { RedeemButton, CloseButton } from './CustomButton';
import getaddr from './getaddr';
import useToken from '../useToken'
import { UserContext } from '../UserContext';
import '../styles/components/Header.css';

const Header = () => {

  const [events, setEvents] = useState([]);
  const {token} = useToken();
  const {user, setUser} = useContext(UserContext);

  const headerItems = [
    {
        title: `$${Math.round(user.account_balance * 10) / 10}`,
        url: '#',
        icon: <Icon.Plus />,
        cName: 'header-items',
        onclick: () => { setShowRedeem(true) }
    },
    {
        title: `${user.username} `,
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
        <AddValueBox closeModal={closeModal} userInfo={user}/>
      </CSSTransition>
      {headerItems.map((item, index) => <a href={item.url} className={`flex-center ${item.cName}`} key={index} onClick={item.onclick}>{item.title}{item.icon}</a>)}
    </div>
  )
}

const AddValueBox = ({ closeModal, userInfo }) => {
  
  // const [prePaidCard, setPrePaidCard] = useState({ 'number': '', 'password': '' })
  const [cardNumber, setCardNumber] = useState('');
  const [password, setPassword] = useState('');
  const [redeemResult, setRedeemResult] = useState({errormsg:"", alert:false});
  
  const onChangeHandler = (event) => {
    event.target.name === 'number' ? setCardNumber(event.target.value) : setPassword(event.target.value);
    setRedeemResult({errormsg:"", alert:false});
  } 

  const redeemCard = async (event) => {
    event.preventDefault();
    // send request POST /add_value
    // const form = new FormData(document.getElementById("redeem-form"));
    // form.append('user_id', userInfo.user_id)
    if(!cardNumber||!password){
      setRedeemResult({errormsg:"No fields should be left blank", alert:true});
      return;
    }
    const requestOptions = {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({card_id:cardNumber, card_pw:password, user_id:userInfo.user_id})
    };
    let response = await fetch(getaddr()+'add_value', requestOptions);
    let result = await response.json();
    try{
      if (!response.ok) {
        //console.log(result);
        setRedeemResult({errormsg:result['error'],alert:true})
      } else {
        //alert("err");
        setRedeemResult({errormsg:result['success'],alert:true})
      }
    }catch(err){
      console.log(err);
    } 
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
            {<div className="alert-box" style={redeemResult.alert ? {visibility: 'visible'} : {visibility: 'hidden'}}>{redeemResult.errormsg}</div>}
            <RedeemButton classes={''} content={`Redeem`} />
          </form>
        </div>
      </div>
    )
  }
  
  export default Header