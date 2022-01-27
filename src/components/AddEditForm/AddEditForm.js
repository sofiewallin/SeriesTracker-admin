import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import Season from './partials/Season';

const AddEditForm = ({ user, logoutUser, apiUrl, series, createSeries, getSeriesList, writeSuccessMessage }) => {
    const [name, setName] = useState('');
    const [plot, setPlot] = useState('');
    const [airingStatus, setAiringStatus] = useState('Airing');
    const [seasonList, setSeasonList] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [error, setError] = useState(null);

    let navigate = useNavigate();

    // Set series for edit form
    useEffect(() => {
        (async () => {
            if (series) {
                setIsEditMode(true);
                setName(series.name);
                setPlot(series.plot);
                setAiringStatus(series.airingStatus);
                setSeasonList(series.seasons);
            }         
        })();
    }, [series])

    const updateSeries = async seriesBody => {
        try {
            const response = await fetch(`${apiUrl}/series/${series._id}`, {
                method: 'PATCH',
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
                const updatedSeries = await response.json();

                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                
                setError(null);

                return updatedSeries;
            }
        } catch (err) {
            setError('Something went wrong when updating series. Reload page and try again.');
        } finally {
            // Get and set the list of series to state in App.js
            await getSeriesList();
        }
    }

    const addEpisode = async episodeBody => {
        try {
            const response = await fetch(`${apiUrl}/series/${series._id}/add-episode`, {
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
                const addedEpisode = await response.json();

                if (!response.ok) {
                    throw new Error(response.statusText);
                }

                setError(null);

                return addedEpisode;
            }
        } catch (err) {
            setError('Something went wrong when adding episode. Reload page and try again.');
        } finally {
            // Get and set the list of series to state in App.js
            await getSeriesList();
        }
    }

    const validateField = async e => {
        const field = e.target;
        const fieldError = field.nextElementSibling;
        if (field.validity.valid) {
            field.classList.add('valid');
            if (field.classList.contains('invalid')) field.classList.remove('invalid');
            fieldError.innerText = '';
            fieldError.classList.add('error');
            return true;
        } else {
            await writeErrorMessage(field, fieldError);
            return false;
        }
    }

    const writeErrorMessage = async (field, fieldError) => {
        let errorMessage;
        if (field.classList.contains('series-name')) {
            if (field.validity.valueMissing) {
                errorMessage = 'A series name is required.';
            } else if (field.validity.tooLong) {
                errorMessage = 'The series name can have a maximum of 250 characters.';
            }
            await setFieldToInvalidAndErrorMessageToActive(field, fieldError, errorMessage);
        } else if (field.classList.contains('series-plot')) {
            if (field.validity.tooLong) {
                errorMessage = 'The series plot can have a maximum of 500 characters.';
            }
            await setFieldToInvalidAndErrorMessageToActive(field, fieldError, errorMessage);
        } else if (field.classList.contains('episode-name')) {
            if (field.validity.valueMissing) {
                errorMessage = 'An episode name is required.';
            } else if (field.validity.tooLong) {
                errorMessage = 'The episode name can be a maximum of 250 characters.';
            }
            await setFieldToInvalidAndErrorMessageToActive(field, fieldError, errorMessage);
        }
    }

    const setFieldToInvalidAndErrorMessageToActive = async (field, fieldError, errorMessage) => {
        if (field.classList.contains('valid')) {
            field.classList.replace('valid','invalid');
        } else {
            field.classList.add('invalid');
        }
        fieldError.innerHTML = errorMessage;
        fieldError.classList.add('is-active');
    }

    const handleSubmit = async e => {
        e.preventDefault();

        // Validate fields
        const nameField = document.querySelector('.series-name');
        const nameFieldError = nameField.nextElementSibling;
        if (!nameField.validity.valid) {
            await writeErrorMessage(nameField, nameFieldError);
            return;
        }
        const plotField = document.querySelector('.series-plot');
        const plotFieldError = plotField.nextElementSibling;
        if (!plotField.validity.valid) {
            await writeErrorMessage(plotField, plotFieldError);
            return;
        }

        const seriesBody = {
            name: name,
            plot: plot,
            airingStatus: airingStatus
        }

        if (isEditMode) {
            await updateSeries(seriesBody);
            await writeSuccessMessage('The series was successfully edited!');
        } else {
            const createdSeries = await createSeries(seriesBody);
            await writeSuccessMessage('The series was successfully added!');

            navigate(`/edit-series/${createdSeries._id}`, { replace: true });
        }
    }

    const addSeason = async e => {
        e.preventDefault();

        const seasonNumber = seasonList.length + 1;
        const newSeason = {
            number: seasonNumber,
            episodes: [
                {
                    seasonNumber: seasonNumber,
                    episodeNumber: 1,
                    name: ''
                }
            ]
        }

        setSeasonList(prev => [...prev, newSeason]);
    }

    // Show error if there is one
    if (error) {
        const message = document.querySelector('.message');
        message.classList.add('error', 'is-active');
        message.innerHTML = error;
    }

    return (
        <form action='/' onSubmit={handleSubmit} noValidate>
            <fieldset>
                <legend>General information</legend>
                <p className='text-field'>
                    <label htmlFor='name-input'>Name <abbr title='required' className='required'>*</abbr></label>
                    <input type='text' name='name' id='name-input'  maxLength='250' className='series-name' onInput={validateField} value={name} onChange={(e) => setName(e.target.value)} required />
                    <span className='error' aria-live='polite'></span>
                </p>
                <p className='text-field'>
                    <label htmlFor='plot-input'>Plot</label>
                    <textarea name='plot' id='plot-input' maxLength='500' className='series-plot' onInput={validateField} value={plot} onChange={(e) => setPlot(e.target.value)}></textarea>
                    <span className='error' aria-live='polite'></span>
                </p>
                <p className='select-field'>
                    <label htmlFor='airing-status-field'>Airing status</label>
                    <select name='airing-status' id='airing-status-field' value={airingStatus} onChange={(e) => setAiringStatus(e.target.value)}>
                        <option value='Airing'>Airing</option>
                        <option value='Upcoming'>Upcoming</option>
                        <option value='Ended'>Ended</option>
                    </select>
                </p>
                <p className='submit-field'>
                    {!isEditMode && (
                        <button type='submit' className='button button-big'>Add series</button>
                    )}
                    {isEditMode && (
                        <button type='submit' className='button button-big'>Save series</button>
                    )}
                </p>
            </fieldset>
            {isEditMode && (
                <fieldset className='seasons'>
                    <legend>Seasons</legend>
                    {seasonList.length > 0 && (
                        <ol className='season-list'>
                            {seasonList.map(season => (
                                <li key={season.number} className='season'>
                                    <Season 
                                        user={user}
                                        logoutUser={logoutUser} 
                                        apiUrl={apiUrl}
                                        seriesId={series._id}
                                        season={season}
                                        addEpisode={addEpisode}
                                        validateField={validateField} 
                                        writeErrorMessage={writeErrorMessage}
                                        getSeriesList={getSeriesList}
                                        writeSuccessMessage={writeSuccessMessage}
                                    />
                                </li>
                            ))}
                        </ol>
                    )}
                    <button className='button button-add-season' onClick={addSeason}>Add season</button>
                </fieldset>
            )}
        </form>
    );
}

export default AddEditForm;