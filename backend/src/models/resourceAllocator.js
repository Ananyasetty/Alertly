const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    name:
    {
        type: String,
        required: true
    },

    type:
    {
        type: String,
        enum: ['shelter', 'hospital', 'pharmacy', 'grocery'],
        required: true
    },
    location: {
        type:
        {
            type: String,
            default: 'Point'
        },
        coordinates:
        {
            type: [Number],
            required: true
        }, // [longitude, latitude]
    },
    availability:
    {
        type: String,
        default: 'unknown'
    }, // e.g., available, full, closed
});

ResourceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Resource', ResourceSchema);
