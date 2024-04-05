// Function to fetch lat and lon values and return the OpenStreetMap URL
function getLatLonAndRedirect(spreadsheet) {
  var latRange = spreadsheet.getRangeByName("lat");
  var lonRange = spreadsheet.getRangeByName("lon");

  var lat = latRange.getValue();
  var lon = lonRange.getValue();

  var openMapsUrl =
    "https://www.openstreetmap.org/?mlat=" +
    lat +
    "&mlon=" +
    lon +
    "#map=10/" +
    lat +
    "/" +
    lon;

  console.log(openMapsUrl);

  return openMapsUrl;
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
  var redirectUrl = getLatLonAndRedirect(spreadsheet);

  // Create an HTML output that displays the URL as a clickable link with a custom page title
  var htmlOutput = HtmlService.createHtmlOutput(
    "<html>" +
      "<head><title>View my location</title></head>" +
      "<body>" +
      "Click the link to view the location on OpenStreetMap: <a href='" +
      redirectUrl +
      "' target='_blank'>OpenStreetMap Link</a>" +
      "</body>" +
      "</html>"
  );

  return htmlOutput;
}
