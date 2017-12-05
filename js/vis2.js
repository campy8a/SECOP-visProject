      const parseTime = d3.timeParse("%Y");
      const xValue = d => parseTime(d.Year);
      const xLabel = 'Año';
      const yValue = d => d.Counts;
      const yLabel = 'Millones invertidos';
      const colorValue = d=>  d.CIUDAD;
      const colorLabel = 'Ciudades';
      const margin = { left: 120, right: 120, top: 20, bottom: 120 };

      const svg = d3.select("#vis2").append("svg")
        .attr("width", 600)
        .attr("height", 800);
      
      const width = svg.attr('width');
      const height = svg.attr('height');
      const innerWidth = 1000 - margin.left - margin.right;
      const innerHeight = 650 - margin.top - margin.bottom;

      const g = svg.append('g')
          .attr('transform', `translate(${margin.left},${margin.top+50})`);
      const xAxisG = g.append('g')
          .attr('transform', `translate(0, ${innerHeight})`);
      const yAxisG = g.append('g');

      const colorLegendG = g.append('g')
          .attr('transform', `translate(${innerWidth + 100}, 50)`);

      var temp = d3.select('body').append('div')  
        .attr('class', 'tooltip')       
        .style('opacity', 0);
     
      var numberFormat = d3.format(",d");
      
      xAxisG.append('text')
          .attr('class', 'axis-label')
          .attr('x', innerWidth / 2)
          .attr('y', 50)
          .text(xLabel);

      yAxisG.append('text')
          .attr('class', 'axis-label')
          .attr('x', -innerHeight / 2)
          .attr('y', -60)
          .attr('transform', `rotate(-90)`)
          .style('text-anchor', 'middle')
          .text(yLabel);

      colorLegendG.append('text')
          .attr('class', 'legend-label')
          .attr('x', -30)
          .attr('y', -20)
          .text(colorLabel)
          
      
      const xScale = d3.scaleTime();
      const yScale = d3.scaleLinear();
      const rScale = d3.scaleLinear();
      const colorScale = d3.scaleOrdinal()
        .range(d3.schemeCategory10);

      const xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(5)
        .tickPadding(5)
        .tickSize(5);

      const yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(20)
        .tickPadding(15)
        .tickSize(5);
      
      const colorLegend = d3.legendColor()
        .scale(colorScale)
        .shape('circle');

      
      
      d3.csv('../data/proyectos.csv', data => {

        d3.select("#vis2").append('text').text("FILTRO");
        d3.select("#vis2").append('select').attr("id","ciudades").on("change",cambio).attr(x,width);

         d3.select("select").selectAll("option")
              .data(d3.map(data, function(d){return d.CIUDAD;}).keys())
              .enter()
              .append("option")
              .text(function(d){return d;})
              .attr("value",function(d){ return d;});

        xScale
          .domain(d3.extent(data, xValue))
          .range([0, innerWidth])
          .nice();

        yScale
          .domain(d3.extent(data, yValue))
          .range([innerHeight, 0])
          .nice();
        
        rScale
          .domain(d3.extent(data, yValue))
           .range([3, 15])
          .nice();

          //create Basic Circles
        g.selectAll('circle').data(data)
          .enter().append('circle')
          //filtro de datos
         
            .attr('cx', d => xScale(xValue(d)))
            .attr('cy', d => yScale(yValue(d)))
            .attr('fill', d => colorScale(colorValue(d)))
            .attr('Country', d=>d.CIUDAD)
            .attr('r', 5)
            .attr('opacity',1)
            
            //funciones
            .on("click", function(d)
            {
              window.open(d.Link);
            })
            .on("mouseover", function(d) {
            temp.transition()   
                .duration(200)    
                .style("opacity", 1);   
            temp.html("  millones:  $"+numberFormat(parseInt(d.Counts))+"<br/>Fecha entrega:  "+ d.DATE_DUE+ "<br/> Fecha entregado:  "+d.DATE_DELIVERED)  
               .style("left", (d3.event.pageX - 60) + "px")   
               .style("top", (d3.event.pageY + 20) + "px");
            })
            .on("mouseout", function(d) {   
              temp.transition()   
                 .duration(500)   
                .style("opacity", 0); 
              });     


        xAxisG.call(xAxis);
        yAxisG.call(yAxis);
        colorLegendG.call(colorLegend)
          .selectAll('.cell text')
            .attr('dy', '0.1em'); 


      });

        //function EXIT
       
      function cambio()
      {
        
        selectValue = d3.select('select').property('value')
        d3.selectAll('circle').remove();
        d3.selectAll('text.label').remove();

        console.log(selectValue);
         
        colorLegendG.append('text')
          .attr('class', 'label')
          .attr('x', -30)
          .attr('y', function(d,i){ return(i*-20)})
          .text(selectValue)

        d3.csv('proyectos.csv', data => {
          //create Basic Circles
        g.selectAll('circle').data(data)
          .enter().append('circle')
          //filtro de datos
         .filter(function (d){
          // console.log(d.CIUDAD==e);
          return d.CIUDAD == selectValue; })         //})
          //atributos
            .attr('cx', d => xScale(xValue(d)))
            .attr('cy', d => yScale(yValue(d)))
            .attr('fill', d => colorScale(colorValue(d)))
            .attr('Country', d=>d.CIUDAD)
            .attr('fill-opacity', 0.6)
            .attr('r', 5)
            .attr('opacity',1)
            //funciones
            .on("click", function(d)
            {
              window.open(d.Link);
            })
            .on("mouseover", function(d) {
            temp.transition()   
                .duration(200)    
                .style("opacity", 1);   
            temp.html("  millones:  $"+d.Counts+"<br/>Fecha entrega:  "+ d.DATE_DUE+ "<br/> Fecha entregado:  "+d.DATE_DELIVERED)  
               .style("left", (d3.event.pageX - 60) + "px")   
               .style("top", (d3.event.pageY + 20) + "px");
            })
            .on("mouseout", function(d) {   
              temp.transition()   
                 .duration(500)   
                .style("opacity", 0); 
              });     


        xAxisG.call(xAxis);
        yAxisG.call(yAxis);
        colorLegendG.call(colorLegend)
          .selectAll('.cell text')
            .attr('dy', '0.1em'); 


      });


      };