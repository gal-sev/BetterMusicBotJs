import './Search.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faSquarePlus } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';
import axios from 'axios';
import Song from './Song';
import { SendAddSong } from '../shared/serverFuncs';

const YT_TOKEN = process.env.REACT_APP_YT_TOKEN;

function Search() {

  const [searchQueue, setSearchQueue] = useState([]);
  const [searchStr, setSearchStr] = useState("");

  return (
    <div className='Content Search'>
      <div className='SearchTop'>
        <input type="text" id="SearchInput" placeholder="Search" 
          onChange={(event) => { 
            setSearchStr(event.target.value);
           }}
        />
        <button onClick={async () => {
          setSearchQueue(await fetchYoutubeSearch(searchStr, YT_TOKEN));
        }}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
        <button onClick={() => {SendAddSong(searchStr);}}>
          <FontAwesomeIcon icon={faSquarePlus} />
        </button>
      </div>
      <div className='QueueHolder'>
          {getSearchQueueAsElement(searchQueue)}
      </div>
    </div>
  );
}

function getSearchQueueAsElement(searchQueue: any) {
  if (searchQueue === undefined) {
    return <h3>Loading</h3>
  } else {
    return <>
      {searchQueue.map((song: any, index: number) => {
        return <Song key={index} number={index+1} youtubeId={song.id.videoId} name={song.snippet.title}
        author={song.snippet.channelTitle}/>
      })}
    </>;
  }
}

async function fetchYoutubeSearch(title: string, apiKey: string | undefined) {
  try {
    let res = await axios.get(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${title}&key=${apiKey}&maxResults=9`)
    return res.data.items;
  } catch (error) {
    console.log(error);
  }
}

export default Search;
