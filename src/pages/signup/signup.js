import React, { useState } from 'react';

const Signup = () => {
    const demoData = { email: 'test@gmail.com', username: 'testuser', password: 'testpassword', confirmPassword: 'testpassword' };

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission, e.g., send data to the server
        // for now check with predefined data
        if (formData.email === '' || formData.username === '' ||
            formData.password === '' || formData.confirmPassword === '') {
            alert('Please fill all the fields');
        }
        else if (formData.email === demoData.email) {
            alert('account already exists with this email');
        }
        else if (formData.username === demoData.username) {
            alert('Username already exists');
        }
        else if (formData.username.length < 6) {
            alert('Username length should be atleast 6 characters');
        }
        else if (formData.password.length < 6) {
            alert('Password length should be atleast 6 characters');
        }
        else if (formData.password !== formData.confirmPassword) {
            alert('Password and Confirm Password do not match');
        }
        else {
            alert('Account created successfully');
            // todo redirect to login page
            // check data with database
        }

        console.log('Form data submitted:', formData);
        //todo check with server
    }

    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit} className="container">
                <div className="input">
                    <label htmlFor="email">
                        Email:
                        <input
                            type="email"
                            name="email"
                            id="email"
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div className="input">
                    <label htmlFor="username">
                        Username:
                        <input
                            type="text"
                            name="username"
                            id="username"
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
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div className="input">
                    <label htmlFor="confirmPassword">
                        Confirm Password:
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default Signup;