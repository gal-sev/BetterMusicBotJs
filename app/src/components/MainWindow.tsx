import React from 'react';
import './MainWindow.scss';
import Search from './Search';

function MainWindow() {
  return (
    <div className="MainWindow">
      <h1 className='SongName' id='songName'>Music room</h1>
      <div className='ContentHolder'>
        <div className='Content'>
          <h2>Queue</h2>
        </div>
        <Search />
      </div>
    </div>
  );
}

export default MainWindow;
