import React, {useState} from 'react';
import PropTypes from 'prop-types'

import './TaskSearchBar.style.scss'
import {saveToDB} from "../../helpers";

const TaskSearchBar = ({setTasks}) => {
  const [inputValue, setInputValue] = useState('');

  const updateInputValue = (event) => {
    setInputValue(event.target.value)
  }

  const addNewTask = () => {
    if (inputValue) {
      //Add the new task then reset the value
      const id = (new Date()).getTime();

      setTasks(prevState => {
        const newData = [
          ...prevState,
          {
            id,
            value: inputValue,
          }
        ];

        saveToDB('tasks', newData);
        return newData;
      });
      setInputValue('');
    }
  }

  const onKeyDown = (event) => {
    if (event.key === 'Enter') {
      addNewTask();
    }
  }

  return (
    <div className="TaskSearchBar">
      <label for="search-input"
             className="TaskSearchBar__label">
        قائمة المهام
      </label>
      <div className="TaskSearchBar__searchContent">
        <input id="search-input"
               className="TaskSearchBar__input"
               value={inputValue}
               type="text"
               autoFocus="true"
               placeholder="قم بإضافة مهمه..."
               onChange={updateInputValue}
               onKeyDown={onKeyDown} />
        <button className="TaskSearchBar__button"
                onClick={addNewTask}>
          إضافة
        </button>
      </div>
    </div>);
};

TaskSearchBar.propTypes = {
  setTasks: PropTypes.func,
};

export default TaskSearchBar;
