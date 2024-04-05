// Function to fetch lat and lon values and return the OpenStreetMap URL
function getLocation(spreadsheet) {
  var lat = spreadsheet.getRangeByName("lat").getValue();
  var lon = spreadsheet.getRangeByName("lon").getValue();

  var openMapsUrl =
    "https://www.openstreetmap.org/?mlat=" +
    lat +
    "&mlon=" +
    lon +
    "#map=10/" +
    lat +
    "/" +
    lon;

  return { lat: lat, lon: lon, url: openMapsUrl };
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
  template.lat = location.lat;
  template.lon = location.lon;
  console.log(template);
  var htmlOutput = template.evaluate();

  return htmlOutput;
}
