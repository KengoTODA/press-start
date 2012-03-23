var form = $('form#download');
form.submit(function(e) {
  var version = $('input:radio[name=version]:checked').val(),
      plugin = $('#plugin').val() || [],
      file_path = 'download/' + version;
  e.preventDefault();

  if (plugin.length > 0) { file_path += '_' + plugin.join('-'); }
  file_path += '.zip';
  document.location = file_path;
  return false;
});