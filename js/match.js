var canvas = document.getElementById('colorhistcanvas'),
context = canvas.getContext('2d'),
returnValue = {};

function array256(default_value) {
  var arr = [];
  for (var i=0; i<256; i++) { arr[i] = default_value; }
  return arr;
}

function initHist() {
  returnValue.r = this.array256(0);
  returnValue.g = this.array256(0);
  returnValue.b = this.array256(0);
}

function hist() {
  initHist();
  var num = 0, r = [], g = [], b = [];
  for (var i = 0; i < image_data.length; i += 4) {
    if (image_data[i + 3] === 0) {
      continue;
    }
    num += 1;
    r.push(image_data[i]);
    g.push(image_data[i + 1]);
    b.push(image_data[i + 2]);
    returnValue.r[image_data[i]] += 1;
    returnValue.g[image_data[i + 1]] += 1;
    returnValue.b[image_data[i + 2]] += 1;
  }
  for (var i = 0; i < 256; i += 1) {
    returnValue.r[i] /= num;
    returnValue.g[i] /= num;
    returnValue.b[i] /= num;
  }
  var t;
  t = stat(r);
  returnValue.rvar = t.variance;
  returnValue.rmean = t.mean;
  t = stat(g);
  returnValue.gvar = t.variance;
  returnValue.gmean = t.mean;
  t = stat(b);
  returnValue.bvar = t.variance;
  returnValue.bmean = t.mean;
}

function loadPerson(source){
  context.clearRect (0, 0, canvas.width, canvas.height);
  base_image = new Image();
  base_image.crossOrigin = '';
  base_image.onload = function() {
    canvas.width = Math.min(base_image.width, 300);
    var ratio = canvas.width / base_image.width;
    canvas.height = Math.min(base_image.height * ratio, 300);
    ratio = canvas.height / base_image.height;
    canvas.width = base_image.width * ratio;
    context.drawImage(base_image, 0, 0, canvas.width, canvas.height);
    image_data = context.getImageData(0, 0, canvas.width, canvas.height).data;
    hist();
    match();
  }
  base_image.src = source;
}

function difference (pokey) {
  var diff = [0, 0, 0];
  for (var i = 0; i < 256; i += 32) {
    var v = {r:0, b:0, g:0},
    p = {r:0, b:0, g:0};
    for (var j = i; j < i + 32; j += 1) {
      v.r += returnValue.r[j];
      v.g += returnValue.g[j];
      v.b += returnValue.b[j];
      p.r += pokey.r[j];
      p.g += pokey.g[j];
      p.b += pokey.b[j];
      diff[1] -= Math.min(returnValue.r[j], pokey.r[j]);
      diff[1] -= Math.min(returnValue.g[j], pokey.g[j]);
      diff[1] -= Math.min(returnValue.b[j], pokey.b[j]);
    }
    diff[0] += Math.abs(v.r - p.r);
    diff[0] += Math.abs(v.g - p.g);
    diff[0] += Math.abs(v.b - p.b);
  }
  diff[2] -= 2 * cdf(Math.min(pokey.rmean, 2 * returnValue.rmean - pokey.rmean), returnValue.rmean, returnValue.rvar) + 2 * cdf(Math.min(returnValue.rmean, 2 * pokey.rmean - returnValue.rmean), pokey.rmean, pokey.rvar);
  diff[2] -= 2 * cdf(Math.min(pokey.gmean, 2 * returnValue.gmean - pokey.gmean), returnValue.gmean, returnValue.gvar) + 2 * cdf(Math.min(returnValue.gmean, 2 * pokey.gmean - returnValue.gmean), pokey.gmean, pokey.gvar);
  diff[2] -= 2 * cdf(Math.min(pokey.bmean, 2 * returnValue.bmean - pokey.bmean), returnValue.bmean, returnValue.bvar) + 2 * cdf(Math.min(returnValue.bmean, 2 * pokey.bmean - returnValue.bmean), pokey.bmean, pokey.bvar);
  // console.log("id: " + pokey.id + "; diff_0: " + diff[0] + "; diff_1: " + diff[1] + "; diff_2: " + diff[2] + ";");
  return diff[0] + diff[1] + diff[2];
}

function match() {
  var pokey;
  var id_pokey_dict = [];
  for (var i = 0; i < data.length; i++){
    pokey = data[i];
    id_pokey_dict.push([difference(pokey), pokey.id]);
  }
  id_pokey_dict.sort(function(pair1, pair2){
    return pair1[0] - pair2[0];
  });
  var result_canvas = document.getElementById('result'),
  result_context = result_canvas.getContext('2d'),
  result_image = new Image();
  result_context.clearRect ( 0, 0, result_canvas.width, result_canvas.height );
  result_image.onload = function() {
    result_canvas.width = result_image.width;
    result_canvas.height = result_image.height;
    result_context.drawImage(result_image, 0, 0);
    image_data = context.getImageData(0, 0, result_canvas.width, result_canvas.height).data;
  }
  result_image.src = "../img/all/" + id_pokey_dict[0][1] + ".png";
}

function run() {
  loadPerson($('#photo-url').val());
}