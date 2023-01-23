import { useEffect, useState } from 'react';
import { createClient } from 'contentful';
import _ from 'lodash';
import EntryList from './EntryList';
import './App.css';

// Init environment variables.
const { REACT_APP_SPACE_ID, REACT_APP_ENVIRONMENT_ID, REACT_APP_CDA_TOKEN } = process.env;

// Init client.
const client = createClient({
  space: REACT_APP_SPACE_ID,
  environment: REACT_APP_ENVIRONMENT_ID,
  accessToken: REACT_APP_CDA_TOKEN,
});

const App = () => {
  // If localStorage already holds contentfulEntires, use those, otherwise inti empty array.
  const [allEntries, setAllEntries] = useState(
    window.localStorage.getItem('contentfulEntries') ? JSON.parse(window.localStorage.getItem('contentfulEntries')) : []
  );

  // Updated & deleted entries.
  const [updatedEntries, setUpdatedEntries] = useState([]);
  const [deletedEntries, setDeletedEntries] = useState([]);

  useEffect(() => {
    // Update localStorage of entries when allEntries state is updated.
    window.localStorage.setItem('contentfulEntries', JSON.stringify(allEntries));
  }, [allEntries]);

  const createSyncData = () => {
    client
      .sync({
        initial: true,
        resolveLinks: false,
      })
      .then((response) => {
        // Store this object while accounting for circular references.
        const responseObject = JSON.parse(response.stringifySafe());
        const entries = responseObject.entries;

        // Update state for all entries, as well as sync token for tracking future updates.
        setAllEntries(entries);
        window.localStorage.setItem('contentfulSyncToken', response.nextSyncToken);
      });
  };

  const updateSyncData = () => {
    client
      .sync({
        // Update the sync token for tracking future updates.
        nextSyncToken: window.localStorage.getItem('contentfulSyncToken'),
      })
      .then((response) => {
        window.localStorage.setItem('contentfulSyncToken', response.nextSyncToken);

        // Update updated entries along with list of all entries.
        if (response.entries.length) {
          // Init a new variable where we can add/update main entry list.
          let updatedEntries = allEntries;

          // Check if entry is new or updated. If new, append to entry list, otherwise update existing entry.
          response.entries.forEach((entry) => {
            let existingEntryIndex = _.findIndex(allEntries, (item) => item.sys.id === entry.sys.id);

            if (existingEntryIndex !== -1) {
              updatedEntries[existingEntryIndex] = entry;
            } else {
              updatedEntries = [...updatedEntries, entry];
            }
          });

          // Need to use spread operator here, otherwise useEffect will not be triggered above.
          setAllEntries([...updatedEntries]);
          setUpdatedEntries(response.entries);
        } else {
          setUpdatedEntries([]);
        }

        // Update deleted entries along with list of all entries.
        if (response.deletedEntries.length) {
          const filteredEntries = allEntries.filter((entry) => !response.deletedEntries.find((deleted) => entry.sys.id === deleted.sys.id));
          setAllEntries(filteredEntries);
          setDeletedEntries(response.deletedEntries);
        } else {
          setDeletedEntries([]);
        }
      });
  };

  const clearSyncData = () => {
    // Clear state and localStorage.
    setAllEntries([]);
    setUpdatedEntries([]);
    setDeletedEntries([]);
    window.localStorage.removeItem('contentfulEntries');
    window.localStorage.removeItem('contentfulSyncToken');
  };

  return (
    <div className='App'>
      <h1>Sync API Demo</h1>
      <button onClick={createSyncData}>Get All Entries</button>
      <button onClick={updateSyncData}>Get Updated Entries</button>
      <button onClick={clearSyncData}>Clear All Entries</button>
      <EntryList title={'All Entries'} entries={allEntries} />
      <EntryList title={'Entries Added/Updated'} entries={updatedEntries} />
      <EntryList title={'Entries Removed'} entries={deletedEntries} />
    </div>
  );
};

export default App;
