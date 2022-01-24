/**
 * App component.
 * 
 * Handles getting the list of series from the API and the
 * functions to create series in and delete series from the 
 * list. Also handles the routing of the application and
 * the logout of the user.
 * 
 * @author: Sofie Wallin
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Login from './Login';

import Header from './Header';
import Footer from './Footer';

import SeriesList from './SeriesList/SeriesList';
import AddSeries from './AddSeries';
import EditSeries from './EditSeries';
 
const App = () => {
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
            setError('Something went wrong when getting list of series. Reload page and try again.');
        }
    }

    // Create series in API
    const createSeries = async newSeries => {
        try {
            const response = await fetch(`${apiUrl}/series`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(newSeries)
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
            setError('Something went wrong when creating series. Reload page and try again.');
        } finally {
            // Get and set the list of series to state
            await getSeriesList();
        }
    }

    // Delete series in API
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
            setError('Something went wrong when deleting series. Reload page and try again.');
        } finally {
            // Get and set the list of series to state
            await getSeriesList();
        }
    }

    // Write success message on create, delete and update
    const writeSuccessMessage = async message => {
        const messageElement = document.querySelector('.message');

        let timer = null;
        messageElement.classList.add('success', 'is-active');
        messageElement.innerHTML = message;

        window.clearTimeout(timer);
        timer = window.setTimeout(function () {
            messageElement.classList.remove('success', 'is-active');
        }, 3000);
    }

    // Get list  of series when the component loads
    useEffect(() => {
        (async () => {
            const storedUser = getUser();
            if (storedUser === null) return;

            setUser(getUser());

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
                setError('Something went wrong when getting list of series. Reload page and try again.');
            } finally {
                setIsLoaded(true);
            }
        })();
    }, [loggedIn]) // Run again when user logs in

    // Show Login component if there is no user in local storage
    if (!user) {
        return <Login appName={appName} apiUrl={apiUrl} setLoggedIn={setLoggedIn} />
    }

    // Show error if there is one
    if (error) {
        const message = document.querySelector('.message');
        message.classList.add('error', 'is-active');
        message.innerHTML = error;
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
                                <SeriesList 
                                    seriesList={seriesList}
                                    deleteSeries={deleteSeries}
                                    writeSuccessMessage={writeSuccessMessage}
                                />
                            } 
                            />
                            <Route path='add-series' element={
                                <AddSeries
                                    createSeries={createSeries}
                                    writeSuccessMessage={writeSuccessMessage}
                                />
                            } 
                            />
                            <Route path='edit-series/:seriesId' element={
                                <EditSeries
                                    user={user}
                                    logoutUser={logoutUser}
                                    apiUrl={apiUrl}
                                    getSeriesList={getSeriesList}
                                    deleteSeries={deleteSeries}
                                    writeSuccessMessage={writeSuccessMessage}
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
