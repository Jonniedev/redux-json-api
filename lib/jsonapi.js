"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof3 = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateResource = exports.setAxiosConfig = exports.requireResource = exports.replaceRelationship = exports.reducer = exports.readRelationship = exports.readRelated = exports.readEndpoint = exports.hydrateStore = exports.getResources = exports.getResourceTree = exports.getResourceData = exports.getResource = exports.getRelatedResources = exports.deleteResource = exports.deleteRelationship = exports.createResource = exports.addRelationship = exports.IS_UPDATING = exports.IS_DELETING = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _reduxActions = require("redux-actions");

var imm = _interopRequireWildcard(require("object-path-immutable"));

var _reReselect = require("re-reselect");

var _stateMutation = require("./state-mutation");

var _utils = require("./utils");

var _constants = _interopRequireDefault(require("./constants"));

var _handleActions;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof3(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var API_SET_AXIOS_CONFIG = _constants["default"].API_SET_AXIOS_CONFIG,
    API_HYDRATE = _constants["default"].API_HYDRATE,
    API_WILL_CREATE = _constants["default"].API_WILL_CREATE,
    API_CREATED = _constants["default"].API_CREATED,
    API_CREATE_FAILED = _constants["default"].API_CREATE_FAILED,
    API_WILL_READ = _constants["default"].API_WILL_READ,
    API_RELATIONSHIP_READ = _constants["default"].API_RELATIONSHIP_READ,
    API_READ = _constants["default"].API_READ,
    API_READ_FAILED = _constants["default"].API_READ_FAILED,
    API_WILL_UPDATE = _constants["default"].API_WILL_UPDATE,
    API_UPDATED = _constants["default"].API_UPDATED,
    API_UPDATE_FAILED = _constants["default"].API_UPDATE_FAILED,
    API_WILL_DELETE = _constants["default"].API_WILL_DELETE,
    API_DELETED = _constants["default"].API_DELETED,
    API_DELETE_FAILED = _constants["default"].API_DELETE_FAILED,
    API_RELATIONSHIP_WILL_UPDATE = _constants["default"].API_RELATIONSHIP_WILL_UPDATE,
    API_RELATIONSHIP_UPDATED = _constants["default"].API_RELATIONSHIP_UPDATED,
    API_RELATIONSHIP_UPDATE_FAILED = _constants["default"].API_RELATIONSHIP_UPDATE_FAILED,
    API_RELATIONSHIP_WILL_DELETE = _constants["default"].API_RELATIONSHIP_WILL_DELETE,
    API_RELATIONSHIP_DELETED = _constants["default"].API_RELATIONSHIP_DELETED,
    API_RELATIONSHIP_DELETE_FAILED = _constants["default"].API_RELATIONSHIP_DELETE_FAILED; // Resource isInvalidating values

var IS_DELETING = 'IS_DELETING';
exports.IS_DELETING = IS_DELETING;
var IS_UPDATING = 'IS_UPDATING'; // Action creators

exports.IS_UPDATING = IS_UPDATING;
var setAxiosConfig = (0, _reduxActions.createAction)(API_SET_AXIOS_CONFIG);
exports.setAxiosConfig = setAxiosConfig;
var hydrateStore = (0, _reduxActions.createAction)(API_HYDRATE);
exports.hydrateStore = hydrateStore;
var apiWillCreate = (0, _reduxActions.createAction)(API_WILL_CREATE);
var apiCreated = (0, _reduxActions.createAction)(API_CREATED);
var apiCreateFailed = (0, _reduxActions.createAction)(API_CREATE_FAILED);
var apiWillRead = (0, _reduxActions.createAction)(API_WILL_READ);
var apiRead = (0, _reduxActions.createAction)(API_READ);
var apiRelationshipRead = (0, _reduxActions.createAction)(API_RELATIONSHIP_READ);
var apiReadFailed = (0, _reduxActions.createAction)(API_READ_FAILED);
var apiWillUpdate = (0, _reduxActions.createAction)(API_WILL_UPDATE);
var apiUpdated = (0, _reduxActions.createAction)(API_UPDATED);
var apiUpdateFailed = (0, _reduxActions.createAction)(API_UPDATE_FAILED);
var apiWillDelete = (0, _reduxActions.createAction)(API_WILL_DELETE);
var apiDeleted = (0, _reduxActions.createAction)(API_DELETED);
var apiDeleteFailed = (0, _reduxActions.createAction)(API_DELETE_FAILED);
var apiRelationshipWillUpdate = (0, _reduxActions.createAction)(API_RELATIONSHIP_WILL_UPDATE);
var apiRelationshipUpdated = (0, _reduxActions.createAction)(API_RELATIONSHIP_UPDATED);
var apiRelationshipUpdateFailed = (0, _reduxActions.createAction)(API_RELATIONSHIP_UPDATE_FAILED);
var apiRelationshipWillDelete = (0, _reduxActions.createAction)(API_RELATIONSHIP_WILL_DELETE);
var apiRelationshipDeleted = (0, _reduxActions.createAction)(API_RELATIONSHIP_DELETED);
var apiRelationshipDeleteFailed = (0, _reduxActions.createAction)(API_RELATIONSHIP_DELETE_FAILED);

var createResource = function createResource(resource) {
  return function (dispatch, getState) {
    dispatch(apiWillCreate(resource));
    var axiosConfig = getState().api.endpoint.axiosConfig;

    var options = _objectSpread(_objectSpread({}, axiosConfig), {}, {
      method: 'POST',
      data: JSON.stringify({
        data: resource
      })
    });

    return new Promise(function (resolve, reject) {
      (0, _utils.apiRequest)(resource.type.replace('--', '/'), options).then(function (json) {
        dispatch(apiCreated(json));
        resolve(json);
      })["catch"](function (error) {
        var err = error;
        err.resource = resource;
        dispatch(apiCreateFailed(err));
        reject(err);
      });
    });
  };
};

exports.createResource = createResource;
var ApiResponse = /*#__PURE__*/(0, _createClass2["default"])(function ApiResponse(response, dispatch, nextUrl, prevUrl) {
  var _this = this;

  (0, _classCallCheck2["default"])(this, ApiResponse);
  (0, _defineProperty2["default"])(this, "loadNext", function () {
    return _this.dispatch(readEndpoint(_this.nextUrl));
  });
  (0, _defineProperty2["default"])(this, "loadPrev", function () {
    return _this.dispatch(readEndpoint(_this.prevUrl));
  });
  this.body = response;
  this.dispatch = dispatch;
  this.nextUrl = nextUrl;
  this.prevUrl = prevUrl;
}
/* eslint-disable */

/* eslint-enable */
);

var readEndpoint = function readEndpoint(endpoint) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$options = _ref.options,
      options = _ref$options === void 0 ? {
    indexLinks: undefined
  } : _ref$options;

  return function (dispatch, getState) {
    var finalEndpoint = endpoint;

    if ((0, _typeof2["default"])(endpoint) === 'object' && 'type' in endpoint) {
      finalEndpoint = "".concat(endpoint.type.replace('--', '/'), "/").concat(endpoint.id);
    }

    dispatch(apiWillRead(finalEndpoint));
    var axiosConfig = getState().api.endpoint.axiosConfig;
    return new Promise(function (resolve, reject) {
      (0, _utils.apiRequest)(endpoint, axiosConfig).then(function (json) {
        dispatch(apiRead(_objectSpread({
          finalEndpoint: finalEndpoint,
          options: options
        }, json)));
        var nextUrl = (0, _utils.getPaginationUrl)(json, 'next', axiosConfig.baseURL);
        var prevUrl = (0, _utils.getPaginationUrl)(json, 'prev', axiosConfig.baseURL);
        resolve(new ApiResponse(json, dispatch, nextUrl, prevUrl));
      })["catch"](function (error) {
        var err = error;
        err.endpoint = finalEndpoint;
        dispatch(apiReadFailed(err));
        reject(err);
      });
    });
  };
};

