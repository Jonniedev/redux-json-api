"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof3 = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateRelationship = exports.updateOrInsertResourcesIntoState = exports.updateOrInsertResource = exports.setIsInvalidatingForExistingResource = exports.setIsInvalidatingForExistingRelationship = exports.removeResourceFromState = exports.makeUpdateReverseRelationship = exports.ensureResourceTypeInState = exports.ensureRelationshipInState = exports.addLinksToState = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var imm = _interopRequireWildcard(require("object-path-immutable"));

var _pluralize = _interopRequireDefault(require("pluralize"));

var _deepEqual = _interopRequireDefault(require("deep-equal"));

var _utils = require("./utils");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof3(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var makeUpdateReverseRelationship = function makeUpdateReverseRelationship(resource, relationship) {
  var newRelation = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    type: resource.type,
    id: resource.id
  };
  return function (foreignResources) {
    var idx = foreignResources.findIndex(function (item) {
      return item.id === relationship.data.id;
    });

    if (idx === -1) {
      return foreignResources;
    }

    var _map = [1, 2].map(function (i) {
      return (0, _pluralize["default"])(resource.type, i);
    }),
        _map2 = (0, _slicedToArray2["default"])(_map, 2),
        singular = _map2[0],
        plural = _map2[1];

    var relCase = [singular, plural].find(function (r) {
      return (0, _utils.hasOwnProperties)(foreignResources[idx], ['relationships', r]);
    });

    if (!relCase) {
      return foreignResources;
    }

    var relPath = ['relationships', relCase, 'data'];
    var idxRelPath = [idx].concat(relPath);
    var immutableForeingResources = imm.wrap(foreignResources);

    if (!(0, _utils.hasOwnProperties)(foreignResources[idx], relPath)) {
      return immutableForeingResources.push(idxRelPath, newRelation).value();
    }

    var foreignResourceRel = foreignResources[idx].relationships[relCase].data;

    if (newRelation && Array.isArray(foreignResourceRel) && ~foreignResourceRel.findIndex( // eslint-disable-line
    function (rel) {
      return rel.id === newRelation.id && rel.type === newRelation.type;
    }) || newRelation && foreignResourceRel && foreignResourceRel.id === newRelation.id && foreignResourceRel.type === newRelation.type) {
      return foreignResources;
    }

    if (Array.isArray(foreignResourceRel) && !newRelation) {
      var relIdx = foreignResourceRel.findIndex(function (item) {
        return item.id === resource.id;
      });

      if (foreignResourceRel[relIdx]) {
        var deletePath = [idx, 'relationships', singular, 'data', relIdx];
        return imm.wrap(foreignResources).del(deletePath).value();
      }

      return foreignResources;
    }

    if (relCase === singular) {
      return immutableForeingResources.set(idxRelPath, newRelation).value();
    }

    return immutableForeingResources.push(idxRelPath, newRelation).value();
  };
};

exports.makeUpdateReverseRelationship = makeUpdateReverseRelationship;

var stateContainsResource = function stateContainsResource(state, resource) {
  var updatePath = [resource.type, 'data'];

  if ((0, _utils.hasOwnProperties)(state, updatePath)) {
    return state[resource.type].data.findIndex(function (item) {
      return item.id === resource.id;
    }) > -1;
  }

  return false;
};

var ensureUpdatedReverseRelationships = function ensureUpdatedReverseRelationships(state, resource) {
  var newState = state;
  var rels = resource.relationships;

  if (!rels) {
    return newState;
  }

  Object.keys(rels).forEach(function (relKey) {
    if (!(0, _utils.hasOwnProperties)(rels[relKey], ['data', 'type'])) {
      return;
    }

    var entityPath = [rels[relKey].data.type, 'data'];

    if (!(0, _utils.hasOwnProperties)(newState, entityPath)) {
      return;
    }

    var updateReverseRelationship = makeUpdateReverseRelationship(resource, rels[relKey]);
    newState = imm.set(newState, entityPath, updateReverseRelationship(newState[rels[relKey].data.type].data));
  });
  return newState;
};

var addLinksToState = function addLinksToState(state, links, options) {
  if (options === undefined || options.indexLinks === undefined) {
    return state;
  }

  var indexLinkName = options.indexLinks;
  return imm.set(state, "links.".concat(indexLinkName), links);
};

exports.addLinksToState = addLinksToState;

var updateRelationship = function updateRelationship(state, resourceIdentifier, relationshipName, relationship) {
  if ((0, _typeof2["default"])(resourceIdentifier) !== 'object') {
    return state;
  }

  if (!stateContainsResource(state, resourceIdentifier)) {
    return state;
  }

  var newState = state;
  var updatePath = [resourceIdentifier.type, 'data'];
  var resources = state[resourceIdentifier.type].data;
  var idx = resources.findIndex(function (item) {
    return item.id === resourceIdentifier.id;
  });
  newState = imm.set(newState, updatePath.concat.apply(updatePath, [idx, 'relationships', relationshipName]), relationship);
  return ensureUpdatedReverseRelationships(newState, resources[idx]);
};

