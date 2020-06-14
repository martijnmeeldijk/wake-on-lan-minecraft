$('#motd').change(update_motd);

function update_motd() {
	var form = $('#motd').serialize();

	$.post('https://mctools.org/motd-creator/json', form, function(motd){
		$('#motd-preview').html(motd['html']);
	});
}