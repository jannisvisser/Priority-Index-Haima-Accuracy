function generateDashboard(data,geom){
    var map = new lg.map('#map').geojson(geom).nameAttr('Mun_Name').joinAttr('Mun_Code').zoom(7.6).center([17.5,121.3]);

/*     var priority = new lg.column('#indicator+priority')
                        .label('Priority Index')
                        .axisLabels(false)
                        .valueAccessor(function(d){
                            return +d;
                        })
                        .colorAccessor(function(d,i,max){
                            return +Math.round(d)-1;
                        })
						; */
	
    var pred_abs_category = new lg.column("#prediction+abs_category").label("Predicted damage category (on abs. damages)").axisLabels(false);  
    var pred_abs_damages = new lg.column("#prediction+abs_damage").label("Predicted # Damaged Houses").axisLabels(false);     
    var pred_perc_damages = new lg.column("#prediction+perc_damage").label("Predicted % of Damaged Houses").axisLabels(false);  
    var actual_abs_damages = new lg.column("#actual+abs_damage").label("Actual # Damaged Houses");   
	var actual_perc_damages = new lg.column("#actual+perc_damage").label("Actual % of Damaged Houses").axisLabels(false);
    var diff_abs = new lg.column("#diff+abs").label("Prediction error abs. # of houses").axisLabels(false);
    var diff_perc = new lg.column("#diff+perc").label("Prediction error abs. % of houses").axisLabels(false);
    var diff_gap = new lg.column("#diff+gap").label("Prediction error %").axisLabels(false);
    var diff_category = new lg.column("#diff+category").label("Prediction error % category").axisLabels(false).colors(['#d7191c','#fdae61','#ffffbf','#abd9e9','#2c7bb6']);
	    
    var grid1 = new lg.grid('#grid1')
        .data(data)
        .width($('#grid1').width())
        .height(5000)
        .nameAttr('#adm3+name')
        .joinAttr('#adm3+code')
        .hWhiteSpace(4)
        .vWhiteSpace(4)
        .margins({top: 250, right: 20, bottom: 30, left: 200})
            .columns([pred_abs_category,pred_abs_damages,pred_perc_damages,actual_abs_damages,actual_perc_damages,diff_abs,diff_perc,diff_gap,diff_category])
		;            

    lg.colors(["#ffffb2","#fecc5c","#fd8d3c","#f03b20","#bd0026"]);
	

	
/*     $('#all').on('click',function(){
        lg._gridRegister = [];
        $('#map-container').html('<div id="map"></div>');
        $('#grid1').html('');
        grid1 = new lg.grid('#grid1')
            .data(data)
            .width($('#grid1').width())
            .height(10000)
            .nameAttr('#adm3+name')
            .joinAttr('#adm3+code')
            .hWhiteSpace(4)
            .vWhiteSpace(4)
            .margins({top: 250, right: 20, bottom: 30, left: 200})
            .columns([pred_severity,pred_housedamage,housedamage,housetotaldamage])
            ;    

        lg.init();
        initlayout(data);
        $("#map").width($("#map").width());
    });

    $('#priority').on('click',function(){
        
        var newdata = data.filter(function(d){
            return d['#indicator+preselection']==1;
        });
        lg._gridRegister = [];
        $('#map-container').html('<div id="map"></div>');
        $('#grid1').html('');
        grid1 = new lg.grid('#grid1')
            .data(newdata)
            .width($('#grid1').width())
            .height(700)
            .nameAttr('#adm3+name')
            .joinAttr('#adm3+code')
            .hWhiteSpace(4)
            .vWhiteSpace(4)
            .margins({top: 250, right: 20, bottom: 30, left: 200})
            .columns([pred_severity,pred_housedamage,housedamage,housetotaldamage])
            ;    

        lg.init();
        initlayout(newdata);
        $("#map").width($("#map").width());
    }); */


	lg.init();
    initlayout(data);
    $("#map").width($("#map").width());	

    function initlayout(data){

        //sort table and color map by priority after loading dashboard
        var newdata = [];
        data.forEach(function(d){
            newdata.push({'key':d['#adm3+code'],'value':d['#diff+category']});
        });
        map.colorMap(newdata,diff_category);
        grid1._update(data,grid1.columns(),diff_category,'#adm3+name');


    	
		//////////////////////////////////////////
		//Create the category lines above the grid
		//////////////////////////////////////////

		var g = d3.select('#grid1').select('svg').select('g').append('g');

		//Add the number of variables per group
		var group1 = 3;
		var group2 = 2;
		var group3 = 4;
		var group4 = 0;
		var offset_hor = 0;
		var offset_vert = -30;
		
		//horizontal line 1
		g.append('line').attr("x1", 0+offset_hor)
						.attr("y1", offset_vert)
						.attr("x2", (lg._gridRegister[0]._properties.boxWidth)*group1+(lg._gridRegister[0]._hWhiteSpace)*(group1-1)+offset_hor)
						.attr("y2", offset_vert)
						.attr("stroke-width", 1)
						.attr("stroke", "black");

		//horizontal line 2
		g.append('line').attr("x1", (lg._gridRegister[0]._properties.boxWidth+lg._gridRegister[0]._hWhiteSpace)*group1+offset_hor)
						.attr("y1", offset_vert)
						.attr("x2", (lg._gridRegister[0]._properties.boxWidth)*(group1+group2)+(lg._gridRegister[0]._hWhiteSpace)*(group1+group2-1)+offset_hor)
						.attr("y2", offset_vert)
						.attr("stroke-width", 1)
						.attr("stroke", "black");

 		//horizontal line 3
		g.append('line').attr("x1", (lg._gridRegister[0]._properties.boxWidth+lg._gridRegister[0]._hWhiteSpace)*(group1+group2)+offset_hor)
						.attr("y1", offset_vert)
						.attr("x2", (lg._gridRegister[0]._properties.boxWidth)*(group1+group2+group3)+(lg._gridRegister[0]._hWhiteSpace)*(group1+group2+group3-1)+offset_hor)
						.attr("y2", offset_vert)
						.attr("stroke-width", 1)
						.attr("stroke", "black");

/*		//horizontal line 4
		g.append('line').attr("x1", (lg._gridRegister[0]._properties.boxWidth+lg._gridRegister[0]._hWhiteSpace)*(group1+group2+group3)+offset_hor)
						.attr("y1", offset_vert)
						.attr("x2", (lg._gridRegister[0]._properties.boxWidth+lg._gridRegister[0]._hWhiteSpace)*(group1+group2+group3+group4))
						.attr("y2", offset_vert)
						.attr("stroke-width", 1)
						.attr("stroke", "black"); */

		//vertical line 1.1
		g.append('line').attr("x1", 0+offset_hor)
						.attr("y1", offset_vert)
						.attr("x2", 0+offset_hor)
						.attr("y2", (offset_vert-5))
						.attr("stroke-width", 1)
						.attr("stroke", "black");

		//vertical line 1.2
		g.append('line').attr("x1", lg._gridRegister[0]._properties.boxWidth*(group1)+(lg._gridRegister[0]._hWhiteSpace)*(group1-1)+offset_hor)
						.attr("y1", offset_vert)
						.attr("x2", lg._gridRegister[0]._properties.boxWidth*(group1)+(lg._gridRegister[0]._hWhiteSpace)*(group1-1)+offset_hor)
						.attr("y2", (offset_vert-5))
						.attr("stroke-width", 1)
						.attr("stroke", "black");

		//vertical line 2.1
		g.append('line').attr("x1", (lg._gridRegister[0]._properties.boxWidth+lg._gridRegister[0]._hWhiteSpace)*(group1)+offset_hor)
						.attr("y1", offset_vert)
						.attr("x2", (lg._gridRegister[0]._properties.boxWidth+lg._gridRegister[0]._hWhiteSpace)*(group1)+offset_hor)
						.attr("y2", (offset_vert-5))
						.attr("stroke-width", 1)
						.attr("stroke", "black");

		//vertical line 2.2
		g.append('line').attr("x1", lg._gridRegister[0]._properties.boxWidth*(group1+group2)+(lg._gridRegister[0]._hWhiteSpace)*(group1+group2-1)+offset_hor)
						.attr("y1", offset_vert)
						.attr("x2", lg._gridRegister[0]._properties.boxWidth*(group1+group2)+(lg._gridRegister[0]._hWhiteSpace)*(group1+group2-1)+offset_hor)
						.attr("y2", (offset_vert-5))
						.attr("stroke-width", 1)
						.attr("stroke", "black");

		//vertical line 3.1
		g.append('line').attr("x1", (lg._gridRegister[0]._properties.boxWidth+lg._gridRegister[0]._hWhiteSpace)*(group1+group2)+offset_hor)
						.attr("y1", offset_vert)
						.attr("x2", (lg._gridRegister[0]._properties.boxWidth+lg._gridRegister[0]._hWhiteSpace)*(group1+group2)+offset_hor)
						.attr("y2", (offset_vert-5))
						.attr("stroke-width", 1)
						.attr("stroke", "black");

		//vertical line 3.2
		g.append('line').attr("x1", lg._gridRegister[0]._properties.boxWidth*(group1+group2+group3)+(lg._gridRegister[0]._hWhiteSpace)*(group1+group2+group3-1)+offset_hor)
						.attr("y1", offset_vert)
						.attr("x2", lg._gridRegister[0]._properties.boxWidth*(group1+group2+group3)+(lg._gridRegister[0]._hWhiteSpace)*(group1+group2+group3-1)+offset_hor)
						.attr("y2", (offset_vert-5))
						.attr("stroke-width", 1)
						.attr("stroke", "black");

		/* //vertical line 4.1
		g.append('line').attr("x1", (lg._gridRegister[0]._properties.boxWidth+lg._gridRegister[0]._hWhiteSpace)*(group1+group2+group3)+offset_hor)
						.attr("y1", offset_vert)
						.attr("x2", (lg._gridRegister[0]._properties.boxWidth+lg._gridRegister[0]._hWhiteSpace)*(group1+group2+group3)+offset_hor)
						.attr("y2", (offset_vert-5))
						.attr("stroke-width", 1)
						.attr("stroke", "black");

		//vertical line 4.2
		g.append('line').attr("x1", (lg._gridRegister[0]._properties.boxWidth+lg._gridRegister[0]._hWhiteSpace)*(group1+group2+group3+group4))
						.attr("y1", offset_vert)
						.attr("x2", (lg._gridRegister[0]._properties.boxWidth+lg._gridRegister[0]._hWhiteSpace)*(group1+group2+group3+group4))
						.attr("y2", (offset_vert-5))
						.attr("stroke-width", 1)
						.attr("stroke", "black"); */

		//horizontal text 1
		g.append('text').attr('x', lg._gridRegister[0]._properties.boxWidth*(group1/2)+offset_hor)
						.attr('y', (offset_vert+15))
						.text('Predictions')
						.style("text-anchor", "middle")
						.attr("font-size",12);

		//horizontal text 2
		g.append('text').attr('x', (lg._gridRegister[0]._properties.boxWidth+lg._gridRegister[0]._hWhiteSpace)*(group1+group2/2)+offset_hor)
						.attr('y', (offset_vert+15))
						.text('Actuals')
						.style("text-anchor", "middle")
						.attr("font-size",12);              

 		//horizontal text 3
		g.append('text').attr('x', (lg._gridRegister[0]._properties.boxWidth+lg._gridRegister[0]._hWhiteSpace)*(group1+group2+group3/2)+offset_hor)
						.attr('y', (offset_vert+15))
						.text('Difference')
						.style("text-anchor", "middle")
						.attr("font-size",12);              

/*		//horizontal text 4
		g.append('text').attr('x', (lg._gridRegister[0]._properties.boxWidth+lg._gridRegister[0]._hWhiteSpace)*(group1+group2+group3+group4/2)+offset_hor)
						.attr('y', (offset_vert+15))
						.text('Demographics')
						.style("text-anchor", "middle")
						.attr("font-size",12);      */                                                                                                                             
	}
}

