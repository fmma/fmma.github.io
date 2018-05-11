requirejs.config({
    baseUrl: '',
    paths: {
        d3: 'https://d3js.org/d3.v5.min',
        'aws-sdk': 'https://sdk.amazonaws.com/js/aws-sdk-2.7.16.min'
    },
    
    shim: {
        'aws-sdk': {
            exports: 'AWS'
        }
   }
});

require(["site", "dom"], function (siteModule) {
    new siteModule.Site();
});
