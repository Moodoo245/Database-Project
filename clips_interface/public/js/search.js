$(() => {
	$('#search-button').click(() => {
		const search_results = $('#search-results');
		search_results.empty(); // clear the ancient results if present

		const search = $('#search input[type=text]').val();

		$.get('db/search/staff', {query: search}).done(result => {
			if (result.staffs.length > 0) {
				const staffs_container = $('<div class="result-table"></div>');
				staffs_container.append('<div class="result-header">Movie staff</div>');
				result.staffs.forEach(staff => {
					const staff_result = $('<div class="result-row"></div>').text(staff.fullname);

					const down_arrow = $('<i class="fas fa-angle-down"></i>')
					staff_result.append(down_arrow);

					const loader = $('<div class="loader"></div>');
					staff_result.append(loader);

					var more_info;

					staff_result.click(() => {
						if (more_info) {
							more_info.toggle();
						} else {
							loader.fadeToggle(200);
							console.log('db/search/staff/' + staff.staffid);
							$.get('db/search/staff/' + staff.staffid).done(result => {
								more_info = $('<div class="more_info"></div>');
								if (result.acts) {
									const played_in = $('<div class="played-in"><h4>Played in:</h4></div>');
									result.acts.forEach(act => played_in.append('<div>' + act.clipid + '</div>'));
									more_info.append(played_in);
									
								}
								loader.remove();
								staff_result.append(more_info);
							});
						}
					});
					staffs_container.append(staff_result);
				});
				search_results.append(staffs_container);
			}
			//search_results.text(String(result.staffs.length));
		});
	});
});
