const tables = {
	MovieStaff: ['FullName'],
	Clips: ['ClipTitle', 'ClipYear', 'ClipType'],
	Acts: ['StaffId', 'ClipId', 'Char', 'OrdersCredit', 'AddInfos'],
	Directs: ['StaffId', 'ClipId', 'AddInfos', 'Role'],
	Produces: ['StaffId', 'ClipId', 'AddInfos', 'Role'],
	Writes: ['StaffId', 'ClipId', 'AddInfos', 'Role', 'WorkType'],
	Biographies: ['StaffId', 'Name', 'RealName', 'DateAndPlaceOfBirth', 'Height', 'Biography',
		'Biographer', 'DateAndCauseOfDeath', 'Trivia', 'PersonalQuotes', 'Trademark', 'WhereAreTheyNow'],
	Nicknames: ['StaffId', 'Nickname'],
	Salaries: ['StaffId', 'Salary', 'Employer'],
	Books: ['StaffId', 'Book'],
	Spouses: ['StaffId', 'Spouse'],
	Ratings: ['ClipId', 'Votes', 'Rank'],
	ClipLinks: ['ClipFrom', 'ClipTo', 'LinkType'],
	Languages: ['Language'],
	Speaks: ['ClipId', 'LanguageId'],
	Genres: ['Genre'],
	Classified: ['ClipId', 'GenreId'],
	Country: ['CountryName'],
	ReleasedIn: ['CountryId', 'ClipId', 'ReleaseDate'],
	Associated: ['CountryId', 'ClipId'],
	PlayedFor: ['CountryId', 'ClipId'],
}

$(() => {
	const left_pane = $('#left-pane');
	const right_pane = $('#right-pane');
	var selected;
	Object.keys(tables).forEach(table => {
		const columns = new Map();
		for (c of tables[table]) {
			const input = $('<input type="text">');
			columns.set(c, {
				elem: div('column').text(c + ': ').append(input),
				val() { return input.val() },
			});
		}

		const new_table = div('table-button').text(table);
		left_pane.append(new_table);
		new_table.click(() => {
			if (selected) {
			   	selected.removeClass('selected-button');
				right_pane.empty();
			}
			right_pane.hide();
			selected = new_table;
			selected.addClass('selected-button');
			for (c of tables[table]) {
				right_pane.append(columns.get(c).elem);
			}
			for (v of columns.values()) {
				right_pane.append(v.elem);
			}

			function insert() {
				const msg = {
					table: table,
					columns: [...columns.keys()],
					values: [...columns.values()].map(v => v.val()),
				}
				console.log(msg);
				$.post('db/insert', {msg: JSON.stringify(msg)}, res => {
					console.log(res);
				});
			}

			const insert_button = div().attr('id', 'insert_button').text('Insert');
			insert_button.click(insert);
			right_pane.append(insert_button);
			right_pane.slideDown();
		});
	});
});

function div(...classes) {
	return $('<div></div>').addClass(classes.join(' '));
}
