$( function() {
	// Show twote-banner on twote-group hover
	$twoteBanner = $('#twote-banner');
	$twoteGroup = $('#twote-group')
	$loggedStatus = $('#logged-status');
	 
	function toggleBanner () { if (!$twoteBanner.hasClass('solid')) $twoteBanner.toggle( "slide", {'direction':'right'} ); }
	function solidifyBanner () {
		$twoteBanner.toggleClass('solid');
		$twoteGroup.toggleClass('inverted');
	}

	$twoteGroup.hover(toggleBanner);
	$twoteGroup.click(solidifyBanner);
});