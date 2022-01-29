/**
 * Footer component.
 * 
 * @author: Sofie Wallin
 */

import React from 'react';

const Footer = ({ appName, logoutUser }) => {
    // Handle the click event of the sign out button
    const handleClick = async e => {
        e.preventDefault();

        // Logout user function from App component
        logoutUser();
    }

    // Return component
    return (
        <footer id='main-footer'>
            <p className='centered'>&copy; { new Date().getFullYear() } { appName } &nbsp; | &nbsp; <button onClick={handleClick} className='highlighted-link'>Sign out</button></p>
        </footer>
    );
}

// Export component
export default Footer;
