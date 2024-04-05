# Description

This project allows you to setup a Google App Script which logs your Osmand location to a Google Sheet.
If you follow the app url without any query params you will get a link to an openmaps link where you can view your position.

# Setup

1. Open Google Sheets
1. Rename one of the sheets to 'data'
1. Set 2 named ranges, 'lat' and 'lon' to A2 and B2 in the 'data' sheet.
1. Click "Extensions" and "App scripts"
1. Remove existing Code an copy the code from this repo.
1. Click deploy and enable anyone to access the app.
1. Save the appscript url to the Osmand app and append with the parameters e.g. {{ app url }}?lat={0}&lon={1}&timestamp={2}&hdop={3}&altitude={4}&speed={5}
1. Start tracking
1. If you visit the {{ app url }} you will be able to open a map with your location.
