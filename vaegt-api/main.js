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

function error(err) {
    if(document.body)
        document.body.innerHTML = "Øv der er sket en fejl: " + err;
    else
        window.onload = () => {
            document.body.innerHTML = "Øv der er sket en fejl: " + err;
        }
}

require(["post"], function (r) {
    if(r) {
        if(document.body) {
            try{
                r.makeSite(document.body)
            }
            catch(err) {
                error(err.toString());
            }
        }
        else
            window.onload = () => {
                try {
                    r.makeSite(document.body);
                }
                catch(err) {
                    error(err.toString());
                }
            }
    }
    else {
        error("Bad URL");
    }
}, error);
