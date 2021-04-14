//This is a js file for creating the event card that shows in home page of CalEvents
import PropTypes from 'prop-types'
import "../../styles/components/Event/EventCard.css"
import { FormButton } from "../CustomButton.js";
import { EventModal } from '../Event/Events'


const EventCard = ({ event, onClick }) => {
    // console.log(event)
    //The following code is the card for showing upcoming events in home page
    return (
        // The container for making a card, and storing other card components inside the event card
        <div className='card-container'>
            {/* create space and show image inside the card */}
            <div className='image-container'>
                <img src={event.img_loc} alt="event photo"></img>
            </div>
            {/* shows the event's title in the card */}
            <h3 className='title'>{event.name}</h3>
            {/* create space and show informations of the event */}
            <div className="info-container">
                <div className='organizer'>Organizerd by <b>{event.username}</b></div>
                <div className='datetime'>Time:&nbsp;{event.start_time.substring(0, 5)}&nbsp;-&nbsp;{event.end_time.substring(0, 5)}</div>
                <div className='venue'>Date: {event.start_date === event.end_date ? `${event.start_date}` : `${event.start_date}` + "  to  " + `${event.end_date}`}</div>
                <div className='venue'>Venue:&nbsp;{event.venue}</div>
                <h3 className='description-head'>Description:</h3>
                <p className='description-body'>{event.description}</p>
            </div>
            {/* A more button inside the card for use to click and see the complete information of the event, and perform options like join and contact organizer */}
            <div className="card-btn">
                <button className="flex-center" onClick={onClick}>More</button>
            </div>
        </div>
    )
}

export default EventCard


Event.propTypes = {
    event: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
}