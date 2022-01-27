import React, { useState, useEffect } from 'react';

import Episode from './Episode';

const Season = ({ user, logoutUser, apiUrl, seriesId, season, addEpisode, validateField, writeErrorMessage, getSeriesList, writeSuccessMessage }) => {
    const [seasonNumber, setSeasonNumber] = useState(null);
    const [seasonEpisodeList, setSeasonEpisodeList] = useState([]);

    useEffect(() => {
        (async () => {
            setSeasonNumber(season.number);
            setSeasonEpisodeList(season.episodes);    
        })();
    }, [season])

    const addEpisodeToSeason = e => {
        e.preventDefault();

        const episodeNumber = seasonEpisodeList.length + 1;
        
        const newSeasonEpisode = {
            seasonNumber: seasonNumber,
            episodeNumber: episodeNumber,
            name: ''
        }
        setSeasonEpisodeList(prev => [...prev, newSeasonEpisode]);
    }

    return (
        <fieldset>
            <legend>Season {seasonNumber}</legend>
            <ol className='episode-list'>
                {seasonEpisodeList.map(episode => (
                    <li key={`s${seasonNumber}e${episode.episodeNumber}`} className='episode'>
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
                            writeSuccessMessage={writeSuccessMessage}
                        />
                    </li>
                ))}
            </ol>
            <button className='button button-add-episode' onClick={addEpisodeToSeason}>Add episode</button>
        </fieldset>
    );
}

export default Season;