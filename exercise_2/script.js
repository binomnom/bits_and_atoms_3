const column_count = 25;
const space_between = 0;
const min_radius = 3;


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
    const annual_precipitation = compiled_data.map(i => i.annual_precipitation);
    const future_annual_precipitation = compiled_data.map(i => i.future_annual_precipitation);

    const max_annual_precipitation = max(annual_precipitation);
    const max_future_precipitation = max(future_annual_precipitation);
    const max_precipitation = max_future_precipitation > max_annual_precipitation ? max_future_precipitation : max_annual_precipitation;

    const min_annual_precipitation = min(annual_precipitation);
    const min_future_precipitation = min(future_annual_precipitation);
    const min_precipitation = min_future_precipitation < min_annual_precipitation ? min_future_precipitation : min_annual_precipitation;

    const d3_element = document.getElementById("d3");
    const area_width = parseInt(getComputedStyle(d3_element).width);
    const datum_max_radius = (area_width - ((column_count - 1) * space_between)) / (column_count * 2);
    const row_count = Math.ceil(compiled_data.length / column_count);
    const area_height = datum_max_radius * row_count * 2 + space_between * (row_count - 1);

    const interpolator = d3.interpolateRgb("grey", "pink");
    const svg = d3
        .select("#d3")
        .append("svg")
        .attr("width", area_width)
        .attr("height", area_height);

    const selection = svg
        .selectAll("g")
        .data(compiled_data)
        .enter()
        .append("g");

    selection
        .append("circle")
        .attr("fill", d => {
            p = map(d.annual_precipitation, min_precipitation, max_precipitation, 0, 1);
            return interpolator(p);
        })
        .attr("cx", (d, index) => {
            var x_pos = datum_max_radius + (index % column_count) * (2 * datum_max_radius + space_between);
            return x_pos;
        })
        .attr("cy", (d, index) => {
            var row = Math.floor(index / column_count);
            return datum_max_radius + row * (2 * datum_max_radius + space_between);
        })
        .attr("r", (d) => {
            return map(d.annual_precipitation, min_precipitation, max_precipitation, min_radius, datum_max_radius);
        });


    svg
        .selectAll("circle")
        .on("mouseover", function () {
            d3.select(this).attr("r", (d) => {
                return map(d.future_annual_precipitation, min_precipitation, max_precipitation, min_radius, datum_max_radius);
            });
            d3.select(this).attr("fill", d => {
                p = map(d.annual_precipitation, min_precipitation, max_precipitation, 0, 1);
                return interpolator(p);
            });
        })
        .on("mouseout", function () {
            d3.select(this).attr("r", (d) => {
                return map(d.annual_precipitation, min_precipitation, max_precipitation, min_radius, datum_max_radius);
            });
            d3.select(this).attr("fill", d => {
                p = map(d.annual_precipitation, min_precipitation, max_precipitation, 0, 1);
                return interpolator(p);
            });
        })
}


init();


function map(value, in_min, in_max, out_min, out_max) {
    return ((value - in_min) * (out_max - out_min)) / (in_max - in_min);
}

// thank you jonas :)
function max(obj) {
    let m = 0;

    obj.forEach((element) => {
        m = element > m ? element : m;
    });

    return m;
}

function min(obj) {
    let m = 0;

    obj.forEach((element) => {
        m = element < m ? element : m;
    });

    return m;
}