function hxlProxyToJSON(input,headers){
    var output = [];
    var keys=[]
    input.forEach(function(e,i){
        if(i==0){
            e.forEach(function(e2,i2){
                var parts = e2.split('+');
                var key = parts[0]
                if(parts.length>1){
                    var atts = parts.splice(1,parts.length);
                    atts.sort();                    
                    atts.forEach(function(att){
                        key +='+'+att
                    });
                }
                keys.push(key);
            });
        } else {
            var row = {};
            e.forEach(function(e2,i2){
                row[keys[i2]] = e2;
            });
            output.push(row);
        }
    });
    return output;
}

function stickydiv(){
    var window_top = $(window).scrollTop();
    var div_top = $('#sticky-anchor').offset().top;
    if (window_top > div_top){
        $('#map-container').addClass('sticky');
    }
    else{
        $('#map-container').removeClass('sticky');
    }
};

$(window).scroll(function(){
    stickydiv();
}); 

//load data

var dataCall = $.ajax({ 
    type: 'GET', 
    url: 'data/gap_data.json', //https://proxy.hxlstandard.org/data.json?merge-keys01=%23adm2%2Bcode&strip-headers=on&filter01=merge&merge-url01=https%3A//docs.google.com/spreadsheets/d/1klRixK82iRk1JnDOpAqKrry4VQiFcTGrfFZWr9ih-Z8/pub%3Fgid%3D777123392%26single%3Dtrue%26output%3Dcsv&url=https%3A//docs.google.com/spreadsheets/d/1OlxhQ_ejRKNvohbnfJ7yJPKD6U6pXcPPfsFnwBbP2nc/pub%3Fgid%3D0%26single%3Dtrue%26output%3Dcsv&filter02=select&select-query02-01=%23indicator%2Bcategory%21%3D1&merge-tags01=%23affected%2Bdeaths%2C%23affected%2Bmissing%2C%23affected%2Bwounded%2C%23affected%2Binshelter%2C%23affected%2Bbuildings%2Bdestroyed%2C%23affected%2Bbuildings%2Bpartially%2C%23affected%2Bschools', 
    dataType: 'json',
});

//load geometry

var geomCall = $.ajax({ 
    type: 'GET', 
    url: 'data/geom.json', 
    dataType: 'json',
});

//when both ready construct dashboard

$.when(dataCall, geomCall).then(function(dataArgs,geomArgs){
    geom = topojson.feature(geomArgs[0],geomArgs[0].objects.geom);
    overview = hxlProxyToJSON(dataArgs[0],false);
    generateDashboard(overview,geom);
});
