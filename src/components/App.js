/**
 * App component.
 * 
 * Handles getting the list of series from the API and the
 * functions to create series in and delete series from the 
 * list. Also handles the series list output, the routing 
 * of the application and the logout of the user.
 * 
 * @author: Sofie Wallin
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';

import Login from './Login';

import Header from './Header';
import Footer from './Footer';

import AddSeries from './AddSeries';
import EditSeries from './EditSeries/EditSeries';
 
const App = () => {
    // States
    const [appName] = useState('Series Tracker');
    const [apiUrl] = useState('https://series-tracker-rest-api.herokuapp.com');

    const [user, setUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);

    const [seriesList, setSeriesList] = useState([]);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Get user from local storage when logged in
    const getUser = () => {
        const userString = localStorage.getItem('user');
        const user = JSON.parse(userString);
        return user;
    }

    // Logout user
    const logoutUser = () => {
        localStorage.removeItem('user');
        setUser(null);
        setLoggedIn(false);
    }

    // Set user and get list of series when component loads
    useEffect(() => {
        (async () => {
            // Check if logged in and set user if there is one
            const storedUser = getUser();
            if (storedUser === null) return;
            setUser(storedUser);

            // Get list of series
            try {
                const response = await fetch(`${apiUrl}/series`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${storedUser.token}`
                    }
                });

                // Logout user if token has expired
                if ([401, 403].includes(response.status)) {
                    logoutUser();
                } else {
                    const seriesList = await response.json();

                    if (!response.ok) {
                        throw new Error(response.statusText);
                    }

                    // Set list of series to state
                    setSeriesList(seriesList);

                    setError(null);
                }
            } catch (err) {
                setError('Something went wrong when getting series from database. Reload page and try again.');
            } finally {
                setIsLoaded(true);
            }
        })();
    }, [loggedIn]) // Run again when user logs in

    // Get list of series from the API
    const getSeriesList = async () => {
        try {
            const response = await fetch(`${apiUrl}/series`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });

            // Logout user if token has expired
            if ([401, 403].includes(response.status)) {
                logoutUser();
            } else {
                const seriesList = await response.json();

                if (!response.ok) {
                    throw new Error(response.statusText);
                }

                // Set list of series to state
                setSeriesList(seriesList);

                setError(null);
            }
        } catch (err) {
            setError('Something went wrong when getting series from database. Reload page and try again.');
        }
    }

    // Create one series in API
    const createSeries = async seriesBody => {
        try {
            const response = await fetch(`${apiUrl}/series`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(seriesBody)
            });

            // Logout user if token has expired
            if ([401, 403].includes(response.status)) {
                logoutUser();
            } else {
                const createdSeries = await response.json();

                if (!response.ok) {
                    throw new Error(response.statusText);
                }

                setError(null);
                
                return createdSeries;
            }
        } catch (err) {
            setError('Something went wrong when creating series in database. Reload page and try again.');
        } finally {
            // Get and set the list of series to state
            await getSeriesList();
        }
    }

    // Delete one series in API
    const deleteSeries = async seriesId => {
        try {
            const response = await fetch(`${apiUrl}/series/${seriesId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });

            // Logout user if token has expired
            if ([401, 403].includes(response.status)) {
                logoutUser();
            } else {
                const deletedSeries = await response.json();

                if (!response.ok) {
                    throw new Error(response.statusText);
                }

                setError(null);

                return deletedSeries;
            }
        } catch (err) {
            setError('Something went wrong when deleting series in database. Reload page and try again.');
        } finally {
            // Get and set the list of series to state
            await getSeriesList();
        }
    }

    // Write success message on create, delete and update
    const writeMessage = async (type, message) => {
        const messageElement = document.querySelector('.message');

        messageElement.classList.add(type, 'is-active');
        messageElement.innerHTML = message;
        
        if (type === 'success') {
            let timer = null;

            window.clearTimeout(timer);
            timer = window.setTimeout(function () {
                messageElement.classList.remove('success', 'is-active');
                messageElement.innerHTML = '';
            }, 3000);
        }
    }

    // Show Login component if there is no user in local storage
    if (!user) {
        return <Login appName={appName} apiUrl={apiUrl} setLoggedIn={setLoggedIn} />
    }

    // Show error if there is one
    if (error) {
        writeMessage('error', error);
    }
    
    // Return component with the router
    return (
        <BrowserRouter>
            <Header appName={appName} />
                <main id='main-content'>
                    <div className='message' aria-live='polite'></div>
                    {!isLoaded && <div className='loading'>Loading...</div>}
                    {isLoaded && (
                        <Routes>
                            <Route path='/' element={
                                <>
                                    <h1 className='heading heading-big'>Series</h1>
                                    <ul className='series-list'>
                                        {seriesList.map(series => (
                                            <li key={series._id}>
                                                <article id={`series-${series._id}`} className='series-list-item box clear'>
                                                    <h2 className='heading heading-list-item'>{series.name}</h2>
                                                    <Link to={`edit-series/${series._id}`} className='button button-icon button-edit'><span className='hidden-visually'>Edit</span></Link>
                                                </article>
                                            </li>
                                        ))}
                                    </ul>
                                    {seriesList.length === 0 &&
                                        <p>There are no series yet. <Link to='/add-series' className='highlighted-link'>Add a series</Link>!</p>
                                    }
                                </>
                            } 
                            />
                            <Route path='add-series' element={
                                <AddSeries
                                    createSeries={createSeries}
                                    writeMessage={writeMessage}
                                />
                            } 
                            />
                            <Route path='edit-series/:seriesId' element={
                                <EditSeries
                                    user={user}
                                    logoutUser={logoutUser}
                                    apiUrl={apiUrl}
                                    seriesList={seriesList}
                                    getSeriesList={getSeriesList}
                                    deleteSeries={deleteSeries}
                                    writeMessage={writeMessage}
                                />
                            } 
                            />    
                            <Route path='*' element={(
                                <>
                                    <h1>This page doesn't exist!</h1>
                                    <p>Navigate in the menu to find your way!</p>
                                </>
                            )} />
                        </Routes>
                    )}
                </main> 
            <Footer appName={appName} logoutUser={logoutUser} />
        </BrowserRouter>
    );
}

// Export component
export default App;
