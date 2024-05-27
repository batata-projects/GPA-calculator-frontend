import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Signin from './pages/signin/signin.js';
import Welcome from './pages/welcome/welcome.js';
import Signup from "./pages/signup/signup.js";


function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Welcome />} />
				<Route path="/signin" element={<Signin />} />
				<Route path="/signup" element={<Signup />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
