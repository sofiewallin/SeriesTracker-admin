/**
 * Deleting series component.
 * 
 * Handles prompt when deleting series and uses function
 * to delete series from the list in App.js.
 * 
 * @author: Sofie Wallin
 */

import React from 'react';
import { useNavigate } from "react-router-dom";

const DeletingSeries = ({ seriesName, seriesId, deleteSeries, setIsDeletingSeries, writeMessage }) => {
    // Redirection
    let navigate = useNavigate();
    
    // Handle click on Y/N-buttons
    const handleClick = async e => {
        e.preventDefault();
        const answer = e.target.value;

        /* Delete series with function from App component 
        if answer is yes, otherwise close prompt */
        if (answer === 'Yes') {
            // Close prompt
            setIsDeletingSeries(false);
            
            // Delete series
            await deleteSeries(seriesId);
            await writeMessage('success', 'The series was successfully deleted!');

            // Redirect to list of series
            navigate('/', { replace: true });
        } else {
            // Close prompt
            setIsDeletingSeries(false);
        }
    }

    // Handle click on close button
    const closePrompt = e => {
        e.preventDefault();

        // Close prompt
        setIsDeletingSeries(false);
    }

    // Return component
    return (
        <div className='prompt-wrapper'>
            <div className="prompt centered" aria-live="polite">
                <button className='button-close' onClick={closePrompt}><span className='hidden-visually'>Close</span></button>
                <h3 className='heading'>Are you sure you want to delete <em>{seriesName}</em>?</h3>
                <div className='clear'>
                    <button className='button button-small button-50' value='Yes' onClick={handleClick}>Yes</button>
                    <button className='button button-small button-50' value='No' onClick={handleClick}>No</button>
                </div>
            </div>
        </div>
    );
}

// Export component
export default DeletingSeries;
 