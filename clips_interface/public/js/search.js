const ENTER_KEYCODE = 13;

$(() => {
	const search_button = $('#search-button');
	const textbox = $('#search input[type=text]');

	function clickable(name) {
		const elem = span('clickable').text(name);
		elem.click('')
		elem.click(() => {
			textbox.val(name);
			console.log(name);
			search_button.click();
		});
		return elem;
	}

	textbox.keypress(e => {
		if (e.which == ENTER_KEYCODE) {
			search_button.click();
		}
	});

	search_button.click(() => {
		const search_results = $('#search-results');
		search_results.empty(); // clear the ancient results if present

		// add a loader icon
		const loader = div('loader');
		search_results.append(loader);
		loader.fadeToggle(200);
		
		const search = textbox.val();

		$.get('db/search/staff', {query: search}).done(results => {
			loader.remove();
			const staffs_container = div('result-table');
			search_results.append(staffs_container);
			if (results.length > 0) {
				staffs_container.append(div('result-header').text('Movie staff'));

				results.forEach(staff => {
					const staff_result = div('result-row').text(staff.fullname);
					staffs_container.append(staff_result);

					const arrow = $('<i class="fas fa-angle-down"></i>');
					staff_result.append(arrow);

					const more_info = div('more-info');
					staff_result.append(more_info);
					let fetched_infos = false;
					let loader;

					staff_result.click(() => {
						more_info.toggle();
						arrow.toggleClass('fa-angle-down fa-angle-up');
						if (!fetched_infos) {
							if (!loader) {
								loader = div('loader');
								more_info.append(loader);
							}
							loader.fadeToggle(200);

							// query in movie staff
							$.get('db/search/staff/' + staff.staffid).done(result => {
								fetched_infos = true;
								loader.remove();

								const {acts, directs, produces, writes, bio} = result;

								if (acts.length > 0) {
									const prep_acts = acts.map(row => {
										const {cliptitle, char, addinfos} = row;
										const ctitle = clickable(cliptitle);
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
										const ctitle = clickable(cliptitle);
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
										const ctitle = clickable(cliptitle);
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
										const ctitle = clickable(cliptitle);
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


							});
						}
					});
				});
			}
		});

		$.get('db/search/clip', {query: search}).done(results => {
			if (results.length > 0) {
				const clips_container = div('result-table');
				clips_container.append(div('result-header').text('Clips'));
				search_results.append(clips_container);

				results.forEach(clip => {
					const clip_result = div('result-row').text(clip.cliptitle);
					clips_container.append(clip_result);

					const arrow = $('<i class="fas fa-angle-down"></i>')
					clip_result.append(arrow);

					const more_info = div('more-info');
					clip_result.append(more_info);



					let fetched_infos = false;
					let loader;

					clip_result.click(() => {
						more_info.toggle();
						arrow.toggleClass('fa-angle-down fa-angle-up');
						if (!loader) {
							loader = div('loader');
							more_info.append(loader);
						}
						loader.fadeToggle(200);
						
						if (!fetched_infos) {
							$.get('db/search/clip/' + clip.clipid).done(result => {
								fetched_infos = true;
								loader.remove();
								const {cliptype, clipyear, rating, genres, languages, associatedcountries,
									 releasedates, runningtimes, cliplinks, acts, directs, produces, writes} = result;

								if (cliptype) {
									switch (clip.cliptype) {
										case 'TV':
											more_info.append(property('Type', ['TV movie']));
											break;
										case 'V':
											more_info.append(property('Type', ['video movie']));
											break;
										case 'VG':
											more_info.append(property('Type', ['video game']));
											break;
										default:
											break;

									}
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
										const name = clickable(fullname);
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
										const name = clickable(fullname);
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
										const name = clickable(fullname);
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
										const name = clickable(fullname);
										const staff = [name];
										staff.push(mkParenCsv(role, addinfos, worktype));
										return staff;
									});
									more_info.append(property_list('Written by', prep_writes));
								}

								if (cliplinks.length > 0) {
									more_info.append(property_list('Links', cliplinks.map(row => [row.linktype + ' ', clickable(row.cliptitle)])));
								}
							});
						}
					});
				})
			}
		});
	});
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
