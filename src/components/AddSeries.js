/**
 * Add series component.
 * 
 * Entry for the Add series route: /add-series.
 * 
 * Renders a heading and a form through the component
 * in AddEditForm.js
 * 
 * @author: Sofie Wallin
 */

import React from 'react';

import AddEditForm from './AddEditForm/AddEditForm';

const AddSeries = ({ createSeries, writeMessage }) => {

    // Return component
    return (
        <section className='add-series'>
            <h1 className='heading heading-big'>Add series</h1>
            <AddEditForm 
                createSeries={createSeries} 
                writeMessage={writeMessage} 
            />
        </section>
    );
}

// Export component
export default AddSeries;
