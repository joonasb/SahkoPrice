import React, { useEffect, useState, useRef } from 'react'
import * as d3 from 'd3';
import './Style.css';


function App(){

  const [backendData, setBackendData] = useState([{}])
  const [data_sahko, setSahkoData] = useState([{}])
  const [maxPriceElem, setMaxPriceElemData] = useState([{}])
  const [minPriceElem, setMinPriceElemData] = useState([{}])
  const svgRef = useRef();

  useEffect(() => {
    console.log('the data_sahko has changed', data_sahko)
    console.log(data_sahko)
    hinnat = data_sahko.map(function(item) { return item["hinta"]; });
    leima_s = data_sahko.map(function(item) {return item["aikaleima_suomi"]; })
    console.log("hinnat" + JSON.stringify(hinnat))
    console.log((data_sahko.map(function(item) { return item["hinta"]; })))
    console.log("leimat" + JSON.stringify(leima_s))
    maxPrice = Math.max(...hinnat);
    console.log("max price " + maxPrice)
    minPrice = Math.min(...hinnat);
    console.log("min price " + minPrice)
    // undefined check
    if(data_sahko.length < 3){
      console.log("loading...")
    }
    if(data_sahko.length > 3){
      setMaxPriceElemData(data_sahko.find(({hinta}) => hinta == maxPrice))
      setMinPriceElemData(data_sahko.find(({hinta}) => hinta == minPrice))
      console.log(maxPriceElem)
      //console.log(min_priceElem_split)
    }
  }, [data_sahko])

  var hinnat = [];
  var leima_s = [];
  var maxPrice = 0;
  var minPrice = 0;
  var max_priceElem_split = 0;
  var min_priceElem_split = 0;
  var viisysi_max_priceElem_split = 0; // esim. 08:00 - 08:59

 
  
  useEffect(() => {
    fetch("/api").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data)
      }
    )
  }, []);

  useEffect(() => {
    fetch("/fetch_spot_data").then(
      response => response.json()
    ).then(
      data => {
        // Lexicographical sort by aikaleima_suomi
        // https://stackoverflow.com/questions/12192491/sort-array-by-iso-8601-date
        data = data.sort(function(x, y){return (x.aikaleima_suomi - y.aikaleima_suomi) ? -1 : ((x.aikaleima_suomi > y.aikaleima_suomi) ? 1 : 0);});
        setSahkoData(data)
      }
    )
  }, []);

  // d3 code
  useEffect(() => {
    // setting up svg container
    const w = 700;
    const h = 350;
    const svg = d3.select(svgRef.current)
      .attr('width', w)
      .attr('height', h)
      .style('overflow', 'visible')
      .style('margin-top', '75px')
      .style('margin-left', '200px')
      .style('font-weight', 400)
      .attr("class", "bar")

    // setting the scaling ( 0 - 20 in our case)
    const xScale = d3.scaleBand()
      .domain(hinnat.map((val, i) => i))
      .range([0, w])
      .padding(0.4);
    const yScale = d3.scaleLinear()
      .domain([0, 20])
      .range([h, 0]);


    // setting the axes
    const xAxis = d3.axisBottom(xScale)
      .tickValues([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]);
    const yAxis = d3.axisLeft(yScale)
      .ticks(10);
    svg.append('g')
      .call(xAxis)
      .attr('transform', `translate(0, ${h})`);
    svg.append('g')
      .call(yAxis);

    // setting the svg data
    svg.selectAll('.bar')
      .data(hinnat)
      .join('rect')
        .attr('x', (v, i) => xScale(i))
        .attr('y', yScale)
        //.attr("class", "bar")
        .attr('width', xScale.bandwidth())
        .attr('height', val => h - yScale(val))
        .on("mouseover", onMouseOver)
        .on("mouseout", onMouseOut)
        .transition()
        .duration(500)


    svg.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", -50)
        .attr("dy", ".90em")
        .attr("transform", "rotate(-90)")
        .text("Snt/kWn");
    
    svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("x", w - 30)
      .attr("y", h + 40)
      .text("Tunnit");

    // Jatka Tooltip myöhemmin 7.5.2023
    function onMouseOver(d, i){
        
      
    }

    function onMouseOut(d, i){
       
    }

  }, [hinnat, leima_s])

  return (
    <div>
      {(typeof backendData.dates === 'undefined') ? (
        <p>Loading...</p>
      ): (
          backendData.dates.map((date, i) => (
            <p key={i}>{date}</p>
          ))
      )}
      <div id="tooltip" class="hidden">
            <p><strong>Bar Value</strong></p>
            <p><span id="value">100</span></p>
      </div>
      <svg ref={svgRef}></svg>
      {(data_sahko.length < 3 || typeof maxPriceElem.aikaleima_suomi === 'undefined') ? (
          console.log("wait for it...")
      ) : (
        <table id="minMax">
          <tr>
              <th>{(maxPriceElem.aikaleima_suomi.split('T')[0])}</th>
              <th>Ajankohta</th>
              <th>snt/kWn</th>
          </tr>
          <tr>
              <td>Max</td>
              <td>{(maxPriceElem.aikaleima_suomi.split('T')[1])} - {(maxPriceElem.aikaleima_suomi.split('T')[1]).split(':')[0] + ":59"}</td>
              <td>{(maxPriceElem.hinta)}</td>
          </tr>
          <tr>
              <td>Min</td>
              <td>{(minPriceElem.aikaleima_suomi.split('T')[1])} - {(minPriceElem.aikaleima_suomi.split('T')[1]).split(':')[0] + ":59"}</td>
              <td>{(minPriceElem.hinta)}</td>
          </tr>
        </table>
      )}
    </div>
  )
}

function waitForElement(){
  if(typeof maxPriceElem !== "undefined"){
      //variable exists, do what you want
  }
  else{
      setTimeout(waitForElement, 250);
  }
}

export default App
