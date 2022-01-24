import React, { useState, useEffect } from 'react';

const AddEditForm = ({ series, createSeries, updateSeries, writeSuccessMessage }) => {
    const [name, setName] = useState('');
    const [plot, setPlot] = useState('');
    const [airingStatus, setAiringStatus] = useState('Airing');
    const [episodes, setEpisodes] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);

    // Set series for edit form
    useEffect(() => {
        (async () => {
            if (series) {
                setIsEditMode(true);
                setName(series.name);
                setPlot(series.plot);
                setAiringStatus(series.airingStatus);
            }         
        })();
    }, [])

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
        /*const episodeNameFields = document.querySelectorAll(`#${form} .episode-name`);
        for (let i = 0; i < episodeNameFields.length; i++) {
            if (!await validateFieldOnSubmit(episodeNameFields[i])) return;
        }*/

        if (isEditMode) {
            const updatedSeries = {
                name: name,
                plot: plot,
                airingStatus: airingStatus
            }

            await updateSeries(updatedSeries);
            await writeSuccessMessage('The series was successfully edited!');
        } else {
            const newSeries = {
                name: name,
                plot: plot,
                airingStatus: airingStatus,
                episodes: episodes
            }

            await createSeries(newSeries);
            await writeSuccessMessage('The series was successfully added!');

            setName('');
            setPlot('');
            setAiringStatus('Airing');
            setEpisodes([]);
        }
    }

    return (
        <form action='/' onSubmit={handleSubmit} noValidate>
            <fieldset className='general-information'>
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
            </fieldset>
            <fieldset className='seasons'>
                <legend>Seasons</legend>
                <button className='button button-add-season'>Add season</button>
            </fieldset>
            <p className='submit-field'>
                {!isEditMode && (
                    <button type='submit' className='button button-big'>Add series</button>
                )}
                {isEditMode && (
                    <button type='submit' className='button button-big'>Edit series</button>
                )}
            </p>
        </form>
    );
}

export default AddEditForm;