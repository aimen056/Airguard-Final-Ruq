
import { useEffect, useMemo, useState, useRef } from "react";
import * as d3 from "d3";

const MARGIN = { top: 10, right: 10, bottom: 30, left: 40 };

const Heatmap = ({ data }) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 700, height: 400 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height: width * 0.6 }); // Maintain aspect ratio
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const { width, height } = dimensions;
  const boundsWidth = width - MARGIN.left - MARGIN.right;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const allYGroups = useMemo(() => [...new Set(data.map((d) => d.y))], [data]);
  const allXGroups = useMemo(() => [...new Set(data.map((d) => d.x))], [data]);

  const xScale = useMemo(() => d3.scaleBand().range([0, boundsWidth]).domain(allXGroups).padding(0.05), [data, width]);
  const yScale = useMemo(() => d3.scaleBand().range([boundsHeight, 0]).domain(allYGroups).padding(0.05), [data, height]);

  const [min, max] = d3.extent(data.map((d) => d.value));
  if (!min || !max) return null;

  const colorScale = d3.scaleSequential().interpolator(d3.interpolateInferno).domain([min, max]);

  const allRects = data.map((d, i) => (
    <rect
      key={i}
      x={xScale(d.x)}
      y={yScale(d.y)}
      width={xScale.bandwidth()}
      height={yScale.bandwidth()}
      fill={colorScale(d.value)}
      rx={5}
      stroke="white"
    />
  ));

  const xLabels = allXGroups.map((name, i) => (
    <text className="text-primaryText" key={i} x={xScale(name) + xScale.bandwidth() / 2} y={boundsHeight + 20} textAnchor="middle" fontSize={Math.max(10, width * 0.02)}>
      {name}
    </text>
  ));

  const yLabels = allYGroups.map((name, i) => (
    <text key={i} x={-10} y={yScale(name) + yScale.bandwidth() / 2} textAnchor="end" fontSize={Math.max(10, width * 0.02)}>
      {name}
    </text>
  ));

  return (
    <div ref={containerRef} style={{ width: "100%", height: "auto" }}>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          {allRects}
          {xLabels}
          {yLabels}
        </g>
      </svg>
    </div>
  );
};

export default Heatmap;
