import './welcome.css';

const Welcome = () => {
    return (
        <div className="container">
            <div className="text">
                <h1>Welcome to the GPA Calculator!</h1>
                <nav className="nav-links">
                    <ul>
                        <li>
                            <a href="/signin">Sign In</a>
                        </li>
                        <li>
                            <a href="/signup">Sign Up</a>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="credits">
                <p>Created by: <a href="https://github.com/Kaa75">Karim Abboud</a>
                , <a href="https://github.com/jadshaker">Jad Shaker</a> </p>
            </div>
        </div>
    );
}

export default Welcome;
