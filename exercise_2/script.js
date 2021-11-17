const column_count = 25;
const space_between = 0;

async function readJson(path) {
    const response = await fetch(path);
    const data = await response.json();
    return data;
}

async function init() {
    const raw_data = await readJson("future_cities_data.json")
    const compiled_data = raw_data.map((d) => {
        return {
            city: d["current_city"],
            climate_like_in: d["future_city_1_source"],
            annual_precipitation: d["Annual_Precipitation"],
            future_annual_precipitation: d["future_Annual_Precipitation"],
        }
    })
    const d3_element = document.getElementById("d3");
    const area_width = parseInt(getComputedStyle(d3_element).width);
    const datum_max_radius = (area_width - ((column_count - 1) * space_between)) / (column_count * 2);
    const row_count = Math.ceil(compiled_data.length / column_count);
    const area_height = datum_max_radius * row_count * 2 + space_between * (row_count - 1);
    // console.log(datum_max_radius);
    // console.log(compiled_data.length);
    // console.log(row_count);

    const svg = d3
        .select("#d3")
        .append("svg")
        .attr("width", area_width)
        .attr("height", area_height);

    const selection = svg
        .selectAll("circle")
        .data(compiled_data)
        .enter();

    selection
        .append("circle")
        .attr("fill", d => {
            return "grey";
        })
        .attr("cx", (d, index) => {
            var x_pos = datum_max_radius + (index % column_count) * (2 * datum_max_radius + space_between);
            return x_pos;
        })
        .attr("cy", (d, index) => {
            var row = Math.floor(index / column_count);
            return datum_max_radius + row * (2 * datum_max_radius + space_between);
        })
        .attr("r", datum_max_radius*0.8);

    svg
    .selectAll("circle")
    .on("mouseover", function () {
        d3.select(this).attr("r", datum_max_radius);
        d3.select(this).attr("fill", "pink");
    })
}


init();