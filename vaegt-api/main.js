requirejs.config({
    baseUrl: '',
    paths: {
        d3: 'https://d3js.org/d3.v5.min',
        "aws-sdk": 'https://sdk.amazonaws.com/js/aws-sdk-2.7.16.min'
    }
});
// let a = document.createElement("a");
// a.href = window.location;
// console.log(a.pathname.split(".")[0].substr(1));
require([/*a.pathname.split(".")[0].substr(1)*/ "post"], function (r) {
    if(r) {
        if(document.body)
            r.makeSite(document.body);
        else
            window.onload = () => {
                r.makeSite(document.body);
            }
    }
    else {
        document.body.innerHTML = "Bad URL";
    }
});
