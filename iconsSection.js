// defining the chart/ title div
var title_text = "Post-natal Health checks for newborns";

var title = d3.select("body")
              .append("div")
              .attr("id", "title")
title.append("text")
    .text(title_text)
    .style("font-family", "sans-serif")
    .style("font-size", "17px");

// defining the map div with the id "map_strip"
var map_block = d3.select("body")
                  .append("div")
                  .attr("id", "map_strip")
                  .style("position","relative")


// defining the width and height of the map
var width = 145, height = 175;

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// min max has been hard coded, get this from the data itself
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

d3.csv('data_dist.csv', function(d){
  d.forEach(function(d){
    // converting full immunization rates to numeric values in JS
    d.PN_newborns = +d.PN_newborns;
  });

  var Indic = d.map(function(d){
    return d.PN_newborns;
  })

  var min_ind = d3.min(Indic);
  var max_ind = d3.max(Indic);

  console.log(min_ind);
  console.log(max_ind);

  // var min_ind = 40
  // var max_ind = 95

  // interval length

  var min_max_interval = (max_ind - min_ind)/3;

  // color scale for the choropleth map (just three gradations)
  var colorScale = d3.scaleThreshold()
      .domain(d3.range(min_ind, max_ind, min_max_interval))
      .range(d3.schemeGreens[4]);

  // checking teh cut points for the color scale
  console.log(d3.range(min_ind, max_ind, min_max_interval));

  // defining the projection for map (change center and scale to get desired size for the map)
  var projection = d3.geoMercator()
      .center([89.70, 24.80])
      .scale([150 * 9]);

  // defining the paths for the maps
  var path = d3.geoPath().projection(projection);
  // bring legend here

  // getting the cut points for the legend
  var lowest_int_text = "(" + Math.round(min_ind) + "%-" + Math.round((min_ind + min_max_interval)) +"%)" ;
  var mid_int_text = "(" + Math.round((min_ind + min_max_interval)) + "%-" + Math.round((min_ind + (2*min_max_interval))) +"%)";
  var highest_int_text = "(" + Math.round((min_ind + (2*min_max_interval))) + "%-" + Math.round((min_ind + (3*min_max_interval))) +"%)";

  // defining the ordinal scale for drawing the legend
  var ordinal = d3.scaleOrdinal()
                        .domain(["Low " + lowest_int_text , "Mid " + mid_int_text, "High " + highest_int_text])
                        .range([ colorScale(min_ind), colorScale(min_ind + min_max_interval) , colorScale(min_ind + (2*min_max_interval))]);

  // svg that contains the legend as well as the map
  var legend_svg = map_block.append("div")
                              .classed("legend-svg-div", true)
                              .style("position","absolute")
                              .style("width","100%")
                              .append("svg")
                              .classed("legend-svg", "true")
                              //.attr("width", )
                              .attr("height", height);

  // a group within the svg that contains the legend elements
  legend_svg.append("g")
      .attr("class", "legendOrdinal")
      .attr("transform", "translate(0, 0)");

  // defining the color/ ordinal legend
  var legendOrdinal = d3.legendColor()
                        .shapePadding(5)
                        .scale(ordinal)
                        .shapeWidth(15)
                        .shapeHeight(10);

  // defining the map svg with the class "map_in_a_box"
  var svg = map_block
              //.select(".legend-svg")
              .append("div")
              .classed("map_box_div", true)
              .append("svg")
              .attr("width", width)
              .attr("height", height)
              .style("opacity", .95)
              .classed("map_in_a_box", "true");

  d3.json("Punjab_dist.topojson", function (error, topology) { // <-A
      svg.selectAll("path")
            .data(topojson.feature(topology,
              topology.objects.Punjab_dist_corr).features)
            .enter().append("path")
            .attr("d", path)
            //.style("fill", "#2f4f4f")
            .style("opacity", 0.85)
            .style("stroke", "white")
            .style("stroke-width", 0.125)
            .style("fill", function(d) {//Get data value
              var value = d.properties.PN_newborns;
              if (value) {
              //If value exists…
                return colorScale(value);
              } else {
              // If value is undefined…
                return "#ccc";
              }
            });
        //console.log(topology.objects.Punjab_immun.geometries);



      d3.select(".legendOrdinal").call(legendOrdinal);

      svg.append("text")
            .text("87.2%")
            .attr("x", svg.attr("width")/ 2)
            .attr("y", svg.attr("height")/ 2)
            .style("font-family", "sans-serif")
            .style("font-size", "20px")
            .style("font-weight", "bold")
            .style("text-anchor", "middle")
            .style("fill", "white")
            .style("stroke", "black")
            .style("stroke-width", 0.9)
            .style("fill-opacity", 0.80);
            //.style("fill-opacity", 0.00);
  });


  // add the external Punjab map svg into the div by id
  // document.getElementById("map_strip").appendChild(xml.documentElement);
  // var map_svg = d3.select("svg")
  //                 .attr("id", "Punjab_map");
  //
  // map_svg.attr("transform", "translate(0, 0)scale(0.90)");
  //

  //
  // console.log(map_svg.attr("width"));

  var sizeScale = d3.scale.linear()
                    .domain([50, 100])
                    .range([0.425, 0.85])

  strip1 = d3.select("body")
            .append("div")
            .classed("whole-strip", true)

  strip2 = d3.select("body")
            .append("div")
            .classed("whole-strip", true)

  strip3 = d3.select("body")
            .append("div")
            .classed("whole-strip", true)


  // defining dissagg type
  function plot(data, category_label, class_name){
    this.classed(class_name, true);
    var disagg_type = this.append("div")
                          .classed("dissagg-type", true)
                          .style("font-family", "sans-serif")
                          .classed(class_name, true)
                          //.style("display", "flex")
                          .style("align-items", "center")
                          .style("font-size", "14px")
                          .style("font-weight", "600")
                          .style("padding", "7px")
                          .style("padding-top", "12px")
                          .style("width","313px")
                          .style("margin", "0 auto");
    // adding text to the disagg type
    disagg_type.append("text")
                .text(category_label);

    // parent block within div (contains the pictograms and associated data)
    var parent = this.append("div")
                      .classed("parent-block", true)
                      .classed(class_name, true)
                      .style("display", "flex")
                      .style("align-items","center")
                      .style("justify-content","center");


    var icons = parent.selectAll(".icon-data")
                      .data(data)
                      .enter()
                      .append("div")
                      .attr("class", "icon-data")

    icons.append("div")
          .classed("label-contain", true)
          //.style("text-align", "center")
          //.style("padding-top", "2px")
          .style("text-align", "center")
          .append("text")
          .text(function(d, i){
            return d.category;
          })
          .style("font-family", "sans-serif")
          .style("font-size", "0.8em")

    icons.append("div")
        .attr("class", "svg-contain")
        .append("svg")
        .attr("class", "woman-icon")
        .attr("width", 64)
        .attr("height", 64)
        .attr("viewBox", function(d, i ){ // "0 0 64 64"
          return 0 + " " + 0 + " " + 31.8 + " " + 31.8;
        })
        .append("path")
        .attr("d", "M16.211,8.913c2.38,0,4.308-1.996,4.308-4.454C20.519,1.996,18.591,0,16.211,0c-2.382,0-4.314,1.996-4.314,4.459C11.897,6.917,13.829,8.913,16.211,8.913z")

    //d3.select("body")
    this.selectAll(".woman-icon")
        .append("path")
        // .attr("d", "M53.402 52.363c-1.757 0.504-3.553-0.383-4.020-1.991l-6.006-20.976-2.931-0.004 9.604 33.468h-35.78l9.604-33.468-2.935 0.004-6.009 20.976c-0.46 1.609-2.258 2.495-4.013 1.991-1.759-0.504-2.868-2.042-2.278-4.051l6.181-21.52c2.469-8.603 9.668-8.333 9.668-8.333h15.344c0 0 7.2-0.27 9.671 8.333l6.176 21.52c0.589 2.009-0.52 3.547-2.277 4.051zM32.206 33.291c-5.319 0-9.63 4.309-9.63 9.627 0 4.832 3.56 8.835 8.203 9.524v2.641h-2.897v2.883h2.897v2.894h2.882v-2.894h2.895v-2.883h-2.895v-2.645c4.632-0.7 8.172-4.698 8.172-9.52 0-5.318-4.307-9.627-9.626-9.627zM32.157 49.506c-3.71 0-6.716-3.008-6.716-6.718 0-3.708 3.006-6.718 6.716-6.718 3.713 0 6.717 3.010 6.717 6.718 0.001 3.71-3.005 6.718-6.717 6.718z")
        .attr("d", "M23.855,12.692c-0.214-0.65-1.436-2.621-4.752-2.639l-6.491,0.017c-3.219-0.18-4.504,1.722-4.705,2.565    c0,0-2.174,6.941-1.801,8.549c0.231,0.998,1.963,2.219,3.807,3.127l-2.456,7.483h17.318l-2.389-7.745    c1.646-0.871,3.092-1.958,3.301-2.865C26.065,19.557,23.855,12.692,23.855,12.692z M13.307,20.341    c-0.301,0.134-0.634,0.211-0.983,0.211c-1.354,0-2.45-1.114-2.45-2.487s1.097-2.486,2.45-2.486c1.329,0,2.421,1.076,2.457,2.418    c0.422-0.303,0.854-0.445,1.178-0.504c0,0.002,0,0.004,0,0.007c0.487-0.093,0.865,0,0.865,0c1.634,0.362,5.245,1.964,5.245,1.964    s-1.938,2.4-5.458,2.385c-0.092,0-0.182-0.002-0.267-0.006h-0.001c-0.324-0.008-0.615-0.029-0.877-0.061    C13.804,21.586,13.328,20.966,13.307,20.341z")

    //d3.select("body")
    this.selectAll(".icon-data")
        .selectAll(".woman-icon")
        .attr("transform", function(d, i){
          //return "translate(" + 64*i + "," + (64 - sizeScale(d.value) * 64)/2 + ")" + "scale(" + sizeScale(d.value) + ")" ;
          return "translate(" + 64*i + ",0)" + "scale(" + sizeScale(d.value) + ")" ;
        });

    //d3.select("body")
    this.selectAll(".icon-data")
        .append("div")
        .classed("text-contain", true)
        .style("text-align", "center")
        .style("padding-top", "2px")
        .append("text")
        .text(function(d, i){
          return d.value + "%";
        })
        //.attr("dy", 69)
        .style("font-family", "sans-serif")

  }

  plot.call(strip1, [{category: "Lowest", value: 71.8},
                    {category: "Second", value: 85.3},
                    {category: "Middle", value: 88.8},
                    {category: "Fourth", value: 93.0},
                    {category: "Highest", value: 96.3}], "Across Wealth Quintile", "WQTL");

  plot.call(strip2, [{category: "Preschool", value: 80.8},
                    {category: "Primary", value: 89.0},
                    {category: "Middle", value: 91.5},
                    {category: "Matric", value: 93.8},
                    {category: "Higher", value: 96.4}], "Across Mother's education", "MOTH_EDUC");

  plot.call(strip3, [{category: "Rural", value: 85.0},
                     {category: "Urban", value: 91.3}], "Across Area", "AREA");

})
