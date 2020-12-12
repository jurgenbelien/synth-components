# synth-components
An experiment in building synths with Web Components. It uses [LitElement](https://lit-element.polymer-project.org) and the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API).

## How to start
```zsh
> npm install
> npm run dev
```

Go to the url exposed by `es-dev-server` (most often http://localhost:8000) and try it out. It will serve the `index.html` file that will load the ES Modules generated from the Typescript source files.
Note that the Web Audio API only works after a user has interacted with the page, so you first have to click anywhere on the page to get audio.

## Classes

### SynthComponent
This is the base class. Other components extend this class. It itself extends LitElement to make adding properties and UI more convienient. Methods you'll mostly use are `init` to set up and connect an output and `changeProperty` to modify the component's properties and parameters. Take a look at the `index.html` on how to initialize the synth components.

### Parameter
Parameters a specific (numeric) property with additional properties. It has a minimum and maximum value, as well as a [taper](https://en.wikipedia.org/wiki/Potentiometer#Resistance–position_relationship:_"taper"), ie the relation between the graphical representation of the value and its actual value. For example, an increase in pitch has to double the frequency, therefore a range slider to increase the pitch should be exponential, resulting in a logarithmic taper.

### ParameterSlider
To implement taper behavior a range slider used with a minimum of 0 and a maximum of 1. This slider is responsible for converting its position into a correct parameter value.
