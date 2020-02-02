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
    initFunctions: {
        environmentEcho: function () {
            console.log('Hello There. Environment is:', process.env.NODE_ENV);
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
