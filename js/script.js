$(function(){
  var $result = $('#result'), $plugin = $(':checkbox');
  $('form').submit(function(e) { return false; });
  $plugin.change(update);
  $result.focus(function(){
    $(this).select();
  });
  update();

  function update() {
    var plugin = $plugin.filter(':checked').map(function(){ return this.value; }).get();
    $result.text(createRakefile(plugin));
  }

  function createRakefile(plugin) {
    var content =
        "require 'net/https'\nrequire 'uri'\nrequire 'rake/packagetask'\nrequire 'rake/clean'\n\ntask :default => 'create_all'\nPACKAGE_NAME = 'MyGame'\nPACKAGE_VERSION = '1.0.0'\nOPTIMIZE_DIR = './optimize'\n\nCLEAN.include(FileList[OPTIMIZE_DIR])\n\nplugins = [#plugins]\nplugin_dependencies = {\n  'ui.enchant.js' => ['wise9/enchant.js/master/images/pad.png', 'wise9/enchant.js/master/images/apad.png'],\n  'nineleap.enchant.js' => ['wise9/enchant.js/master/images/start.png','wise9/enchant.js/master/images/end.png']\n}\n\ndef download(path)\n  uri = URI.parse('https://raw.github.com/' + path)\n  http = Net::HTTP.new(uri.host, uri.port)\n  http.use_ssl = true\n  http.verify_mode = OpenSSL::SSL::VERIFY_NONE\n  request = Net::HTTP::Get.new(uri.request_uri)\n  http.request(request).body\nend\n\nmultitask :create_all => ['index.html', 'game.js', 'enchant.js', 'require.js', 'order.js'] + plugins do |t|\n  puts 'all files have been created'\nend\n\nfile 'index.html' do |t|\n  File.open(t.name, 'w') {|f|\n    f << download('eller86/press-start/master/template/index.html')\n  }\nend\n\nfile 'game.js' do |t|\n  File.open(t.name, 'w') {|f|\n    f << download('eller86/press-start/master/template/game.js').sub(']', plugins.map{|filename| \",'order!\" + File.basename(filename, '.js') + \"'\"}.join() + ']')\n  }\nend\n\nfile 'enchant.js' do |t|\n  File.open(t.name, 'w') {|f|\n    f << download(\"wise9/enchant.js/master/enchant.js\")\n  }\nend\n\nfile 'require.js' do |t|\n  File.open(t.name, 'w') {|f|\n    f << download(\"jrburke/requirejs/master/require.js\")\n  }\nend\n\nfile 'order.js' do |t|\n  File.open(t.name, 'w') {|f|\n    f << download(\"jrburke/requirejs/master/order.js\")\n  }\nend\n\nfile \"build_profile.js\" do |t|\n  File.open(t.name, 'w') {|f|\n    f << download('eller86/press-start/master/template/build_profile.js')\n  }\nend\n\ndesc 'rule for official plugins'\nrule '.enchant.js' do |t|\n  File.open(t.name, 'w') {|f|\n    f << download('wise9/enchant.js/master/plugins/' + t.name);\n    plugin_dependencies[t.name].each{|resource|\n      file_name = File.basename(resource)\n      File.open(file_name, 'w') {|r|\n        r << download(resource);\n      }\n    } if !plugin_dependencies[t.name].nil?\n  }\nend\n\ndirectory OPTIMIZE_DIR\ntask 'optimize' => [OPTIMIZE_DIR, 'build_profile.js'] do\n  sh 'r.js -o build_profile.js'\nend\n\n# please execute this task in './optimize' directory if you want to package optimized-version\nRake::PackageTask.new(PACKAGE_NAME, PACKAGE_VERSION) do |p|\n  p.package_dir = './pkg'\n  p.package_files.include('./**/*')\n  p.need_zip = true\nend"
        .replace('#plugins', $.map(plugin, function(n){ return '"' + n + '"'; }).join(','));
    $('a#download').attr('href', 'data:application/octet-stream,' + encodeURIComponent(content));
    return content;
  }
});