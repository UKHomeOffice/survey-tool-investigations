'use strict';
let _ = require('lodash');

// Authenticate / Token

// Get Surveys

// Identify Target Survey

// Retrieve Full Details of Survey
let surveyData = require('./data/survey.json');

// Retrieve Bulk Survey Responses
let responseData = require('./data/responses.json');

// Filter Survey structure
let mapAnswers = function(answer) {
    return {
        aid: answer.id,
        label: answer.text
    }
};

let mapQuestions = function(question) {
    return {
        qid: question.id,
        label: _.get(question, 'headings[0].heading', 'No label'),
        answers: _.map(question.answers.choices, mapAnswers)
    }
};

let mapPages = function(value) {
    return _.map(value.questions, mapQuestions);
};


let filteredSurvey = _.flatMap(surveyData.pages, mapPages);

let mapResponseAnswers = function(value) {
    return {id: value.choice_id};
};

let mapResponseQuestions = function(value) {
    return _.flatMap(value.answers, mapResponseAnswers)
};

let mapResponsePages = function(value) {
    return _.flatMap(value.questions, mapResponseQuestions)
};

let mapResponseData = function(value) {
    return _.flatMap(value.pages, mapResponsePages)
};

let reducer = function(stats, value) {
    console.log(`Stats: ${JSON.stringify(stats)}`);
    console.log(`Value: ${JSON.stringify(value)}`);

    //
    if(!stats[value.id]) {
        stats[value.id] = 0;
    }
    //
    stats[value.id] = stats[value.id] + 1;

    return stats
};

let filteredResponses =
    // _.filter(
        _.flatMap(responseData.data, mapResponseData);
        // function(o) { return o.length > 0}
    // );


console.log(JSON.stringify(filteredResponses));

let stats = _.reduce(filteredResponses, reducer, {});
//
// console.log(JSON.stringify(stats));
//
// console.log(JSON.stringify(filteredSurvey));
// Transform Responses

// Merge these