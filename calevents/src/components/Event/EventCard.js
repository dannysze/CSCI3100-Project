import PropTypes from 'prop-types'
import "../../styles/components/Event/EventCard.css"
import { FormButton } from "../CustomButton.js";


const EventCard = ({ event, onClick }) => {
    return (
        <div className='card-container'>
            <div className='image-container'>
                <img src={EventTarget.img_loc} alt="event photo"></img>
            </div>
            <h3 className='title'>{event.name}</h3>
            <div className="info-container">

                <div className='organizer'>By {event.organizer}</div>
                <div className='datetime'>Time:&nbsp;{event.start_time.substring(0, 5)}&nbsp;-&nbsp;{event.end_time.substring(0, 5)}</div>
                <div className='venue'>Date:&nbsp;{event.start_date.split("T")[0]}</div>
                <div className='venue'>Venue:&nbsp;{event.venue}</div>
                <h3 className='description-head'>Description:</h3>
                <p className='description-body'>{event.description}</p>

            </div>
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