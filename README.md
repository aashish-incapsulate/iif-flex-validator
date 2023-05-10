# Condition Evaluation 

A simple library written in ES6 to evaluate the conditions DSL for Incapsulate

## Usage

```javascript
import ConditionEvaluator from '311-conditions';

// start by creating a new instance of the evaluator;
// it should receive all the "context" for future evaluations.
// if context changes; a new instnace should be created.
// context is a map of maps; where the top key is the "type",
// and the inner key is the instance key associated ot the value
const instance = new ConditionEvaluator({
  ServiceQuestionCode: {
    ABC: 123,
    DEF: ['a','b'],
    QWE: 'banana',
    DDD: true
  },
  AddressLayer: [
    {
      layerId: 5,
      attributes: {
        someAttr: 'some value'
      }
    }
  ]
});


// get a validation message
instance.message([
  {
    dependentOn: {
      clause: 'OR',
      conditions: [
        { left: 'ServiceQuestionCode[ABC].Incap311_Answer__c', op: 'eq', right: 123}
      ]
    },
    message: 'ABC cannot equal 123'
  }
]); // returns 'ABC cannot equal 123'


// get all validation messages
instance.allMessages([
  {
    dependentOn: {
      clause: 'OR',
      conditions: [
        { left: 'ServiceQuestionCode[ABC].Incap311_Answer__c', op: 'eq', right: 123}
      ]
    },
    message: 'ABC cannot equal 123'
  }
]); // returns ['ABC cannot equal 123']

// get a dependent value
instance.values([
  {
    dependentOn: {
      clause: 'OR',
      conditions: [
        { left: 'ServiceQuestionCode[ABC].Incap311_Answer__c', op: 'eq', right: 123}
      ]
    },
    values: [ { key: 'b', value: 'b' } ]
  }
]); // returns [ { key: 'b', value: 'b' } ]

// get all dependent value
instance.values([
  {
    dependentOn: {
      clause: 'OR',
      conditions: [
        { left: 'ServiceQuestionCode[ABC].Incap311_Answer__c', op: 'eq', right: 123}
      ]
    },
    values: [ { key: 'b', value: 'b' } ]
  }
]); // returns [ [ { key: 'b', value: 'b' } ]

// evaluate a single condition group (w/ potentially nested conditions)
instance.evaluate({
  clause: 'OR',
  conditions: [
    { left: 'ServiceQuestionCode[ABC].Incap311_Answer__c', op: 'eq', right: 123}
  ]
}) // returns true


```
