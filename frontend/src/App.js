import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import EditUser from "./pages/EditUser";
import HomePage from "./pages/HomePage";
import Contact from "./pages/Contact";
import Register from "./components/Register";
import Login from "./components/Login";
import AddTasks from "./pages/AddTasks";
import Tasks from "./pages/Tasks";
import EditTasks from "./pages/EditTasks";

function App() {
	return (
		<div>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/contact" element={<Contact />} />
					<Route path="/users" element={<Users />} />
					<Route path="/users/edit/:id" element={<EditUser />} />
					<Route path="/tasks" element={<Tasks />} />
					<Route path="/tasks/add" element={<AddTasks />} />
					<Route path="/tasks/edit/:id" element={<EditTasks />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
