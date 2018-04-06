'use strict';

// USER STORY 1: Shopping list should be rendered to page

// const STORE = [
//   {name: 'apples', checked: false},
//   {name: 'oranges', checked: false},
//   {name: 'milk', checked: true},
//   {name: 'bread', checked: false}
// ];

const STORE = {
  shoppingList: [
    {name: 'apples', checked: false, time: new Date(Date.now() - 4)},
    {name: 'oranges', checked: false, time: new Date(Date.now() - 3)},
    {name: 'milk', checked: true, time: new Date(Date.now() - 2)},
    {name: 'bread', checked: false, time: new Date(Date.now() - 1)}
  ],
  sortBy: 'alpha',
  filterUnchecked: function(){
    return this.shoppingList.filter(item => item.checked === false);
  } 
};

function setSortBy(by){
  STORE.sortBy = by;
}

function handleChangeSortBy(){
  $('#sort-options').on('change', function(event){
    //$(event.target).find('option:selected', )
    setSortBy('time');
  });
}

// Creates an html item
const createHTMLItem = (item, index) => `
  <li class="js-item-index-element" data-item-index="${index}">
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
  console.log('`renderShoppingList` works like a charm');
  $('.js-shopping-list').html(createHTMLList(STORE.shoppingList));
};

// USER STORY 2: User should be able to add item to shopping list
const handleAddingItems = () => {
  $('#js-shopping-list-form').submit(function(event){
    event.preventDefault();
    const newItem = $('.js-shopping-list-entry').val();
    STORE.shoppingList.push({name: newItem, checked: false, time: new Date(Date.now())});
    console.log(newItem);
    renderShoppingList();
  });
  console.log('`handleAddingItems` works like a charm');
};
// USER STORY 3: User should be able to check items on the list &
// USER STORY 4: User should be able to delete items from the list
// Get index of checked or deleted item
const getIndexOfItem = (event) => $(event.target).closest('.js-item-index-element').data('itemIndex');

// Toggle checked item from the store
const toggleCheckItem = (database, index) => { database[index].checked = !database[index].checked; };

// Delete an item from the store
const deleteItem = (database,index) => { database.splice(index, 1); };

// Listen for clicks on check or delete button
const checkOrDeleteItem = (typeOfButton, callbackFn) => {
  $('.js-shopping-list').on('click', typeOfButton, (event) => {
    callbackFn(STORE.shoppingList, getIndexOfItem(event));
    renderShoppingList();
  });
};

// If user clicks check, toggles check item
const handleCheckingItems = () => checkOrDeleteItem('.js-item-toggle', toggleCheckItem);

// If user clicks delete, deletes item
const handleDeletingItems = () => checkOrDeleteItem('.js-item-delete', deleteItem);

// handle shopping list
const handleShoppingList = () => {
  renderShoppingList();
  handleAddingItems();
  handleCheckingItems();
  handleDeletingItems();
  handleChangeSortBy();
};

// call handle when DOM is ready
$(handleShoppingList);