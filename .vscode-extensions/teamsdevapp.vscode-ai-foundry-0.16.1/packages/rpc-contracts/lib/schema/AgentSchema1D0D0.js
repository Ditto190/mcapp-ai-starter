"use strict";
// To parse this data:
//
//   import { Convert, AgentSchema1D0D0 } from "./file";
//
//   const agentSchema1D0D0 = Convert.toAgentSchema1D0D0(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Convert = void 0;
// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
class Convert {
    static toAgentSchema1D0D0(json) {
        return cast(JSON.parse(json), r('AgentSchema1D0D0'));
    }
    static agentSchema1D0D0ToJson(value) {
        return JSON.stringify(uncast(value, r('AgentSchema1D0D0')), null, 4);
    }
}
exports.Convert = Convert;
function invalidValue(typ, val, key, parent = '') {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}
function prettyTypeName(typ) {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        }
        else {
            return `one of [${typ
                .map((a) => {
                return prettyTypeName(a);
            })
                .join(', ')}]`;
        }
    }
    else if (typeof typ === 'object' && typ.literal !== undefined) {
        return typ.literal;
    }
    else {
        return typeof typ;
    }
}
function jsonToJSProps(typ) {
    if (typ.jsonToJS === undefined) {
        const map = {};
        typ.props.forEach((p) => (map[p.json] = { key: p.js, typ: p.typ }));
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}
function jsToJSONProps(typ) {
    if (typ.jsToJSON === undefined) {
        const map = {};
        typ.props.forEach((p) => (map[p.js] = { key: p.json, typ: p.typ }));
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}
function transform(val, typ, getProps, key = '', parent = '') {
    function transformPrimitive(typ, val) {
        if (typeof typ === typeof val)
            return val;
        return invalidValue(typ, val, key, parent);
    }
    function transformUnion(typs, val) {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            }
            catch (_) { }
        }
        return invalidValue(typs, val, key, parent);
    }
    function transformEnum(cases, val) {
        if (cases.indexOf(val) !== -1)
            return val;
        return invalidValue(cases.map((a) => {
            return l(a);
        }), val, key, parent);
    }
    function transformArray(typ, val) {
        // val must be an array with no invalid elements
        if (!Array.isArray(val))
            return invalidValue(l('array'), val, key, parent);
        return val.map((el) => transform(el, typ, getProps));
    }
    function transformDate(val) {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l('Date'), val, key, parent);
        }
        return d;
    }
    function transformObject(props, additional, val) {
        if (val === null || typeof val !== 'object' || Array.isArray(val)) {
            return invalidValue(l(ref || 'object'), val, key, parent);
        }
        const result = {};
        Object.getOwnPropertyNames(props).forEach((key) => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach((key) => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }
    if (typ === 'any')
        return val;
    if (typ === null) {
        if (val === null)
            return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false)
        return invalidValue(typ, val, key, parent);
    let ref = undefined;
    while (typeof typ === 'object' && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ))
        return transformEnum(typ, val);
    if (typeof typ === 'object') {
        return typ.hasOwnProperty('unionMembers')
            ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty('arrayItems')
                ? transformArray(typ.arrayItems, val)
                : typ.hasOwnProperty('props')
                    ? transformObject(getProps(typ), typ.additional, val)
                    : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== 'number')
        return transformDate(val);
    return transformPrimitive(typ, val);
}
function cast(val, typ) {
    return transform(val, typ, jsonToJSProps);
}
function uncast(val, typ) {
    return transform(val, typ, jsToJSONProps);
}
function l(typ) {
    return { literal: typ };
}
function a(typ) {
    return { arrayItems: typ };
}
function u(...typs) {
    return { unionMembers: typs };
}
function o(props, additional) {
    return { props, additional };
}
function m(additional) {
    return { props: [], additional };
}
function r(name) {
    return { ref: name };
}
const typeMap = {
    AgentSchema1D0D0: o([
        { json: 'version', js: 'version', typ: r('Version') },
        { json: 'name', js: 'name', typ: '' },
        { json: 'description', js: 'description', typ: u(undefined, u(null, '')) },
        { json: 'metadata', js: 'metadata', typ: u(undefined, r('Metadata')) },
        { json: 'id', js: 'id', typ: u(undefined, u(null, '')) },
        { json: 'model', js: 'model', typ: r('Model') },
        { json: 'instructions', js: 'instructions', typ: u(null, '') },
        { json: 'tools', js: 'tools', typ: u(undefined, a(r('Tool'))) }
    ], false),
    Metadata: o([
        { json: 'author', js: 'author', typ: u(undefined, '') },
        { json: 'tag', js: 'tag', typ: u(undefined, '') }
    ], 'any'),
    Model: o([
        { json: 'id', js: 'id', typ: '' },
        { json: 'options', js: 'options', typ: u(undefined, r('ModelOptions')) }
    ], false),
    ModelOptions: o([
        { json: 'temperature', js: 'temperature', typ: u(undefined, u(3.14, null)) },
        { json: 'top_p', js: 'top_p', typ: u(undefined, u(3.14, null)) }
    ], false),
    Tool: o([
        { json: 'type', js: 'type', typ: r('Type') },
        { json: 'id', js: 'id', typ: u(undefined, u(null, '')) },
        { json: 'options', js: 'options', typ: u(undefined, r('ToolOptions')) },
        { json: 'description', js: 'description', typ: u(undefined, u(null, '')) }
    ], false),
    ToolOptions: o([
        { json: 'tool_connections', js: 'tool_connections', typ: u(undefined, a('')) },
        { json: 'file_ids', js: 'file_ids', typ: u(undefined, a('')) },
        { json: 'specification', js: 'specification', typ: u(undefined, '') },
        { json: 'auth', js: 'auth', typ: u(undefined, r('Auth')) },
        { json: 'vector_store_ids', js: 'vector_store_ids', typ: u(undefined, a('')) },
        { json: 'server_url', js: 'server_url', typ: u(undefined, '') },
        { json: 'server_label', js: 'server_label', typ: u(undefined, '') },
        { json: 'allowed_tools', js: 'allowed_tools', typ: u(undefined, a('')) }
    ], false),
    Auth: o([{ json: 'type', js: 'type', typ: '' }], 'any'),
    Type: ['bing_grounding', 'code_interpreter', 'file_search', 'openapi', 'mcp'],
    Version: ['1.0.0']
};
//# sourceMappingURL=AgentSchema1D0D0.js.map