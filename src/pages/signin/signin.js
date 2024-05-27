import React, { useState } from 'react';

const SignIn = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission, e.g., send data to the server
        // for now check with predefined data
        if (formData.username === 'admin' && formData.password === 'admin') {
            alert('Login Successful');
        } else {
            alert('Login Failed');
        }
        console.log('Form data submitted:', formData);
        //todo check with server
    };

    return (
        <div>
            <h2>Sign In/Sign Up</h2>
            <form onSubmit={handleSubmit} className="container">
                <div className="input">
                    <label htmlFor="username">
                        Username:
                        <input
                            type="text"
                            name="username"
                            id="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div className="input">
                    <label htmlFor="password">
                        Password:
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <button type="submit">Submit</button>
            </form>
            <nav>
                <ul>
                    <div>Don't have an account?</div>
                    <li>
                        <a href="/signup">signup</a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default SignIn;
