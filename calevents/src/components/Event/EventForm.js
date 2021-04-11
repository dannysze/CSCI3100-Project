import React, { useEffect, useState } from 'react';
import { addHours } from 'date-fns';
import CustomDatePicker from '../CustomeDatePicker';
import { Image, Tag, GeoAlt, CalendarEvent, People, CashStack } from 'react-bootstrap-icons';
import { CloseButton, FormButton } from '../CustomButton';
import useToken from '../../useToken';
import getaddr from '../getaddr'

import '../../styles/components/Event/EventForm.css';

const EventForm = ({ dismissHandler, startDate }) => {

  const [startSelectedDate, setStartSelectedDate] = useState(startDate);
  const [endSelectedDate, setEndSelectedDate] = useState(addHours(startDate, 1));
  const [event, setEvent] = useState({
    user_id: '',
    event_name: '',
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
    visible: 0,
    repeat: 0,
    venue: '',
    capacity: 0,
    description: '',
    ticket: 10,
    refund: 1,
    refund_days: 0,
    catagory: '',
  });

  const {token, setToken} = useToken();
  const [user, setUser] = useState({});
  const [reload, setReload] = useState(false);
  const [file, setFile] = useState({
    'src': '#',
    'value': '',
  });
  //this gets the user info by token, change to /userinfo/:uid for general user
  const getUser = async () => {
      try{
        //change getaddr() to getaddr(isLocal=false) to make it use remote address
        //basically passing the token by the header
        let res = await fetch(getaddr()+'user', {
          method: 'GET',
          headers: {
            'auth': token,
            'Content-Type': 'application/json',
          },
          //body: JSON.stringify({token:token}),
        });
        let body = await res.json();
        setUser(body);
      }catch(err){
        console.log(err);
      }
    }

  useEffect(() => {
    getUser();
    console.log(user)
  },[token,reload]);

  var pfp;
  const fileSelectedHandler = uploadedFile => {
    if (window.FileReader) {
      pfp = uploadedFile.target.files[0];
      let reader = new FileReader();
      reader.onload = function (e) {
        setFile({
          ...file,
          'src': e.target.result,
        })
        
        document.getElementsByClassName('create-event-form--image-upload')[0].style.display = 'none';
        document.getElementsByClassName('create-event-form--image-wrapper')[0].style.display = 'block';
      }
      reader.readAsDataURL(pfp)
      setFile({
        ...file,
        'value': reader
      })
    } else {
     alert("Your browser does not support for preview")
    }
  }

  const fileUploadHandler = async event => {
    event.preventDefault();
    let data = new FormData();
    if(!pfp) return;
    data.append('pfp', pfp);
    await fetch(getaddr()+'updatepfp', {
      method: 'POST',
      headers: {
        'auth': token,
        //'Content-Type': 'multipart/form-data',
      },
      body: data,
    });
    setReload(!reload);
  }

  // handling the input of the event form
  const onChangeHandler = (e) => {
    const ticketCheckbox = document.getElementById('create-event-form').elements.namedItem('free');
    const refundCheckbox = document.getElementById('create-event-form').elements.namedItem('refund');
    const ticketInput = document.getElementById('create-event-form').elements.namedItem('ticket');
    const refundInput = document.getElementById('create-event-form').elements.namedItem('refund_days');
    if ((e.target.type === 'checkbox') && !e.target.checked) {
      // e.target.checked = true;
      if (e.target.name === 'free') {
        ticketInput.disabled = false;
        setEvent({...event, [e.target.name]: 0, ticket: ''});
      } else if (e.target.name === 'refund') {
        refundInput.disabled = true;
        refundInput.value = '';
        // console.log(document.getElementById('create-event-form').elements.namedItem('refund_days'))
        setEvent({...event, [e.target.name]: 0, refund_days: 0});
      }
    } else if ((e.target.type === 'checkbox') && e.target.checked) {
      // e.target.checked = false;
      if (e.target.name === 'free') {
        ticketInput.disabled = true;
        ticketInput.value = '';
        refundInput.disabled = true;
        refundInput.value = '';
        setEvent({...event, [e.target.name]: 1, refund: 0, ticket: 0, refund_days: 0});
      } else if (e.target.name === 'refund' && !ticketCheckbox.checked) {
        refundInput.disabled = false;
        // console.log(document.getElementById('create-event-form').elements.namedItem('refund_days'))
        setEvent({...event, [e.target.name]: 1, refund_days: 1});
      }
    } else {
      setEvent({...event, [e.target.name]: e.target.value});
    }
    // console.log(event);
  }

  return (
    <div className="create-event-form--background flex-center" onClick={dismissHandler}>
      <div className="create-event-form--container" onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={dismissHandler} style={{fontSize: '2em', top: '10px', left: '10px'}} />
        <h1 className="create-event-form--title">create event</h1>
        <form id="create-event-form">
          <div className="create-event-form--image-upload-container flex-center">
            <input type="file" accept="image/*" onChange={fileSelectedHandler} />
            <div className="create-event-form--image-upload">
              <h1><Image /></h1>
              <h4>DRAG and DROP OR SELECT image</h4>
            </div>
            <div className="create-event-form--image-wrapper">
              <img className="create-event-form--uploaded-image" src={file.src} alt="Your image" />
              <div className="create-event-form--remove-imgae-button">
               {/* <FormButton content="Remove" classes={'remove-button'}/> */}
              </div>
            </div>
          </div>
          <div className="create-event-form--input-group">
            <div className="create-event-form--input">
              <span className="create-event-form--input-prepend flex-center">
                <CalendarEvent />
              </span>
              <input type="text" name="event_name" placeholder="Event" onChange={onChangeHandler}/>
            </div>
            <div className="create-event-form--input">
              <span className="create-event-form--input-prepend flex-center">
                <GeoAlt />
              </span>
              <input type="text" name="venue" placeholder="Venue" onChange={onChangeHandler}/>
            </div>
          </div>
          <div className="create-event-form--input-group">
            <div className="create-event-form--input create-event-form--datepicker">
              <CustomDatePicker
                onChangeHandler={(date) => setStartSelectedDate(date)}
                startDate={startSelectedDate}
                placeholder="Select Start Time"
              />
            </div>
            <div className="create-event-form--input">
              <CustomDatePicker 
                onChangeHandler={(date) => {setEndSelectedDate(date); console.log(endSelectedDate); }}
                startDate={endSelectedDate}
                placeholder="Select End Time"
              />
            </div>
          </div>
          <div className="create-event-form--input-group create-event-form--input-grid">
            <div className="create-event-form--input" style={{gridRow: '1 / span 1', gridColumn: '1', paddingRight: '5px'}}>
              <span className="create-event-form--input-prepend flex-center">
                <Tag />
              </span>
              <select className="" name="catagory" placeholder="">
                {['Sport', 'Music', 'Academic'].map((item, index) => (
                  <option value={item} key={index}>{item}</option>
                ))}
              </select>
            </div>
            <div className="create-event-form--input" style={{gridRow: '2 / span 2', gridColumn: '1', paddingRight: '5px', paddingLeft: '0px'}}>
              <textarea className="" name="description" placeholder="Description..."></textarea>
            </div>
            <div className="create-event-form--input" style={{gridRow: '1', gridColumn: '2', paddingRight: '0', paddingLeft: '5px'}}>
              <span className="create-event-form--input-prepend flex-center">
                <People />
              </span>
              <input type="number" name="capacity" placeholder="Capacity" onChange={onChangeHandler}/>
            </div>
            <div className="create-event-form--input create-event-form--checkbox" style={{gridRow: '2', gridColumn: '2', paddingRight: '0'}}>
              <span className="create-event-form--input-prepend flex-center" style={{padding: '9px 8px'}}>
                <CashStack />
              </span>
              <input type="number" name="ticket" placeholder="Ticket" onChange={onChangeHandler} min="0" />
              <span className="create-event-form--input-append">
                <label className="create-event-form--input-label">
                  <input type="checkbox" name="free" onChange={onChangeHandler} checked={event.ticket === 0}/>&nbsp;Free
                </label>
              </span>
            </div>
            <div className="create-event-form--input create-event-form--checkbox" style={{gridRow: '3', gridColumn: '2', paddingRight: '0px'}}>
              <input type="number" name="refund_days" placeholder="Refund before" onChange={onChangeHandler} style={{paddingLeft: '16px'}} min="0" />
              <span className="create-event-form--input-append">
                <label className="create-event-form--input-label">
                  <input type="checkbox" name="refund" onChange={onChangeHandler} value={1} checked={event.refund > 0} />&nbsp;Allow refund
                </label>
              </span>
            </div>
          </div>
          <div className="create-event-form--input-group" style={{paddingBottom: '20px', marginLeft: 'auto'}}>
            <FormButton content="Create" />
          </div>
        </form>
      </div>
    </div>
  )
}

export default EventForm