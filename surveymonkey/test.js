'use strict';

const _ = require('lodash');

const surveyData = require('./data/survey');
const responseData = require('./data/responses');

let getQuestions = function (collection){
    return _.map(collection, function(value){
        return value.questions;
    });
};

let questionsList = getQuestions(surveyData.pages);
//console.log(questionsList);
let filterQuestions = _.flatMap(questionsList, function(question){
    //console.log(question)
    return {
        qid: question.id,
        label: question.title,
        answers: question.answers
    }
});

console.log(`filter questions ${JSON.stringify(filterQuestions)}`);