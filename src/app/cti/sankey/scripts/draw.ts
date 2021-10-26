import { Model } from './model';
import * as d3 from 'd3';
import { Chart, Line } from './chart';
import { data } from './data';

export const draw = (element: HTMLElement) => {
  const { width, height } = d3.select(element).node().getBoundingClientRect();
  const w = (width * 98) / 100;
  const h = (height * 90) / 100;
  const svg: any = d3
    .select(element)
    .append('svg')
    .attr('width', width)
    .attr('height', height);
  const model = new Model(data);
  const chart = new Chart(model, w, h);
  const markerWidth = chart.getMarkerWidth();

  svg
    .append('svg:defs')
    .selectAll('marker')
    .data(chart.getLines())
    .enter()
    .append('svg:marker')
    .attr('id', (d: Line) => `arrow${d.id}`)
    .attr('refX', 0.27)
    .attr('refY', 0)
    .attr('markerWidth', markerWidth)
    .attr('markerHeight', (d: Line) => `${d.width}`)
    .attr('orient', 'auto')
    .attr('markerUnits', 'userSpaceOnUse')
    .attr('viewBox', (d: Line) => `0 0 ${markerWidth} 1`)
    .append('svg:path')
    .attr('fill', (d: any) => d.color)
    .attr('stroke', 'none')
    .attr('stroke-width', 0)
    .attr(
      'd',
      (d: Line) => `M0,-${d.width / 2}L${markerWidth},0L0,${d.width / 2}`
    );

  svg
    .selectAll('path.big-line')
    .data(chart.getLines())
    .enter()
    .append('path')
    .attr('id', (d: any) => `big-line${d.id}`)
    .attr('d', (d: Line) => `M${d.line[0]} Q${d.line[1]} ${d.line[2]}`)
    .attr('stroke-width', (d: Line) => d.width)
    .attr('fill', 'none')
    .attr('stroke', (d: any) => d.color)
    .attr('class', 'big-line')
    .attr('marker-end', (d: Line) => (d.marker ? `url(#arrow${d.id})` : null)); // attach the arrow from defs

  svg
    .selectAll('text.big-line-name')
    .data(chart.getLines())
    .enter()
    .append('text')
    .attr('dy', (d: any) => (d.subTitle ? -3 : 3))
    .attr('dx', 0)
    .attr('class', 'big-line-name')
    .append('textPath')
    .attr('xlink:href', (d: any) => `#big-line${d.id}`)
    .style('text-anchor', 'middle')
    .attr('stroke', (d: any) => d.nameColor)
    .attr('startOffset', '50%')
    .attr('font-size', `${width * 0.018}px`)
    .text((d: any) => `${d.name}`);

  // svg
  //   .selectAll('text.big-line-sub-title')
  //   .data(chart.getLines().filter(line => !!line.subTitle))
  //   .enter()
  //   .append('text')
  //   .attr('dy', 20)
  //   .attr('dx', 0)
  //   .attr('class', 'big-line-sub-title')
  //   .append('textPath')
  //   .attr('xlink:href', (d: any) => `#big-line${d.id}`)
  //   .style('text-anchor', 'middle')
  //   .attr('startOffset', '50%')
  //   .attr('stroke', (d: any) => d.subTitleColor)
  //   .attr('stroke-width', 0.5)
  //   .attr('font-size', `${width * 0.015}px`)
  //   .text((d: any, i: number) => `${d.subTitle}`);

  svg
    .selectAll('path.inner-rect')
    .data([chart.getInnerRectPoints()])
    .enter()
    .append('path')
    .attr(
      'd',
      (d: number[][]) => `M${d[0]} L${d[1]} L${d[2]} L${d[3]} L${d[0]}`
    )
    .attr('stroke-width', (d: Line) => 1)
    .attr('fill', 'rgba(255,255,255,0.35)')
    .attr('stroke', 'rgba(0,0,0,1)')
    .attr('class', 'inner-rect');

  // svg
  //   .append('svg:defs')
  //   .selectAll('marker.diagonal')
  //   .data(chart.getDiagonalData())
  //   .enter()
  //   .append('svg:marker')
  //   .attr('id', (d: any) => `arrowhead${d.id}`)
  //   .attr('refX', 10)
  //   .attr('refY', 0)
  //   .attr('markerWidth', 7)
  //   .attr('markerHeight', 7)
  //   .attr('orient', 'auto')
  //   .attr('xoverflow', 'visible')
  //   .attr('viewBox', '-0 -5 10 10')
  //   .append('svg:path')
  //   .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
  //   .attr('stroke', (d: any) => d.color)
  //   .attr('fill', 'none');

  // svg
  //   .append('svg:defs')
  //   .selectAll('marker.diagonal-dot')
  //   .data(chart.getDiagonalData())
  //   .enter()
  //   .append('svg:marker')
  //   .attr('id', (d: any) => `arrowhead-dot${d.id}`)
  //   .attr('refX', 0)
  //   .attr('refY', 0)
  //   .attr('markerWidth', 3)
  //   .attr('markerHeight', 3)
  //   .attr('orient', 'auto')
  //   .attr('xoverflow', 'visible')
  //   .attr('viewBox', '-5 -5 10 10')
  //   .append('svg:circle')
  //   .attr('r', 5)
  //   .attr('stroke', (d: any) => d.color)
  //   .attr('fill', (d: any) => d.color);

  // const link = d3
  //   .linkHorizontal()
  //   .x(function(d: any) {
  //     return d.x;
  //   })
  //   .y(function(d: any) {
  //     return d.y;
  //   });
  // svg
  //   .selectAll('path.diagonal')
  //   .data(chart.getDiagonalData())
  //   .enter()
  //   .append('path')
  //   .attr('d', (d: any) => link(d))
  //   .style('fill', 'none')
  //   .style('stroke-width', '1px')
  //   .attr('class', 'diagonal')
  //   .attr('stroke', (d: any) => d.color)
  //   .attr('id', (d: any, i: number) => `diagonal${i}`)
  //   .attr('marker-end', (d: any) => `url(#arrowhead${d.id})`)
  //   .attr('marker-start', (d: any) => `url(#arrowhead-dot${d.id})`);

  // svg
  //   .selectAll('text.diagonal')
  //   .data(chart.getDiagonalData())
  //   .enter()
  //   .append('text')
  //   .attr('dy', -2)
  //   .attr('dx', -20)
  //   .attr('class', 'diagonal')
  //   .attr('stroke', (d: any) => d.color)
  //   .attr('stroke-width', 0.5)
  //   .append('textPath')
  //   .attr('xlink:href', (d: any, i: number) => `#diagonal${i}`)
  //   .style('text-anchor', 'middle')
  //   .attr('startOffset', '50%')
  //   .attr('font-size', `${width * 0.013}px`)
  //   .text((d: any) => `${d.percent}%`);

  // svg
  //   .selectAll('text.inner-rect-bottom')
  //   .data(chart.getInnerRectTexts())
  //   .enter()
  //   .append('text')
  //   .attr('y', (d: any) => d.y)
  //   .attr('x', (d: any) => d.x)
  //   .attr('font-size', `${width * 0.014}px`)
  //   .text((d: any) => `${d.text}`);

  // tslint:disable-next-line:no-shadowed-variable
  function wrap(text: any, width: number) {
    text.each(function () {
      // tslint:disable-next-line:no-shadowed-variable
      const text = d3.select(this);
      const words = text.text().split(/\s+/).reverse();
      let word;
      let line: any[] = [];
      let lineNumber = 0;
      const lineHeight = 1.1; // ems
      const y = text.attr('y');
      const x = text.attr('x');
      const dy = 0;
      let tspan = text
        .text(null)
        .append('tspan')
        .attr('x', x)
        .attr('y', y)
        .attr('dy', dy + 'em');
      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(' '));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];
          tspan = text
            .append('tspan')
            .attr('x', x)
            .attr('y', y)
            .attr('dy', ++lineNumber * lineHeight + dy + 'em')
            .text(word);
        }
      }
    });
  }
  // svg
  //   .selectAll('text.right-phrase')
  //   .data([chart.getRightPhrase()])
  //   .enter()
  //   .append('text')
  //   .attr('y', (d: any) => d.y)
  //   .attr('x', (d: any) => d.x)
  //   .attr('font-size', `${width * 0.014}px`)
  //   .text((d: any) => `${d.text}`)
  //   .call(wrap, 50);
};
