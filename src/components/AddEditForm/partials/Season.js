/**
 * Season component.
 * 
 * Handles a season in a series and adding episodes 
 * that season. It lists the seasons and passes on 
 * every episode to the Episode component.
 * 
 * @author: Sofie Wallin
 */

import React, { useState, useEffect } from 'react';

import Episode from './Episode';

const Season = ({ user, logoutUser, apiUrl, seriesId, season, addEpisode, validateField, writeErrorMessage, getSeriesList, writeMessage }) => {
    // States
    const [seasonNumber, setSeasonNumber] = useState(null);
    const [seasonEpisodeList, setSeasonEpisodeList] = useState([]);

    // Set season number and episodes when the component loads
    useEffect(() => {
        (async () => {
            setSeasonNumber(season.number);
            setSeasonEpisodeList(season.episodes);    
        })();
    }, [season]) // Run again if season changes

    // Add episode that has yet to be added to series
    const addEpisodeToSeason = e => {
        e.preventDefault();

        // Create episode
        const episodeNumber = seasonEpisodeList.length + 1;
        const newSeasonEpisode = {
            seasonNumber: seasonNumber,
            episodeNumber: episodeNumber,
            name: ''
        }

        // Add episode to list in state
        setSeasonEpisodeList(prev => [...prev, newSeasonEpisode]);
    }

    // Return component
    return (
        <fieldset>
            <legend className='heading heading-medium'>Season {seasonNumber}</legend>
            <ol className='episode-list'>
                {seasonEpisodeList.map(episode => (
                    <li key={`s${seasonNumber}e${episode.episodeNumber}`} className='episode box'>
                        <Episode 
                            user={user}
                            logoutUser={logoutUser}
                            apiUrl={apiUrl}
                            seriesId={seriesId}
                            episode={episode} 
                            seasonNumber={seasonNumber}
                            addEpisode={addEpisode}
                            validateField={validateField}
                            writeErrorMessage={writeErrorMessage}
                            getSeriesList={getSeriesList}
                            writeMessage={writeMessage}
                        />
                    </li>
                ))}
            </ol>
            <button className='button button-add-episode' onClick={addEpisodeToSeason}>Add episode</button>
        </fieldset>
    );
}

// Export component
export default Season;
