/**
 * Form component.
 * 
 * Form that handles adding and editing series, if there is
 * a series being passed to the component it is set in edit 
 * mode otherwise not. Seasons and episodes can only be
 * accessed in edit mode. In this component a season can be
 * added but then the season is passed on to a separate 
 * Season component. This component also has all the 
 * validating functions for the form and handles updating a 
 * series and adding an episode to a series in the API. 
 * 
 * @author: Sofie Wallin
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import Season from './partials/Season';

const AddEditForm = ({ user, logoutUser, apiUrl, series, createSeries, getSeriesList, writeMessage }) => {
    // States
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
    }, [series]) // Run again if series changes

    // Update one series in API
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

    // Add one episode to one series in API
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

    // Validate input field on input
    const validateField = async e => {
        const field = e.target;
        const fieldError = field.nextElementSibling;

        // Check if field is valid or not
        if (field.validity.valid) {
            // Reset field and field error element to original state
            if (field.classList.contains('invalid')) {
                field.classList.replace('invalid','valid');
            } else {
                field.classList.add('valid');
            }
            fieldError.innerHTML = '';
            fieldError.classList.remove('is-active');

            return true;
        } else {
            // Write error message
            await writeErrorMessage(field, fieldError);

            return false;
        }
    }

    // Write error message for input field validation
    const writeErrorMessage = async (field, fieldError) => {
        let errorMessage;

        // Set error message based on field type
        if (field.classList.contains('series-name')) {
            if (field.validity.valueMissing) {
                errorMessage = 'A series name is required.';
            } else if (field.validity.tooLong) {
                errorMessage = 'The series name can have a maximum of 250 characters.';
            }
            // Activate error message           
            await setFieldToInvalidAndErrorMessageToActive(field, fieldError, errorMessage);
        } else if (field.classList.contains('series-plot')) {
            if (field.validity.tooLong) {
                errorMessage = 'The series plot can have a maximum of 500 characters.';
            }
            // Activate error message
            await setFieldToInvalidAndErrorMessageToActive(field, fieldError, errorMessage);
        } else if (field.classList.contains('episode-name')) {
            if (field.validity.valueMissing) {
                errorMessage = 'An episode name is required.';
            } else if (field.validity.tooLong) {
                errorMessage = 'The episode name can be a maximum of 250 characters.';
            }
            // Activate error message
            await setFieldToInvalidAndErrorMessageToActive(field, fieldError, errorMessage);
        }
    }

    // Activate error message
    const setFieldToInvalidAndErrorMessageToActive = async (field, fieldError, errorMessage) => {
        if (field.classList.contains('valid')) {
            field.classList.replace('valid','invalid');
        } else {
            field.classList.add('invalid');
        }
        fieldError.innerHTML = errorMessage;
        fieldError.classList.add('is-active');
    }

    // Handle form submit
    const handleSubmit = async e => {
        e.preventDefault();

        // Validate series name field and write error if not valid
        const nameField = document.querySelector('.series-name');
        const nameFieldError = nameField.nextElementSibling;
        if (!nameField.validity.valid) {
            await writeErrorMessage(nameField, nameFieldError);
            return;
        }

        // Validate series plot field and write error if not valid
        const plotField = document.querySelector('.series-plot');
        const plotFieldError = plotField.nextElementSibling;
        if (!plotField.validity.valid) {
            await writeErrorMessage(plotField, plotFieldError);
            return;
        }

        // Create a series request body
        const seriesBody = {
            name: name,
            plot: plot,
            airingStatus: airingStatus
        }

        // Update series if edit form and create series if add form
        if (isEditMode) {
            await updateSeries(seriesBody);
            await writeMessage('success', 'The series was successfully edited!');
        } else {
            const createdSeries = await createSeries(seriesBody);
            await writeMessage('success', 'The series was successfully added!');

            // Redirect from Add form to edit form when series is created
            navigate(`/edit-series/${createdSeries._id}`, { replace: true });
        }
    }

    // Add season on button click
    const addSeason = async e => {
        e.preventDefault();

        // Create a season
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

        // Add season to list in state
        setSeasonList(prev => [...prev, newSeason]);
    }

    // Show error if there is one
    if (error) {
        writeMessage('error', error);
    }

    // Return component
    return (
        <form action='/' onSubmit={handleSubmit} noValidate>
            <fieldset>
                <legend className='hidden-visually'>General information</legend>
                <p className='text-field box'>
                    <label htmlFor='name-input'>Name <abbr title='required' className='required'>*</abbr></label>
                    <input type='text' name='name' id='name-input'  maxLength='250' className='series-name' onInput={validateField} value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter a series name' required />
                    <span className='error' aria-live='polite'></span>
                </p>
                <p className='select-field box'>
                    <label htmlFor='airing-status-field'>Airing status</label>
                    <select name='airing-status' id='airing-status-field' value={airingStatus} onChange={(e) => setAiringStatus(e.target.value)}>
                        <option value='Airing'>Airing</option>
                        <option value='Upcoming'>Upcoming</option>
                        <option value='Ended'>Ended</option>
                    </select>
                </p>
                <p className='text-field box'>
                    <label htmlFor='plot-input'>Plot</label>
                    <textarea name='plot' id='plot-input' maxLength='500' className='series-plot' onInput={validateField} value={plot} onChange={(e) => setPlot(e.target.value)} placeholder='Enter a short description of the series' ></textarea>
                    <span className='error' aria-live='polite'></span>
                </p>
                <p className='submit-field'>
                    {!isEditMode && (
                        <button type='submit' className='button button-big'>Add</button>
                    )}
                    {isEditMode && (
                        <button type='submit' className='button'>Update</button>
                    )}
                </p>
            </fieldset>
            {isEditMode && (
                <fieldset className='seasons'>
                    <legend className='hidden-visually'>Seasons</legend>
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
                                        writeMessage={writeMessage}
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

// Export component
export default AddEditForm;
