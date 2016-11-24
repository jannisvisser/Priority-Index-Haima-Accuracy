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
	
    var pred_abs_category = new lg.column("#prediction+abs_category").label("Priority Index Categories (based on #)").axisLabels(false);  
    var pred_abs_damages = new lg.column("#prediction+abs_damage").label("Damaged Houses (#)").axisLabels(false);     
    var pred_perc_damages = new lg.column("#prediction+perc_damage").label("Damaged Houses (% of HHs)").axisLabels(false);  
	
	var pred_cat_weightedsum = new lg.column("#prediction+category_new").label("Priority Index Categories (based on %)").axisLabels(false);
    var pred_abs_weightedsum = new lg.column("#prediction+weightedsum").label("Weighted sum (#)").axisLabels(false);   
    var pred_perc_weightedsum = new lg.column("#prediction+perc_damage_new").label("Weighted sum (% of HHs)").axisLabels(false);  
    
	var actual_abs_damages = new lg.column("#actual+abs_damage").label("Damaged Houses (#)");   
	var actual_perc_damages = new lg.column("#actual+perc_damage").label("Damaged Houses (% of HHs)").axisLabels(false);
    var actual_abs_weightedsum = new lg.column("#actual+weightedsum").label("Weighted Sum (#)").axisLabels(false);   
    var actual_perc_weightedsum = new lg.column("#actual+perc_damage_new").label("Weighted Sum (% of HHs)").axisLabels(false);  
    
	var diff_perc = new lg.column("#diff+perc").label("%-point difference").axisLabels(false)
		.colorAccessor(function(d){ if (d>0.2) {return 4;} else if (d>0.05) {return 3;} else if (d>=-0.05) {return 2;} else if (d>=-0.2) {return 1;} else if (d<-0.2) {return 0;}})
		.colors(['#d7191c','#fdae61','#ffffbf','#b2abd2','#5e3c99']);
//  var diff_gap = new lg.column("#diff+gap").label("% difference (Actual vs. Predicted)").axisLabels(false).colors(['#d7191c','#fdae61','#ffffbf','#abd9e9','#2c7bb6']);
//  var diff_category = new lg.column("#diff+category").label("Prediction error % category").axisLabels(false).colors(['#d7191c','#fdae61','#ffffbf','#abd9e9','#2c7bb6']);
    var diff_perc_new = new lg.column("#diff+perc_new").label("%-point difference").axisLabels(false)
		.colorAccessor(function(d){ if (d>0.20) {return 4;} else if (d>0.05) {return 3;} else if (d>=-0.05) {return 2;} else if (d>=-0.20) {return 1;} else if (d<-0.20) {return 0;}})
		.colors(['#d7191c','#fdae61','#ffffbf','#b2abd2','#5e3c99']);
//	var diff_gap_new = new lg.column("#diff+gap_new").label("% difference (Actual vs. Predicted)").axisLabels(false).colors(['#d7191c','#fdae61','#ffffbf','#abd9e9','#2c7bb6']);
//  var diff_category_new = new lg.column("#diff+category_new").label("Prediction error % category").axisLabels(false).colors(['#d7191c','#fdae61','#ffffbf','#abd9e9','#2c7bb6']);
	
    lg.colors(["#ffffb2","#fecc5c","#fd8d3c","#f03b20","#bd0026"]);	
	
	var group1 = 3;
	var group2 = 2;
	var group3 = 1;
	var group4 = 0;

    var grid1 = new lg.grid('#grid1')
        .data(data)
        .width($('#grid1').width())
        .height(5000)
        .nameAttr('#adm3+name')
        .joinAttr('#adm3+code')
        .hWhiteSpace(4)
        .vWhiteSpace(4)
        .margins({top: 250, right: 20, bottom: 30, left: 200})
         .columns([pred_abs_category,pred_abs_damages,pred_perc_damages,actual_abs_damages,actual_perc_damages,diff_perc])
		;

	$('#run1').on('click',function(){
        lg._gridRegister = [];
		$('#run2').css({'background-color': 'grey' });
		$('#run1').css({'background-color': '#BF002D' });
        $('#map-container').html('<div id="map"></div>');
        $('#grid1').html('');
        grid1 = new lg.grid('#grid1')
            .data(data)
            .width($('#grid1').width())
            .height(5000)
            .nameAttr('#adm3+name')
            .joinAttr('#adm3+code')
            .hWhiteSpace(4)
            .vWhiteSpace(4)
            .margins({top: 250, right: 20, bottom: 30, left: 200})
            .columns([pred_abs_category,pred_abs_damages,pred_perc_damages,actual_abs_damages,actual_perc_damages,diff_perc])
            ;    
		
		lg.init();
        initlayout(data,diff_perc,'#diff+perc');
        $("#map").width($("#map").width());
    });

    $('#run2').on('click',function(){
        lg._gridRegister = [];
		$('#run1').css({'background-color': 'grey' });
		$('#run2').css({'background-color': '#BF002D' });
        $('#map-container').html('<div id="map"></div>');
        $('#grid1').html('');
        grid1 = new lg.grid('#grid1')
            .data(data)
            .width($('#grid1').width())
            .height(5000)
            .nameAttr('#adm3+name')
            .joinAttr('#adm3+code')
            .hWhiteSpace(4)
            .vWhiteSpace(4)
            .margins({top: 250, right: 20, bottom: 30, left: 200})
            .columns([pred_cat_weightedsum,pred_abs_weightedsum,pred_perc_weightedsum,actual_abs_weightedsum,actual_perc_weightedsum,diff_perc_new])
            ;    
		
		lg.init();
        initlayout(data,diff_perc_new,'#diff+perc_new');
        $("#map").width($("#map").width());
    });
	
	
		
	lg.init();
    initlayout(data,diff_perc,'#diff+perc');
    $("#map").width($("#map").width());	

    function initlayout(data,sort_indicator1,sort_indicator2){

        //sort table and color map by priority after loading dashboard
        var newdata = [];
        data.forEach(function(d){
            newdata.push({'key':d['#adm3+code'],'value':d[sort_indicator2]});
        });
        map.colorMap(newdata,sort_indicator1);
        grid1._update(data,grid1.columns(),sort_indicator1,'#adm3+name');


    	
		//////////////////////////////////////////
		//Create the category lines above the grid
		//////////////////////////////////////////

		var g = d3.select('#grid1').select('svg').select('g').append('g');

		//Add the number of variables per group
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
