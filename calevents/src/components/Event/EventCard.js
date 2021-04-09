import PropTypes from 'prop-types'
import "../../styles/components/Event/EventCard.css"

const EventCard = ({ event, onClick }) => {
    return (
        <div className='eventCard' onClick={() => { onClick() }}>



            <h3 className='datetime'>{event.start_time}-{event.end_time}/{event.start_date}</h3>
            <h3 className='title'>{event.name}</h3>
            <p className='desc'>
                {event.desc}
            </p>


        </div>
    )
}

const New_card = ({ event, onClick }) => {
    return (
        <div className='card-container'>
            <div className='image-container'>
                <img src="url" alt="event photo"></img>
            </div>
            <div className="Info-container">
                <h3 className='title'>Event Name: {event.name}</h3>
                <h3 className='Organizer'>Organizer: {event.organizer}</h3>
                <h3 className='datetime'>Event time/ date: {event.start_time}-{event.end_time}/{event.start_date}</h3>
                <h3 className='description-head'>Description:</h3>
            </div>
        </div>
    )
}

export default EventCard


Event.propTypes = {
    event: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
}