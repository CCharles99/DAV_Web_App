import tc_info_class as tc_info
import sys
import re
import json
import numpy as np
from collections import Counter

def main():
    """
    Retrieves time array, center array and basin of Tropical Cyclone data
    """
    if len(sys.argv) != 3: 
        print("Incorrect number of arguments", file=sys.stderr)
        return
    
    tc_id_list = json.loads(sys.argv[1])
    regex = re.compile(r'\d{5}')
    try:
        for tc_id in tc_id_list:
            try:
                if not bool(regex.fullmatch(tc_id)):
                    print(f"Incorrect number of digits {tc_id}", file=sys.stderr)
                    return
            except TypeError:
                print(f"tc_id is not a string {tc_id}", file=sys.stderr)
                return
    except TypeError:
        print(f"Incorrect id format {tc_id_list}", file=sys.stderr)
        return
    
    date = sys.argv[2]
    if date == 'null':
        date = None
    
    
    reader = tc_info.IbtracsReader('C:/Users/cjcha/Dev/ReactProjects/DAV_Web_App/backend/python_scripts/IBTrACS.ALL.v04r01.nc', columns=('iso_time', 'lat', 'lon', 'basin', 'name'))  # cols can be changed
    print('[', end='')
    for tc_id in tc_id_list:
        tc_data = reader.read(int(tc_id))
        
        center = np.stack((np.around(tc_data["lon"], 4), np.around(tc_data["lat"], 4)), axis=1).tolist()
        time = tc_data["iso_time"]

        if date is not None:
            selected_time, selected_center = zip(*[(time, center) for time, center in zip(time, center) if time.startswith(date)])

        result = dict()
        result["center"] = center if date is None else selected_center
        result["time"] = time if date is None else selected_time
        result["basin"] = Counter(tc_data["basin"]).most_common(1)[0][0]
        result["name"] = tc_data["name"]
        
        result = json.dumps(result)
        print(result + ',', end='')
    print('{}]')

  
if __name__ == "__main__":
    main()
