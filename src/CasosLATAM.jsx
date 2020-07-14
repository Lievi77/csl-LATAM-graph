import React from "react";
import * as d3 from "d3";
import "./CasosLATAM.css";

class CasosLATAM extends React.Component {
  componentDidMount() {
    this.drawChart();
  }

  drawChart() {
    //data path, width and height provided in App.js for reusability
    const dataPath = this.props.data;
    const width = this.props.width;
    const height = this.props.height;
    //the rest of the svg parameters will be provided in this class
    const adj = 60;
    const padding = 5;
    const margin = 5;

    const up_translation = -150;

    //canvas definition here

    const svg = d3
      .select("body") //selects an html tag to be appended to
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr(
        "viewBox",
        "-" +
          adj +
          " -" +
          adj +
          " " +
          (width + adj * 3) +
          " " +
          (height + adj * 3)
      )
      .attr("transform", "translate(" + 0 + ", " + up_translation + ")")
      .style("padding", padding)
      .style("margin", margin)
      .classed("svg-content", true);

    //Here we add the background

    const background_rotation = -10;

    svg
      .append("rect")
      .attr("width", width + 65)
      .attr("height", height + 70)
      .attr("fill", "white")
      .attr("transform", "translate(" + background_rotation + ", 0)");

    //DATA LOADING
    const dateFormatter = d3.timeParse("%Y-%m-%d"); //to be used to transform strings to date objects

    //we will use chained .then method calls
    //first .then call will be used to format the csv file
    //second one will be to actually build the graph
    d3.csv(dataPath)
      .then(function (data) {
        //format the csv file to mapped values {date, confirmed}

        const novaData = []; //new array of objects

        for (var i = 0; i < data.length; i++) {
          novaData.push({
            date: dateFormatter(data[i].dateRep),
            confirmed: +data[i].cases,
          });
        }

        return novaData; //return for usage in the next .then call
      })
      .then(function (data) {
        //drawing the graph here

        //first we wil define the axes scale
        const xScale = d3.scaleTime().range([0, width]);
        const yScale = d3.scaleLinear().rangeRound([height, 0]);

        //next we will set the domain for the scales
        //xScale Domain
        xScale.domain(
          d3.extent(data, function (d) {
            return d.date; // data is already formatted
          })
        );
        //yScale next
        yScale.domain([
          0,
          d3.max(data, function (d) {
            return d.confirmed; //data is also formatted
          }),
        ]);

        //we define pretty ticks here
        xScale.ticks();
        yScale.ticks();

        //now we will draw the actual Axes here

        //may need to investigate better axes
        const yaxis = d3.axisLeft().scale(yScale);
        const xaxis = d3
          .axisBottom()
          .tickFormat(d3.timeFormat("%d-%b-%Y")) //need for cleaner data
          .scale(xScale);

        var right_rotation = 50;

        //appending to the svg the axis and the line
        svg
          .append("g")
          .attr("class", "axis")
          .attr("transform", "translate(" + right_rotation + "," + height + ")")
          .call(xaxis)
          .selectAll("text") //from here on we are selecting the ticks text
          .attr("transform", "translate(-10,10)rotate(-45)")
          .style("text-anchor", "end")
          .style("font-size", 8)
          .style("fill", "#000000");

        svg
          .append("g")
          .attr("class", "axis")
          .attr("transform", "translate(" + right_rotation + ", 0)")
          .call(yaxis);

        //defining the line
        const covidLine = d3
          .line()
          .x(function (d) {
            return xScale(d.date);
          })
          .y(function (d) {
            return yScale(d.confirmed);
          });

        //appending the line to the svg with added interactivity
        svg
          .append("path")
          .data([data])
          .attr("class", "line")
          .attr("transform", "translate(" + right_rotation + "," + 0 + ")")
          .attr("d", covidLine);
        //From here on, we are defining the mouseover effect

        //appending the axis titles
        svg
          .append("text")
          .attr("text-anchor", "middle")
          .attr(
            "transform",
            "translate(" + 0 + "," + height / 2 + ")rotate(-90)"
          )
          .text("Casos Confirmados")
          .style("font-size", 12)
          .style("fill", "Grey ");

        svg
          .append("text")
          .attr("text-anchor", "middle") // this makes it easy to centre the text as the transform is applied to the anchor
          .attr(
            "transform",
            "translate(" + (width + 40) / 2 + "," + (height + 69) + ")"
          ) // centre below axis
          .text("Fecha")
          .style("font-size", 12)
          .style("fill", "Grey");
      });
  }

  render() {
    //render must be in html
    return <div id={"#" + this.props.id}></div>;
  }
}

export default CasosLATAM;
