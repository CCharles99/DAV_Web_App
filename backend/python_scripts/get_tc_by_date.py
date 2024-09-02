import tc_info_class as tc_info
import sys
import re
import json

def main():
    if len(sys.argv) != 2: 
        print("Incorrect number of arguments", file=sys.stderr)
        return
    
    date = sys.argv[1]
    regex = re.compile(r'\d{4}-\d{2}-\d{2}')
    if not bool(regex.fullmatch(date)):
        print("Incorrect date format", file=sys.stderr)
        return
    
    reader = tc_info.IbtracsReader('C:/Users/cjcha/Dev/ReactProjects/DAV_Web_App/backend/python_scripts/IBTrACS.ALL.v04r01.nc', columns=('name'))  # cols can be changed
    tc_ids = set()
    for i in [3*x for x in range(8)]:
        time = f"{(i):02d}-00-00"
        tc_ids = tc_ids | set(reader.lookup_date(f"{date} {time}"))

    result = []
    for tc_id in tc_ids:
        result.append({"id": str(tc_id), "name": reader.read(tc_id)["name"]})

    result = json.dumps(result)
    print(result)

    
if __name__ == "__main__":
    main()
