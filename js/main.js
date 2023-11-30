function getMonthName(month) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[month - 1];
}

function getWeekName(week) {
  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return weekdays[week];
}

d3.json("data/crimes1.json").then(function(data_1){ 
  { 
      const main = async () => {


        const json_crimes_1 = data_1;


        json_crimesData = json_crimes_1;

        _crimeData = json_crimesData
          .map((d) => ({
            address: d["ADDRESS"],
            camera_id: d["CAMERA_ID"],
            crime_date: d["CRIME_DATE"],
            crimes: d["CRIMES"],
            weekday: d["WEEKDAY"],
            year: d["YEAR"],
            day: d["DAY"],
            month: d["MONTH"],
            x_coordinate: d["X_COORDINATE"],
            y_coordinate: d["Y_COORDINATE"],
            latitude: d["LATITUDE"],
            longitude: d["LONGITUDE"],
          }))
          .filter(
            (d) =>
              d.address !== null &&
              d.camera_id !== null &&
              d.crime_date !== null &&
              d.crimes !== null &&
              d.weekday !== null &&
              d.year !== null &&
              d.day !== null &&
              d.month !== null &&
              d.x_coordinate !== null &&
              d.y_coordinate !== null
          );

        const addressWiseSummary = {};
        const addressResultSet = [];

        const streetWiseSummary = {};
        const streetResultSet = [];

        const yearWiseSummary = {};
        const yearResultSet = [];

        const monthWiseSummary = {};
        const monthResultSet = [];

        const weekdayWiseSummary = {};
        const weekdayResultSet = [];

        const groupAddressWeekWiseSummary = {};
        const groupAddressWeekResultSet = [];

        for (let record of _crimeData) {
          const year = record.year;
          const month = record.month;
          const weekday = record.weekday;
          const address = record.address;
          const splitAddr = address.split(" ");
          const len = splitAddr.length;
          var street = "";

          // const weekday_month_year = weekday.toString().concat(" ").concat(month).concat(" ").concat(year);
          const address_weekday = address.concat(" ").concat(weekday);

          if (len === 3) {
            street = splitAddr[2];
          } else if (len >= 5) {
            street = splitAddr[2]
              .concat(" ")
              .concat(splitAddr[3])
              .concat(" ")
              .concat(splitAddr[4]);
          } else {
            street = splitAddr[2];//.concat(" ").concat(splitAddr[3]);
          }

          if (!(year in yearWiseSummary)) {
            yearWiseSummary[year] = { crimes: 0 };
          }

          yearWiseSummary[year]["crimes"] += record.crimes;

          if (!(month in monthWiseSummary)) {
            monthWiseSummary[month] = { crimes: 0 };
          }

          monthWiseSummary[month]["crimes"] += record.crimes;

          if (!(weekday in weekdayWiseSummary)) {
            weekdayWiseSummary[weekday] = { crimes: 0 };
          }

          weekdayWiseSummary[weekday]["crimes"] += record.crimes;

          if (!(address in addressWiseSummary)) {
            addressWiseSummary[address] = {
              crimes: 0,
              x_coordinate: record.x_coordinate,
              y_coordinate: record.y_coordinate,
            };
          }

          addressWiseSummary[address]["crimes"] += record.crimes;

          if (!(street in streetWiseSummary)) {
            streetWiseSummary[street] = {
              crimes: 0,
              x_coordinate: record.x_coordinate,
              y_coordinate: record.y_coordinate,
              latitude: record.latitude,
              longitude: record.longitude,
            };
          }

          streetWiseSummary[street]["crimes"] += record.crimes;

          if (!(address_weekday in groupAddressWeekWiseSummary)) {
            groupAddressWeekWiseSummary[address_weekday] = {
              crimes: 0,
              address: address,
              weekday: getWeekName(weekday),
              x_coordinate: record.x_coordinate,
              y_coordinate: record.y_coordinate,
              latitude: record.latitude,
              longitude: record.longitude,
            };
          }

          groupAddressWeekWiseSummary[address_weekday]["crimes"] +=
            record.crimes;
        }

        for (let year in yearWiseSummary) {
          const tempObj = {
            year: year,
            crimes: yearWiseSummary[year]["crimes"],
          };

          yearResultSet.push(tempObj);
        }

        for (let month in monthWiseSummary) {
          const tempObj = {
            month: getMonthName(month),
            crimes: monthWiseSummary[month]["crimes"],
          };

          monthResultSet.push(tempObj);
        }

        for (let weekday in weekdayWiseSummary) {
          const tempObj = {
            weekday: getWeekName(weekday),
            crimes: weekdayWiseSummary[weekday]["crimes"],
          };

          weekdayResultSet.push(tempObj);
        }

        for (let address in addressWiseSummary) {
          const tempObj = {
            address: address,
            crimes: addressWiseSummary[address]["crimes"],
            x_coordinate: addressWiseSummary[address]["x_coordinate"],
            y_coordinate: addressWiseSummary[address]["y_coordinate"],
          };

          addressResultSet.push(tempObj);
        }

        for (let street in streetWiseSummary) {
          const tempObj = {
            street: street,
            crimes: streetWiseSummary[street]["crimes"],
            x_coordinate: streetWiseSummary[street]["x_coordinate"] / 10000,
            y_coordinate: streetWiseSummary[street]["y_coordinate"] / 10000,
            latitude: streetWiseSummary[street]["latitude"],
            longitude: streetWiseSummary[street]["longitude"],
          };

          streetResultSet.push(tempObj);
        }

        for (let address_weekday in groupAddressWeekWiseSummary) {
          // const split = address_weekday.split(" ");
          const tempObj = {
            address: groupAddressWeekWiseSummary[address_weekday]["address"],
            weekday: groupAddressWeekWiseSummary[address_weekday]["weekday"],
            crimes: groupAddressWeekWiseSummary[address_weekday]["crimes"],
            x_coordinate:
              groupAddressWeekWiseSummary[address_weekday]["x_coordinate"] / 10000,
            y_coordinate:
              groupAddressWeekWiseSummary[address_weekday]["y_coordinate"] / 10000,
            latitude: groupAddressWeekWiseSummary[address_weekday]["latitude"],
            longitude: groupAddressWeekWiseSummary[address_weekday]["longitude"],
          };
          groupAddressWeekResultSet.push(tempObj);
        }

        var prevYear = 0;
        var currYear = 0;
        var prevYear_crimes = 0;
        const changeResultSet = [];

        for (let record of yearResultSet) {
          if (prevYear !== 0) {
            currYear = record.year;
            const currObj = {
              prevYear: prevYear,
              currYear: currYear,
              prevYear_crimes: prevYear_crimes,
              currYear_crimes: record.crimes,
            };
            changeResultSet.push(currObj);
            prevYear = currYear;
            prevYear_crimes = record.crimes;
          } else {
            prevYear = record.year;
            prevYear_crimes = record.crimes;
          }
        }

        const summaryData = {
          yearWiseData: yearResultSet,
          monthWiseData: monthResultSet,
          weekdayWiseData: weekdayResultSet,
          addressWiseData: addressResultSet,
          streetWiseData: streetResultSet,
          changeYearWiseData: changeResultSet,
          groupAddressWeekWiseData: groupAddressWeekResultSet.sort(
            (a, b) => parseFloat(a.year) - parseFloat(b.year)
          ),
        };

        ym_bar_margin = { top: 50, right: 0, bottom: 30, left: 80 };

        ym_bar_height = 600;
        width = window.innerWidth;

        ym_bar_xScale = d3
          .scaleBand()
          .domain(summaryData.monthWiseData.map((d) => d.month))
          .range([ym_bar_margin.left, width - ym_bar_margin.right])
          .padding(0.1);

        ym_bar_yScale = d3
          .scaleLinear()
          .domain([0, d3.max(summaryData.monthWiseData, (d) => d.crimes)])
          .nice()
          .range([ym_bar_height - ym_bar_margin.bottom, ym_bar_margin.top]);

        const svg = d3.create("svg").attr("viewBox", [0, 0, width, ym_bar_height]);

        const makeYLines = () => d3.axisLeft().scale(ym_bar_yScale);

        svg
          .append("g")
          .attr("transform", `translate(0 , ${ym_bar_height - ym_bar_margin.bottom})`)
          .call(d3.axisBottom(ym_bar_xScale).tickSizeOuter(4));

        svg
          .append("g")
          .attr("transform", `translate(${ym_bar_margin.left}, 0)`)
          .call(d3.axisLeft(ym_bar_yScale));

        svg
          .append("g")
          .attr("class", "grid")
          .attr("transform", `translate(${ym_bar_margin.left}, 0)`)
          .call(
            makeYLines()
              .tickSize(-width - ym_bar_margin.right - ym_bar_margin.left, 0, 0)
              .tickFormat("")
          );

        const barGroups = svg
          .selectAll()
          .data(summaryData.monthWiseData)
          .enter()
          .append("g");

        barGroups
          .append("rect")
          .attr("class", "bar")
          .attr("x", (d) => ym_bar_xScale(d.month) + 20)
          .attr("y", (d) => ym_bar_yScale(d.crimes))
          .attr("fill", "DarkGray")
          .attr(
            "height",
            (d) => ym_bar_height - ym_bar_margin.bottom - ym_bar_yScale(d.crimes)
          )
          .attr("width", ym_bar_xScale.bandwidth() - 40)
          .on("mouseenter", function (actual, i) {
            d3.selectAll(".value").attr("opacity", 0);

            d3.select(this)
              .transition()
              .duration(300)
              .attr("opacity", 0.6)
              .attr("x", (d) => ym_bar_xScale(d.month) + 10)
              .attr("width", ym_bar_xScale.bandwidth() - 20);

            const y = ym_bar_yScale(i.crimes);

            const line = svg
              .append("line")
              .attr("id", "limit")
              .attr("stroke", "HotPink")
              .style("stroke-dasharray", "5 5")
              .style("stroke-width", "2px")
              .attr("x1", ym_bar_margin.left)
              .attr("y1", y)
              .attr("x2", (width - ym_bar_margin.right) * 2)
              .attr("y2", y);

            barGroups
              .append("text")
              .attr("class", "divergence")
              .attr(
                "x",
                (d) => ym_bar_xScale(d.month) + ym_bar_xScale.bandwidth() / 2
              )
              .attr("y", (d) => ym_bar_yScale(d.crimes) - 5)
              .style("font-size", "15px")
              .attr("fill", "HotPink")
              .style("font-weight", "bold")
              .attr("text-anchor", "middle")
              .text((a, idx) => {
                const diff_crimes = a.crimes - i.crimes;
                const divergence = ((diff_crimes / i.crimes) * 100).toFixed(
                  2
                );

                let text = "";
                if (divergence > 0) text += "+";
                text += `${divergence}%`;

                // i - object - current selection - crimes and month
                // a - not cureent bars - crimes and month
                // idx -  index
                // actual - object, MouseEvent

                return i.month !== a.month ? text : "";
              });
          })
          .on("mouseleave", function () {
            d3.selectAll(".value").attr("opacity", 1);

            d3.select(this)
              .transition()
              .duration(300)
              .attr("opacity", 1)
              .attr("x", (d) => ym_bar_xScale(d.month) + 20)
              .attr("width", ym_bar_xScale.bandwidth() - 40);

            svg.selectAll("#limit").remove();
            svg.selectAll(".divergence").remove();
          });

        barGroups
          .append("text")
          .attr("class", "value")
          .attr("x", (d) => ym_bar_xScale(d.month) + ym_bar_xScale.bandwidth() / 2)
          .attr("y", (d) => ym_bar_yScale(d.crimes) - 5)
          .style("font-size", "15px")
          .style("font-weight", "bold")
          .attr("text-anchor", "middle")
          .text((d) => `${d.crimes}`);

        svg
          .append("text")
          .attr("class", "label")
          .attr("x", -(ym_bar_height - ym_bar_margin.bottom - ym_bar_margin.top) / 2)
          .attr("y", ym_bar_margin.bottom + ym_bar_margin.top / 100)
          .attr("transform", "rotate(-90)")
          .attr("text-anchor", "middle")
          .text("crimes");

        // svg.append('text')
        //   .attr('class', 'label')
        //   .attr('x', -((width - ym_bar_margin.right - ym_bar_margin.left) / 20))
        //   .attr('y', ym_bar_margin.bottom)
        //   .attr('text-anchor', 'middle')
        //   .text('Months')
        ym_BarChart = svg.node();

        document.querySelector(".ques3").appendChild(ym_BarChart);

        width = window.innerWidth / 2;

        wmy_scatter_margin = { top: 10, right: 20, bottom: 50, left: 105 };

        wmy_scatter_visWidth = 400;

        wmy_scatter_visHeight = 400;

        wmy_scatter_origins = Array.from(
          new Set(summaryData.groupAddressWeekWiseData.map((d) => d.weekday))
        );

        wmy_scatter_weekColor = d3
          .scaleOrdinal()
          .domain(wmy_scatter_origins)
          .range(d3.schemeCategory10);

        wmy_scatter_xScale = d3
          .scaleLinear()
          .domain(
            d3.extent(summaryData.groupAddressWeekWiseData, (d) => d.x_coordinate)
          )
          .nice()
          .range([0, wmy_scatter_visWidth]);

        wmy_scatter_yScale = d3
          .scaleLinear()
          .domain(
            d3.extent(summaryData.groupAddressWeekWiseData, (d) => d.y_coordinate)
          )
          .nice()
          .range([wmy_scatter_visHeight, 0]);

        wmy_scatter_xAxis = (g, scale, label) =>
          g
            .attr("transform", `translate(0, ${wmy_scatter_visHeight})`)
            .call(d3.axisBottom(scale))
            .call((g) => g.select(".domain").remove())
            .call((g) =>
              g
                .selectAll(".tick line")
                .clone()
                .attr("stroke", "#d3d3d3")
                .attr("y1", -wmy_scatter_visHeight)
                .attr("y2", 0)
            )
            .append("text")
            .attr("x", wmy_scatter_visWidth / 2)
            .attr("y", 40)
            .attr("fill", "black")
            .attr("text-anchor", "middle")
            .text(label);

        wmy_scatter_yAxis = (g, scale, label) =>
          g
            .call(d3.axisLeft(scale))
            .call((g) => g.select(".domain").remove())
            .call((g) =>
              g
                .selectAll(".tick line")
                .clone()
                .attr("stroke", "#d3d3d3")
                .attr("x1", 0)
                .attr("x2", wmy_scatter_visWidth)
            )
            .append("text")
            .attr("x", -40)
            .attr("y", wmy_scatter_visHeight / 2)
            .attr("fill", "black")
            .attr("dominant-baseline", "middle")
            .text(label);

        function wmy_brushableScatterplot() {
          const value = summaryData.groupAddressWeekWiseData;
          const svg = d3
            .create("svg")
            .attr(
              "width",
              wmy_scatter_visWidth +
                wmy_scatter_margin.left +
                wmy_scatter_margin.right
            )
            .attr(
              "height",
              wmy_scatter_visHeight +
                wmy_scatter_margin.top +
                wmy_scatter_margin.bottom
            )
            .property("value", value);

          const g = svg
            .append("g")
            .attr(
              "transform",
              `translate(${wmy_scatter_margin.left}, ${wmy_scatter_margin.top})`
            );

          g.append("g").call(wmy_scatter_xAxis, wmy_scatter_xScale, "X Coordinate");
          g.append("g").call(wmy_scatter_yAxis, wmy_scatter_yScale, "Y Coordinate");

          const dots = g
            .selectAll("circle")
            .data(summaryData.groupAddressWeekWiseData.filter((d) => d.weekday))
            .join("circle")
            .attr("cx", (d) => wmy_scatter_xScale(d.x_coordinate))
            .attr("cy", (d) => wmy_scatter_yScale(d.y_coordinate))
            .attr("r", 8)
            .attr("fill", (d) => wmy_scatter_weekColor(d.weekday))
            .attr("opacity", 0.3);

          //   data_1 = summaryData.groupAddressWeekWiseData.filter((d) => d.weekday)
          //   console.log("data_1:", data_1)
          
          // for(let i = 0; i < data_1.length; i++){
          //   console.log("wmy_scatter_xScale(d.x_coordinate)", wmy_scatter_xScale(data_1[i].x_coordinate))
          // }

          const brush = d3
            .brush()
            .extent([
              [0, 0],
              [wmy_scatter_visWidth, wmy_scatter_visHeight],
            ])
            .on("brush", onBrush)
            .on("end", onEnd);

          g.append("g").call(brush);

          function onBrush(event) {
            const [[x1, y1], [x2, y2]] = event.selection;

            function isBrushed(d) {
              const cx = wmy_scatter_xScale(d.x_coordinate);
              const cy = wmy_scatter_yScale(d.y_coordinate);
              return cx >= x1 && cx <= x2 && cy >= y1 && cy <= y2;
            }

            dots.attr("fill", (d) =>
              isBrushed(d) ? wmy_scatter_weekColor(d.weekday) : "gray"
            );

            svg
              .property(
                "value",
                summaryData.groupAddressWeekWiseData.filter(isBrushed)
              )
              .dispatch("input");
          }

          function onEnd(event) {
            if (event.selection == null) {
              dots.attr("fill", (d) => wmy_scatter_weekColor(d.weekday));
              svg.property("value", value).dispatch("input");
            }
          }

          return svg.node();
        }

        function wmy_barChart() {
          const wmy_bar_margin = { top: 10, right: 20, bottom: 50, left: 70 };
          const wmy_bar_visWidth = 400;
          const wmy_bar_visHeight = 400;

          const svg = d3
            .create("svg")
            .attr(
              "width",
              wmy_bar_visWidth + wmy_bar_margin.left + wmy_bar_margin.right
            )
            .attr(
              "height",
              wmy_bar_visHeight + wmy_bar_margin.top + wmy_bar_margin.bottom
            );

          const g = svg
            .append("g")
            .attr(
              "transform",
              `translate(${wmy_bar_margin.left}, ${wmy_bar_margin.top})`
            );

          const wmy_bar_yScale = d3
            .scaleLinear()
            .range([wmy_bar_margin.top, wmy_bar_visHeight]);

          const wmy_bar_xScale = d3
            .scaleBand()
            .domain(wmy_scatter_weekColor.domain())
            .range([0, wmy_bar_visWidth])
            .padding(0.2);

          const xAxis = d3.axisBottom(wmy_bar_xScale).tickSizeOuter(0);

          const xAxisGroup = g
            .append("g")
            .attr("transform", `translate(0, ${wmy_bar_visWidth})`);
          const yAxis = d3.axisLeft(wmy_bar_yScale);

          const yAxisGroup = g.append("g").call(yAxis);

          const yAxis_2 = d3.axisLeft(wmy_bar_yScale);

          const yAxisGroup_2 = g.append("g").call(yAxis_2);

          yAxisGroup
            .append("text")
            .attr(
              "x",
              -(wmy_bar_visWidth - wmy_bar_margin.bottom - wmy_bar_margin.top) / 2
            )
            .attr("y", wmy_bar_margin.bottom + wmy_bar_margin.top - 120)
            .attr("fill", "black")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .style("font-size", "10px")
            .text("crimes");

          let barsGroup = g.append("g");

          function update(data) {
            const weekdayCounts = d3.rollup(
              data,
              (group) => d3.sum(group, (d) => d.crimes),
              (d) => d.weekday
            );

            wmy_bar_yScale.domain([d3.max(weekdayCounts.values()), 0]).nice();

            const makeYLines = () => d3.axisLeft().scale(wmy_bar_yScale);

            const t = svg.transition().ease(d3.easeLinear).duration(100);
            const t_2 = svg.transition().ease(d3.easeLinear).duration(100);

            yAxisGroup.transition(t).call(yAxis);
            yAxisGroup_2
              .transition(t_2)
              .attr("transform", `translate(0, 0)`)
              .call(
                makeYLines()
                  .tickSize(-width - wmy_bar_margin.right - wmy_bar_margin.left, 0, 0)
                  .tickFormat("")
              );
            xAxisGroup.transition(t).call(xAxis);

            barsGroup
              .selectAll("rect")
              .data(weekdayCounts, ([weekday, count]) => weekday)
              .join("rect")
              .attr("fill", ([weekday, count]) => wmy_scatter_weekColor(weekday))
              .attr(
                "height",
                ([weekday, count]) => wmy_bar_visHeight - wmy_bar_yScale(count)
              )
              .attr("x", ([weekday, count]) => wmy_bar_xScale(weekday))
              .attr("y", ([weekday, count]) => wmy_bar_yScale(count))
              .transition(t)
              .attr("width", wmy_bar_xScale.bandwidth());
          }

          return Object.assign(svg.node(), { update });
        }

        const scatter = wmy_brushableScatterplot();
        const bar = wmy_barChart();

        d3.select(scatter).on("input", () => {
          bar.update(scatter.value);
        });

        bar.update(scatter.value);

        document.querySelector(".linkedview > .scatter").appendChild(scatter);
        document.querySelector(".linkedview > .plot").appendChild(bar);


      };

      main();
  };
});

