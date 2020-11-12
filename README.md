# Functional Javascript Apps

This is a small repo with two apps made using functional javascript concepts, learned from James Moore (@uknowthen);
These applications can be run locally using npm and any modern browser.
There is a simple calorie counter app, and a weather app that makes async requests to the OpenWeather API.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) installed and then inside of any of the two apps:

```sh
$ npm install
$ npm start
```

Your app should now be running on [localhost:9000](http://localhost:9000/).
Please note that if you want to run the weather app, you will need to change the `APPID` variable in `/src/Update.js` with your own API key from [OpenWeather](https://openweathermap.org/api).

## App structure

The file/code structure for both apps are the same: Using the functional programming paradigm, or style, as most as possible, i.e. using pure functions for transforming and manipulating data structures, while minimizing or tight controlling the side effects (with inpure functions).

Each app has similar files: Inside the `/src`, the `/Model.js` encapsulates all of the state of the app, while `/View.js` is responsable for the functions that return actual html elements for rendering the page. `Update.js` hosts all of necessary code for the returning new state of the app, if an user interaction is found. Everything mentioned is composed of pure functions so far.

Finally, all of the impure code is inside the `/App.js` (including async calls for the OpenWeatherAPI), which is responsable for calling the functions, updating the DOM, replacing the initial state (model) for new state returned from any update functions, and any other necessary side effect. If you are familiar with the Redux library for state management in web development, you will find the patern used here very similar.

## Documentation

For more information about some of the libraries used, please check:

- [Ramda - A practical functional library for JavaScript programmers ](https://ramdajs.com/)
- [Tachyons - Functional CSS for humans](https://tachyons.io/)
- [HyperScript - Create HyperText with JavaScript](https://github.com/hyperhype/hyperscript)
- [Virtual-dom - A JavaScript DOM model for efficient re-rendering](https://github.com/Matt-Esch/virtual-dom)