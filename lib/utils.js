"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.noop = exports.jsonContentTypes = exports.hasOwnProperties = exports.getPaginationUrl = exports.apiRequest = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _createError = _interopRequireDefault(require("axios/lib/core/createError"));

var imm = _interopRequireWildcard(require("object-path-immutable"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var jsonContentTypes = ['application/json', 'application/vnd.api+json'];
exports.jsonContentTypes = jsonContentTypes;

var hasValidContentType = function hasValidContentType(response) {
  return jsonContentTypes.some(function (contentType) {
    return response.headers['content-type'].indexOf(contentType) > -1;
  });
};

var noop = function noop() {};

exports.noop = noop;

var apiRequest = function apiRequest(url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var allOptions = imm.wrap(options).set('url', url).set(['headers', 'Accept'], 'application/vnd.api+json').set(['headers', 'Content-Type'], 'application/vnd.api+json').value();
  return (0, _axios["default"])(allOptions).then(function (res) {
    if (res.status === 204) {
      return res;
    }

    if (hasValidContentType(res) === false) {
      throw (0, _createError["default"])('Invalid Content-Type in response', res.config, null, res);
    }

    return res.data;
  });
};

exports.apiRequest = apiRequest;

var hasOwnProperties = function hasOwnProperties(obj, propertyTree) {
  if (obj instanceof Object === false) {
    return false;
  }

  var property = propertyTree[0];
  var hasProperty = obj.hasOwnProperty(property);

  if (hasProperty) {
    if (propertyTree.length === 1) {
      return hasProperty;
    }

    return hasOwnProperties(obj[property], propertyTree.slice(1));
  }

  return false;
};

exports.hasOwnProperties = hasOwnProperties;

var getPaginationUrl = function getPaginationUrl(response, direction, path) {
  if (!response.links || !hasOwnProperties(response, ['links', direction])) {
    return null;
  }

  var paginationUrl = response.links[direction];

  if (!paginationUrl) {
    return null;
  }

  if (hasOwnProperties(response.links[direction], ['href'])) {
    paginationUrl = response.links[direction].href;
  }

  return paginationUrl.replace("".concat(path, "/"), '');
};

exports.getPaginationUrl = getPaginationUrl;