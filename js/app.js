(function(){

    // initialize map, centered on Kenya
      var map = L.map('map', {
        zoomSnap: .05,
        center: [37.839333, -85.7],
        zoom: 7.5,
        minZoom: 7,
        maxZoom: 18,
        // maxBounds: L.latLngBounds([-6.22, 27.72], [5.76, 47.83])
      });

    // mapbox API access Token
      var accessToken = 'pk.eyJ1Ijoia29uc29sdXMiLCJhIjoiY2pnd2d2dXJrMTk4MzMzcGRmNjl6enpmYyJ9.MC43t60Y6axGbi32YET_tA'

    // request a mapbox raster tile layer and add to map
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + accessToken, {
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

      // legendControl.addTo(map);

      omnivore.csv('data/GeocodeHortDirectory.csv')
          .on('ready', function(e) {
              drawMap(e.target.toGeoJSON())
          })
          .on('error', function(e) {
              console.log(e.error);
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

        console.log(data)
        // add initial markers
        for (var i = 0; i < data.features.length; i++){
          var props = data.features[i].properties;
          var locationPopup =
            "<h2>" + props.resource_t + "</h2>" +  props.optional_r + "<br><b>" + props.org_name + "</b>" +
            "<p>" + props.address + "<br><br><b>Contact Information:  <br></b>" + props.contact_na + "<br>" + props.contact_ti + "<br>" + props.phone + "<br>" + props.email + "</p>";
            var iconLocation = createIcon(props.resource_t);
            // swap order of coordinates
            var coordinates = [data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]]
            L.marker(coordinates, {icon: iconLocation}).addTo(map).bindTooltip(locationPopup);
          };

        // createIcon function assigns iconURL based on type
        function createIcon(locationType) {
          var iconURL = "",
              iconSize = 35;

          if (locationType == "Shared Equipment") {
              iconURL = "icons/equipment.png",
              iconSize = [35, 25];
          } else if (locationType == "Educational Greenhouse") {
              iconURL = "icons/flower.png";
          // } else if (locationType == "Reserved1") {
          //     iconURL = "icons/Reserved1.png";
          // } else if (locationType == "Reserved2") {
          //     iconURL = "icons/Reserved2.png";
          // } else if (locationType == "Reserved3") {
          //     iconURL = "icons/Reserved3.png";
          // } else if (locationType == "Reserved4") {
          //     iconURL = "icons/Reserved4.png";
          // } else if (locationType == "Reserved5") {
          //     iconURL = "icons/Reserved5.png";
          // } else if (locationType == "Reserved6") {
          //     iconURL = "icons/Reserved6.png";
          // } else {
              iconURL = "icons/flower.png";
          }

          // return result, iconUrl is argument for L.icon, NOT iconURL
          var result = L.icon({
              iconUrl: iconURL,
              iconSize: iconSize,
              popupAnchor: [0, -15]
          });
          return result;
        };
      } // end drawMap()

      function toggleEquipment() {
        console.log("equipment");
      }

      function toggleGreenhouses() {
        console.log("greenhouse");
      }

})();
