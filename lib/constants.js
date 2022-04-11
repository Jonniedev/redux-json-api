"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var actionTypes = {}; // Action types of the library

['API_SET_AXIOS_CONFIG', 'API_HYDRATE', 'API_WILL_CREATE', 'API_CREATED', 'API_CREATE_FAILED', 'API_WILL_READ', 'API_READ', 'API_RELATIONSHIP_READ', 'API_READ_FAILED', 'API_WILL_UPDATE', 'API_UPDATED', 'API_UPDATE_FAILED', 'API_RELATIONSHIP_WILL_UPDATE', 'API_RELATIONSHIP_UPDATED', 'API_RELATIONSHIP_UPDATE_FAILED', 'API_WILL_DELETE', 'API_DELETED', 'API_DELETE_FAILED', 'API_RELATIONSHIP_WILL_DELETE', 'API_RELATIONSHIP_DELETED', 'API_RELATIONSHIP_DELETE_FAILED'].forEach(function (action) {
  actionTypes[action] = action;
});
var _default = actionTypes;
exports["default"] = _default;