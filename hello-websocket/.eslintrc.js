module.exports = {
    'extends': 'airbnb',
    'plugins': [
        'import'
    ],
    rules: {
        'import/no-extraneous-dependencies': [
            'error', {'devDependencies': ['**/*.test.js', '**/*.spec.js']}
        ],
        'indent': ['error', 4],
        'max-len': ['warn', 120],
        'no-mixed-operators': 'off', // broken
        'object-curly-spacing': ['warn', 'never'],
        'prefer-arrow-callback': ['error', {'allowNamedFunctions': true}],
    },
};
