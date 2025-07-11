def classify_hazard(station):
    air_temp  = station['temperature_2m']
    # road_temp = station['temp_road']
    snow = station['snowfall']
    precip = station['precipitation']
    wind = station['wind_speed_10m']

    # Handle missing data
    if air_temp is None:
        return 'gray'

    # Use fallback: if air temp missing, rely on road temp
    temp = air_temp if air_temp is not None else road_temp

    # 1. Freezing rain risk
    if precip and precip > 0:
        if (air_temp is not None and air_temp < 0):
            return 'red'

    # 2. Snow accumulating on cold surface
    if snow and snow >= 2 and temp < 0:
        return 'red'

    # 3. Blowing snow hazard
    if wind and wind > 30 and snow and snow > 0:
        return 'red' 
    
    # 4. Light snow or slushy conditions
    if (snow and snow > 0 and temp < 1) or (precip and precip > 0 and 0 <= temp < 2):
        return 'yellow'
    
    # 5. Heavy rain, warm / Heavy rain, near/below freezing (< 2°C)
    if precip and precip > 5:
        return 'yellow' if temp >= 2 else 'red'
    
    # 6.Strong wind hazard (even if dry)
    if wind and wind >= 50:
        return 'yellow' 

    # 7. Warm or dry
    return 'green'

# NOTES:    
# Gray - Missing air and road temp	
# Red - Freezing rain (wet & below 0°C air or road)	
# Red - Snow on cold road (snow depth ≥ 2, air < 0°C)
# Red - Blowing snow hazard
# Yellow - Light snow (snow > 0, air < 1°C)	or Rain when air or road is just above freezing (slush risk)
# Yellow - Heavy rain, warm / Heavy rain, near/below freezing (< 2°C)
# Yellow - Strong wind	
# Green - Warm, dry, or rain > 0mm but air/road temp well above 0°C	

