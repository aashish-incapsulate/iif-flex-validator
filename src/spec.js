import { expect } from 'chai';
import ConditionEvaluator from './index.js';

describe('311 Condition Evaluation', () => {

  it('should pass a complex and', () => {
    const instance = new ConditionEvaluator({
      ServiceQuestionCode: {
        "ST-SIZE": "Medium",
        "ST-COLOR": "blue"
        }
      });

    const result = instance.message(
      [{
          "dependentOn": {
            "clause": "AND",
            "conditions": [
              {
                "left": "ServiceQuestionCode[ST-SIZE].Incap311__Answer__c",
                "op": "eq",
                "right": "Large"
              },
              {
                "left": "ServiceQuestionCode[ST-COLOR].Incap311__Answer__c",
                "op": "eq",
                "right": "blue"
              }
            ]
          },
          "message": "Large is not an appropriate size when color is blue; please select a different size"
        },
        {
          "dependentOn": {
            "clause": "AND",
            "conditions": [
              {
                "left": "ServiceQuestionCode[SR-ABANBIKE1].Incap311__Answer__c",
                "op": "eq",
                "right": "Mountain"
              }
            ]
          },
          "message": "We dont accept Mountain bikes"
        }
      ]);

    expect(result).to.be.null;
  });

  it('should format AddressLayer if it has different structure then expected', () => {
    const instance = new ConditionEvaluator({
      Address: '3575 ARMSTRONG AVE, HIGHLAND PARK, 75205',
      AddressLayer: [{
        "layerId": 13,
        "layerName": "Tax Parcels",
        "displayFieldName": "ST_NAME",
        "feature": {
          "layer": null,
          "attributes": {
            "ST_NAME": "Sample",
          },
          "geometry": {}
        }
      }],
      OutcomeQuestionCode: {},
      ServiceQuestionCode: {}
    });

    expect(instance.ctx.AddressLayer[0].value).to.be.eq('Sample');
  })

  describe('values', () => {


    it('should return the first value where the dependentOn is true and the clause is OR', () => {
      const conditionGroups = [
        {
          dependentOn: {
            clause: 'AND',
            conditions: [
              { left: 2, op: 'eq', right: 1 }
            ]
          },
          message: 'Goodbye World'
        },
        {
          dependentOn: {
            clause: 'AND',
            conditions: [
            ]
          },
          values: 'Hello World'
        }
      ];

      const inst = new ConditionEvaluator();
      const result = inst.values(conditionGroups);
      expect(result).to.equal('Hello World');
    });

    it('should return the first value where the dependentOn is true and the clause is OR', () => {
      const conditionGroups = [
        {
          dependentOn: {
            clause: 'AND',
            conditions: [
              { left: 2, op: 'eq', right: 1 }
            ]
          },
          message: 'Goodbye World'
        },
        {
          dependentOn: {
            clause: 'OR',
            conditions: [
            ]
          },
          values: 'Hello World'
        }
      ];

      const inst = new ConditionEvaluator();
      const result = inst.values(conditionGroups);
      expect(result).to.equal('Hello World');
    });

    it('should return the first value where the dependentOn is true', () => {
      const conditionGroups = [
        {
          dependentOn: {
            clause: 'AND',
            conditions: [
              { left: 2, op: 'eq', right: 1 }
            ]
          },
          message: 'Goodbye World'
        },
        {
          dependentOn: {
            clause: 'AND',
            conditions: [
              { left: 1, op: 'eq', right: 1 }
            ]
          },
          values: 'Hello World'
        }
      ];

      const inst = new ConditionEvaluator();
      const result = inst.values(conditionGroups);
      expect(result).to.equal('Hello World');
    });

    it('should return null if no dependentOn are true', () => {
        const conditionGroups = [
          {
            dependentOn: {
              clause: 'AND',
              conditions: [
                { left: 2, op: 'eq', right: 1 }
              ]
            },
            message: 'Goodbye World'
          },
          {
            dependentOn: {
              clause: 'AND',
              conditions: [
                { left: 1, op: 'eq', right: 2 }
              ]
            },
            values: 'Hello World'
          }
        ];

        const inst = new ConditionEvaluator();
        const result = inst.values(conditionGroups);
        expect(result).to.equal(null);
      });
  });

  describe('messages', () => {
    it('should return the first message value where the dependentOn is true', () => {
      const conditionGroups = [
        {
          dependentOn: {
            clause: 'AND',
            conditions: [
              { left: 2, op: 'eq', right: 1 }
            ]
          },
          message: 'Goodbye World'
        },
        {
          dependentOn: {
            clause: 'AND',
            conditions: [
              { left: 1, op: 'eq', right: 1 }
            ]
          },
          message: 'Hello World'
        },
        {
          dependentOn: {
            clause: 'AND',
            conditions: [
              { left: 1, op: 'eq', right: 1 }
            ]
          },
          message: 'Hello Multi'
        },
      ];

      const inst = new ConditionEvaluator();
      const result = inst.allMessages(conditionGroups);
      expect(result[0]).to.equal('Hello World');
      expect(result[1]).to.equal('Hello Multi');
    });

    it('should format the ASCII values from the Geo-validation config', () => {
      const instance = new ConditionEvaluator({
        Address: '2207 BEECHWOOD RD',
        AddressLayer: [{
          "layerId": 35,
          "layerName": "Regional Counties",
          "displayFieldName": "NAME",
          "attributes": {
            "NAME": "Prince George&#39;s"
          }
        }],
        OutcomeQuestionCode: {},
        ServiceQuestionCode: {}
      });
  
      const conditionGroups = [
        {
          dependentOn: {
            clause: 'AND',
            conditions: [
              { left: 'AddressLayer[layerName=Regional Counties].attributes.NAME', op: 'neq', right: 'Prince George&#39;s' }
            ]
          },
          message: 'Geo-validation'
        }
      ];
      const result = instance.allMessages(conditionGroups);
      expect(result).to.deep.equal([]);
    })

    it('should return an empty list when no dependentOn are true', () => {
      const conditionGroups = [
        {
          dependentOn: {
            clause: 'AND',
            conditions: [
              { left: 2, op: 'eq', right: 1 }
            ]
          },
          message: 'Goodbye World'
        },
        {
          dependentOn: {
            clause: 'AND',
            conditions: [
              { left: 1, op: 'eq', right: 2 }
            ]
          },
          message: 'Hello World'
        }
      ];

      const inst = new ConditionEvaluator();
      const result = inst.allMessages(conditionGroups);
      expect(result).to.deep.equal([]);
    });
  })

  describe('message', () => {
    it('should return the first message value where the dependentOn is true', () => {
      const conditionGroups = [
        {
          dependentOn: {
            clause: 'AND',
            conditions: [
              { left: 2, op: 'eq', right: 1 }
            ]
          },
          message: 'Goodbye World'
        },
        {
          dependentOn: {
            clause: 'AND',
            conditions: [
              { left: 1, op: 'eq', right: 1 }
            ]
          },
          message: 'Hello World'
        }
      ];

      const inst = new ConditionEvaluator();
      const result = inst.message(conditionGroups);
      expect(result).to.equal('Hello World');
    });

    it('should return the null when no dependentOn are true', () => {
      const conditionGroups = [
        {
          dependentOn: {
            clause: 'AND',
            conditions: [
              { left: 2, op: 'eq', right: 1 }
            ]
          },
          message: 'Goodbye World'
        },
        {
          dependentOn: {
            clause: 'AND',
            conditions: [
              { left: 1, op: 'eq', right: 2 }
            ]
          },
          message: 'Hello World'
        }
      ];

      const inst = new ConditionEvaluator();
      const result = inst.message(conditionGroups);
      expect(result).to.equal(null);
    });
  })

  describe('conditionGroup and evaluate', () => {

    it('should return true if the clause is OR and any condition is true', () => {
      const inst = new ConditionEvaluator();
      const result = inst.conditionGroup({
        clause: 'OR',
        conditions: [
          { left: 1, op: 'eq', right: 1 },
          { left: 'b', op: 'eq', right: 'a' },
        ]
      });
      expect(result).to.be.true;
    });

    it('should return false if the clause is ALL conditions are false', () => {
      const inst = new ConditionEvaluator();
      const result = inst.conditionGroup({
        clause: 'OR',
        conditions: [
          { left: 2, op: 'eq', right: 1 },
          { left: 'a', op: 'eq', right: 'b' },
        ]
      });
      expect(result).to.be.false;
    });

    it('should return true if the clause is AND and all conditions are true', () => {
      const inst = new ConditionEvaluator();
      const result = inst.conditionGroup({
        clause: 'AND',
        conditions: [
          { left: 1, op: 'eq', right: 1 },
          { left: 'a', op: 'eq', right: 'a' },
        ]
      });
      expect(result).to.be.true;
    });

    it('should return false if the clause is AND and any condition is false', () => {
      const inst = new ConditionEvaluator();
      const result = inst.conditionGroup({
        clause: 'AND',
        conditions: [
          { left: 1, op: 'eq', right: 1 },
          { left: 'a', op: 'eq', right: 'b' },
        ]
      });
      expect(result).to.be.false;
    });
  });

  describe('isStatement', () => {
    it('should return false if no matches are found', () => {
        const inst = new ConditionEvaluator();
        const result = inst.isStatement('Thing[ABC]');
        expect(result).to.be.false;
    });

    it('should return true if a match is found', () => {
        const inst = new ConditionEvaluator({
          ServiceQuestionCode: {
            ABC: 'apples',
            DEF: 'bananas'
          }
        });
        const result = inst.isStatement('ServiceQuestionCode[DEF].Incap311_Answer__c');
        expect(result).to.be.true;
    });
  })

  describe('statement', () => {
    it('should return null if no matches are found', () => {
        const inst = new ConditionEvaluator();
        const result = inst.statement('Thing[ABC]');
        expect(result).to.be.null;
    });

    it('should return the value of the matching list item if its a list search', () => {
        const inst = new ConditionEvaluator({
          AddressLayer: [
            {
              addressId: 5,
              layerName: 'Test'
            },
            {
              addressId: 6,
              layerName: 'Buzz'
            },
            {
              addressId: 7,
              layerName: 'Fuzz',
              attributes: {
                someKey: 'someValue',
                someId: 6
              }
            }
          ]
        });

        const result = inst.statement('AddressLayer[addressId=7].attributes.someKey');
        expect(result).to.equal('someValue');

        const result2 = inst.statement('AddressLayer[attributes.someId=6].attributes.someKey');
        expect(result2).to.equal('someValue');
    });

    it('should return null if there are no matches', () => {
        const inst = new ConditionEvaluator({
          ServiceQuestionCode: {
            ABC: 'apples',
            DEF: 'bananas'
          }
        });
        const result = inst.statement('GGG');
        expect(result).to.be.null;
    });

    it('should assume that the provided value is a statement if it does not match', () => {
        const inst = new ConditionEvaluator({
          ServiceQuestionCode: {
            ABC: 'apples',
            DEF: 'bananas'
          }
        });
        const result = inst.statement('DEF');
        expect(result).to.equal('bananas');
    });

    it('should return the matching value for the statement', () => {
        const inst = new ConditionEvaluator({
          ServiceQuestionCode: {
            ABC: 'apples',
            DEF: 'bananas'
          }
        });
        const result = inst.statement('ServiceQuestionCode[DEF].Incap311_Answer__c');
        expect(result).to.equal('bananas');
    });

    it('should return the maching value for the statement if its not the first statement in a group', () => {
        const inst = new ConditionEvaluator({
          ServiceQuestionCode: {
            ['FQ-ABC']: 'apples',
            ['FQ-DEF']: 'bananas'
          }
        });
        const result = inst.statement('FQ-ABC');
        expect(result).to.equal('apples');
    })
  });

  describe('side', () => {
    it('should return the value if it is an integer', () => {
      const inst = new ConditionEvaluator();
      const result = inst.side(5);
      expect(result).to.equal(5);
    });

    it('should return the value if it is a string', () => {
      const inst = new ConditionEvaluator();
      const result = inst.side('banana');
      expect(result).to.equal('banana');
    });

    it('should return the value of the context when we are using a statement', () => {
      const inst = new ConditionEvaluator({
        ServiceQuestionCode: {
          ABC: 'apples',
          DEF: 'bananas'
        }
      });
      const result = inst.side('ServiceQuestionCode[ABC].Incap311_Answer__c');
      expect(result).to.equal('apples');
    });
  });

  describe('condition', () => {
    describe('conditionGroup', () => {
      it('should handle a condition group as a single condition', () => {
          const inst = new ConditionEvaluator();
          const result = inst.condition({ clause: 'AND', conditions: [{ left: 1, op: 'eq', right: 1 }]});
          expect(result).to.be.true;
      });
    });

    describe('in', () => {
      it('should return true if all the elements on the left are contained in the right', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: ['dog', 'cat'], op: 'in', value: ['dog', 'cat', 'penguin', 'emu']});
        expect(result).to.be.true;
      });

      it('should return false if any the elements on the left are missing on the right', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: ['dog', 'cat'], op: 'in', value: ['dog', 'penguin', 'emu']});
        expect(result).to.be.false;
      });

      it('should return false if the right element is an empty array', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: ['dog', 'penguin', 'emu'], op: 'in', value: []});
        expect(result).to.be.false;
      });

      it('should return false if the left value is an empty array and the right element is an array as well', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: [], op: 'in', value: ['dog', 'penguin', 'emu']});
        expect(result).to.be.false;
      });

      it('should work if left is named attribute and right is named value', () => {
        const inst = new ConditionEvaluator({
          ServiceQuestionCode: {
            aba: 'aba'
          }
        });
        const result = inst.condition({ left: 'aba', op: 'in', value: 'abadef444'});
        expect(result).to.be.true;
      });

      it('should return true if the left argument is in the right argument for strings', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: 'aba', op: 'in', right: 'abadef444'});
        expect(result).to.be.true;
      });

      it('should return false if the left argument is not in the right argument for strings', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: 'aba', op: 'in', right: 'aaadef444'});
        expect(result).to.be.false;
      });

      it('should return true if the left argument is in the right argument for arrays', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: 5, op: 'in', right: [2, 4, 5, 7]});
        expect(result).to.be.true;
      });

      it('should return false if the left argument is not in the right argument for arrays', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: -5, op: 'in', right: [2, 4, 5, 7]});
        expect(result).to.be.false;
      });
    });

    describe('ct', () => {
      it('should return true if all the elements on the right are contained in the left', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: ['dog', 'cat', 'penguin', 'emu'], op: 'ct', value: ['dog', 'cat']});
        expect(result).to.be.true;
      });

      it('should return true if any the elements on the right are missing on the left', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: ['dog', 'penguin', 'emu'], op: 'ct', value: ['dog', 'cat']});
        expect(result).to.be.true;
      });

      it('should return false if the left element is an empty array', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: [], op: 'ct', value: ['dog', 'penguin', 'emu']});
        expect(result).to.be.false;
      });

      it('should return false if the right value is an empty array and the left element is an array as well', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: ['dog', 'penguin', 'emu'], op: 'ct', value: []});
        expect(result).to.be.false;
      });

      it('should work if left is named attribute and right is named value', () => {
        const inst = new ConditionEvaluator({
          ServiceQuestionCode: {
            aba: 'aba'
          }
        });
        const result = inst.condition({ left: 'aba', op: 'ct', value: 'ba'});
        expect(result).to.be.true;
      });

      it('should return true if the right argument is in the left argument for strings', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: 'abadef444', op: 'ct', right: 'aba'});
        expect(result).to.be.true;
      });

      it('should return false if the right argument is not in the left argument for strings', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: 'aaadef444', op: 'ct', right: 'aba'});
        expect(result).to.be.false;
      });

      it('should return true if the right argument is in the left argument for arrays', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: [2, 4, 5, 7], op: 'ct', right: 5});
        expect(result).to.be.true;
      });

      it('should return false if the right argument is not in the left argument for arrays', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: [2, 4, 5, 7], op: 'ct', right: -5});
        expect(result).to.be.false;
      });
    });

    describe('neq', () => {
      it('should return false when the left argument is equal to the right argument for integers', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: 5, op: 'neq', right: 5});
        expect(result).to.be.false;
      });

      it('should return true when the left argument is not equal to the right argument for integers', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: 5, op: 'neq', right: 4});
        expect(result).to.be.true;
      });
    });

    describe('eq', () => {
      it('should return true when the left argument is equal to the right argument for integers', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: 5, op: 'eq', right: 5});
        expect(result).to.be.true;
      });

      it('should return false when the left argument is not equal to the right argument for integers', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: 5, op: 'eq', right: 4});
        expect(result).to.be.false;
      });

      it('should return true if the left argument has the exact same order and elements as the right arguments', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: [1, 'b', 3], op: 'eq', right: [1, 'b', 3]});
        expect(result).to.be.true;
      });

      it('should return true if the left argument has different order or elements compared to the right arguments', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: ['b', 1, 3], op: 'eq', right: [1, 'b', 3]});
        expect(result).to.be.true;
      });

      it('should return true if the left argument equals the right argument as booleans true', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: true, op: 'eq', right: true});
        expect(result).to.be.true;
      });

      it('should return true if the left argument equals the right argument as booleans false', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: false, op: 'eq', right: false});
        expect(result).to.be.true;
      });

      it('should return false if the left argument equals the right argument as booleans false', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: true, op: 'eq', right: false});
        expect(result).to.be.false;
      });

      it('should return true if the left argument has different order or elements compared to the right arguments', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: ['b', 1, 3], op: 'eq', right: [1, 'b', 3]});
        expect(result).to.be.true;
      });

      // it('should return true if the left argument is null and right argument is blank string', () => {
      //   const inst  = new ConditionEvaluator();
      //   const result = inst.condition({left: false, op: 'eq', right: ''});
      //   expect(result).to.be.false;
      // })

      // it('should return true if the left argument is null and right argument is blank string', () => {
      //   const inst  = new ConditionEvaluator();
      //   const result = inst.condition({left: null, op: 'eq', right: ''});
      //   expect(result).to.be.false;
      // })
    });

    describe('lte', () => {
      it('should return false when the left argument is greater than the right argument for integers', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: 5, op: 'lte', right: 4});
        expect(result).to.be.false;
      });

      it('should return true when the left argument is less than the right argument for integers', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: 5, op: 'lte', right: 6});
        expect(result).to.be.true;
      });

      it('should return true when the left argument is equal to the right argument for integers', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: 5, op: 'lte', right: 5});
        expect(result).to.be.true;
      });

      it('should return false when the left argument is greater than the right argument for strings', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: 'c', op: 'lte', right: 'b'});
        expect(result).to.be.false;
      });

      it('should return true when the left argument is less than the right argument for strings', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: 'c', op: 'lte', right: 'd'});
        expect(result).to.be.true;
      });

      it('should return true when the left argument is equal to the right argument for strings', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: 'c', op: 'lte', right: 'c'});
        expect(result).to.be.true;
      });
    });

    describe('lt', () => {
      it('should return false when the left argument is greater than the right argument for integers', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: 5, op: 'lt', right: 4});
        expect(result).to.be.false;
      });

      it('should return true when the left argument is less than the right argument for integers', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: 5, op: 'lt', right: 6});
        expect(result).to.be.true;
      });

      it('should return false when the left argument is equal to the right argument for integers', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: 5, op: 'lt', right: 5});
        expect(result).to.be.false;
      });

      it('should return false when the left argument is greater than the right argument for strings', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: 'c', op: 'lt', right: 'b'});
        expect(result).to.be.false;
      });

      it('should return true when the left argument is less than the right argument for strings', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: 'c', op: 'lt', right: 'd'});
        expect(result).to.be.true;
      });

      it('should return false when the left argument is equal to the right argument for strings', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: 'c', op: 'lt', right: 'c'});
        expect(result).to.be.false;
      });
    });

    describe('gt', () => {
      it('should return true when the left argument is greater than the right argument for integers', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: 5, op: 'gt', right: 4});
        expect(result).to.be.true;
      });

      it('should return false when the left argument is less than the right argument for integers', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: 5, op: 'gt', right: 6});
        expect(result).to.be.false;
      });

      it('should return false when the left argument is equal to the right argument for integers', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: 5, op: 'gt', right: 5});
        expect(result).to.be.false;
      });

      it('should return true when the left argument is greater than the right argument for strings', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: 'c', op: 'gt', right: 'b'});
        expect(result).to.be.true;
      });

      it('should return false when the left argument is less than the right argument for strings', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: 'c', op: 'gt', right: 'd'});
        expect(result).to.be.false;
      });

      it('should return false when the left argument is equal to the right argument for strings', () => {
        const inst = new ConditionEvaluator();
        const result = inst.condition({ left: 'c', op: 'gt', right: 'c'});
        expect(result).to.be.false;
      });
    });

    describe('gte', () => {
        it('should return true when the left argument is greater than the right argument for integers', () => {
          const inst = new ConditionEvaluator();
          const result = inst.condition({ left: 5, op: 'gte', right: 4});
          expect(result).to.be.true;
        });

        it('should return false when the left argument is less than the right argument for integers', () => {
          const inst = new ConditionEvaluator();
          const result = inst.condition({ left: 5, op: 'gte', right: 6});
          expect(result).to.be.false;
        });

        it('should return true when the left argument is equal to the right argument for integers', () => {
          const inst = new ConditionEvaluator();
          const result = inst.condition({ left: 5, op: 'gte', right: 5});
          expect(result).to.be.true;
        });

        it('should return true when the left argument is greater than the right argument for strings', () => {
          const inst = new ConditionEvaluator();
          const result = inst.condition({ left: 'c', op: 'gte', right: 'b'});
          expect(result).to.be.true;
        });

        it('should return false when the left argument is less than the right argument for strings', () => {
          const inst = new ConditionEvaluator();
          const result = inst.condition({ left: 'c', op: 'gte', right: 'd'});
          expect(result).to.be.false;
        });

        it('should return true when the left argument is equal to the right argument for strings', () => {
          const inst = new ConditionEvaluator();
          const result = inst.condition({ left: 'c', op: 'gte', right: 'c'});
          expect(result).to.be.true;
        });
    });
  });
});
