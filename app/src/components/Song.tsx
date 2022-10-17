import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SendAddSong } from '../shared/serverFuncs';
import './Song.scss';

export interface SongI {
  number: number,
  youtubeId: string,
  name: string,
  time?: string,
  author: string
}

function Song(props: SongI) {
  return (
    <div className='Song'>
      <h3 className='Number'>{props.number}</h3>
      <img src={`https://img.youtube.com/vi/${props.youtubeId}/hqdefault.jpg`}
        alt="thumbnail" className='Thumbnail' />
      <div className='TextInfo'>
        <p className='Title'>{props.name}</p>
        <div className='ExtraInfo'>
          {
            props.time ? <p className='Time'>{props.time}</p> : undefined
          }
          <p className='Author'>{props.author}</p>
        </div>
      </div>
      {
        // return add button only if there is no time avaliable (in search queue)
        props.time ? undefined :
          <button onClick={() => { SendAddSong(props.name); }}>
            <FontAwesomeIcon icon={faSquarePlus} />
          </button>
      }
    </div>
  );
}

export default Song;
