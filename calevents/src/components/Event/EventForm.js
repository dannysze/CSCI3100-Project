import React, { useEffect, useState, useContext} from 'react';
import { addHours } from 'date-fns';
import CustomDatePicker from '../CustomeDatePicker';
import { Image, Tag, GeoAlt, CalendarEvent, People, CashStack } from 'react-bootstrap-icons';
import { CloseButton, FormButton } from '../CustomButton';
import useToken from '../../useToken';
import {UserContext} from '../../UserContext';
import getaddr from '../getaddr';

import '../../styles/components/Event/EventForm.css';

const EventForm = ({ dismissHandler, startDate, edit, editInfo, editHandler }) => {

  const [startSelectedDate, setStartSelectedDate] = useState(edit ? editInfo.start_date : startDate);
  const [endSelectedDate, setEndSelectedDate] = useState(edit ? editInfo.end_date : addHours(startDate, 1));
  const [event, setEvent] = useState( edit ? editInfo : {
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
    category: '',
  });

  const {token, setToken} = useToken();
  const {user, setUser} = useContext(UserContext);
  const [reload, setReload] = useState(false);
  const [file, setFile] = useState({
    'src': '#',
    'value': '',
  });

  var img;
  const fileSelectedHandler = uploadedFile => {
    if (window.FileReader) {
      img = uploadedFile.target.files[0];
      let reader = new FileReader();
      reader.onload = function (e) {
        setFile({
          ...file,
          'src': e.target.result,
        })
        
        document.getElementsByClassName('create-event-form--image-upload')[0].style.display = 'none';
        document.getElementsByClassName('create-event-form--image-wrapper')[0].style.display = 'block';
      }
      reader.readAsDataURL(img)
      setFile({
        ...file,
        'value': reader
      })
    } else {
     alert("Your browser does not support for preview")
    }
  }

  //from https://stackoverflow.com/questions/18229022/how-to-show-current-time-in-javascript-in-the-format-hhmmss/18229123
  const  checkTime = (i) => {
    return (i < 10) ? "0" + i : i;
  }

  const toSqlTime = (date) =>{
    let h = checkTime(date.getHours());
    let m = checkTime(date.getMinutes());
    let s = checkTime(date.getSeconds());
    return [h, m, s].join(':');
  }

  const toSqlDate = (date) => {
    let y = date.getFullYear();
    let m = checkTime(date.getMonth());
    let d = checkTime(date.getDay());
    return [y, m, d].join('-');
  }

  const submitHandler = async e => {
    e.preventDefault();
    let data = new FormData();
    if(img) data.append('img', img);
    Object.keys(event).forEach(key => data.append(key, event[key]));
    
    await fetch(getaddr()+'create_event', {
      method: 'POST',
      headers: {
        'auth': token,
        //'Content-Type': 'multipart/form-data',
      },
      body: data,
    });
    //setReload(!reload);
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
      setEvent({...event, [e.target.name]: e.target.value, 
                          start_time:toSqlTime(startSelectedDate),start_date:toSqlDate(startSelectedDate),
                          end_time:toSqlTime(endSelectedDate),end_date:toSqlDate(endSelectedDate),
                          visible:user.type});
    }
    console.log(event);
  }
  
  return (
    <div className="create-event-form--background flex-center" onClick={dismissHandler}>
      <div className="create-event-form--container" onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={dismissHandler} style={{fontSize: '2em', top: '10px', left: '10px'}} />
        <h1 className="create-event-form--title">{edit ? 'edit' : 'create'} event</h1>
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
              <input type="text" name="event_name" placeholder="Event" onChange={onChangeHandler} value={edit ? editInfo.event_name : event.event_name} />
            </div>
            <div className="create-event-form--input">
              <span className="create-event-form--input-prepend flex-center">
                <GeoAlt />
              </span>
              <input type="text" name="venue" placeholder="Venue" onChange={onChangeHandler} value={edit ? editInfo.venue : event.venue} />
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
                onChangeHandler={(date) => {setEndSelectedDate(date)}}
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
              <select className="" name="category" placeholder="" onChange={onChangeHandler}>
                {['Sport', 'Music', 'Academic', 'Health', 'Festival'].map((item, index) => (
                  <option value={item} key={index}>{item}</option>
                ))}
              </select>
            </div>
            <div className="create-event-form--input" style={{gridRow: '2 / span 2', gridColumn: '1', paddingRight: '5px', paddingLeft: '0px'}}>
              <textarea className="" name="description" placeholder="Description..." onChange={onChangeHandler} value={edit ? editInfo.description : event.description}></textarea>
            </div>
            <div className="create-event-form--input" style={{gridRow: '1', gridColumn: '2', paddingRight: '0', paddingLeft: '5px'}}>
              <span className="create-event-form--input-prepend flex-center">
                <People />
              </span>
              <input type="number" name="capacity" placeholder="Capacity" onChange={onChangeHandler} value={edit ? editInfo.capacity : event.capacity} />
            </div>
            <div className="create-event-form--input create-event-form--checkbox" style={{gridRow: '2', gridColumn: '2', paddingRight: '0'}}>
              <span className="create-event-form--input-prepend flex-center" style={{padding: '9px 8px'}}>
                <CashStack />
              </span>
              <input type="number" name="ticket" placeholder="Ticket" onChange={onChangeHandler} min="0" value={edit ? editInfo.ticket : event.ticket} />
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
            <FormButton content={edit ? "edit" : "Create"} clickHandler={edit ? editHandler : submitHandler}/>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EventForm
