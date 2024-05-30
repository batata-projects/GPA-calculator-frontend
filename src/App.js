import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import MainHeader from './components/MainHeader/MainHeader';
import Welcome from './components/Welcome/Welcome.js';
import Signup from './components/signup/signup.js';

const App = () => {
    
    return (
        <>
        <MainHeader />
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/home" element={<Home />}/>
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </BrowserRouter>
        </>
    );
};

export default App;
