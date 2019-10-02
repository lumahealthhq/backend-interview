#!/usr/bin/python3
import patientsinfo
import sys

#test case 1, get the call list by distance to location
#GPS position of London, we can switch to a real hospital in the future
london_coord =(51.5073219,  -0.1276474)
dlist=patientsinfo.GetCallListByDiatance(london_coord, 10)
if dlist == None:
    print("Test failed!")
    sys.exit(1)
else:
    print("success, call_list_by_distance:", dlist, len(dlist))
    #we display the 10 shortest distance:
    for p in dlist:
        print(p['distance'])


#test case 2
london_coord =(51.5073219,  -0.1276474)
alist=patientsinfo.GetCallListByAlgorithm(london_coord, 10)
if alist==None:
    print("alist failed")
    sys.exit(1)
else:
    print("alist:", alist)
    for p in alist:
        print(p['score'])