exports.readEndpoint = readEndpoint;

var updateResource = function updateResource(resource) {
  return function (dispatch, getState) {
    dispatch(apiWillUpdate(resource));
    var axiosConfig = getState().api.endpoint.axiosConfig;
    var endpoint = "".concat(resource.type.replace('--', '/'), "/").concat(resource.id);

    var options = _objectSpread(_objectSpread({}, axiosConfig), {}, {
      method: 'PATCH',
      data: {
        data: resource
      }
    });

    return new Promise(function (resolve, reject) {
      (0, _utils.apiRequest)(endpoint, options).then(function (json) {
        dispatch(apiUpdated(json));
        resolve(json);
      })["catch"](function (error) {
        var err = error;
        err.resource = resource;
        dispatch(apiUpdateFailed(err));
        reject(err);
      });
    });
  };
};

exports.updateResource = updateResource;

var deleteResource = function deleteResource(resource) {
  return function (dispatch, getState) {
    dispatch(apiWillDelete(resource));
    var axiosConfig = getState().api.endpoint.axiosConfig;
    var endpoint = "".concat(resource.type.replace('--', '/'), "/").concat(resource.id);

    var options = _objectSpread(_objectSpread({}, axiosConfig), {}, {
      method: 'DELETE'
    });

    return new Promise(function (resolve, reject) {
      (0, _utils.apiRequest)(endpoint, options).then(function () {
        dispatch(apiDeleted(resource));
        resolve();
      })["catch"](function (error) {
        var err = error;
        err.resource = resource;
        dispatch(apiDeleteFailed(err));
        reject(err);
      });
    });
  };
};

