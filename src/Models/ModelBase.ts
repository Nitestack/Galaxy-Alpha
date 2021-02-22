import { SchemaTypes } from "mongoose";

export const requiredString = {
    type: SchemaTypes.String,
    required: true
};

export const nullString = {
    type: SchemaTypes.String,
    default: null
};

export const requiredDefaultNumber = {
    type: SchemaTypes.Number,
    required: true,
    default: 0
};

export const requiredDefaultDate = {
    type: SchemaTypes.Date,
    required: true,
    default: new Date()
};

export const undefinedString = {
    type: SchemaTypes.String,
    required: true,
    default: undefined
};