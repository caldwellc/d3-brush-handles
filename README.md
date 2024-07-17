# d3-brush-handles

Library for adding handles to a one-dimensional d3 brush along the x-dimension.

# add to d3 brush in browser
```html
<!DOCTYPE html>
// import d3
<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>
// import brush handles library
<script src="https://cdn.jsdelivr.net/npm/d3-brush-handles@0.0.2"></script>
<html>
    <body>
        <div id="chart-div"></div>
        <script>
            // create chart
            const width = 600;
            const height = 400;
            const svg = d3.select("#chart-div")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g");

            // add x axis
            const x = d3.scaleLinear()
                .domain([0, 2000])
                .range([0, width]);
            
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            // const data = [...];

            // create bins
            const bin = d3.bin()
                .domain(x.domain())
                .thresholds(x.ticks(20));

            const bins = bin(data);
            
            // add y axis
            const y = d3.scaleLinear()
                .domain([0, d3.max(bins, function (d) { return d.length; })])
                .range([height, 0]);

            svg.append("g")
                .call(d3.axisLeft(y));

            // append the bar rectangles to the svg element
            svg.selectAll("rect")
                .data(bins)
                .enter()
                .append("rect")
                .attr("x", 1)
                .attr("transform", function (d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
                .attr("width", function (d) { return x(d.x1) - x(d.x0) - 1; })
                .attr("height", function (d) { return height - y(d.length); })
                .style("fill", "#69b3a2")


            // add a brush container to the chart
            const brushContainer = svg.append("g");

            // create the brush
            const brush = d3.brushX().extent([[0, 0], [width, height]]);
            brushContainer.call(brush);

            // move brush to the initial position
            const initialPosition = [0, 10];
            brushContainer.call(brush.move, initialPosition);

            const handleWidth = 6;
            const handleHeight = 20;

            // add handles to the brush
            window.d3BrushHandles.addHandlesToBrushX(brush, brushContainer, s => s.selection, height, handleWidth, handleHeight, initialPosition);
        </script>
    </body>
</html>
```