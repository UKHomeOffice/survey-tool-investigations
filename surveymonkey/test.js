'use strict';

const _ = require('lodash');

const surveyData = require('./data/survey');
const responseData = require('./data/responses');

let getQuestions = function (pages){
    return _.flatMap(pages, function(page){
        return page.questions;
    });
};

let questionsList = getQuestions(surveyData.pages);

let filterQuestions = _.map(questionsList, function(question){
    return {
        qid: question.id,
        label: mapHeading(question.headings),
        answers: (question.answers.choices)
    }
});

console.log(`filter questions ${JSON.stringify(filterQuestions, null, 2)}`);