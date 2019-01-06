var plotted = false;
var trace = null;
var endtime = 0;
var plotstore = [];
var plotleftsets = [];
function plotcsv(filestring){
  var headers = 0;

  var csvlines = filestring.split('\n');
  for(var i = 0; i<headers; i++){
    csvlines.shift();
  }

  // get the right channel data

  var timeData = [];
  var channelData = [];

  for(var i = 0; i<csvlines.length-1; i++){
    var tokens = csvlines[i].split(',');
    timeData.push(parseFloat(tokens[0]));
    channelData.push(parseFloat(tokens[mainChan]));
  }

  trace = {
    x: timeData,
    y: channelData,
    mode: 'lines'
  }

  endtime = trace.x[trace.x.length-1];

  // var layout = {
  //   xaxis: {
  //     fixedrange: true,
  //     range: [-plot_scale, endtime+plot_scale],
  //     dtick: time_tick
  //   },
  //   yaxis: {
  //     fixedrange: true
  //   },
  //   margin: {
  //     l: 0,
  //     r: 0,
  //     t: 0,
  //     b: 25,
  //     pad: 4
  //   },
  // }

  // calcPlotWidth();
  
  // Plotly.newPlot('graphBoxInner', [trace], layout)

  /* sliding plots */
  var upend = trace.y.reduce((a,b)=>{return Math.max(a,b)});
  var lowend = trace.y.reduce((a,b)=>{return Math.min(a,b)});
  var cent = upend / 2 + lowend / 2;
  var diff = upend - cent;
  upend = cent + diff * 1.2;
  lowend = cent - diff * 1.2;

  var layout = {
    xaxis: {
      fixedrange: true,
      range: [-plot_scale, endtime+plot_scale],
      dtick: time_tick
    },
    yaxis: {
      fixedrange: true,
      range: [lowend, upend]
    },
    margin: {
      l: 0,
      r: 0,
      t: 0,
      b: 25,
      pad: 4
    },
  }

  var container = $('#graphBox')
  for(var i = 0; i < endtime+plot_scale; i+=plot_scale*2){
    var regstart = i-plot_scale;
    var regend = i+plot_scale;
    layout.xaxis.range = [regstart, regend];
    var plotstr = 'plot'+plotstore.length;
    var divbox = $('<div></div>');
    divbox.addClass('plotpart');
    divbox.attr('id', plotstr);
    plotleftsets.push(100); // -100 is off to left side, 0 isexactly centered, 100 is off to right side
    divbox.css({'left': '100%'})
    container.append(divbox);
    plotstore.push(divbox);
    var stind = 0; var endind = 0;
    for(var cind = 0; cind < trace.x.length; cind++){
      if(trace.x[cind]<regstart) stind = cind;
      if(trace.x[cind]>regend){
        endind = cind;
        break;
      }
    }
    var subtrace = {
      x: trace.x.slice(stind, endind),
      y: trace.y.slice(stind, endind),
      mode: 'lines'
    }
    Plotly.newPlot(plotstr, [subtrace], layout)
  }


  plotted = true;
  eventTime();
}

function plotCurrRange(){
  var time = $('#player').prop('currentTime');
  var tottime = parseFloat(time)+temp_offset+time_offset;

  var currindex = Math.floor(tottime / plot_scale / 2);
  var curroffset = (((tottime % (plot_scale * 2)) + (plot_scale * 2)) % (plot_scale * 2)) / (plot_scale * 2) * 100;

  for(var i = 0; i<plotleftsets.length; i++){
    if(i < currindex){
      if(plotleftsets[i] != -100){
        plotleftsets[i] = -100;
        plotstore[i].css({'left': '-100%'});
      }
      continue;
    }
    if(i == currindex){
      plotleftsets[i] = -curroffset;
      plotstore[i].css({'left': plotleftsets[i]+'%'});
      continue;
    }
    if(i == currindex + 1){
      plotleftsets[i] = 100-curroffset;
      plotstore[i].css({'left': plotleftsets[i]+'%'});
      continue;
    }
    if(plotleftsets[i] != 100){
      plotleftsets[i] = 100;
      plotstore[i].css({'left': '100%'});
    }
  }

}

function calcPlotWidth(){
  var winlen = $('#plot').width();
  var graphlen = endtime/(plot_scale*2) * winlen + winlen;
  var offset = $('#plot').width()/(2*plot_scale)*(time_offset);
  $('#graphBoxInner').css({
    width: graphlen+'px'
  });
  $('#graphBox').prop('scrollLeft', offset);
}

(function(){

  var dp = $('#dropbox');
  dp.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
  });
  dp.on('dragover dragenter', function() {
    // dp.addClass('is-dragover');
    dp.css({
      'background-color': '#888888'
    });
  });
  dp.on('dragleave dragend drop', function() {
    // dp.removeClass('is-dragover');
    dp.stop().animate({
      'background-color': '#dddddd'
    }, 500);
  })
  dp.on('drop', function(e) {
    var csvFile = e.originalEvent.dataTransfer.files[0];
    var ext = csvFile.name.split('.');
    ext = ext[ext.length-1];
    if(ext != 'csv'){
      $('#message').html('That is Not a CSV. Please Drop CSV File Here')
      return;
    }
    dp.remove();
    var rdr = new FileReader();
    rdr.onloadend = function(evt) {
      if (evt.target.readyState == FileReader.DONE) { // DONE == 2
        $('#graphBox').css('display','block');
        $('#pointerLine').css('display','block');
        $('#offsetVal').val(0)
        plotcsv(evt.target.result)
      }
    };
    rdr.readAsBinaryString(csvFile);
  });

})()