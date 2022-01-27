import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import AddEditForm from './AddEditForm/AddEditForm';
import DeletingSeries from './App/partials/DeletingSeries';

const EditSeries = ({ 
    user, 
    logoutUser, 
    apiUrl, 
    seriesList, 
    getSeriesList, 
    deleteSeries, 
    writeSuccessMessage 
}) => {
    const { seriesId } = useParams();
    const [series, setSeries] = useState(null);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const [isDeletingSeries, setIsDeletingSeries] = useState(false);

    // Get series based on id parameter
    useEffect(() => {
        (async () => {
            const matchingSeries = seriesList.filter(seriesInList => seriesInList._id === seriesId);
            if (matchingSeries.length === 0) return;
            
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
                setError('Something went wrong when getting a series. Reload page and try again.');
            } finally {
                setIsLoaded(true);
            }
        })();
    }, [seriesList])

    const handleDelete = async e => {
        e.preventDefault();
        setIsDeletingSeries(true);
    }

    // Show error if there is one
    if (error) {
        const message = document.querySelector('.message');
        message.classList.add('error', 'is-active');
        message.innerHTML = error;
    }

    // Show loading message until series is fetched from the API
    if (!isLoaded)return <div className="loading">Loading...</div>;

    return (
        <section className='edit-series'>
            <h1>Edit {series.name}</h1>
            <AddEditForm 
                user={user}
                logoutUser={logoutUser} 
                apiUrl={apiUrl}
                series={series} 
                getSeriesList={getSeriesList}
                writeSuccessMessage={writeSuccessMessage} 
            />
            <button className='button button-big' onClick={handleDelete}>Delete series</button>
            {isDeletingSeries && (
                <DeletingSeries
                    seriesName={series.name}
                    seriesId={series._id}
                    deleteSeries={deleteSeries}
                    fromEdit={true}
                    setIsDeletingSeries={setIsDeletingSeries}
                    writeSuccessMessage={writeSuccessMessage}
                />
            )}
        </section>
    );
}

export default EditSeries;