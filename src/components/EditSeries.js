/**
 * Edit series component.
 * 
 * Entry for the Edit series route: /edit-series/:seriesId.
 * 
 * Takes a series id as a parameter and gets the series 
 * from the database. Passes series on to form component
 * in AddEditForm.js. Component also handles delete of series
 * from edit view.
 * 
 * @author: Sofie Wallin
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import AddEditForm from './AddEditForm/AddEditForm';
import DeletingSeries from './App/partials/DeletingSeries';

const EditSeries = ({ user, logoutUser, apiUrl, seriesList, getSeriesList, deleteSeries, writeMessage }) => {
    // States
    const { seriesId } = useParams();

    const [series, setSeries] = useState(null);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const [isDeletingSeries, setIsDeletingSeries] = useState(false);

    // Get series based on id parameter when component loads
    useEffect(() => {
        (async () => {
            // Check if the id parameter matches a series in the list
            const matchingSeries = seriesList.filter(seriesInList => seriesInList._id === seriesId);
            if (matchingSeries.length === 0) return;
            
            // Get series from database with id
            try {
                const response = await fetch(`${apiUrl}/series/${seriesId}`, {
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
                    const fetchedSeries = await response.json();
    
                    if (!response.ok) {
                        throw new Error(response.statusText);
                    }
                    
                    // Set series to state
                    setSeries(fetchedSeries);

                    setError(null);
                }
            } catch (err) {
                setError('Something went wrong when getting a series from database. Reload page and try again.');
            } finally {
                setIsLoaded(true);
            }
        })();
    }, [seriesList]) // Run again if list of series changes


    const handleDelete = async e => {
        e.preventDefault();
        setIsDeletingSeries(true);
    }

    // Show error if there is one
    if (error) {
        writeMessage('error', error);
    }

    // Show loading message until series is fetched from the API
    if (!isLoaded)return <div className="loading">Loading...</div>;

    // Return component
    return (
        <section className='edit-series'>
            <h1 className='heading heading-big'>{series.name}</h1>
            <AddEditForm 
                user={user}
                logoutUser={logoutUser} 
                apiUrl={apiUrl}
                series={series} 
                getSeriesList={getSeriesList}
                writeMessage={writeMessage} 
            />
            <button className='highlighted-link' onClick={handleDelete}>Delete series</button>
            {isDeletingSeries && (
                <DeletingSeries
                    seriesName={series.name}
                    seriesId={series._id}
                    deleteSeries={deleteSeries}
                    setIsDeletingSeries={setIsDeletingSeries}
                    writeMessage={writeMessage}
                />
            )}
        </section>
    );
}

// Export component
export default EditSeries;