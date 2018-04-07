'use strict';
// USER STORY 1: Shopping list should be rendered to page
const STORE = {
  allItems: [
    {name: 'apples', id: 1, checked: false, time: new Date(Date.now() - 4000000)},
    {name: 'oranges', id: 2, checked: false, time: new Date(Date.now() - 3000000)},
    {name: 'milk', id: 3, checked: false, time: new Date(Date.now() - 200000)},
    {name: 'bread', id: 4, checked: false, time: new Date(Date.now() - 100000)}
  ],
  getToDisplayItems: function(){
    let toReturn = this.allItems;
    if(this.searchFilter !== ''){
      const searchString = this.searchFilter;
      toReturn = toReturn.filter(function(item){
        return item.name.includes(searchString);
      });
    }
    return this.filterChecked ? toReturn.filter(item => item.checked === false) : toReturn;
  },
  totalItems: 4,
  filterChecked: false,
  searchFilter: '',
};

// Creates an html <li> element
function createHTMLItem(item, index){ 
  const milliSince = Date.now() - item.time;
  const h = Math.floor(milliSince/ 3600000);
  const m = Math.floor((milliSince - h*3600000)/60000);
  return `<li class="js-item-index-element" data-item-index="${index}" data-id="${item.id}">
    <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
    <span class="time-stamp">${h > 0 ? h+'h '+m+'m' : m+'m'} ago</span>
    <div class="shopping-item-controls">
      <button class="shopping-item-toggle js-item-toggle">
        <span class="button-label">check</span>
      </button>
      <button class="shopping-item-delete js-item-delete">
        <span class="button-label">delete</span>
      </button>
      <button class="shopping-item-edit js-item-edit">
        <span class="button-label">edit</span>
      </button>
    </div>
  </li>`;
}

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
    STORE.allItems.push({name: newItem.toLowerCase(), id: STORE.totalItems, checked: false});
    console.log(newItem);
    this.value = ''; //Why doesn't this clear the add new item text input
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

function handleEditItem(){
  $('.js-shopping-list').on('click', '.js-item-edit', (event) => {
    console.log('edit clicked');
    event.preventDefault();
    $(event.target).closest('li').html(`
    
      <span class="shopping-item js-shopping-item}">
        <form id="js-name-edit-form">
          <input type="text" name="new-name-entry" class="js-new-name-entry" placeholder="e.g., broccoli">
          <button type="submit">submit</button>
        </form>
      </span>
      
      <div class="shopping-item-controls">
      <button class="shopping-item-toggle js-item-toggle">
        <span class="button-label">check</span>
      </button>
      <button class="shopping-item-delete js-item-delete">
        <span class="button-label">delete</span>
      </button>
      <button class="shopping-item-edit js-item-edit">
        <span class="button-label">edit</span>
      </button>
      </div>
    
    `);
  });
  //handleSubmitNewName();
}

function handleSubmitNewName(){
  $(document).on('submit', '#js-name-edit-form', function(event){
    event.preventDefault();
    const newName = $('.js-new-name-entry').val();
    const IDToChange = $(event.target).closest('li').data('id');
    
    console.log(`'${newName}' submitted to ID:${IDToChange}`);
    
    STORE.allItems[getIndexFromID(STORE.allItems, IDToChange)].name = newName.toLowerCase();

    console.log(getIndexFromID(STORE.allItems, IDToChange));

    renderShoppingList();
  });
}

function handleSearch(){
  $('.js-search-entry').keyup(function(event){
    STORE.searchFilter = $(event.target).val().toLocaleLowerCase();
    console.log(`key pressed: ${event.key}`);
    console.log(`search: ${STORE.searchFilter}`);
    renderShoppingList();
  });
}

// handle shopping list
function handleShoppingList(){
  renderShoppingList();
  handleAddingItems();
  handleCheckingItems();
  handleDeletingItems();
  handleFilterChecked();
  handleSubmitNewName();
  handleEditItem();
  handleSearch();
}

// call handle when DOM is ready
$(handleShoppingList);