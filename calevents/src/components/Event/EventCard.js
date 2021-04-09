import PropTypes from 'prop-types'
import "../../styles/components/Event/EventCard.css"

const originCard = ({ event, onClick }) => {
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

const EventCard = ({ event, onClick }) => {
    return (
        <div className='card-container'>
            <div className='image-container'>
                <img src={EventTarget.img_loc} alt="event photo"></img>
            </div>
            <h3 className='title'>{event.name}</h3>
            <div className="info-container">

                <div className='organizer'>By {event.organizer}</div>
                <div className='datetime'>{event.start_time}-{event.end_time}/{event.start_date}</div>
                <h3 className='description-head'>Description:</h3>
                <p className='description-body'>{event.desc}</p>

            </div>
            <div className="btn">
                <button>
                    <a>
                        More
                    </a>
                </button>
            </div>

        </div>
    )
}

export default EventCard


Event.propTypes = {
    event: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
}