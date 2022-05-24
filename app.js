const DUMMY_DATA = [
  { id: "d1", region: "USA", value: 10 },
  { id: "d2", region: "India", value: 12 },
  { id: "d3", region: "China", value: 11 },
  { id: "d4", region: "Germany", value: 6 },
];
const MARGINS = { top: 20, bottom: 10 };
const CHART_WIDTH = 600;
const CHART_HEIGHT = 400 - MARGINS.top - MARGINS.bottom;

let selectedData = DUMMY_DATA;

const x = d3.scaleBand().rangeRound([0, CHART_WIDTH]).padding(0.1);
const y = d3.scaleLinear().range([CHART_HEIGHT, 0]);

console.log("BandWidth:", x.bandwidth());

const chartContainer = d3
  .select("svg")
  .attr("width", CHART_WIDTH)
  .attr("height", CHART_HEIGHT + MARGINS.top + MARGINS.bottom);

x.domain(DUMMY_DATA.map((d) => d.region));
y.domain([0, d3.max(DUMMY_DATA, (d) => d.value) + 3]);

const chart = chartContainer.append("g");

chart
  .append("g")
  .call(d3.axisBottom(x).tickSizeOuter(0))
  .attr("transform", `translate(0,${CHART_HEIGHT})`)
  .attr("color", "#4f009e");

function renderChart() {
  chart
    .selectAll(".bar")
    .data(selectedData, (data) => data.id)
    .enter()
    .append("rect")
    .classed("bar", true)
    .attr("width", x.bandwidth())
    .attr("height", (data) => CHART_HEIGHT - y(data.value))
    .attr("x", (data) => x(data.region))
    .attr("y", (data) => y(data.value));

  chart
    .selectAll(".bar")
    .data(selectedData, (data) => data.id)
    .exit()
    .remove();

  chart
    .selectAll(".label")
    .data(selectedData)
    .enter()
    .append("text")
    .text((data) => data.value)
    .attr("x", (data) => x(data.region) + x.bandwidth() / 2)
    .attr("y", (data) => y(data.value) - 20)
    .attr("text-anchor", "middle")
    .classed("label", true);

  chart.selectAll(".label").data(selectedData).exit().remove();
}

renderChart();

let unselectedIds = [];

const listItems = d3
  .select("#data")
  .select("ul")
  .selectAll("li")
  .data(DUMMY_DATA)
  .enter()
  .append("li");

listItems.append("span").text((data) => data.region);
listItems
  .append("input")
  .attr("type", "checkbox")
  .attr("checked", true)
  .on("change", (data) => {
    if (unselectedIds.indexOf(data.id) === -1) {
      unselectedIds.push(data.id);
    } else {
      unselectedIds = unselectedIds.filter((id) => id !== data.id);
    }
    selectedData = DUMMY_DATA.filter((d) => unselectedIds.indexOf(d.id) === -1);
    console.log(selectedData);
    renderChart();
  });
