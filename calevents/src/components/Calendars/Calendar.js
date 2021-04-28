// Calendar is the component at the main page
// It display the public events created by organizers
import React, { useState, useEffect, useContext} from 'react';
import { startOfMonth, startOfWeek, endOfMonth, endOfWeek, startOfDay, addDays, getDate, getMonth, getYear, addMonths, subMonths, getWeekOfMonth, getDay, differenceInDays, differenceInCalendarDays, differenceInCalendarWeeks, getDaysInMonth } from 'date-fns';
import { Modal } from 'react-bootstrap';
import { CalendarButton } from '../CustomButton';
import { CSSTransition } from 'react-transition-group';
import EventForm from '../Event/EventForm';
import EventCard from '../Event/EventCard';
import { EventModal } from '../Event/Events';
import getaddr from '../getaddr';
import {UserContext} from '../../UserContext';
import useToken from '../../useToken';
import '../../styles/components/Calendars/Calendar.css';

// constants store the names of the calendar
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['January', 'Feburay', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// get the calendar days of specfied date
const takeMonth = (date = new Date()) => {
  let days = [];
  // find the first and last calendar day of a month
  let start = startOfWeek(startOfMonth(startOfDay(date)));
  let end = endOfWeek(endOfMonth(startOfDay(date)));

  let day = start;
  let calendarObj = {};
  while (day < end) {
    
    calendarObj = {
      'day': day,
      'disabled': false,
      'today': false,
      'sunday': false,
      'hide': 0
    }
    // disable when the day is not in the same month 
    if (day < startOfMonth(startOfDay(date)) || day > endOfMonth(startOfDay(date))) {
      calendarObj.disabled = true;
    }
    if (getDay(day) === 0) {
      calendarObj.sunday = true;
    }
    if (differenceInCalendarDays(day, new Date()) == 0) {
      calendarObj.today = true;
    }
    days.push(calendarObj);
    day = addDays(day, 1);
  }
  // return array of calendar days (obj)
  return days;
}

// sqlToJsDate convert the date from format in sql db (YYYY-MM-DD) to js Date obj
const sqlToJsDate = (sqlDate, sqlTime) => {
  var sqlDateArr1 = sqlDate.split("-");
  var sYear = sqlDateArr1[0];
  var sMonth = (Number(sqlDateArr1[1]) - 1).toString();
  var sDay = sqlDateArr1[2];
  var sqlTimeArr = sqlTime.split(":");
  return new Date(sYear,sMonth,sDay,sqlTimeArr[0],sqlTimeArr[1],sqlTimeArr[2]);
}

// Main component
// props:
// heightHandler: change the height of the upcoming event container depending on the height of the calendar
const Calendar = ({ heightHandler }) => {

  const {user, setUser} = useContext(UserContext);
  const {token, setToken} = useToken();
  // initial information of the calendar (day of visit)
  const today = startOfDay(new Date());
  const initialInfo = { 
    'calendarStart': startOfMonth(today), 
    'calendarArr': takeMonth(today)
  };
  const [calendarInfo, setCalendarInfo] = useState(initialInfo);
  const [events, setEvents] = useState([]);
  const [eventForm, setEventForm] = useState({
    'show': false,
    'startDate': new Date(),
  });
  const [eventCardModal, setEventCardModal] = useState({
    'toggle': false,
    'events': []
  });

  // change the height of upcoming events according to the calendar
  useEffect(() => {
    heightHandler();
    const getEvents = async () => {
      // get the events from the datebase and store them in the state
      const eventsFromServer = await fetchEvents();
      setEvents(eventsFromServer);
    }
    getEvents();
  }, [calendarInfo], [events]);
  
  const fetchEvents = async () => {
    const res = await fetch(getaddr()+'search_events', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    const data = await res.json()
    return data
  }
  
  // add fetched events to calendar
  let dayRecord = {};
  const stickEvents = () => {
    dayRecord = {};
    const eventsBars = events.map((event) => {

      // Convert the datetime in sql db to js date obj
      let start_date = sqlToJsDate(event.start_date, event.start_time);
      let end_date = sqlToJsDate(event.end_date, event.end_time);
      
      // filtering the events that are not in the calendar range
      if (end_date < calendarInfo.calendarArr[0].day || start_date > calendarInfo.calendarArr[calendarInfo.calendarArr.length-1].day) {
        return
      } 
      // if the startdate of the event is before the start of the calendar
      // set the start date to the start of the calendar month
      if (start_date < calendarInfo.calendarArr[0].day) {
        start_date = calendarInfo.calendarArr[0].day;
      } 
      // set the end day as above
      if (end_date > calendarInfo.calendarArr[calendarInfo.calendarArr.length-1].day) {
        end_date = calendarInfo.calendarArr[calendarInfo.calendarArr.length-1].day;
      }
      // get the start, end, duration and difference in calendar week of the event
      let start = startOfDay(start_date);
      let end = startOfDay(end_date);
      let startRow = getWeekOfMonth(start) + 1;
      let colNum = getDay(start) + 1;
      let diffDays = differenceInDays(end, start) + 1;
      let diffWeeks = differenceInCalendarWeeks(end, start);
      
      // set the calendar row that event should be started and ended
      if (start_date < calendarInfo['calendarStart']) {
        startRow = 2;
      } 
      if (start_date > endOfMonth(calendarInfo['calendarStart'])) {
        startRow = getWeekOfMonth(endOfMonth(calendarInfo['calendarStart'])) + 1
      }

      // calculate the col span for each row
      let span;
      if (diffWeeks > 0) {
        span = [...Array(diffWeeks + 1)].map((_, index) => {
          if (index == 0) {
            diffDays -= (7 - colNum) + 1
            return (7 - colNum) + 1;
          } else if (index == diffWeeks) {
            return diffDays;
          } else {
            diffDays -= 7;
            return 7;
          }
        })
      } else {
        span = [diffDays]; 
      }
      
      // Display rule:
      // Show at most 2 events in one calendar day
      // start earlier, display first

      let curPos = {
        'center': true,
        'end': true,
      }
      // check if that day has events displayed
      for (let i = start; i <= end; i = addDays(i, 1)) {
        if (dayRecord[i]) {
          // the number of events on that day
          dayRecord[i]['frequency']++;
          curPos['center'] = curPos['center'] && dayRecord[i]['center']
          curPos['end'] = curPos['end'] && dayRecord[i]['end']
        } else {
          dayRecord[i] = {
            'center': true,
            'end': true,
            'frequency': 1,
            'hide': 0,
            'row': startRow + differenceInCalendarWeeks(i, start),
            'column': getDay(i) + 1,
            'events': []
          }
        }
        dayRecord[i]['events'].push(event);
      }

      let display = 'block';
      // check if the capacity of that day is full, if not, set the state of the of that position to false 
      if (curPos['center']) {
        for (let i = start; i <= end; i = addDays(i, 1)) {
          dayRecord[i]['center'] = false;
        }
      } else if (curPos['end']) {
        for (let i = start; i <= end; i = addDays(i, 1)) {
          dayRecord[i]['end'] = false;
        }
      } else {
        // calculate the number of events should be hidden
        display = 'none'
        dayRecord[start]['hide']++;
      }
      // decide the correct position to the current events
      let pos = curPos['center'] ? 'center' : (curPos['end'] ? 'end' : '');
      
      return (span.map((colSpan, idx) => {
        // set the CSS style to the event bar
          let style = {
            gridColumn: `${idx == 0 ? colNum : 1} / span ${colSpan}`,
            gridRow: `${startRow + idx}`,
            alignSelf: `${pos}`,
            display: display
          }
          return (
            <CalendarEvent key={idx} classes={`task--${event.category === null ? "" : event.category.split(' ')[0]}`} styles={style} name={event.name} />
          )
        })
      )
    })
    return eventsBars;
  }

  // stick the tag that indicating number of hidden events on that day
  const stickTags = () => {
    let tagsArr = [];
    for (let key in dayRecord) {
      if (dayRecord[key]['hide'] !== 0) {
        // style obj of the tag
        let style = {
          gridColumn: `${dayRecord[key]['column']}`,
          gridRow: `${dayRecord[key]['row']}`,
          alignSelf: 'start',
        }
          tagsArr.push(<CalendarTag styles={style} hide={dayRecord[key]['hide']} key={key} />)
      } else {
      }
    }
    return tagsArr
  }

  // view the previous month
  const previousMonth = () => {
    let newMonth = subMonths(calendarInfo['calendarStart'], 1);
    setCalendarInfo({
      'calendarStart': newMonth,
      'calendarArr': takeMonth(newMonth)
    });
  }

  // view the next month
  const nextMonth = () => {
    let newMonth = addMonths(calendarInfo['calendarStart'], 1);
    setCalendarInfo({
      'calendarStart': newMonth,
      'calendarArr': takeMonth(newMonth)
    });
  }

  // double click event handler of the calendar box
  // show create event form in modal pop up
  const createEventForm = (date) => {
    setEventForm({
      'show': true,
      'startDate': date
    });
  }

  // hover event handler of the calendar box
  // show the modal including all the events cards (including hidden) 
  const showEventCardModal = (date) => {
    if (dayRecord[date]) {
      setEventCardModal({ 'toggle': true, 'events': dayRecord[date]['events']});
    } else setEventCardModal({ 'toggle': true, 'events': []});
     
  }

  // initializing the event cards modal
  const [eventModal, setEventModal] = useState({ 'toggle': false, 'event': {}})

  // click event handler of the event card in the event cards modal
  const dismissEventCardModal = (e) => {
    setEventCardModal({ 'toggle': false , 'events': []})
    setEventModal({ 'toggle': true, 'event': e})
  }

  return (
    <div className="calendar-container">
      {/* Event form component with CSS transition */}
      <CSSTransition
        in={eventForm['show']}
        timeout={300}
        classNames={"create-event-form-"}
        unmountOnExit
      >
        <EventForm dismissHandler={() => setEventForm({'show': false, 'startDate': eventForm['startDate']})} startDate={eventForm['startDate']} edit={false}/>
      </CSSTransition>
      {/* The header of calendar */}
      <div className="calendar-header">
        <CalendarHeader 
          month={monthNames[getMonth(calendarInfo['calendarStart'])]} 
          year={getYear(calendarInfo['calendarStart'])} 
          previousMonth={previousMonth}
          nextMonth={nextMonth}
        />
      </div>
      {/* Main part of the calendar */}
      <div className="calendar">
        {dayNames.map((day, index) => (<span className="day-name" key={index} style={day === "Sun" ? {color: "rgb(217, 83, 79)"} : {}}>{day}</span>))}
        {calendarInfo['calendarArr'].map((item, index) => {
          // console.log(item)
          return (<CalendarItems 
            disabled={item.disabled} 
            name={(item.day)} 
            today={item.today} 
            sunday={item.sunday} 
            key={index} 
            doubleClickHandler={user.type==1?createEventForm:()=>{}}            
            clickHandler={showEventCardModal}
            />)
        })}
        {/* Components of the events bars and the tags */}
        {stickEvents()}
        {stickTags()}
      </div>
      {/* The color label and the guide of calendar */}
      <div className="flex-center" style={{justifyContent: 'space-between', fontSize: '.8em'}}>
          {['Sport', 'Music', 'Academic', 'Health', 'Festival', 'Career-related', 'Whole-person development', 'Others'].map((item, index) => (
                    <div className="calendar-labels">
                      <span className={`task--${item} dot`}></span> {item}
                    </div>
            ))}     
          <div classNames="calendar-tips">*<b>Hover</b> to check events of the day. <b>Double Click</b>  to create public event (Only for organizer).</div>
      </div>
      {/* bootstrap modal component for the event card modal */}
      <Modal
        show={eventCardModal['toggle']}
        onHide={() => setEventCardModal({ 'toggle': false , 'events': []})}
        dialogClassName="calendar-event-modal"
      >
        <Modal.Header closeButton className="calendar-event-modal-title">More Events...</Modal.Header>
        <Modal.Body>
          <div className="calendar-event-list-modal-container">
            {eventCardModal['events'].length != 0 ? eventCardModal['events'].map((ev, index) => {
              return <EventCard event={ev} key={index} onClick={() => dismissEventCardModal(ev)} />
            }) : <h1>There is no more events on this day</h1>}
          </div>
        </Modal.Body>
      </Modal>
      {/* Event modal conataining the details of a events */}
      <EventModal showEvent={eventModal} setShow={setEventModal}/>
    </div>
  )
}

// component of the header of calendar
const CalendarHeader = ({ month, year, previousMonth, nextMonth }) => {
  return (
    <>
      <h1 className="flex-center">
        <CalendarButton classes="calendar-button-left" clickHandler={previousMonth} />
        <span style={{width: '100px', textAlign: 'center'}}>{month}</span>
        <CalendarButton classes="calendar-button-right" clickHandler={nextMonth} />
      </h1>
      <p>{year}</p>
    </>
  )
}

// component of each day box of the calendar 
const CalendarItems = (props) => {

  const mouseOverHandler = (event) => {
    var delay = setTimeout(() => {
      props.clickHandler(props.name)
    }, 1000)
    event.target.addEventListener('mouseleave', () => {clearTimeout(delay)})
  }

  return (
    <div className={`day ${props.disabled ? 'day--disabled' : ''}`} style={props.sunday ? {color: `rgba(217, 83, 79, ${props.disabled ? 0.6 : 1})`} : {}} onDoubleClick={() => props.doubleClickHandler(props.name)} onMouseOver={mouseOverHandler}>
      <span className={props.today ? "calendar--today" : ""}>{getDate(props.name)}</span>
    </div>
  )
}

// Event bars
const CalendarEvent = ({ classes, name, styles }) => {
  return (
    <section className={`task ${classes}`} style={styles}>{name}</section>
  )
}

// Tags in the day box
const CalendarTag = ({ styles, hide }) => {
  return (
    <section className='tag' style={styles}>{`${hide} more`}</section>
  )
}

export default Calendar