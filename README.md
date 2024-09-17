# DAV_Web_App v1.0
Source code for FIT4701 FYP: Visualization system for tropical cyclone properties from satellite imagery

### Node.js
This app runs using [Node.js 18.16.0](https://nodejs.org/en/download/prebuilt-installer). Use the appropriate installer for your system. npm (node package manager) is included

### Python
Some backend operations are performed using [Python 3.11.9](https://www.python.org/downloads/release/python-3119/) (Other versions may work). Use the appropriate installer for your system. pip (preferred installer program) is included. 

On Windows create a virtual environment in the project directory by executing:

```
<your_root_directory>\DAV_Web_app> 
> python -m venv .venv
> pip install -r requirements
```

## Dependencies
### 1. Node packages
To install back-end dependencies:

``` 
<your_root_directory>\DAV_Web_app\backend>
> npm install
```

To install front-end dependencies:
```
<your_root_directory>\DAV_Web_app\dav-app> 
> npm install
```

### 2. Images
Images of TC tracks, DAV and IR data from September 2022 can be downloaded [here](https://drive.google.com/file/d/1W44e7pkiAhOfLftMlG9UOE1gHbotENM8/view?usp=sharing) and extracted as a subfolder of backend as following

```
DAV_WEB_APP
|
+--backend
|  |
|  +--images
|
+--frontend
etc...
```
### 3. Environmental variables
This app uses [mapbox](https://www.mapbox.com/) as the backbone of the map visualisations. Access tokens can be acquired by making an account. Refer to this [guide](https://docs.mapbox.com/help/getting-started/access-tokens/)

A file named .env must be created in the dav-app folder. Copy and paste in the following contents and include your own mapbox key
```
REACT_APP_BASE_URL=http://localhost:5000/
REACT_APP_MAPBOX_ACCESS_TOKEN=<your mapbox api key here>
```

## Run in Dev Mode
To run this app on Windows in development mode, use separate terminal windows to enter the dav-app and backend directories. In each terminal run:
```
<your_root_directory>\DAV_Web_app\backend> 
> ../.venv/Scripts/Activate.ps1
> npm start
```
``` 
<your_root_directory>\DAV_Web_app\dav-app>
> npm start
```

Further details about activating the python virtual environment and commands for mac/linux can be found [here](https://docs.python.org/3/library/venv.html)