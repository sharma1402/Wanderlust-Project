const axios = require('axios');

async function forwardGeocode(address) {
    const apiKey = process.env.API_KEY;
    const baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

    try {
        const response = await axios.get(baseUrl, {
            params: {
                address,
                key: apiKey
            }
        });

        const data = response.data;

        if (data.status !== 'OK') {
            throw new Error(`Google Maps API error: ${data.status}`);
        }

        const { lng, lat } = data.results[0].geometry.location;
        const formatted_address = data.results[0].formatted_address;

        return {
            lng,
            lat,
            formatted_address
        };

    } catch (err) {
        console.error('Geocoding failed:', err.message);
        throw err;
    }
}

module.exports = forwardGeocode;
