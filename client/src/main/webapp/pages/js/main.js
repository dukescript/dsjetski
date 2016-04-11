var viewModel = {};
requirejs.config({
    paths: {
        'knockout': 'libs/knockout/knockout-3.3.0',
        'jquery': 'libs/jquery/jquery-2.1.3.min',
        'jqueryui-amd': 'libs/jquery/jqueryui-amd-1.11.4.min',
        'ojs': 'libs/oj/v1.1.2/min',
        'ojL10n': 'libs/oj/v1.1.2/ojL10n',
        'ojtranslations': 'libs/oj/v1.1.2/resources',
        'signals': 'libs/js-signals/signals.min',
        'crossroads': 'libs/crossroads/crossroads.min',
        'text': 'libs/require/text',
        'promise': 'libs/es6-promise/promise-1.0.0.min',
        'hammerjs': 'libs/hammer/hammer-2.0.4.min'
    },
    shim: {
        'jquery': {
            exports: ['jQuery', '$']
        },
        'crossroads': {
            deps: ['signals'],
            exports: 'crossroads'
        }
    },

    config: {
        ojL10n: {
            merge: {
                //'ojtranslations/nls/ojtranslations': 'resources/nls/myTranslations'
            }
        }
    }
});

require(['ojs/ojcore', 'knockout', 'jquery', "ojs/ojmodule", 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojtoolbar', 'ojs/ojmenu', 'ojs/ojchart'], // add additional JET component modules as needed
        function (oj, ko, $) // this callback gets executed when all required modules are loaded
        {
            function RootViewModel() {
            }
            $(document).ready(
                    function ()
                    {
                        ko.applyBindings(new RootViewModel());
                    }
            );

        }
);

