$( function() {
	var deleteError = function (data, status) {
		alert("Error deleting post. Please try again. " +
		"Note that you cannot delete Twotes by another user!");
	}

	$('.delete-twote').click( function(e) {
		e.preventDefault();

		var twote = $(this);

		$.post('delete', {
			id: twote.attr('db')
		})
		.done( function (data, status) {
			console.log(status) ;
			twote.closest('.twote-box').remove();
		})
		.error(deleteError);
	})
});