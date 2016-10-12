"use strict";

let request = require('request');
let _ = require('lodash');
let results = [];
let pageSize = 10;
let pageTotal;
let noPages;
let pageNumber = 1;
// Choice id: 34809715 = Category 1
// Choice id: 34815818 = Category 2
// Choice id: 34809714 = Category 3 - Not used the internet but they want to (Willing & unable)
// Choice id: 34815817 = Category 3 - Was online and they want to be (Willing & unable)
// Choice id: 34809715 = Category 4
let categoryLogic = [
    {ID: 1017861 [{'34809714': 'Category 3: Willing & unable'}, {34809715: 'Category 1: Never have never will'}]},
    {ID: 1017937 [{'34815817': 'Category 3: Willing & unable'}, {34815818: 'Category 2: Was online but no longer'}]},
    {ID: 1017945 [{'34811143': 'No Category'}, {34811144: 'Category 4 Reluctantly online'}]}];

//let categoryLogic = [
//    [{'34809714': 'Category 3: Willing & unable'}, {34809715: 'Category 1: Never have never will'},
//        {'34815817': 'Category 3: Willing & unable'}, {34815818: 'Category 2: Was online but no longer'},
//        {'34811143': 'No Category'}, {34811144: 'Category 4 Reluctantly online'}]
//];


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
    return _.map(array, function(arrayItem){
        return {responseId: arrayItem.id,
         'questions': _.flatMap(arrayItem.pages, getQuestions)
        }
    });
}

function getQuestions(page) {
    return _.map(page.questions, breakUpQuestion);
}

function breakUpQuestion(question){
    //let questionObj = {
    //    qid: question.id,
    //    label: question.title,
    //    answers: question.answers
    //};

    //return _.map(categoryLogic, matchQuestion(categoryThing, question.id));
    return _.map(categoryLogic, matchQuestion);

    //let categoryNo = '';
    //_.forEach(result, function(page) {
    //    _.forEach(page.questions)
    //    ...
    //    ...
    //    ..
    //    categoryNo = '';
    //})


}

function matchQuestion(cLogic, qid) {
    console.log(cLogic.ID, qid);
    //return cLogic.ID === qid;
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

request(getOptions(pageNumber), callback);

