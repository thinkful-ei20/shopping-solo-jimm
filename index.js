'use strict';
// USER STORY 1: Shopping list should be rendered to page
const STORE = {
  allItems: [
    {name: 'apples', id: 1, checked: false},
    {name: 'oranges', id: 2, checked: false},
    {name: 'milk', id: 3, checked: true},
    {name: 'bread', id: 4, checked: false}
  ],
  getToDisplayItems: function(){
    return this.filterChecked ? this.allItems.filter(item => item.checked === false) : this.allItems;
  },
  totalItems: 4,
  filterChecked: false,
};

// Creates an html <li> element
const createHTMLItem = (item, index) => `
  <li class="js-item-index-element" data-item-index="${index}" data-id="${item.id}">
    <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
          <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
          <span class="button-label">delete</span>
        </button>
      </div>
  </li>
`;

// Creates an html item for each item in the STORE
const createHTMLList = (database) => database.map((item, index) => createHTMLItem(item, index)).join('');

// Renders shopping list to the DOM
const renderShoppingList = () => {
  console.log('renderShoppingList() ran');
  $('.js-shopping-list').html(createHTMLList(STORE.getToDisplayItems()));
};

function handleFilterChecked(){
  $('#filter-checked').on('click', function(event){
    const isChecked = $('#filter-checked').is(':checked');
    console.log(`filter checkbox is now ${isChecked ? 'CHECKED' : 'UN-Checked'}`);
    isChecked ? STORE.filterChecked = true: STORE.filterChecked = false;
    renderShoppingList();
  });
}

function handleAddingItems(){
  $('#js-shopping-list-form').submit(function(event){
    event.preventDefault();
    const newItem = $('.js-shopping-list-entry').val();
    STORE.totalItems++;
    STORE.allItems.push({name: newItem, id: STORE.totalItems, checked: false});
    console.log(newItem);
    renderShoppingList();
  });
  console.log('handleAddingItems() ran');
}

function getIdOfItem(event){
  let foundID = $(event.target).closest('.js-item-index-element').data('id');
  console.log(`found index: ${foundID} with getIdOfItem()`);
  return foundID;
}

function toggleCheckItem(list, ID){
  let found = list.find(item => item.id === ID);
  found.checked = !list.find(item => item.id === ID).checked; 
  console.log(`toggled check of id: ${found.id}`);
}

function deleteItem(list, ID){
  list.splice(getIndexFromID(list, ID),1);
}

function getIndexFromID(list, passedID){
  const foundItem = list.find(item => item.id === passedID);
  console.log(foundItem);
  const foundIndex = list.findIndex(item => item === foundItem);
  console.log(foundIndex);
  return foundIndex;
}

// If user clicks check, toggles check item
function handleCheckingItems(){
  //checkOrDeleteItem('.js-item-toggle', toggleCheckItem);
  $('.js-shopping-list').on('click', '.js-item-toggle', (event) => {
    toggleCheckItem(STORE.allItems, getIdOfItem(event));
    renderShoppingList();
  });
}

// If user clicks delete, deletes item
function handleDeletingItems(){
  //checkOrDeleteItem('.js-item-delete', deleteItem);
  $('.js-shopping-list').on('click', '.js-item-delete', (event) => {
    deleteItem(STORE.allItems, getIdOfItem(event));
    renderShoppingList();
  });
}

// handle shopping list
const handleShoppingList = () => {
  renderShoppingList();
  handleAddingItems();
  handleCheckingItems();
  handleDeletingItems();
  handleFilterChecked();
};

// call handle when DOM is ready
$(handleShoppingList);