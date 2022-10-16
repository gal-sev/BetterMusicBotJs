import './Queue.scss';
import Song from './Song';

function Queue() {
  return (
    <div className='Content Queue'>
      <div className='QueueTop'>
        <h2>Queue</h2>
      </div>
      <div className='QueueHolder'>
        <Song number={1} youtubeId="dQw4w9WgXcQ" name="Rick Astley - Never Gonna Give You Up (Official Music Video)"
        time="3:08" author="Rick Astley"/>

      </div>
    </div>
  );
}

export default Queue;
