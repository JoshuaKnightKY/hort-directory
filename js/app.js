(function(){

    // initialize map, centered on Kenya
      var map = L.map('map', {
        zoomSnap: .1,
        center: [37.839333, -85.7],
        zoom: 7,
        minZoom: 5,
        maxZoom: 9,
        // maxBounds: L.latLngBounds([-6.22, 27.72], [5.76, 47.83])
      });

    // mapbox API access Token
      var accessToken = 'pk.eyJ1Ijoia29uc29sdXMiLCJhIjoiY2pnd2d2dXJrMTk4MzMzcGRmNjl6enpmYyJ9.MC43t60Y6axGbi32YET_tA'

    // request a mapbox raster tile layer and add to map
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + accessToken, {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.light',
        accessToken: accessToken
      }).addTo(map);

      // create Leaflet control for the legend
      var legendControl = L.control({
        position: 'bottomright'
      });

      // when the control is added to the map
      legendControl.onAdd = function (map) {

        // select the legend using id attribute of legend
        var legend = L.DomUtil.get("legend");

        // disable scroll and click functionality
        L.DomEvent.disableScrollPropagation(legend);
        L.DomEvent.disableClickPropagation(legend);

        // return the selection
        return legend;

      }

      legendControl.addTo(map);


      omnivore.csv('data/GeocodeHortDirectory.csv').addTo(map);

      omnivore.csv('data/GeocodeHortDirectory.csv')
          .on('ready', function(e) {
              console.log(e.target)
          })
          .on('error', function(e) {
              console.log(e.error);
      });

})();
