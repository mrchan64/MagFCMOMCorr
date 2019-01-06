function changeSpeed(){
  var speed = parseFloat($('#speedControl').val());
  $('#player').prop('playbackRate', speed);
}

var playing = false;
var temp_offset = 0;
var plotplaying = false;

function updateTime(){
  var time = $('#player').prop('currentTime')

  var dec = '000' + String(Math.floor((time%1)*1000));
  dec = ':'+dec.substring(dec.length-3, dec.length);
  var s = Math.floor(time);
  var h = '000' + String(Math.floor(s/60));
  h = h.substring(h.length-2, h.length);
  s = '000' + String(s%60);
  s = ':'+s.substring(s.length-2, s.length);

  $('#currTimeValTokenated').val(h+s+dec);
  $('#currTimeVal').val(time);

  if(!plotplaying) updatePlot();

  if(playing) setTimeout(updateTime, 10);
}

function updatePlot(){
  plotplaying = true;
  if(plotted){
    plotCurrRange();
  }
  if(!playing){
    plotplaying = false;
  }else{
    setTimeout(updatePlot, 30);
  }
}

function eventTime(){
  if(!playing) updateTime();
}

function updateOffset(){
  temp_offset = parseFloat($('#offsetVal').val());
  if(!playing) updateTime();
}

function updatePlay(){
  playing = true;
  updateTime();
}

function updatePause(){
  playing = false;
}

function toClipboard(){
  $('#currTimeVal').select();
  document.execCommand('copy');
  $('#copy').val('Copied!');
  setTimeout(()=>{
    $('#copy').val('Copy!');
  }, 2000)
}

function back5(){
  $('#player').prop('currentTime', $('#player').prop('currentTime')-5);
  if(!playing) updateTime();
}

function forward5(){
  $('#player').prop('currentTime', $('#player').prop('currentTime')+5);
  if(!playing) updateTime();
}

function togglePlay(){
  if(playing){
    $('#player').get(0).pause();
    $('#playbutt').val('Play (Space, K)')
  }else{
    $('#player').get(0).play();
    $('#playbutt').val('Pause (Space, K)')
  }
}

function backframe(){
  $('#player').prop('currentTime', $('#player').prop('currentTime')-.00417);
  if(!playing) updateTime();
}

function forwardframe(){
  $('#player').prop('currentTime', $('#player').prop('currentTime')+.00417);
  if(!playing) updateTime();
}

function back10frame(){
  $('#player').prop('currentTime', $('#player').prop('currentTime')-.0417);
  if(!playing) updateTime();
}

function forward10frame(){
  $('#player').prop('currentTime', $('#player').prop('currentTime')+.0417);
  if(!playing) updateTime();
}

function keyProcess(e){
  var tag = e.target.tagName.toLowerCase();
  if(tag=='input')return;
  if(e.which==32 || e.keyCode==32 || e.which==107 || e.keyCode==107) {
    togglePlay();
  }else if(e.which==106 || e.keyCode==106) {
    back5();
  }else if(e.which==108 || e.keyCode==108) {
    forward5();
  }else if(e.which==117 || e.keyCode==117) {
    backframe();
  }else if(e.which==111 || e.keyCode==111) {
    forwardframe();
  }
}

function setTime(){
  $('#player').prop('currentTime', $('#timeJumpVal').val());
  if(!playing)updateTime()
}

function togFilt(){
  var vid = $('#player');
  if(vid.hasClass('filtered')){
    vid.removeClass('filtered')
    $('#filterlabel').html('Turn Video Filter On:')
  }else{
    vid.addClass('filtered')
    $('#filterlabel').html('Turn Video Filter Off:')
  }
}

(function(){
  $('#movielink').prop('src', movName);
  $('#player')[0].load();
  setTimeout(updateTime, 100);
  $(document).on('keypress', keyProcess);
})()