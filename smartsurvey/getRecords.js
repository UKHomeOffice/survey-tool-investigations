"use strict";

let request = require('request');
let _ = require('lodash');
let results = [];
let pageSize = 10;
let pageTotal;
let noPages;
let pageNumber = 1;
let subResponse = require('./data/subsetResponse.json');

// Choice id: 34809715 = Category 1
// Choice id: 34815818 = Category 2
// Choice id: 34809714 = Category 3a - Not used the internet but they want to (Willing & unable)
// Choice id: 34815817 = Category 3b - Was online and they want to be (Willing & unable)
// Choice id: 34809715 = Category 4

let categoryLogic =
    [{'34809714': 'Category 3'}, {'34809715': 'Category 1'},
        {'34815817': 'Category 3'}, {'34815818': 'Category 2'},
        {'34811143': 'No Category'}, {'34811144': 'Category 4'}];
let categoryIDs = [34809714, 34809715, 34815817, 34815818, 34811143,
    34811144];


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

function getResponses(array) {
    let choiceData= {};

    array.forEach(function(item) {

        let itemId = item.id;
        choiceData[itemId] = [];

        item.pages.forEach(function(page) {
           page.questions.forEach(function(question) {
               question.answers.forEach(function(answer) {
                 choiceData[itemId].push(answer.choice_id);
               });
           });
        });
    });
    getCategory(choiceData);
}

function getCategory(choiceData) {
    let exitChoices = [];
    _.forEach(choiceData, function(values, key){
        _.forEach(values, function(value){
          if (categoryIDs.indexOf(value) !== -1) {
              exitChoices.push(value);
          }
        });
    });
    countRepeats(exitChoices);
}

function countRepeats(array) {
    let a = {};

    for (var i = 0; i < array.length; i++) {
        let k = array[i];
        if (!a[k]) {
            a[k] = 0;
        }

        a[k] = a[k] + 1;

    }
    convertCat(a);
}

function convertCat(items) {
    let convertedItems = {};

    _.forEach(categoryLogic, function(val, key) {
        let k = _.keys(val);
        let v = _.values(val);
        if (items[k]) {
            convertedItems[v] = items[k];
        }
    });
    console.log(convertedItems);
}



function callback(error, response, body) {

    if (!error && response.statusCode === 200) {
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
    } else {
        // Next server call
        //console.log(JSON.stringify(getResponses(results), null, 2));
        (getResponses(results));
    }
}

function getNoPages(pageTotal, pageSize){
    let val =  Math.floor(pageTotal / pageSize);

    if ((pageTotal % pageSize) > 0) {
        val++;
    }
    return val;

}

(getResponses(subResponse));

//request(getOptions(pageNumber), callback);

