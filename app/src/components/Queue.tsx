import './Queue.scss';
import Song, { SongI } from './Song';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';

export interface queueI {
  length: number,
  duration: string,
  songs: SongI[]
};

function Queue() {
  const [queue, setQueue] = useState("Loading");

  useEffect(() => {
    axios.get("queue").then((res) => {
      setQueue(res.data);
    }).catch((err) => console.log(err));
  }, []);

  return (
    <div className='Content Queue'>
      <div className='QueueTop'>
        <h2>Queue{getQueueDuration(queue)}</h2>
        {<button id='refreshButton' onClick={() => {
          axios.get("queue").then((res) => {
            setQueue(res.data);
          }).catch((err) => console.log(err));
          }} ><FontAwesomeIcon icon={faRotateRight} /></button>}
      </div>
      <div className='QueueHolder'>
        {getQueueAsElement(queue)}
      </div>
    </div>
  );
}

function getQueueAsElement(queue: queueI | undefined | string) {
  if (queue === undefined) {
    return <h3>Loading</h3>;
  } else if (typeof queue === "string") {
    return <h3>{queue}</h3>;
  } else {
    return <>
      {queue.songs.map((song: any, index: number) => {
        return <Song key={index} number={index+1} youtubeId={song.id} name={song.name}
        time={song.duration} author={song.author}/>
      })}
    </>;
  }
}

function getQueueDuration(queue: queueI | undefined | string) {
  if (queue === undefined) {
    return undefined;
  } else if (typeof queue === "string") {
    return undefined;
  } else {
    return ` - ${queue.duration}`;
  }
}

export default Queue;
