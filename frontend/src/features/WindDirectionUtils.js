export const getWindDirection = (degrees) => {
    if (degrees >= 349 || degrees < 11) return "N";
    else if (degrees >= 12 && degrees < 33) return "NNE";
    else if (degrees >= 34 && degrees < 56) return "NE";
    else if (degrees >= 57 && degrees < 78) return "ENE";
    else if (degrees >= 79 && degrees < 101) return "E";
    else if (degrees >= 102 && degrees < 123) return "ESE";
    else if (degrees >= 124 && degrees < 146) return "SE";
    else if (degrees >= 147 && degrees < 168) return "SSE";
    else if (degrees >= 169 && degrees < 191) return "S";
    else if (degrees >= 192 && degrees < 213) return "SSW";
    else if (degrees >= 214 && degrees < 236) return "SW";
    else if (degrees >= 237 && degrees < 258) return "WSW";
    else if (degrees >= 259 && degrees < 281) return "W";
    else if (degrees >= 282 && degrees < 303) return "WNW";
    else if (degrees >= 304 && degrees < 326) return "NW";
    else if (degrees >= 326 && degrees < 348) return "NNW";
    else return "N";
};