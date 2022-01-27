import React, { useState, useEffect } from 'react';

import RemovingEpisode from './RemovingEpisode';

const Episode = ({ user, logoutUser, apiUrl, seriesId, episode, seasonNumber, addEpisode, validateField, writeErrorMessage, getSeriesList, writeSuccessMessage }) => {
    const [isSaved, setIsSaved] = useState(false);
    const [episodeNumber, setEpisodeNumber] = useState(null);
    const [name, setName] = useState('');
    const [originalAirDate, setOriginalAirDate] = useState(null);
    const [error, setError] = useState(null);

    const [isRemovingEpisode, setIsRemovingEpisode] = useState(false);

    useEffect(() => {
        (async () => {
            if (episode.episodeId) setIsSaved(true);
            setEpisodeNumber(episode.episodeNumber);
            setName(episode.name);
            setOriginalAirDate(episode.originalAirDate);
        })();
    }, [episode])

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

    const handleAdd = async e => {
        e.preventDefault();

        const nameField = document.querySelector(`#s${seasonNumber}e${episodeNumber}-name-field`);
        const nameFieldError = nameField.nextElementSibling;
        if (!nameField.validity.valid) {
            await writeErrorMessage(nameField, nameFieldError);
            return;
        }

        const episodeBody = {
            seasonNumber: seasonNumber,
            episodeNumber: episodeNumber,
            name: name,
            originalAirDate: originalAirDate
        }

        await addEpisode(episodeBody);
        await writeSuccessMessage('The episode was successfully saved!');
    }

    const handleUpdate = async e => {
        e.preventDefault();

        const episodeBody = {
            seasonNumber: seasonNumber,
            episodeNumber: episodeNumber,
            name: name,
            originalAirDate: originalAirDate
        }

        const nameField = document.querySelector(`#s${seasonNumber}e${episodeNumber}-name-field`);
        const nameFieldError = nameField.nextElementSibling;
        if (!nameField.validity.valid) {
            await writeErrorMessage(nameField, nameFieldError);
            return;
        }

        await updateEpisode(episodeBody);
        await writeSuccessMessage('The episode was successfully updated!');
    }

    const handleRemove = async e => {
        e.preventDefault();

        setIsRemovingEpisode(true);
    }

    // Show error if there is one
    if (error) {
        const message = document.querySelector('.message');
        message.classList.add('error', 'is-active');
        message.innerHTML = error;
    }

    return (
        <fieldset data-season={seasonNumber} data-episode={episodeNumber}>
            <legend>Episode {episodeNumber}</legend>
            <p className='text-field'>
                <label htmlFor={`s${seasonNumber}e${episodeNumber}-name-field`}>Name <abbr title="required" className='required'>*</abbr></label>
                <input type='text' name='episode-name' id={`s${seasonNumber}e${episodeNumber}-name-field`} maxLength='250' className='episode-name' onInput={validateField} value={name} onChange={(e) => setName(e.target.value)} required />
                <span className='error' aria-live='polite'></span>
            </p>
            <p className='text-field'>
                <label htmlFor={`s${seasonNumber}e${episodeNumber}-original-air-date-field`}>Original air date</label>
                <input type='date' name='episode-original-air-date' id={`s${seasonNumber}e${episodeNumber}-original-air-date-field`} className='episode-original-air-date' defaultValue={originalAirDate} onChange={(e) => setOriginalAirDate(e.target.value)} />
            </p>
            {!isSaved && (<button className='button button-update' onClick={handleAdd}>Save episode</button>)}
            {isSaved && (
                <>
                    <button className='button button-update' onClick={handleUpdate}>Update episode</button>
                    <button className='button button-remove' onClick={handleRemove}>Remove episode</button>
                    {isRemovingEpisode && (
                        <RemovingEpisode
                            episodeName={name}
                            removeEpisode={removeEpisode}
                            setIsRemovingEpisode={setIsRemovingEpisode}
                            writeSuccessMessage={writeSuccessMessage}
                        />
                    )}
                </>
            )}
        </fieldset>
    );
}

export default Episode;