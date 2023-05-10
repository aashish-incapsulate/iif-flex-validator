module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_STATEMENTS = {
  ServiceQuestionCode: [/ServiceQuestionCode\[(.*)\]\.Incap311_Answer__c/, /ServiceQuestionCode\[(.*)\]\.Incap311__Answer__c/, /(FQ-.*)/],
  OutcomeQuestionCode: [/OutcomeQuestionCode\[(.*)\]\.Incap311__Answer__c/],
  Address: [/Address\[(.*)\]/],
  AddressLayer: [/AddressLayer\[(.*)=(.*)\]\.(.*)/]
};

var CLAUSES = {
  and: 'AND', or: 'OR'
};

var OPS = {
  gt: 'gt', lt: 'lt', gte: 'gte', lte: 'lte',
  eq: 'eq', neq: 'neq', in: 'in', ct: 'ct'
};

/** Utility function which will check if object is empty or not */
function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

/** Class for handling condition evaluation */

var ConditionEvaluator = function () {

  /**
   *  Create a new Condition Evaluator.
   *  @param {Object.<string, Object.<string, string>>} The context of the evaluation.
   *  this will be used to determine what values to replace statements with.
   */
  function ConditionEvaluator(ctx) {
    _classCallCheck(this, ConditionEvaluator);

    this.ctx = ctx || {};

    //If response is AddressLayer structure is different then API response (because of esri-loader api)
    if (this.ctx.AddressLayer && !isEmpty(this.ctx.AddressLayer)) {
      this.ctx.AddressLayer.map(function (currentAddressLayer) {
        if (currentAddressLayer.feature && currentAddressLayer.feature.attributes !== undefined) {
          //value property from layer's value in attributes
          if (currentAddressLayer.value === undefined) {
            currentAddressLayer.value = currentAddressLayer.feature.attributes[currentAddressLayer.displayFieldName];
          }

          //pull-out attributes from feature
          if (currentAddressLayer.attributes === undefined) {
            currentAddressLayer.attributes = currentAddressLayer.feature.attributes;
          }

          //remove feature property
          delete currentAddressLayer.feature;

          return currentAddressLayer;
        }
      });
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


  _createClass(ConditionEvaluator, [{
    key: 'values',
    value: function values(conditionGroups) {
      return this.resolve(conditionGroups, 'values');
    }
  }, {
    key: 'allValues',
    value: function allValues(conditionGroups) {
      return this.resolveAll(conditionGroups, 'values');
    }
  }, {
    key: 'allValuesWithAllResult',
    value: function allValuesWithAllResult(conditionGroups) {
      return this.resolveAllWithAllResult(conditionGroups, 'values');
    }
    /**
     * Returns the first truthy condition's "message" attribute.
     * @param the dependency group to evaluate
     * @return {string} the first truthy dependency groups' message
     */

  }, {
    key: 'message',
    value: function message(conditionGroups) {
      return this.resolve(conditionGroups, 'message');
    }
  }, {
    key: 'allMessages',
    value: function allMessages(conditionGroups) {
      return this.resolveAll(conditionGroups, 'message');
    }
  }, {
    key: 'allMessagesWithAllResult',
    value: function allMessagesWithAllResult(conditionGroups) {
      return this.resolveAllWithAllResult(conditionGroups, 'message');
    }

    /**
     * Returns true if the condition group
     * @param the condition group to evaluate
     * @return {boolean} True if the condition group is truthy, false otherwise
     */

  }, {
    key: 'evaluate',
    value: function evaluate(conditionGroup) {
      return this.conditionGroup(conditionGroup);
    }

    /**
     * Returns which ever target value is truthy for the provided condition group.
     * null if no conditions groups are truthy
     * @param the condition group to evaluate
     * @param the target field to return if the condition group is truthy
     * @return {{}} the first truthy dependency groups' message
     */

  }, {
    key: 'resolve',
    value: function resolve(conditionGroups, target) {
      var _this = this;

      var result = conditionGroups.find(function (conditionGroup) {
        return _this.conditionGroup(conditionGroup.dependentOn);
      });

      return result ? result[target] : null;
    }

    /**
     * Returns all condition groups value are truthy give the state. List returned
     * is of all the values of the target.
     * @param the condition group to evaluate
     * @param the target field to return if the condition group is truthy
     * @return [] all messages for truthy condition groups
     */

  }, {
    key: 'resolveAll',
    value: function resolveAll(conditionGroups, target) {
      var _this2 = this;

      return conditionGroups.filter(function (conditionGroup) {
        return _this2.conditionGroup(conditionGroup.dependentOn);
      }).map(function (item) {
        return item[target];
      });
    }

    /**
     * Returns all condition groups value are truthy and falsy give the state. List returned
     * is of all the values of the target.
     * @param the condition group to evaluate
     * @param the target field to return if the condition group is truthy or falsy
     * @return [] all results for truthy and falsy condition groups
     */

  }, {
    key: 'resolveAllWithAllResult',
    value: function resolveAllWithAllResult(conditionGroups, target) {
      var _this3 = this;

      return conditionGroups.map(function (conditionGroup) {
        return _this3.conditionGroup(conditionGroup.dependentOn) ? conditionGroup[target] : undefined;
      });
    }

    /**
     * Lets the user specify what statements are supported. This is for advanced
     * use only.
     * @param the new statements to use.
     * @return {ConditionEvaluator} a reference to this object
     */

  }, {
    key: 'setStatements',
    value: function setStatements(newStatements) {
      this._STATEMENTS = newStatements;

      return this;
    }

    /**
     * Determines if a given string is a statement by comparing to either the default
     * set of statements; or a user specified set.
     * @param the statement to be considered
     * @return {boolean} true if the value is a statement, false otherwise
     */

  }, {
    key: 'isStatement',
    value: function isStatement(statement) {
      var _this4 = this;

      return Object.keys(this._STATEMENTS).reduce(function (acc, statementType) {
        if (acc) {
          return acc;
        }

        var matches = _this4.matchAllStatements(statement, _this4._STATEMENTS[statementType]);

        return matches ? matches.length > 1 : false;
      }, false);
    }

    /**
     * Determines which statement group a given statement belongs to. Will return the first match,
     * or null if no matches are found
     * @param the statement to be considered
     * @param all statements to be considered
     * @return {string} the statement group that the statement belongs to, null otherwise
     */

  }, {
    key: 'matchAllStatements',
    value: function matchAllStatements(statementString, statements) {
      var _this5 = this;

      if (!statementString || !statements) {
        return null;
      }

      if (Array.isArray(statements)) {
        return statements.reduce(function (acc, st) {
          return acc || _this5.matchAllStatements(statementString, st);
        }, null);
      }

      return statementString.match(statements);
    }

    /**
     * Resolves the value of a given statement.
     * @param the statement to be resolved
     * @return {{}} the value of the statement, null if the value cannot be found
     */

  }, {
    key: 'statement',
    value: function statement(_statement) {
      var _this6 = this;

      var matchedResult = Object.keys(this._STATEMENTS).map(function (statementType) {
        var groups = _this6.matchAllStatements(_statement, _this6._STATEMENTS[statementType]);

        if (groups && groups.length > 1) {
          // this assumes the key is first element matched
          // we may need to extend this at some point
          var _groups = _toArray(groups),
              _ = _groups[0],
              _keys = _groups.slice(1);

          return { statementType: statementType, keys: _keys };
        }

        return false;
      }).filter(function (item) {
        return !!item;
      });

      // @NOTE
      // we are assuming that if no matchedResult was provided then we should check
      // to see if its a ServiceQuestionCode; and if it is return it. This was done
      // to address the issue regarding the API not returning the "true" condition
      if (matchedResult.length === 0) {
        return this.ctx['ServiceQuestionCode'] && this.ctx['ServiceQuestionCode'][_statement] ? this.ctx['ServiceQuestionCode'][_statement] : null;
      }

      var _matchedResult = _slicedToArray(matchedResult, 1),
          _matchedResult$ = _matchedResult[0],
          statementType = _matchedResult$.statementType,
          keys = _matchedResult$.keys;

      if (Array.isArray(this.ctx[statementType])) {
        // find the first matching context value (default to an empty object)
        // and return its value; if the value is undefined return null instead
        var match = this.ctx[statementType].find(function (i) {
          var result = _this6._areEqual(_this6._deepGet(i, keys[0]), keys[1]);
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

  }, {
    key: 'side',
    value: function side(value) {
      if (typeof value === 'string' && this.isStatement(value)) {
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

  }, {
    key: '_deepGet',
    value: function _deepGet(item, path) {
      // short circuit if the item isn't a value
      if (!item) {
        return null;
      }

      var pieces = path.split('\.');

      return pieces.reduce(function (acc, node) {
        return acc[node] ? acc[node] : acc;
      }, item);
    }

    /**
     * @private
     * Determines if two value are equal; also checkming that all array values are equal.
     * Only does a shallow comparison.
     * @param set of first values to compare
     * @param set of second values to compare
     * @return {boolean} true if the values are equal; false otherwise.
     */

  }, {
    key: '_areEqual',
    value: function _areEqual(leftValue, rightValue) {
      // if both are arrays; then compare all elements.

      if (Array.isArray(leftValue) && Array.isArray(rightValue)) {
        leftValue.sort();
        rightValue.sort();
        return leftValue.length === rightValue.length && leftValue.every(function (v, i) {
          return v === rightValue[i];
        });
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

  }, {
    key: '_contains',
    value: function _contains(leftValue, rightValue) {
      if (!leftValue) {
        return false;
      }

      if (Array.isArray(leftValue) && Array.isArray(rightValue)) {
        if (rightValue.length === 0) {
          return false;
        }

        return rightValue.some(function (item) {
          return leftValue.indexOf(item) >= 0;
        });
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

  }, {
    key: '_in',
    value: function _in(leftValue, rightValue) {
      if (!rightValue) {
        return false;
      }

      if (Array.isArray(leftValue) && Array.isArray(rightValue)) {
        if (leftValue.length === 0) {
          return false;
        }

        return leftValue.every(function (item) {
          return rightValue.indexOf(item) >= 0;
        });
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

  }, {
    key: 'condition',
    value: function condition(_ref) {
      var attribute = _ref.attribute,
          value = _ref.value,
          left = _ref.left,
          op = _ref.op,
          right = _ref.right,
          clause = _ref.clause,
          conditions = _ref.conditions;

      if (clause) {
        return this.conditionGroup({ clause: clause, conditions: conditions });
      }

      // if we're working with an attribute; assume its a statement
      var leftValue = attribute ? this.statement(attribute) : this.side(left);
      ['boolean', 'number'].includes(typeof leftValue === 'undefined' ? 'undefined' : _typeof(leftValue)) || leftValue || (leftValue = ''); // handling false or 0 value
      var rightValue = this.side(['string', 'boolean', 'number'].includes(typeof value === 'undefined' ? 'undefined' : _typeof(value)) ? value : value || right);
      if (typeof rightValue === 'boolean') {
        // only for boolean dependency 
        leftValue = leftValue === 'true' ? true : leftValue === 'false' ? false : leftValue; // passing boolean instead of string
      }
      // above changes are for blank value received in "value field" THREE11CAP-5511

      if ((leftValue || typeof leftValue == 'number') && rightValue && !isNaN(leftValue) && !isNaN(rightValue)) {
        leftValue = Number(leftValue);
        rightValue = Number(rightValue);
      }
      //above changes are for Alert validation getting fired on submission even when the answers are valid.(https://incapsulate.atlassian.net/browse/PGC311-249)

      switch (op) {
        case OPS.gt:
          return leftValue > rightValue;
        case OPS.gte:
          return leftValue >= rightValue;
        case OPS.lt:
          return leftValue < rightValue;
        case OPS.lte:
          return leftValue <= rightValue;
        case OPS.eq:
          return this._areEqual(leftValue === '' ? null : leftValue, rightValue === '' ? null : rightValue);
        case OPS.neq:
          return !this._areEqual(leftValue, rightValue);
        case OPS.in:
          return this._in(leftValue, rightValue);
        case OPS.ct:
          return this._contains(leftValue, rightValue);
      }
    }

    /**
     * Resolves a condition group, determinng if the condition group is valid or not.
     * @param the condition group entity to be evaluated.
     * @return {boolean} true if the condition group evaluates to true, false otherwise
     */

  }, {
    key: 'conditionGroup',
    value: function conditionGroup(_ref2) {
      var _this7 = this;

      var clause = _ref2.clause,
          conditions = _ref2.conditions;

      var isAnd = clause === CLAUSES.and;

      if (conditions.length === 0) {
        return true;
      }

      return conditions.reduce(function (acc, item) {

        // if we've see a "false" and we're doing an AND
        // we can just skip to the end
        if (!acc && isAnd) {
          return false;
        }

        // if we've see a "false" and we're doing an OR
        // we can just skip to the end
        if (acc && !isAnd) {
          return true;
        }

        // otherwise we need to evaluate our condition
        return _this7.condition(item);
      }, isAnd);
    }
  }]);

  return ConditionEvaluator;
}();

exports.default = ConditionEvaluator;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNThlNjhmZDFjZWNlZTRlNjgyODkiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbIkRFRkFVTFRfU1RBVEVNRU5UUyIsIlNlcnZpY2VRdWVzdGlvbkNvZGUiLCJPdXRjb21lUXVlc3Rpb25Db2RlIiwiQWRkcmVzcyIsIkFkZHJlc3NMYXllciIsIkNMQVVTRVMiLCJhbmQiLCJvciIsIk9QUyIsImd0IiwibHQiLCJndGUiLCJsdGUiLCJlcSIsIm5lcSIsImluIiwiY3QiLCJpc0VtcHR5Iiwib2JqIiwia2V5IiwiaGFzT3duUHJvcGVydHkiLCJDb25kaXRpb25FdmFsdWF0b3IiLCJjdHgiLCJtYXAiLCJjdXJyZW50QWRkcmVzc0xheWVyIiwiZmVhdHVyZSIsImF0dHJpYnV0ZXMiLCJ1bmRlZmluZWQiLCJ2YWx1ZSIsImRpc3BsYXlGaWVsZE5hbWUiLCJfU1RBVEVNRU5UUyIsInZhbHVlcyIsImJpbmQiLCJhbGxWYWx1ZXMiLCJhbGxWYWx1ZXNXaXRoQWxsUmVzdWx0IiwiYWxsTWVzc2FnZXNXaXRoQWxsUmVzdWx0IiwicmVzb2x2ZUFsbFdpdGhBbGxSZXN1bHQiLCJtZXNzYWdlIiwiZXZhbHVhdGUiLCJyZXNvbHZlIiwiaXNTdGF0ZW1lbnQiLCJzdGF0ZW1lbnQiLCJzaWRlIiwiX2FyZUVxdWFsIiwiY29uZGl0aW9uIiwiY29uZGl0aW9uR3JvdXAiLCJzZXRTdGF0ZW1lbnRzIiwiY29uZGl0aW9uR3JvdXBzIiwicmVzb2x2ZUFsbCIsInRhcmdldCIsInJlc3VsdCIsImZpbmQiLCJkZXBlbmRlbnRPbiIsImZpbHRlciIsIml0ZW0iLCJuZXdTdGF0ZW1lbnRzIiwiT2JqZWN0Iiwia2V5cyIsInJlZHVjZSIsImFjYyIsInN0YXRlbWVudFR5cGUiLCJtYXRjaGVzIiwibWF0Y2hBbGxTdGF0ZW1lbnRzIiwibGVuZ3RoIiwic3RhdGVtZW50U3RyaW5nIiwic3RhdGVtZW50cyIsIkFycmF5IiwiaXNBcnJheSIsInN0IiwibWF0Y2giLCJtYXRjaGVkUmVzdWx0IiwiZ3JvdXBzIiwiXyIsIl9kZWVwR2V0IiwiaSIsInBhdGgiLCJwaWVjZXMiLCJzcGxpdCIsIm5vZGUiLCJsZWZ0VmFsdWUiLCJyaWdodFZhbHVlIiwic29ydCIsImV2ZXJ5IiwidiIsInNvbWUiLCJpbmRleE9mIiwiYXR0cmlidXRlIiwibGVmdCIsIm9wIiwicmlnaHQiLCJjbGF1c2UiLCJjb25kaXRpb25zIiwiaW5jbHVkZXMiLCJpc05hTiIsIk51bWJlciIsIl9pbiIsIl9jb250YWlucyIsImlzQW5kIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoRUEsSUFBTUEscUJBQXFCO0FBQ3pCQyx1QkFBcUIsQ0FDbkIsaURBRG1CLEVBRW5CLGtEQUZtQixFQUduQixTQUhtQixDQURJO0FBTXpCQyx1QkFBcUIsQ0FDbkIsa0RBRG1CLENBTkk7QUFTekJDLFdBQVMsQ0FDUCxpQkFETyxDQVRnQjtBQVl6QkMsZ0JBQWMsQ0FDWixpQ0FEWTtBQVpXLENBQTNCOztBQWlCQSxJQUFNQyxVQUFVO0FBQ2RDLE9BQUssS0FEUyxFQUNGQyxJQUFJO0FBREYsQ0FBaEI7O0FBSUEsSUFBTUMsTUFBTTtBQUNWQyxNQUFJLElBRE0s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ZjtBQVVEOztBQUVEOzs7Ozs7OzswQ0FLdUM7QUFBQTs7QUFBQSxVQUF0QlUsTUFBc0IsU0FBdEJBLE1BQXNCO0FBQUEsVUFBZEMsVUFBYyxTQUFkQSxVQUFjOztBQUNyQyxVQUFNTSxRQUFRUCxXQUFXckYsUUFBUUMsR0FBakM7O0FBRUEsVUFBR3FGLFdBQVc1QixNQUFYLEtBQXNCLENBQXpCLEVBQTRCO0FBQzFCLGVBQU8sSUFBUDtBQUNEOztBQUdELGFBQU80QixXQUFXakMsTUFBWCxDQUNMLFVBQUNDLEdBQUQsRUFBTUwsSUFBTixFQUFlOztBQUViO0FBQ0E7QUFDQSxZQUFHLENBQUNLLEdBQUQsSUFBUXNDLEtBQVgsRUFBa0I7QUFDaEIsaUJBQU8sS0FBUDtBQUNEOztBQUVEO0FBQ0E7QUFDQSxZQUFHdEMsT0FBTyxDQUFDc0MsS0FBWCxFQUFrQjtBQUNoQixpQkFBTyxJQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxlQUFPLE9BQUtyRCxTQUFMLENBQWVVLElBQWYsQ0FBUDtBQUNELE9BakJJLEVBa0JMMkMsS0FsQkssQ0FBUDtBQW9CRDs7Ozs7O2tCQXRaa0I1RSxrQiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGlkZW50aXR5IGZ1bmN0aW9uIGZvciBjYWxsaW5nIGhhcm1vbnkgaW1wb3J0cyB3aXRoIHRoZSBjb3JyZWN0IGNvbnRleHRcbiBcdF9fd2VicGFja19yZXF1aXJlX18uaSA9IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZTsgfTtcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNThlNjhmZDFjZWNlZTRlNjgyODkiLCJjb25zdCBERUZBVUxUX1NUQVRFTUVOVFMgPSB7XG4gIFNlcnZpY2VRdWVzdGlvbkNvZGU6IFtcbiAgICAvU2VydmljZVF1ZXN0aW9uQ29kZVxcWyguKilcXF1cXC5JbmNhcDMxMV9BbnN3ZXJfX2MvLFxuICAgIC9TZXJ2aWNlUXVlc3Rpb25Db2RlXFxbKC4qKVxcXVxcLkluY2FwMzExX19BbnN3ZXJfX2MvLFxuICAgIC8oRlEtLiopL1xuICBdLFxuICBPdXRjb21lUXVlc3Rpb25Db2RlOiBbXG4gICAgL091dGNvbWVRdWVzdGlvbkNvZGVcXFsoLiopXFxdXFwuSW5jYXAzMTFfX0Fuc3dlcl9fYy8sXG4gIF0sXG4gIEFkZHJlc3M6IFtcbiAgICAvQWRkcmVzc1xcWyguKilcXF0vXG4gIF0sXG4gIEFkZHJlc3NMYXllcjogW1xuICAgIC9BZGRyZXNzTGF5ZXJcXFsoLiopPSguKilcXF1cXC4oLiopL1xuICBdXG59O1xuXG5jb25zdCBDTEFVU0VTID0ge1xuICBhbmQ6ICdBTkQnLCBvcjogJ09SJ1xufTtcblxuY29uc3QgT1BTID0ge1xuICBndDogJ2d0JywgbHQ6ICdsdCcsIGd0ZTogJ2d0ZScsIGx0ZTogJ2x0ZScsXG4gIGVxOiAnZXEnLCBuZXE6ICduZXEnLCBpbjogJ2luJywgY3Q6ICdjdCdcbn07XG5cbi8qKiBVdGlsaXR5IGZ1bmN0aW9uIHdoaWNoIHdpbGwgY2hlY2sgaWYgb2JqZWN0IGlzIGVtcHR5IG9yIG5vdCAqL1xuZnVuY3Rpb24gaXNFbXB0eShvYmopIHtcbiAgZm9yKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgICBpZihvYmouaGFzT3duUHJvcGVydHkoa2V5KSlcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vKiogQ2xhc3MgZm9yIGhhbmRsaW5nIGNvbmRpdGlvbiBldmFsdWF0aW9uICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb25kaXRpb25FdmFsdWF0b3Ige1xuXG4gIC8qKlxuICAgKiAgQ3JlYXRlIGEgbmV3IENvbmRpdGlvbiBFdmFsdWF0b3IuXG4gICAqICBAcGFyYW0ge09iamVjdC48c3RyaW5nLCBPYmplY3QuPHN0cmluZywgc3RyaW5nPj59IFRoZSBjb250ZXh0IG9mIHRoZSBldmFsdWF0aW9uLlxuICAgKiAgdGhpcyB3aWxsIGJlIHVzZWQgdG8gZGV0ZXJtaW5lIHdoYXQgdmFsdWVzIHRvIHJlcGxhY2Ugc3RhdGVtZW50cyB3aXRoLlxuICAgKi9cbiAgY29uc3RydWN0b3IoY3R4KSB7XG4gICAgdGhpcy5jdHggPSBjdHggfHwge307XG4gICAgXG4gICAgLy9JZiByZXNwb25zZSBpcyBBZGRyZXNzTGF5ZXIgc3RydWN0dXJlIGlzIGRpZmZlcmVudCB0aGVuIEFQSSByZXNwb25zZSAoYmVjYXVzZSBvZiBlc3JpLWxvYWRlciBhcGkpXG4gICAgaWYoIHRoaXMuY3R4LkFkZHJlc3NMYXllciAmJiAhaXNFbXB0eSh0aGlzLmN0eC5BZGRyZXNzTGF5ZXIpICl7XG4gICAgICB0aGlzLmN0eC5BZGRyZXNzTGF5ZXIubWFwKChjdXJyZW50QWRkcmVzc0xheWVyKSA9PiB7XG4gICAgICAgIGlmKCBjdXJyZW50QWRkcmVzc0xheWVyLmZlYXR1cmUgJiYgY3VycmVudEFkZHJlc3NMYXllci5mZWF0dXJlLmF0dHJpYnV0ZXMgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAvL3ZhbHVlIHByb3BlcnR5IGZyb20gbGF5ZXIncyB2YWx1ZSBpbiBhdHRyaWJ1dGVzXG4gICAgICAgICAgaWYoY3VycmVudEFkZHJlc3NMYXllci52YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjdXJyZW50QWRkcmVzc0xheWVyLnZhbHVlID0gY3VycmVudEFkZHJlc3NMYXllci5mZWF0dXJlLmF0dHJpYnV0ZXNbY3VycmVudEFkZHJlc3NMYXllci5kaXNwbGF5RmllbGROYW1lXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvL3B1bGwtb3V0IGF0dHJpYnV0ZXMgZnJvbSBmZWF0dXJlXG4gICAgICAgICAgaWYoY3VycmVudEFkZHJlc3NMYXllci5hdHRyaWJ1dGVzID09PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICBjdXJyZW50QWRkcmVzc0xheWVyLmF0dHJpYnV0ZXMgPSBjdXJyZW50QWRkcmVzc0xheWVyLmZlYXR1cmUuYXR0cmlidXRlcztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvL3JlbW92ZSBmZWF0dXJlIHByb3BlcnR5XG4gICAgICAgICAgZGVsZXRlIGN1cnJlbnRBZGRyZXNzTGF5ZXIuZmVhdHVyZTtcblxuICAgICAgICAgIHJldHVybiBjdXJyZW50QWRkcmVzc0xheWVyO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIHRoaXMuX1NUQVRFTUVOVFMgPSBERUZBVUxUX1NUQVRFTUVOVFM7XG5cbiAgICB0aGlzLnZhbHVlcyA9IHRoaXMudmFsdWVzLmJpbmQodGhpcyk7XG4gICAgdGhpcy5hbGxWYWx1ZXMgPSB0aGlzLmFsbFZhbHVlcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYWxsVmFsdWVzV2l0aEFsbFJlc3VsdCA9IHRoaXMuYWxsVmFsdWVzV2l0aEFsbFJlc3VsdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuYWxsTWVzc2FnZXNXaXRoQWxsUmVzdWx0ID0gdGhpcy5hbGxNZXNzYWdlc1dpdGhBbGxSZXN1bHQuYmluZCh0aGlzKTtcbiAgICB0aGlzLnJlc29sdmVBbGxXaXRoQWxsUmVzdWx0ID0gdGhpcy5yZXNvbHZlQWxsV2l0aEFsbFJlc3VsdC5iaW5kKHRoaXMpO1xuICAgIHRoaXMubWVzc2FnZSA9IHRoaXMubWVzc2FnZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuZXZhbHVhdGUgPSB0aGlzLmV2YWx1YXRlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5yZXNvbHZlID0gdGhpcy5yZXNvbHZlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5pc1N0YXRlbWVudCA9IHRoaXMuaXNTdGF0ZW1lbnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLnN0YXRlbWVudCA9IHRoaXMuc3RhdGVtZW50LmJpbmQodGhpcyk7XG4gICAgdGhpcy5zaWRlID0gdGhpcy5zaWRlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fYXJlRXF1YWwgPSB0aGlzLl9hcmVFcXVhbC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuY29uZGl0aW9uID0gdGhpcy5jb25kaXRpb24uYmluZCh0aGlzKTtcbiAgICB0aGlzLmNvbmRpdGlvbkdyb3VwID0gdGhpcy5jb25kaXRpb25Hcm91cC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuc2V0U3RhdGVtZW50cyA9IHRoaXMuc2V0U3RhdGVtZW50cy5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGZpcnN0IHRydXRoeSBjb25kaXRpb24ncyBcInZhbHVlc1wiIGF0dHJpYnV0ZS5cbiAgICogQHBhcmFtIHRoZSBkZXBlbmRlbmN5IGdyb3VwIHRvIGV2YWx1YXRlXG4gICAqIEByZXR1cm4ge0FycmF5Lnt9fSB0aGUgZmlyc3QgdHJ1dGh5IGRlcGVuZGVuY3kgZ3JvdXBzJyB2YWx1ZXNcbiAgICovXG4gIHZhbHVlcyhjb25kaXRpb25Hcm91cHMpIHtcbiAgICByZXR1cm4gdGhpcy5yZXNvbHZlKGNvbmRpdGlvbkdyb3VwcywgJ3ZhbHVlcycpO1xuICB9XG5cbiAgYWxsVmFsdWVzKGNvbmRpdGlvbkdyb3Vwcykge1xuICAgIHJldHVybiB0aGlzLnJlc29sdmVBbGwoY29uZGl0aW9uR3JvdXBzLCAndmFsdWVzJyk7XG4gIH1cblxuICBhbGxWYWx1ZXNXaXRoQWxsUmVzdWx0KGNvbmRpdGlvbkdyb3Vwcykge1xuICAgIHJldHVybiB0aGlzLnJlc29sdmVBbGxXaXRoQWxsUmVzdWx0KGNvbmRpdGlvbkdyb3VwcywgJ3ZhbHVlcycpO1xuICB9XG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBmaXJzdCB0cnV0aHkgY29uZGl0aW9uJ3MgXCJtZXNzYWdlXCIgYXR0cmlidXRlLlxuICAgKiBAcGFyYW0gdGhlIGRlcGVuZGVuY3kgZ3JvdXAgdG8gZXZhbHVhdGVcbiAgICogQHJldHVybiB7c3RyaW5nfSB0aGUgZmlyc3QgdHJ1dGh5IGRlcGVuZGVuY3kgZ3JvdXBzJyBtZXNzYWdlXG4gICAqL1xuICBtZXNzYWdlKGNvbmRpdGlvbkdyb3Vwcykge1xuICAgIHJldHVybiB0aGlzLnJlc29sdmUoY29uZGl0aW9uR3JvdXBzLCAnbWVzc2FnZScpO1xuICB9XG5cbiAgYWxsTWVzc2FnZXMoY29uZGl0aW9uR3JvdXBzKSB7XG4gICByZXR1cm4gdGhpcy5yZXNvbHZlQWxsKGNvbmRpdGlvbkdyb3VwcywgJ21lc3NhZ2UnKTtcbiAgfVxuXG4gIGFsbE1lc3NhZ2VzV2l0aEFsbFJlc3VsdChjb25kaXRpb25Hcm91cHMpIHtcbiAgICByZXR1cm4gdGhpcy5yZXNvbHZlQWxsV2l0aEFsbFJlc3VsdChjb25kaXRpb25Hcm91cHMsICdtZXNzYWdlJyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBjb25kaXRpb24gZ3JvdXBcbiAgICogQHBhcmFtIHRoZSBjb25kaXRpb24gZ3JvdXAgdG8gZXZhbHVhdGVcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgY29uZGl0aW9uIGdyb3VwIGlzIHRydXRoeSwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAqL1xuICBldmFsdWF0ZShjb25kaXRpb25Hcm91cCkge1xuICAgIHJldHVybiB0aGlzLmNvbmRpdGlvbkdyb3VwKGNvbmRpdGlvbkdyb3VwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHdoaWNoIGV2ZXIgdGFyZ2V0IHZhbHVlIGlzIHRydXRoeSBmb3IgdGhlIHByb3ZpZGVkIGNvbmRpdGlvbiBncm91cC5cbiAgICogbnVsbCBpZiBubyBjb25kaXRpb25zIGdyb3VwcyBhcmUgdHJ1dGh5XG4gICAqIEBwYXJhbSB0aGUgY29uZGl0aW9uIGdyb3VwIHRvIGV2YWx1YXRlXG4gICAqIEBwYXJhbSB0aGUgdGFyZ2V0IGZpZWxkIHRvIHJldHVybiBpZiB0aGUgY29uZGl0aW9uIGdyb3VwIGlzIHRydXRoeVxuICAgKiBAcmV0dXJuIHt7fX0gdGhlIGZpcnN0IHRydXRoeSBkZXBlbmRlbmN5IGdyb3VwcycgbWVzc2FnZVxuICAgKi9cbiAgcmVzb2x2ZShjb25kaXRpb25Hcm91cHMsIHRhcmdldCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IGNvbmRpdGlvbkdyb3Vwc1xuICAgICAgLmZpbmQoY29uZGl0aW9uR3JvdXAgPT4gdGhpcy5jb25kaXRpb25Hcm91cChjb25kaXRpb25Hcm91cC5kZXBlbmRlbnRPbikpO1xuXG4gICAgcmV0dXJuIHJlc3VsdCA/IHJlc3VsdFt0YXJnZXRdIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFsbCBjb25kaXRpb24gZ3JvdXBzIHZhbHVlIGFyZSB0cnV0aHkgZ2l2ZSB0aGUgc3RhdGUuIExpc3QgcmV0dXJuZWRcbiAgICogaXMgb2YgYWxsIHRoZSB2YWx1ZXMgb2YgdGhlIHRhcmdldC5cbiAgICogQHBhcmFtIHRoZSBjb25kaXRpb24gZ3JvdXAgdG8gZXZhbHVhdGVcbiAgICogQHBhcmFtIHRoZSB0YXJnZXQgZmllbGQgdG8gcmV0dXJuIGlmIHRoZSBjb25kaXRpb24gZ3JvdXAgaXMgdHJ1dGh5XG4gICAqIEByZXR1cm4gW10gYWxsIG1lc3NhZ2VzIGZvciB0cnV0aHkgY29uZGl0aW9uIGdyb3Vwc1xuICAgKi9cbiAgcmVzb2x2ZUFsbChjb25kaXRpb25Hcm91cHMsIHRhcmdldCkge1xuICAgIHJldHVybiBjb25kaXRpb25Hcm91cHNcbiAgICAgIC5maWx0ZXIoY29uZGl0aW9uR3JvdXAgPT4gdGhpcy5jb25kaXRpb25Hcm91cChjb25kaXRpb25Hcm91cC5kZXBlbmRlbnRPbikpXG4gICAgICAubWFwKGl0ZW0gPT4gaXRlbVt0YXJnZXRdKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFsbCBjb25kaXRpb24gZ3JvdXBzIHZhbHVlIGFyZSB0cnV0aHkgYW5kIGZhbHN5IGdpdmUgdGhlIHN0YXRlLiBMaXN0IHJldHVybmVkXG4gICAqIGlzIG9mIGFsbCB0aGUgdmFsdWVzIG9mIHRoZSB0YXJnZXQuXG4gICAqIEBwYXJhbSB0aGUgY29uZGl0aW9uIGdyb3VwIHRvIGV2YWx1YXRlXG4gICAqIEBwYXJhbSB0aGUgdGFyZ2V0IGZpZWxkIHRvIHJldHVybiBpZiB0aGUgY29uZGl0aW9uIGdyb3VwIGlzIHRydXRoeSBvciBmYWxzeVxuICAgKiBAcmV0dXJuIFtdIGFsbCByZXN1bHRzIGZvciB0cnV0aHkgYW5kIGZhbHN5IGNvbmRpdGlvbiBncm91cHNcbiAgICovXG4gIHJlc29sdmVBbGxXaXRoQWxsUmVzdWx0KGNvbmRpdGlvbkdyb3VwcywgdGFyZ2V0KSB7XG4gICAgcmV0dXJuIGNvbmRpdGlvbkdyb3Vwc1xuICAgICAgLm1hcChjb25kaXRpb25Hcm91cCA9PiB0aGlzLmNvbmRpdGlvbkdyb3VwKGNvbmRpdGlvbkdyb3VwLmRlcGVuZGVudE9uKSA/IGNvbmRpdGlvbkdyb3VwW3RhcmdldF0gOiB1bmRlZmluZWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIExldHMgdGhlIHVzZXIgc3BlY2lmeSB3aGF0IHN0YXRlbWVudHMgYXJlIHN1cHBvcnRlZC4gVGhpcyBpcyBmb3IgYWR2YW5jZWRcbiAgICogdXNlIG9ubHkuXG4gICAqIEBwYXJhbSB0aGUgbmV3IHN0YXRlbWVudHMgdG8gdXNlLlxuICAgKiBAcmV0dXJuIHtDb25kaXRpb25FdmFsdWF0b3J9IGEgcmVmZXJlbmNlIHRvIHRoaXMgb2JqZWN0XG4gICAqL1xuICBzZXRTdGF0ZW1lbnRzKG5ld1N0YXRlbWVudHMpIHtcbiAgICB0aGlzLl9TVEFURU1FTlRTID0gbmV3U3RhdGVtZW50cztcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgaWYgYSBnaXZlbiBzdHJpbmcgaXMgYSBzdGF0ZW1lbnQgYnkgY29tcGFyaW5nIHRvIGVpdGhlciB0aGUgZGVmYXVsdFxuICAgKiBzZXQgb2Ygc3RhdGVtZW50czsgb3IgYSB1c2VyIHNwZWNpZmllZCBzZXQuXG4gICAqIEBwYXJhbSB0aGUgc3RhdGVtZW50IHRvIGJlIGNvbnNpZGVyZWRcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgdmFsdWUgaXMgYSBzdGF0ZW1lbnQsIGZhbHNlIG90aGVyd2lzZVxuICAgKi9cbiAgaXNTdGF0ZW1lbnQoc3RhdGVtZW50KSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuX1NUQVRFTUVOVFMpLnJlZHVjZSgoYWNjLCBzdGF0ZW1lbnRUeXBlKSA9PiB7XG4gICAgICAgIGlmKGFjYykge1xuICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtYXRjaGVzID0gdGhpcy5tYXRjaEFsbFN0YXRlbWVudHMoc3RhdGVtZW50LCB0aGlzLl9TVEFURU1FTlRTW3N0YXRlbWVudFR5cGVdKTtcblxuICAgICAgICByZXR1cm4gbWF0Y2hlcyA/IG1hdGNoZXMubGVuZ3RoID4gMSA6IGZhbHNlXG4gICAgfSwgZmFsc2UpXG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyB3aGljaCBzdGF0ZW1lbnQgZ3JvdXAgYSBnaXZlbiBzdGF0ZW1lbnQgYmVsb25ncyB0by4gV2lsbCByZXR1cm4gdGhlIGZpcnN0IG1hdGNoLFxuICAgKiBvciBudWxsIGlmIG5vIG1hdGNoZXMgYXJlIGZvdW5kXG4gICAqIEBwYXJhbSB0aGUgc3RhdGVtZW50IHRvIGJlIGNvbnNpZGVyZWRcbiAgICogQHBhcmFtIGFsbCBzdGF0ZW1lbnRzIHRvIGJlIGNvbnNpZGVyZWRcbiAgICogQHJldHVybiB7c3RyaW5nfSB0aGUgc3RhdGVtZW50IGdyb3VwIHRoYXQgdGhlIHN0YXRlbWVudCBiZWxvbmdzIHRvLCBudWxsIG90aGVyd2lzZVxuICAgKi9cbiAgbWF0Y2hBbGxTdGF0ZW1lbnRzKHN0YXRlbWVudFN0cmluZywgc3RhdGVtZW50cykge1xuICAgIGlmKCFzdGF0ZW1lbnRTdHJpbmcgfHwgIXN0YXRlbWVudHMpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmKEFycmF5LmlzQXJyYXkoc3RhdGVtZW50cykpIHtcbiAgICAgIHJldHVybiBzdGF0ZW1lbnRzLnJlZHVjZSgoYWNjLCBzdCkgPT4gYWNjIHx8IHRoaXMubWF0Y2hBbGxTdGF0ZW1lbnRzKHN0YXRlbWVudFN0cmluZywgc3QpLCBudWxsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdGVtZW50U3RyaW5nLm1hdGNoKHN0YXRlbWVudHMpO1xuXG4gIH1cblxuICAvKipcbiAgICogUmVzb2x2ZXMgdGhlIHZhbHVlIG9mIGEgZ2l2ZW4gc3RhdGVtZW50LlxuICAgKiBAcGFyYW0gdGhlIHN0YXRlbWVudCB0byBiZSByZXNvbHZlZFxuICAgKiBAcmV0dXJuIHt7fX0gdGhlIHZhbHVlIG9mIHRoZSBzdGF0ZW1lbnQsIG51bGwgaWYgdGhlIHZhbHVlIGNhbm5vdCBiZSBmb3VuZFxuICAgKi9cbiAgc3RhdGVtZW50KHN0YXRlbWVudCkge1xuICAgIGNvbnN0IG1hdGNoZWRSZXN1bHQgPSBPYmplY3Qua2V5cyh0aGlzLl9TVEFURU1FTlRTKS5tYXAoc3RhdGVtZW50VHlwZSA9PiB7XG4gICAgICBjb25zdCBncm91cHMgPSB0aGlzLm1hdGNoQWxsU3RhdGVtZW50cyhzdGF0ZW1lbnQsIHRoaXMuX1NUQVRFTUVOVFNbc3RhdGVtZW50VHlwZV0pO1xuXG4gICAgICBpZihncm91cHMgJiYgZ3JvdXBzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgLy8gdGhpcyBhc3N1bWVzIHRoZSBrZXkgaXMgZmlyc3QgZWxlbWVudCBtYXRjaGVkXG4gICAgICAgIC8vIHdlIG1heSBuZWVkIHRvIGV4dGVuZCB0aGlzIGF0IHNvbWUgcG9pbnRcbiAgICAgICAgY29uc3QgWyBfLCAuLi5rZXlzIF0gPSBncm91cHM7XG5cbiAgICAgICAgcmV0dXJuIHsgc3RhdGVtZW50VHlwZSwga2V5cyB9O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSlcbiAgICAuZmlsdGVyKGl0ZW0gPT4gISFpdGVtKTtcblxuXG4gICAgLy8gQE5PVEVcbiAgICAvLyB3ZSBhcmUgYXNzdW1pbmcgdGhhdCBpZiBubyBtYXRjaGVkUmVzdWx0IHdhcyBwcm92aWRlZCB0aGVuIHdlIHNob3VsZCBjaGVja1xuICAgIC8vIHRvIHNlZSBpZiBpdHMgYSBTZXJ2aWNlUXVlc3Rpb25Db2RlOyBhbmQgaWYgaXQgaXMgcmV0dXJuIGl0LiBUaGlzIHdhcyBkb25lXG4gICAgLy8gdG8gYWRkcmVzcyB0aGUgaXNzdWUgcmVnYXJkaW5nIHRoZSBBUEkgbm90IHJldHVybmluZyB0aGUgXCJ0cnVlXCIgY29uZGl0aW9uXG4gICAgaWYobWF0Y2hlZFJlc3VsdC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzLmN0eFsnU2VydmljZVF1ZXN0aW9uQ29kZSddICYmIHRoaXMuY3R4WydTZXJ2aWNlUXVlc3Rpb25Db2RlJ11bc3RhdGVtZW50XSA/XG4gICAgICAgIHRoaXMuY3R4WydTZXJ2aWNlUXVlc3Rpb25Db2RlJ11bc3RhdGVtZW50XSA6XG4gICAgICAgIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgWyB7IHN0YXRlbWVudFR5cGUsIGtleXMgfSBdID0gbWF0Y2hlZFJlc3VsdDtcblxuICAgIGlmKEFycmF5LmlzQXJyYXkodGhpcy5jdHhbc3RhdGVtZW50VHlwZV0pKSB7XG4gICAgICAvLyBmaW5kIHRoZSBmaXJzdCBtYXRjaGluZyBjb250ZXh0IHZhbHVlIChkZWZhdWx0IHRvIGFuIGVtcHR5IG9iamVjdClcbiAgICAgIC8vIGFuZCByZXR1cm4gaXRzIHZhbHVlOyBpZiB0aGUgdmFsdWUgaXMgdW5kZWZpbmVkIHJldHVybiBudWxsIGluc3RlYWRcbiAgICAgIGNvbnN0IG1hdGNoID0gdGhpcy5jdHhbc3RhdGVtZW50VHlwZV0uZmluZChpID0+IHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fYXJlRXF1YWwodGhpcy5fZGVlcEdldChpLCBrZXlzWzBdKSwga2V5c1sxXSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHRoaXMuX2RlZXBHZXQobWF0Y2gsIGtleXNbMl0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmN0eFtzdGF0ZW1lbnRUeXBlXVtrZXlzWzBdXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNvbHZlcyBhIHNpZGUgb2YgYSBjb25kaXRpb24uXG4gICAqIEBwYXJhbSB0aGUgdmFsdWUgdG8gYmUgY29tcHV0ZWQ7IGlmIGl0cyBhIHNpbXBsZSB2YWx1ZSBpdCB3aWxsIGJlIHNpbXBseSByZXR1cm5lZDtcbiAgICogaWYgaXQgaXMgYSBzdGF0ZW1lbnQgaXQgd2lsbCBiZSByZXNvbHZlZC5cbiAgICogQHJldHVybiB7e319IHRoZSB2YWx1ZSBvZiB0aGUgc2lkZVxuICAgKi9cbiAgc2lkZSh2YWx1ZSkge1xuICAgIGlmKHR5cGVvZih2YWx1ZSkgPT09ICdzdHJpbmcnICYmIHRoaXMuaXNTdGF0ZW1lbnQodmFsdWUpKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdGF0ZW1lbnQodmFsdWUpO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBHZXQgdGhlIGRlZXBseSBuZXN0ZWQgdmFsdWUgb2YgYSBKU09OIG9iamVjdDsgaWYgcG9zc2JsZS4gVGhpcyBmdW5jdGlvbiB3aWxsXG4gICAqIHJldHVybiBudWxsIGlmIHRoZSBwYXRoIGRvZXMgbm90IGV4aXN0LlxuICAgKiBAcGFyYW0gb2JqZWN0IHRvIGJlIHNlYXJjaGVkIGluXG4gICAqIEBwYXJhbSBwZXJpb2Qgc2VwZXJhdGVkIHBhdGhcbiAgICogQHJldHVybiB0aGUgdmFsdWUgb2YgdGhhdCBub2RlXG4gICAqL1xuICBfZGVlcEdldChpdGVtLCBwYXRoKSB7XG4gICAgLy8gc2hvcnQgY2lyY3VpdCBpZiB0aGUgaXRlbSBpc24ndCBhIHZhbHVlXG4gICAgaWYoIWl0ZW0pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHBpZWNlcyA9IHBhdGguc3BsaXQoJ1xcLicpO1xuXG4gICAgcmV0dXJuIHBpZWNlcy5yZWR1Y2UoKGFjYywgbm9kZSkgPT4gYWNjW25vZGVdID8gYWNjW25vZGVdIDogYWNjLCBpdGVtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBEZXRlcm1pbmVzIGlmIHR3byB2YWx1ZSBhcmUgZXF1YWw7IGFsc28gY2hlY2ttaW5nIHRoYXQgYWxsIGFycmF5IHZhbHVlcyBhcmUgZXF1YWwuXG4gICAqIE9ubHkgZG9lcyBhIHNoYWxsb3cgY29tcGFyaXNvbi5cbiAgICogQHBhcmFtIHNldCBvZiBmaXJzdCB2YWx1ZXMgdG8gY29tcGFyZVxuICAgKiBAcGFyYW0gc2V0IG9mIHNlY29uZCB2YWx1ZXMgdG8gY29tcGFyZVxuICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWFsOyBmYWxzZSBvdGhlcndpc2UuXG4gICAqL1xuICBfYXJlRXF1YWwobGVmdFZhbHVlLCByaWdodFZhbHVlKSB7XG4gICAgLy8gaWYgYm90aCBhcmUgYXJyYXlzOyB0aGVuIGNvbXBhcmUgYWxsIGVsZW1lbnRzLlxuXG4gICAgaWYoQXJyYXkuaXNBcnJheShsZWZ0VmFsdWUpICYmIEFycmF5LmlzQXJyYXkocmlnaHRWYWx1ZSkpIHtcbiAgICAgIGxlZnRWYWx1ZS5zb3J0KCk7XG4gICAgICByaWdodFZhbHVlLnNvcnQoKTtcbiAgICAgIHJldHVybiBsZWZ0VmFsdWUubGVuZ3RoID09PSByaWdodFZhbHVlLmxlbmd0aCAmJiBsZWZ0VmFsdWUuZXZlcnkoKHYsaSk9PiB2ID09PSByaWdodFZhbHVlW2ldKVxuICAgIH1cblxuICAgIC8vIEBOT1RFXG4gICAgLy8gSW50ZW50aW9uYWxseSBkb2luZyBhIFwiZXFlcVwiIGNvbXBhcmUgdnMgZXFlcWVxIHNvIHRoYXQgXCI1XCIgYW5kIDUgYXJlIGVxdWFsLlxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcWVxZXFcbiAgICByZXR1cm4gbGVmdFZhbHVlID09IHJpZ2h0VmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICogRGV0ZXJtaW5lcyBpZiB0aGUgcmlnaHQgdmFsdWUgaXMgY29udGFpbmVkIGluIHRoZSBsZWZ0LiBUaGlzIGRvZXMgc3Vic3RyaW5nXG4gICAqIGNvbXBhcmlzb24gYW5kIHN1Yi1hcnJheSBjb21wYXJpc29uc1xuICAgKiBAcGFyYW0gdGhlIHZhbHVlcyB0byBiZSBzZWFyY2hlZCBpbi5cbiAgICogQHBhcmFtIHRoZSB2YWx1ZXMgdG8gYmUgc2VhcmNoZWQgZm9yLlxuICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoZSByaWdodCBzaWRlIGlzIGNvbnRhaW5lZCBpbiB0aGUgbGVmdC5cbiAgICovXG4gIF9jb250YWlucyhsZWZ0VmFsdWUsIHJpZ2h0VmFsdWUpIHtcbiAgICBpZighbGVmdFZhbHVlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYoQXJyYXkuaXNBcnJheShsZWZ0VmFsdWUpICYmIEFycmF5LmlzQXJyYXkocmlnaHRWYWx1ZSkpIHtcbiAgICAgIGlmKHJpZ2h0VmFsdWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmlnaHRWYWx1ZS5zb21lKGl0ZW0gPT4gbGVmdFZhbHVlLmluZGV4T2YoaXRlbSkgPj0gMCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxlZnRWYWx1ZS5pbmRleE9mKHJpZ2h0VmFsdWUpID49IDA7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICogRGV0ZXJtaW5lcyBpZiB0aGUgbGVmdCB2YWx1ZSBpcyBjb250YWluZWQgaW4gdGhlIHJpZ2h0LiBUaGlzIGRvZXMgc3Vic3RyaW5nXG4gICAqIGNvbXBhcmlzb24gYW5kIHN1Yi1hcnJheSBjb21wYXJpc29uc1xuICAgKiBAcGFyYW0gdGhlIHZhbHVlcyB0byBiZSBzZWFyY2hlZCBmb3IuXG4gICAqIEBwYXJhbSB0aGUgdmFsdWVzIHRvIGJlIHNlYXJjaGVkIGluLlxuICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoZSBsZWZ0IHNpZGUgaXMgY29udGFpbmVkIGluIHRoZSByaWdodC5cbiAgICovXG4gIF9pbihsZWZ0VmFsdWUsIHJpZ2h0VmFsdWUpIHtcbiAgICBpZighcmlnaHRWYWx1ZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmKEFycmF5LmlzQXJyYXkobGVmdFZhbHVlKSAmJiBBcnJheS5pc0FycmF5KHJpZ2h0VmFsdWUpKSB7XG4gICAgICBpZihsZWZ0VmFsdWUubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbGVmdFZhbHVlLmV2ZXJ5KGl0ZW0gPT4gcmlnaHRWYWx1ZS5pbmRleE9mKGl0ZW0pID49IDApO1xuICAgIH1cblxuICAgIHJldHVybiByaWdodFZhbHVlLmluZGV4T2YobGVmdFZhbHVlKSA+PSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc29sdmVzIGEgY29uZGl0aW9uIG9yIGNvbmRpdGlvbiBncm91cC4gSWYgY2xhdXNlIGlzIG5vdCBwcm92aWRlZDsgdGhlbiBpdFxuICAgKiBpcyBhc3N1bWVkIHdlIHNob3VsZCBiZSBsb29raW5nIGZvciBhIGxpc3Qgb2YgY29uZGl0aW9ucy4gSWYgY2xhdXNlIGlzIHByb3ZpZGVkO1xuICAgKiB3ZSBsb29rIGZvciBhIGNvbWJpbmF0aW9uIG9mIGF0dHJpYnV0ZS9sZWZ0LCB2YWx1ZS9yaWdodCBhbmQgb3AuXG4gICAqIEBwYXJhbSB0aGUgY29uZGl0aW9uIG9yIGNvbmRpdGlvbiBncm91cCBlbnRpdHkgdG8gYmUgZXZhbHVhdGVkLlxuICAgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoZSBvcGVyYXRvciBpcyB0cnVlIGZvciB0aGUgdmFsdWVzLCBmYWxzZSBvdGhlcndpc2VcbiAgICovXG4gIGNvbmRpdGlvbih7IGF0dHJpYnV0ZSwgdmFsdWUsIGxlZnQsIG9wLCByaWdodCwgY2xhdXNlLCBjb25kaXRpb25zIH0pIHtcbiAgICBpZihjbGF1c2UpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvbkdyb3VwKHsgY2xhdXNlLCBjb25kaXRpb25zIH0pO1xuICAgIH1cblxuICAgIC8vIGlmIHdlJ3JlIHdvcmtpbmcgd2l0aCBhbiBhdHRyaWJ1dGU7IGFzc3VtZSBpdHMgYSBzdGF0ZW1lbnRcbiAgICBsZXQgbGVmdFZhbHVlID0gYXR0cmlidXRlID8gdGhpcy5zdGF0ZW1lbnQoYXR0cmlidXRlKSA6IHRoaXMuc2lkZShsZWZ0KTtcbiAgICAoWydib29sZWFuJywgJ251bWJlciddLmluY2x1ZGVzKHR5cGVvZiBsZWZ0VmFsdWUpIHx8IChsZWZ0VmFsdWUgfHwgKGxlZnRWYWx1ZSA9ICcnKSkpOyAvLyBoYW5kbGluZyBmYWxzZSBvciAwIHZhbHVlXG4gICAgbGV0IHJpZ2h0VmFsdWUgPSB0aGlzLnNpZGUoWydzdHJpbmcnLCAnYm9vbGVhbicsICdudW1iZXInXS5pbmNsdWRlcyh0eXBlb2YgdmFsdWUpID8gdmFsdWUgOiB2YWx1ZSB8fCByaWdodCk7XG4gICAgaWYgKHR5cGVvZiByaWdodFZhbHVlID09PSAnYm9vbGVhbicpIHsgLy8gb25seSBmb3IgYm9vbGVhbiBkZXBlbmRlbmN5IFxuICAgICAgbGVmdFZhbHVlID0gbGVmdFZhbHVlID09PSAndHJ1ZScgPyB0cnVlIDogbGVmdFZhbHVlID09PSAnZmFsc2UnID8gZmFsc2UgOiBsZWZ0VmFsdWU7IC8vIHBhc3NpbmcgYm9vbGVhbiBpbnN0ZWFkIG9mIHN0cmluZ1xuICAgIH1cbiAgICAvLyBhYm92ZSBjaGFuZ2VzIGFyZSBmb3IgYmxhbmsgdmFsdWUgcmVjZWl2ZWQgaW4gXCJ2YWx1ZSBmaWVsZFwiIFRIUkVFMTFDQVAtNTUxMVxuXG4gICAgaWYgKChsZWZ0VmFsdWUgfHwgdHlwZW9mIGxlZnRWYWx1ZSA9PSAnbnVtYmVyJykgJiYgcmlnaHRWYWx1ZSAmJiAhaXNOYU4obGVmdFZhbHVlKSAmJiAhaXNOYU4ocmlnaHRWYWx1ZSkpIHtcbiAgICAgIGxlZnRWYWx1ZSA9IE51bWJlcihsZWZ0VmFsdWUpO1xuICAgICAgcmlnaHRWYWx1ZSA9IE51bWJlcihyaWdodFZhbHVlKTtcbiAgICB9XG4gICAgLy9hYm92ZSBjaGFuZ2VzIGFyZSBmb3IgQWxlcnQgdmFsaWRhdGlvbiBnZXR0aW5nIGZpcmVkIG9uIHN1Ym1pc3Npb24gZXZlbiB3aGVuIHRoZSBhbnN3ZXJzIGFyZSB2YWxpZC4oaHR0cHM6Ly9pbmNhcHN1bGF0ZS5hdGxhc3NpYW4ubmV0L2Jyb3dzZS9QR0MzMTEtMjQ5KVxuXG4gICAgc3dpdGNoIChvcCkge1xuICAgICAgY2FzZSBPUFMuZ3Q6IHJldHVybiBsZWZ0VmFsdWUgPiByaWdodFZhbHVlO1xuICAgICAgY2FzZSBPUFMuZ3RlOiByZXR1cm4gbGVmdFZhbHVlID49IHJpZ2h0VmFsdWU7XG4gICAgICBjYXNlIE9QUy5sdDogcmV0dXJuIGxlZnRWYWx1ZSA8IHJpZ2h0VmFsdWU7XG4gICAgICBjYXNlIE9QUy5sdGU6IHJldHVybiBsZWZ0VmFsdWUgPD0gcmlnaHRWYWx1ZTtcbiAgICAgIGNhc2UgT1BTLmVxOiByZXR1cm4gdGhpcy5fYXJlRXF1YWwoKGxlZnRWYWx1ZSA9PT0gJycgPyBudWxsIDogbGVmdFZhbHVlKSwgKHJpZ2h0VmFsdWUgPT09ICcnID8gbnVsbCA6IHJpZ2h0VmFsdWUpKTtcbiAgICAgIGNhc2UgT1BTLm5lcTogcmV0dXJuICF0aGlzLl9hcmVFcXVhbChsZWZ0VmFsdWUsIHJpZ2h0VmFsdWUpO1xuICAgICAgY2FzZSBPUFMuaW46IHJldHVybiB0aGlzLl9pbihsZWZ0VmFsdWUsIHJpZ2h0VmFsdWUpO1xuICAgICAgY2FzZSBPUFMuY3Q6IHJldHVybiB0aGlzLl9jb250YWlucyhsZWZ0VmFsdWUsIHJpZ2h0VmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNvbHZlcyBhIGNvbmRpdGlvbiBncm91cCwgZGV0ZXJtaW5uZyBpZiB0aGUgY29uZGl0aW9uIGdyb3VwIGlzIHZhbGlkIG9yIG5vdC5cbiAgICogQHBhcmFtIHRoZSBjb25kaXRpb24gZ3JvdXAgZW50aXR5IHRvIGJlIGV2YWx1YXRlZC5cbiAgICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBpZiB0aGUgY29uZGl0aW9uIGdyb3VwIGV2YWx1YXRlcyB0byB0cnVlLCBmYWxzZSBvdGhlcndpc2VcbiAgICovXG4gIGNvbmRpdGlvbkdyb3VwKHsgY2xhdXNlLCBjb25kaXRpb25zIH0pIHtcbiAgICBjb25zdCBpc0FuZCA9IGNsYXVzZSA9PT0gQ0xBVVNFUy5hbmQ7XG5cbiAgICBpZihjb25kaXRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG5cbiAgICByZXR1cm4gY29uZGl0aW9ucy5yZWR1Y2UoXG4gICAgICAoYWNjLCBpdGVtKSA9PiB7XG5cbiAgICAgICAgLy8gaWYgd2UndmUgc2VlIGEgXCJmYWxzZVwiIGFuZCB3ZSdyZSBkb2luZyBhbiBBTkRcbiAgICAgICAgLy8gd2UgY2FuIGp1c3Qgc2tpcCB0byB0aGUgZW5kXG4gICAgICAgIGlmKCFhY2MgJiYgaXNBbmQpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiB3ZSd2ZSBzZWUgYSBcImZhbHNlXCIgYW5kIHdlJ3JlIGRvaW5nIGFuIE9SXG4gICAgICAgIC8vIHdlIGNhbiBqdXN0IHNraXAgdG8gdGhlIGVuZFxuICAgICAgICBpZihhY2MgJiYgIWlzQW5kKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBvdGhlcndpc2Ugd2UgbmVlZCB0byBldmFsdWF0ZSBvdXIgY29uZGl0aW9uXG4gICAgICAgIHJldHVybiB0aGlzLmNvbmRpdGlvbihpdGVtKTtcbiAgICAgIH0sXG4gICAgICBpc0FuZFxuICAgICk7XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VSb290IjoiIn0=