/**
 * Removing episode component.
 * 
 * Handles prompt when removing episode and uses function
 * to remove episode from series in Episode.js.
 * 
 * @author: Sofie Wallin
 */

 import React from 'react';
 
 const RemovingEpisode = ({ episodeName, removeEpisode, setIsRemovingEpisode, writeMessage }) => {
     // Handle click on Y/N-buttons
     const handleClick = async e => {
         e.preventDefault();
         const answer = e.target.value;
 
         /* Remove episode with function from Episode.js 
         if answer is yes, otherwise close prompt */
         if (answer === 'Yes') {
             // Close prompt
             setIsRemovingEpisode(false);
             
             // Remove episode
             await removeEpisode();
             await writeMessage('success', 'The episode was successfully removed!');
         } else {
             // Close prompt
             setIsRemovingEpisode(false);
         }
     }
 
     // Handle click on close button
     const closePrompt = e => {
         e.preventDefault();
 
         // Close prompt
         setIsRemovingEpisode(false);
     }
 
     // Return component
     return (
         <div className='prompt-wrapper'>
             <div className="prompt centered" aria-live="polite">
                 <button className='button-close' onClick={closePrompt}><span className='hidden-visually'>Close</span></button>
                 <h3 className='heading'>Are you sure you want to delete <em>{episodeName}</em>?</h3>
                 <div className='clear'>
                     <button className='button button-small button-50' value='Yes' onClick={handleClick}>Yes</button>
                     <button className='button button-small button-50' value='No' onClick={handleClick}>No</button>
                 </div>
             </div>
         </div>
     );
 }
 
 // Export component
 export default RemovingEpisode;
  