exports.updateRelationship = updateRelationship;

var updateOrInsertResource = function updateOrInsertResource(state, resource) {
  if ((0, _typeof2["default"])(resource) !== 'object') {
    return state;
  }

  var newState = state;
  var updatePath = [resource.type, 'data'];

  if (stateContainsResource(state, resource)) {
    var resources = state[resource.type].data;
    var idx = resources.findIndex(function (item) {
      return item.id === resource.id;
    });
    var relationships = {};

    if (resources[idx].hasOwnProperty('relationships')) {
      Object.keys(resources[idx].relationships).forEach(function (relationship) {
        if (!(0, _utils.hasOwnProperties)(resource, ['relationships', relationship, 'data'])) {
          relationships[relationship] = resources[idx].relationships[relationship];
        }
      });
    }

    if (!resource.hasOwnProperty('relationships')) {
      Object.assign(resource, {
        relationships: relationships
      });
    } else {
      Object.assign(resource.relationships, relationships);
    }

    if (!(0, _deepEqual["default"])(resources[idx], resource)) {
      newState = imm.set(newState, updatePath.concat(idx), resource);
    }
  } else {
    newState = imm.push(newState, updatePath, resource);
  }

  return ensureUpdatedReverseRelationships(newState, resource);
};

exports.updateOrInsertResource = updateOrInsertResource;

var removeResourceFromState = function removeResourceFromState(state, resource) {
  var index = state[resource.type].data.findIndex(function (e) {
    return e.id === resource.id;
  });
  var path = [resource.type, 'data', index];
  var entityRelationships = resource.relationships || {};
  return Object.keys(entityRelationships).reduce(function (newState, key) {
    if (!resource.relationships[key].data) {
      return newState;
    }

    var entityPath = [resource.relationships[key].data.type, 'data'];

    if ((0, _utils.hasOwnProperties)(state, entityPath)) {
      var updateReverseRelationship = makeUpdateReverseRelationship(resource, resource.relationships[key], null);
      return newState.set(entityPath, updateReverseRelationship(state[resource.relationships[key].data.type].data));
    }

    return newState;
  }, imm.wrap(state).del(path));
};

exports.removeResourceFromState = removeResourceFromState;

var updateOrInsertResourcesIntoState = function updateOrInsertResourcesIntoState(state, resources) {
  return resources.reduce(updateOrInsertResource, state);
};

exports.updateOrInsertResourcesIntoState = updateOrInsertResourcesIntoState;

var setIsInvalidatingForExistingResource = function setIsInvalidatingForExistingResource(state, _ref) {
  var type = _ref.type,
      id = _ref.id;
  var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var idx = state[type].data.findIndex(function (e) {
    return e.id === id && e.type === type;
  });
  var updatePath = [type, 'data', idx, 'isInvalidating'];
  return value === null ? imm.wrap(state).del(updatePath) : imm.wrap(state).set(updatePath, value);
};

exports.setIsInvalidatingForExistingResource = setIsInvalidatingForExistingResource;

var setIsInvalidatingForExistingRelationship = function setIsInvalidatingForExistingRelationship(state, _ref2, relationship) {
  var type = _ref2.type,
      id = _ref2.id;
  var value = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var idx = state[type].data.findIndex(function (e) {
    return e.id === id && e.type === type;
  });
  var updatePath = [type, 'data', idx, 'relationships', relationship, 'isInvalidating'];
  return value === null ? imm.wrap(state).del(updatePath) : imm.wrap(state).set(updatePath, value);
};

exports.setIsInvalidatingForExistingRelationship = setIsInvalidatingForExistingRelationship;

var ensureResourceTypeInState = function ensureResourceTypeInState(state, type) {
  var path = [type, 'data'];
  return (0, _utils.hasOwnProperties)(state, [type]) ? state : imm.wrap(state).set(path, []).value();
};

exports.ensureResourceTypeInState = ensureResourceTypeInState;

var ensureRelationshipInState = function ensureRelationshipInState(state, _ref3, relationship) {
  var type = _ref3.type,
      id = _ref3.id;
  var idx = state[type].data.findIndex(function (e) {
    return e.id === id && e.type === type;
  });
  var path = [type, 'data', idx, 'relationships', relationship];
  return (0, _utils.hasOwnProperties)(state, path) ? state : imm.wrap(state).set(path, null).value();
};

exports.ensureRelationshipInState = ensureRelationshipInState;