import React from 'react';
import { Link } from 'react-router-dom';

import SeriesListItem from './partials/SeriesListItem';

const SeriesList = ({ seriesList, deleteSeries, writeSuccessMessage }) => {
    // Return component
    return (
        <>
            <h1>Series</h1>
            <ul className='series-list'>
                {seriesList.map(series => (
                    <li key={series._id}>
                        <SeriesListItem 
                            series={series}
                            deleteSeries={deleteSeries}
                            writeSuccessMessage={writeSuccessMessage}
                        />
                    </li>
                ))}
            </ul>
            {seriesList.length === 0 &&
                <p>There are no series yet. <Link to='/add-series' className='highlighted-link'>Add a series</Link>!</p>
            }
        </>
    );
}

// Export component
export default SeriesList;