exports.deleteResource = deleteResource;

var requireResource = function requireResource(resourceType) {
  var endpoint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : resourceType;
  return function (dispatch, getState) {
    return new Promise(function (resolve, reject) {
      var _getState = getState(),
          api = _getState.api;

      if (api.hasOwnProperty(resourceType)) {
        resolve();
      }

      dispatch(readEndpoint(endpoint)).then(resolve)["catch"](reject);
    });
  };
};

exports.requireResource = requireResource;

var readRelated = function readRelated(resource, relationship) {
  var queryString = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  return function (dispatch, getState) {
    var endpoint;
    var axiosConfig = getState().api.endpoint.axiosConfig;

    if ((0, _utils.hasOwnProperties)(resource, ['relationships', relationship, 'links', 'related'])) {
      endpoint = resource.relationships[relationship].links.related;

      if ((0, _utils.hasOwnProperties)(resource.relationships[relationship].links.related, ['href'])) {
        endpoint = resource.relationships[relationship].links.related.href;
      }

      if (axiosConfig.baseURL && endpoint.indexOf(axiosConfig.baseURL) === 0) {
        endpoint = endpoint.replace(axiosConfig.baseURL, '');
      }
    }

    if (!endpoint) {
      endpoint = "".concat(resource.type.replace('--', '/'), "/").concat(resource.id, "/").concat(relationship);
    }

    return dispatch(readEndpoint("".concat(endpoint).concat(queryString)));
  };
};

exports.readRelated = readRelated;

var getRelationshipEndpoint = function getRelationshipEndpoint(resource, relationship, axiosConfig) {
  if ((0, _utils.hasOwnProperties)(resource, ['relationships', relationship, 'links', 'self'])) {
    var endpoint = resource.relationships[relationship].links.self;

    if ((0, _utils.hasOwnProperties)(resource.relationships[relationship].links.self, ['href'])) {
      endpoint = resource.relationships[relationship].links.self.href;
    }

    if (axiosConfig.baseURL && endpoint.indexOf(axiosConfig.baseURL) === 0) {
      endpoint = endpoint.replace(axiosConfig.baseURL, '');
    }

    return endpoint;
  }

  return "".concat(resource.type.replace('--', '/'), "/").concat(resource.id, "/relationships/").concat(relationship);
};

