function generateDashboard(data,geom){
    var map = new lg.map('#map').geojson(geom).nameAttr('Mun_Name').joinAttr('Mun_Code').zoom(8).center([17.5,121.2]);

    var priority = new lg.column('#indicator+priority')
                        .label('Priority Index')
                        .axisLabels(false)
                        .valueAccessor(function(d){
                            return +d;
                        })
                        .colorAccessor(function(d,i,max){
                            return +Math.round(d)-1;
                        })
						;
						
    var vulnerability = new lg.column('#indicator+vulnerability')
                        .label('Vulnerability Index')
                        .axisLabels(false)
                        .valueAccessor(function(d){
                            return +d;
                        })
                        .colorAccessor(function(d,i,max){
                            return +Math.round(d)-1;
                        })
						;

    var severity = new lg.column('#indicator+severity')
                        .label('Severity Index')
                        .axisLabels(false)
                        .valueAccessor(function(d){
                            return +d;
                        })
                        .colorAccessor(function(d,i,max){
                            return +Math.round(d)-1;
                        })
						;
						
    var poverty = new lg.column("#indicator+poverty").label("Poverty incidence").axisLabels(false);
    var walltype = new lg.column("#indicator+walltype").label("Wall made (partially) of concrete").axisLabels(false);
	var rooftype = new lg.column("#indicator+rooftype").label("Roof made of alu/iron/concrete").axisLabels(false);
    var hhs4P = new lg.column("#indicator+p4hhs").label("Percentage of HHs under 4P").axisLabels(false);
    var incomeclass = new lg.column("#indicator+incomeclass").label("Income class").axisLabels(false).colorAccessor(function(d,i,max){return +d-1;});
    var hospitaldensity = new lg.column("#indicator+hospitaldensity").label("Avg. pop. per health facility").axisLabels(false);
    var population = new lg.column("#indicator+population").label("Population").axisLabels(false);
	var housetotaldamage = new lg.column("#indicator+housedamagetotal").label("Houses damaged totally").axisLabels(false);  
    var housedamage = new lg.column("#indicator+housedamage").label("Houses damaged (total+partial)").axisLabels(false);         
	    

    var grid1 = new lg.grid('#grid1')
        .data(data)
        .width($('#grid1').width())
        .height(650)
        .nameAttr('#adm3+name')
        .joinAttr('#adm3+code')
        .hWhiteSpace(4)
        .vWhiteSpace(4)
        .margins({top: 250, right: 20, bottom: 30, left: 200})
        .columns([priority,vulnerability,severity,housetotaldamage,housedamage,poverty,walltype,rooftype,hhs4P,incomeclass,hospitaldensity,population])
		;            

    lg.colors(["#ffffb2","#fecc5c","#fd8d3c","#f03b20","#bd0026"]);

    lg.init();

    $("#map").width($("#map").width());

    var g = d3.select('#grid1').select('svg').select('g').append('g');

    g.append('line').attr("x1", 0)
                    .attr("y1", -220)
                    .attr("x2", (lg._gridRegister[0]._properties.boxWidth)*3)
                    .attr("y2", -220)
                    .attr("stroke-width", 1)
                    .attr("stroke", "black");

    g.append('line').attr("x1", (lg._gridRegister[0]._properties.boxWidth+lg._gridRegister[0]._hWhiteSpace)*3)
                    .attr("y1", -220)
                    .attr("x2", (lg._gridRegister[0]._properties.boxWidth+lg._gridRegister[0]._hWhiteSpace)*12)
                    .attr("y2", -220)
                    .attr("stroke-width", 1)
                    .attr("stroke", "black");

    g.append('line').attr("x1", 0)
                    .attr("y1", -220)
                    .attr("x2", 0)
                    .attr("y2", -215)
                    .attr("stroke-width", 1)
                    .attr("stroke", "black");

    g.append('line').attr("x1", lg._gridRegister[0]._properties.boxWidth*3)
                    .attr("y1", -220)
                    .attr("x2", lg._gridRegister[0]._properties.boxWidth*3)
                    .attr("y2", -215)
                    .attr("stroke-width", 1)
                    .attr("stroke", "black");

    g.append('line').attr("x1", (lg._gridRegister[0]._properties.boxWidth+lg._gridRegister[0]._hWhiteSpace)*3)
                    .attr("y1", -220)
                    .attr("x2", (lg._gridRegister[0]._properties.boxWidth+lg._gridRegister[0]._hWhiteSpace)*3)
                    .attr("y2", -215)
                    .attr("stroke-width", 1)
                    .attr("stroke", "black");

    g.append('line').attr("x1", (lg._gridRegister[0]._properties.boxWidth+lg._gridRegister[0]._hWhiteSpace)*12)
                    .attr("y1", -220)
                    .attr("x2", (lg._gridRegister[0]._properties.boxWidth+lg._gridRegister[0]._hWhiteSpace)*12)
                    .attr("y2", -215)
                    .attr("stroke-width", 1)
                    .attr("stroke", "black");

    g.append('text').attr('x', lg._gridRegister[0]._properties.boxWidth*(3/2))
                    .attr('y', -225)
                    .text('Predicted')
                    .style("text-anchor", "middle")
                    .attr("font-size",10);

    g.append('text').attr('x', (lg._gridRegister[0]._properties.boxWidth+lg._gridRegister[0]._hWhiteSpace)*7.5)
                    .attr('y', -225)
                    .text('Reported data')
                    .style("text-anchor", "middle")
                    .attr("font-size",10);                                                                                                                                   
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
    url: 'data/mun_ranking.json', //https://proxy.hxlstandard.org/data.json?merge-keys01=%23adm2%2Bcode&strip-headers=on&filter01=merge&merge-url01=https%3A//docs.google.com/spreadsheets/d/1klRixK82iRk1JnDOpAqKrry4VQiFcTGrfFZWr9ih-Z8/pub%3Fgid%3D777123392%26single%3Dtrue%26output%3Dcsv&url=https%3A//docs.google.com/spreadsheets/d/1OlxhQ_ejRKNvohbnfJ7yJPKD6U6pXcPPfsFnwBbP2nc/pub%3Fgid%3D0%26single%3Dtrue%26output%3Dcsv&filter02=select&select-query02-01=%23indicator%2Bcategory%21%3D1&merge-tags01=%23affected%2Bdeaths%2C%23affected%2Bmissing%2C%23affected%2Bwounded%2C%23affected%2Binshelter%2C%23affected%2Bbuildings%2Bdestroyed%2C%23affected%2Bbuildings%2Bpartially%2C%23affected%2Bschools', 
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
