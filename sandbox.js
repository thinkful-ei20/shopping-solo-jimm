'use strict';



//functions for sorting the list later
function setSortBy(by){
  STORE.sortBy = by;
}

function handleChangeSortBy(){
  $('#sort-options').on('change', function(event){
    //$(event.target).find('option:selected', )
    setSortBy('time');
  });
}