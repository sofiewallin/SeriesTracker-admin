/**
 * Header component.
 * 
 * @author: Sofie Wallin
 */

import React from 'react';
import { NavLink as Link } from 'react-router-dom';

import Logo from '../images/logo.svg';

const Header = ({ appName }) => {

    // Return component
    return (
        <header id='main-header' className='clear'>
            <h2 className='logo'><Link to='/'><img src={Logo} alt={ appName } /></Link></h2>
            <nav id="main-navigation" aria-label='Main navigation'>
                <ul className="menu">
                    <li className='menu-item'>
                        <Link end to='/' className={({ isActive }) => (isActive ? 'active' : 'inactive')}>Series</Link>
                    </li>
                    <li className='add-series-menu-item'>
                        <Link end to='/add-series' className={({ isActive }) => 'button button-menu' + (isActive ? ' active' : ' inactive')}>Add series</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

// Export component
export default Header;
