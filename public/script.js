/**
 * Builds a row from a string value. DOM has hierarchic structure so we need to follow it
 * and nest nodes correspondingly
 */
function buildRow(todo) {
    /* Creating node objects */
    const newRow = document.createElement('tr');
    const newColumn1 = document.createElement('td');
    const newColumn2 = document.createElement('td');
    const removeButton = document.createElement('button');
    const buttonTitle = document.createTextNode('Delete');
    const textNode = document.createTextNode(todo);

    /* Applying hierarchy */
    removeButton.appendChild(buttonTitle);
    newColumn1.appendChild(textNode);
    newColumn2.appendChild(removeButton);
    newRow.appendChild(newColumn1);
    newRow.appendChild(newColumn2);

    /* Setting event handlers */
    removeButton.onclick = () => {
        // Here you can see a closure. 'newRow' value is stored in context
        // of newly created function. 'newRow' is an object, thus
        // every call of 'deleteRowFromTable' will get the latest value.
        // It means that we could have assigned 'onclick' handler right after
        // 'removeButton' creation

        // Sending body on DELETE is not a best practise but is not forbidden so let
        // me cheat a little bit
        fetch('http://localhost:3000/api/todos', {
			body: JSON.stringify({todo}),
			headers: { 'content-type': 'application/json' },
			method: 'DELETE'
		  }).then(() => deleteRowFromTable(newRow));
    };

    return newRow;
}

/**
 * Retrieves todo's text from text input and builds a new row and adds it to the table
 */
function addTodo() {
    const todoContent = document.getElementById('todoContent');
    const todo = todoContent.value;

    if (todo.length > 0) {
        // Send POST request to the server with { todo: todoContent.value } object
        // Update table contents upon completion
        fetch('http://localhost:3000/api/todos', {
			body: JSON.stringify({todo}),
			headers: { 'content-type': 'application/json' },
			method: 'POST'
		  }).then(() => {
			addRowToTable(buildRow(todo));
			todoContent.value = '';
		  });
    }
}

/**
 * Appends a row (structure of nodes) to the table. Vanilla Javascript, nothing special
 */
function addRowToTable(row) {
    const table = document.getElementById('todoTable');
    table.appendChild(row);
}

/**
 * Removes a row (structure of nodes) from table. Vanilla Javascript, nothing special
 */
function deleteRowFromTable(row) {
    const table = document.getElementById('todoTable');
    table.removeChild(row);
}

// Get initial data from server. Again, not the best way to perform it
// For each retrieved TODO we are building a row and appending it to the table
fetch('http://localhost:3000/api/todos')
	.then(res => res.json())
	.then(data => data.todos.forEach(todo => addRowToTable(buildRow(todo))));