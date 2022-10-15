import React from 'react';
import './BottomController.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faForwardStep, faBackwardStep, faShuffle } from '@fortawesome/free-solid-svg-icons'


function BottomController() {
  return (
    <div className="BottomController">
      <h2 className='SongName' id='SongName'>song name</h2>
      <div className='SongControls'>
        <button id='BackStepButton' onClick={() => {console.log("BackPress");}}><FontAwesomeIcon icon={faBackwardStep} /></button>
        <button id='PlayButton' ><FontAwesomeIcon icon={faPlay} /></button>
        <button id='PauseButton'><FontAwesomeIcon icon={faPause} /></button>
        <button id='ForwardButton'><FontAwesomeIcon icon={faForwardStep} /></button>
        <button id='ShuffleButton'><FontAwesomeIcon icon={faShuffle} /></button>
      </div>
    </div>
  );
}

export default BottomController;
