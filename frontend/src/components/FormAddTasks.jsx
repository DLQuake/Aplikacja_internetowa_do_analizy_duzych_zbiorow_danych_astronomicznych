import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FormAddTasks = () => {
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    const addTask = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:5000/tasks`, {
                name: name,
                description: description,
                status: status,
                priority: priority,
                dueDate: dueDate,
            });
            navigate("/tasks");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    return (
        <div>
            <h1 className="title">Add new task</h1>
            <div className="card is-shadowless">
                <div className="card-content">
                    <div className="content">
                        <form onSubmit={addTask}>
                            <p className="has-text-centered">{msg}</p>
                            <div className="field">
                                <label className="label">Name</label>
                                <div className="control has-icons-left">
                                    <input type="text" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                                    <span className="icon is-small is-left">
                                        <i className="fa-solid fa-file-lines"></i>
                                    </span>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Description</label>
                                <div className="control">
                                    <textarea className="textarea" rows="10" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description content..."></textarea>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Status</label>
                                <div className="control has-icons-left">
                                    <div className="select is-fullwidth">
                                        <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                            <option>Choose status</option>
                                            <option value="Not started">Not started</option>
                                            <option value="To complete">To complete</option>
                                            <option value="Done">Done</option>
                                        </select>
                                    </div>
                                    <span class="icon is-small is-left">
                                        <i class="fa-solid fa-square-check"></i>
                                    </span>
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Priority</label>
                                <div className="control has-icons-left">
                                    <div className="select is-fullwidth">
                                        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                                            <option>Choose priority</option>
                                            <option value="High">High</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Low">Low</option>
                                        </select>
                                    </div>
                                    <span class="icon is-small is-left">
                                        <i class="fa-solid fa-square-check"></i>
                                    </span>
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Due Date</label>
                                <div className="control has-icons-left">
                                    <input type="datetime-local" name="dueDate" id="date" className="input" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                                    <span class="icon is-small is-left">
                                        <i class="fa-solid fa-square-check"></i>
                                    </span>
                                </div>
                            </div>

                            <div className="field mt-5 is-grouped is-grouped-centered">
                                <button type="submit" className="button is-link p-5">Add task</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default FormAddTasks;
