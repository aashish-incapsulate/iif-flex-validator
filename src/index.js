const DEFAULT_STATEMENTS = {
  ServiceQuestionCode: [
    /ServiceQuestionCode\[(.*)\]\.Incap311_Answer__c/,
    /ServiceQuestionCode\[(.*)\]\.Incap311__Answer__c/,
    /(FQ-.*)/
  ],
  OutcomeQuestionCode: [
    /OutcomeQuestionCode\[(.*)\]\.Incap311__Answer__c/,
  ],
  Address: [
    /Address\[(.*)\]/
  ],
  AddressLayer: [
    /AddressLayer\[(.*)=(.*)\]\.(.*)/
  ]
};

const CLAUSES = {
  and: 'AND', or: 'OR'
};

const OPS = {
  gt: 'gt', lt: 'lt', gte: 'gte', lte: 'lte',
  eq: 'eq', neq: 'neq', in: 'in', ct: 'ct'
};

/** Utility function which will check if object is empty or not */
function isEmpty(obj) {
  for(var key in obj) {
      if(obj.hasOwnProperty(key))
        return false;
  }
  return true;
}

/** Class for handling condition evaluation */
export default class ConditionEvaluator {

  /**
   *  Create a new Condition Evaluator.
   *  @param {Object.<string, Object.<string, string>>} The context of the evaluation.
   *  this will be used to determine what values to replace statements with.
   */
  constructor(ctx) {
    this.ctx = ctx || {};
    
    //If response is AddressLayer structure is different then API response (because of esri-loader api)
    if( this.ctx.AddressLayer && !isEmpty(this.ctx.AddressLayer) ){
      this.ctx.AddressLayer.map((currentAddressLayer) => {
        if( currentAddressLayer.feature && currentAddressLayer.feature.attributes !== undefined ) {
          //value property from layer's value in attributes
          if(currentAddressLayer.value === undefined) {
            currentAddressLayer.value = currentAddressLayer.feature.attributes[currentAddressLayer.displayFieldName];
          }

          //pull-out attributes from feature
          if(currentAddressLayer.attributes === undefined ) {
            currentAddressLayer.attributes = currentAddressLayer.feature.attributes;
          }

          //remove feature property
          delete currentAddressLayer.feature;

          return currentAddressLayer;
        }
      })
    }

    this._STATEMENTS = DEFAULT_STATEMENTS;

    this.values = this.values.bind(this);
    this.allValues = this.allValues.bind(this);
    this.allValuesWithAllResult = this.allValuesWithAllResult.bind(this);
    this.allMessagesWithAllResult = this.allMessagesWithAllResult.bind(this);
    this.resolveAllWithAllResult = this.resolveAllWithAllResult.bind(this);
    this.message = this.message.bind(this);
    this.evaluate = this.evaluate.bind(this);
    this.resolve = this.resolve.bind(this);
    this.isStatement = this.isStatement.bind(this);
    this.statement = this.statement.bind(this);
    this.side = this.side.bind(this);
    this._areEqual = this._areEqual.bind(this);
    this.condition = this.condition.bind(this);
    this.conditionGroup = this.conditionGroup.bind(this);
    this.setStatements = this.setStatements.bind(this);
  }

  /**
   * Returns the first truthy condition's "values" attribute.
   * @param the dependency group to evaluate
   * @return {Array.{}} the first truthy dependency groups' values
   */
  values(conditionGroups) {
    return this.resolve(conditionGroups, 'values');
  }

  allValues(conditionGroups) {
    return this.resolveAll(conditionGroups, 'values');
  }

  allValuesWithAllResult(conditionGroups) {
    return this.resolveAllWithAllResult(conditionGroups, 'values');
  }
  /**
   * Returns the first truthy condition's "message" attribute.
   * @param the dependency group to evaluate
   * @return {string} the first truthy dependency groups' message
   */
  message(conditionGroups) {
    return this.resolve(conditionGroups, 'message');
  }

  allMessages(conditionGroups) {
   return this.resolveAll(conditionGroups, 'message');
  }

  allMessagesWithAllResult(conditionGroups) {
    return this.resolveAllWithAllResult(conditionGroups, 'message');
  }

  /**
   * Returns true if the condition group
   * @param the condition group to evaluate
   * @return {boolean} True if the condition group is truthy, false otherwise
   */
  evaluate(conditionGroup) {
    return this.conditionGroup(conditionGroup);
  }

  /**
   * Returns which ever target value is truthy for the provided condition group.
   * null if no conditions groups are truthy
   * @param the condition group to evaluate
   * @param the target field to return if the condition group is truthy
   * @return {{}} the first truthy dependency groups' message
   */
  resolve(conditionGroups, target) {
    const result = conditionGroups
      .find(conditionGroup => this.conditionGroup(conditionGroup.dependentOn));

    return result ? result[target] : null;
  }

