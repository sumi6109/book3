function analyze(){

  //
  // Getting To Know the Data
  //

  heading('Examples')

  ask('how many measurements were included in this dataset?', example1)

  ask('how many samples does each measurement contain?', example2)

  ask('at the 10-th measurement, what are valid sample values (> 0)?', example3)
  // a sample value is valid if it is greater than zero

  heading('Measurements and Samples')

  ask('how many unique non-zero, non-negative sample values in this dataset? what are they?', func1)

  ask('what is the average time (seconds) between two measurements?', func2)

  ask('at 09:57:18, how many samples in this measurement have the value 7?', func3)

  ask('which measurement has the most number of samples with the value 3?', func4)

  ask('how many measurements have no sample value greater than zero?', func5)

  ask('which valid (i.e., greater than zero) sample value is the most common?', func6)

  heading('Mapping')

  ask('when was the boat furthest away from NYC (40.7127 N, 74.0059 W)? what was the distance?', func7)
  // use Leaflet to draw a line between NYC and this "furtherest away" location

  ask('what was the path of the boat?', func8)
  // use Leaflet to draw a line between every two locations

  ask('where were the most common sample value measured?', func9)
  // say, your answer to Question Six is 13, draw a marker for each measurement that has
  // at least one sample whose value is 13

  ask('how does the desensity of valid sample values change across the geographical area?', func10)
  // use the brightness to indicate high number of valid sample values each
  // for each measurement, draw a marker,
  // use the brightness to represent the number of valid samples
  // the brighter a spot, the higher the number
  // for those measurements without a valid sample, draw nothing

  heading('Science')

  ask('what is the distribution of fish?', func11)

  ask('what is the distribution of  are schools of zooplankton?', func12)


  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  })
  toggleSourecode()
}

function example1(){
  return items.length
}

function example2(){
  return items[0].Samples.length
}

function example3(){
  return _.filter(items[9].Samples, function(d){
    return d > 0
  }).join(', ')
}
//how many unique non-zero, non-negative sample values in this dataset? what are they?',
function func1(){
  var sam =_.uniq(_.flatten(_.map(items,'Samples')))

  sam =_.filter(sam,function(d){return _.parseInt(d) >0})
  console.log(sam)

  return sam.join(': ')
}

function func2(){

  var timeDiff = _.map(items, function(d, i) {
    if (i == 0) return 0
    else {
      var s = items[i-1].Ping_time.split(':')
      var t0 = parseInt(s[0]) * 3600+ parseInt(s[1]) * 60 + parseInt(s[2])

      str = items[i].Ping_time.split(':')
      var t1 = parseInt(str[0]) * 3600+ parseInt(str[1]) * 60 + parseInt(str[2])

      return t1 - t0
    }
  })

  // Return average of the time differences
  return _.round(_.sum(timeDiff)/timeDiff.length) + ' seconds'
}
//'at 09:57:18, how many samples in this measurement have the value 7?
function func3(){
  var pt =_.filter(items,function(d){return d.Ping_time =='09:57:18'})
  pt=_.filter(pt,function(d){ return _.includes(d.Samples,7) })

  return pt.length
}
//which measurement has the most number of samples with the value 3
function func4(){
var pt =_.map(items,function(d){
      var lt = _.filter(d.Samples,function(t){return t==3}).length
      return { 'Ping_index': d.Ping_index, 'Count': lt }



})
pt =_.sortBy(pt,'Count').reverse()

  return pt[0].Ping_index
}

function func5(){
  var pt =_.map(items,function(d){
        var lt = _.filter(d.Samples,function(t){return t>0}).length
        return { 'Count': lt }
  })
  pt =_.filter(pt,function(t){return t.Count==0})

    return pt.length

//  return '...'
}
//which valid (i.e., greater than zero) sample value is the most common?
var MC
function func6(){
   MC= _.chain(items)
    .map('Samples')
    .flatten()
    .filter(function(d) { return d > 0 })
    .groupBy()
    .mapValues('length')
    .pairs()
    .max(function(d) { return d[1] })
    .value()[0]

    return MC
}

