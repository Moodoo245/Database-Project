const ENTER_KEYCODE = 13;

$(() => {
	// ADVANCED OPTIONS
	const adv_opt_h = $('#search-options .header');
	const adv_opt_c = $('#search-options .content');
	adv_opt_h.click(() => adv_opt_c.slideToggle());
	$('#search-options .content .node > .parent:checked ~ .leaf').show();
	$('#search-options .content .node > .parent').change(function() {
		const leaves = $(this).siblings('.leaf');
		if (this.checked) {
			leaves.slideDown();
		} else {
			leaves.slideUp();
		}
	});

	// toggle text disable on checkbox checktoggle
	$('#search-options .content input:checkbox').change(function() {
		const texts = $(this).siblings('input:text');
		if (this.checked) {
			texts.prop('disabled', false);
		} else {
			texts.prop('disabled', true);
		}
	});
	// trigger it once on pageload
	$('#search-options .content input:checkbox').change();

	// ---------------------

	const search_button = $('#search-button');
	const textbox = $('#search-text');
	const search_results = $('#search-results');
	const loader = div('loader'); // loader icon

	function searchable(name) {
		const elem = span('clickable').text(name);
		elem.click(() => {
			reset_checkboxes();
			textbox.val(name);
			search_button.click();
		});
		return elem;
	}

	function reset_checkboxes () {
		$('#checkbox_staff').prop('checked', true);
		$('#checkbox_staff ~ .leaf > input:checkbox').prop('checked', true);
		$('#checkbox_clips').prop('checked', true);
		$('#checkbox_clips ~ .leaf input:checkbox').prop('checked', false);
		$('#checkbox_rating ~ input:text').val('');
		$('#search-options .content input:checkbox').change();
	}

	textbox.keypress(e => {
		if (e.which == ENTER_KEYCODE) {
			search_button.click();
		}
	});

	search_button.click(async () => {
		search_results.empty(); // clear the ancient results if present

		search_results.append(loader);
		loader.fadeIn(500);
		
		const search_text = textbox.val();
		var q_staff, q_clip;

		if ($('#checkbox_staff').prop('checked')) {
			const staff_query_msg = {text: search_text};
			staff_query_msg.actors = $('#checkbox_actors').prop('checked');
			staff_query_msg.directors = $('#checkbox_directors').prop('checked');
			staff_query_msg.producers = $('#checkbox_producers').prop('checked');
			staff_query_msg.writers = $('#checkbox_writers').prop('checked');
			staff_query_msg.limit = $('#staff_limit').val();
			q_staff = $.get('db/search/staff', staff_query_msg);
		} else q_staff = [];

		if ($('#checkbox_clips').prop('checked')) {
			const clip_query_msg = {text: search_text};
			clip_query_msg.limit = $('#clip_limit').val();
			if ($('#checkbox_type').prop('checked')) {
				clip_query_msg.type = [];
				if ($('#typeTV').prop('checked')) clip_query_msg.type.push('TV')
				if ($('#typeV').prop('checked')) clip_query_msg.type.push('V')
				if ($('#typeVG').prop('checked')) clip_query_msg.type.push('VG')
			}
			if ($('#checkbox_rating').prop('checked')) {
				clip_query_msg.bound_rating = true;
				const gt_rating = $('#textgt_rating').val();
				const lt_rating = $('#textlt_rating').val();
				clip_query_msg.gt_rating = isNaN(Number(gt_rating)) ? 0 : Number(gt_rating);
				clip_query_msg.lt_rating = lt_rating == '' || isNaN(Number(lt_rating)) ? 10 : Number(lt_rating);
			}
			if ($('#checkbox_genre').prop('checked'))
				clip_query_msg.genre = $('#text_genre').val();
			if ($('#checkbox_language').prop('checked'))
				clip_query_msg.language = $('#text_language').val();
			if ($('#checkbox_associated').prop('checked'))
				clip_query_msg.associated = $('#text_associated').val();
			q_clip = $.get('db/search/clip', clip_query_msg);
		} else q_clip = [];

		try {
			displayStaff(await q_staff);
			displayClips(await q_clip);
		} catch (err) {
			console.log(err.statusText);
		}
		loader.hide();
	});

	function displayStaff(staffs) {
		if (!staffs.length) return;

		const staffs_container = div('result-table');
		search_results.append(staffs_container);
		staffs_container.append(div('result-header').text('Movie staff'));

		staffs.forEach(staff => {
			const staff_result = div('result-row').text(staff.fullname);
			staffs_container.append(staff_result);

			const arrow = $('<i class="fas fa-angle-down"></i>');
			staff_result.append(arrow);

			const more_info = div('more-info');
			staff_result.append(more_info);
			let fetched_infos = false;
			let loader;

			staff_result.click(() => {
				arrow.toggleClass('fa-angle-down fa-angle-up');
				if (fetched_infos) {
					more_info.slideToggle();
				} else {
					if (!loader) {
						loader = div('loader');
						more_info.append(loader);
					}
					more_info.show();
					loader.fadeIn(200);

					// query in movie staff
					$.get('db/search/staff/' + staff.staffid).done(result => {
						fetched_infos = true;
						loader.remove();
						more_info.hide();

						const {acts, directs, produces, writes, bio} = result;

						if (acts.length > 0) {
							const prep_acts = acts.map(row => {
								const {cliptitle, char, addinfos} = row;
								const ctitle = searchable(cliptitle);
								const clip = [ctitle];
								if (char) clip.push(' as ' + char);
								if (addinfos) clip.push(' (' + addinfos + ')');
								return clip;
							});
							
							more_info.append(property_list('Played in', prep_acts));
						}
						
						if (directs.length > 0) {
							const prep_directs = directs.map(row => {
								const {cliptitle, char, addinfos} = row;
								const ctitle = searchable(cliptitle);
								const clip = [ctitle];
								if (char) clip.push(' as ' + char);
								if (addinfos) clip.push(' (' + addinfos + ')');
								return clip;
							});

							more_info.append(property_list('Directed', prep_directs));
						}

						if (produces.length > 0) {
							const prep_produces = produces.map(row => {
								const {cliptitle, addinfos, role} = row;
								const ctitle = searchable(cliptitle);
								const clip = [ctitle];
								if (addinfos) clip.push(' as a ' + addinfos);
								if (role) clip.push(' (' + role + ')');
								return clip;
							});

							more_info.append(property_list('Produced', prep_produces));
						}

						if (writes.length > 0) {
							const prep_writes = writes.map(row => {
								const {cliptitle, role, addinfos, worktype} = row;
								const ctitle = searchable(cliptitle);
								const clip = [ctitle];
								clip.push(mkParenCsv(role, addinfos, worktype));
								return clip;
							});
							more_info.append(property_list('Wrote', prep_writes));
						}

						if (bio) {
							const {realname, dateandplaceofbirth, height, biography, biographer,
								   dateandcauseofdeath, trivia, personalquotes, trademark,
								   wherearetheynow} = bio;

						}

						more_info.slideDown();

					});
				}
			});
		});
	}

	function displayClips(clips) {
		if (!clips.length) return;

		const clips_container = div('result-table');
		clips_container.append(div('result-header').text('Clips'));
		search_results.append(clips_container);

		clips.forEach(clip => {
			const clip_result = div('result-row').text(clip.cliptitle);
			clips_container.append(clip_result);

			const arrow = $('<i class="fas fa-angle-down"></i>')
			clip_result.append(arrow);

			const more_info = div('more-info');
			clip_result.append(more_info);



			let fetched_infos = false;
			let loader;

			clip_result.click(() => {
				arrow.toggleClass('fa-angle-down fa-angle-up');
				
				if (fetched_infos) {
					more_info.slideToggle();
				} else {
					if (!loader) {
						loader = div('loader');
						more_info.append(loader);
					}
					more_info.show();
					loader.fadeIn(200);
					$.get('db/search/clip/' + clip.clipid).done(result => {
						more_info.hide();
						loader.remove();
						fetched_infos = true;
						const {cliptype, clipyear, rating, genres, languages, associatedcountries,
							 releasedates, runningtimes, cliplinks, acts, directs, produces, writes} = result;

						if (cliptype) {
							more_info.append(property('Type', [typeToString(clip.cliptype)]));
						}

						if (clipyear) {
							more_info.append(property('Year', [clip.clipyear]))
						}

						if (rating) {
							const {rank, votes} = rating;
							more_info.append(property('Rating', [rank + '/10 (' + votes + ' votes)']))
						}

						if (genres.length > 0) {
							more_info.append(property('Genres', genres));
						}

						if (languages.length > 0) {
							more_info.append(property('Languages', languages));
						}

						if (associatedcountries.length > 0) {
							more_info.append(property('Associated countries', associatedcountries));
						}
						
						if (releasedates.length > 0) {
							prep_dates =  releasedates.map(row => {
								const {releasecountry, releasedate} = row;
								let text = releasedate;
								if (releasecountry) text += ` (${releasecountry})`;
								return text;
							});
							if (releasedates.length == 1) {
								more_info.append(property('Release date', prep_dates[0]));
							} else {
								more_info.append(property_list('Release dates', prep_dates));
							}
						}

						if (runningtimes.length > 0) {
							prep_times =  runningtimes.map(row => {
								const {releasecountry, runningtime} = row;
								let text = releasedate;
								if (runningtime) text += ` (${runningtime})`;
								return text;
							});

							if (runningtimes.length == 1) {
								more_info.append(property('Running times', prep_times[0]));
							} else {
								more_info.append(property_list('Running times', prep_times));
							}
						}

						if (acts.length > 0) {
							const prep_acts = acts.map(row => {
								const {fullname, char, addinfos} = row;
								const name = searchable(fullname);
								const staff = [name];
								if (char) staff.push(' as ' + char);
								if (addinfos) staff.push(' (' + addinfos + ')');
								return staff;
							});
							
							more_info.append(property_list('Starring', prep_acts));
						}
						
						if (directs.length > 0) {
							const prep_directs = directs.map(row => {
								const {fullname, char, addinfos} = row;
								const name = searchable(fullname);
								const staff = [name]
								if (char) staff.push(' as ' + char);
								if (addinfos) staff.push(' (' + addinfos + ')');
								return staff;
							});

							more_info.append(property_list('Directed by', prep_directs));
						}

						if (produces.length > 0) {
							const prep_produces = produces.map(row => {
								const {fullname, addinfos, role} = row;
								const name = searchable(fullname);
								const staff = [name];
								if (addinfos) staff.push(' as a ' + addinfos);
								if (role) staff.push(' (' + role + ')');
								return staff;
							});

							more_info.append(property_list('Produced by', prep_produces));
						}

						if (writes.length > 0) {
							const prep_writes = writes.map(row => {
								const {fullname, role, addinfos, worktype} = row;
								const name = searchable(fullname);
								const staff = [name];
								staff.push(mkParenCsv(role, addinfos, worktype));
								return staff;
							});
							more_info.append(property_list('Written by', prep_writes));
						}

						if (cliplinks.length > 0) {
							more_info.append(property_list('Links', cliplinks.map(row => [row.linktype + ' ', searchable(row.cliptitle)])));
						}
						more_info.slideDown();
					});
				}
			});
		})

	}
});

// ------------------------------ HELPERS ------------------------------ 

function div(...classes) {
	return $('<div></div>').addClass(classes.join(' '));
}

function span(...classes) {
	return $('<span></span>').addClass(classes.join(' '));
}

function property(name, values) {
	return div('property').html(`<b>${name}:</b> ${values.join(', ')}`);
}

function property_list(hname, items) {
	const elem = div('property');
	const header = $('<h4></h4>').text(hname + ':');
	elem.append(header);

	const list = $('<ul></ul>');
	items.forEach(item => {
		const list_elem = $('<li></li>').html(item);
		list.append(list_elem);
	});
	elem.append(list);
	
	return elem;
}

function mkParenCsv(...items) {
	if (typeof array != Array) return '';
	
	let s = '';
	let first = true;
	for (let item of items) {
		if (item) {
			if (first) {
				s += '(' + item;
				first = false;
			} else {
				s += ', ' + item;
			}
		}
	}
	if (!first) {
		s += ')';
	}

	return s;
}

function typeToString (type) {
	switch (type) {
		case 'TV':
			return 'TV movie';
		case 'V':
			return 'video movie';
		case 'VG':
			return 'video game';
	}
	return '';
}
