import React from 'react';
import './BottomController.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faForwardStep, faBackwardStep, faShuffle } from '@fortawesome/free-solid-svg-icons';
import { SendSkipSong } from "../shared/serverFuncs";

function BottomController() {
  return (
    <div className="BottomController">
      <h2 className='SongName' id='SongName'>song name</h2>
      <div className='SongControls'>
        <button id='backStepButton' onClick={() => {console.log("BackPress");}}><FontAwesomeIcon icon={faBackwardStep} /></button>
        <button id='playButton' ><FontAwesomeIcon icon={faPlay} /></button>
        <button id='pauseButton'><FontAwesomeIcon icon={faPause} /></button>
        <button id='forwardButton' onClick={() => {SendSkipSong()}}>
          <FontAwesomeIcon icon={faForwardStep} />
        </button>
        <button id='ShuffleButton'><FontAwesomeIcon icon={faShuffle} /></button>
      </div>
    </div>
  );
}

export default BottomController;