var readRelationship = function readRelationship(resource, relationship) {
  var queryString = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  return function (dispatch, getState) {
    var axiosConfig = getState().api.endpoint.axiosConfig;
    var endpoint = getRelationshipEndpoint(resource, relationship, axiosConfig) + queryString;
    dispatch(apiWillRead(endpoint));
    return new Promise(function (resolve, reject) {
      (0, _utils.apiRequest)(endpoint, axiosConfig).then(function (json) {
        dispatch(apiRelationshipRead({
          resource: resource,
          relationship: relationship,
          data: json
        }));
        resolve(json);
      })["catch"](function (error) {
        var err = error;
        err.resource = resource;
        err.relationship = relationship;
        dispatch(apiReadFailed(err));
        reject(err);
      });
    });
  };
};

exports.readRelationship = readRelationship;

var replaceRelationship = function replaceRelationship(resource, relationship, data) {
  return function (dispatch, getState) {
    dispatch(apiRelationshipWillUpdate({
      resource: resource,
      relationship: relationship
    }));
    var axiosConfig = getState().api.endpoint.axiosConfig;
    var endpoint = getRelationshipEndpoint(resource, relationship, axiosConfig);

    var options = _objectSpread(_objectSpread({}, axiosConfig), {}, {
      method: 'PATCH',
      data: {
        data: data
      }
    });

    return new Promise(function (resolve, reject) {
      (0, _utils.apiRequest)(endpoint, options).then(function (json) {
        dispatch(apiRelationshipUpdated({
          resource: resource,
          relationship: relationship,
          data: json
        }));
        resolve(json);
      })["catch"](function (error) {
        var err = error;
        err.resource = resource;
        err.relationship = relationship;
        dispatch(apiRelationshipUpdateFailed(err));
        reject(err);
      });
    });
  };
};

exports.replaceRelationship = replaceRelationship;

var addRelationship = function addRelationship(resource, relationship, data) {
  return function (dispatch, getState) {
    dispatch(apiRelationshipWillUpdate({
      resource: resource,
      relationship: relationship
    }));
    var axiosConfig = getState().api.endpoint.axiosConfig;
    var endpoint = getRelationshipEndpoint(resource, relationship, axiosConfig);

    var options = _objectSpread(_objectSpread({}, axiosConfig), {}, {
      method: 'POST',
      data: {
        data: data
      }
    });

    return new Promise(function (resolve, reject) {
      (0, _utils.apiRequest)(endpoint, options).then(function (json) {
        dispatch(apiRelationshipUpdated({
          resource: resource,
          relationship: relationship,
          data: json
        }));
        resolve(json);
      })["catch"](function (error) {
        var err = error;
        err.resource = resource;
        err.relationship = relationship;
        dispatch(apiRelationshipUpdateFailed(err));
        reject(err);
      });
    });
  };
};

exports.addRelationship = addRelationship;

var deleteRelationship = function deleteRelationship(resource, relationship, data) {
  return function (dispatch, getState) {
    dispatch(apiRelationshipWillDelete({
      resource: resource,
      relationship: relationship
    }));
    var axiosConfig = getState().api.endpoint.axiosConfig;
    var endpoint = getRelationshipEndpoint(resource, relationship, axiosConfig);

    var options = _objectSpread(_objectSpread({}, axiosConfig), {}, {
      method: 'DELETE',
      data: {
        data: data
      }
    });

    return new Promise(function (resolve, reject) {
      (0, _utils.apiRequest)(endpoint, options).then(function (json) {
        dispatch(apiRelationshipDeleted({
          resource: resource,
          relationship: relationship,
          data: json
        }));
        resolve(json);
      })["catch"](function (error) {
        var err = error;
        err.resource = resource;
        err.relationship = relationship;
        dispatch(apiRelationshipDeleteFailed(err));
        reject(err);
      });
    });
  };
}; // Reducers


