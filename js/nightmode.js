var night = false;

function toggleNightMode() {
  if(night){
    $('*').removeClass('night');
  }else{
    $('*').addClass('night');
  }
  night = !night;
}