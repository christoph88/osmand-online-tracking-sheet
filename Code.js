function isWithinRadius(lat1, lon1, lat2, lon2, radius) {
  const R = 6371; // Earth’s radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const rLat1 = toRadians(lat1);
  const rLat2 = toRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers

  return distance <= radius;
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

// Function to fetch lat and lon values and return the OpenStreetMap URL
function getLocation(spreadsheet) {
  var lat = spreadsheet.getRangeByName("lat").getValue();
  var lon = spreadsheet.getRangeByName("lon").getValue();

  var latHome = 51.12509;
  var lonHome = 5.3676;
  var kmRadius = 0.5;
  const withinSafezone = isWithinRadius(latHome, lonHome, lat, lon, kmRadius);
  var safeLat = withinSafezone ? latHome : lat;
  var safeLon = withinSafezone ? lonHome : lon;

  var openMapsUrl =
    "https://www.openstreetmap.org/?mlat=" +
    safeLat +
    "&mlon=" +
    safeLon +
    "#map=10/" +
    safeLat +
    "/" +
    safeLon;

  return {
    lat: safeLat,
    lon: safeLon,
    url: openMapsUrl,
    withinSafezone: withinSafezone,
  };
}

function doGet(e) {
  // Log the parameters received in the URL
  var params = e.parameter;
  console.log(params);
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("data");

  if (
    params.lat &&
    params.lon &&
    params.timestamp &&
    params.hdop &&
    params.altitude &&
    params.speed
  ) {
    // Clear the sheet before appending the new row
    sheet.clear();

    // Append the new row
    sheet.appendRow(["lat", "lon", "timestamp", "hdop", "altitude", "speed"]);
    sheet.appendRow([
      params.lat,
      params.lon,
      params.timestamp,
      params.hdop,
      params.altitude,
      params.speed,
    ]);

    // Return a simple message to acknowledge the reception
    return ContentService.createTextOutput("Parameters logged successfully.");
  }

  // Generate the OpenStreetMap URL
  return createTemplate(spreadsheet);
}

function createTemplate(spreadsheet) {
  var location = getLocation(spreadsheet);
  // Use the HTML file, passing the URL to it
  console.log(location, "template");
  var template = HtmlService.createTemplateFromFile("MapView");
  // Pass variables to the HTML template
  template.mapUrl = location.url;
  template.withinSafezone = location.withinSafezone;
  template.lat = location.lat;
  template.lon = location.lon;
  console.log(template);
  var htmlOutput = template.evaluate();

  return htmlOutput;
}
