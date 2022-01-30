/**
 * Episode component.
 * 
 * Handles an episode in a series and adding, updating 
 * and removing this episode in the API. Adding is done 
 * by using a function in AddEditForm.js. If an episode
 * is passed to the component that has an id the episode
 * will be set as saved in the database and can then be 
 * updated and removed.
 * 
 * @author: Sofie Wallin
 */

import React, { useState, useEffect } from 'react';

import RemovingEpisode from './RemovingEpisode';

const Episode = ({ user, logoutUser, apiUrl, seriesId, episode, seasonNumber, addEpisode, validateField, writeErrorMessage, getSeriesList, writeMessage }) => {
    // States
    const [isSaved, setIsSaved] = useState(false);

    const [episodeNumber, setEpisodeNumber] = useState(null);
    const [name, setName] = useState('');
    const [originalAirDate, setOriginalAirDate] = useState(null);

    const [error, setError] = useState(null);

    const [isRemovingEpisode, setIsRemovingEpisode] = useState(false);

    // Sets episode details when component loads
    useEffect(() => {
        (async () => {
            if (episode.episodeId) setIsSaved(true);
            setEpisodeNumber(episode.episodeNumber);
            setName(episode.name);
            setOriginalAirDate(episode.originalAirDate);
        })();
    }, [episode]) // Run again if episode changes

    // Update one episode in the API
    const updateEpisode = async episodeBody => {
        try {
            const response = await fetch(`${apiUrl}/series/${seriesId}/update-episode/${episode.episodeId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(episodeBody)
            });

            // Logout user if token has expired
            if ([401, 403].includes(response.status)) {
                logoutUser();
            } else {
                const updatedEpisode = await response.json();

                if (!response.ok) {
                    throw new Error(response.statusText);
                }

                setError(null);

                return updatedEpisode;
            }
        } catch (err) {
            setError('Something went wrong when updating episode. Reload page and try again.');
        } finally {
            // Get and set the list of series to state in App.js
            await getSeriesList();
        }
    }

    // Remove one episode in the API
    const removeEpisode = async () => {
        try {
            const response = await fetch(`${apiUrl}/series/${seriesId}/remove-episode/${episode.episodeId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });

            // Logout user if token has expired
            if ([401, 403].includes(response.status)) {
                logoutUser();
            } else {
                const removedEpisode = await response.json();

                if (!response.ok) {
                    throw new Error(response.statusText);
                }

                setError(null);

                return removedEpisode;
            }
        } catch (err) {
            setError('Something went wrong when removing episode. Reload page and try again.');
        } finally {
            // Get and set the list of series to state in App.js
            await getSeriesList();
        }
    }

    // Handle adding episode click
    const handleAdd = async e => {
        e.preventDefault();

        // Validate episode name field and write error if not valid
        const nameField = document.querySelector(`#s${seasonNumber}e${episodeNumber}-name-field`);
        const nameFieldError = nameField.nextElementSibling;
        if (!nameField.validity.valid) {
            await writeErrorMessage(nameField, nameFieldError);
            return;
        }

        // Create episode
        const episodeBody = {
            seasonNumber: seasonNumber,
            episodeNumber: episodeNumber,
            name: name,
            originalAirDate: originalAirDate
        }

        // Add episode
        await addEpisode(episodeBody);
        await writeMessage('success', 'The episode was successfully saved!');
    }

    // Handle updating episode click
    const handleUpdate = async e => {
        e.preventDefault();

        // Validate episode name field and write error if not valid
        const nameField = document.querySelector(`#s${seasonNumber}e${episodeNumber}-name-field`);
        const nameFieldError = nameField.nextElementSibling;
        if (!nameField.validity.valid) {
            await writeErrorMessage(nameField, nameFieldError);
            return;
        }

        // Create episode
        const episodeBody = {
            seasonNumber: seasonNumber,
            episodeNumber: episodeNumber,
            name: name,
            originalAirDate: originalAirDate
        }

        // Updating episode
        await updateEpisode(episodeBody);
        await writeMessage('success', 'The episode was successfully updated!');
    }

    // Handle remove episode click
    const handleRemove = async e => {
        e.preventDefault();

        setIsRemovingEpisode(true);
    }

    // Show error if there is one
    if (error) {
        writeMessage('error', error);
    }

    // Return component
    return (
        <fieldset data-season={seasonNumber} data-episode={episodeNumber}>
            <legend className='heading heading-list-item'>Episode {episodeNumber}</legend>
            <p className='text-field'>
                <label htmlFor={`s${seasonNumber}e${episodeNumber}-name-field`}>Name <abbr title="required" className='required'>*</abbr></label>
                <input type='text' name='episode-name' id={`s${seasonNumber}e${episodeNumber}-name-field`} maxLength='250' className='episode-name' onInput={validateField} value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter an episode name' required />
                <span className='error' aria-live='polite'></span>
            </p>
            <p className='text-field'>
                <label htmlFor={`s${seasonNumber}e${episodeNumber}-original-air-date-field`}>Original air date</label>
                <input type='date' name='episode-original-air-date' id={`s${seasonNumber}e${episodeNumber}-original-air-date-field`} className='episode-original-air-date' defaultValue={originalAirDate} onChange={(e) => setOriginalAirDate(e.target.value)} />
            </p>
            {!isSaved && (<button className='button button-small' onClick={handleAdd}>Save episode</button>)}
            {isSaved && (
                <>
                    <button className='button button-icon button-update' onClick={handleUpdate}><span className='hidden-visually'>Update episode</span></button>
                    <button className='button button-icon button-delete' onClick={handleRemove}><span className='hidden-visually'>Remove episode</span></button>
                    {isRemovingEpisode && (
                        <RemovingEpisode
                            episodeName={name}
                            removeEpisode={removeEpisode}
                            setIsRemovingEpisode={setIsRemovingEpisode}
                            writeMessage={writeMessage}
                        />
                    )}
                </>
            )}
        </fieldset>
    );
}

// Export component
export default Episode;
