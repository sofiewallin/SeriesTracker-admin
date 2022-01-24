import React from 'react';

import AddEditForm from './AddEditForm/AddEditForm';

const AddSeries = ({ createSeries, writeSuccessMessage }) => {

    return (
        <section className='add-series'>
            <h1>Add series</h1>
            <AddEditForm series={null} createSeries={createSeries} writeSuccessMessage={writeSuccessMessage} />
        </section>
    );
}

export default AddSeries;