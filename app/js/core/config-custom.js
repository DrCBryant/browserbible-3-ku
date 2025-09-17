/*
 * Project-specific configuration overrides.
 *
 * This default file keeps the build output self-contained by ensuring a
 * config file is always copied into the build/ directory.  Customize these
 * values as needed for deployment environments.
 */
/* global sofia, $ */

if (typeof sofia === 'undefined') {
  throw new Error('The global "sofia" namespace must be loaded before config-custom.js.');
}

// Extend the default configuration with any overrides for the build.
sofia.config = $.extend(true, sofia.config, {});

// Ensure an object exists for optional custom configurations.
if (typeof sofia.customConfigs === 'undefined') {
  sofia.customConfigs = {};
}