  /**
   * Returns all condition groups value are truthy give the state. List returned
   * is of all the values of the target.
   * @param the condition group to evaluate
   * @param the target field to return if the condition group is truthy
   * @return [] all messages for truthy condition groups
   */
  resolveAll(conditionGroups, target) {
    return conditionGroups
      .filter(conditionGroup => this.conditionGroup(conditionGroup.dependentOn))
      .map(item => item[target]);
  }

  /**
   * Returns all condition groups value are truthy and falsy give the state. List returned
   * is of all the values of the target.
   * @param the condition group to evaluate
   * @param the target field to return if the condition group is truthy or falsy
   * @return [] all results for truthy and falsy condition groups
   */
  resolveAllWithAllResult(conditionGroups, target) {
    return conditionGroups
      .map(conditionGroup => this.conditionGroup(conditionGroup.dependentOn) ? conditionGroup[target] : undefined);
  }

  /**
   * Lets the user specify what statements are supported. This is for advanced
   * use only.
   * @param the new statements to use.
   * @return {ConditionEvaluator} a reference to this object
   */
  setStatements(newStatements) {
    this._STATEMENTS = newStatements;

    return this;
  }

  /**
   * Determines if a given string is a statement by comparing to either the default
   * set of statements; or a user specified set.
   * @param the statement to be considered
   * @return {boolean} true if the value is a statement, false otherwise
   */
  isStatement(statement) {
    return Object.keys(this._STATEMENTS).reduce((acc, statementType) => {
        if(acc) {
          return acc;
        }

        const matches = this.matchAllStatements(statement, this._STATEMENTS[statementType]);

        return matches ? matches.length > 1 : false
    }, false)
  }

  /**
   * Determines which statement group a given statement belongs to. Will return the first match,
   * or null if no matches are found
   * @param the statement to be considered
   * @param all statements to be considered
   * @return {string} the statement group that the statement belongs to, null otherwise
   */
  matchAllStatements(statementString, statements) {
    if(!statementString || !statements) {
      return null;
    }

    if(Array.isArray(statements)) {
      return statements.reduce((acc, st) => acc || this.matchAllStatements(statementString, st), null);
    }

    return statementString.match(statements);

  }

  /**
   * Resolves the value of a given statement.
   * @param the statement to be resolved
   * @return {{}} the value of the statement, null if the value cannot be found
   */
  statement(statement) {
    const matchedResult = Object.keys(this._STATEMENTS).map(statementType => {
      const groups = this.matchAllStatements(statement, this._STATEMENTS[statementType]);

      if(groups && groups.length > 1) {
        // this assumes the key is first element matched
        // we may need to extend this at some point
        const [ _, ...keys ] = groups;

        return { statementType, keys };
      }

      return false;
    })
    .filter(item => !!item);


    // @NOTE
    // we are assuming that if no matchedResult was provided then we should check
    // to see if its a ServiceQuestionCode; and if it is return it. This was done
    // to address the issue regarding the API not returning the "true" condition
    if(matchedResult.length === 0) {
      return this.ctx['ServiceQuestionCode'] && this.ctx['ServiceQuestionCode'][statement] ?
        this.ctx['ServiceQuestionCode'][statement] :
        null;
    }

    const [ { statementType, keys } ] = matchedResult;

    if(Array.isArray(this.ctx[statementType])) {
      // find the first matching context value (default to an empty object)
      // and return its value; if the value is undefined return null instead
      const match = this.ctx[statementType].find(i => {
        const result = this._areEqual(this._deepGet(i, keys[0]), keys[1]);
        return result;
      });

      return this._deepGet(match, keys[2]);
    }

    return this.ctx[statementType][keys[0]];
  }

  /**
   * Resolves a side of a condition.
   * @param the value to be computed; if its a simple value it will be simply returned;
   * if it is a statement it will be resolved.
   * @return {{}} the value of the side
   */
  side(value) {
    if(typeof(value) === 'string' && this.isStatement(value)) {
      return this.statement(value);
    }

    return value;
  }

  /**
   * @private
   * Get the deeply nested value of a JSON object; if possble. This function will
   * return null if the path does not exist.
   * @param object to be searched in
   * @param period seperated path
   * @return the value of that node
   */
  _deepGet(item, path) {
    // short circuit if the item isn't a value
    if(!item) {
      return null;
    }

    const pieces = path.split('\.');

    return pieces.reduce((acc, node) => acc[node] ? acc[node] : acc, item);
  }

