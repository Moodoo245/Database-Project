$(() => {
	$.get('db/tables', (data) => {
		const tables = $('<div id="tables"></div>');
		var selected;
		data.tables.forEach(table => {
			const new_table = $('<div class="table-button"></div>').text(table);
			new_table.click(() => {
				if (selected) selected.removeClass('selected-button');
				selected = new_table;
				selected.addClass('selected-button');
				$.get('db/columns/' + table, (coljson) => {
					const columns = $('<div id="columns"></div>');
					coljson.columns.forEach(column => {
						new_column = '<div class="column">' + column + ': <input type="text">' + '</div>';
						columns.append(new_column);
					});
					const insert_button = $('<div id="insert_button"></div>').text('Insert');
					columns.append(insert_button);
					$('#right-pane').html(columns);
				});

			});
			tables.append(new_table);
		});
		$('#left-pane').html(tables);
	});

});
