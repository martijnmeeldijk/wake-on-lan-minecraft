var username_regex = /^[a-zA-Z0-9_]{3,16}$/;

$.fn.selectRange = function(start, end){
	if(!end) end = start;
	return this.each(function(){
		if (this.setSelectionRange) {
			this.focus();
			this.setSelectionRange(start, end);
		} else if (this.createTextRange) {
			var range = this.createTextRange();
			range.collapse(true);
			range.moveEnd('character', end);
			range.moveStart('character', start);
			range.select();
		}
	});
};

$(function(){
	'use strict';

	var motd_raw = $('#motd-raw');

	$('#username').blur(function(){
		var username;

		if (username_regex.exec($(this).val()))
			username = $(this).val();
		else
			username = 'Steve';

		$('#avatar').attr('src', 'https://minotar.net/helm/' + username + '/20.png').attr('alt', username);
	});

	$('#motd_center').change(function(e){
		update_motd();
	});

	motd_raw.keyup(function(e){
		update_motd();
	});

	motd_raw.keydown(function(e){
		if(e.keyCode == 13 && $(this).val().split("\n").length >= $(this).attr('rows'))
			return false;
	});

	$('#motd-toolbar button').click(function(e){
		var caretPos = motd_raw[0].selectionStart;
		var textAreaTxt = motd_raw.val();
		var txtToAdd = '&' + $(this).data('color');

		motd_raw.val(textAreaTxt.substring(0, caretPos) + txtToAdd + textAreaTxt.substring(caretPos)).focus();
		update_motd();
		motd_raw.selectRange(caretPos + 2);
	});

	$('#motd-toolbar button').tooltip({
		container: 'body'
	});

	$('#toggle-color-codes').click(function(e){
		$('#motd-toolbar').toggleClass('toggled');
		e.preventDefault();
	});

	$('#whitelist-create').click(function(e){
		if ($.trim($('#whitelist-usernames').val()) == '')
			return;

		$('#whitelist-create').button('loading');

		var form = $('#whitelist').serialize();

		$.post('/whitelist-creator/json', form, function(whitelist){
			var whitelist_pretty = JSON.stringify(whitelist['users'], null, 1);

			$('#whitelist-display').show();
			$('#whitelist-output').val(whitelist_pretty);

			$('#whitelist-link').attr('href', 'data:application/octet-stream;charset=utf-8;base64,' + window.btoa(whitelist_pretty));

			if (whitelist['errors'] != '') {
				$('#whitelist-errors').show();
				var ul = $('#whitelist-errors ul');

				ul.empty();

				$.each(whitelist['errors'], function(index, value){
					ul.append('<li>' + value + '</li>');
				});
			}

			else
				$('#whitelist-errors').hide();

			$('#whitelist-create').button('reset');
		});
	});

	$('.copy').click(function(){
		this.select();
	});
});

function update_motd() {
	var form = $('#motd').serialize();

	$.post('https://mctools.org/motd-creator/json', form, function(motd){
		$('#motd-preview').html(motd['html']);
	});
}