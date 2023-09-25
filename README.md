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

# Learn More

React has a heirarchical model of the page and page regions. Sibling regions of the page can share state by storing that state in a parental node.

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Multi-entry point site

The usual react model is for single page single-entry point dynamic pages. Here we have
adapted this to a multi entry point site so that all code runs user side (unlike old psipred_javascript, which dispatched some things to the backend).

There are three entry points; `interface`, `msa` and `model`. Interface is the user interface that users use to select jobs. msa is an entry point for displaying sequence alignments and model is an entry point that requests and shows 3D models (based off an alignment.)

And we have a shared folder that lets us share code between models

## Site model

To level `index.js` is now just a dispatcher for the 3 entry points and holds any global state that all three entry points need.

### interface model

The Parent container for the page/results is called `Interface` and can be found in the index.js.This is really just the menu, header and footer regions. The main action happens in it's immediate child; `PsipredSite`. From here its child is `DisplayArea`. `DisplayArea` is responsible for holding most of the state of the pages and it's children are `MainForm`, `Sidebar`, `ResultsMain`, `ResultsSidebarTimes`, `ResultsSidebarDownloads` and `ResultsSidebarResubmission`.

### msa model

This is just a simple class that reads the alignment and annotation files it needs and uses nightingale to display that alignments

### model

This is just a simple class that reads the alignment files it needs, dispatches a request for a 3D model and displays that when it comes back.

### Classes

See also class_layout.odp

* PsipredSite (index.js): Outer container for whole page with URI initialisation
  * DisplayArea: Main container for the app that has all the shared the application state variables
    * MainForm: Small class that wraps the interactive parts of the form
      * FormInteractivity: Small class that warps the form selector
        * SeqForm: Main form that the user can use to select methods and submit Seq data
        * StructForm:  Main form that the user can use to select methods and submit Structural data
    * Sidebar: Class shows the sidebar with advanced options
    * ResultsMain: Class is called after data submission and handles submitting a job and then displaying the results
      * ResultsSequence: Class handles getting the results files for a sequence job and displaying them
      * ResultsStructure: TO BE IMPLEMENTED
    * ResultsSidebarTimes: Small class handles getting the RunTimes and displaying them while the user waits
    * ResultsSidebarDownloads: This class handles showing the download files panel and bundling files in to a zip for the users
    * ResultsSidebarResubmission: This shows the resubmission panel on the results page and handles submitting a new job

# Adding services to PSIPRED web server

1. First modify the page in `interface/psipred_site.js` in `class DisplayArea`. Add any new state variables for (sidebar items) to the constructor `this.state` (line 35) if you think you'll need them. Mostly it'll be things for any advanced config but you should be fine with what is already there. You will also need to update the `handleReset` and `handleResubmit` functions to reinitialise any of these new state variables. Add your job names to `seq_job_names` or `struct_job_names`. If your new job produces files types not covered by previous jobs then add file globs for your new job by updating `results_map` in `this.state` in the `DisplayArea` class. This is critical for setting which files show up in the downloads area. `analyses` in `this.state` controls which jobs already have a check mark in the form on page load. `job_strings` keeps a track of how your new method is spelt across the site. Must be of the form `'[ALGORITHM]_job'` and must match what the job is called over the backend API.

2. In `mainform.js` add the algorithm to HTML table in either the `SeqForm` or `StructForm` class. Copy an existing check box and edit as needed. Both the input `name` and `value` must be of the form `'[ALGORITHM]_job'` and must match what the job is called over the backend API. Ensure `onChange` and `checked` are correct.

3. If it is a new sequence job, don't forget to add your job to the `ResultsSidebarResubmission` class in `results_sidebar_resubmission.js` and don't forget any tooltips. Copy an existing entry and edit as needed.

4. If you need extended sidebar options edit `sidebar.js`. Update the `Sidebar` class to include any additional panels when it detects if `'[ALGORITHM]_job'` has been selected. And then reference a new class of the form `[Algorithm]Options`. Add your new class and the appropriate inputs. You MUST ensure that the form input names match the new state variable names you added in step 1 if you added new state variables (i.e. `DisplayArea`'s `this.state` etc...)

5. In `checkform.js` in `validateFormData()`. Add/Update any new validations you now may have for the new/advanced/options inputs.

6. In `results.js` update `this.state` with the waiting messages for your job.

7. In `results_sidebar_times.js` in the `ResultsSiderbarTimes` class add an if in `render` for the runtime of your new job type.

8. If you haven't configured the job in the backend A_A instance I find now is a good time to do that

9. If we're handling a seq result:
   a) in `results_sequence.js` in the `ResultsSequence` class update the constructor and `this.state` to handle any results and plots you need, using `React.createRef()` to bind new page elements you need.
   b) In `render()` add an appropriate new chunk to hold any results panel for this job (i.e. like `this.props.analyses.includes("psipred_job")`). Use `renderPanel()` to insert an area for a diagram
   c) In `getResults()` ensure `if(data.state === "Complete"){` handles parsing any files that need it. Ensure `this.setState({` sends the results contents to an appropriate state variables to hold them here.
   d) In `componentDidUpdate` update how you're handling any arrived results files. For the plots or  tables in the lower page region
   e) update `results_sidebar_downloads` to ensure the files you want users to access are available.
   and update `returnzip()` appropriately. Recall that you need to add the results file glob to the list of `results_map` list in `psipred_site.js`

10. If we're handling a struct result: 
    a) If we're working on structure methods you can set the struct form in `psipredsite.js`, set 
    `formSelectedOption` to `StructForm` 
    b) now repeat what is in 9 but with `results_structure.js`

## WARNING

If you added a new file type then you have to update the staging and production apache config to serve that file type, see the ansible scripts/files

# Server suspensions and messages

Now and again we have to take the server offline. You can add messages and suspensions by editing the appropriate variables in `psipred_site.js` in the `PsipredSite` class. `suspension_message` will add a message to the top and the bottom of the page and remove the submit button on the form. `server_message` will add a message to the top of the page. toggle these to `null` to not display such a message.

# TODO

1. ensure memembed and mempack work (need to use staging to debug as won't compile)
2. Set polling time correctly in `results_sequence.js` and `results_structure.js`

4. in model/index.js there is a correct use of fetch with async/await to synchronously make a request. Should replace all httprequest uses with this pattern.
5. Maybe there is a way to dry out some of the creatElement creation stuff in `results_sequence.js` and `results_structure.js`, especially for the img tag stuff.
6. Change all parsers to correctly be JSX and/or new react classes.
