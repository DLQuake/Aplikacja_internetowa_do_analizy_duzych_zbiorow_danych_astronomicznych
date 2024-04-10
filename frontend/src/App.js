import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import EditUser from "./pages/EditUser";
import HomePage from "./pages/HomePage";
import Contact from "./pages/Contact";
import Register from "./components/Register";
import Login from "./components/Login";
import Locations from "./pages/Locations";
import AboutUs from "./pages/AboutUs";
import Historydatas from "./pages/Historydatas";

function App() {
	return (
		<div>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/aboutus" element={<AboutUs />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/contact" element={<Contact />} />
					<Route path="/users" element={<Users />} />
					<Route path="/users/edit/:id" element={<EditUser />} />
					<Route path="/locations" element={<Locations />} />
					<Route path="/historydata" element={<Historydatas />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
