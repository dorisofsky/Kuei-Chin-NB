 /*     Markers      */

  d3.tsv("demo1.tsv", function(data) {
      drawMarkerSelect(data);
      drawMarkerArea(data);
  });

  function drawMarkerSelect(data) {
      var xf = crossfilter(data);
      var groupname = "marker-select";
      var facilities = xf.dimension(function(d) { return d.geo; });
      var facilitiesGroup = facilities.group().reduceCount();

      var marker = dc_leaflet.markerChart("#demo1 .map",groupname)
          .dimension(facilities)
          .group(facilitiesGroup)
          .width(600)
          .height(400)
          .center([42.69,25.42])
          .zoom(7)
          .cluster(true);

      var types = xf.dimension(function(d) { return d.type; });
      var typesGroup = types.group().reduceCount();

      var pie = dc.pieChart("#demo1 .pie",groupname)
          .dimension(types)
          .group(typesGroup)
          .width(200)
          .height(200)
          .renderLabel(true)
          .renderTitle(true)
          .ordering(function (p) {
              return -p.value;
          });

      dc.renderAll(groupname);
      return {marker: marker, pie: pie};
  }

  function drawMarkerArea(data) {
      var xf = crossfilter(data);
      var groupname = "marker-area";
      var facilities = xf.dimension(function(d) { return d.geo; });
      var facilitiesGroup = facilities.group().reduceCount();

      var marker = dc_leaflet.markerChart("#demo2 .map",groupname)
          .dimension(facilities)
          .group(facilitiesGroup)
          .width(600)
          .height(400)
          .center([42.69,25.42])
          .zoom(7)
          .renderPopup(false)
          .filterByArea(true);

      var types = xf.dimension(function(d) { return d.type; });
      var typesGroup = types.group().reduceCount();

      var pie = dc.pieChart("#demo2 .pie",groupname)
          .dimension(types)
          .group(typesGroup)
          .width(200)
          .height(200)
          .renderLabel(true)
          .renderTitle(true)
          .ordering(function (p) {
              return -p.value;
          });

      dc.renderAll(groupname);
      return {marker: marker, pie: pie};
  }

  var demo2_geojson=false;
  var demo2=false;

  d3.json("b.json", function(data) {
      demo2_geojson=data;
      if (demo2)
          drawChoropleth(demo2,demo2_geojson);
  });
  d3.csv("demo2.csv", function(data) {
      demo2=data;
      if (demo2_geojson)
          drawChoropleth(demo2,demo2_geojson);
  });

  /*     Choropleth      */

  function drawChoropleth(data,geojson) {
      dataP = [];
      data.filter(function(d) {
          return d.code && d.code!='SOF46';
      }).forEach(function(d) {
          d.sum = 0;
          for(var p in d)
              if (p && p!="code" && p!="sum") {
                  dataP.push({'code':d.code,'type':p,'value':+d[p]});
                  d.sum+=+d[p];
              }
      });
      delete data;

      var xf = crossfilter(dataP);
      var groupname = "Choropleth";
      var facilities = xf.dimension(function(d) { return d.code; });
      var facilitiesGroup = facilities.group().reduceSum(function(d) { return d.value;});

      var choro = dc_leaflet.choroplethChart("#demo3 .map",groupname)
          .dimension(facilities)
          .group(facilitiesGroup)
          .width(600)
          .height(400)
          .center([42.69,25.42])
          .zoom(7)
          .geojson(geojson)
          .colors(colorbrewer.YlGnBu[7])
          .colorDomain([
              d3.min(facilitiesGroup.all(), dc.pluck('value')),
              d3.max(facilitiesGroup.all(), dc.pluck('value'))
          ])
          .colorAccessor(function(d,i) {
              return d.value;
          })
          .featureKeyAccessor(function(feature) {
              return feature.properties.code;
          })
          .renderPopup(true)
          .popup(function(d,feature) {
              return feature.properties.nameEn+" : "+d.value;
          })
          .legend(dc_leaflet.legend().position('bottomright'));


      var types = xf.dimension(function(d) { return d.type; });
      var typesGroup = types.group().reduceSum(function(d) { return d.value;});

      var pie = dc.pieChart("#demo3 .pie",groupname)
          .dimension(types)
          .group(typesGroup)
          .width(200)
          .height(200)
          .ordering(function (p) {
              return +p.key.substr(6);
          })
          .renderLabel(false)
          .renderTitle(true)
          .title(function(d) {
              var age = d.key.substr(6);
              if (age.indexOf("p")==-1)
                  age="Between "+(+age-4)+"-"+age;
              else
                  age="Over "+age.substr(0,2);
              return age+" : "+d.value;
          });

      dc.renderAll(groupname);
      return {choro: choro, pie: pie};
  }