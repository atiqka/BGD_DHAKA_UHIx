# Seasonal Urban Heat Index (UHIx) Mapping for Dhaka City Using Google Earth Engine
 
## Overview
 
This Google Earth Engine (GEE) script, developed by Atiq Kainan Ahmed, generates seasonal Urban Heat Index (UHIx) composites for Dhaka City, Bangladesh, using Landsat 9 Collection 2 Level-2 data. The workflow estimates heat stress conditions by combining land surface temperature (LST) and a proxy for relative humidity derived from the Normalized Difference Vegetation Index (NDVI).
 
The script produces mean seasonal UHIx maps for 2024 and exports them as GeoTIFF files to Google Drive for further analysis and visualization.
 
---
 
## Study Area
 
The analysis is conducted for the Dhaka Metropolitan Area (DMA), imported as a custom boundary asset:
 
```javascript
users/atiqka/DMA
```
 
---
 
## Data Sources
 
### Satellite Data
- Landsat 9 Collection 2 Tier 1 Level-2 Surface Reflectance
- Dataset ID:
 
```javascript
LANDSAT/LC09/C02/T1_L2
```
 
### Administrative Boundary
- Custom Earth Engine asset representing the Dhaka Metropolitan Area (DMA)
 
---
 
## Methodology
 
### 1. Land Surface Temperature (LST)
 
Surface temperature is derived from the Landsat thermal band (`ST_B10`) and converted from Kelvin to degrees Celsius.
 
### 2. Vegetation Index
 
NDVI is calculated using:
 
\[
NDVI = \frac{NIR - Red}{NIR + Red}
\]
 
where:
 
- NIR = SR_B5
- Red = SR_B4
 
### 3. Relative Humidity Proxy
 
A simplified relative humidity (RH) proxy is estimated from NDVI:
 
\[
RH = (NDVI \times 60) + 30
\]
 
### 4. Heat Index Calculation
 
The script computes a Heat Index based on temperature and the RH proxy using a modified meteorological heat index equation.
 
The resulting Heat Index layer is referred to as:
 
**Urban Heat Index (UHIx)**
 
---
 
## Seasonal Definitions
 
| Season | Months |
|----------|----------|
| Winter | December, January, February |
| Pre-monsoon | March, April, May |
| Monsoon | June, July, August, September |
| Post-monsoon | October, November |
 
For winter, December 2023 is combined with January-February 2024 to create the seasonal composite.
 
---
 
## Processing Workflow
 
1. Load Dhaka City boundary.
2. Filter Landsat 9 imagery:
   - Study area coverage
   - Seasonal date ranges
   - Cloud cover < 20%
3. Calculate:
   - Surface Temperature
   - NDVI
   - Relative Humidity Proxy
   - Urban Heat Index (UHIx)
4. Create mean seasonal composites.
5. Clip outputs to Dhaka City boundary.
6. Visualize results in Google Earth Engine.
7. Export seasonal GeoTIFFs to Google Drive.
 
---
 
## Outputs
 
The workflow generates four seasonal UHIx raster datasets:
 
- Dhaka_UHIx_Winter_Mean_2024_LC09.tif
- Dhaka_UHIx_Pre-monsoon_Mean_2024_LC09.tif
- Dhaka_UHIx_Monsoon_Mean_2024_LC09.tif
- Dhaka_UHIx_Post-monsoon_Mean_2024_LC09.tif
 
All outputs are exported to:
 
```
EarthEngineExports
```
 
Google Drive folder.
 
---
 
## Visualization
 
The following color palette is used for display:
 
```javascript
[
'440154',
'3b528b',
'21918c',
'5ec962',
'fde725',
'f7943d',
'cf4446',
'9e0142'
]
```
 
Low values indicate relatively cooler conditions, while higher values represent elevated heat stress.
 
---
 
## Requirements
 
- Google Earth Engine account
- Access to the DMA boundary asset
- Google Drive access for exports
 
---
 
## Author
 
** Atiq Kainan Ahmed **
Email: atiqka@yahoo.com
 
GitHub: https://github.com/atiqka
 
---
 
## Citation
 
If you use this script in research or operational applications, please cite this author and repository and acknowledge:
 
- Google Earth Engine
- Landsat 9 Collection 2 Level-2 Products
- Dhaka Metropolitan Area boundary dataset
 
---
 
## License
 
This project is released under the MIT License.
