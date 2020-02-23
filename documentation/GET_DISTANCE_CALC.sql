-- mYSQL function, 
-- returns distance in kilometers between coordinates past and coordinates from row
-- parameters to send: latitude, longitude (facility references)
-- call: getDistance(lat_field_name,long_field_name, facility_lat, facility_lon )

CREATE DEFINER=`lumahealth`@`%` FUNCTION `getDistance`(`lat1` FLOAT, `lng1` FLOAT, `lat2` FLOAT, `lng2` FLOAT)
	RETURNS int(11)
	LANGUAGE SQL
	NOT DETERMINISTIC
	CONTAINS SQL
	SQL SECURITY DEFINER
	COMMENT ''
BEGIN
	declare distance varchar(10);
	set distance = (
		select (6371 * acos( 
            cos( radians(lat2) ) 
            * cos( radians( lat1 ) ) 
            * cos( radians( lng1 ) - radians(lng2) ) 
            + sin( radians(lat2) ) 
            * sin( radians( lat1 ) )
    	)) as distance
	); 

if(distance is null) then 
	return '';
else 
	return distance;
end if;
END