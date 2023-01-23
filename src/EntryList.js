import './EntryList.css';

const EntryList = ({ title, entries }) => {
  return (
    <div className='entryList'>
      <h2>{title}</h2>
      {!entries.length ? (
        <div>No entries found.</div>
      ) : (
        entries.map((entry) => (
          <span className='entry' key={entry.sys.id}>
            {entry.sys.id}
          </span>
        ))
      )}
    </div>
  );
};

export default EntryList;