function func7(){

  // this sample code shows how to display a map and put a marker to visualize
  // the location of the first item (i.e., measurement data)
  // you need to adapt this code to answer the question

  var first = items[0]
  var pos = [first.Latitude, first.Longitude]

  var coordNYC = {latitude: 40.7127, longitude: -74.0059}
  var el = $(this).find('.viz')[0]    // lookup the element that will hold the map
  $(el).height(500) // set the map to the desired height
  var map = createMap(el, pos, 5)
  var coord = _.map(items,function(d){
    var coord = {latitude: d.Latitude, longitude: d.Longitude}
          return [geolib.getDistance(coordNYC, coord), d.Latitude, d.Longitude]


  })
  coord=_.max(coord,function(d){return d[0]})
  var boat = [parseFloat(coord[1]), parseFloat(coord[2])]
  var latlngs = [[40.7127, -74.0059], boat]
  L.polyline(latlngs, {color: 'black'}).addTo(map)
  return 'Distance was ' + coord[0]/1000 + ' km'

}
//what was the path of the boat?

function func8(){

  var center = geolib.getCenter([
        {latitude: items[0].Latitude, longitude: items[0].Longitude},
        {latitude: items[items.length-1].Latitude, longitude: items[items.length-1].Longitude}
      ])

    var pos = [center.latitude, center.longitude]
    var el = $(this).find('.viz')[0]
    $(el).height(500)
    var map = createMap(el, pos, 12)
  _.forEach(items, function(d, i) {
      var latlng1 = [parseFloat(d.Latitude), parseFloat(d.Longitude)]

      if (i == 0) {
        //var marker = L.marker(latlng1).addTo(map)
      //  marker.bindPopup('Starting Point').openPopup()
      } else {
        var latlng0 = [parseFloat(items[i-1].Latitude), parseFloat(items[i-1].Longitude)]
        var latlngs = [latlng0, latlng1]
        var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map)
      }
    })

  return '...'
}

function func9(){
  var center = geolib.getCenter([
        {latitude: items[0].Latitude, longitude: items[0].Longitude},
        {latitude: items[items.length-1].Latitude, longitude: items[items.length-1].Longitude}
      ])

    var pos = [center.latitude, center.longitude]
    var el = $(this).find('.viz')[0]
    $(el).height(500)
    var map = createMap(el, pos, 12)

    _.forEach(items, function(d, index) {
  if (_.includes(d.Samples, MC)) {
    var latlng = [parseFloat(d.Latitude), parseFloat(d.Longitude)]
    L.circle(latlng, 50, {color: 'red', fillOpacity: 0.5}).addTo(map)
  }
})



  return '...'
}
//how does the desensity of valid sample values change across the geographical area?'
function func10(){
  var center = geolib.getCenter([
        {latitude: items[0].Latitude, longitude: items[0].Longitude},
        {latitude: items[items.length-1].Latitude, longitude: items[items.length-1].Longitude}
      ])

    var pos = [center.latitude, center.longitude]
    var el = $(this).find('.viz')[0]
    $(el).height(500)
    var map = createMap(el, pos, 12)
    var valid = _.map(items, function(d) {
        var count = _.filter(d.Samples, function(s) { return s > 0 }).length
        return [d.Latitude, d.Longitude, count]
      })
      var colors = ['#F3C7C7', '#F49C9C', '#F44646', '#F71D1D', '#961515', '#530C0C', '#430202',
    '#240101', '#1A0202', '#0F0000']


      _.forEach(valid, function(c){
      if(c[2] != 0) {
        var latlng = [parseFloat(c[0]), parseFloat(c[1])]
        //var color = 'rgb(c[2]*100,0,0)'
        var color = colors[parseInt(c[2]/10)]
        L.circle(latlng, 5, { color:color, fillOpacity:1}).addTo(map);
      }
    })

  return '...'
}
function func11(){

  var f_d = _.map(items, function(d) {
    return _.map(d.Samples, function(s, index) {
      var value = _.round(parseFloat(s))
      return _.includes([3, 32, 39, 52, 1, 45, 40, 10, 11, 4, 37, 53, 8, 33, 30], value) ? index * 2 : null
    })
  })


  var ft = _.zip.apply(_, f_d)


  var f_pos = _.filter(ft, function(d) { return _.sum(d) != 0 })


  var longitude = []
  var start = parseFloat(items[0].Longitude)
  var end = parseFloat(items[items.length-1].Longitude)
  var step = (end - start)/400
  for (i = 0; i < 400; i++) longitude[i] = (start + i * step)


  var el = $(this).find('.viz')[0]
  $(el).height(500)

  var options = {
    showLine: false,
    axisX: { labelInterpolationFnc: function(value, i) {
      return i % 50 === 0 ? value : null
      }
    }
  }

  var data = {
    labels: longitude,
    series: f_pos
  }

  new Chartist.Line(el, data, options)

  return '...'
}
function func12()
{

  return '..'
}
