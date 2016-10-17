"use strict";

let request = require('request');
let _ = require('lodash');
let results = [];
let pageSize = 10;
let pageTotal;
let noPages;
let pageNumber = 1;

let getOptions = function getOptions(currentPage) {
    if(!currentPage) {
        currentPage = 1;
    }

    return {
        url: 'https://api.smartsurvey.io/v1/surveys/268842/responses',
        qs: {
            'api_token': process.env.API_TOKEN,
            'api_token_secret': process.env.TOKEN_SECRET,
            'completed': 2,
            'include_labels': 'true',
            'page_size': pageSize,
            'page':currentPage
        },
        headers: {
            'User-Agent': 'request'
        }
    };
};


function callback(error, response, body) {

    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        _.forEach(info, function(value) {
            results.push(value);
        });

    }

    pageTotal = response.headers['x-ss-pagination-total'];
    noPages = getNoPages(pageTotal, pageSize);

    if (pageNumber <= noPages) {
        pageNumber = pageNumber + 1;
        request(getOptions(pageNumber), callback);
    }
    else {
        console.log(JSON.stringify(results))
    }
}

function getNoPages(pageTotal, pageSize){
    let val =  Math.floor(pageTotal / pageSize);

    if ((pageTotal % pageSize) > 0) {
        val++;
    }
    return val;

}

request(getOptions(pageNumber), callback);
