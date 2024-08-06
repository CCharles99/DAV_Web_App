import tc_info_class as tc_info
import sys
import re
import json

def main():
    if len(sys.argv) != 2: 
        print("Incorrect number of arguments", file=sys.stderr)
        return
    
    tc_id = sys.argv[1]
    regex = re.compile(r'\d{5}')
    if not bool(regex.fullmatch(tc_id)):
        print("Incorrect id format", file=sys.stderr)
        return
    
    reader = tc_info.IbtracsReader('C:/Users/cjcha/Dev/ReactProjects/DAV_Web_App/backend/python_scripts/IBTrACS.ALL.v04r01.nc', columns=('iso_time', 'lat', 'lon'))  # cols can be changed
    tc_data = reader.read(int(tc_id))
    
    result = {"lat": [round(lat, 4) for lat in tc_data["lat"]], "lng": [round(lng, 4) for lng in tc_data["lon"]], "time": tc_data["iso_time"] }
    result = json.dumps(result)
    print(result)
  
if __name__ == "__main__":
    main()
