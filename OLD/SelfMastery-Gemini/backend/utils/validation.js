// utils/validation.js
const { check } = require('express-validator');

// Validation rules for user registration
const userValidationRules = [
    check('name').notEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Invalid email address'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

// Validation rules for user login
const loginValidationRules = [
    check('email').isEmail().withMessage('Invalid email address'),
    check('password').notEmpty().withMessage('Password is required'),
];

// Validation rules for task list creation/update
const taskListValidationRules = [
    check('name').notEmpty().withMessage('Name is required'),
    check('color').notEmpty().withMessage('Color is required'), // Assuming color is a string like '#RRGGBB'
];

// Validation rules for task creation/update
const taskValidationRules = [
    check('title').notEmpty().withMessage('Title is required'),
    check('priority').isIn(['high', 'medium', 'low']).withMessage('Invalid priority value (must be high, medium, or low)'),
    // Optional: Add validation for due_date, reminder, recurring if needed
];

module.exports = {
    userValidationRules,
    loginValidationRules,
    taskListValidationRules,
    taskValidationRules
};