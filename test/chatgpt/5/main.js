// Notification 1
$('#notifyBtn1').click(function() {
	$.notify('WHEN AMONG US', {
		position: 'top right',
		className: 'success',
	});
});

// Notification 2
$('#notifyBtn2').click(function() {
	$.notify('Congratulations! You won something from Name 2!', {
		position: 'top right',
		className: 'success',
	});
});

// Notification 3
$('#notifyBtn3').click(function() {
	$.notify('Congratulations! You won something from Name 3!', {
		position: 'bottom right',
		className: 'success',
	});
});