exports.deleteRelationship = deleteRelationship;
var reducer = (0, _reduxActions.handleActions)((_handleActions = {}, (0, _defineProperty2["default"])(_handleActions, API_SET_AXIOS_CONFIG, function (state, _ref2) {
  var axiosConfig = _ref2.payload;
  return imm.wrap(state).set(['endpoint', 'axiosConfig'], axiosConfig).value();
}), (0, _defineProperty2["default"])(_handleActions, API_HYDRATE, function (state, _ref3) {
  var resources = _ref3.payload;
  var entities = Array.isArray(resources.data) ? resources.data : [resources.data];
  var newState = (0, _stateMutation.updateOrInsertResourcesIntoState)(state, entities.concat(resources.included || []));
  return imm.wrap(newState).value();
}), (0, _defineProperty2["default"])(_handleActions, API_WILL_CREATE, function (state) {
  return imm.wrap(state).set(['isCreating'], state.isCreating + 1).value();
}), (0, _defineProperty2["default"])(_handleActions, API_CREATED, function (state, _ref4) {
  var resources = _ref4.payload;
  var entities = Array.isArray(resources.data) ? resources.data : [resources.data];
  var newState = (0, _stateMutation.updateOrInsertResourcesIntoState)(state, entities.concat(resources.included || []));
  return imm.wrap(newState).set('isCreating', state.isCreating - 1).value();
}), (0, _defineProperty2["default"])(_handleActions, API_CREATE_FAILED, function (state) {
  return imm.wrap(state).set(['isCreating'], state.isCreating - 1).value();
}), (0, _defineProperty2["default"])(_handleActions, API_WILL_READ, function (state) {
  return imm.wrap(state).set(['isReading'], state.isReading + 1).value();
}), (0, _defineProperty2["default"])(_handleActions, API_READ, function (state, _ref5) {
  var payload = _ref5.payload;
  var resources = (Array.isArray(payload.data) ? payload.data : [payload.data]).concat(payload.included || []);
  var newState = (0, _stateMutation.updateOrInsertResourcesIntoState)(state, resources);
  var finalState = (0, _stateMutation.addLinksToState)(newState, payload.links, payload.options);
  return imm.wrap(finalState).set('isReading', state.isReading - 1).value();
}), (0, _defineProperty2["default"])(_handleActions, API_RELATIONSHIP_READ, function (state, _ref6) {
  var _ref6$payload = _ref6.payload,
      resource = _ref6$payload.resource,
      relationship = _ref6$payload.relationship,
      data = _ref6$payload.data;
  var newState = (0, _stateMutation.updateRelationship)(state, resource, relationship, data);
  return imm.wrap(newState).set('isReading', state.isReading - 1).value();
}), (0, _defineProperty2["default"])(_handleActions, API_READ_FAILED, function (state) {
  return imm.wrap(state).set(['isReading'], state.isReading - 1).value();
}), (0, _defineProperty2["default"])(_handleActions, API_WILL_UPDATE, function (state, _ref7) {
  var resource = _ref7.payload;
  var type = resource.type,
      id = resource.id;
  var newState = (0, _stateMutation.ensureResourceTypeInState)(state, type);
  return (0, _stateMutation.setIsInvalidatingForExistingResource)(newState, {
    type: type,
    id: id
  }, IS_UPDATING).set('isUpdating', state.isUpdating + 1).value();
}), (0, _defineProperty2["default"])(_handleActions, API_UPDATED, function (state, _ref8) {
  var resources = _ref8.payload;
  var entities = Array.isArray(resources.data) ? resources.data : [resources.data];
  var newState = (0, _stateMutation.updateOrInsertResourcesIntoState)(state, entities.concat(resources.included || []));
  return imm.wrap(newState).set('isUpdating', state.isUpdating - 1).value();
}), (0, _defineProperty2["default"])(_handleActions, API_UPDATE_FAILED, function (state, _ref9) {
  var resource = _ref9.payload.resource;
  var type = resource.type,
      id = resource.id;
  return (0, _stateMutation.setIsInvalidatingForExistingResource)(state, {
    type: type,
    id: id
  }, IS_UPDATING).set('isUpdating', state.isUpdating - 1).value();
}), (0, _defineProperty2["default"])(_handleActions, API_WILL_DELETE, function (state, _ref10) {
  var resource = _ref10.payload;
  var type = resource.type,
      id = resource.id;
  return (0, _stateMutation.setIsInvalidatingForExistingResource)(state, {
    type: type,
    id: id
  }, IS_DELETING).set('isDeleting', state.isDeleting + 1).value();
}), (0, _defineProperty2["default"])(_handleActions, API_DELETED, function (state, _ref11) {
  var resource = _ref11.payload;
  return (0, _stateMutation.removeResourceFromState)(state, resource).set('isDeleting', state.isDeleting - 1).value();
}), (0, _defineProperty2["default"])(_handleActions, API_DELETE_FAILED, function (state, _ref12) {
  var resource = _ref12.payload.resource;
  var type = resource.type,
      id = resource.id;
  return (0, _stateMutation.setIsInvalidatingForExistingResource)(state, {
    type: type,
    id: id
  }, IS_DELETING).set('isDeleting', state.isDeleting - 1).value();
}), (0, _defineProperty2["default"])(_handleActions, API_RELATIONSHIP_WILL_UPDATE, function (state, _ref13) {
  var _ref13$payload = _ref13.payload,
      resource = _ref13$payload.resource,
      relationship = _ref13$payload.relationship;
  var type = resource.type,
      id = resource.id;
  var newState = (0, _stateMutation.ensureRelationshipInState)(state, {
    type: type,
    id: id
  }, relationship);
  return (0, _stateMutation.setIsInvalidatingForExistingRelationship)(newState, {
    type: type,
    id: id
  }, relationship, IS_UPDATING).set('isUpdating', state.isUpdating + 1).value();
}), (0, _defineProperty2["default"])(_handleActions, API_RELATIONSHIP_UPDATED, function (state, _ref14) {
  var _ref14$payload = _ref14.payload,
      resource = _ref14$payload.resource,
      relationship = _ref14$payload.relationship,
      data = _ref14$payload.data;
  var newState = (0, _stateMutation.updateRelationship)(state, resource, relationship, data);
  return imm.wrap(newState).set('isUpdating', state.isUpdating - 1).value();
}), (0, _defineProperty2["default"])(_handleActions, API_RELATIONSHIP_UPDATE_FAILED, function (state, _ref15) {
  var _ref15$payload = _ref15.payload,
      resource = _ref15$payload.resource,
      relationship = _ref15$payload.relationship;
  var type = resource.type,
      id = resource.id;
  return (0, _stateMutation.setIsInvalidatingForExistingRelationship)(state, {
    type: type,
    id: id
  }, relationship, IS_UPDATING).set('isUpdating', state.isUpdating - 1).value();
}), (0, _defineProperty2["default"])(_handleActions, API_RELATIONSHIP_WILL_DELETE, function (state, _ref16) {
  var _ref16$payload = _ref16.payload,
      resource = _ref16$payload.resource,
      relationship = _ref16$payload.relationship;
  var type = resource.type,
      id = resource.id;
  var newState = (0, _stateMutation.ensureRelationshipInState)(state, {
    type: type,
    id: id
  }, relationship);
  return (0, _stateMutation.setIsInvalidatingForExistingRelationship)(newState, {
    type: type,
    id: id
  }, relationship, IS_DELETING).set('isDeleting', state.isDeleting + 1).value();
}), (0, _defineProperty2["default"])(_handleActions, API_RELATIONSHIP_DELETED, function (state, _ref17) {
  var _ref17$payload = _ref17.payload,
      resource = _ref17$payload.resource,
      relationship = _ref17$payload.relationship,
      data = _ref17$payload.data;
  var newState = (0, _stateMutation.updateRelationship)(state, resource, relationship, data);
  return imm.wrap(newState).set('isDeleting', state.isDeleting - 1).value();
}), (0, _defineProperty2["default"])(_handleActions, API_RELATIONSHIP_DELETE_FAILED, function (state, _ref18) {
  var _ref18$payload = _ref18.payload,
      resource = _ref18$payload.resource,
      relationship = _ref18$payload.relationship;
  var type = resource.type,
      id = resource.id;
  return (0, _stateMutation.setIsInvalidatingForExistingRelationship)(state, {
    type: type,
    id: id
  }, relationship, IS_DELETING).set('isDeleting', state.isDeleting - 1).value();
}), _handleActions), {
  isCreating: 0,
  isReading: 0,
  isUpdating: 0,
  isDeleting: 0,
  endpoint: {
    axiosConfig: {}
  }
}); // Selectors

