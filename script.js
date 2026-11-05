// Load Dhaka City boundary
var dhakaCity = ee.FeatureCollection('users/atiqka/DMA');
Map.centerObject(dhakaCity, 11);
Map.addLayer(dhakaCity, {color: 'black'}, 'Dhaka City Boundary');

// Define seasons and their month ranges (client-side)
var seasonDefs = {
  'Winter': ['12', '01', '02'],
  'Pre-monsoon': ['03', '04', '05'],
  'Monsoon': ['06', '07', '08', '09'],
  'Post-monsoon': ['10', '11']
};

// UHIx computation function
var computeUHIx = function(image) {
  var tempC = image.select('ST_B10')
    .multiply(0.00341802).add(149.0).subtract(273.15)
    .rename('Temp_C');

  var ndvi = image.select('SR_B5').subtract(image.select('SR_B4'))
    .divide(image.select('SR_B5').add(image.select('SR_B4')))
    .rename('NDVI');

  var rh = ndvi.multiply(60).add(30).rename('RH');

  var heatIndex = tempC.expression(
    '-8.784695 + 1.61139411*T + 2.338549*RH - 0.14611605*T*RH - 0.012308094*T*T - 0.016424828*RH*RH + 0.002211732*T*T*RH + 0.00072546*T*RH*RH - 0.000003582*T*T*RH*RH',
    {T: tempC, RH: rh}
  ).rename('Heat_Index_C');

  return heatIndex.set('system:time_start', image.get('system:time_start'));
};

// Loop through seasons client-side
Object.keys(seasonDefs).forEach(function(seasonName) {
  var months = seasonDefs[seasonName];

  // Collect images for 2024 only
  var imageList = months.map(function(month) {
    month = ee.String(month);
    var yearAdjusted = month.equals('12') ? ee.Number(2023) : ee.Number(2024);
    var yearStr = yearAdjusted.format('%d');
    var start = ee.Date(yearStr.cat('-').cat(month).cat('-01'));
    var end = start.advance(1, 'month');

    return ee.ImageCollection('LANDSAT/LC09/C02/T1_L2')  // Landsat 9
      .filterBounds(dhakaCity)
      .filterDate(start, end)
      .filter(ee.Filter.lt('CLOUD_COVER', 20))
      .map(computeUHIx);
  });

  // Flatten and convert to ImageCollection
  var flatList = ee.List(imageList).iterate(function(ic, list) {
    return ee.List(list).cat(ee.ImageCollection(ic).toList(100));
  }, ee.List([]));

  var seasonCollection = ee.ImageCollection(ee.List(flatList));
  var seasonMean = seasonCollection.mean().clip(dhakaCity);

  // Add to map
  Map.addLayer(seasonMean, {
    min: 25, max: 45,
    palette: ['440154', '3b528b', '21918c', '5ec962', 'fde725', 'f7943d', 'cf4446', '9e0142']
  }, seasonName + ' 2024');

  // Export to Google Drive
  Export.image.toDrive({
    image: seasonMean,
    description: 'Dhaka_UHIx_' + seasonName + '_Mean_2024_LC09',
    folder: 'EarthEngineExports',
    fileNamePrefix: 'Dhaka_UHIx_' + seasonName + '_Mean_2024_LC09',
    scale: 30,
    region: dhakaCity.geometry().bounds(),
    maxPixels: 1e13
  });

  // Confirmation message
  print('Export task created for ' + seasonName + ' UHIx composite (2024).');
  print('File will be saved to Google Drive in folder: "EarthEngineExports"');
  print('File name: Dhaka_UHIx_' + seasonName + '_Mean_2024.tif');
});