  /**
   * @private
   * Determines if two value are equal; also checkming that all array values are equal.
   * Only does a shallow comparison.
   * @param set of first values to compare
   * @param set of second values to compare
   * @return {boolean} true if the values are equal; false otherwise.
   */
  _areEqual(leftValue, rightValue) {
    // if both are arrays; then compare all elements.

    if(Array.isArray(leftValue) && Array.isArray(rightValue)) {
      leftValue.sort();
      rightValue.sort();
      return leftValue.length === rightValue.length && leftValue.every((v,i)=> v === rightValue[i])
    }

    // @NOTE
    // Intentionally doing a "eqeq" compare vs eqeqeq so that "5" and 5 are equal.
    // eslint-disable-next-line eqeqeq
    return leftValue == rightValue;
  }

  /**
   * @private
   * Determines if the right value is contained in the left. This does substring
   * comparison and sub-array comparisons
   * @param the values to be searched in.
   * @param the values to be searched for.
   * @return {boolean} true if the right side is contained in the left.
   */
  _contains(leftValue, rightValue) {
    if(!leftValue) {
      return false;
    }

    if(Array.isArray(leftValue) && Array.isArray(rightValue)) {
      if(rightValue.length === 0) {
        return false
      }

      return rightValue.some(item => leftValue.indexOf(item) >= 0);
    }

    return leftValue.indexOf(rightValue) >= 0;
  }

  /**
   * @private
   * Determines if the left value is contained in the right. This does substring
   * comparison and sub-array comparisons
   * @param the values to be searched for.
   * @param the values to be searched in.
   * @return {boolean} true if the left side is contained in the right.
   */
  _in(leftValue, rightValue) {
    if(!rightValue) {
      return false;
    }

    if(Array.isArray(leftValue) && Array.isArray(rightValue)) {
      if(leftValue.length === 0) {
        return false
      }

      return leftValue.every(item => rightValue.indexOf(item) >= 0);
    }

    return rightValue.indexOf(leftValue) >= 0;
  }

  /**
   * Resolves a condition or condition group. If clause is not provided; then it
   * is assumed we should be looking for a list of conditions. If clause is provided;
   * we look for a combination of attribute/left, value/right and op.
   * @param the condition or condition group entity to be evaluated.
   * @return {boolean} true if the operator is true for the values, false otherwise
   */
  condition({ attribute, value, left, op, right, clause, conditions }) {
    if(clause) {
      return this.conditionGroup({ clause, conditions });
    }

    // if we're working with an attribute; assume its a statement
    let leftValue = attribute ? this.statement(attribute) : this.side(left);
    (['boolean', 'number'].includes(typeof leftValue) || (leftValue || (leftValue = ''))); // handling false or 0 value
    let rightValue = this.side(['string', 'boolean', 'number'].includes(typeof value) ? value : value || right);
    if (typeof rightValue === 'boolean') { // only for boolean dependency 
      leftValue = leftValue === 'true' ? true : leftValue === 'false' ? false : leftValue; // passing boolean instead of string
    }
    // above changes are for blank value received in "value field" THREE11CAP-5511

    if ((leftValue || typeof leftValue == 'number') && rightValue && !isNaN(leftValue) && !isNaN(rightValue)) {
      leftValue = Number(leftValue);
      rightValue = Number(rightValue);
    }
    //above changes are for Alert validation getting fired on submission even when the answers are valid.(https://incapsulate.atlassian.net/browse/PGC311-249)

    switch (op) {
      case OPS.gt: return leftValue > rightValue;
      case OPS.gte: return leftValue >= rightValue;
      case OPS.lt: return leftValue < rightValue;
      case OPS.lte: return leftValue <= rightValue;
      case OPS.eq: return this._areEqual((leftValue === '' ? null : leftValue), (rightValue === '' ? null : rightValue));
      case OPS.neq: return !this._areEqual(leftValue, rightValue);
      case OPS.in: return this._in(leftValue, rightValue);
      case OPS.ct: return this._contains(leftValue, rightValue);
    }
  }

  /**
   * Resolves a condition group, determinng if the condition group is valid or not.
   * @param the condition group entity to be evaluated.
   * @return {boolean} true if the condition group evaluates to true, false otherwise
   */
  conditionGroup({ clause, conditions }) {
    const isAnd = clause === CLAUSES.and;

    if(conditions.length === 0) {
      return true;
    }


    return conditions.reduce(
      (acc, item) => {

        // if we've see a "false" and we're doing an AND
        // we can just skip to the end
        if(!acc && isAnd) {
          return false;
        }

        // if we've see a "false" and we're doing an OR
        // we can just skip to the end
        if(acc && !isAnd) {
          return true;
        }

        // otherwise we need to evaluate our condition
        return this.condition(item);
      },
      isAnd
    );
  }
}
