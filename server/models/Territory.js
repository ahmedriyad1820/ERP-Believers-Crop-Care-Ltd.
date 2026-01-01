import mongoose from 'mongoose';

const territorySchema = new mongoose.Schema({
    territoryId: {
        type: String,
        required: true,
        trim: true
    },
    regionId: {
        type: String,
        required: true,
        trim: true
    },
    areaId: {
        type: String,
        required: true,
        trim: true
    },
    division: {
        type: String,
        required: true,
        trim: true
    },
    zilla: {
        type: String,
        required: true,
        trim: true
    },
    area: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

const Territory = mongoose.model('Territory', territorySchema);
export default Territory;
