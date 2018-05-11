$( () => {
	$.get("test", data => {
		$("#result").text(data.message);
	});
}, JSON);
