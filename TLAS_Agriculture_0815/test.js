console.log("script tag got executed!");

d3.csv("AgricLoss.csv", function(data) {
  console.log(data[0]);
});

d3.csv("AgricLoss.csv", function(error, csv_data) {
 var data = d3.nest()
  .key(function(d) { return d.TownCode;})
  .rollup(function(d) { 
   return d3.sum(d, function(g) {return g.LossPriceW; });
  }).entries(csv_data);

 console.log(JSON.stringify(data));

});