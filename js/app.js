(function(){

    // initialize map, centered on KY
    var southWest = L.latLng(36.469131, -89.606024),
        northEast = L.latLng(39.509346, -81.639120),
        bounds = L.latLngBounds(southWest, northEast);

    var map = L.map('map', {
        zoomSnap: .05,
        center: [37.839333, -85.7],
        maxBounds: bounds,
        zoom: 7.5,
        minZoom: 7.2,
        maxZoom: 18,
      });
    map.setMaxBounds(map.getBounds());

    // mapbox API access Token
      var accessToken = 'pk.eyJ1Ijoia29uc29sdXMiLCJhIjoiY2pnd2d2dXJrMTk4MzMzcGRmNjl6enpmYyJ9.MC43t60Y6axGbi32YET_tA'

    // request a mapbox raster tile layer and add to map
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + accessToken, {
        maxZoom: 18,
        id: 'mapbox.light',
        accessToken: accessToken
      }).addTo(map);



    // set display style for county polygons
      var countyStyle = {
          "color": "#005d7e",
          "weight": 1,
          "fillOpacity" : 0.05,
          "opacity": 0.2
      };

      // set icons for layer types
      var greenhouseIcon = L.icon({
          iconUrl: "./icons/flower.png",
          iconSize: [35, 25],
          popupAnchor: [0, -15]
      });

      var equipmentIcon = L.icon({
          iconUrl: "./icons/equipment.png",
          iconSize: [35, 25],
          popupAnchor: [0, -15]
      });

    // load KY county polygons
    $.getJSON("./data/ky-counties.geojson", function(counties) {

          // load CSV file
          omnivore.csv('data/GeocodeHortDirectory.csv')
          .on('ready', function(e) {
              drawMap(e.target.toGeoJSON());
              addDataToMap(counties, countyStyle, map);
          })
          .on('error', function(e) {
              console.log(e.error);
      });

    });

        // collapsible meta-text
    var coll = document.getElementsByClassName("collapsible");
    var i;
    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
          content.style.display = "none";
        } else {
          content.style.display = "block";
        }
      });
    }

    function drawMap(data) {


      // create layer groups by resource type
      var greenhouseLayer = L.geoJson(data, {
        filter: greenhouseFilter,
        pointToLayer: function(feature,latlng) {
            return L.marker(latlng, {icon: greenhouseIcon});
          },
          onEachFeature : function(feature,layer) {
            var props = feature.properties;
            var locationPopup =
              "<h2>" + props.resource_t + "</h2>" +  props.optional_r + "<br><b>" + props.org_name + "</b>" +
              "<p>" + props.address + "<br><br><b>Contact Information:  <br></b>" + props.contact_na + "<br>" +
              props.contact_ti + "<br>" + props.phone + "<br><a href='mailto:" + props.email + "'>" + props.email + "</a></p></p>";
              layer.on('click', function() {
                layer.bindPopup(locationPopup);
              });
          }
        }).addTo(map);

      var equipmentLayer = L.geoJson(data, {
        filter: equipmentFilter,
          pointToLayer: function(feature,latlng) {
              return L.marker(latlng, {icon: equipmentIcon});
            },
            onEachFeature : function(feature,layer) {
              var props = feature.properties;
              var locationPopup =
                "<h2>" + props.resource_t + "</h2>" +  props.optional_r + "<br><b>" + props.org_name + "</b>" +
                "<p>" + props.address + "<br><br><b>Contact Information:  <br></b>" + props.contact_na + "<br>" +
                props.contact_ti + "<br>" + props.phone + "<br><a href='mailto:" + props.email + "'>" + props.email + "</a></p></p>";
                layer.on('click', function() {
                  layer.bindPopup(locationPopup);
                });
            }
        }).addTo(map);

      // create object of all layers
      var geoJsonLayers = {
            greenhouseLayer: greenhouseLayer,
            equipmentLayer: equipmentLayer,
      };

      // legend for turning on/off layers
      var sourcesLabels = {
        "<img src='icons/flower.png' height='35' width='35'><b>Educational Greenhouses</b>": geoJsonLayers.greenhouseLayer,
        "<img src='icons/equipment.png' height='25' width='35'><b>Shared Equipment</b>": geoJsonLayers.equipmentLayer,
      };

      L.control.layers(null, sourcesLabels, { collapsed:false }).addTo(map);


      // filtering functions for creating multiple layers from single geojson
      function greenhouseFilter(feature) {
        if (feature.properties.resource_t === "Educational Greenhouse") return true
      }

      function equipmentFilter(feature) {
        if (feature.properties.resource_t === "Shared Equipment") return true
      }

    } // end drawMap()

    function addDataToMap(data, style, map) {
        var dataLayer = L.geoJson(data, {
          style: style,
          onEachFeature: function (feature, layer) {
			          layer.bindTooltip("<h2>" + feature.properties.name + " County</h2>");
		      }
        });
        dataLayer.addTo(map);
    }


})();
