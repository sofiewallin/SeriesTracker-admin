/**
 * Login component.
 * 
 * Handles login form and loggin in user to the API. Creates 
 * a logged in user from token and saves to local storage.
 * 
 * @author: Sofie Wallin
 */

import React, { useState } from 'react';
import jwt_decode from 'jwt-decode';

import Logo from '../images/logo.svg';

const Login = ({ appName, apiUrl, setLoggedIn }) => {
    // States
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState(null);

    // Login user
    const loginUser = async loginDetails => {

        // Login to the api and catch possible error
        try {
            const response = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginDetails)
            });
        
            const result = await response.json();
        
            if (!response.ok) {
                throw new Error('The username or password you have entered is invalid.');
            }
        
            return result;
        } catch (error) {
            setError(error.message);
        }
    }

    // Create user object from JWT
    const createUser = async jwt => {
        const token = jwt.token;
        const decodedJwt = jwt_decode(token);
        const userId = decodedJwt.userId;
        
        const user = {
            token: token,
            userId: userId
        }

        return user;
    }

    // Store created user in local storage
    const storeUser = async user => {
        localStorage.setItem('user', JSON.stringify(user));
    }

    // Handle the submit event of the form
    const handleSubmit = async e => {
        e.preventDefault();

        // Define login details
        const loginDetails = {
            username: username,
            password: password
        }
        
        const jwt = await loginUser(loginDetails);
        const user = await createUser(jwt);
        await storeUser(user);   
        setLoggedIn(true);
    }

    // Check if there is an error and show error if there is one
    if (error) {
        const message = document.querySelector('.message');
        message.classList.add('error', 'is-active');
        message.innerHTML = error;
    }

    // Return component
    return (
        <>
            <header id='main-header' className='login-header centered'>
                <h2 className='logo'><img src={Logo} alt={ appName } /></h2>
            </header>
            <main id='main-content' className='login-content'>
                <form action='/' className='login-form' onSubmit={handleSubmit}>
                    <h1 className='heading heading-big centered'>Sign in</h1>
                    <div className='message' aria-live='polite'></div>
                    <p className='text-field box'>
                        <label htmlFor='username-input'>Username</label>
                        <input type='text' name='username' id='username-input' onChange={e => setUsername(e.target.value)} placeholder='Enter your username' />
                    </p>
                    <p className='text-field box'>
                        <label htmlFor='password-input'>Password</label>
                        <input type='password' name='password' id='password-input' onChange={e => setPassword(e.target.value)} placeholder='Enter your password' />
                    </p>
                    <p className='submit-field centered'>
                        <button type='submit' className='button button-big'>Sign in</button>
                    </p>
                </form>
            </main>
            <footer id='main-footer' className='login-footer'>
                <p className='centered'>&copy; { new Date().getFullYear() } { appName }</p>
            </footer>
        </>
    );
}

// Export component
export default Login;
