$(() => {
	$.get('db/tables', (data) => {
		const tables = $('#left-pane');
		var selected;
		data.tables.forEach(table => {
			const new_table = $('<div class="table-button"></div>').text(table);
			new_table.click(() => {
				if (selected) selected.removeClass('selected-button');
				selected = new_table;
				selected.addClass('selected-button');
				$.get('db/columns/' + table, async (coljson) => {
					const columns = $('#right-pane');
					await columns.slideUp(0);
					await columns.empty();
					await coljson.columns.forEach(column => {
						new_column = '<div class="column">' + column + ': <input type="text">' + '</div>';
						columns.append(new_column);
					});
					const insert_button = $('<div id="insert_button"></div>').text('Insert');
					columns.append(insert_button);
					columns.slideDown();
				});
			});
			tables.append(new_table);
		});
	});
});
