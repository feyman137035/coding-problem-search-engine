/**
 * Problem Model
 * Represents a coding problem from various platforms
 */

const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Problem title is required'],
            trim: true,
        },
        platform: {
            type: String,
            required: [true, 'Platform is required'],
            enum: ['LeetCode', 'CodeChef', 'Codeforces'],
        },
        difficulty: {
            type: String,
            required: [true, 'Difficulty is required'],
            enum: ['Easy', 'Medium', 'Hard'],
        },
        tags: {
            type: [String],
            required: [true, 'At least one tag is required'],
            index: true,
        },
        url: {
            type: String,
            required: [true, 'Problem URL is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Problem description is required'],
            trim: true,
        },
        constraints: {
            type: String,
            required: [true, 'Constraints are required'],
            trim: true,
        },
        examples: [
            {
                input: {
                    type: String,
                    required: true,
                },
                output: {
                    type: String,
                    required: true,
                },
            },
        ],
        source: {
            type: String,
            required: [true, 'Source is required'],
            enum: ['scraped', 'algozenith'],
            default: 'scraped',
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt
    }
);

// Create text index for search on title, description, and tags
problemSchema.index({
    title: 'text',
    description: 'text',
    tags: 'text',
});

// Virtual for getting problem ID as string
problemSchema.virtual('id').get(function () {
    return this._id.toString();
});

// Ensure virtual fields are included in JSON
problemSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

module.exports = mongoose.model('Problem', problemSchema);