exports.reducer = reducer;

var getResourceTree = function getResourceTree(state, resourceType) {
  return state.api[resourceType] || {
    data: []
  };
};

exports.getResourceTree = getResourceTree;

var getResourceData = function getResourceData(state, resourceType) {
  var _getResourceTree;

  return ((_getResourceTree = getResourceTree(state, resourceType)) === null || _getResourceTree === void 0 ? void 0 : _getResourceTree.data) || [];
}; // Usage getResource(state, {type: 'users, id: '1'}) or getResource(state, 'users', '1')


exports.getResourceData = getResourceData;
var getResource = (0, _reReselect.createCachedSelector)(function (state, identifier) {
  return getResourceData(state, typeof identifier === 'string' ? identifier : identifier.type);
}, function (_state, identifier, id) {
  return id || identifier.id;
}, function (resources, id) {
  return resources.find(function (resource) {
    return "".concat(resource.id) === "".concat(id);
  }) || null;
})(function (_state, identifier, id) {
  return typeof identifier === 'string' ? "".concat(identifier, "/").concat(id) : "".concat(identifier.type, "/").concat(identifier.id);
});
exports.getResource = getResource;

var getType = function getType(identifiers) {
  var type = identifiers;

  if (Array.isArray(identifiers) && identifiers.length > 0) {
    var _identifiers = (0, _slicedToArray2["default"])(identifiers, 1);

    type = _identifiers[0].type;
  }

  return type;
};

