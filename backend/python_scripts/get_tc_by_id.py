import tc_info_class as tc_info
import sys
import re
import json
import numpy as np

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
    center = np.stack((np.around(tc_data["lon"], 4), np.around(tc_data["lat"], 4)), axis=1)
    
    result = {"center": center.tolist(), "time": tc_data["iso_time"] }
    result = json.dumps(result)
    print(result)
  
if __name__ == "__main__":
    main()
