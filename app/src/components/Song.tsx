import './Song.scss';

interface SongI {
  number: number,
  youtubeId: string,
  name: string,
  time: string,
  author: string
}

function Song(props: SongI) {
  return (
    <div className='Song'>
      <h3 className='Number'>{props.number}</h3>
      <img src={`https://img.youtube.com/vi/${props.youtubeId}/hqdefault.jpg`}
      alt="thumbnail" className='Thumbnail'/>
      <div className='TextInfo'>
        <p className='Title'>{props.name}</p>
        <div className='ExtraInfo'>
          <p className='Time'>{props.time}</p>
          <p className='Author'>{props.author}</p>
        </div>
      </div>
    </div>
  );
}

export default Song;
