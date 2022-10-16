import React from 'react';
import './MainWindow.scss';
import Queue from './Queue';
import Search from './Search';

function MainWindow() {
  return (
    <div className="MainWindow">
      <h1 className='SongName' id='songName'>Music room</h1>
      <div className='ContentHolder'>
        <Queue />
        <Search />
      </div>
    </div>
  );
}

export default MainWindow;
