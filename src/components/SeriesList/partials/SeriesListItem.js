import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import DeletingSeries from './DeletingSeries';

const SeriesListItem = ({ series, deleteSeries, writeSuccessMessage }) => {
    const [isDeletingSeries, setIsDeletingSeries] = useState(false);

    // Handle click on delete button
    const handleClick = e => {
        e.preventDefault();
        setIsDeletingSeries(true);
    }

    // Return component
    return (
        <article id={`series-${series._id}`}>
            <h2 className='heading heading-list-item'>{series.name}</h2>
            <Link to={`edit-series/${series._id}`} className='button button-small'>Edit</Link>
            <button className='button button-small' onClick={handleClick}>Delete</button>
            {isDeletingSeries && (
                <DeletingSeries
                    seriesName={series.name}
                    seriesId={series._id}
                    deleteSeries={deleteSeries}
                    fromEdit={false}
                    setIsDeletingSeries={setIsDeletingSeries}
                    writeSuccessMessage={writeSuccessMessage}
                />
            )}
        </article>
    );
}

// Export component
export default SeriesListItem;