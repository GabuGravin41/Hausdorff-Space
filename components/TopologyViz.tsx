import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const TopologyViz: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<any, undefined>>(undefined);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    svg.selectAll("*").remove();

    // Data for two distinct points with velocity properties
    const points = [
      { id: 'x', x: width / 3, y: height / 2, color: '#e5e5e5', label: 'x', vx: 0, vy: 0 },
      { id: 'y', x: (width / 3) * 2, y: height / 2, color: '#e5e5e5', label: 'y', vx: 0, vy: 0 }
    ];

    // Simulation forces: Charge, center, and collision
    const simulation = d3.forceSimulation(points as any)
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(120))
      .velocityDecay(0.4);

    simulationRef.current = simulation;

    // Draw Neighborhoods (Open Sets U and V)
    const neighborhoods = svg.append("g")
      .attr("class", "neighborhoods")
      .selectAll("circle")
      .data(points)
      .enter()
      .append("circle")
      .attr("r", 100) 
      .attr("fill", "rgba(99, 102, 241, 0.05)")
      .attr("stroke", "rgba(99, 102, 241, 0.4)")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "8,4")
      .style("pointer-events", "none");

    // Draw Nodes
    const nodeGroups = svg.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(points)
      .enter()
      .append("g")
      .attr("cursor", "grab")
      .call(d3.drag<SVGGElement, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Invisible larger hit area for easier interaction
    nodeGroups.append("circle")
      .attr("r", 40)
      .attr("fill", "transparent");

    nodeGroups.append("circle")
      .attr("r", 6)
      .attr("fill", d => d.color);

    nodeGroups.append("text")
      .attr("dx", 18)
      .attr("dy", 6)
      .text(d => d.label)
      .attr("fill", "#6366f1")
      .attr("font-family", "serif")
      .attr("font-style", "italic")
      .attr("font-size", "28px")
      .style("opacity", 0.8);
      
    // Connecting line (dashed, to show separation distance)
    const linkLine = svg.append("line")
       .attr("stroke", "rgba(255, 255, 255, 0.05)")
       .attr("stroke-width", 1)
       .attr("stroke-dasharray", "4,4");

    simulation.on("tick", () => {
      // Boundary constraints with gentle elastic bounce
      points.forEach(p => {
        if (p.x < 100) p.vx += 0.5;
        if (p.x > width - 100) p.vx -= 0.5;
        if (p.y < 100) p.vy += 0.5;
        if (p.y > height - 100) p.vy -= 0.5;
      });

      linkLine
        .attr("x1", points[0].x)
        .attr("y1", points[0].y)
        .attr("x2", points[1].x)
        .attr("y2", points[1].y);

      neighborhoods
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);

      nodeGroups
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Intersection Observer for Sleep Mode
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          simulation.alpha(0.3).restart();
        } else {
          simulation.stop();
        }
      });
    }, { threshold: 0.1 });

    if (containerRef.current) observer.observe(containerRef.current);

    // Autonomous drift: Randomly nudge the simulation
    const driftInterval = setInterval(() => {
      points.forEach(p => {
        p.vx += (Math.random() - 0.5) * 1.5;
        p.vy += (Math.random() - 0.5) * 1.5;
      });
      simulation.alpha(0.1).restart();
    }, 2000);

    // Mouse repulsion logic
    const handlePointerMove = (e: PointerEvent) => {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      
      points.forEach(p => {
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 250) {
          const force = (250 - dist) / 250;
          p.vx += (dx / dist) * force * 2;
          p.vy += (dy / dist) * force * 2;
          simulation.alpha(0.1).restart();
        }
      });
    };
    window.addEventListener('pointermove', handlePointerMove);

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    const handleResize = () => {
         simulation.force("center", d3.forceCenter(svgRef.current!.clientWidth / 2, svgRef.current!.clientHeight / 2));
         simulation.alpha(0.5).restart();
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
        simulation.stop();
        clearInterval(driftInterval);
        observer.disconnect();
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('pointermove', handlePointerMove);
    }

  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

export default TopologyViz;