const Resource = require('../models/resourceAllocator');

// Get all resources
exports.getAllResources = async (req, res) => {
    try {
        const resources = await Resource.find({});
        res.json(resources);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Get nearby resources based on location and optional type filter
exports.getNearbyResources = async (req, res) => {
    const { lat, lon, type } = req.query;
    if (!lat || !lon) {
        return res.status(400).json({ message: 'Latitude and Longitude are required' });
    }

    try {
        const query = {
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lon), parseFloat(lat)],
                    },
                    $maxDistance: 10000, // within 10 km radius
                },
            },
        };

        if (type) {
            query.type = type;
        }

        const resources = await Resource.find(query);
        res.json(resources);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Add a new resource (optional, for admin use)
exports.addResource = async (req, res) => {
    const { name, type, latitude, longitude, availability } = req.body;

    if (!name || !type || !latitude || !longitude) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        const newResource = new Resource({
            name,
            type,
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)],
            },
            availability: availability || 'unknown',
        });

        const savedResource = await newResource.save();
        res.status(201).json(savedResource);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};
