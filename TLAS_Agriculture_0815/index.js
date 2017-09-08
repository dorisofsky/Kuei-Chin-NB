/*     Choropleth      */

var demo2_geojson=false;
var demo2=false;

d3.json("TOWN_MOI_1060525.json", function(data) {
    demo2_geojson=data;
    if (demo2)
        drawChoropleth(demo2,demo2_geojson);
});

d3.csv("AgricLoss.csv", function(data) {
    demo2=data;
    if (demo2_geojson)
        drawChoropleth(demo2,demo2_geojson);
});


function drawChoropleth(data,geojson) {

    var csv_data = d3.nest()
        .key(function(d) { return d.TownCode;})
        .rollup(function(d) { 
        return d3.sum(d, function(g) {return g.LossPriceW; });
        }).entries(data);

    csv_data.forEach(function(d) {
     d.TownCode = d.key;
     d.LossPriceW = d.values;
    });

    

    var xf = crossfilter(csv_data);
    var groupname = "Choropleth";
    var facilities = xf.dimension(function(d) { return d.TownCode; });
    var facilitiesGroup = facilities.group().reduceSum(function(d) { return d.LossPriceW;});

    var choro = dc_leaflet.choroplethChart("#demo3 .map",groupname)
        .dimension(facilities)
        .group(facilitiesGroup)
        .width(500)
        .height(600)
        .center([23.6,121])
        .zoom(7.5)
        .geojson(geojson)
        .colors(colorbrewer.YlGnBu[7])
        .colorDomain([
            d3.min(facilitiesGroup.all(), dc.pluck('LossPriceW')),
            d3.max(facilitiesGroup.all(), dc.pluck('LossPriceW'))
        ])
        .colorAccessor(function(d,i) {
            return d.LossPriceW;
        })
        .featureKeyAccessor(function(feature) {
            return feature.properties.TOWNCODE;
        })
        .renderPopup(true)
        .popup(function(d,feature) {
            return feature.properties.nameEn+" : "+d.LossPriceW;
        })
        .legend(dc_leaflet.legend().position('bottomright'));


    dc.renderAll(groupname);
    return {choro: choro};
}