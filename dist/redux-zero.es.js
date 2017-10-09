import { Children, Component, cloneElement, createElement } from 'react';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};

function createStore(state) {
    if (state === void 0) { state = {}; }
    var listeners = [];
    return {
        setState: function (update) {
            state = __assign({}, state, update);
            listeners.forEach(function (f) { return f(state); });
        },
        subscribe: function (f) {
            listeners.push(f);
        },
        unsubscribe: function (f) {
            var i = listeners.indexOf(f);
            if (i > -1) {
                listeners.splice(i, 1);
            }
        },
        getState: function () {
            return state;
        }
    };
}

function shallowEqual(a, b) {
    for (var i in a)
        if (a[i] !== b[i])
            return false;
    for (var i in b)
        if (!(i in a))
            return false;
    return true;
}

function connect(mapToProps) {
    return function (Child) {
        return /** @class */ (function (_super) {
            __extends(Connected, _super);
            function Connected() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.state = _this.getProps();
                _this.update = function () {
                    var mapped = _this.getProps();
                    if (!shallowEqual(mapped, _this.state)) {
                        _this.setState(mapped);
                    }
                };
                return _this;
            }
            Connected.prototype.componentWillMount = function () {
                this.props.store.subscribe(this.update);
            };
            Connected.prototype.componentWillUnmount = function () {
                this.props.store.unsubscribe(this.update);
            };
            Connected.prototype.getProps = function () {
                var state = (this.props.store && this.props.store.getState()) || {};
                return mapToProps(state, this.props);
            };
            Connected.prototype.render = function () {
                return (createElement(Child, __assign({ store: this.props.store }, this.props, this.state)));
            };
            return Connected;
        }(Component));
    };
}

var Provider = /** @class */ (function (_super) {
    __extends(Provider, _super);
    function Provider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Provider.prototype.render = function () {
        var _a = this.props, children = _a.children, store = _a.store;
        // Passing the store down to the children without using the context API
        var childrenWithProps = cloneElement(children, { store: store });
        return Children.only(childrenWithProps);
    };
    return Provider;
}(Component));

export { createStore, connect, Provider };
//# sourceMappingURL=redux-zero.es.js.map
