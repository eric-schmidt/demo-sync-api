# Contentful Sync API Demo

An example app for visualizing how Contentful's [Sync API](https://www.contentful.com/developers/docs/concepts/sync/) operates. This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Using This Demo

**Note: this is best tested using a space with minimal entries, as it will print out a list of all entries for the space in order to illustrate how they are added/removed when syncing. If you use this on a space with tons of entires, it will be harder to see the addition/deletion demonstration.**

1. Copy the `.env.example` file, rename to `.env`, and populate with your Contentful Space ID and Contentful Delivery API key.
2. Run `npm run start`, which should open http://localhost:3000 in a new browser window.
3. Navigate to http://localhost:3000 and click on the `Get All Entries` button, which should populate the `All Entries` box with all current entries on the space. You should also be able to confirm via your browser's dev tools that these entries are now being stored in localStorage (along with a sync token).
4. Navigate back to your Contentful Space and add a couple new entries.
5. Navigate back to http://localhost:3000 and click `Get Updated Entries`, which should append the updated entires to the main list, show which ones are updated under `Entries Added/Updated`, and update the localStorage variable.
6. Update and/or delete some entries within your Contentful Space and then navigate back to http://localhost:3000 and click on `Get Updated Entries` once more. You should see that entries are added/removed as needed, and localStorage should be updated to reflect this as well.
7. Clicking `Clear All Entries` will clear your state and localStorage variables so that you can start the demo from scratch.