var getIdList = function getIdList(identifiers, idList) {
  return idList || identifiers.map(function (identifier) {
    return identifier.id;
  });
}; // Usage getResources(state, [{type: 'users', id: '1'}, {type: 'users', id: '2'}]) or getResources(state, 'users', ['1', '2'])


var getResources = (0, _reReselect.createCachedSelector)(function (state, identifiers) {
  return getResourceData(state, getType(identifiers));
}, function (_state, identifiers, idList) {
  return getIdList(identifiers, idList).map(function (id) {
    return "".concat(id);
  });
}, function (resources, idList) {
  return resources.filter(function (resource) {
    return idList.includes("".concat(resource.id));
  });
})(function (_state, identifiers, idList) {
  var type = getType(identifiers);
  var useIdList = getIdList(identifiers, idList);
  return "".concat(type, "/").concat(useIdList.join(':'));
}); // Usage getRelatedResources(state, {type: 'users', id: '1'}, 'transactions')

exports.getResources = getResources;

var getRelatedResources = function getRelatedResources(state, identifier, relationship) {
  var resource = getResource(state, identifier);

  if (!(0, _utils.hasOwnProperties)(resource, ['relationships', relationship, 'data'])) {
    return null;
  }

  var relationshipData = resource.relationships[relationship].data;

  if (!relationshipData) {
    return null;
  }

  return Array.isArray(relationshipData) ? getResources(state, relationshipData) : getResource(state, relationshipData);
};

exports.getRelatedResources = getRelatedResources;