# WikiTree Maps
This app displays maps based on the data provided at WikiTree. The maps can be panned and zoomed, and the markers provide contextual data on click. WikiTree+ is used to gather the current Cemetery and One Place Study data provided, but the WikiTree API may be used to provide more map options in the future. The Maps are drawn using the [Leafletjs](https://leafletjs.com/) library.

The hosted version of this app is available on the [WikiTree Apps Server](https://apps.wikitree.com/apps/harris5439/wikitree-maps/).

Note: While Leaflet Maps are inherently mobile friendly, this iteration of WikiTree Maps was not designed for mobile devices, but rather for collaboration and extending the mapping features available.

## Prerequisites For Devlopment
* [Leafletjs](https://leafletjs.com/)
* [jQuery](https://jquery.com/)

Additional Plugins to extend the maps functions are available at [Leaflet Plugins](https://leafletjs.com/plugins.html).

## Usage

The index page sets up a navigation bar where specific maps can be called, and the initial Header / Map containers.

Once a map view is selected, the map is drawn in the Map container, and the Header is populated with information about the map.

The map can be zoomed and panned with the mouse. Clicking on a marker will display a popup with contexztual data about the marker. Clicking the layer control in the top right of the map will provide access to different map themes.

A new map can be displayed by selecting a map name in the navigation bar. 

## Contributing
### index.html
Add a new list item to the Nav with an onclick for your JS function.

* __Public Maps__ does not require any authentiction or login to view or retreive data.
* __More Maps__ (should probably be renamed) can host any non-public  maps where authentication with the WikiTree API is required.

### YourMap.js
Leaflet cannot redraw a map once initialized, so we can bypass this by removing and reloading the #map block. Since the .Header is used to display information specific to the map (or may ask for user input), we will go ahead and remove and reload this block as well.
```
$('#map').remove();
$('.Header').remove();
```
We can now reload the blocks by appending them to the parent .container:
```
$('.container').append('<div class="Header"> ... </div>');
$('.container').append('<div id="map"></div>');
```
If you want to enable the loading image while map is drawing, change the second line to:
```
$('.container').append('<div id="loader"><img id="loader-img" src="images/loading.gif" /></div><div id="map"></div>');
```
and add a check for the marker load:
```
var checkExist = setInterval(function () {
  if ($('.leaflet-marker-icon').length) {
    $('#loader').remove();
    clearInterval(checkExist);
    }
  }, 10);
```
### Building the Map
For more information on building out the map through Leaflet, see the [Quick Start Guide](https://leafletjs.com/examples/quick-start/), or the full [Documentation](https://leafletjs.com/reference.html).
