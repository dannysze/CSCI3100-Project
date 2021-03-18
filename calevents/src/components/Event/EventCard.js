import PropTypes from 'prop-types'
import "./EventCard.css"
const EventCard = ({event, onClick}) => {
    return (
        <div className='eventCard' onClick={() => {onClick()}}>
            <h3 className='datetime'>{event.start_time}-{event.end_time}/{event.start_date}</h3>
            <h3 className='title'>{event.name}</h3>
            <p className='desc'>
                {event.desc}
            </p>
        </div>
    )
}

export default EventCard


Event.propTypes = {
    event: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
}