// Label on Y - Axis
// Set Dynamic Y - Scale
d3.csv("data/crimes_datewise.csv").then( function(data) {

  var svg_width = 960;
  var svg_height = 500;
  var svg_focusContext = d3.select("svg"),
      focusContext_margin = {top: 20, right: 20, bottom: 110, left: 40},
      focusContext_margin2 = {top: 430, right: 20, bottom: 30, left: 40},
      focusContext_width = svg_width - focusContext_margin.left - focusContext_margin.right,
      focusContext_height = svg_height - focusContext_margin.top - focusContext_margin.bottom,
      focusContext_height2 = svg_height - focusContext_margin2.top - focusContext_margin2.bottom;

  data.forEach(function(d) {
    d.date = new Date(d.date);
    d.close = +d.close;
  });

  var focusContext_x = d3.scaleTime().range([0, focusContext_width]),
      focusContext_x2 = d3.scaleTime().range([0, focusContext_width]),
      focusContext_y = d3.scaleLinear().range([focusContext_height, 0]),
      focusContext_y2 = d3.scaleLinear().range([focusContext_height2, 0]);

  var focusContext_xAxis = d3.axisBottom(focusContext_x),
      focusContext_xAxis2 = d3.axisBottom(focusContext_x2),
      focusContext_yAxis = d3.axisLeft(focusContext_y);

  var focusContext_brush = d3.brushX()
      .extent([[0, 0], [focusContext_width, focusContext_height2]])
      .on("brush end", brushed);

  var focusContext_zoom = d3.zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([[0, 0], [focusContext_width, focusContext_height]])
      .extent([[0, 0], [focusContext_width, focusContext_height]])
      .on("zoom", zoomed);

  var area = d3.area()
      .curve(d3.curveMonotoneX)
      .x(function(d) { return focusContext_x(d.date); })
      .y0(focusContext_height)
      .y1(function(d) { return focusContext_y(d.price); });

  var area2 = d3.area()
      .curve(d3.curveMonotoneX)
      .x(function(d) { return focusContext_x2(d.date); })
      .y0(focusContext_height2)
      .y1(function(d) { return focusContext_y2(d.price); });

  svg_focusContext.append("defs").append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", focusContext_width)
      .attr("height", focusContext_height);

  var focusContext_focus = svg_focusContext.append("g")
      .attr("class", "focus")
      .attr("transform", "translate(" + focusContext_margin.left + "," + focusContext_margin.top + ")");

  var context = svg_focusContext.append("g")
      .attr("class", "context")
      .attr("transform", "translate(" + focusContext_margin2.left + "," + focusContext_margin2.top + ")");


  focusContext_x.domain(d3.extent(data, function(d) { return d.date; }));
  focusContext_y.domain([0, d3.max(data, function(d) { return d.price; }) * 1.5]);
  focusContext_x2.domain(focusContext_x.domain());
  focusContext_y2.domain(focusContext_y.domain());
  

  focusContext_focus.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area);

  focusContext_focus.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + focusContext_height + ")")
      .call(focusContext_xAxis);

  focusContext_focus.append("g")
      .attr("class", "axis axis--y")
      .call(focusContext_yAxis);

  focusContext_focus
    .append("text")
    .attr("class", "label")
    .attr("x", -(focusContext_height - focusContext_margin.bottom - focusContext_margin.top) / 600)
    .attr("y", focusContext_margin.bottom / 300)
    // .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .text("crimes ↑");

  

  context.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area2);

  context.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + focusContext_height2 + ")")
      .call(focusContext_xAxis2);

  context.append("g")
      .attr("class", "brush")
      .call(focusContext_brush)
      .call(focusContext_brush.move, focusContext_x.range());

  svg_focusContext.append("rect")
      .attr("class", "zoom")
      .attr("width", focusContext_width)
      .attr("height", focusContext_height)
      .attr("transform", "translate(" + focusContext_margin.left + "," + focusContext_margin.top + ")")
      .call(focusContext_zoom);

      function brushed(e, d) {
        if (e.sourceEvent && e.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
        var s = e.selection || focusContext_x2.range();
        focusContext_x.domain(s.map(focusContext_x2.invert, focusContext_x2));
        focusContext_focus.select(".area").attr("d", area);
        focusContext_focus.select(".axis--x").call(focusContext_xAxis);
        // svg_focusContext.select(".zoom").call(zoom.transform, d3.zoomIdentity
        //     .scale(focusContext_width / (s[1] - s[0]))
        //     .translate(-s[0], 0));
      }
      
      function zoomed(e, d) {
        if (e.sourceEvent && e.sourceEvent.type === "brush") return; // ignore zoom-by-brush
        var t = e.transform;
        focusContext_x.domain(t.rescaleX(focusContext_x2).domain());
        // console.log("d", focusContext_x.domain()[0])
        // new_data = [];
        // for(let i = 0; i < data.length; i++) {
        //   if(data[i].date >= focusContext_x.domain()[0] && data[i].date <= focusContext_x.domain()[1]){
        //     new_data.push(data);
        //   }
        // }
        // console.log(new_data.length)
        // focusContext_y.domain([0, d3.max(new_data, function(d) { return d.price; })]);
        focusContext_focus.select(".area").attr("d", area);
        focusContext_focus.select(".axis--x").call(focusContext_xAxis);
        // focusContext_focus.select(".axis--y").call(focusContext_yAxis);
        context.select(".brush").call(focusContext_brush.move, focusContext_x.range().map(t.invertX, t));
      }
});




