# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

# Adding services to PSIPRED web server

1. First modify the input form in `index.js` under `DisplayArea` (optionally) add any state variables (sidebar items) to the constructor (line 7). update `handleReset()` function (line 34ish) to set any form variables back to defaults
2. In `mainform.js` add the algorithm to HTML table in either the `SeqForm` or `StructForm` class. Copy an existing check box. Both the input `name` and `value` must be of the form `'[ALGORITHM]_job'`. Ensure `onChange` and `checked` are correct.
3. If you need extended sidebar options edit `sidebar.js`. Update the `Sidebar` class to include an additional if that detects if `'[ALGORITHM]_job'` has been selected. And then reference a new class `AlgorithmOptions`. Add your new class and the appropriate inputs. You MUST ensure that the names match the new state variable names you added in step 1 if you added new state variables
