import tc_info_class as tc_info

reader = tc_info.IbtracsReader('IBTrACS.ALL.v04r01.nc', columns=('iso_time', 'lat', 'lon', 'name'))  # cols can be changed
katrina = reader.read('Katrina', 2005)  # gives an array of cyclones.

bday_id = reader.lookup_date('2022-09-30 09-00-00')  # array of IDs
print(bday_id)
bday = reader.read(bday_id[0])  # gives a single cyclone

print(bday['lat'][32])
print(bday['name'])
print(katrina[0]['iso_time'].index('2005-08-23 18-30-00'))
print(len(katrina))
print(repr(reader))

# for a selected date loop through the times of that date to get existing cyclones
# list cyclones in accordion
# when a cyclone is clicked its ID is read and lat, lng and times are returned
# cyclone view is displayed: center, zoom and bounds are updated dynamically