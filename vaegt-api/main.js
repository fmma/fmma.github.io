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
    const msg = "Øv der er sket en fejl: ";
    if(document.body)
        document.body.innerHTML = msg + err;
    else
        window.onload = () => {
            document.body.innerHTML = msg + err;
        }
}

if(!window.location.hash)
{
    window.location.hash = "post";
}

require([window.location.hash.substr(1), "dom"], function (r) {
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
