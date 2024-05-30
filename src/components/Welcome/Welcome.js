import './Welcome.css';
import { useContext } from 'react';
import AuthContext from '../../store/auth-context';
import { Helmet } from 'react-helmet';


const Welcome = () => {
    const ctx = useContext(AuthContext);

    return (
        <>
        <Helmet>
            <title>Welcome to GPA Calculator</title>
        </Helmet>
        <div className="welcome-container">
            <div className="text">
                <h1>Welcome to GPA Calculator!</h1>
                <nav className="nav-links">
                    <ul>
                        <li>
                            {!ctx.isLoggedIn && <a href="/login">Log in</a>}
                            {ctx.isLoggedIn && <a href="/home">Home</a>}
                        </li>
                        <li>
                            {!ctx.isLoggedIn && <a href="/signup">Sign Up</a>}
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="credits">
                {/* <p>Created by: <a href="https://github.com/Kaa75">Karim Abboud</a> */}
                {/* , <a href="https://github.com/jadshaker">Jad Shaker</a> </p> */}
            </div>
        </div>
        </>
    );
}

export default Welcome;
