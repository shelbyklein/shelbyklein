// Run through Photoshop MCP. Works on duplicates; never saves the source PSDs.
var root = Folder('~/.photoshop-mcp/exports/inksplit'); root.create();
var input = '/Users/shelbyklein/Vibes/inksplit/output/';
var names = ['nextplay-v2', 'ghost-frequency-v2', 'velvet-voltage'];
var rows = [];
function savePNG(doc, path) {
  var opts = new ExportOptionsSaveForWeb();
  opts.format = SaveDocumentType.PNG; opts.PNG8 = false; opts.transparency = true;
  doc.exportDocument(new File(path), ExportType.SAVEFORWEB, opts);
}
for (var n = 0; n < names.length; n++) {
  var id = names[n], folder = new Folder(root + '/' + id); folder.create();
  var src = app.open(new File(input + id + '/' + id + '.psd'));
  var doc = src.duplicate('Web export ' + id);
  doc.resizeImage(UnitValue(600, 'px'), null, null, ResampleMethod.BICUBIC);
  var layers = [], labels = [];
  for (var i = doc.layers.length - 1; i >= 0; i--) {
    var l = doc.layers[i];
    if (l.visible) { layers.push(l); labels.push(l.name); }
    l.visible = false;
  }
  for (var i = 0; i < layers.length; i++) {
    layers[i].visible = true;
    savePNG(doc, folder + '/build-' + i + '.png');
  }
  savePNG(doc, folder + '/complete.png');
  for (var i = 0; i < layers.length; i++) layers[i].visible = false;
  for (var i = 0; i < layers.length; i++) {
    layers[i].visible = true; savePNG(doc, folder + '/layer-' + i + '.png'); layers[i].visible = false;
  }
  var height = Number(doc.height.as('px'));
  doc.close(SaveOptions.DONOTSAVECHANGES);
  var ref = app.open(new File(input + id + '/source.png'));
  var small = ref.duplicate('Reference export');
  small.resizeImage(UnitValue(600, 'px'), null, null, ResampleMethod.BICUBIC);
  savePNG(small, folder + '/original.png'); small.close(SaveOptions.DONOTSAVECHANGES);
  rows.push({id:id,height:height,layers:labels});
}
return rows;
