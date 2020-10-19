import React, { useState } from 'react';
import PropTypes from 'prop-types';
import checkmarkIcon from '../../assets/icon-checkmark.svg';
import basketIcon from '../../assets/icon-basket.svg';
import EmptyList from '../EmptyList/EmptyList.view';
import { fetchData, saveToDB } from '../../helpers';

import './TaskList.style.scss';

const TaskList = ({ tasks, setTasks }) => {
	const [editModeID, setEditModeID] = useState(-1);

	const [hideCompletedTasksFlag, setHideCompletedTasksFlag] = useState(fetchData('hideCompletedTasksFlag') || false);

	const onUpdateTask = (event, taskID) => {
		const taskValue = event.target.value;

		setTasks((prevState) => {
			const newData = prevState.map((task) => {
				if (task.id === taskID) {
					return { ...task, value: taskValue };
				} else {
					return task;
				}
			});

			saveToDB('tasks', newData);
			return newData;
		});
	};

	const onRemoveTask = (taskID, shouldConfirm) => {
		if (shouldConfirm) {
			const result = window.confirm('سيتم حذف هذه المهمه نهائيا, هل أنت متأكد؟');

			if (!result) {
				return false;
			}
		}

		setTasks((prevState) => {
			const newData = prevState.filter((task) => {
				return task.id !== taskID;
			});

			saveToDB('tasks', newData);
			return newData;
		});
	};

	const onKeyDown = (event, taskID) => {
		if (event.key === 'Enter') {
			const taskValue = event.target.value;

			setEditModeID(-1);

			if (!taskValue.trim()) {
				onRemoveTask(taskID);
			}
		}
	};

	const onCheckTask = (taskID) => {
		setTasks((prevState) => {
			const newData = prevState.map((task) => {
				if (task.id === taskID) {
					return { ...task, done: !task.done };
				} else {
					return task;
				}
			});

			saveToDB('tasks', newData);
			return newData;
		});
	};

	const shouldEditTask = (taskID) => {
		return taskID === editModeID;
	};

	const toggleCompletedTasksFlag = () => {
		const result = !hideCompletedTasksFlag;

		setHideCompletedTasksFlag(result);
		saveToDB('hideCompletedTasksFlag', result);
	};

	const generateTaskClasses = (done) => `TaskList__taskContent ${done ? 'TaskList__taskContent--isActive' : ''}`;

	const generateLinkClasses = `TaskList__link ${hideCompletedTasksFlag ? 'TaskList__link--isActive' : ''}`;

	const exitEditMode = (taskID, taskValue) => {
		setEditModeID(-1);

		if (!taskValue.trim()) {
			onRemoveTask(taskID, false);
		}
	};

	return (
		<div className="TaskList">
			{!!tasks.length && (
				<p className={generateLinkClasses} onClick={toggleCompletedTasksFlag}>
					{hideCompletedTasksFlag ? <span>إظهار المهام المكتملة</span> : <span>إخفاء المهام المكتملة</span>}
				</p>
			)}
			<ul className="TaskList__list">
				{tasks.length ? (
					tasks
						.filter((task) => !hideCompletedTasksFlag || !task.done)
						.reverse()
						.map((task) => (
							<li className={generateTaskClasses(task.done)} key={task.id}>
								{task.done}
								<input
									type="checkbox"
									name="tasks[]"
									id={'task-' + task.id}
									checked={task.done}
									onChange={() => onCheckTask(task.id)}
								/>
								<div className="TaskList__valueContent">
										<input
											id={`task-details-${task.id}`}
											className="TaskList__valueInput"
											type="text"
											value={task.value}
											onChange={(event) => onUpdateTask(event, task.id)}
											onKeyDown={(event) => onKeyDown(event, task.id)}
										/>
										<label className="TaskList__value" htmlFor={`task-details-${task.id}`}>
											{task.value}
										</label>
										<button
											className="TaskList__deleteIcon"
											onClick={() => onRemoveTask(task.id, true)}
											type="button"
										>
											<img src={basketIcon} alt="basket-icon" />
										</button>

								</div>
							</li>
						))
				) : (
					<EmptyList />
				)}
			</ul>
		</div>
	);
};

TaskList.propTypes = {
	tasks: PropTypes.arrayOf(PropTypes.object),
	setTasks: PropTypes.func,
};

export default TaskList;
