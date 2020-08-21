/*
 *
 * Application Main
 *
 */
const APP = {
    initFunctions: {
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
        jqueryExtends: function () {
            $.fn.extend(
                {
                    scrollToUp: function (speed, easing) {
                        return this.each(function () {
                            var targetOffset = $(this).offset().top - 15;
                            $('html,body').stop().animate({scrollTop: targetOffset}, speed, easing);
                        });
                    },

                    scrollToDown: function () {

                        return this.each(function () {
                            var targetOffset = $(document).height();
                            $('html,body').stop().animate({scrollTop: targetOffset}, 1200);
                        });
                    },

                    goUpButton: function (params) {

                        var $button = $(this);
                        var $window = $(window);
                        var defaultOptions = {
                            offset: $window.height(),
                            scrollAnimationDelay: 500
                        };

                        var options = {};

                        Object.assign(options, defaultOptions, params || {});

                        $window.on('scroll', function () {
                            $button.toggleClass('active', $window.scrollTop() + $window.height() > options.offset);
                        })

                        $button.on('click', function () {

                            $("html,body").scrollToUp();

                            $(this).addClass('active');
                        });

                    },

                    goDownButton: function (params) {
                        var $button = $(this);
                        var $window = $(window);
                        var $document = $(document);
                        var defaultOptions = {
                            offset: $window.height(),
                            scrollAnimationDelay: 500
                        };

                        var options = {};

                        Object.assign(options, defaultOptions, params || {});


                        $window.on('scroll', function () {
                            $button.toggleClass('active', $window.scrollTop() + $window.height() === options.offset);
                        });

                        $button.on('click', function () {

                            $("html,body").scrollToDown();

                            $(this).removeClass('active');
                        });

                        if ($window.height() !== $document.height()) {
                            $button.addClass('active');
                        } else {
                            $button.removeClass('active');
                        }
                    }
                });
        },
        scrollToId: function () {
            let $anchors = $('a[data-scroll-to-id]');

            if (!$anchors.length) {
                return;
            }

            $anchors.on('click', function (e) {
                e.preventDefault();
                const data = $(this).data('scroll-to-id');

                $(`#${data}`).scrollTo();
            });
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
    APP.init();
});
