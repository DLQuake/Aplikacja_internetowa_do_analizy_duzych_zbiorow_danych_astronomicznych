import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Userlist = () => {
	const [users, setUsers] = useState([]);
	const [searchName, setSearchName] = useState("");
	const [searchEmail, setSearchEmail] = useState("");
	const [searchRole, setSearchRole] = useState("");

	useEffect(() => {
		getUsers();
	}, []);

	const getUsers = async () => {
		const response = await axios.get("http://localhost:5000/users");
		setUsers(response.data);
	};

	const deleteUser = async (userId) => {
		await axios.delete(`http://localhost:5000/users/${userId}`);
		getUsers();
	};

	const filteredUsers = users.filter(user => {
		const fullName = `${user.imie} ${user.nazwisko}`.toLowerCase();
		const email = user.email.toLowerCase();
		const role = user.role.toLowerCase();
		return fullName.includes(searchName.toLowerCase()) && email.includes(searchEmail.toLowerCase()) && role.includes(searchRole.toLowerCase());
	});

	return (
		<div className="pl-2 pr-3">
			<h1 className="title">Users</h1>
			<h2 className="subtitle">Search User</h2>
			<div className="field">
				<label className="label">Search by Name and Surname:</label>
				<div className="control">
					<input
						className="input"
						type="text"
						placeholder="Search by name and surname"
						value={searchName}
						onChange={(e) => setSearchName(e.target.value)}
					/>
				</div>
			</div>
			<div className="field">
				<label className="label">Search by Email:</label>
				<div className="control">
					<input
						className="input"
						type="text"
						placeholder="Search by email"
						value={searchEmail}
						onChange={(e) => setSearchEmail(e.target.value)}
					/>
				</div>
			</div>
			<div className="field">
				<label className="label">Search by Role:</label>
				<div className="control">
					<div className="select is-fullwidth">
						<select value={searchRole} onChange={(e) => setSearchRole(e.target.value)}>
							<option value="">Select Role</option>
							<option value="admin">Admin</option>
							<option value="user">User</option>
						</select>
					</div>
				</div>
			</div>
			<div className="table-container">
				<table className="table is-striped is-fullwidth">
					<thead>
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th>Surname</th>
							<th>Email</th>
							<th>Role</th>
							<th>Options</th>
						</tr>
					</thead>
					<tbody>
						{filteredUsers.map((user, index) => (
							<tr key={user.uuid}>
								<td>{index + 1}</td>
								<td>{user.imie}</td>
								<td>{user.nazwisko}</td>
								<td>{user.email}</td>
								<td>{user.role}</td>
								<td>
									<Link to={`/dashboard/users/edit/${user.uuid}`} className="button is-small is-info">Edit</Link>
									<button onClick={() => deleteUser(user.uuid)} className="button is-small is-danger">Delete</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Userlist;
