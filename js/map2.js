mapboxgl.accessToken =
'pk.eyJ1Ijoic2FtYWZmb2xkZXIiLCJhIjoiY2wyam9oZmhrMDZhMzNlbzN5MmludTR1aiJ9.vhUMvam1aTt6ygnJsYLpiQ';
let map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/samaffolder/cl2jvuxtg003i14l26mtl63h6',
zoom: 3.5, // starting zoom
center: [-90, 40] // starting center
});

const cases = [1000, 10000, 50000, 100000, 500000],
colors = ['rgb(247,247,247)', 'rgb(253,219,199)', 'rgb(244,165,130)', 'rgb(214,96,77)', 'rgb(178,24,43)'],
radii = [1, 5, 10, 15, 20];

//load data to the map as new layers.
//map.on('load', function loadingData() {
map.on('load', () => { //simplifying the function statement: arrow with brackets to define a function

// when loading a geojson, there are two steps
// add a source of the data and then add the layer out of the source
map.addSource('covid-cases', {
    type: 'geojson',
    data: 'assets/us-covid-2020-counts.geojson'
});

map.addLayer({
        'id': 'cases-point',
        'type': 'circle',
        'source': 'covid-cases',
        'minzoom': 3.5,
        'paint': {
            // increase the radii of the circle as the zoom level and dbh value increases
            'circle-radius': {
                'property': 'cases',
                'stops': [
                    [{
                        zoom: 3.5,
                        value: cases[0]
                    }, radii[0]],
                    [{
                        zoom: 3.5,
                        value: cases[1]
                    }, radii[1]],
                    [{
                        zoom: 3.5,
                        value: cases[2]
                    }, radii[2]],
                    [{
                      zoom: 3.5,
                      value: cases[3]
                    }, radii[3]],
                    [{
                    zoom: 3.5,
                    value: cases[4]
                    }, radii[4]]
                ]
            },
            'circle-color': {
                'property': 'cases',
                'stops': [
                    [cases[0], colors[0]],
                    [cases[1], colors[1]],
                    [cases[2], colors[2]],
                    [cases[3], colors[3]],
                    [cases[4], colors[4]]
                ]
            },
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-opacity': 0.6
        }
    },
    'waterway-label'
);


// click on tree to view magnitude in a popup
map.on('click', 'cases-point', (event) => {
    new mapboxgl.Popup()
        .setLngLat(event.features[0].geometry.coordinates)
        .setHTML(`<strong>Cases:</strong> ${event.features[0].properties.cases}`)
        .addTo(map);
});

});


// create legend
const legend = document.getElementById('legend');

//set up legend grades and labels
var labels = ['<strong>Cases per County</strong>'], vbreak;
//iterate through grades and create a scaled circle and label for each
for (var i = 0; i < cases.length; i++) {
vbreak = cases[i];
// you need to manually adjust the radius of each dot on the legend
// in order to make sure the legend can be properly referred to the dot on the map.
dot_radii = 2 * radii[i];
labels.push(
    '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radii +
    'px; height: ' +
    dot_radii + 'px; "></i> <span class="dot-label" style="top: ' + dot_radii / 2 + 'px;">' + vbreak +
    '</span></p>');

}
const source =
'<p style="text-align: right; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">NY Times</a></p>';

legend.innerHTML = labels.join('') + source;