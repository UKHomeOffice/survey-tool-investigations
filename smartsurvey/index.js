var request = require('request');
var _ = require('lodash');

//request('http://www.bing.com', function (error, response, body) {
//   if (!error && response.statusCode === 200) {
//       console.log(body);
//   }
//});

var options = {
    url: 'https://api.smartsurvey.io/v1/surveys/268842/responses',
    qs: {
        'api_token': process.env.API_TOKEN,
        'api_token_secret': process.env.TOKEN_SECRET,
        'completed': 2,
        'include_labels': 'true',
        'page_size': 5,
        'page':1
    },
    headers: {
        'User-Agent': 'request'
    }
};
var results = [];

function callback(error, response, body) {

    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);

        console.log(JSON.stringify(response.headers));

        _.forEach(info, function(value) {
            results.push(value.id);
        });

    }

    console.log(results);
}

request(options, callback);
