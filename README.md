# MegaTon

MegaTon is free and secure Free Ton wallet, which can be deployed as browser extension [Chrome Web Store](https://chrome.google.com/webstore/detail/megaton/kobonkepbhoanlldpglekdblbpodlljo?hl=ru&) as well as progressive web app.

<br/>
<br/>
<p align="center">
  <img src="/docs/screenshots/Animation.gif" />
</p>

[Documentation](/docs/software_architecture.pdf)


## Build Instruction

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
The build is minified and the filenames include the hashes.\

## Deployment

Extension can be deployed into browser manually

* run build script
    `npm run build`
* open `chrome://extensions`
* enable development mode in the extensions page
* load extension from build folder
