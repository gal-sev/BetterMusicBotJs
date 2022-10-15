import React from 'react';
import './Search.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

function Search() {
  return (
    <div className='Content Search'>
      <div className='SearchTop'>
        <input type="text" id="SearchInput" placeholder="Search" />
        <button><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
      </div>
    </div>
  );
}

export default Search;
