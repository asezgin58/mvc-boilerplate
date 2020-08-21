/*
 * Styles Import
 */
import './style/main.scss';

/*
 * Libs Import
 */
import $ from 'jquery';

/*
 * Ui Kit components Imports
 */

/*
 * Bootstrap Imports
 */
import 'popper.js/dist/umd/popper';
import 'bootstrap/dist/js/bootstrap.bundle';

/*
 * Helper Import
 */
import {detect} from 'detect-browser';
import {debounce} from 'throttle-debounce';

/*
 * Export JQuery to Global
 */
window.$ = $;
window.JQuery = $;

/*
 *
 * Application Main
 *
 */
const APP_DEV = {
    browser: detect(),
    debounce: debounce,
    initFunctions: {
        environmentEcho: function () {
            console.log('Hello There. Environment is:', process.env.NODE_ENV);
        },
        objectAssignPolyfill: function () {
            if (typeof Object.assign !== 'function') {
                Object.assign = function (target, varArgs) { // .length of function is 2
                    'use strict';
                    if (target == null) { // TypeError if undefined or null
                        throw new TypeError('Cannot convert undefined or null to object');
                    }

                    var to = Object(target);

                    for (var index = 1; index < arguments.length; index++) {
                        var nextSource = arguments[index];

                        if (nextSource != null) { // Skip over if undefined or null
                            for (var nextKey in nextSource) {
                                // Avoid bugs when hasOwnProperty is shadowed
                                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                    to[nextKey] = nextSource[nextKey];
                                }
                            }
                        }
                    }
                    return to;
                };
            }
        },
        stringIncludesPolyfill: function () {
            if (!String.prototype.includes) {
                String.prototype.includes = function () {
                    'use strict';
                    return String.prototype.indexOf.apply(this, arguments) !== -1;
                };
            }
        },
    },
    init: function () {
        for (let i in this.initFunctions) {

            let fn = this.initFunctions[i];

            if (this.initFunctions.hasOwnProperty(i) && i.charAt(0) !== '_' && typeof fn === 'function') {
                fn.call(this);
            }
        }
    }
};

$(() => {
    APP_DEV.init();
});
