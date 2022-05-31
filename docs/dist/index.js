// docs/_snowpack/pkg/common/index-12ed3d89.js
function noop() {
}
function assign(tar, src) {
  for (const k in src)
    tar[k] = src[k];
  return tar;
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b2) {
  return a != a ? b2 == b2 : a !== b2 || (a && typeof a === "object" || typeof a === "function");
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function component_subscribe(component, store, callback) {
  component.$$.on_destroy.push(subscribe(store, callback));
}
function create_slot(definition, ctx, $$scope, fn) {
  if (definition) {
    const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
    return definition[0](slot_ctx);
  }
}
function get_slot_context(definition, ctx, $$scope, fn) {
  return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
  if (definition[2] && fn) {
    const lets = definition[2](fn(dirty));
    if ($$scope.dirty === void 0) {
      return lets;
    }
    if (typeof lets === "object") {
      const merged = [];
      const len = Math.max($$scope.dirty.length, lets.length);
      for (let i = 0; i < len; i += 1) {
        merged[i] = $$scope.dirty[i] | lets[i];
      }
      return merged;
    }
    return $$scope.dirty | lets;
  }
  return $$scope.dirty;
}
function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
  if (slot_changes) {
    const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
    slot.p(slot_context, slot_changes);
  }
}
function get_all_dirty_from_scope($$scope) {
  if ($$scope.ctx.length > 32) {
    const dirty = [];
    const length2 = $$scope.ctx.length / 32;
    for (let i = 0; i < length2; i++) {
      dirty[i] = -1;
    }
    return dirty;
  }
  return -1;
}
function exclude_internal_props(props) {
  const result = {};
  for (const k in props)
    if (k[0] !== "$")
      result[k] = props[k];
  return result;
}
function compute_rest_props(props, keys) {
  const rest = {};
  keys = new Set(keys);
  for (const k in props)
    if (!keys.has(k) && k[0] !== "$")
      rest[k] = props[k];
  return rest;
}
function compute_slots(slots) {
  const result = {};
  for (const key in slots) {
    result[key] = true;
  }
  return result;
}
function set_store_value(store, ret, value2) {
  store.set(value2);
  return ret;
}
function append(target, node) {
  target.appendChild(node);
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
  for (let i = 0; i < iterations.length; i += 1) {
    if (iterations[i])
      iterations[i].d(detaching);
  }
}
function element(name) {
  return document.createElement(name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function empty() {
  return text("");
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value2) {
  if (value2 == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value2)
    node.setAttribute(attribute, value2);
}
function set_attributes(node, attributes) {
  const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
  for (const key in attributes) {
    if (attributes[key] == null) {
      node.removeAttribute(key);
    } else if (key === "style") {
      node.style.cssText = attributes[key];
    } else if (key === "__value") {
      node.value = node[key] = attributes[key];
    } else if (descriptors[key] && descriptors[key].set) {
      node[key] = attributes[key];
    } else {
      attr(node, key, attributes[key]);
    }
  }
}
function to_number(value2) {
  return value2 === "" ? null : +value2;
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_data(text2, data) {
  data = "" + data;
  if (text2.wholeText !== data)
    text2.data = data;
}
function set_input_value(input, value2) {
  input.value = value2 == null ? "" : value2;
}
function select_option(select, value2) {
  for (let i = 0; i < select.options.length; i += 1) {
    const option = select.options[i];
    if (option.__value === value2) {
      option.selected = true;
      return;
    }
  }
  select.selectedIndex = -1;
}
function select_options(select, value2) {
  for (let i = 0; i < select.options.length; i += 1) {
    const option = select.options[i];
    option.selected = ~value2.indexOf(option.__value);
  }
}
function select_value(select) {
  const selected_option = select.querySelector(":checked") || select.options[0];
  return selected_option && selected_option.__value;
}
function custom_event(type, detail, {bubbles = false, cancelable = false} = {}) {
  const e = document.createEvent("CustomEvent");
  e.initCustomEvent(type, bubbles, cancelable, detail);
  return e;
}
var current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
function createEventDispatcher() {
  const component = get_current_component();
  return (type, detail, {cancelable = false} = {}) => {
    const callbacks = component.$$.callbacks[type];
    if (callbacks) {
      const event = custom_event(type, detail, {cancelable});
      callbacks.slice().forEach((fn) => {
        fn.call(component, event);
      });
      return !event.defaultPrevented;
    }
    return true;
  };
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
  return context;
}
function getContext(key) {
  return get_current_component().$$.context.get(key);
}
function bubble(component, event) {
  const callbacks = component.$$.callbacks[event.type];
  if (callbacks) {
    callbacks.slice().forEach((fn) => fn.call(this, event));
  }
}
var dirty_components = [];
var binding_callbacks = [];
var render_callbacks = [];
var flush_callbacks = [];
var resolved_promise = Promise.resolve();
var update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
function add_flush_callback(fn) {
  flush_callbacks.push(fn);
}
var seen_callbacks = new Set();
var flushidx = 0;
function flush() {
  const saved_component = current_component;
  do {
    while (flushidx < dirty_components.length) {
      const component = dirty_components[flushidx];
      flushidx++;
      set_current_component(component);
      update(component.$$);
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
var outroing = new Set();
var outros;
function group_outros() {
  outros = {
    r: 0,
    c: [],
    p: outros
  };
}
function check_outros() {
  if (!outros.r) {
    run_all(outros.c);
  }
  outros = outros.p;
}
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function transition_out(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block))
      return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2)
          block.d(1);
        callback();
      }
    });
    block.o(local);
  }
}
function get_spread_update(levels, updates) {
  const update2 = {};
  const to_null_out = {};
  const accounted_for = {$$scope: 1};
  let i = levels.length;
  while (i--) {
    const o = levels[i];
    const n = updates[i];
    if (n) {
      for (const key in o) {
        if (!(key in n))
          to_null_out[key] = 1;
      }
      for (const key in n) {
        if (!accounted_for[key]) {
          update2[key] = n[key];
          accounted_for[key] = 1;
        }
      }
      levels[i] = n;
    } else {
      for (const key in o) {
        accounted_for[key] = 1;
      }
    }
  }
  for (const key in to_null_out) {
    if (!(key in update2))
      update2[key] = void 0;
  }
  return update2;
}
function get_spread_object(spread_props) {
  return typeof spread_props === "object" && spread_props !== null ? spread_props : {};
}
function bind(component, name, callback) {
  const index = component.$$.props[name];
  if (index !== void 0) {
    component.$$.bound[index] = callback;
    callback(component.$$.ctx[index]);
  }
}
function create_component(block) {
  block && block.c();
}
function mount_component(component, target, anchor, customElement) {
  const {fragment, on_mount, on_destroy: on_destroy2, after_update} = component.$$;
  fragment && fragment.m(target, anchor);
  if (!customElement) {
    add_render_callback(() => {
      const new_on_destroy = on_mount.map(run).filter(is_function);
      if (on_destroy2) {
        on_destroy2.push(...new_on_destroy);
      } else {
        run_all(new_on_destroy);
      }
      component.$$.on_mount = [];
    });
  }
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options, instance10, create_fragment11, not_equal2, props, append_styles2, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: null,
    props,
    update: noop,
    not_equal: not_equal2,
    bound: blank_object(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles2 && append_styles2($$.root);
  let ready = false;
  $$.ctx = instance10 ? instance10(component, options.props || {}, (i, ret, ...rest) => {
    const value2 = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal2($$.ctx[i], $$.ctx[i] = value2)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value2);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment11 ? create_fragment11($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor, options.customElement);
    flush();
  }
  set_current_component(parent_component);
}
var SvelteComponent = class {
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  $on(type, callback) {
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1)
        callbacks.splice(index, 1);
    };
  }
  $set($$props) {
    if (this.$$set && !is_empty($$props)) {
      this.$$.skip_bound = true;
      this.$$set($$props);
      this.$$.skip_bound = false;
    }
  }
};

// docs/_snowpack/pkg/common/index-6b764459.js
var subscriber_queue = [];
function writable(value2, start = noop) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal(value2, new_value)) {
      value2 = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value2);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update2(fn) {
    set(fn(value2));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop;
    }
    run2(value2);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return {set, update: update2, subscribe: subscribe2};
}

// docs/_snowpack/pkg/sveltestrap.js
function isObject(value2) {
  const type = typeof value2;
  return value2 != null && (type == "object" || type == "function");
}
function getColumnSizeClass(isXs, colWidth, colSize) {
  if (colSize === true || colSize === "") {
    return isXs ? "col" : `col-${colWidth}`;
  } else if (colSize === "auto") {
    return isXs ? "col-auto" : `col-${colWidth}-auto`;
  }
  return isXs ? `col-${colSize}` : `col-${colWidth}-${colSize}`;
}
function toClassName(value2) {
  let result = "";
  if (typeof value2 === "string" || typeof value2 === "number") {
    result += value2;
  } else if (typeof value2 === "object") {
    if (Array.isArray(value2)) {
      result = value2.map(toClassName).filter(Boolean).join(" ");
    } else {
      for (let key in value2) {
        if (value2[key]) {
          result && (result += " ");
          result += key;
        }
      }
    }
  }
  return result;
}
function classnames(...args) {
  return args.map(toClassName).filter(Boolean).join(" ");
}
function create_else_block_1(ctx) {
  let button;
  let button_aria_label_value;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = ctx[19].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[18], null);
  const default_slot_or_fallback = default_slot || fallback_block(ctx);
  let button_levels = [
    ctx[9],
    {class: ctx[7]},
    {disabled: ctx[2]},
    {value: ctx[5]},
    {
      "aria-label": button_aria_label_value = ctx[8] || ctx[6]
    },
    {style: ctx[4]}
  ];
  let button_data = {};
  for (let i = 0; i < button_levels.length; i += 1) {
    button_data = assign(button_data, button_levels[i]);
  }
  return {
    c() {
      button = element("button");
      if (default_slot_or_fallback)
        default_slot_or_fallback.c();
      set_attributes(button, button_data);
    },
    m(target, anchor) {
      insert(target, button, anchor);
      if (default_slot_or_fallback) {
        default_slot_or_fallback.m(button, null);
      }
      if (button.autofocus)
        button.focus();
      ctx[23](button);
      current = true;
      if (!mounted) {
        dispose = listen(button, "click", ctx[21]);
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 262144)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[18], !current ? get_all_dirty_from_scope(ctx2[18]) : get_slot_changes(default_slot_template, ctx2[18], dirty, null), null);
        }
      } else {
        if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & 262146)) {
          default_slot_or_fallback.p(ctx2, !current ? -1 : dirty);
        }
      }
      set_attributes(button, button_data = get_spread_update(button_levels, [
        dirty & 512 && ctx2[9],
        (!current || dirty & 128) && {class: ctx2[7]},
        (!current || dirty & 4) && {disabled: ctx2[2]},
        (!current || dirty & 32) && {value: ctx2[5]},
        (!current || dirty & 320 && button_aria_label_value !== (button_aria_label_value = ctx2[8] || ctx2[6])) && {"aria-label": button_aria_label_value},
        (!current || dirty & 16) && {style: ctx2[4]}
      ]));
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot_or_fallback, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot_or_fallback, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(button);
      if (default_slot_or_fallback)
        default_slot_or_fallback.d(detaching);
      ctx[23](null);
      mounted = false;
      dispose();
    }
  };
}
function create_if_block(ctx) {
  let a;
  let current_block_type_index;
  let if_block;
  let a_aria_label_value;
  let current;
  let mounted;
  let dispose;
  const if_block_creators = [create_if_block_1, create_else_block];
  const if_blocks = [];
  function select_block_type_1(ctx2, dirty) {
    if (ctx2[1])
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type_1(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  let a_levels = [
    ctx[9],
    {class: ctx[7]},
    {disabled: ctx[2]},
    {href: ctx[3]},
    {
      "aria-label": a_aria_label_value = ctx[8] || ctx[6]
    },
    {style: ctx[4]}
  ];
  let a_data = {};
  for (let i = 0; i < a_levels.length; i += 1) {
    a_data = assign(a_data, a_levels[i]);
  }
  return {
    c() {
      a = element("a");
      if_block.c();
      set_attributes(a, a_data);
    },
    m(target, anchor) {
      insert(target, a, anchor);
      if_blocks[current_block_type_index].m(a, null);
      ctx[22](a);
      current = true;
      if (!mounted) {
        dispose = listen(a, "click", ctx[20]);
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type_1(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(a, null);
      }
      set_attributes(a, a_data = get_spread_update(a_levels, [
        dirty & 512 && ctx2[9],
        (!current || dirty & 128) && {class: ctx2[7]},
        (!current || dirty & 4) && {disabled: ctx2[2]},
        (!current || dirty & 8) && {href: ctx2[3]},
        (!current || dirty & 320 && a_aria_label_value !== (a_aria_label_value = ctx2[8] || ctx2[6])) && {"aria-label": a_aria_label_value},
        (!current || dirty & 16) && {style: ctx2[4]}
      ]));
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(a);
      if_blocks[current_block_type_index].d();
      ctx[22](null);
      mounted = false;
      dispose();
    }
  };
}
function create_else_block_2(ctx) {
  let current;
  const default_slot_template = ctx[19].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[18], null);
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 262144)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[18], !current ? get_all_dirty_from_scope(ctx2[18]) : get_slot_changes(default_slot_template, ctx2[18], dirty, null), null);
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_if_block_2(ctx) {
  let t;
  return {
    c() {
      t = text(ctx[1]);
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & 2)
        set_data(t, ctx2[1]);
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function fallback_block(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block_2, create_else_block_2];
  const if_blocks = [];
  function select_block_type_2(ctx2, dirty) {
    if (ctx2[1])
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type_2(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type_2(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if_blocks[current_block_type_index].d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
function create_else_block(ctx) {
  let current;
  const default_slot_template = ctx[19].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[18], null);
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 262144)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[18], !current ? get_all_dirty_from_scope(ctx2[18]) : get_slot_changes(default_slot_template, ctx2[18], dirty, null), null);
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_if_block_1(ctx) {
  let t;
  return {
    c() {
      t = text(ctx[1]);
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & 2)
        set_data(t, ctx2[1]);
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_fragment(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block, create_else_block_1];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (ctx2[3])
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if_blocks[current_block_type_index].d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let ariaLabel;
  let classes;
  let defaultAriaLabel;
  const omit_props_names = [
    "class",
    "active",
    "block",
    "children",
    "close",
    "color",
    "disabled",
    "href",
    "inner",
    "outline",
    "size",
    "style",
    "value",
    "white"
  ];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let {$$slots: slots = {}, $$scope} = $$props;
  let {class: className = ""} = $$props;
  let {active = false} = $$props;
  let {block = false} = $$props;
  let {children: children2 = void 0} = $$props;
  let {close = false} = $$props;
  let {color = "secondary"} = $$props;
  let {disabled = false} = $$props;
  let {href = ""} = $$props;
  let {inner = void 0} = $$props;
  let {outline = false} = $$props;
  let {size = null} = $$props;
  let {style = ""} = $$props;
  let {value: value2 = ""} = $$props;
  let {white = false} = $$props;
  function click_handler(event) {
    bubble.call(this, $$self, event);
  }
  function click_handler_1(event) {
    bubble.call(this, $$self, event);
  }
  function a_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      inner = $$value;
      $$invalidate(0, inner);
    });
  }
  function button_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      inner = $$value;
      $$invalidate(0, inner);
    });
  }
  $$self.$$set = ($$new_props) => {
    $$invalidate(24, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    $$invalidate(9, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("class" in $$new_props)
      $$invalidate(10, className = $$new_props.class);
    if ("active" in $$new_props)
      $$invalidate(11, active = $$new_props.active);
    if ("block" in $$new_props)
      $$invalidate(12, block = $$new_props.block);
    if ("children" in $$new_props)
      $$invalidate(1, children2 = $$new_props.children);
    if ("close" in $$new_props)
      $$invalidate(13, close = $$new_props.close);
    if ("color" in $$new_props)
      $$invalidate(14, color = $$new_props.color);
    if ("disabled" in $$new_props)
      $$invalidate(2, disabled = $$new_props.disabled);
    if ("href" in $$new_props)
      $$invalidate(3, href = $$new_props.href);
    if ("inner" in $$new_props)
      $$invalidate(0, inner = $$new_props.inner);
    if ("outline" in $$new_props)
      $$invalidate(15, outline = $$new_props.outline);
    if ("size" in $$new_props)
      $$invalidate(16, size = $$new_props.size);
    if ("style" in $$new_props)
      $$invalidate(4, style = $$new_props.style);
    if ("value" in $$new_props)
      $$invalidate(5, value2 = $$new_props.value);
    if ("white" in $$new_props)
      $$invalidate(17, white = $$new_props.white);
    if ("$$scope" in $$new_props)
      $$invalidate(18, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    $$invalidate(8, ariaLabel = $$props["aria-label"]);
    if ($$self.$$.dirty & 261120) {
      $$invalidate(7, classes = classnames(className, close ? "btn-close" : "btn", close || `btn${outline ? "-outline" : ""}-${color}`, size ? `btn-${size}` : false, block ? "d-block w-100" : false, {
        active,
        "btn-close-white": close && white
      }));
    }
    if ($$self.$$.dirty & 8192) {
      $$invalidate(6, defaultAriaLabel = close ? "Close" : null);
    }
  };
  $$props = exclude_internal_props($$props);
  return [
    inner,
    children2,
    disabled,
    href,
    style,
    value2,
    defaultAriaLabel,
    classes,
    ariaLabel,
    $$restProps,
    className,
    active,
    block,
    close,
    color,
    outline,
    size,
    white,
    $$scope,
    slots,
    click_handler,
    click_handler_1,
    a_binding,
    button_binding
  ];
}
var Button = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {
      class: 10,
      active: 11,
      block: 12,
      children: 1,
      close: 13,
      color: 14,
      disabled: 2,
      href: 3,
      inner: 0,
      outline: 15,
      size: 16,
      style: 4,
      value: 5,
      white: 17
    });
  }
};
function create_fragment$1(ctx) {
  let div;
  let div_class_value;
  let current;
  const default_slot_template = ctx[10].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[9], null);
  let div_levels = [
    ctx[1],
    {
      class: div_class_value = ctx[0].join(" ")
    }
  ];
  let div_data = {};
  for (let i = 0; i < div_levels.length; i += 1) {
    div_data = assign(div_data, div_levels[i]);
  }
  return {
    c() {
      div = element("div");
      if (default_slot)
        default_slot.c();
      set_attributes(div, div_data);
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if (default_slot) {
        default_slot.m(div, null);
      }
      current = true;
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 512)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[9], !current ? get_all_dirty_from_scope(ctx2[9]) : get_slot_changes(default_slot_template, ctx2[9], dirty, null), null);
        }
      }
      set_attributes(div, div_data = get_spread_update(div_levels, [
        dirty & 2 && ctx2[1],
        {class: div_class_value}
      ]));
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function instance$1($$self, $$props, $$invalidate) {
  const omit_props_names = ["class", "xs", "sm", "md", "lg", "xl", "xxl"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let {$$slots: slots = {}, $$scope} = $$props;
  let {class: className = ""} = $$props;
  let {xs = void 0} = $$props;
  let {sm = void 0} = $$props;
  let {md = void 0} = $$props;
  let {lg = void 0} = $$props;
  let {xl = void 0} = $$props;
  let {xxl = void 0} = $$props;
  const colClasses = [];
  const lookup2 = {xs, sm, md, lg, xl, xxl};
  Object.keys(lookup2).forEach((colWidth) => {
    const columnProp = lookup2[colWidth];
    if (!columnProp && columnProp !== "") {
      return;
    }
    const isXs = colWidth === "xs";
    if (isObject(columnProp)) {
      const colSizeInterfix = isXs ? "-" : `-${colWidth}-`;
      const colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);
      if (columnProp.size || columnProp.size === "") {
        colClasses.push(colClass);
      }
      if (columnProp.push) {
        colClasses.push(`push${colSizeInterfix}${columnProp.push}`);
      }
      if (columnProp.pull) {
        colClasses.push(`pull${colSizeInterfix}${columnProp.pull}`);
      }
      if (columnProp.offset) {
        colClasses.push(`offset${colSizeInterfix}${columnProp.offset}`);
      }
      if (columnProp.order) {
        colClasses.push(`order${colSizeInterfix}${columnProp.order}`);
      }
    } else {
      colClasses.push(getColumnSizeClass(isXs, colWidth, columnProp));
    }
  });
  if (!colClasses.length) {
    colClasses.push("col");
  }
  if (className) {
    colClasses.push(className);
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("class" in $$new_props)
      $$invalidate(2, className = $$new_props.class);
    if ("xs" in $$new_props)
      $$invalidate(3, xs = $$new_props.xs);
    if ("sm" in $$new_props)
      $$invalidate(4, sm = $$new_props.sm);
    if ("md" in $$new_props)
      $$invalidate(5, md = $$new_props.md);
    if ("lg" in $$new_props)
      $$invalidate(6, lg = $$new_props.lg);
    if ("xl" in $$new_props)
      $$invalidate(7, xl = $$new_props.xl);
    if ("xxl" in $$new_props)
      $$invalidate(8, xxl = $$new_props.xxl);
    if ("$$scope" in $$new_props)
      $$invalidate(9, $$scope = $$new_props.$$scope);
  };
  return [colClasses, $$restProps, className, xs, sm, md, lg, xl, xxl, $$scope, slots];
}
var Col = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$1, create_fragment$1, safe_not_equal, {
      class: 2,
      xs: 3,
      sm: 4,
      md: 5,
      lg: 6,
      xl: 7,
      xxl: 8
    });
  }
};
function create_fragment$2(ctx) {
  let div;
  let current;
  const default_slot_template = ctx[10].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[9], null);
  let div_levels = [ctx[1], {class: ctx[0]}];
  let div_data = {};
  for (let i = 0; i < div_levels.length; i += 1) {
    div_data = assign(div_data, div_levels[i]);
  }
  return {
    c() {
      div = element("div");
      if (default_slot)
        default_slot.c();
      set_attributes(div, div_data);
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if (default_slot) {
        default_slot.m(div, null);
      }
      current = true;
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 512)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[9], !current ? get_all_dirty_from_scope(ctx2[9]) : get_slot_changes(default_slot_template, ctx2[9], dirty, null), null);
        }
      }
      set_attributes(div, div_data = get_spread_update(div_levels, [
        dirty & 2 && ctx2[1],
        (!current || dirty & 1) && {class: ctx2[0]}
      ]));
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function instance$2($$self, $$props, $$invalidate) {
  let classes;
  const omit_props_names = ["class", "sm", "md", "lg", "xl", "xxl", "fluid"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let {$$slots: slots = {}, $$scope} = $$props;
  let {class: className = ""} = $$props;
  let {sm = void 0} = $$props;
  let {md = void 0} = $$props;
  let {lg = void 0} = $$props;
  let {xl = void 0} = $$props;
  let {xxl = void 0} = $$props;
  let {fluid = false} = $$props;
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("class" in $$new_props)
      $$invalidate(2, className = $$new_props.class);
    if ("sm" in $$new_props)
      $$invalidate(3, sm = $$new_props.sm);
    if ("md" in $$new_props)
      $$invalidate(4, md = $$new_props.md);
    if ("lg" in $$new_props)
      $$invalidate(5, lg = $$new_props.lg);
    if ("xl" in $$new_props)
      $$invalidate(6, xl = $$new_props.xl);
    if ("xxl" in $$new_props)
      $$invalidate(7, xxl = $$new_props.xxl);
    if ("fluid" in $$new_props)
      $$invalidate(8, fluid = $$new_props.fluid);
    if ("$$scope" in $$new_props)
      $$invalidate(9, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 508) {
      $$invalidate(0, classes = classnames(className, {
        "container-sm": sm,
        "container-md": md,
        "container-lg": lg,
        "container-xl": xl,
        "container-xxl": xxl,
        "container-fluid": fluid,
        container: !sm && !md && !lg && !xl && !xxl && !fluid
      }));
    }
  };
  return [classes, $$restProps, className, sm, md, lg, xl, xxl, fluid, $$scope, slots];
}
var Container = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$2, create_fragment$2, safe_not_equal, {
      class: 2,
      sm: 3,
      md: 4,
      lg: 5,
      xl: 6,
      xxl: 7,
      fluid: 8
    });
  }
};
var get_label_slot_changes = (dirty) => ({});
var get_label_slot_context = (ctx) => ({});
function create_else_block$1(ctx) {
  let input;
  let mounted;
  let dispose;
  let input_levels = [
    ctx[11],
    {class: ctx[9]},
    {id: ctx[8]},
    {type: "checkbox"},
    {disabled: ctx[3]},
    {name: ctx[5]},
    {__value: ctx[7]}
  ];
  let input_data = {};
  for (let i = 0; i < input_levels.length; i += 1) {
    input_data = assign(input_data, input_levels[i]);
  }
  return {
    c() {
      input = element("input");
      set_attributes(input, input_data);
    },
    m(target, anchor) {
      insert(target, input, anchor);
      if (input.autofocus)
        input.focus();
      input.checked = ctx[0];
      ctx[38](input);
      if (!mounted) {
        dispose = [
          listen(input, "blur", ctx[28]),
          listen(input, "change", ctx[29]),
          listen(input, "focus", ctx[30]),
          listen(input, "input", ctx[31]),
          listen(input, "change", ctx[37])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      set_attributes(input, input_data = get_spread_update(input_levels, [
        dirty[0] & 2048 && ctx2[11],
        dirty[0] & 512 && {class: ctx2[9]},
        dirty[0] & 256 && {id: ctx2[8]},
        {type: "checkbox"},
        dirty[0] & 8 && {disabled: ctx2[3]},
        dirty[0] & 32 && {name: ctx2[5]},
        dirty[0] & 128 && {__value: ctx2[7]}
      ]));
      if (dirty[0] & 1) {
        input.checked = ctx2[0];
      }
    },
    d(detaching) {
      if (detaching)
        detach(input);
      ctx[38](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_2$1(ctx) {
  let input;
  let mounted;
  let dispose;
  let input_levels = [
    ctx[11],
    {class: ctx[9]},
    {id: ctx[8]},
    {type: "checkbox"},
    {disabled: ctx[3]},
    {name: ctx[5]},
    {__value: ctx[7]}
  ];
  let input_data = {};
  for (let i = 0; i < input_levels.length; i += 1) {
    input_data = assign(input_data, input_levels[i]);
  }
  return {
    c() {
      input = element("input");
      set_attributes(input, input_data);
    },
    m(target, anchor) {
      insert(target, input, anchor);
      if (input.autofocus)
        input.focus();
      input.checked = ctx[0];
      ctx[36](input);
      if (!mounted) {
        dispose = [
          listen(input, "blur", ctx[24]),
          listen(input, "change", ctx[25]),
          listen(input, "focus", ctx[26]),
          listen(input, "input", ctx[27]),
          listen(input, "change", ctx[35])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      set_attributes(input, input_data = get_spread_update(input_levels, [
        dirty[0] & 2048 && ctx2[11],
        dirty[0] & 512 && {class: ctx2[9]},
        dirty[0] & 256 && {id: ctx2[8]},
        {type: "checkbox"},
        dirty[0] & 8 && {disabled: ctx2[3]},
        dirty[0] & 32 && {name: ctx2[5]},
        dirty[0] & 128 && {__value: ctx2[7]}
      ]));
      if (dirty[0] & 1) {
        input.checked = ctx2[0];
      }
    },
    d(detaching) {
      if (detaching)
        detach(input);
      ctx[36](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_1$1(ctx) {
  let input;
  let mounted;
  let dispose;
  let input_levels = [
    ctx[11],
    {class: ctx[9]},
    {id: ctx[8]},
    {type: "radio"},
    {disabled: ctx[3]},
    {name: ctx[5]},
    {__value: ctx[7]}
  ];
  let input_data = {};
  for (let i = 0; i < input_levels.length; i += 1) {
    input_data = assign(input_data, input_levels[i]);
  }
  return {
    c() {
      input = element("input");
      set_attributes(input, input_data);
      ctx[33][0].push(input);
    },
    m(target, anchor) {
      insert(target, input, anchor);
      if (input.autofocus)
        input.focus();
      input.checked = input.__value === ctx[1];
      ctx[34](input);
      if (!mounted) {
        dispose = [
          listen(input, "blur", ctx[20]),
          listen(input, "change", ctx[21]),
          listen(input, "focus", ctx[22]),
          listen(input, "input", ctx[23]),
          listen(input, "change", ctx[32])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      set_attributes(input, input_data = get_spread_update(input_levels, [
        dirty[0] & 2048 && ctx2[11],
        dirty[0] & 512 && {class: ctx2[9]},
        dirty[0] & 256 && {id: ctx2[8]},
        {type: "radio"},
        dirty[0] & 8 && {disabled: ctx2[3]},
        dirty[0] & 32 && {name: ctx2[5]},
        dirty[0] & 128 && {__value: ctx2[7]}
      ]));
      if (dirty[0] & 2) {
        input.checked = input.__value === ctx2[1];
      }
    },
    d(detaching) {
      if (detaching)
        detach(input);
      ctx[33][0].splice(ctx[33][0].indexOf(input), 1);
      ctx[34](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block$1(ctx) {
  let label_1;
  let current;
  const label_slot_template = ctx[19].label;
  const label_slot = create_slot(label_slot_template, ctx, ctx[18], get_label_slot_context);
  const label_slot_or_fallback = label_slot || fallback_block$1(ctx);
  return {
    c() {
      label_1 = element("label");
      if (label_slot_or_fallback)
        label_slot_or_fallback.c();
      attr(label_1, "class", "form-check-label");
      attr(label_1, "for", ctx[8]);
    },
    m(target, anchor) {
      insert(target, label_1, anchor);
      if (label_slot_or_fallback) {
        label_slot_or_fallback.m(label_1, null);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (label_slot) {
        if (label_slot.p && (!current || dirty[0] & 262144)) {
          update_slot_base(label_slot, label_slot_template, ctx2, ctx2[18], !current ? get_all_dirty_from_scope(ctx2[18]) : get_slot_changes(label_slot_template, ctx2[18], dirty, get_label_slot_changes), get_label_slot_context);
        }
      } else {
        if (label_slot_or_fallback && label_slot_or_fallback.p && (!current || dirty[0] & 16)) {
          label_slot_or_fallback.p(ctx2, !current ? [-1, -1] : dirty);
        }
      }
      if (!current || dirty[0] & 256) {
        attr(label_1, "for", ctx2[8]);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(label_slot_or_fallback, local);
      current = true;
    },
    o(local) {
      transition_out(label_slot_or_fallback, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(label_1);
      if (label_slot_or_fallback)
        label_slot_or_fallback.d(detaching);
    }
  };
}
function fallback_block$1(ctx) {
  let t;
  return {
    c() {
      t = text(ctx[4]);
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & 16)
        set_data(t, ctx2[4]);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_fragment$3(ctx) {
  let div;
  let t;
  let current;
  function select_block_type(ctx2, dirty) {
    if (ctx2[6] === "radio")
      return create_if_block_1$1;
    if (ctx2[6] === "switch")
      return create_if_block_2$1;
    return create_else_block$1;
  }
  let current_block_type = select_block_type(ctx);
  let if_block0 = current_block_type(ctx);
  let if_block1 = ctx[4] && create_if_block$1(ctx);
  return {
    c() {
      div = element("div");
      if_block0.c();
      t = space();
      if (if_block1)
        if_block1.c();
      attr(div, "class", ctx[10]);
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if_block0.m(div, null);
      append(div, t);
      if (if_block1)
        if_block1.m(div, null);
      current = true;
    },
    p(ctx2, dirty) {
      if (current_block_type === (current_block_type = select_block_type(ctx2)) && if_block0) {
        if_block0.p(ctx2, dirty);
      } else {
        if_block0.d(1);
        if_block0 = current_block_type(ctx2);
        if (if_block0) {
          if_block0.c();
          if_block0.m(div, t);
        }
      }
      if (ctx2[4]) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
          if (dirty[0] & 16) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block$1(ctx2);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(div, null);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, () => {
          if_block1 = null;
        });
        check_outros();
      }
      if (!current || dirty[0] & 1024) {
        attr(div, "class", ctx2[10]);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block1);
      current = true;
    },
    o(local) {
      transition_out(if_block1);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if_block0.d();
      if (if_block1)
        if_block1.d();
    }
  };
}
function instance$3($$self, $$props, $$invalidate) {
  let classes;
  let inputClasses;
  let idFor;
  const omit_props_names = [
    "class",
    "checked",
    "disabled",
    "group",
    "id",
    "inline",
    "inner",
    "invalid",
    "label",
    "name",
    "size",
    "type",
    "valid",
    "value"
  ];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let {$$slots: slots = {}, $$scope} = $$props;
  let {class: className = ""} = $$props;
  let {checked = false} = $$props;
  let {disabled = false} = $$props;
  let {group = void 0} = $$props;
  let {id = void 0} = $$props;
  let {inline = false} = $$props;
  let {inner = void 0} = $$props;
  let {invalid = false} = $$props;
  let {label = ""} = $$props;
  let {name = ""} = $$props;
  let {size = ""} = $$props;
  let {type = "checkbox"} = $$props;
  let {valid = false} = $$props;
  let {value: value2 = void 0} = $$props;
  const $$binding_groups = [[]];
  function blur_handler(event) {
    bubble.call(this, $$self, event);
  }
  function change_handler(event) {
    bubble.call(this, $$self, event);
  }
  function focus_handler(event) {
    bubble.call(this, $$self, event);
  }
  function input_handler(event) {
    bubble.call(this, $$self, event);
  }
  function blur_handler_1(event) {
    bubble.call(this, $$self, event);
  }
  function change_handler_1(event) {
    bubble.call(this, $$self, event);
  }
  function focus_handler_1(event) {
    bubble.call(this, $$self, event);
  }
  function input_handler_1(event) {
    bubble.call(this, $$self, event);
  }
  function blur_handler_2(event) {
    bubble.call(this, $$self, event);
  }
  function change_handler_2(event) {
    bubble.call(this, $$self, event);
  }
  function focus_handler_2(event) {
    bubble.call(this, $$self, event);
  }
  function input_handler_2(event) {
    bubble.call(this, $$self, event);
  }
  function input_change_handler() {
    group = this.__value;
    $$invalidate(1, group);
  }
  function input_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      inner = $$value;
      $$invalidate(2, inner);
    });
  }
  function input_change_handler_1() {
    checked = this.checked;
    $$invalidate(0, checked);
  }
  function input_binding_1($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      inner = $$value;
      $$invalidate(2, inner);
    });
  }
  function input_change_handler_2() {
    checked = this.checked;
    $$invalidate(0, checked);
  }
  function input_binding_2($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      inner = $$value;
      $$invalidate(2, inner);
    });
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(11, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("class" in $$new_props)
      $$invalidate(12, className = $$new_props.class);
    if ("checked" in $$new_props)
      $$invalidate(0, checked = $$new_props.checked);
    if ("disabled" in $$new_props)
      $$invalidate(3, disabled = $$new_props.disabled);
    if ("group" in $$new_props)
      $$invalidate(1, group = $$new_props.group);
    if ("id" in $$new_props)
      $$invalidate(13, id = $$new_props.id);
    if ("inline" in $$new_props)
      $$invalidate(14, inline = $$new_props.inline);
    if ("inner" in $$new_props)
      $$invalidate(2, inner = $$new_props.inner);
    if ("invalid" in $$new_props)
      $$invalidate(15, invalid = $$new_props.invalid);
    if ("label" in $$new_props)
      $$invalidate(4, label = $$new_props.label);
    if ("name" in $$new_props)
      $$invalidate(5, name = $$new_props.name);
    if ("size" in $$new_props)
      $$invalidate(16, size = $$new_props.size);
    if ("type" in $$new_props)
      $$invalidate(6, type = $$new_props.type);
    if ("valid" in $$new_props)
      $$invalidate(17, valid = $$new_props.valid);
    if ("value" in $$new_props)
      $$invalidate(7, value2 = $$new_props.value);
    if ("$$scope" in $$new_props)
      $$invalidate(18, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & 86080) {
      $$invalidate(10, classes = classnames(className, "form-check", {
        "form-switch": type === "switch",
        "form-check-inline": inline,
        [`form-control-${size}`]: size
      }));
    }
    if ($$self.$$.dirty[0] & 163840) {
      $$invalidate(9, inputClasses = classnames("form-check-input", {"is-invalid": invalid, "is-valid": valid}));
    }
    if ($$self.$$.dirty[0] & 8208) {
      $$invalidate(8, idFor = id || label);
    }
  };
  return [
    checked,
    group,
    inner,
    disabled,
    label,
    name,
    type,
    value2,
    idFor,
    inputClasses,
    classes,
    $$restProps,
    className,
    id,
    inline,
    invalid,
    size,
    valid,
    $$scope,
    slots,
    blur_handler,
    change_handler,
    focus_handler,
    input_handler,
    blur_handler_1,
    change_handler_1,
    focus_handler_1,
    input_handler_1,
    blur_handler_2,
    change_handler_2,
    focus_handler_2,
    input_handler_2,
    input_change_handler,
    $$binding_groups,
    input_binding,
    input_change_handler_1,
    input_binding_1,
    input_change_handler_2,
    input_binding_2
  ];
}
var FormCheck = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$3, create_fragment$3, safe_not_equal, {
      class: 12,
      checked: 0,
      disabled: 3,
      group: 1,
      id: 13,
      inline: 14,
      inner: 2,
      invalid: 15,
      label: 4,
      name: 5,
      size: 16,
      type: 6,
      valid: 17,
      value: 7
    }, null, [-1, -1]);
  }
};
function create_fragment$4(ctx) {
  let div;
  let current;
  const default_slot_template = ctx[6].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[5], null);
  let div_levels = [ctx[1], {class: ctx[0]}];
  let div_data = {};
  for (let i = 0; i < div_levels.length; i += 1) {
    div_data = assign(div_data, div_levels[i]);
  }
  return {
    c() {
      div = element("div");
      if (default_slot)
        default_slot.c();
      set_attributes(div, div_data);
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if (default_slot) {
        default_slot.m(div, null);
      }
      current = true;
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 32)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[5], !current ? get_all_dirty_from_scope(ctx2[5]) : get_slot_changes(default_slot_template, ctx2[5], dirty, null), null);
        }
      }
      set_attributes(div, div_data = get_spread_update(div_levels, [
        dirty & 2 && ctx2[1],
        (!current || dirty & 1) && {class: ctx2[0]}
      ]));
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function instance$4($$self, $$props, $$invalidate) {
  const omit_props_names = ["class", "valid", "tooltip"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let {$$slots: slots = {}, $$scope} = $$props;
  let {class: className = ""} = $$props;
  let {valid = void 0} = $$props;
  let {tooltip = false} = $$props;
  let classes;
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("class" in $$new_props)
      $$invalidate(2, className = $$new_props.class);
    if ("valid" in $$new_props)
      $$invalidate(3, valid = $$new_props.valid);
    if ("tooltip" in $$new_props)
      $$invalidate(4, tooltip = $$new_props.tooltip);
    if ("$$scope" in $$new_props)
      $$invalidate(5, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 28) {
      {
        const validMode = tooltip ? "tooltip" : "feedback";
        $$invalidate(0, classes = classnames(className, valid ? `valid-${validMode}` : `invalid-${validMode}`));
      }
    }
  };
  return [classes, $$restProps, className, valid, tooltip, $$scope, slots];
}
var FormFeedback = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$4, create_fragment$4, safe_not_equal, {class: 2, valid: 3, tooltip: 4});
  }
};
var get_label_slot_changes_1 = (dirty) => ({});
var get_label_slot_context_1 = (ctx) => ({});
var get_label_slot_changes$1 = (dirty) => ({});
var get_label_slot_context$1 = (ctx) => ({});
function create_else_block$2(ctx) {
  let div;
  let t;
  let current;
  const default_slot_template = ctx[12].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[11], null);
  let if_block = (ctx[0] || ctx[4].label) && create_if_block_2$2(ctx);
  let div_levels = [ctx[3], {class: ctx[2]}];
  let div_data = {};
  for (let i = 0; i < div_levels.length; i += 1) {
    div_data = assign(div_data, div_levels[i]);
  }
  return {
    c() {
      div = element("div");
      if (default_slot)
        default_slot.c();
      t = space();
      if (if_block)
        if_block.c();
      set_attributes(div, div_data);
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if (default_slot) {
        default_slot.m(div, null);
      }
      append(div, t);
      if (if_block)
        if_block.m(div, null);
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 2048)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[11], !current ? get_all_dirty_from_scope(ctx2[11]) : get_slot_changes(default_slot_template, ctx2[11], dirty, null), null);
        }
      }
      if (ctx2[0] || ctx2[4].label) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & 17) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_2$2(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(div, null);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
      set_attributes(div, div_data = get_spread_update(div_levels, [
        dirty & 8 && ctx2[3],
        (!current || dirty & 4) && {class: ctx2[2]}
      ]));
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (default_slot)
        default_slot.d(detaching);
      if (if_block)
        if_block.d();
    }
  };
}
function create_if_block$2(ctx) {
  let fieldset;
  let t;
  let current;
  const default_slot_template = ctx[12].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[11], null);
  let if_block = (ctx[0] || ctx[4].label) && create_if_block_1$2(ctx);
  let fieldset_levels = [ctx[3], {class: ctx[2]}];
  let fieldset_data = {};
  for (let i = 0; i < fieldset_levels.length; i += 1) {
    fieldset_data = assign(fieldset_data, fieldset_levels[i]);
  }
  return {
    c() {
      fieldset = element("fieldset");
      if (default_slot)
        default_slot.c();
      t = space();
      if (if_block)
        if_block.c();
      set_attributes(fieldset, fieldset_data);
    },
    m(target, anchor) {
      insert(target, fieldset, anchor);
      if (default_slot) {
        default_slot.m(fieldset, null);
      }
      append(fieldset, t);
      if (if_block)
        if_block.m(fieldset, null);
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 2048)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[11], !current ? get_all_dirty_from_scope(ctx2[11]) : get_slot_changes(default_slot_template, ctx2[11], dirty, null), null);
        }
      }
      if (ctx2[0] || ctx2[4].label) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & 17) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_1$2(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(fieldset, null);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
      set_attributes(fieldset, fieldset_data = get_spread_update(fieldset_levels, [
        dirty & 8 && ctx2[3],
        (!current || dirty & 4) && {class: ctx2[2]}
      ]));
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(fieldset);
      if (default_slot)
        default_slot.d(detaching);
      if (if_block)
        if_block.d();
    }
  };
}
function create_if_block_2$2(ctx) {
  let label_1;
  let t0;
  let t1;
  let current;
  const label_slot_template = ctx[12].label;
  const label_slot = create_slot(label_slot_template, ctx, ctx[11], get_label_slot_context_1);
  return {
    c() {
      label_1 = element("label");
      t0 = text(ctx[0]);
      t1 = space();
      if (label_slot)
        label_slot.c();
    },
    m(target, anchor) {
      insert(target, label_1, anchor);
      append(label_1, t0);
      append(label_1, t1);
      if (label_slot) {
        label_slot.m(label_1, null);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (!current || dirty & 1)
        set_data(t0, ctx2[0]);
      if (label_slot) {
        if (label_slot.p && (!current || dirty & 2048)) {
          update_slot_base(label_slot, label_slot_template, ctx2, ctx2[11], !current ? get_all_dirty_from_scope(ctx2[11]) : get_slot_changes(label_slot_template, ctx2[11], dirty, get_label_slot_changes_1), get_label_slot_context_1);
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(label_slot, local);
      current = true;
    },
    o(local) {
      transition_out(label_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(label_1);
      if (label_slot)
        label_slot.d(detaching);
    }
  };
}
function create_if_block_1$2(ctx) {
  let label_1;
  let t0;
  let t1;
  let current;
  const label_slot_template = ctx[12].label;
  const label_slot = create_slot(label_slot_template, ctx, ctx[11], get_label_slot_context$1);
  return {
    c() {
      label_1 = element("label");
      t0 = text(ctx[0]);
      t1 = space();
      if (label_slot)
        label_slot.c();
    },
    m(target, anchor) {
      insert(target, label_1, anchor);
      append(label_1, t0);
      append(label_1, t1);
      if (label_slot) {
        label_slot.m(label_1, null);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (!current || dirty & 1)
        set_data(t0, ctx2[0]);
      if (label_slot) {
        if (label_slot.p && (!current || dirty & 2048)) {
          update_slot_base(label_slot, label_slot_template, ctx2, ctx2[11], !current ? get_all_dirty_from_scope(ctx2[11]) : get_slot_changes(label_slot_template, ctx2[11], dirty, get_label_slot_changes$1), get_label_slot_context$1);
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(label_slot, local);
      current = true;
    },
    o(local) {
      transition_out(label_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(label_1);
      if (label_slot)
        label_slot.d(detaching);
    }
  };
}
function create_fragment$5(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block$2, create_else_block$2];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (ctx2[1] === "fieldset")
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if_blocks[current_block_type_index].d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
function instance$5($$self, $$props, $$invalidate) {
  let classes;
  const omit_props_names = ["class", "check", "disabled", "floating", "inline", "label", "row", "tag"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let {$$slots: slots = {}, $$scope} = $$props;
  const $$slots = compute_slots(slots);
  let {class: className = ""} = $$props;
  let {check = false} = $$props;
  let {disabled = false} = $$props;
  let {floating = false} = $$props;
  let {inline = false} = $$props;
  let {label = ""} = $$props;
  let {row = false} = $$props;
  let {tag = null} = $$props;
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("class" in $$new_props)
      $$invalidate(5, className = $$new_props.class);
    if ("check" in $$new_props)
      $$invalidate(6, check = $$new_props.check);
    if ("disabled" in $$new_props)
      $$invalidate(7, disabled = $$new_props.disabled);
    if ("floating" in $$new_props)
      $$invalidate(8, floating = $$new_props.floating);
    if ("inline" in $$new_props)
      $$invalidate(9, inline = $$new_props.inline);
    if ("label" in $$new_props)
      $$invalidate(0, label = $$new_props.label);
    if ("row" in $$new_props)
      $$invalidate(10, row = $$new_props.row);
    if ("tag" in $$new_props)
      $$invalidate(1, tag = $$new_props.tag);
    if ("$$scope" in $$new_props)
      $$invalidate(11, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 2016) {
      $$invalidate(2, classes = classnames(className, "mb-3", {
        row,
        "form-check": check,
        "form-check-inline": check && inline,
        "form-floating": floating,
        disabled: check && disabled
      }));
    }
  };
  return [
    label,
    tag,
    classes,
    $$restProps,
    $$slots,
    className,
    check,
    disabled,
    floating,
    inline,
    row,
    $$scope,
    slots
  ];
}
var FormGroup = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$5, create_fragment$5, safe_not_equal, {
      class: 5,
      check: 6,
      disabled: 7,
      floating: 8,
      inline: 9,
      label: 0,
      row: 10,
      tag: 1
    });
  }
};
function create_fragment$6(ctx) {
  let i;
  let i_levels = [ctx[1], {class: ctx[0]}];
  let i_data = {};
  for (let i2 = 0; i2 < i_levels.length; i2 += 1) {
    i_data = assign(i_data, i_levels[i2]);
  }
  return {
    c() {
      i = element("i");
      set_attributes(i, i_data);
    },
    m(target, anchor) {
      insert(target, i, anchor);
    },
    p(ctx2, [dirty]) {
      set_attributes(i, i_data = get_spread_update(i_levels, [
        dirty & 2 && ctx2[1],
        dirty & 1 && {class: ctx2[0]}
      ]));
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(i);
    }
  };
}
function instance$6($$self, $$props, $$invalidate) {
  let classes;
  const omit_props_names = ["class", "name"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let {class: className = ""} = $$props;
  let {name = ""} = $$props;
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("class" in $$new_props)
      $$invalidate(2, className = $$new_props.class);
    if ("name" in $$new_props)
      $$invalidate(3, name = $$new_props.name);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 12) {
      $$invalidate(0, classes = classnames(className, `bi-${name}`));
    }
  };
  return [classes, $$restProps, className, name];
}
var Icon = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$6, create_fragment$6, safe_not_equal, {class: 2, name: 3});
  }
};
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[210] = list[i];
  return child_ctx;
}
function create_if_block_22(ctx) {
  let select;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = ctx[24].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[209], null);
  let select_levels = [
    ctx[21],
    {class: ctx[18]},
    {name: ctx[13]},
    {disabled: ctx[8]},
    {readonly: ctx[15]}
  ];
  let select_data = {};
  for (let i = 0; i < select_levels.length; i += 1) {
    select_data = assign(select_data, select_levels[i]);
  }
  return {
    c() {
      select = element("select");
      if (default_slot)
        default_slot.c();
      set_attributes(select, select_data);
      if (ctx[6] === void 0)
        add_render_callback(() => ctx[207].call(select));
    },
    m(target, anchor) {
      insert(target, select, anchor);
      if (default_slot) {
        default_slot.m(select, null);
      }
      (select_data.multiple ? select_options : select_option)(select, select_data.value);
      if (select.autofocus)
        select.focus();
      select_option(select, ctx[6]);
      ctx[208](select);
      current = true;
      if (!mounted) {
        dispose = [
          listen(select, "blur", ctx[156]),
          listen(select, "change", ctx[157]),
          listen(select, "focus", ctx[158]),
          listen(select, "input", ctx[159]),
          listen(select, "change", ctx[207])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty[6] & 8388608)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[209], !current ? get_all_dirty_from_scope(ctx2[209]) : get_slot_changes(default_slot_template, ctx2[209], dirty, null), null);
        }
      }
      set_attributes(select, select_data = get_spread_update(select_levels, [
        dirty[0] & 2097152 && ctx2[21],
        (!current || dirty[0] & 262144) && {class: ctx2[18]},
        (!current || dirty[0] & 8192) && {name: ctx2[13]},
        (!current || dirty[0] & 256) && {disabled: ctx2[8]},
        (!current || dirty[0] & 32768) && {readonly: ctx2[15]}
      ]));
      if (dirty[0] & 2400512 && "value" in select_data)
        (select_data.multiple ? select_options : select_option)(select, select_data.value);
      if (dirty[0] & 64) {
        select_option(select, ctx2[6]);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(select);
      if (default_slot)
        default_slot.d(detaching);
      ctx[208](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_21(ctx) {
  let textarea;
  let mounted;
  let dispose;
  let textarea_levels = [
    ctx[21],
    {class: ctx[18]},
    {disabled: ctx[8]},
    {name: ctx[13]},
    {placeholder: ctx[14]},
    {readOnly: ctx[15]}
  ];
  let textarea_data = {};
  for (let i = 0; i < textarea_levels.length; i += 1) {
    textarea_data = assign(textarea_data, textarea_levels[i]);
  }
  return {
    c() {
      textarea = element("textarea");
      set_attributes(textarea, textarea_data);
    },
    m(target, anchor) {
      insert(target, textarea, anchor);
      if (textarea.autofocus)
        textarea.focus();
      set_input_value(textarea, ctx[6]);
      ctx[206](textarea);
      if (!mounted) {
        dispose = [
          listen(textarea, "blur", ctx[149]),
          listen(textarea, "change", ctx[150]),
          listen(textarea, "focus", ctx[151]),
          listen(textarea, "input", ctx[152]),
          listen(textarea, "keydown", ctx[153]),
          listen(textarea, "keypress", ctx[154]),
          listen(textarea, "keyup", ctx[155]),
          listen(textarea, "input", ctx[205])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      set_attributes(textarea, textarea_data = get_spread_update(textarea_levels, [
        dirty[0] & 2097152 && ctx2[21],
        dirty[0] & 262144 && {class: ctx2[18]},
        dirty[0] & 256 && {disabled: ctx2[8]},
        dirty[0] & 8192 && {name: ctx2[13]},
        dirty[0] & 16384 && {placeholder: ctx2[14]},
        dirty[0] & 32768 && {readOnly: ctx2[15]}
      ]));
      if (dirty[0] & 64) {
        set_input_value(textarea, ctx2[6]);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(textarea);
      ctx[206](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_2$3(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [
    create_if_block_3,
    create_if_block_4,
    create_if_block_5,
    create_if_block_6,
    create_if_block_7,
    create_if_block_8,
    create_if_block_9,
    create_if_block_10,
    create_if_block_11,
    create_if_block_12,
    create_if_block_13,
    create_if_block_14,
    create_if_block_15,
    create_if_block_16,
    create_if_block_17,
    create_if_block_18,
    create_if_block_19,
    create_if_block_20,
    create_else_block_1$1
  ];
  const if_blocks = [];
  function select_block_type_1(ctx2, dirty) {
    if (ctx2[16] === "text")
      return 0;
    if (ctx2[16] === "password")
      return 1;
    if (ctx2[16] === "color")
      return 2;
    if (ctx2[16] === "email")
      return 3;
    if (ctx2[16] === "file")
      return 4;
    if (ctx2[16] === "checkbox" || ctx2[16] === "radio" || ctx2[16] === "switch")
      return 5;
    if (ctx2[16] === "url")
      return 6;
    if (ctx2[16] === "number")
      return 7;
    if (ctx2[16] === "date")
      return 8;
    if (ctx2[16] === "time")
      return 9;
    if (ctx2[16] === "datetime")
      return 10;
    if (ctx2[16] === "datetime-local")
      return 11;
    if (ctx2[16] === "month")
      return 12;
    if (ctx2[16] === "color")
      return 13;
    if (ctx2[16] === "range")
      return 14;
    if (ctx2[16] === "search")
      return 15;
    if (ctx2[16] === "tel")
      return 16;
    if (ctx2[16] === "week")
      return 17;
    return 18;
  }
  current_block_type_index = select_block_type_1(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type_1(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if_blocks[current_block_type_index].d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
function create_else_block_1$1(ctx) {
  let input;
  let mounted;
  let dispose;
  let input_levels = [
    ctx[21],
    {type: ctx[16]},
    {readOnly: ctx[15]},
    {class: ctx[18]},
    {name: ctx[13]},
    {disabled: ctx[8]},
    {placeholder: ctx[14]},
    {value: ctx[6]}
  ];
  let input_data = {};
  for (let i = 0; i < input_levels.length; i += 1) {
    input_data = assign(input_data, input_levels[i]);
  }
  return {
    c() {
      input = element("input");
      set_attributes(input, input_data);
    },
    m(target, anchor) {
      insert(target, input, anchor);
      input.value = input_data.value;
      if (input.autofocus)
        input.focus();
      if (!mounted) {
        dispose = [
          listen(input, "blur", ctx[144]),
          listen(input, "change", ctx[20]),
          listen(input, "focus", ctx[145]),
          listen(input, "input", ctx[20]),
          listen(input, "keydown", ctx[146]),
          listen(input, "keypress", ctx[147]),
          listen(input, "keyup", ctx[148])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      set_attributes(input, input_data = get_spread_update(input_levels, [
        dirty[0] & 2097152 && ctx2[21],
        dirty[0] & 65536 && {type: ctx2[16]},
        dirty[0] & 32768 && {readOnly: ctx2[15]},
        dirty[0] & 262144 && {class: ctx2[18]},
        dirty[0] & 8192 && {name: ctx2[13]},
        dirty[0] & 256 && {disabled: ctx2[8]},
        dirty[0] & 16384 && {placeholder: ctx2[14]},
        dirty[0] & 64 && input.value !== ctx2[6] && {value: ctx2[6]}
      ]));
      if ("value" in input_data) {
        input.value = input_data.value;
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(input);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_20(ctx) {
  let input;
  let mounted;
  let dispose;
  let input_levels = [
    ctx[21],
    {class: ctx[18]},
    {type: "week"},
    {disabled: ctx[8]},
    {name: ctx[13]},
    {placeholder: ctx[14]},
    {readOnly: ctx[15]}
  ];
  let input_data = {};
  for (let i = 0; i < input_levels.length; i += 1) {
    input_data = assign(input_data, input_levels[i]);
  }
  return {
    c() {
      input = element("input");
      set_attributes(input, input_data);
    },
    m(target, anchor) {
      insert(target, input, anchor);
      if (input.autofocus)
        input.focus();
      set_input_value(input, ctx[6]);
      ctx[204](input);
      if (!mounted) {
        dispose = [
          listen(input, "blur", ctx[137]),
          listen(input, "change", ctx[138]),
          listen(input, "focus", ctx[139]),
          listen(input, "input", ctx[140]),
          listen(input, "keydown", ctx[141]),
          listen(input, "keypress", ctx[142]),
          listen(input, "keyup", ctx[143]),
          listen(input, "input", ctx[203])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      set_attributes(input, input_data = get_spread_update(input_levels, [
        dirty[0] & 2097152 && ctx2[21],
        dirty[0] & 262144 && {class: ctx2[18]},
        {type: "week"},
        dirty[0] & 256 && {disabled: ctx2[8]},
        dirty[0] & 8192 && {name: ctx2[13]},
        dirty[0] & 16384 && {placeholder: ctx2[14]},
        dirty[0] & 32768 && {readOnly: ctx2[15]}
      ]));
      if (dirty[0] & 64) {
        set_input_value(input, ctx2[6]);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(input);
      ctx[204](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_19(ctx) {
  let input;
  let mounted;
  let dispose;
  let input_levels = [
    ctx[21],
    {class: ctx[18]},
    {type: "tel"},
    {disabled: ctx[8]},
    {name: ctx[13]},
    {placeholder: ctx[14]},
    {readOnly: ctx[15]},
    {size: ctx[1]}
  ];
  let input_data = {};
  for (let i = 0; i < input_levels.length; i += 1) {
    input_data = assign(input_data, input_levels[i]);
  }
  return {
    c() {
      input = element("input");
      set_attributes(input, input_data);
    },
    m(target, anchor) {
      insert(target, input, anchor);
      if (input.autofocus)
        input.focus();
      set_input_value(input, ctx[6]);
      ctx[202](input);
      if (!mounted) {
        dispose = [
          listen(input, "blur", ctx[130]),
          listen(input, "change", ctx[131]),
          listen(input, "focus", ctx[132]),
          listen(input, "input", ctx[133]),
          listen(input, "keydown", ctx[134]),
          listen(input, "keypress", ctx[135]),
          listen(input, "keyup", ctx[136]),
          listen(input, "input", ctx[201])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      set_attributes(input, input_data = get_spread_update(input_levels, [
        dirty[0] & 2097152 && ctx2[21],
        dirty[0] & 262144 && {class: ctx2[18]},
        {type: "tel"},
        dirty[0] & 256 && {disabled: ctx2[8]},
        dirty[0] & 8192 && {name: ctx2[13]},
        dirty[0] & 16384 && {placeholder: ctx2[14]},
        dirty[0] & 32768 && {readOnly: ctx2[15]},
        dirty[0] & 2 && {size: ctx2[1]}
      ]));
      if (dirty[0] & 64) {
        set_input_value(input, ctx2[6]);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(input);
      ctx[202](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_18(ctx) {
  let input;
  let mounted;
  let dispose;
  let input_levels = [
    ctx[21],
    {class: ctx[18]},
    {type: "search"},
    {disabled: ctx[8]},
    {name: ctx[13]},
    {placeholder: ctx[14]},
    {readOnly: ctx[15]},
    {size: ctx[1]}
  ];
  let input_data = {};
  for (let i = 0; i < input_levels.length; i += 1) {
    input_data = assign(input_data, input_levels[i]);
  }
  return {
    c() {
      input = element("input");
      set_attributes(input, input_data);
    },
    m(target, anchor) {
      insert(target, input, anchor);
      if (input.autofocus)
        input.focus();
      set_input_value(input, ctx[6]);
      ctx[200](input);
      if (!mounted) {
        dispose = [
          listen(input, "blur", ctx[123]),
          listen(input, "change", ctx[124]),
          listen(input, "focus", ctx[125]),
          listen(input, "input", ctx[126]),
          listen(input, "keydown", ctx[127]),
          listen(input, "keypress", ctx[128]),
          listen(input, "keyup", ctx[129]),
          listen(input, "input", ctx[199])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      set_attributes(input, input_data = get_spread_update(input_levels, [
        dirty[0] & 2097152 && ctx2[21],
        dirty[0] & 262144 && {class: ctx2[18]},
        {type: "search"},
        dirty[0] & 256 && {disabled: ctx2[8]},
        dirty[0] & 8192 && {name: ctx2[13]},
        dirty[0] & 16384 && {placeholder: ctx2[14]},
        dirty[0] & 32768 && {readOnly: ctx2[15]},
        dirty[0] & 2 && {size: ctx2[1]}
      ]));
      if (dirty[0] & 64) {
        set_input_value(input, ctx2[6]);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(input);
      ctx[200](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_17(ctx) {
  let input;
  let mounted;
  let dispose;
  let input_levels = [
    ctx[21],
    {type: "range"},
    {readOnly: ctx[15]},
    {class: ctx[18]},
    {name: ctx[13]},
    {disabled: ctx[8]},
    {placeholder: ctx[14]}
  ];
  let input_data = {};
  for (let i = 0; i < input_levels.length; i += 1) {
    input_data = assign(input_data, input_levels[i]);
  }
  return {
    c() {
      input = element("input");
      set_attributes(input, input_data);
    },
    m(target, anchor) {
      insert(target, input, anchor);
      if (input.autofocus)
        input.focus();
      set_input_value(input, ctx[6]);
      ctx[198](input);
      if (!mounted) {
        dispose = [
          listen(input, "blur", ctx[116]),
          listen(input, "change", ctx[117]),
          listen(input, "focus", ctx[118]),
          listen(input, "input", ctx[119]),
          listen(input, "keydown", ctx[120]),
          listen(input, "keypress", ctx[121]),
          listen(input, "keyup", ctx[122]),
          listen(input, "change", ctx[197]),
          listen(input, "input", ctx[197])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      set_attributes(input, input_data = get_spread_update(input_levels, [
        dirty[0] & 2097152 && ctx2[21],
        {type: "range"},
        dirty[0] & 32768 && {readOnly: ctx2[15]},
        dirty[0] & 262144 && {class: ctx2[18]},
        dirty[0] & 8192 && {name: ctx2[13]},
        dirty[0] & 256 && {disabled: ctx2[8]},
        dirty[0] & 16384 && {placeholder: ctx2[14]}
      ]));
      if (dirty[0] & 64) {
        set_input_value(input, ctx2[6]);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(input);
      ctx[198](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_16(ctx) {
  let input;
  let mounted;
  let dispose;
  let input_levels = [
    ctx[21],
    {type: "color"},
    {readOnly: ctx[15]},
    {class: ctx[18]},
    {name: ctx[13]},
    {disabled: ctx[8]},
    {placeholder: ctx[14]}
  ];
  let input_data = {};
  for (let i = 0; i < input_levels.length; i += 1) {
    input_data = assign(input_data, input_levels[i]);
  }
  return {
    c() {
      input = element("input");
      set_attributes(input, input_data);
    },
    m(target, anchor) {
      insert(target, input, anchor);
      if (input.autofocus)
        input.focus();
      set_input_value(input, ctx[6]);
      ctx[196](input);
      if (!mounted) {
        dispose = [
          listen(input, "blur", ctx[109]),
          listen(input, "change", ctx[110]),
          listen(input, "focus", ctx[111]),
          listen(input, "input", ctx[112]),
          listen(input, "keydown", ctx[113]),
          listen(input, "keypress", ctx[114]),
          listen(input, "keyup", ctx[115]),
          listen(input, "input", ctx[195])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      set_attributes(input, input_data = get_spread_update(input_levels, [
        dirty[0] & 2097152 && ctx2[21],
        {type: "color"},
        dirty[0] & 32768 && {readOnly: ctx2[15]},
        dirty[0] & 262144 && {class: ctx2[18]},
        dirty[0] & 8192 && {name: ctx2[13]},
        dirty[0] & 256 && {disabled: ctx2[8]},
        dirty[0] & 16384 && {placeholder: ctx2[14]}
      ]));
      if (dirty[0] & 64) {
        set_input_value(input, ctx2[6]);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(input);
      ctx[196](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_15(ctx) {
  let input;
  let mounted;
  let dispose;
  let input_levels = [
    ctx[21],
    {class: ctx[18]},
    {type: "month"},
    {disabled: ctx[8]},
    {name: ctx[13]},
    {placeholder: ctx[14]},
    {readOnly: ctx[15]}
  ];
  let input_data = {};
  for (let i = 0; i < input_levels.length; i += 1) {
    input_data = assign(input_data, input_levels[i]);
  }
  return {
    c() {
      input = element("input");
      set_attributes(input, input_data);
    },
    m(target, anchor) {
      insert(target, input, anchor);
      if (input.autofocus)
        input.focus();
      set_input_value(input, ctx[6]);
      ctx[194](input);
      if (!mounted) {
        dispose = [
          listen(input, "blur", ctx[102]),
          listen(input, "change", ctx[103]),
          listen(input, "focus", ctx[104]),
          listen(input, "input", ctx[105]),
          listen(input, "keydown", ctx[106]),
          listen(input, "keypress", ctx[107]),
          listen(input, "keyup", ctx[108]),
          listen(input, "input", ctx[193])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      set_attributes(input, input_data = get_spread_update(input_levels, [
        dirty[0] & 2097152 && ctx2[21],
        dirty[0] & 262144 && {class: ctx2[18]},
        {type: "month"},
        dirty[0] & 256 && {disabled: ctx2[8]},
        dirty[0] & 8192 && {name: ctx2[13]},
        dirty[0] & 16384 && {placeholder: ctx2[14]},
        dirty[0] & 32768 && {readOnly: ctx2[15]}
      ]));
      if (dirty[0] & 64) {
        set_input_value(input, ctx2[6]);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(input);
      ctx[194](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_14(ctx) {
  let input;
  let mounted;
  let dispose;
  let input_levels = [
    ctx[21],
    {class: ctx[18]},
    {type: "datetime-local"},
    {disabled: ctx[8]},
    {name: ctx[13]},
    {placeholder: ctx[14]},
    {readOnly: ctx[15]}
  ];
  let input_data = {};
  for (let i = 0; i < input_levels.length; i += 1) {
    input_data = assign(input_data, input_levels[i]);
  }
  return {
    c() {
      input = element("input");
      set_attributes(input, input_data);
    },
    m(target, anchor) {
      insert(target, input, anchor);
      if (input.autofocus)
        input.focus();
      set_input_value(input, ctx[6]);
      ctx[192](input);
      if (!mounted) {
        dispose = [
          listen(input, "blur", ctx[95]),
          listen(input, "change", ctx[96]),
          listen(input, "focus", ctx[97]),
          listen(input, "input", ctx[98]),
          listen(input, "keydown", ctx[99]),
          listen(input, "keypress", ctx[100]),
          listen(input, "keyup", ctx[101]),
          listen(input, "input", ctx[191])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      set_attributes(input, input_data = get_spread_update(input_levels, [
        dirty[0] & 2097152 && ctx2[21],
        dirty[0] & 262144 && {class: ctx2[18]},
        {type: "datetime-local"},
        dirty[0] & 256 && {disabled: ctx2[8]},
        dirty[0] & 8192 && {name: ctx2[13]},
        dirty[0] & 16384 && {placeholder: ctx2[14]},
        dirty[0] & 32768 && {readOnly: ctx2[15]}
      ]));
      if (dirty[0] & 64) {
        set_input_value(input, ctx2[6]);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(input);
      ctx[192](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_13(ctx) {
  let input;
  let mounted;
  let dispose;
  let input_levels = [
    ctx[21],
    {type: "datetime"},
    {readOnly: ctx[15]},
    {class: ctx[18]},
    {name: ctx[13]},
    {disabled: ctx[8]},
    {placeholder: ctx[14]}
  ];
  let input_data = {};
  for (let i = 0; i < input_levels.length; i += 1) {
    input_data = assign(input_data, input_levels[i]);
  }
  return {
    c() {
      input = element("input");
      set_attributes(input, input_data);
    },
    m(target, anchor) {
      insert(target, input, anchor);
      if (input.autofocus)
        input.focus();
      set_input_value(input, ctx[6]);
      ctx[190](input);
      if (!mounted) {
        dispose = [
          listen(input, "blur", ctx[88]),
          listen(input, "change", ctx[89]),
          listen(input, "focus", ctx[90]),
          listen(input, "input", ctx[91]),
          listen(input, "keydown", ctx[92]),
          listen(input, "keypress", ctx[93]),
          listen(input, "keyup", ctx[94]),
          listen(input, "input", ctx[189])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      set_attributes(input, input_data = get_spread_update(input_levels, [
        dirty[0] & 2097152 && ctx2[21],
        {type: "datetime"},
        dirty[0] & 32768 && {readOnly: ctx2[15]},
        dirty[0] & 262144 && {class: ctx2[18]},
        dirty[0] & 8192 && {name: ctx2[13]},
        dirty[0] & 256 && {disabled: ctx2[8]},
        dirty[0] & 16384 && {placeholder: ctx2[14]}
      ]));
      if (dirty[0] & 64) {
        set_input_value(input, ctx2[6]);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(input);
      ctx[190](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_12(ctx) {
  let input;
  let mounted;
  let dispose;
  let input_levels = [
    ctx[21],
    {class: ctx[18]},
    {type: "time"},
    {disabled: ctx[8]},
    {name: ctx[13]},
    {placeholder: ctx[14]},
    {readOnly: ctx[15]}
  ];
  let input_data = {};
  for (let i = 0; i < input_levels.length; i += 1) {
    input_data = assign(input_data, input_levels[i]);
  }
  return {
    c() {
      input = element("input");
      set_attributes(input, input_data);
    },
    m(target, anchor) {
      insert(target, input, anchor);
      if (input.autofocus)
        input.focus();
      set_input_value(input, ctx[6]);
      ctx[188](input);
      if (!mounted) {
        dispose = [
          listen(input, "blur", ctx[81]),
          listen(input, "change", ctx[82]),
          listen(input, "focus", ctx[83]),
          listen(input, "input", ctx[84]),
          listen(input, "keydown", ctx[85]),
          listen(input, "keypress", ctx[86]),
          listen(input, "keyup", ctx[87]),
          listen(input, "input", ctx[187])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      set_attributes(input, input_data = get_spread_update(input_levels, [
        dirty[0] & 2097152 && ctx2[21],
        dirty[0] & 262144 && {class: ctx2[18]},
        {type: "time"},
        dirty[0] & 256 && {disabled: ctx2[8]},
        dirty[0] & 8192 && {name: ctx2[13]},
        dirty[0] & 16384 && {placeholder: ctx2[14]},
        dirty[0] & 32768 && {readOnly: ctx2[15]}
      ]));
      if (dirty[0] & 64) {
        set_input_value(input, ctx2[6]);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(input);
      ctx[188](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_11(ctx) {
  let input;
  let mounted;
  let dispose;
  let input_levels = [
    ctx[21],
    {class: ctx[18]},
    {type: "date"},
    {disabled: ctx[8]},
    {name: ctx[13]},
    {placeholder: ctx[14]},
    {readOnly: ctx[15]}
  ];
  let input_data = {};
  for (let i = 0; i < input_levels.length; i += 1) {
    input_data = assign(input_data, input_levels[i]);
  }
  return {
    c() {
      input = element("input");
      set_attributes(input, input_data);
    },
    m(target, anchor) {
      insert(target, input, anchor);
      if (input.autofocus)
        input.focus();
      set_input_value(input, ctx[6]);
      ctx[186](input);
      if (!mounted) {
        dispose = [
          listen(input, "blur", ctx[74]),
          listen(input, "change", ctx[75]),
          listen(input, "focus", ctx[76]),
          listen(input, "input", ctx[77]),
          listen(input, "keydown", ctx[78]),
          listen(input, "keypress", ctx[79]),
          listen(input, "keyup", ctx[80]),
          listen(input, "input", ctx[185])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      set_attributes(input, input_data = get_spread_update(input_levels, [
        dirty[0] & 2097152 && ctx2[21],
        dirty[0] & 262144 && {class: ctx2[18]},
        {type: "date"},
        dirty[0] & 256 && {disabled: ctx2[8]},
        dirty[0] & 8192 && {name: ctx2[13]},
        dirty[0] & 16384 && {placeholder: ctx2[14]},
        dirty[0] & 32768 && {readOnly: ctx2[15]}
      ]));
      if (dirty[0] & 64) {
        set_input_value(input, ctx2[6]);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(input);
      ctx[186](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_10(ctx) {
  let input;
  let mounted;
  let dispose;
  let input_levels = [
    ctx[21],
    {class: ctx[18]},
    {type: "number"},
    {readOnly: ctx[15]},
    {name: ctx[13]},
    {disabled: ctx[8]},
    {placeholder: ctx[14]}
  ];
  let input_data = {};
  for (let i = 0; i < input_levels.length; i += 1) {
    input_data = assign(input_data, input_levels[i]);
  }
  return {
    c() {
      input = element("input");
      set_attributes(input, input_data);
    },
    m(target, anchor) {
      insert(target, input, anchor);
      if (input.autofocus)
        input.focus();
      set_input_value(input, ctx[6]);
      ctx[184](input);
      if (!mounted) {
        dispose = [
          listen(input, "blur", ctx[67]),
          listen(input, "change", ctx[68]),
          listen(input, "focus", ctx[69]),
          listen(input, "input", ctx[70]),
          listen(input, "keydown", ctx[71]),
          listen(input, "keypress", ctx[72]),
          listen(input, "keyup", ctx[73]),
          listen(input, "input", ctx[183])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      set_attributes(input, input_data = get_spread_update(input_levels, [
        dirty[0] & 2097152 && ctx2[21],
        dirty[0] & 262144 && {class: ctx2[18]},
        {type: "number"},
        dirty[0] & 32768 && {readOnly: ctx2[15]},
        dirty[0] & 8192 && {name: ctx2[13]},
        dirty[0] & 256 && {disabled: ctx2[8]},
        dirty[0] & 16384 && {placeholder: ctx2[14]}
      ]));
      if (dirty[0] & 64 && to_number(input.value) !== ctx2[6]) {
        set_input_value(input, ctx2[6]);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(input);
      ctx[184](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_9(ctx) {
  let input;
  let mounted;
  let dispose;
  let input_levels = [
    ctx[21],
    {class: ctx[18]},
    {type: "url"},
    {disabled: ctx[8]},
    {name: ctx[13]},
    {placeholder: ctx[14]},
    {readOnly: ctx[15]},
    {size: ctx[1]}
  ];
  let input_data = {};
  for (let i = 0; i < input_levels.length; i += 1) {
    input_data = assign(input_data, input_levels[i]);
  }
  return {
    c() {
      input = element("input");
      set_attributes(input, input_data);
    },
    m(target, anchor) {
      insert(target, input, anchor);
      if (input.autofocus)
        input.focus();
      set_input_value(input, ctx[6]);
      ctx[182](input);
      if (!mounted) {
        dispose = [
          listen(input, "blur", ctx[60]),
          listen(input, "change", ctx[61]),
          listen(input, "focus", ctx[62]),
          listen(input, "input", ctx[63]),
          listen(input, "keydown", ctx[64]),
          listen(input, "keypress", ctx[65]),
          listen(input, "keyup", ctx[66]),
          listen(input, "input", ctx[181])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      set_attributes(input, input_data = get_spread_update(input_levels, [
        dirty[0] & 2097152 && ctx2[21],
        dirty[0] & 262144 && {class: ctx2[18]},
        {type: "url"},
        dirty[0] & 256 && {disabled: ctx2[8]},
        dirty[0] & 8192 && {name: ctx2[13]},
        dirty[0] & 16384 && {placeholder: ctx2[14]},
        dirty[0] & 32768 && {readOnly: ctx2[15]},
        dirty[0] & 2 && {size: ctx2[1]}
      ]));
      if (dirty[0] & 64) {
        set_input_value(input, ctx2[6]);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(input);
      ctx[182](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_8(ctx) {
  let formcheck;
  let updating_checked;
  let updating_inner;
  let updating_group;
  let updating_value;
  let current;
  const formcheck_spread_levels = [
    ctx[21],
    {class: ctx[7]},
    {size: ctx[0]},
    {type: ctx[16]},
    {disabled: ctx[8]},
    {invalid: ctx[10]},
    {label: ctx[11]},
    {name: ctx[13]},
    {placeholder: ctx[14]},
    {readonly: ctx[15]},
    {valid: ctx[17]}
  ];
  function formcheck_checked_binding(value2) {
    ctx[170](value2);
  }
  function formcheck_inner_binding(value2) {
    ctx[171](value2);
  }
  function formcheck_group_binding(value2) {
    ctx[172](value2);
  }
  function formcheck_value_binding(value2) {
    ctx[173](value2);
  }
  let formcheck_props = {};
  for (let i = 0; i < formcheck_spread_levels.length; i += 1) {
    formcheck_props = assign(formcheck_props, formcheck_spread_levels[i]);
  }
  if (ctx[2] !== void 0) {
    formcheck_props.checked = ctx[2];
  }
  if (ctx[5] !== void 0) {
    formcheck_props.inner = ctx[5];
  }
  if (ctx[4] !== void 0) {
    formcheck_props.group = ctx[4];
  }
  if (ctx[6] !== void 0) {
    formcheck_props.value = ctx[6];
  }
  formcheck = new FormCheck({props: formcheck_props});
  binding_callbacks.push(() => bind(formcheck, "checked", formcheck_checked_binding));
  binding_callbacks.push(() => bind(formcheck, "inner", formcheck_inner_binding));
  binding_callbacks.push(() => bind(formcheck, "group", formcheck_group_binding));
  binding_callbacks.push(() => bind(formcheck, "value", formcheck_value_binding));
  formcheck.$on("blur", ctx[174]);
  formcheck.$on("change", ctx[175]);
  formcheck.$on("focus", ctx[176]);
  formcheck.$on("input", ctx[177]);
  formcheck.$on("keydown", ctx[178]);
  formcheck.$on("keypress", ctx[179]);
  formcheck.$on("keyup", ctx[180]);
  return {
    c() {
      create_component(formcheck.$$.fragment);
    },
    m(target, anchor) {
      mount_component(formcheck, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const formcheck_changes = dirty[0] & 2354561 ? get_spread_update(formcheck_spread_levels, [
        dirty[0] & 2097152 && get_spread_object(ctx2[21]),
        dirty[0] & 128 && {class: ctx2[7]},
        dirty[0] & 1 && {size: ctx2[0]},
        dirty[0] & 65536 && {type: ctx2[16]},
        dirty[0] & 256 && {disabled: ctx2[8]},
        dirty[0] & 1024 && {invalid: ctx2[10]},
        dirty[0] & 2048 && {label: ctx2[11]},
        dirty[0] & 8192 && {name: ctx2[13]},
        dirty[0] & 16384 && {placeholder: ctx2[14]},
        dirty[0] & 32768 && {readonly: ctx2[15]},
        dirty[0] & 131072 && {valid: ctx2[17]}
      ]) : {};
      if (!updating_checked && dirty[0] & 4) {
        updating_checked = true;
        formcheck_changes.checked = ctx2[2];
        add_flush_callback(() => updating_checked = false);
      }
      if (!updating_inner && dirty[0] & 32) {
        updating_inner = true;
        formcheck_changes.inner = ctx2[5];
        add_flush_callback(() => updating_inner = false);
      }
      if (!updating_group && dirty[0] & 16) {
        updating_group = true;
        formcheck_changes.group = ctx2[4];
        add_flush_callback(() => updating_group = false);
      }
      if (!updating_value && dirty[0] & 64) {
        updating_value = true;
        formcheck_changes.value = ctx2[6];
        add_flush_callback(() => updating_value = false);
      }
      formcheck.$set(formcheck_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(formcheck.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(formcheck.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(formcheck, detaching);
    }
  };
}
function create_if_block_7(ctx) {
  let input;
  let mounted;
  let dispose;
  let input_levels = [
    ctx[21],
    {class: ctx[18]},
    {type: "file"},
    {disabled: ctx[8]},
    {invalid: ctx[10]},
    {multiple: ctx[12]},
    {name: ctx[13]},
    {placeholder: ctx[14]},
    {readOnly: ctx[15]},
    {valid: ctx[17]}
  ];
  let input_data = {};
  for (let i = 0; i < input_levels.length; i += 1) {
    input_data = assign(input_data, input_levels[i]);
  }
  return {
    c() {
      input = element("input");
      set_attributes(input, input_data);
    },
    m(target, anchor) {
      insert(target, input, anchor);
      if (input.autofocus)
        input.focus();
      ctx[169](input);
      if (!mounted) {
        dispose = [
          listen(input, "blur", ctx[53]),
          listen(input, "change", ctx[54]),
          listen(input, "focus", ctx[55]),
          listen(input, "input", ctx[56]),
          listen(input, "keydown", ctx[57]),
          listen(input, "keypress", ctx[58]),
          listen(input, "keyup", ctx[59]),
          listen(input, "change", ctx[168])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      set_attributes(input, input_data = get_spread_update(input_levels, [
        dirty[0] & 2097152 && ctx2[21],
        dirty[0] & 262144 && {class: ctx2[18]},
        {type: "file"},
        dirty[0] & 256 && {disabled: ctx2[8]},
        dirty[0] & 1024 && {invalid: ctx2[10]},
        dirty[0] & 4096 && {multiple: ctx2[12]},
        dirty[0] & 8192 && {name: ctx2[13]},
        dirty[0] & 16384 && {placeholder: ctx2[14]},
        dirty[0] & 32768 && {readOnly: ctx2[15]},
        dirty[0] & 131072 && {valid: ctx2[17]}
      ]));
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(input);
      ctx[169](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_6(ctx) {
  let input;
  let mounted;
  let dispose;
  let input_levels = [
    ctx[21],
    {class: ctx[18]},
    {type: "email"},
    {disabled: ctx[8]},
    {multiple: ctx[12]},
    {name: ctx[13]},
    {placeholder: ctx[14]},
    {readOnly: ctx[15]},
    {size: ctx[1]}
  ];
  let input_data = {};
  for (let i = 0; i < input_levels.length; i += 1) {
    input_data = assign(input_data, input_levels[i]);
  }
  return {
    c() {
      input = element("input");
      set_attributes(input, input_data);
    },
    m(target, anchor) {
      insert(target, input, anchor);
      if (input.autofocus)
        input.focus();
      set_input_value(input, ctx[6]);
      ctx[167](input);
      if (!mounted) {
        dispose = [
          listen(input, "blur", ctx[46]),
          listen(input, "change", ctx[47]),
          listen(input, "focus", ctx[48]),
          listen(input, "input", ctx[49]),
          listen(input, "keydown", ctx[50]),
          listen(input, "keypress", ctx[51]),
          listen(input, "keyup", ctx[52]),
          listen(input, "input", ctx[166])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      set_attributes(input, input_data = get_spread_update(input_levels, [
        dirty[0] & 2097152 && ctx2[21],
        dirty[0] & 262144 && {class: ctx2[18]},
        {type: "email"},
        dirty[0] & 256 && {disabled: ctx2[8]},
        dirty[0] & 4096 && {multiple: ctx2[12]},
        dirty[0] & 8192 && {name: ctx2[13]},
        dirty[0] & 16384 && {placeholder: ctx2[14]},
        dirty[0] & 32768 && {readOnly: ctx2[15]},
        dirty[0] & 2 && {size: ctx2[1]}
      ]));
      if (dirty[0] & 64 && input.value !== ctx2[6]) {
        set_input_value(input, ctx2[6]);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(input);
      ctx[167](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_5(ctx) {
  let input;
  let mounted;
  let dispose;
  let input_levels = [
    ctx[21],
    {class: ctx[18]},
    {type: "color"},
    {disabled: ctx[8]},
    {name: ctx[13]},
    {placeholder: ctx[14]},
    {readOnly: ctx[15]}
  ];
  let input_data = {};
  for (let i = 0; i < input_levels.length; i += 1) {
    input_data = assign(input_data, input_levels[i]);
  }
  return {
    c() {
      input = element("input");
      set_attributes(input, input_data);
    },
    m(target, anchor) {
      insert(target, input, anchor);
      if (input.autofocus)
        input.focus();
      set_input_value(input, ctx[6]);
      ctx[165](input);
      if (!mounted) {
        dispose = [
          listen(input, "blur", ctx[39]),
          listen(input, "change", ctx[40]),
          listen(input, "focus", ctx[41]),
          listen(input, "input", ctx[42]),
          listen(input, "keydown", ctx[43]),
          listen(input, "keypress", ctx[44]),
          listen(input, "keyup", ctx[45]),
          listen(input, "input", ctx[164])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      set_attributes(input, input_data = get_spread_update(input_levels, [
        dirty[0] & 2097152 && ctx2[21],
        dirty[0] & 262144 && {class: ctx2[18]},
        {type: "color"},
        dirty[0] & 256 && {disabled: ctx2[8]},
        dirty[0] & 8192 && {name: ctx2[13]},
        dirty[0] & 16384 && {placeholder: ctx2[14]},
        dirty[0] & 32768 && {readOnly: ctx2[15]}
      ]));
      if (dirty[0] & 64) {
        set_input_value(input, ctx2[6]);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(input);
      ctx[165](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_4(ctx) {
  let input;
  let mounted;
  let dispose;
  let input_levels = [
    ctx[21],
    {class: ctx[18]},
    {type: "password"},
    {disabled: ctx[8]},
    {name: ctx[13]},
    {placeholder: ctx[14]},
    {readOnly: ctx[15]},
    {size: ctx[1]}
  ];
  let input_data = {};
  for (let i = 0; i < input_levels.length; i += 1) {
    input_data = assign(input_data, input_levels[i]);
  }
  return {
    c() {
      input = element("input");
      set_attributes(input, input_data);
    },
    m(target, anchor) {
      insert(target, input, anchor);
      if (input.autofocus)
        input.focus();
      set_input_value(input, ctx[6]);
      ctx[163](input);
      if (!mounted) {
        dispose = [
          listen(input, "blur", ctx[32]),
          listen(input, "change", ctx[33]),
          listen(input, "focus", ctx[34]),
          listen(input, "input", ctx[35]),
          listen(input, "keydown", ctx[36]),
          listen(input, "keypress", ctx[37]),
          listen(input, "keyup", ctx[38]),
          listen(input, "input", ctx[162])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      set_attributes(input, input_data = get_spread_update(input_levels, [
        dirty[0] & 2097152 && ctx2[21],
        dirty[0] & 262144 && {class: ctx2[18]},
        {type: "password"},
        dirty[0] & 256 && {disabled: ctx2[8]},
        dirty[0] & 8192 && {name: ctx2[13]},
        dirty[0] & 16384 && {placeholder: ctx2[14]},
        dirty[0] & 32768 && {readOnly: ctx2[15]},
        dirty[0] & 2 && {size: ctx2[1]}
      ]));
      if (dirty[0] & 64 && input.value !== ctx2[6]) {
        set_input_value(input, ctx2[6]);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(input);
      ctx[163](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_3(ctx) {
  let input;
  let mounted;
  let dispose;
  let input_levels = [
    ctx[21],
    {class: ctx[18]},
    {type: "text"},
    {disabled: ctx[8]},
    {name: ctx[13]},
    {placeholder: ctx[14]},
    {readOnly: ctx[15]},
    {size: ctx[1]}
  ];
  let input_data = {};
  for (let i = 0; i < input_levels.length; i += 1) {
    input_data = assign(input_data, input_levels[i]);
  }
  return {
    c() {
      input = element("input");
      set_attributes(input, input_data);
    },
    m(target, anchor) {
      insert(target, input, anchor);
      if (input.autofocus)
        input.focus();
      set_input_value(input, ctx[6]);
      ctx[161](input);
      if (!mounted) {
        dispose = [
          listen(input, "blur", ctx[25]),
          listen(input, "change", ctx[26]),
          listen(input, "focus", ctx[27]),
          listen(input, "input", ctx[28]),
          listen(input, "keydown", ctx[29]),
          listen(input, "keypress", ctx[30]),
          listen(input, "keyup", ctx[31]),
          listen(input, "input", ctx[160])
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      set_attributes(input, input_data = get_spread_update(input_levels, [
        dirty[0] & 2097152 && ctx2[21],
        dirty[0] & 262144 && {class: ctx2[18]},
        {type: "text"},
        dirty[0] & 256 && {disabled: ctx2[8]},
        dirty[0] & 8192 && {name: ctx2[13]},
        dirty[0] & 16384 && {placeholder: ctx2[14]},
        dirty[0] & 32768 && {readOnly: ctx2[15]},
        dirty[0] & 2 && {size: ctx2[1]}
      ]));
      if (dirty[0] & 64 && input.value !== ctx2[6]) {
        set_input_value(input, ctx2[6]);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(input);
      ctx[161](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block$3(ctx) {
  let show_if;
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block_1$3, create_else_block$3];
  const if_blocks = [];
  function select_block_type_2(ctx2, dirty) {
    if (dirty[0] & 512)
      show_if = null;
    if (show_if == null)
      show_if = !!Array.isArray(ctx2[9]);
    if (show_if)
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type_2(ctx, [-1, -1, -1, -1, -1, -1, -1]);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type_2(ctx2, dirty);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if_blocks[current_block_type_index].d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
function create_else_block$3(ctx) {
  let formfeedback;
  let current;
  formfeedback = new FormFeedback({
    props: {
      valid: ctx[17],
      $$slots: {default: [create_default_slot_1]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      create_component(formfeedback.$$.fragment);
    },
    m(target, anchor) {
      mount_component(formfeedback, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const formfeedback_changes = {};
      if (dirty[0] & 131072)
        formfeedback_changes.valid = ctx2[17];
      if (dirty[0] & 512 | dirty[6] & 8388608) {
        formfeedback_changes.$$scope = {dirty, ctx: ctx2};
      }
      formfeedback.$set(formfeedback_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(formfeedback.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(formfeedback.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(formfeedback, detaching);
    }
  };
}
function create_if_block_1$3(ctx) {
  let each_1_anchor;
  let current;
  let each_value = ctx[9];
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  return {
    c() {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      each_1_anchor = empty();
    },
    m(target, anchor) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(target, anchor);
      }
      insert(target, each_1_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty[0] & 131584) {
        each_value = ctx2[9];
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
          }
        }
        group_outros();
        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      destroy_each(each_blocks, detaching);
      if (detaching)
        detach(each_1_anchor);
    }
  };
}
function create_default_slot_1(ctx) {
  let t;
  return {
    c() {
      t = text(ctx[9]);
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & 512)
        set_data(t, ctx2[9]);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot(ctx) {
  let t_value = ctx[210] + "";
  let t;
  return {
    c() {
      t = text(t_value);
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & 512 && t_value !== (t_value = ctx2[210] + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_each_block(ctx) {
  let formfeedback;
  let current;
  formfeedback = new FormFeedback({
    props: {
      valid: ctx[17],
      $$slots: {default: [create_default_slot]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      create_component(formfeedback.$$.fragment);
    },
    m(target, anchor) {
      mount_component(formfeedback, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const formfeedback_changes = {};
      if (dirty[0] & 131072)
        formfeedback_changes.valid = ctx2[17];
      if (dirty[0] & 512 | dirty[6] & 8388608) {
        formfeedback_changes.$$scope = {dirty, ctx: ctx2};
      }
      formfeedback.$set(formfeedback_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(formfeedback.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(formfeedback.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(formfeedback, detaching);
    }
  };
}
function create_fragment$7(ctx) {
  let current_block_type_index;
  let if_block0;
  let t;
  let if_block1_anchor;
  let current;
  const if_block_creators = [create_if_block_2$3, create_if_block_21, create_if_block_22];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (ctx2[19] === "input")
      return 0;
    if (ctx2[19] === "textarea")
      return 1;
    if (ctx2[19] === "select" && !ctx2[12])
      return 2;
    return -1;
  }
  if (~(current_block_type_index = select_block_type(ctx))) {
    if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  }
  let if_block1 = ctx[9] && create_if_block$3(ctx);
  return {
    c() {
      if (if_block0)
        if_block0.c();
      t = space();
      if (if_block1)
        if_block1.c();
      if_block1_anchor = empty();
    },
    m(target, anchor) {
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].m(target, anchor);
      }
      insert(target, t, anchor);
      if (if_block1)
        if_block1.m(target, anchor);
      insert(target, if_block1_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if (~current_block_type_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        }
      } else {
        if (if_block0) {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
        }
        if (~current_block_type_index) {
          if_block0 = if_blocks[current_block_type_index];
          if (!if_block0) {
            if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block0.c();
          } else {
            if_block0.p(ctx2, dirty);
          }
          transition_in(if_block0, 1);
          if_block0.m(t.parentNode, t);
        } else {
          if_block0 = null;
        }
      }
      if (ctx2[9]) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
          if (dirty[0] & 512) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block$3(ctx2);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, () => {
          if_block1 = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block0);
      transition_in(if_block1);
      current = true;
    },
    o(local) {
      transition_out(if_block0);
      transition_out(if_block1);
      current = false;
    },
    d(detaching) {
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].d(detaching);
      }
      if (detaching)
        detach(t);
      if (if_block1)
        if_block1.d(detaching);
      if (detaching)
        detach(if_block1_anchor);
    }
  };
}
function instance$7($$self, $$props, $$invalidate) {
  const omit_props_names = [
    "class",
    "bsSize",
    "checked",
    "color",
    "disabled",
    "feedback",
    "files",
    "group",
    "inner",
    "invalid",
    "label",
    "multiple",
    "name",
    "placeholder",
    "plaintext",
    "readonly",
    "size",
    "type",
    "valid",
    "value"
  ];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let {$$slots: slots = {}, $$scope} = $$props;
  let {class: className = ""} = $$props;
  let {bsSize = void 0} = $$props;
  let {checked = false} = $$props;
  let {color = void 0} = $$props;
  let {disabled = void 0} = $$props;
  let {feedback = void 0} = $$props;
  let {files: files2 = void 0} = $$props;
  let {group = void 0} = $$props;
  let {inner = void 0} = $$props;
  let {invalid = false} = $$props;
  let {label = void 0} = $$props;
  let {multiple = void 0} = $$props;
  let {name = ""} = $$props;
  let {placeholder = ""} = $$props;
  let {plaintext = false} = $$props;
  let {readonly = void 0} = $$props;
  let {size = void 0} = $$props;
  let {type = "text"} = $$props;
  let {valid = false} = $$props;
  let {value: value2 = ""} = $$props;
  let classes;
  let tag;
  const handleInput = (event) => {
    $$invalidate(6, value2 = event.target.value);
  };
  function blur_handler(event) {
    bubble.call(this, $$self, event);
  }
  function change_handler(event) {
    bubble.call(this, $$self, event);
  }
  function focus_handler(event) {
    bubble.call(this, $$self, event);
  }
  function input_handler(event) {
    bubble.call(this, $$self, event);
  }
  function keydown_handler(event) {
    bubble.call(this, $$self, event);
  }
  function keypress_handler(event) {
    bubble.call(this, $$self, event);
  }
  function keyup_handler(event) {
    bubble.call(this, $$self, event);
  }
  function blur_handler_1(event) {
    bubble.call(this, $$self, event);
  }
  function change_handler_1(event) {
    bubble.call(this, $$self, event);
  }
  function focus_handler_1(event) {
    bubble.call(this, $$self, event);
  }
  function input_handler_1(event) {
    bubble.call(this, $$self, event);
  }
  function keydown_handler_1(event) {
    bubble.call(this, $$self, event);
  }
  function keypress_handler_1(event) {
    bubble.call(this, $$self, event);
  }
  function keyup_handler_1(event) {
    bubble.call(this, $$self, event);
  }
  function blur_handler_2(event) {
    bubble.call(this, $$self, event);
  }
  function change_handler_2(event) {
    bubble.call(this, $$self, event);
  }
  function focus_handler_2(event) {
    bubble.call(this, $$self, event);
  }
  function input_handler_2(event) {
    bubble.call(this, $$self, event);
  }
  function keydown_handler_2(event) {
    bubble.call(this, $$self, event);
  }
  function keypress_handler_2(event) {
    bubble.call(this, $$self, event);
  }
  function keyup_handler_2(event) {
    bubble.call(this, $$self, event);
  }
  function blur_handler_3(event) {
    bubble.call(this, $$self, event);
  }
  function change_handler_3(event) {
    bubble.call(this, $$self, event);
  }
  function focus_handler_3(event) {
    bubble.call(this, $$self, event);
  }
  function input_handler_3(event) {
    bubble.call(this, $$self, event);
  }
  function keydown_handler_3(event) {
    bubble.call(this, $$self, event);
  }
  function keypress_handler_3(event) {
    bubble.call(this, $$self, event);
  }
  function keyup_handler_3(event) {
    bubble.call(this, $$self, event);
  }
  function blur_handler_4(event) {
    bubble.call(this, $$self, event);
  }
  function change_handler_4(event) {
    bubble.call(this, $$self, event);
  }
  function focus_handler_4(event) {
    bubble.call(this, $$self, event);
  }
  function input_handler_4(event) {
    bubble.call(this, $$self, event);
  }
  function keydown_handler_4(event) {
    bubble.call(this, $$self, event);
  }
  function keypress_handler_4(event) {
    bubble.call(this, $$self, event);
  }
  function keyup_handler_4(event) {
    bubble.call(this, $$self, event);
  }
  function blur_handler_6(event) {
    bubble.call(this, $$self, event);
  }
  function change_handler_6(event) {
    bubble.call(this, $$self, event);
  }
  function focus_handler_6(event) {
    bubble.call(this, $$self, event);
  }
  function input_handler_6(event) {
    bubble.call(this, $$self, event);
  }
  function keydown_handler_6(event) {
    bubble.call(this, $$self, event);
  }
  function keypress_handler_6(event) {
    bubble.call(this, $$self, event);
  }
  function keyup_handler_6(event) {
    bubble.call(this, $$self, event);
  }
  function blur_handler_7(event) {
    bubble.call(this, $$self, event);
  }
  function change_handler_7(event) {
    bubble.call(this, $$self, event);
  }
  function focus_handler_7(event) {
    bubble.call(this, $$self, event);
  }
  function input_handler_7(event) {
    bubble.call(this, $$self, event);
  }
  function keydown_handler_7(event) {
    bubble.call(this, $$self, event);
  }
  function keypress_handler_7(event) {
    bubble.call(this, $$self, event);
  }
  function keyup_handler_7(event) {
    bubble.call(this, $$self, event);
  }
  function blur_handler_8(event) {
    bubble.call(this, $$self, event);
  }
  function change_handler_8(event) {
    bubble.call(this, $$self, event);
  }
  function focus_handler_8(event) {
    bubble.call(this, $$self, event);
  }
  function input_handler_8(event) {
    bubble.call(this, $$self, event);
  }
  function keydown_handler_8(event) {
    bubble.call(this, $$self, event);
  }
  function keypress_handler_8(event) {
    bubble.call(this, $$self, event);
  }
  function keyup_handler_8(event) {
    bubble.call(this, $$self, event);
  }
  function blur_handler_9(event) {
    bubble.call(this, $$self, event);
  }
  function change_handler_9(event) {
    bubble.call(this, $$self, event);
  }
  function focus_handler_9(event) {
    bubble.call(this, $$self, event);
  }
  function input_handler_9(event) {
    bubble.call(this, $$self, event);
  }
  function keydown_handler_9(event) {
    bubble.call(this, $$self, event);
  }
  function keypress_handler_9(event) {
    bubble.call(this, $$self, event);
  }
  function keyup_handler_9(event) {
    bubble.call(this, $$self, event);
  }
  function blur_handler_10(event) {
    bubble.call(this, $$self, event);
  }
  function change_handler_10(event) {
    bubble.call(this, $$self, event);
  }
  function focus_handler_10(event) {
    bubble.call(this, $$self, event);
  }
  function input_handler_10(event) {
    bubble.call(this, $$self, event);
  }
  function keydown_handler_10(event) {
    bubble.call(this, $$self, event);
  }
  function keypress_handler_10(event) {
    bubble.call(this, $$self, event);
  }
  function keyup_handler_10(event) {
    bubble.call(this, $$self, event);
  }
  function blur_handler_11(event) {
    bubble.call(this, $$self, event);
  }
  function change_handler_11(event) {
    bubble.call(this, $$self, event);
  }
  function focus_handler_11(event) {
    bubble.call(this, $$self, event);
  }
  function input_handler_11(event) {
    bubble.call(this, $$self, event);
  }
  function keydown_handler_11(event) {
    bubble.call(this, $$self, event);
  }
  function keypress_handler_11(event) {
    bubble.call(this, $$self, event);
  }
  function keyup_handler_11(event) {
    bubble.call(this, $$self, event);
  }
  function blur_handler_12(event) {
    bubble.call(this, $$self, event);
  }
  function change_handler_12(event) {
    bubble.call(this, $$self, event);
  }
  function focus_handler_12(event) {
    bubble.call(this, $$self, event);
  }
  function input_handler_12(event) {
    bubble.call(this, $$self, event);
  }
  function keydown_handler_12(event) {
    bubble.call(this, $$self, event);
  }
  function keypress_handler_12(event) {
    bubble.call(this, $$self, event);
  }
  function keyup_handler_12(event) {
    bubble.call(this, $$self, event);
  }
  function blur_handler_13(event) {
    bubble.call(this, $$self, event);
  }
  function change_handler_13(event) {
    bubble.call(this, $$self, event);
  }
  function focus_handler_13(event) {
    bubble.call(this, $$self, event);
  }
  function input_handler_13(event) {
    bubble.call(this, $$self, event);
  }
  function keydown_handler_13(event) {
    bubble.call(this, $$self, event);
  }
  function keypress_handler_13(event) {
    bubble.call(this, $$self, event);
  }
  function keyup_handler_13(event) {
    bubble.call(this, $$self, event);
  }
  function blur_handler_14(event) {
    bubble.call(this, $$self, event);
  }
  function change_handler_14(event) {
    bubble.call(this, $$self, event);
  }
  function focus_handler_14(event) {
    bubble.call(this, $$self, event);
  }
  function input_handler_14(event) {
    bubble.call(this, $$self, event);
  }
  function keydown_handler_14(event) {
    bubble.call(this, $$self, event);
  }
  function keypress_handler_14(event) {
    bubble.call(this, $$self, event);
  }
  function keyup_handler_14(event) {
    bubble.call(this, $$self, event);
  }
  function blur_handler_15(event) {
    bubble.call(this, $$self, event);
  }
  function change_handler_15(event) {
    bubble.call(this, $$self, event);
  }
  function focus_handler_15(event) {
    bubble.call(this, $$self, event);
  }
  function input_handler_15(event) {
    bubble.call(this, $$self, event);
  }
  function keydown_handler_15(event) {
    bubble.call(this, $$self, event);
  }
  function keypress_handler_15(event) {
    bubble.call(this, $$self, event);
  }
  function keyup_handler_15(event) {
    bubble.call(this, $$self, event);
  }
  function blur_handler_16(event) {
    bubble.call(this, $$self, event);
  }
  function change_handler_16(event) {
    bubble.call(this, $$self, event);
  }
  function focus_handler_16(event) {
    bubble.call(this, $$self, event);
  }
  function input_handler_16(event) {
    bubble.call(this, $$self, event);
  }
  function keydown_handler_16(event) {
    bubble.call(this, $$self, event);
  }
  function keypress_handler_16(event) {
    bubble.call(this, $$self, event);
  }
  function keyup_handler_16(event) {
    bubble.call(this, $$self, event);
  }
  function blur_handler_17(event) {
    bubble.call(this, $$self, event);
  }
  function change_handler_17(event) {
    bubble.call(this, $$self, event);
  }
  function focus_handler_17(event) {
    bubble.call(this, $$self, event);
  }
  function input_handler_17(event) {
    bubble.call(this, $$self, event);
  }
  function keydown_handler_17(event) {
    bubble.call(this, $$self, event);
  }
  function keypress_handler_17(event) {
    bubble.call(this, $$self, event);
  }
  function keyup_handler_17(event) {
    bubble.call(this, $$self, event);
  }
  function blur_handler_18(event) {
    bubble.call(this, $$self, event);
  }
  function focus_handler_18(event) {
    bubble.call(this, $$self, event);
  }
  function keydown_handler_18(event) {
    bubble.call(this, $$self, event);
  }
  function keypress_handler_18(event) {
    bubble.call(this, $$self, event);
  }
  function keyup_handler_18(event) {
    bubble.call(this, $$self, event);
  }
  function blur_handler_19(event) {
    bubble.call(this, $$self, event);
  }
  function change_handler_18(event) {
    bubble.call(this, $$self, event);
  }
  function focus_handler_19(event) {
    bubble.call(this, $$self, event);
  }
  function input_handler_18(event) {
    bubble.call(this, $$self, event);
  }
  function keydown_handler_19(event) {
    bubble.call(this, $$self, event);
  }
  function keypress_handler_19(event) {
    bubble.call(this, $$self, event);
  }
  function keyup_handler_19(event) {
    bubble.call(this, $$self, event);
  }
  function blur_handler_20(event) {
    bubble.call(this, $$self, event);
  }
  function change_handler_19(event) {
    bubble.call(this, $$self, event);
  }
  function focus_handler_20(event) {
    bubble.call(this, $$self, event);
  }
  function input_handler_19(event) {
    bubble.call(this, $$self, event);
  }
  function input_input_handler() {
    value2 = this.value;
    $$invalidate(6, value2);
  }
  function input_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      inner = $$value;
      $$invalidate(5, inner);
    });
  }
  function input_input_handler_1() {
    value2 = this.value;
    $$invalidate(6, value2);
  }
  function input_binding_1($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      inner = $$value;
      $$invalidate(5, inner);
    });
  }
  function input_input_handler_2() {
    value2 = this.value;
    $$invalidate(6, value2);
  }
  function input_binding_2($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      inner = $$value;
      $$invalidate(5, inner);
    });
  }
  function input_input_handler_3() {
    value2 = this.value;
    $$invalidate(6, value2);
  }
  function input_binding_3($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      inner = $$value;
      $$invalidate(5, inner);
    });
  }
  function input_change_handler() {
    files2 = this.files;
    value2 = this.value;
    $$invalidate(3, files2);
    $$invalidate(6, value2);
  }
  function input_binding_4($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      inner = $$value;
      $$invalidate(5, inner);
    });
  }
  function formcheck_checked_binding(value3) {
    checked = value3;
    $$invalidate(2, checked);
  }
  function formcheck_inner_binding(value3) {
    inner = value3;
    $$invalidate(5, inner);
  }
  function formcheck_group_binding(value3) {
    group = value3;
    $$invalidate(4, group);
  }
  function formcheck_value_binding(value$1) {
    value2 = value$1;
    $$invalidate(6, value2);
  }
  function blur_handler_5(event) {
    bubble.call(this, $$self, event);
  }
  function change_handler_5(event) {
    bubble.call(this, $$self, event);
  }
  function focus_handler_5(event) {
    bubble.call(this, $$self, event);
  }
  function input_handler_5(event) {
    bubble.call(this, $$self, event);
  }
  function keydown_handler_5(event) {
    bubble.call(this, $$self, event);
  }
  function keypress_handler_5(event) {
    bubble.call(this, $$self, event);
  }
  function keyup_handler_5(event) {
    bubble.call(this, $$self, event);
  }
  function input_input_handler_4() {
    value2 = this.value;
    $$invalidate(6, value2);
  }
  function input_binding_5($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      inner = $$value;
      $$invalidate(5, inner);
    });
  }
  function input_input_handler_5() {
    value2 = to_number(this.value);
    $$invalidate(6, value2);
  }
  function input_binding_6($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      inner = $$value;
      $$invalidate(5, inner);
    });
  }
  function input_input_handler_6() {
    value2 = this.value;
    $$invalidate(6, value2);
  }
  function input_binding_7($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      inner = $$value;
      $$invalidate(5, inner);
    });
  }
  function input_input_handler_7() {
    value2 = this.value;
    $$invalidate(6, value2);
  }
  function input_binding_8($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      inner = $$value;
      $$invalidate(5, inner);
    });
  }
  function input_input_handler_8() {
    value2 = this.value;
    $$invalidate(6, value2);
  }
  function input_binding_9($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      inner = $$value;
      $$invalidate(5, inner);
    });
  }
  function input_input_handler_9() {
    value2 = this.value;
    $$invalidate(6, value2);
  }
  function input_binding_10($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      inner = $$value;
      $$invalidate(5, inner);
    });
  }
  function input_input_handler_10() {
    value2 = this.value;
    $$invalidate(6, value2);
  }
  function input_binding_11($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      inner = $$value;
      $$invalidate(5, inner);
    });
  }
  function input_input_handler_11() {
    value2 = this.value;
    $$invalidate(6, value2);
  }
  function input_binding_12($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      inner = $$value;
      $$invalidate(5, inner);
    });
  }
  function input_change_input_handler() {
    value2 = to_number(this.value);
    $$invalidate(6, value2);
  }
  function input_binding_13($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      inner = $$value;
      $$invalidate(5, inner);
    });
  }
  function input_input_handler_12() {
    value2 = this.value;
    $$invalidate(6, value2);
  }
  function input_binding_14($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      inner = $$value;
      $$invalidate(5, inner);
    });
  }
  function input_input_handler_13() {
    value2 = this.value;
    $$invalidate(6, value2);
  }
  function input_binding_15($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      inner = $$value;
      $$invalidate(5, inner);
    });
  }
  function input_input_handler_14() {
    value2 = this.value;
    $$invalidate(6, value2);
  }
  function input_binding_16($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      inner = $$value;
      $$invalidate(5, inner);
    });
  }
  function textarea_input_handler() {
    value2 = this.value;
    $$invalidate(6, value2);
  }
  function textarea_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      inner = $$value;
      $$invalidate(5, inner);
    });
  }
  function select_change_handler() {
    value2 = select_value(this);
    $$invalidate(6, value2);
  }
  function select_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      inner = $$value;
      $$invalidate(5, inner);
    });
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(21, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("class" in $$new_props)
      $$invalidate(7, className = $$new_props.class);
    if ("bsSize" in $$new_props)
      $$invalidate(0, bsSize = $$new_props.bsSize);
    if ("checked" in $$new_props)
      $$invalidate(2, checked = $$new_props.checked);
    if ("color" in $$new_props)
      $$invalidate(22, color = $$new_props.color);
    if ("disabled" in $$new_props)
      $$invalidate(8, disabled = $$new_props.disabled);
    if ("feedback" in $$new_props)
      $$invalidate(9, feedback = $$new_props.feedback);
    if ("files" in $$new_props)
      $$invalidate(3, files2 = $$new_props.files);
    if ("group" in $$new_props)
      $$invalidate(4, group = $$new_props.group);
    if ("inner" in $$new_props)
      $$invalidate(5, inner = $$new_props.inner);
    if ("invalid" in $$new_props)
      $$invalidate(10, invalid = $$new_props.invalid);
    if ("label" in $$new_props)
      $$invalidate(11, label = $$new_props.label);
    if ("multiple" in $$new_props)
      $$invalidate(12, multiple = $$new_props.multiple);
    if ("name" in $$new_props)
      $$invalidate(13, name = $$new_props.name);
    if ("placeholder" in $$new_props)
      $$invalidate(14, placeholder = $$new_props.placeholder);
    if ("plaintext" in $$new_props)
      $$invalidate(23, plaintext = $$new_props.plaintext);
    if ("readonly" in $$new_props)
      $$invalidate(15, readonly = $$new_props.readonly);
    if ("size" in $$new_props)
      $$invalidate(1, size = $$new_props.size);
    if ("type" in $$new_props)
      $$invalidate(16, type = $$new_props.type);
    if ("valid" in $$new_props)
      $$invalidate(17, valid = $$new_props.valid);
    if ("value" in $$new_props)
      $$invalidate(6, value2 = $$new_props.value);
    if ("$$scope" in $$new_props)
      $$invalidate(209, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & 12780675) {
      {
        const isNotaNumber = new RegExp("\\D", "g");
        let isBtn = false;
        let formControlClass = "form-control";
        $$invalidate(19, tag = "input");
        switch (type) {
          case "color":
            formControlClass = `form-control form-control-color`;
            break;
          case "range":
            formControlClass = "form-range";
            break;
          case "select":
            formControlClass = `form-select`;
            $$invalidate(19, tag = "select");
            break;
          case "textarea":
            $$invalidate(19, tag = "textarea");
            break;
          case "button":
          case "reset":
          case "submit":
            formControlClass = `btn btn-${color || "secondary"}`;
            isBtn = true;
            break;
          case "hidden":
          case "image":
            formControlClass = void 0;
            break;
          default:
            formControlClass = "form-control";
            $$invalidate(19, tag = "input");
        }
        if (plaintext) {
          formControlClass = `${formControlClass}-plaintext`;
          $$invalidate(19, tag = "input");
        }
        if (size && isNotaNumber.test(size)) {
          console.warn(`Please use the prop "bsSize" instead of the "size" to bootstrap's input sizing.`);
          $$invalidate(0, bsSize = size);
          $$invalidate(1, size = void 0);
        }
        $$invalidate(18, classes = classnames(className, formControlClass, {
          "is-invalid": invalid,
          "is-valid": valid,
          [`form-control-${bsSize}`]: bsSize && !isBtn,
          [`btn-${bsSize}`]: bsSize && isBtn
        }));
      }
    }
  };
  return [
    bsSize,
    size,
    checked,
    files2,
    group,
    inner,
    value2,
    className,
    disabled,
    feedback,
    invalid,
    label,
    multiple,
    name,
    placeholder,
    readonly,
    type,
    valid,
    classes,
    tag,
    handleInput,
    $$restProps,
    color,
    plaintext,
    slots,
    blur_handler,
    change_handler,
    focus_handler,
    input_handler,
    keydown_handler,
    keypress_handler,
    keyup_handler,
    blur_handler_1,
    change_handler_1,
    focus_handler_1,
    input_handler_1,
    keydown_handler_1,
    keypress_handler_1,
    keyup_handler_1,
    blur_handler_2,
    change_handler_2,
    focus_handler_2,
    input_handler_2,
    keydown_handler_2,
    keypress_handler_2,
    keyup_handler_2,
    blur_handler_3,
    change_handler_3,
    focus_handler_3,
    input_handler_3,
    keydown_handler_3,
    keypress_handler_3,
    keyup_handler_3,
    blur_handler_4,
    change_handler_4,
    focus_handler_4,
    input_handler_4,
    keydown_handler_4,
    keypress_handler_4,
    keyup_handler_4,
    blur_handler_6,
    change_handler_6,
    focus_handler_6,
    input_handler_6,
    keydown_handler_6,
    keypress_handler_6,
    keyup_handler_6,
    blur_handler_7,
    change_handler_7,
    focus_handler_7,
    input_handler_7,
    keydown_handler_7,
    keypress_handler_7,
    keyup_handler_7,
    blur_handler_8,
    change_handler_8,
    focus_handler_8,
    input_handler_8,
    keydown_handler_8,
    keypress_handler_8,
    keyup_handler_8,
    blur_handler_9,
    change_handler_9,
    focus_handler_9,
    input_handler_9,
    keydown_handler_9,
    keypress_handler_9,
    keyup_handler_9,
    blur_handler_10,
    change_handler_10,
    focus_handler_10,
    input_handler_10,
    keydown_handler_10,
    keypress_handler_10,
    keyup_handler_10,
    blur_handler_11,
    change_handler_11,
    focus_handler_11,
    input_handler_11,
    keydown_handler_11,
    keypress_handler_11,
    keyup_handler_11,
    blur_handler_12,
    change_handler_12,
    focus_handler_12,
    input_handler_12,
    keydown_handler_12,
    keypress_handler_12,
    keyup_handler_12,
    blur_handler_13,
    change_handler_13,
    focus_handler_13,
    input_handler_13,
    keydown_handler_13,
    keypress_handler_13,
    keyup_handler_13,
    blur_handler_14,
    change_handler_14,
    focus_handler_14,
    input_handler_14,
    keydown_handler_14,
    keypress_handler_14,
    keyup_handler_14,
    blur_handler_15,
    change_handler_15,
    focus_handler_15,
    input_handler_15,
    keydown_handler_15,
    keypress_handler_15,
    keyup_handler_15,
    blur_handler_16,
    change_handler_16,
    focus_handler_16,
    input_handler_16,
    keydown_handler_16,
    keypress_handler_16,
    keyup_handler_16,
    blur_handler_17,
    change_handler_17,
    focus_handler_17,
    input_handler_17,
    keydown_handler_17,
    keypress_handler_17,
    keyup_handler_17,
    blur_handler_18,
    focus_handler_18,
    keydown_handler_18,
    keypress_handler_18,
    keyup_handler_18,
    blur_handler_19,
    change_handler_18,
    focus_handler_19,
    input_handler_18,
    keydown_handler_19,
    keypress_handler_19,
    keyup_handler_19,
    blur_handler_20,
    change_handler_19,
    focus_handler_20,
    input_handler_19,
    input_input_handler,
    input_binding,
    input_input_handler_1,
    input_binding_1,
    input_input_handler_2,
    input_binding_2,
    input_input_handler_3,
    input_binding_3,
    input_change_handler,
    input_binding_4,
    formcheck_checked_binding,
    formcheck_inner_binding,
    formcheck_group_binding,
    formcheck_value_binding,
    blur_handler_5,
    change_handler_5,
    focus_handler_5,
    input_handler_5,
    keydown_handler_5,
    keypress_handler_5,
    keyup_handler_5,
    input_input_handler_4,
    input_binding_5,
    input_input_handler_5,
    input_binding_6,
    input_input_handler_6,
    input_binding_7,
    input_input_handler_7,
    input_binding_8,
    input_input_handler_8,
    input_binding_9,
    input_input_handler_9,
    input_binding_10,
    input_input_handler_10,
    input_binding_11,
    input_input_handler_11,
    input_binding_12,
    input_change_input_handler,
    input_binding_13,
    input_input_handler_12,
    input_binding_14,
    input_input_handler_13,
    input_binding_15,
    input_input_handler_14,
    input_binding_16,
    textarea_input_handler,
    textarea_binding,
    select_change_handler,
    select_binding,
    $$scope
  ];
}
var Input = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$7, create_fragment$7, safe_not_equal, {
      class: 7,
      bsSize: 0,
      checked: 2,
      color: 22,
      disabled: 8,
      feedback: 9,
      files: 3,
      group: 4,
      inner: 5,
      invalid: 10,
      label: 11,
      multiple: 12,
      name: 13,
      placeholder: 14,
      plaintext: 23,
      readonly: 15,
      size: 1,
      type: 16,
      valid: 17,
      value: 6
    }, null, [-1, -1, -1, -1, -1, -1, -1]);
  }
};
function create_fragment$8(ctx) {
  let div;
  let current;
  const default_slot_template = ctx[5].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[4], null);
  let div_levels = [ctx[1], {class: ctx[0]}];
  let div_data = {};
  for (let i = 0; i < div_levels.length; i += 1) {
    div_data = assign(div_data, div_levels[i]);
  }
  return {
    c() {
      div = element("div");
      if (default_slot)
        default_slot.c();
      set_attributes(div, div_data);
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if (default_slot) {
        default_slot.m(div, null);
      }
      current = true;
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 16)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[4], !current ? get_all_dirty_from_scope(ctx2[4]) : get_slot_changes(default_slot_template, ctx2[4], dirty, null), null);
        }
      }
      set_attributes(div, div_data = get_spread_update(div_levels, [
        dirty & 2 && ctx2[1],
        (!current || dirty & 1) && {class: ctx2[0]}
      ]));
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function instance$8($$self, $$props, $$invalidate) {
  let classes;
  const omit_props_names = ["class", "size"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let {$$slots: slots = {}, $$scope} = $$props;
  let {class: className = ""} = $$props;
  let {size = ""} = $$props;
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("class" in $$new_props)
      $$invalidate(2, className = $$new_props.class);
    if ("size" in $$new_props)
      $$invalidate(3, size = $$new_props.size);
    if ("$$scope" in $$new_props)
      $$invalidate(4, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 12) {
      $$invalidate(0, classes = classnames(className, "input-group", size ? `input-group-${size}` : null));
    }
  };
  return [classes, $$restProps, className, size, $$scope, slots];
}
var InputGroup = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$8, create_fragment$8, safe_not_equal, {class: 2, size: 3});
  }
};
function create_fragment$9(ctx) {
  let span;
  let current;
  const default_slot_template = ctx[4].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[3], null);
  let span_levels = [ctx[1], {class: ctx[0]}];
  let span_data = {};
  for (let i = 0; i < span_levels.length; i += 1) {
    span_data = assign(span_data, span_levels[i]);
  }
  return {
    c() {
      span = element("span");
      if (default_slot)
        default_slot.c();
      set_attributes(span, span_data);
    },
    m(target, anchor) {
      insert(target, span, anchor);
      if (default_slot) {
        default_slot.m(span, null);
      }
      current = true;
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 8)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[3], !current ? get_all_dirty_from_scope(ctx2[3]) : get_slot_changes(default_slot_template, ctx2[3], dirty, null), null);
        }
      }
      set_attributes(span, span_data = get_spread_update(span_levels, [
        dirty & 2 && ctx2[1],
        (!current || dirty & 1) && {class: ctx2[0]}
      ]));
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(span);
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function instance$9($$self, $$props, $$invalidate) {
  let classes;
  const omit_props_names = ["class"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let {$$slots: slots = {}, $$scope} = $$props;
  let {class: className = ""} = $$props;
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("class" in $$new_props)
      $$invalidate(2, className = $$new_props.class);
    if ("$$scope" in $$new_props)
      $$invalidate(3, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 4) {
      $$invalidate(0, classes = classnames(className, "input-group-text"));
    }
  };
  return [classes, $$restProps, className, $$scope, slots];
}
var InputGroupText = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$9, create_fragment$9, safe_not_equal, {class: 2});
  }
};
function create_fragment$a(ctx) {
  let label;
  let current;
  const default_slot_template = ctx[15].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[14], null);
  let label_levels = [
    ctx[2],
    {class: ctx[1]},
    {for: ctx[0]}
  ];
  let label_data = {};
  for (let i = 0; i < label_levels.length; i += 1) {
    label_data = assign(label_data, label_levels[i]);
  }
  return {
    c() {
      label = element("label");
      if (default_slot)
        default_slot.c();
      set_attributes(label, label_data);
    },
    m(target, anchor) {
      insert(target, label, anchor);
      if (default_slot) {
        default_slot.m(label, null);
      }
      current = true;
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 16384)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[14], !current ? get_all_dirty_from_scope(ctx2[14]) : get_slot_changes(default_slot_template, ctx2[14], dirty, null), null);
        }
      }
      set_attributes(label, label_data = get_spread_update(label_levels, [
        dirty & 4 && ctx2[2],
        (!current || dirty & 2) && {class: ctx2[1]},
        (!current || dirty & 1) && {for: ctx2[0]}
      ]));
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(label);
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function instance$a($$self, $$props, $$invalidate) {
  let classes;
  const omit_props_names = ["class", "hidden", "check", "size", "for", "xs", "sm", "md", "lg", "xl", "xxl", "widths"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let {$$slots: slots = {}, $$scope} = $$props;
  let {class: className = ""} = $$props;
  let {hidden = false} = $$props;
  let {check = false} = $$props;
  let {size = ""} = $$props;
  let {for: fore = null} = $$props;
  let {xs = ""} = $$props;
  let {sm = ""} = $$props;
  let {md = ""} = $$props;
  let {lg = ""} = $$props;
  let {xl = ""} = $$props;
  let {xxl = ""} = $$props;
  const colWidths = {xs, sm, md, lg, xl, xxl};
  let {widths = Object.keys(colWidths)} = $$props;
  const colClasses = [];
  widths.forEach((colWidth) => {
    let columnProp = $$props[colWidth];
    if (!columnProp && columnProp !== "") {
      return;
    }
    const isXs = colWidth === "xs";
    let colClass;
    if (isObject(columnProp)) {
      const colSizeInterfix = isXs ? "-" : `-${colWidth}-`;
      colClass = getColumnSizeClass(isXs, colWidth, columnProp.size);
      colClasses.push(classnames({
        [colClass]: columnProp.size || columnProp.size === "",
        [`order${colSizeInterfix}${columnProp.order}`]: columnProp.order || columnProp.order === 0,
        [`offset${colSizeInterfix}${columnProp.offset}`]: columnProp.offset || columnProp.offset === 0
      }));
    } else {
      colClass = getColumnSizeClass(isXs, colWidth, columnProp);
      colClasses.push(colClass);
    }
  });
  $$self.$$set = ($$new_props) => {
    $$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    $$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("class" in $$new_props)
      $$invalidate(3, className = $$new_props.class);
    if ("hidden" in $$new_props)
      $$invalidate(4, hidden = $$new_props.hidden);
    if ("check" in $$new_props)
      $$invalidate(5, check = $$new_props.check);
    if ("size" in $$new_props)
      $$invalidate(6, size = $$new_props.size);
    if ("for" in $$new_props)
      $$invalidate(0, fore = $$new_props.for);
    if ("xs" in $$new_props)
      $$invalidate(7, xs = $$new_props.xs);
    if ("sm" in $$new_props)
      $$invalidate(8, sm = $$new_props.sm);
    if ("md" in $$new_props)
      $$invalidate(9, md = $$new_props.md);
    if ("lg" in $$new_props)
      $$invalidate(10, lg = $$new_props.lg);
    if ("xl" in $$new_props)
      $$invalidate(11, xl = $$new_props.xl);
    if ("xxl" in $$new_props)
      $$invalidate(12, xxl = $$new_props.xxl);
    if ("widths" in $$new_props)
      $$invalidate(13, widths = $$new_props.widths);
    if ("$$scope" in $$new_props)
      $$invalidate(14, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 120) {
      $$invalidate(1, classes = classnames(className, hidden ? "visually-hidden" : false, check ? "form-check-label" : false, size ? `col-form-label-${size}` : false, colClasses, colClasses.length ? "col-form-label" : "form-label"));
    }
  };
  $$props = exclude_internal_props($$props);
  return [
    fore,
    classes,
    $$restProps,
    className,
    hidden,
    check,
    size,
    xs,
    sm,
    md,
    lg,
    xl,
    xxl,
    widths,
    $$scope,
    slots
  ];
}
var Label = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$a, create_fragment$a, safe_not_equal, {
      class: 3,
      hidden: 4,
      check: 5,
      size: 6,
      for: 0,
      xs: 7,
      sm: 8,
      md: 9,
      lg: 10,
      xl: 11,
      xxl: 12,
      widths: 13
    });
  }
};
function create_else_block$4(ctx) {
  let ul;
  let current;
  const default_slot_template = ctx[6].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[5], null);
  let ul_levels = [ctx[2], {class: ctx[1]}];
  let ul_data = {};
  for (let i = 0; i < ul_levels.length; i += 1) {
    ul_data = assign(ul_data, ul_levels[i]);
  }
  return {
    c() {
      ul = element("ul");
      if (default_slot)
        default_slot.c();
      set_attributes(ul, ul_data);
    },
    m(target, anchor) {
      insert(target, ul, anchor);
      if (default_slot) {
        default_slot.m(ul, null);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 32)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[5], !current ? get_all_dirty_from_scope(ctx2[5]) : get_slot_changes(default_slot_template, ctx2[5], dirty, null), null);
        }
      }
      set_attributes(ul, ul_data = get_spread_update(ul_levels, [
        dirty & 4 && ctx2[2],
        (!current || dirty & 2) && {class: ctx2[1]}
      ]));
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(ul);
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_if_block$4(ctx) {
  let ol;
  let current;
  const default_slot_template = ctx[6].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[5], null);
  let ol_levels = [ctx[2], {class: ctx[1]}];
  let ol_data = {};
  for (let i = 0; i < ol_levels.length; i += 1) {
    ol_data = assign(ol_data, ol_levels[i]);
  }
  return {
    c() {
      ol = element("ol");
      if (default_slot)
        default_slot.c();
      set_attributes(ol, ol_data);
    },
    m(target, anchor) {
      insert(target, ol, anchor);
      if (default_slot) {
        default_slot.m(ol, null);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 32)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[5], !current ? get_all_dirty_from_scope(ctx2[5]) : get_slot_changes(default_slot_template, ctx2[5], dirty, null), null);
        }
      }
      set_attributes(ol, ol_data = get_spread_update(ol_levels, [
        dirty & 4 && ctx2[2],
        (!current || dirty & 2) && {class: ctx2[1]}
      ]));
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(ol);
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$b(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block$4, create_else_block$4];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (ctx2[0])
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if_blocks[current_block_type_index].d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
function instance$b($$self, $$props, $$invalidate) {
  let classes;
  const omit_props_names = ["class", "flush", "numbered"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let {$$slots: slots = {}, $$scope} = $$props;
  let {class: className = ""} = $$props;
  let {flush: flush2 = false} = $$props;
  let {numbered = false} = $$props;
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("class" in $$new_props)
      $$invalidate(3, className = $$new_props.class);
    if ("flush" in $$new_props)
      $$invalidate(4, flush2 = $$new_props.flush);
    if ("numbered" in $$new_props)
      $$invalidate(0, numbered = $$new_props.numbered);
    if ("$$scope" in $$new_props)
      $$invalidate(5, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 25) {
      $$invalidate(1, classes = classnames(className, "list-group", {
        "list-group-flush": flush2,
        "list-group-numbered": numbered
      }));
    }
  };
  return [numbered, classes, $$restProps, className, flush2, $$scope, slots];
}
var ListGroup = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$b, create_fragment$b, safe_not_equal, {class: 3, flush: 4, numbered: 0});
  }
};
function create_else_block$5(ctx) {
  let li;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = ctx[10].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[9], null);
  let li_levels = [
    ctx[5],
    {class: ctx[4]},
    {disabled: ctx[1]},
    {active: ctx[0]}
  ];
  let li_data = {};
  for (let i = 0; i < li_levels.length; i += 1) {
    li_data = assign(li_data, li_levels[i]);
  }
  return {
    c() {
      li = element("li");
      if (default_slot)
        default_slot.c();
      set_attributes(li, li_data);
    },
    m(target, anchor) {
      insert(target, li, anchor);
      if (default_slot) {
        default_slot.m(li, null);
      }
      current = true;
      if (!mounted) {
        dispose = listen(li, "click", ctx[13]);
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 512)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[9], !current ? get_all_dirty_from_scope(ctx2[9]) : get_slot_changes(default_slot_template, ctx2[9], dirty, null), null);
        }
      }
      set_attributes(li, li_data = get_spread_update(li_levels, [
        dirty & 32 && ctx2[5],
        (!current || dirty & 16) && {class: ctx2[4]},
        (!current || dirty & 2) && {disabled: ctx2[1]},
        (!current || dirty & 1) && {active: ctx2[0]}
      ]));
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(li);
      if (default_slot)
        default_slot.d(detaching);
      mounted = false;
      dispose();
    }
  };
}
function create_if_block_1$4(ctx) {
  let button;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = ctx[10].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[9], null);
  let button_levels = [
    ctx[5],
    {class: ctx[4]},
    {type: "button"},
    {disabled: ctx[1]},
    {active: ctx[0]}
  ];
  let button_data = {};
  for (let i = 0; i < button_levels.length; i += 1) {
    button_data = assign(button_data, button_levels[i]);
  }
  return {
    c() {
      button = element("button");
      if (default_slot)
        default_slot.c();
      set_attributes(button, button_data);
    },
    m(target, anchor) {
      insert(target, button, anchor);
      if (default_slot) {
        default_slot.m(button, null);
      }
      if (button.autofocus)
        button.focus();
      current = true;
      if (!mounted) {
        dispose = listen(button, "click", ctx[12]);
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 512)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[9], !current ? get_all_dirty_from_scope(ctx2[9]) : get_slot_changes(default_slot_template, ctx2[9], dirty, null), null);
        }
      }
      set_attributes(button, button_data = get_spread_update(button_levels, [
        dirty & 32 && ctx2[5],
        (!current || dirty & 16) && {class: ctx2[4]},
        {type: "button"},
        (!current || dirty & 2) && {disabled: ctx2[1]},
        (!current || dirty & 1) && {active: ctx2[0]}
      ]));
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(button);
      if (default_slot)
        default_slot.d(detaching);
      mounted = false;
      dispose();
    }
  };
}
function create_if_block$5(ctx) {
  let a;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = ctx[10].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[9], null);
  let a_levels = [
    ctx[5],
    {class: ctx[4]},
    {href: ctx[2]},
    {disabled: ctx[1]},
    {active: ctx[0]}
  ];
  let a_data = {};
  for (let i = 0; i < a_levels.length; i += 1) {
    a_data = assign(a_data, a_levels[i]);
  }
  return {
    c() {
      a = element("a");
      if (default_slot)
        default_slot.c();
      set_attributes(a, a_data);
    },
    m(target, anchor) {
      insert(target, a, anchor);
      if (default_slot) {
        default_slot.m(a, null);
      }
      current = true;
      if (!mounted) {
        dispose = listen(a, "click", ctx[11]);
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 512)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[9], !current ? get_all_dirty_from_scope(ctx2[9]) : get_slot_changes(default_slot_template, ctx2[9], dirty, null), null);
        }
      }
      set_attributes(a, a_data = get_spread_update(a_levels, [
        dirty & 32 && ctx2[5],
        (!current || dirty & 16) && {class: ctx2[4]},
        (!current || dirty & 4) && {href: ctx2[2]},
        (!current || dirty & 2) && {disabled: ctx2[1]},
        (!current || dirty & 1) && {active: ctx2[0]}
      ]));
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(a);
      if (default_slot)
        default_slot.d(detaching);
      mounted = false;
      dispose();
    }
  };
}
function create_fragment$c(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block$5, create_if_block_1$4, create_else_block$5];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (ctx2[2])
      return 0;
    if (ctx2[3] === "button")
      return 1;
    return 2;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if_blocks[current_block_type_index].d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
function instance$c($$self, $$props, $$invalidate) {
  let classes;
  const omit_props_names = ["class", "active", "disabled", "color", "action", "href", "tag"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let {$$slots: slots = {}, $$scope} = $$props;
  let {class: className = ""} = $$props;
  let {active = false} = $$props;
  let {disabled = false} = $$props;
  let {color = ""} = $$props;
  let {action = false} = $$props;
  let {href = null} = $$props;
  let {tag = null} = $$props;
  function click_handler(event) {
    bubble.call(this, $$self, event);
  }
  function click_handler_1(event) {
    bubble.call(this, $$self, event);
  }
  function click_handler_2(event) {
    bubble.call(this, $$self, event);
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(5, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("class" in $$new_props)
      $$invalidate(6, className = $$new_props.class);
    if ("active" in $$new_props)
      $$invalidate(0, active = $$new_props.active);
    if ("disabled" in $$new_props)
      $$invalidate(1, disabled = $$new_props.disabled);
    if ("color" in $$new_props)
      $$invalidate(7, color = $$new_props.color);
    if ("action" in $$new_props)
      $$invalidate(8, action = $$new_props.action);
    if ("href" in $$new_props)
      $$invalidate(2, href = $$new_props.href);
    if ("tag" in $$new_props)
      $$invalidate(3, tag = $$new_props.tag);
    if ("$$scope" in $$new_props)
      $$invalidate(9, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 459) {
      $$invalidate(4, classes = classnames(className, "list-group-item", {
        active,
        disabled,
        "list-group-item-action": action || tag === "button",
        [`list-group-item-${color}`]: color
      }));
    }
  };
  return [
    active,
    disabled,
    href,
    tag,
    classes,
    $$restProps,
    className,
    color,
    action,
    $$scope,
    slots,
    click_handler,
    click_handler_1,
    click_handler_2
  ];
}
var ListGroupItem = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$c, create_fragment$c, safe_not_equal, {
      class: 6,
      active: 0,
      disabled: 1,
      color: 7,
      action: 8,
      href: 2,
      tag: 3
    });
  }
};
function create_fragment$d(ctx) {
  let ul;
  let current;
  const default_slot_template = ctx[12].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[11], null);
  let ul_levels = [ctx[1], {class: ctx[0]}];
  let ul_data = {};
  for (let i = 0; i < ul_levels.length; i += 1) {
    ul_data = assign(ul_data, ul_levels[i]);
  }
  return {
    c() {
      ul = element("ul");
      if (default_slot)
        default_slot.c();
      set_attributes(ul, ul_data);
    },
    m(target, anchor) {
      insert(target, ul, anchor);
      if (default_slot) {
        default_slot.m(ul, null);
      }
      current = true;
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 2048)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[11], !current ? get_all_dirty_from_scope(ctx2[11]) : get_slot_changes(default_slot_template, ctx2[11], dirty, null), null);
        }
      }
      set_attributes(ul, ul_data = get_spread_update(ul_levels, [
        dirty & 2 && ctx2[1],
        (!current || dirty & 1) && {class: ctx2[0]}
      ]));
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(ul);
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function getVerticalClass(vertical) {
  if (vertical === false) {
    return false;
  } else if (vertical === true || vertical === "xs") {
    return "flex-column";
  }
  return `flex-${vertical}-column`;
}
function instance$d($$self, $$props, $$invalidate) {
  let classes;
  const omit_props_names = [
    "class",
    "tabs",
    "pills",
    "vertical",
    "horizontal",
    "justified",
    "fill",
    "navbar",
    "card"
  ];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let {$$slots: slots = {}, $$scope} = $$props;
  let {class: className = ""} = $$props;
  let {tabs = false} = $$props;
  let {pills = false} = $$props;
  let {vertical = false} = $$props;
  let {horizontal = ""} = $$props;
  let {justified = false} = $$props;
  let {fill = false} = $$props;
  let {navbar = false} = $$props;
  let {card = false} = $$props;
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("class" in $$new_props)
      $$invalidate(2, className = $$new_props.class);
    if ("tabs" in $$new_props)
      $$invalidate(3, tabs = $$new_props.tabs);
    if ("pills" in $$new_props)
      $$invalidate(4, pills = $$new_props.pills);
    if ("vertical" in $$new_props)
      $$invalidate(5, vertical = $$new_props.vertical);
    if ("horizontal" in $$new_props)
      $$invalidate(6, horizontal = $$new_props.horizontal);
    if ("justified" in $$new_props)
      $$invalidate(7, justified = $$new_props.justified);
    if ("fill" in $$new_props)
      $$invalidate(8, fill = $$new_props.fill);
    if ("navbar" in $$new_props)
      $$invalidate(9, navbar = $$new_props.navbar);
    if ("card" in $$new_props)
      $$invalidate(10, card = $$new_props.card);
    if ("$$scope" in $$new_props)
      $$invalidate(11, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 2044) {
      $$invalidate(0, classes = classnames(className, navbar ? "navbar-nav" : "nav", horizontal ? `justify-content-${horizontal}` : false, getVerticalClass(vertical), {
        "nav-tabs": tabs,
        "card-header-tabs": card && tabs,
        "nav-pills": pills,
        "card-header-pills": card && pills,
        "nav-justified": justified,
        "nav-fill": fill
      }));
    }
  };
  return [
    classes,
    $$restProps,
    className,
    tabs,
    pills,
    vertical,
    horizontal,
    justified,
    fill,
    navbar,
    card,
    $$scope,
    slots
  ];
}
var Nav = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$d, create_fragment$d, safe_not_equal, {
      class: 2,
      tabs: 3,
      pills: 4,
      vertical: 5,
      horizontal: 6,
      justified: 7,
      fill: 8,
      navbar: 9,
      card: 10
    });
  }
};
function create_else_block$6(ctx) {
  let current;
  const default_slot_template = ctx[10].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[11], null);
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 2048)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[11], !current ? get_all_dirty_from_scope(ctx2[11]) : get_slot_changes(default_slot_template, ctx2[11], dirty, null), null);
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_if_block$6(ctx) {
  let container_1;
  let current;
  container_1 = new Container({
    props: {
      fluid: ctx[0] === "fluid",
      $$slots: {default: [create_default_slot$1]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      create_component(container_1.$$.fragment);
    },
    m(target, anchor) {
      mount_component(container_1, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const container_1_changes = {};
      if (dirty & 1)
        container_1_changes.fluid = ctx2[0] === "fluid";
      if (dirty & 2048) {
        container_1_changes.$$scope = {dirty, ctx: ctx2};
      }
      container_1.$set(container_1_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(container_1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(container_1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(container_1, detaching);
    }
  };
}
function create_default_slot$1(ctx) {
  let current;
  const default_slot_template = ctx[10].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[11], null);
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 2048)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[11], !current ? get_all_dirty_from_scope(ctx2[11]) : get_slot_changes(default_slot_template, ctx2[11], dirty, null), null);
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$e(ctx) {
  let nav;
  let current_block_type_index;
  let if_block;
  let current;
  const if_block_creators = [create_if_block$6, create_else_block$6];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (ctx2[0])
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  let nav_levels = [ctx[2], {class: ctx[1]}];
  let nav_data = {};
  for (let i = 0; i < nav_levels.length; i += 1) {
    nav_data = assign(nav_data, nav_levels[i]);
  }
  return {
    c() {
      nav = element("nav");
      if_block.c();
      set_attributes(nav, nav_data);
    },
    m(target, anchor) {
      insert(target, nav, anchor);
      if_blocks[current_block_type_index].m(nav, null);
      current = true;
    },
    p(ctx2, [dirty]) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(nav, null);
      }
      set_attributes(nav, nav_data = get_spread_update(nav_levels, [
        dirty & 4 && ctx2[2],
        (!current || dirty & 2) && {class: ctx2[1]}
      ]));
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(nav);
      if_blocks[current_block_type_index].d();
    }
  };
}
function getExpandClass(expand) {
  if (expand === false) {
    return false;
  } else if (expand === true || expand === "xs") {
    return "navbar-expand";
  }
  return `navbar-expand-${expand}`;
}
function instance$e($$self, $$props, $$invalidate) {
  let classes;
  const omit_props_names = ["class", "container", "color", "dark", "expand", "fixed", "light", "sticky"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let {$$slots: slots = {}, $$scope} = $$props;
  setContext("navbar", {inNavbar: true});
  let {class: className = ""} = $$props;
  let {container = "fluid"} = $$props;
  let {color = ""} = $$props;
  let {dark = false} = $$props;
  let {expand = ""} = $$props;
  let {fixed = ""} = $$props;
  let {light = false} = $$props;
  let {sticky = ""} = $$props;
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("class" in $$new_props)
      $$invalidate(3, className = $$new_props.class);
    if ("container" in $$new_props)
      $$invalidate(0, container = $$new_props.container);
    if ("color" in $$new_props)
      $$invalidate(4, color = $$new_props.color);
    if ("dark" in $$new_props)
      $$invalidate(5, dark = $$new_props.dark);
    if ("expand" in $$new_props)
      $$invalidate(6, expand = $$new_props.expand);
    if ("fixed" in $$new_props)
      $$invalidate(7, fixed = $$new_props.fixed);
    if ("light" in $$new_props)
      $$invalidate(8, light = $$new_props.light);
    if ("sticky" in $$new_props)
      $$invalidate(9, sticky = $$new_props.sticky);
    if ("$$scope" in $$new_props)
      $$invalidate(11, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 1016) {
      $$invalidate(1, classes = classnames(className, "navbar", getExpandClass(expand), {
        "navbar-light": light,
        "navbar-dark": dark,
        [`bg-${color}`]: color,
        [`fixed-${fixed}`]: fixed,
        [`sticky-${sticky}`]: sticky
      }));
    }
  };
  return [
    container,
    classes,
    $$restProps,
    className,
    color,
    dark,
    expand,
    fixed,
    light,
    sticky,
    slots,
    $$scope
  ];
}
var Navbar = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$e, create_fragment$e, safe_not_equal, {
      class: 3,
      container: 0,
      color: 4,
      dark: 5,
      expand: 6,
      fixed: 7,
      light: 8,
      sticky: 9
    });
  }
};
function create_fragment$f(ctx) {
  let li;
  let current;
  const default_slot_template = ctx[5].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[4], null);
  let li_levels = [ctx[1], {class: ctx[0]}];
  let li_data = {};
  for (let i = 0; i < li_levels.length; i += 1) {
    li_data = assign(li_data, li_levels[i]);
  }
  return {
    c() {
      li = element("li");
      if (default_slot)
        default_slot.c();
      set_attributes(li, li_data);
    },
    m(target, anchor) {
      insert(target, li, anchor);
      if (default_slot) {
        default_slot.m(li, null);
      }
      current = true;
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 16)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[4], !current ? get_all_dirty_from_scope(ctx2[4]) : get_slot_changes(default_slot_template, ctx2[4], dirty, null), null);
        }
      }
      set_attributes(li, li_data = get_spread_update(li_levels, [
        dirty & 2 && ctx2[1],
        (!current || dirty & 1) && {class: ctx2[0]}
      ]));
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(li);
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function instance$f($$self, $$props, $$invalidate) {
  let classes;
  const omit_props_names = ["class", "active"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let {$$slots: slots = {}, $$scope} = $$props;
  let {class: className = ""} = $$props;
  let {active = false} = $$props;
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("class" in $$new_props)
      $$invalidate(2, className = $$new_props.class);
    if ("active" in $$new_props)
      $$invalidate(3, active = $$new_props.active);
    if ("$$scope" in $$new_props)
      $$invalidate(4, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 12) {
      $$invalidate(0, classes = classnames(className, "nav-item", active ? "active" : false));
    }
  };
  return [classes, $$restProps, className, active, $$scope, slots];
}
var NavItem = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$f, create_fragment$f, safe_not_equal, {class: 2, active: 3});
  }
};
function create_fragment$g(ctx) {
  let a;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = ctx[8].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[7], null);
  let a_levels = [
    ctx[3],
    {href: ctx[0]},
    {class: ctx[1]}
  ];
  let a_data = {};
  for (let i = 0; i < a_levels.length; i += 1) {
    a_data = assign(a_data, a_levels[i]);
  }
  return {
    c() {
      a = element("a");
      if (default_slot)
        default_slot.c();
      set_attributes(a, a_data);
    },
    m(target, anchor) {
      insert(target, a, anchor);
      if (default_slot) {
        default_slot.m(a, null);
      }
      current = true;
      if (!mounted) {
        dispose = [
          listen(a, "click", ctx[9]),
          listen(a, "click", ctx[2])
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 128)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[7], !current ? get_all_dirty_from_scope(ctx2[7]) : get_slot_changes(default_slot_template, ctx2[7], dirty, null), null);
        }
      }
      set_attributes(a, a_data = get_spread_update(a_levels, [
        dirty & 8 && ctx2[3],
        (!current || dirty & 1) && {href: ctx2[0]},
        (!current || dirty & 2) && {class: ctx2[1]}
      ]));
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(a);
      if (default_slot)
        default_slot.d(detaching);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$g($$self, $$props, $$invalidate) {
  let classes;
  const omit_props_names = ["class", "disabled", "active", "href"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let {$$slots: slots = {}, $$scope} = $$props;
  let {class: className = ""} = $$props;
  let {disabled = false} = $$props;
  let {active = false} = $$props;
  let {href = "#"} = $$props;
  function handleClick(e) {
    if (disabled) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }
    if (href === "#") {
      e.preventDefault();
    }
  }
  function click_handler(event) {
    bubble.call(this, $$self, event);
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("class" in $$new_props)
      $$invalidate(4, className = $$new_props.class);
    if ("disabled" in $$new_props)
      $$invalidate(5, disabled = $$new_props.disabled);
    if ("active" in $$new_props)
      $$invalidate(6, active = $$new_props.active);
    if ("href" in $$new_props)
      $$invalidate(0, href = $$new_props.href);
    if ("$$scope" in $$new_props)
      $$invalidate(7, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 112) {
      $$invalidate(1, classes = classnames(className, "nav-link", {disabled, active}));
    }
  };
  return [
    href,
    classes,
    handleClick,
    $$restProps,
    className,
    disabled,
    active,
    $$scope,
    slots,
    click_handler
  ];
}
var NavLink = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$g, create_fragment$g, safe_not_equal, {
      class: 4,
      disabled: 5,
      active: 6,
      href: 0
    });
  }
};
function create_fragment$h(ctx) {
  let a;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = ctx[5].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[4], null);
  let a_levels = [
    ctx[2],
    {class: ctx[1]},
    {href: ctx[0]}
  ];
  let a_data = {};
  for (let i = 0; i < a_levels.length; i += 1) {
    a_data = assign(a_data, a_levels[i]);
  }
  return {
    c() {
      a = element("a");
      if (default_slot)
        default_slot.c();
      set_attributes(a, a_data);
    },
    m(target, anchor) {
      insert(target, a, anchor);
      if (default_slot) {
        default_slot.m(a, null);
      }
      current = true;
      if (!mounted) {
        dispose = listen(a, "click", ctx[6]);
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 16)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[4], !current ? get_all_dirty_from_scope(ctx2[4]) : get_slot_changes(default_slot_template, ctx2[4], dirty, null), null);
        }
      }
      set_attributes(a, a_data = get_spread_update(a_levels, [
        dirty & 4 && ctx2[2],
        (!current || dirty & 2) && {class: ctx2[1]},
        (!current || dirty & 1) && {href: ctx2[0]}
      ]));
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(a);
      if (default_slot)
        default_slot.d(detaching);
      mounted = false;
      dispose();
    }
  };
}
function instance$h($$self, $$props, $$invalidate) {
  let classes;
  const omit_props_names = ["class", "href"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let {$$slots: slots = {}, $$scope} = $$props;
  let {class: className = ""} = $$props;
  let {href = "/"} = $$props;
  function click_handler(event) {
    bubble.call(this, $$self, event);
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("class" in $$new_props)
      $$invalidate(3, className = $$new_props.class);
    if ("href" in $$new_props)
      $$invalidate(0, href = $$new_props.href);
    if ("$$scope" in $$new_props)
      $$invalidate(4, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 8) {
      $$invalidate(1, classes = classnames(className, "navbar-brand"));
    }
  };
  return [href, classes, $$restProps, className, $$scope, slots, click_handler];
}
var NavbarBrand = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$h, create_fragment$h, safe_not_equal, {class: 3, href: 0});
  }
};
function create_fragment$i(ctx) {
  let div;
  let current;
  const default_slot_template = ctx[8].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[7], null);
  let div_levels = [ctx[2], {class: ctx[1]}];
  let div_data = {};
  for (let i = 0; i < div_levels.length; i += 1) {
    div_data = assign(div_data, div_levels[i]);
  }
  return {
    c() {
      div = element("div");
      if (default_slot)
        default_slot.c();
      set_attributes(div, div_data);
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if (default_slot) {
        default_slot.m(div, null);
      }
      ctx[9](div);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 128)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[7], !current ? get_all_dirty_from_scope(ctx2[7]) : get_slot_changes(default_slot_template, ctx2[7], dirty, null), null);
        }
      }
      set_attributes(div, div_data = get_spread_update(div_levels, [
        dirty & 4 && ctx2[2],
        (!current || dirty & 2) && {class: ctx2[1]}
      ]));
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (default_slot)
        default_slot.d(detaching);
      ctx[9](null);
    }
  };
}
function getCols(cols) {
  const colsValue = parseInt(cols);
  if (!isNaN(colsValue)) {
    if (colsValue > 0) {
      return [`row-cols-${colsValue}`];
    }
  } else if (typeof cols === "object") {
    return ["xs", "sm", "md", "lg", "xl"].map((colWidth) => {
      const isXs = colWidth === "xs";
      const colSizeInterfix = isXs ? "-" : `-${colWidth}-`;
      const value2 = cols[colWidth];
      if (typeof value2 === "number" && value2 > 0) {
        return `row-cols${colSizeInterfix}${value2}`;
      }
      return null;
    }).filter((value2) => !!value2);
  }
  return [];
}
function instance$i($$self, $$props, $$invalidate) {
  let classes;
  const omit_props_names = ["class", "noGutters", "form", "cols", "inner"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let {$$slots: slots = {}, $$scope} = $$props;
  let {class: className = ""} = $$props;
  let {noGutters = false} = $$props;
  let {form = false} = $$props;
  let {cols = 0} = $$props;
  let {inner = void 0} = $$props;
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      inner = $$value;
      $$invalidate(0, inner);
    });
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("class" in $$new_props)
      $$invalidate(3, className = $$new_props.class);
    if ("noGutters" in $$new_props)
      $$invalidate(4, noGutters = $$new_props.noGutters);
    if ("form" in $$new_props)
      $$invalidate(5, form = $$new_props.form);
    if ("cols" in $$new_props)
      $$invalidate(6, cols = $$new_props.cols);
    if ("inner" in $$new_props)
      $$invalidate(0, inner = $$new_props.inner);
    if ("$$scope" in $$new_props)
      $$invalidate(7, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 120) {
      $$invalidate(1, classes = classnames(className, noGutters ? "gx-0" : null, form ? "form-row" : "row", ...getCols(cols)));
    }
  };
  return [
    inner,
    classes,
    $$restProps,
    className,
    noGutters,
    form,
    cols,
    $$scope,
    slots,
    div_binding
  ];
}
var Row = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$i, create_fragment$i, safe_not_equal, {
      class: 3,
      noGutters: 4,
      form: 5,
      cols: 6,
      inner: 0
    });
  }
};
function create_default_slot$2(ctx) {
  let current;
  const default_slot_template = ctx[1].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[2], null);
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 4)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[2], !current ? get_all_dirty_from_scope(ctx2[2]) : get_slot_changes(default_slot_template, ctx2[2], dirty, null), null);
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$j(ctx) {
  let nav;
  let current;
  const nav_spread_levels = [ctx[0]];
  let nav_props = {
    $$slots: {default: [create_default_slot$2]},
    $$scope: {ctx}
  };
  for (let i = 0; i < nav_spread_levels.length; i += 1) {
    nav_props = assign(nav_props, nav_spread_levels[i]);
  }
  nav = new Nav({props: nav_props});
  return {
    c() {
      create_component(nav.$$.fragment);
    },
    m(target, anchor) {
      mount_component(nav, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const nav_changes = dirty & 1 ? get_spread_update(nav_spread_levels, [get_spread_object(ctx2[0])]) : {};
      if (dirty & 4) {
        nav_changes.$$scope = {dirty, ctx: ctx2};
      }
      nav.$set(nav_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(nav.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(nav.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(nav, detaching);
    }
  };
}
function instance$j($$self, $$props, $$invalidate) {
  const omit_props_names = [];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let {$$slots: slots = {}, $$scope} = $$props;
  setContext("tabs", true);
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(0, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("$$scope" in $$new_props)
      $$invalidate(2, $$scope = $$new_props.$$scope);
  };
  return [$$restProps, slots, $$scope];
}
var TabHeader = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$j, create_fragment$j, safe_not_equal, {});
  }
};
function create_default_slot$3(ctx) {
  let current;
  const default_slot_template = ctx[5].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[6], null);
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 64)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[6], !current ? get_all_dirty_from_scope(ctx2[6]) : get_slot_changes(default_slot_template, ctx2[6], dirty, null), null);
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$k(ctx) {
  let div;
  let tabheader;
  let t;
  let current;
  tabheader = new TabHeader({
    props: {
      class: classnames({"me-3": ctx[1]}),
      pills: ctx[0],
      tabs: !ctx[0],
      vertical: ctx[1],
      $$slots: {default: [create_default_slot$3]},
      $$scope: {ctx}
    }
  });
  const default_slot_template = ctx[5].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[6], null);
  let div_levels = [ctx[3], {class: ctx[2]}];
  let div_data = {};
  for (let i = 0; i < div_levels.length; i += 1) {
    div_data = assign(div_data, div_levels[i]);
  }
  return {
    c() {
      div = element("div");
      create_component(tabheader.$$.fragment);
      t = space();
      if (default_slot)
        default_slot.c();
      set_attributes(div, div_data);
    },
    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(tabheader, div, null);
      append(div, t);
      if (default_slot) {
        default_slot.m(div, null);
      }
      current = true;
    },
    p(ctx2, [dirty]) {
      const tabheader_changes = {};
      if (dirty & 2)
        tabheader_changes.class = classnames({"me-3": ctx2[1]});
      if (dirty & 1)
        tabheader_changes.pills = ctx2[0];
      if (dirty & 1)
        tabheader_changes.tabs = !ctx2[0];
      if (dirty & 2)
        tabheader_changes.vertical = ctx2[1];
      if (dirty & 64) {
        tabheader_changes.$$scope = {dirty, ctx: ctx2};
      }
      tabheader.$set(tabheader_changes);
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 64)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[6], !current ? get_all_dirty_from_scope(ctx2[6]) : get_slot_changes(default_slot_template, ctx2[6], dirty, null), null);
        }
      }
      set_attributes(div, div_data = get_spread_update(div_levels, [
        dirty & 8 && ctx2[3],
        (!current || dirty & 4) && {class: ctx2[2]}
      ]));
    },
    i(local) {
      if (current)
        return;
      transition_in(tabheader.$$.fragment, local);
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(tabheader.$$.fragment, local);
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      destroy_component(tabheader);
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function instance$k($$self, $$props, $$invalidate) {
  let classes;
  const omit_props_names = ["class", "pills", "vertical"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let {$$slots: slots = {}, $$scope} = $$props;
  const dispatch = createEventDispatcher();
  let {class: className = ""} = $$props;
  let {pills = false} = $$props;
  let {vertical = false} = $$props;
  const activeTabId = writable();
  setContext("tabContent", {
    activeTabId,
    setActiveTab: (tabId) => {
      activeTabId.set(tabId);
      dispatch("tab", tabId);
    }
  });
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("class" in $$new_props)
      $$invalidate(4, className = $$new_props.class);
    if ("pills" in $$new_props)
      $$invalidate(0, pills = $$new_props.pills);
    if ("vertical" in $$new_props)
      $$invalidate(1, vertical = $$new_props.vertical);
    if ("$$scope" in $$new_props)
      $$invalidate(6, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 18) {
      $$invalidate(2, classes = classnames("tab-content", className, {"d-flex align-items-start": vertical}));
    }
  };
  return [pills, vertical, classes, $$restProps, className, slots, $$scope];
}
var TabContent = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$k, create_fragment$k, safe_not_equal, {class: 4, pills: 0, vertical: 1});
  }
};
var get_tab_slot_changes = (dirty) => ({});
var get_tab_slot_context = (ctx) => ({});
function create_else_block$7(ctx) {
  let div;
  let current;
  const default_slot_template = ctx[12].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[14], null);
  let div_levels = [ctx[8], {class: ctx[4]}];
  let div_data = {};
  for (let i = 0; i < div_levels.length; i += 1) {
    div_data = assign(div_data, div_levels[i]);
  }
  return {
    c() {
      div = element("div");
      if (default_slot)
        default_slot.c();
      set_attributes(div, div_data);
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if (default_slot) {
        default_slot.m(div, null);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 16384)) {
          update_slot_base(default_slot, default_slot_template, ctx2, ctx2[14], !current ? get_all_dirty_from_scope(ctx2[14]) : get_slot_changes(default_slot_template, ctx2[14], dirty, null), null);
        }
      }
      set_attributes(div, div_data = get_spread_update(div_levels, [
        dirty & 256 && ctx2[8],
        (!current || dirty & 16) && {class: ctx2[4]}
      ]));
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(div);
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_if_block$7(ctx) {
  let navitem;
  let current;
  navitem = new NavItem({
    props: {
      $$slots: {default: [create_default_slot$4]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      create_component(navitem.$$.fragment);
    },
    m(target, anchor) {
      mount_component(navitem, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const navitem_changes = {};
      if (dirty & 16399) {
        navitem_changes.$$scope = {dirty, ctx: ctx2};
      }
      navitem.$set(navitem_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(navitem.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(navitem.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(navitem, detaching);
    }
  };
}
function create_if_block_1$5(ctx) {
  let t;
  return {
    c() {
      t = text(ctx[1]);
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & 2)
        set_data(t, ctx2[1]);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot_1$1(ctx) {
  let t;
  let current;
  let if_block = ctx[1] && create_if_block_1$5(ctx);
  const tab_slot_template = ctx[12].tab;
  const tab_slot = create_slot(tab_slot_template, ctx, ctx[14], get_tab_slot_context);
  return {
    c() {
      if (if_block)
        if_block.c();
      t = space();
      if (tab_slot)
        tab_slot.c();
    },
    m(target, anchor) {
      if (if_block)
        if_block.m(target, anchor);
      insert(target, t, anchor);
      if (tab_slot) {
        tab_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (ctx2[1]) {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block_1$5(ctx2);
          if_block.c();
          if_block.m(t.parentNode, t);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
      if (tab_slot) {
        if (tab_slot.p && (!current || dirty & 16384)) {
          update_slot_base(tab_slot, tab_slot_template, ctx2, ctx2[14], !current ? get_all_dirty_from_scope(ctx2[14]) : get_slot_changes(tab_slot_template, ctx2[14], dirty, get_tab_slot_changes), get_tab_slot_context);
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(tab_slot, local);
      current = true;
    },
    o(local) {
      transition_out(tab_slot, local);
      current = false;
    },
    d(detaching) {
      if (if_block)
        if_block.d(detaching);
      if (detaching)
        detach(t);
      if (tab_slot)
        tab_slot.d(detaching);
    }
  };
}
function create_default_slot$4(ctx) {
  let navlink;
  let current;
  navlink = new NavLink({
    props: {
      active: ctx[3],
      disabled: ctx[0],
      $$slots: {default: [create_default_slot_1$1]},
      $$scope: {ctx}
    }
  });
  navlink.$on("click", ctx[13]);
  return {
    c() {
      create_component(navlink.$$.fragment);
    },
    m(target, anchor) {
      mount_component(navlink, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const navlink_changes = {};
      if (dirty & 8)
        navlink_changes.active = ctx2[3];
      if (dirty & 1)
        navlink_changes.disabled = ctx2[0];
      if (dirty & 16386) {
        navlink_changes.$$scope = {dirty, ctx: ctx2};
      }
      navlink.$set(navlink_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(navlink.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(navlink.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(navlink, detaching);
    }
  };
}
function create_fragment$l(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block$7, create_else_block$7];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (ctx2[5])
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      if_block.p(ctx2, dirty);
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if_blocks[current_block_type_index].d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
function instance$l($$self, $$props, $$invalidate) {
  let classes;
  const omit_props_names = ["class", "active", "disabled", "tab", "tabId"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let $activeTabId;
  let {$$slots: slots = {}, $$scope} = $$props;
  let {class: className = ""} = $$props;
  let {active = false} = $$props;
  let {disabled = false} = $$props;
  let {tab = void 0} = $$props;
  let {tabId = void 0} = $$props;
  const tabs = getContext("tabs");
  const {activeTabId, setActiveTab} = getContext("tabContent");
  component_subscribe($$self, activeTabId, (value2) => $$invalidate(11, $activeTabId = value2));
  onMount(() => {
    if (active)
      setActiveTab(tabId);
  });
  let tabOpen = active;
  const click_handler = () => setActiveTab(tabId);
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(8, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("class" in $$new_props)
      $$invalidate(9, className = $$new_props.class);
    if ("active" in $$new_props)
      $$invalidate(10, active = $$new_props.active);
    if ("disabled" in $$new_props)
      $$invalidate(0, disabled = $$new_props.disabled);
    if ("tab" in $$new_props)
      $$invalidate(1, tab = $$new_props.tab);
    if ("tabId" in $$new_props)
      $$invalidate(2, tabId = $$new_props.tabId);
    if ("$$scope" in $$new_props)
      $$invalidate(14, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 2052) {
      if ($activeTabId !== void 0)
        $$invalidate(3, tabOpen = $activeTabId === tabId);
    }
    if ($$self.$$.dirty & 520) {
      $$invalidate(4, classes = classnames("tab-pane", className, {active: tabOpen, show: tabOpen}));
    }
  };
  return [
    disabled,
    tab,
    tabId,
    tabOpen,
    classes,
    tabs,
    activeTabId,
    setActiveTab,
    $$restProps,
    className,
    active,
    $activeTabId,
    slots,
    click_handler,
    $$scope
  ];
}
var TabPane = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$l, create_fragment$l, safe_not_equal, {
      class: 9,
      active: 10,
      disabled: 0,
      tab: 1,
      tabId: 2
    });
  }
};

// docs/_snowpack/pkg/socket.io-client.js
var PACKET_TYPES = Object.create(null);
PACKET_TYPES["open"] = "0";
PACKET_TYPES["close"] = "1";
PACKET_TYPES["ping"] = "2";
PACKET_TYPES["pong"] = "3";
PACKET_TYPES["message"] = "4";
PACKET_TYPES["upgrade"] = "5";
PACKET_TYPES["noop"] = "6";
var PACKET_TYPES_REVERSE = Object.create(null);
Object.keys(PACKET_TYPES).forEach((key) => {
  PACKET_TYPES_REVERSE[PACKET_TYPES[key]] = key;
});
var ERROR_PACKET = {type: "error", data: "parser error"};
var withNativeBlob = typeof Blob === "function" || typeof Blob !== "undefined" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]";
var withNativeArrayBuffer = typeof ArrayBuffer === "function";
var isView = (obj) => {
  return typeof ArrayBuffer.isView === "function" ? ArrayBuffer.isView(obj) : obj && obj.buffer instanceof ArrayBuffer;
};
var encodePacket = ({type, data}, supportsBinary, callback) => {
  if (withNativeBlob && data instanceof Blob) {
    if (supportsBinary) {
      return callback(data);
    } else {
      return encodeBlobAsBase64(data, callback);
    }
  } else if (withNativeArrayBuffer && (data instanceof ArrayBuffer || isView(data))) {
    if (supportsBinary) {
      return callback(data);
    } else {
      return encodeBlobAsBase64(new Blob([data]), callback);
    }
  }
  return callback(PACKET_TYPES[type] + (data || ""));
};
var encodeBlobAsBase64 = (data, callback) => {
  const fileReader = new FileReader();
  fileReader.onload = function() {
    const content = fileReader.result.split(",")[1];
    callback("b" + content);
  };
  return fileReader.readAsDataURL(data);
};
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var lookup = typeof Uint8Array === "undefined" ? [] : new Uint8Array(256);
for (let i = 0; i < chars.length; i++) {
  lookup[chars.charCodeAt(i)] = i;
}
var decode = (base64) => {
  let bufferLength = base64.length * 0.75, len = base64.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;
  if (base64[base64.length - 1] === "=") {
    bufferLength--;
    if (base64[base64.length - 2] === "=") {
      bufferLength--;
    }
  }
  const arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
  for (i = 0; i < len; i += 4) {
    encoded1 = lookup[base64.charCodeAt(i)];
    encoded2 = lookup[base64.charCodeAt(i + 1)];
    encoded3 = lookup[base64.charCodeAt(i + 2)];
    encoded4 = lookup[base64.charCodeAt(i + 3)];
    bytes[p++] = encoded1 << 2 | encoded2 >> 4;
    bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
    bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
  }
  return arraybuffer;
};
var withNativeArrayBuffer$1 = typeof ArrayBuffer === "function";
var decodePacket = (encodedPacket, binaryType) => {
  if (typeof encodedPacket !== "string") {
    return {
      type: "message",
      data: mapBinary(encodedPacket, binaryType)
    };
  }
  const type = encodedPacket.charAt(0);
  if (type === "b") {
    return {
      type: "message",
      data: decodeBase64Packet(encodedPacket.substring(1), binaryType)
    };
  }
  const packetType = PACKET_TYPES_REVERSE[type];
  if (!packetType) {
    return ERROR_PACKET;
  }
  return encodedPacket.length > 1 ? {
    type: PACKET_TYPES_REVERSE[type],
    data: encodedPacket.substring(1)
  } : {
    type: PACKET_TYPES_REVERSE[type]
  };
};
var decodeBase64Packet = (data, binaryType) => {
  if (withNativeArrayBuffer$1) {
    const decoded = decode(data);
    return mapBinary(decoded, binaryType);
  } else {
    return {base64: true, data};
  }
};
var mapBinary = (data, binaryType) => {
  switch (binaryType) {
    case "blob":
      return data instanceof ArrayBuffer ? new Blob([data]) : data;
    case "arraybuffer":
    default:
      return data;
  }
};
var SEPARATOR = String.fromCharCode(30);
var encodePayload = (packets, callback) => {
  const length2 = packets.length;
  const encodedPackets = new Array(length2);
  let count = 0;
  packets.forEach((packet, i) => {
    encodePacket(packet, false, (encodedPacket) => {
      encodedPackets[i] = encodedPacket;
      if (++count === length2) {
        callback(encodedPackets.join(SEPARATOR));
      }
    });
  });
};
var decodePayload = (encodedPayload, binaryType) => {
  const encodedPackets = encodedPayload.split(SEPARATOR);
  const packets = [];
  for (let i = 0; i < encodedPackets.length; i++) {
    const decodedPacket = decodePacket(encodedPackets[i], binaryType);
    packets.push(decodedPacket);
    if (decodedPacket.type === "error") {
      break;
    }
  }
  return packets;
};
var protocol = 4;
function Emitter(obj) {
  if (obj)
    return mixin(obj);
}
function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}
Emitter.prototype.on = Emitter.prototype.addEventListener = function(event, fn) {
  this._callbacks = this._callbacks || {};
  (this._callbacks["$" + event] = this._callbacks["$" + event] || []).push(fn);
  return this;
};
Emitter.prototype.once = function(event, fn) {
  function on2() {
    this.off(event, on2);
    fn.apply(this, arguments);
  }
  on2.fn = fn;
  this.on(event, on2);
  return this;
};
Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function(event, fn) {
  this._callbacks = this._callbacks || {};
  if (arguments.length == 0) {
    this._callbacks = {};
    return this;
  }
  var callbacks = this._callbacks["$" + event];
  if (!callbacks)
    return this;
  if (arguments.length == 1) {
    delete this._callbacks["$" + event];
    return this;
  }
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  if (callbacks.length === 0) {
    delete this._callbacks["$" + event];
  }
  return this;
};
Emitter.prototype.emit = function(event) {
  this._callbacks = this._callbacks || {};
  var args = new Array(arguments.length - 1), callbacks = this._callbacks["$" + event];
  for (var i = 1; i < arguments.length; i++) {
    args[i - 1] = arguments[i];
  }
  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }
  return this;
};
Emitter.prototype.emitReserved = Emitter.prototype.emit;
Emitter.prototype.listeners = function(event) {
  this._callbacks = this._callbacks || {};
  return this._callbacks["$" + event] || [];
};
Emitter.prototype.hasListeners = function(event) {
  return !!this.listeners(event).length;
};
var globalThisShim = (() => {
  if (typeof self !== "undefined") {
    return self;
  } else if (typeof window !== "undefined") {
    return window;
  } else {
    return Function("return this")();
  }
})();
function pick(obj, ...attr2) {
  return attr2.reduce((acc, k) => {
    if (obj.hasOwnProperty(k)) {
      acc[k] = obj[k];
    }
    return acc;
  }, {});
}
var NATIVE_SET_TIMEOUT = setTimeout;
var NATIVE_CLEAR_TIMEOUT = clearTimeout;
function installTimerFunctions(obj, opts) {
  if (opts.useNativeTimers) {
    obj.setTimeoutFn = NATIVE_SET_TIMEOUT.bind(globalThisShim);
    obj.clearTimeoutFn = NATIVE_CLEAR_TIMEOUT.bind(globalThisShim);
  } else {
    obj.setTimeoutFn = setTimeout.bind(globalThisShim);
    obj.clearTimeoutFn = clearTimeout.bind(globalThisShim);
  }
}
var BASE64_OVERHEAD = 1.33;
function byteLength(obj) {
  if (typeof obj === "string") {
    return utf8Length(obj);
  }
  return Math.ceil((obj.byteLength || obj.size) * BASE64_OVERHEAD);
}
function utf8Length(str) {
  let c = 0, length2 = 0;
  for (let i = 0, l = str.length; i < l; i++) {
    c = str.charCodeAt(i);
    if (c < 128) {
      length2 += 1;
    } else if (c < 2048) {
      length2 += 2;
    } else if (c < 55296 || c >= 57344) {
      length2 += 3;
    } else {
      i++;
      length2 += 4;
    }
  }
  return length2;
}
var TransportError = class extends Error {
  constructor(reason, description, context) {
    super(reason);
    this.description = description;
    this.context = context;
    this.type = "TransportError";
  }
};
var Transport = class extends Emitter {
  constructor(opts) {
    super();
    this.writable = false;
    installTimerFunctions(this, opts);
    this.opts = opts;
    this.query = opts.query;
    this.readyState = "";
    this.socket = opts.socket;
  }
  onError(reason, description, context) {
    super.emitReserved("error", new TransportError(reason, description, context));
    return this;
  }
  open() {
    if (this.readyState === "closed" || this.readyState === "") {
      this.readyState = "opening";
      this.doOpen();
    }
    return this;
  }
  close() {
    if (this.readyState === "opening" || this.readyState === "open") {
      this.doClose();
      this.onClose();
    }
    return this;
  }
  send(packets) {
    if (this.readyState === "open") {
      this.write(packets);
    }
  }
  onOpen() {
    this.readyState = "open";
    this.writable = true;
    super.emitReserved("open");
  }
  onData(data) {
    const packet = decodePacket(data, this.socket.binaryType);
    this.onPacket(packet);
  }
  onPacket(packet) {
    super.emitReserved("packet", packet);
  }
  onClose(details) {
    this.readyState = "closed";
    super.emitReserved("close", details);
  }
};
var alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split("");
var length = 64;
var seed = 0;
var prev;
function encode(num) {
  let encoded = "";
  do {
    encoded = alphabet[num % length] + encoded;
    num = Math.floor(num / length);
  } while (num > 0);
  return encoded;
}
function yeast() {
  const now = encode(+new Date());
  if (now !== prev)
    return seed = 0, prev = now;
  return now + "." + encode(seed++);
}
function encode$1(obj) {
  let str = "";
  for (let i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (str.length)
        str += "&";
      str += encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]);
    }
  }
  return str;
}
function decode$1(qs) {
  let qry = {};
  let pairs = qs.split("&");
  for (let i = 0, l = pairs.length; i < l; i++) {
    let pair = pairs[i].split("=");
    qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return qry;
}
var value = false;
try {
  value = typeof XMLHttpRequest !== "undefined" && "withCredentials" in new XMLHttpRequest();
} catch (err) {
}
var hasCORS = value;
function XHR(opts) {
  const xdomain = opts.xdomain;
  try {
    if (typeof XMLHttpRequest !== "undefined" && (!xdomain || hasCORS)) {
      return new XMLHttpRequest();
    }
  } catch (e) {
  }
  if (!xdomain) {
    try {
      return new globalThisShim[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
    } catch (e) {
    }
  }
}
function empty2() {
}
var hasXHR2 = function() {
  const xhr = new XHR({
    xdomain: false
  });
  return xhr.responseType != null;
}();
var Polling = class extends Transport {
  constructor(opts) {
    super(opts);
    this.polling = false;
    if (typeof location !== "undefined") {
      const isSSL = location.protocol === "https:";
      let port = location.port;
      if (!port) {
        port = isSSL ? "443" : "80";
      }
      this.xd = typeof location !== "undefined" && opts.hostname !== location.hostname || port !== opts.port;
      this.xs = opts.secure !== isSSL;
    }
    const forceBase64 = opts && opts.forceBase64;
    this.supportsBinary = hasXHR2 && !forceBase64;
  }
  get name() {
    return "polling";
  }
  doOpen() {
    this.poll();
  }
  pause(onPause) {
    this.readyState = "pausing";
    const pause = () => {
      this.readyState = "paused";
      onPause();
    };
    if (this.polling || !this.writable) {
      let total = 0;
      if (this.polling) {
        total++;
        this.once("pollComplete", function() {
          --total || pause();
        });
      }
      if (!this.writable) {
        total++;
        this.once("drain", function() {
          --total || pause();
        });
      }
    } else {
      pause();
    }
  }
  poll() {
    this.polling = true;
    this.doPoll();
    this.emitReserved("poll");
  }
  onData(data) {
    const callback = (packet) => {
      if (this.readyState === "opening" && packet.type === "open") {
        this.onOpen();
      }
      if (packet.type === "close") {
        this.onClose({description: "transport closed by the server"});
        return false;
      }
      this.onPacket(packet);
    };
    decodePayload(data, this.socket.binaryType).forEach(callback);
    if (this.readyState !== "closed") {
      this.polling = false;
      this.emitReserved("pollComplete");
      if (this.readyState === "open") {
        this.poll();
      }
    }
  }
  doClose() {
    const close = () => {
      this.write([{type: "close"}]);
    };
    if (this.readyState === "open") {
      close();
    } else {
      this.once("open", close);
    }
  }
  write(packets) {
    this.writable = false;
    encodePayload(packets, (data) => {
      this.doWrite(data, () => {
        this.writable = true;
        this.emitReserved("drain");
      });
    });
  }
  uri() {
    let query = this.query || {};
    const schema = this.opts.secure ? "https" : "http";
    let port = "";
    if (this.opts.timestampRequests !== false) {
      query[this.opts.timestampParam] = yeast();
    }
    if (!this.supportsBinary && !query.sid) {
      query.b64 = 1;
    }
    if (this.opts.port && (schema === "https" && Number(this.opts.port) !== 443 || schema === "http" && Number(this.opts.port) !== 80)) {
      port = ":" + this.opts.port;
    }
    const encodedQuery = encode$1(query);
    const ipv6 = this.opts.hostname.indexOf(":") !== -1;
    return schema + "://" + (ipv6 ? "[" + this.opts.hostname + "]" : this.opts.hostname) + port + this.opts.path + (encodedQuery.length ? "?" + encodedQuery : "");
  }
  request(opts = {}) {
    Object.assign(opts, {xd: this.xd, xs: this.xs}, this.opts);
    return new Request(this.uri(), opts);
  }
  doWrite(data, fn) {
    const req = this.request({
      method: "POST",
      data
    });
    req.on("success", fn);
    req.on("error", (xhrStatus, context) => {
      this.onError("xhr post error", xhrStatus, context);
    });
  }
  doPoll() {
    const req = this.request();
    req.on("data", this.onData.bind(this));
    req.on("error", (xhrStatus, context) => {
      this.onError("xhr poll error", xhrStatus, context);
    });
    this.pollXhr = req;
  }
};
var Request = class extends Emitter {
  constructor(uri, opts) {
    super();
    installTimerFunctions(this, opts);
    this.opts = opts;
    this.method = opts.method || "GET";
    this.uri = uri;
    this.async = opts.async !== false;
    this.data = opts.data !== void 0 ? opts.data : null;
    this.create();
  }
  create() {
    const opts = pick(this.opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
    opts.xdomain = !!this.opts.xd;
    opts.xscheme = !!this.opts.xs;
    const xhr = this.xhr = new XHR(opts);
    try {
      xhr.open(this.method, this.uri, this.async);
      try {
        if (this.opts.extraHeaders) {
          xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
          for (let i in this.opts.extraHeaders) {
            if (this.opts.extraHeaders.hasOwnProperty(i)) {
              xhr.setRequestHeader(i, this.opts.extraHeaders[i]);
            }
          }
        }
      } catch (e) {
      }
      if (this.method === "POST") {
        try {
          xhr.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
        } catch (e) {
        }
      }
      try {
        xhr.setRequestHeader("Accept", "*/*");
      } catch (e) {
      }
      if ("withCredentials" in xhr) {
        xhr.withCredentials = this.opts.withCredentials;
      }
      if (this.opts.requestTimeout) {
        xhr.timeout = this.opts.requestTimeout;
      }
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4)
          return;
        if (xhr.status === 200 || xhr.status === 1223) {
          this.onLoad();
        } else {
          this.setTimeoutFn(() => {
            this.onError(typeof xhr.status === "number" ? xhr.status : 0);
          }, 0);
        }
      };
      xhr.send(this.data);
    } catch (e) {
      this.setTimeoutFn(() => {
        this.onError(e);
      }, 0);
      return;
    }
    if (typeof document !== "undefined") {
      this.index = Request.requestsCount++;
      Request.requests[this.index] = this;
    }
  }
  onError(err) {
    this.emitReserved("error", err, this.xhr);
    this.cleanup(true);
  }
  cleanup(fromError) {
    if (typeof this.xhr === "undefined" || this.xhr === null) {
      return;
    }
    this.xhr.onreadystatechange = empty2;
    if (fromError) {
      try {
        this.xhr.abort();
      } catch (e) {
      }
    }
    if (typeof document !== "undefined") {
      delete Request.requests[this.index];
    }
    this.xhr = null;
  }
  onLoad() {
    const data = this.xhr.responseText;
    if (data !== null) {
      this.emitReserved("data", data);
      this.emitReserved("success");
      this.cleanup();
    }
  }
  abort() {
    this.cleanup();
  }
};
Request.requestsCount = 0;
Request.requests = {};
if (typeof document !== "undefined") {
  if (typeof attachEvent === "function") {
    attachEvent("onunload", unloadHandler);
  } else if (typeof addEventListener === "function") {
    const terminationEvent = "onpagehide" in globalThisShim ? "pagehide" : "unload";
    addEventListener(terminationEvent, unloadHandler, false);
  }
}
function unloadHandler() {
  for (let i in Request.requests) {
    if (Request.requests.hasOwnProperty(i)) {
      Request.requests[i].abort();
    }
  }
}
var nextTick = (() => {
  const isPromiseAvailable = typeof Promise === "function" && typeof Promise.resolve === "function";
  if (isPromiseAvailable) {
    return (cb) => Promise.resolve().then(cb);
  } else {
    return (cb, setTimeoutFn) => setTimeoutFn(cb, 0);
  }
})();
var WebSocket = globalThisShim.WebSocket || globalThisShim.MozWebSocket;
var usingBrowserWebSocket = true;
var defaultBinaryType = "arraybuffer";
var isReactNative = typeof navigator !== "undefined" && typeof navigator.product === "string" && navigator.product.toLowerCase() === "reactnative";
var WS = class extends Transport {
  constructor(opts) {
    super(opts);
    this.supportsBinary = !opts.forceBase64;
  }
  get name() {
    return "websocket";
  }
  doOpen() {
    if (!this.check()) {
      return;
    }
    const uri = this.uri();
    const protocols = this.opts.protocols;
    const opts = isReactNative ? {} : pick(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
    if (this.opts.extraHeaders) {
      opts.headers = this.opts.extraHeaders;
    }
    try {
      this.ws = usingBrowserWebSocket && !isReactNative ? protocols ? new WebSocket(uri, protocols) : new WebSocket(uri) : new WebSocket(uri, protocols, opts);
    } catch (err) {
      return this.emitReserved("error", err);
    }
    this.ws.binaryType = this.socket.binaryType || defaultBinaryType;
    this.addEventListeners();
  }
  addEventListeners() {
    this.ws.onopen = () => {
      if (this.opts.autoUnref) {
        this.ws._socket.unref();
      }
      this.onOpen();
    };
    this.ws.onclose = (closeEvent) => this.onClose({
      description: "websocket connection closed",
      context: closeEvent
    });
    this.ws.onmessage = (ev) => this.onData(ev.data);
    this.ws.onerror = (e) => this.onError("websocket error", e);
  }
  write(packets) {
    this.writable = false;
    for (let i = 0; i < packets.length; i++) {
      const packet = packets[i];
      const lastPacket = i === packets.length - 1;
      encodePacket(packet, this.supportsBinary, (data) => {
        const opts = {};
        try {
          if (usingBrowserWebSocket) {
            this.ws.send(data);
          }
        } catch (e) {
        }
        if (lastPacket) {
          nextTick(() => {
            this.writable = true;
            this.emitReserved("drain");
          }, this.setTimeoutFn);
        }
      });
    }
  }
  doClose() {
    if (typeof this.ws !== "undefined") {
      this.ws.close();
      this.ws = null;
    }
  }
  uri() {
    let query = this.query || {};
    const schema = this.opts.secure ? "wss" : "ws";
    let port = "";
    if (this.opts.port && (schema === "wss" && Number(this.opts.port) !== 443 || schema === "ws" && Number(this.opts.port) !== 80)) {
      port = ":" + this.opts.port;
    }
    if (this.opts.timestampRequests) {
      query[this.opts.timestampParam] = yeast();
    }
    if (!this.supportsBinary) {
      query.b64 = 1;
    }
    const encodedQuery = encode$1(query);
    const ipv6 = this.opts.hostname.indexOf(":") !== -1;
    return schema + "://" + (ipv6 ? "[" + this.opts.hostname + "]" : this.opts.hostname) + port + this.opts.path + (encodedQuery.length ? "?" + encodedQuery : "");
  }
  check() {
    return !!WebSocket;
  }
};
var transports = {
  websocket: WS,
  polling: Polling
};
var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
var parts = [
  "source",
  "protocol",
  "authority",
  "userInfo",
  "user",
  "password",
  "host",
  "port",
  "relative",
  "path",
  "directory",
  "file",
  "query",
  "anchor"
];
function parse(str) {
  const src = str, b2 = str.indexOf("["), e = str.indexOf("]");
  if (b2 != -1 && e != -1) {
    str = str.substring(0, b2) + str.substring(b2, e).replace(/:/g, ";") + str.substring(e, str.length);
  }
  let m = re.exec(str || ""), uri = {}, i = 14;
  while (i--) {
    uri[parts[i]] = m[i] || "";
  }
  if (b2 != -1 && e != -1) {
    uri.source = src;
    uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ":");
    uri.authority = uri.authority.replace("[", "").replace("]", "").replace(/;/g, ":");
    uri.ipv6uri = true;
  }
  uri.pathNames = pathNames(uri, uri["path"]);
  uri.queryKey = queryKey(uri, uri["query"]);
  return uri;
}
function pathNames(obj, path) {
  const regx = /\/{2,9}/g, names = path.replace(regx, "/").split("/");
  if (path.substr(0, 1) == "/" || path.length === 0) {
    names.splice(0, 1);
  }
  if (path.substr(path.length - 1, 1) == "/") {
    names.splice(names.length - 1, 1);
  }
  return names;
}
function queryKey(uri, query) {
  const data = {};
  query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function($0, $1, $2) {
    if ($1) {
      data[$1] = $2;
    }
  });
  return data;
}
var Socket = class extends Emitter {
  constructor(uri, opts = {}) {
    super();
    if (uri && typeof uri === "object") {
      opts = uri;
      uri = null;
    }
    if (uri) {
      uri = parse(uri);
      opts.hostname = uri.host;
      opts.secure = uri.protocol === "https" || uri.protocol === "wss";
      opts.port = uri.port;
      if (uri.query)
        opts.query = uri.query;
    } else if (opts.host) {
      opts.hostname = parse(opts.host).host;
    }
    installTimerFunctions(this, opts);
    this.secure = opts.secure != null ? opts.secure : typeof location !== "undefined" && location.protocol === "https:";
    if (opts.hostname && !opts.port) {
      opts.port = this.secure ? "443" : "80";
    }
    this.hostname = opts.hostname || (typeof location !== "undefined" ? location.hostname : "localhost");
    this.port = opts.port || (typeof location !== "undefined" && location.port ? location.port : this.secure ? "443" : "80");
    this.transports = opts.transports || ["polling", "websocket"];
    this.readyState = "";
    this.writeBuffer = [];
    this.prevBufferLen = 0;
    this.opts = Object.assign({
      path: "/engine.io",
      agent: false,
      withCredentials: false,
      upgrade: true,
      timestampParam: "t",
      rememberUpgrade: false,
      rejectUnauthorized: true,
      perMessageDeflate: {
        threshold: 1024
      },
      transportOptions: {},
      closeOnBeforeunload: true
    }, opts);
    this.opts.path = this.opts.path.replace(/\/$/, "") + "/";
    if (typeof this.opts.query === "string") {
      this.opts.query = decode$1(this.opts.query);
    }
    this.id = null;
    this.upgrades = null;
    this.pingInterval = null;
    this.pingTimeout = null;
    this.pingTimeoutTimer = null;
    if (typeof addEventListener === "function") {
      if (this.opts.closeOnBeforeunload) {
        addEventListener("beforeunload", () => {
          if (this.transport) {
            this.transport.removeAllListeners();
            this.transport.close();
          }
        }, false);
      }
      if (this.hostname !== "localhost") {
        this.offlineEventListener = () => {
          this.onClose("transport close", {
            description: "network connection lost"
          });
        };
        addEventListener("offline", this.offlineEventListener, false);
      }
    }
    this.open();
  }
  createTransport(name) {
    const query = Object.assign({}, this.opts.query);
    query.EIO = protocol;
    query.transport = name;
    if (this.id)
      query.sid = this.id;
    const opts = Object.assign({}, this.opts.transportOptions[name], this.opts, {
      query,
      socket: this,
      hostname: this.hostname,
      secure: this.secure,
      port: this.port
    });
    return new transports[name](opts);
  }
  open() {
    let transport;
    if (this.opts.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1) {
      transport = "websocket";
    } else if (this.transports.length === 0) {
      this.setTimeoutFn(() => {
        this.emitReserved("error", "No transports available");
      }, 0);
      return;
    } else {
      transport = this.transports[0];
    }
    this.readyState = "opening";
    try {
      transport = this.createTransport(transport);
    } catch (e) {
      this.transports.shift();
      this.open();
      return;
    }
    transport.open();
    this.setTransport(transport);
  }
  setTransport(transport) {
    if (this.transport) {
      this.transport.removeAllListeners();
    }
    this.transport = transport;
    transport.on("drain", this.onDrain.bind(this)).on("packet", this.onPacket.bind(this)).on("error", this.onError.bind(this)).on("close", (reason) => this.onClose("transport close", reason));
  }
  probe(name) {
    let transport = this.createTransport(name);
    let failed = false;
    Socket.priorWebsocketSuccess = false;
    const onTransportOpen = () => {
      if (failed)
        return;
      transport.send([{type: "ping", data: "probe"}]);
      transport.once("packet", (msg) => {
        if (failed)
          return;
        if (msg.type === "pong" && msg.data === "probe") {
          this.upgrading = true;
          this.emitReserved("upgrading", transport);
          if (!transport)
            return;
          Socket.priorWebsocketSuccess = transport.name === "websocket";
          this.transport.pause(() => {
            if (failed)
              return;
            if (this.readyState === "closed")
              return;
            cleanup();
            this.setTransport(transport);
            transport.send([{type: "upgrade"}]);
            this.emitReserved("upgrade", transport);
            transport = null;
            this.upgrading = false;
            this.flush();
          });
        } else {
          const err = new Error("probe error");
          err.transport = transport.name;
          this.emitReserved("upgradeError", err);
        }
      });
    };
    function freezeTransport() {
      if (failed)
        return;
      failed = true;
      cleanup();
      transport.close();
      transport = null;
    }
    const onerror = (err) => {
      const error = new Error("probe error: " + err);
      error.transport = transport.name;
      freezeTransport();
      this.emitReserved("upgradeError", error);
    };
    function onTransportClose() {
      onerror("transport closed");
    }
    function onclose() {
      onerror("socket closed");
    }
    function onupgrade(to) {
      if (transport && to.name !== transport.name) {
        freezeTransport();
      }
    }
    const cleanup = () => {
      transport.removeListener("open", onTransportOpen);
      transport.removeListener("error", onerror);
      transport.removeListener("close", onTransportClose);
      this.off("close", onclose);
      this.off("upgrading", onupgrade);
    };
    transport.once("open", onTransportOpen);
    transport.once("error", onerror);
    transport.once("close", onTransportClose);
    this.once("close", onclose);
    this.once("upgrading", onupgrade);
    transport.open();
  }
  onOpen() {
    this.readyState = "open";
    Socket.priorWebsocketSuccess = this.transport.name === "websocket";
    this.emitReserved("open");
    this.flush();
    if (this.readyState === "open" && this.opts.upgrade && this.transport.pause) {
      let i = 0;
      const l = this.upgrades.length;
      for (; i < l; i++) {
        this.probe(this.upgrades[i]);
      }
    }
  }
  onPacket(packet) {
    if (this.readyState === "opening" || this.readyState === "open" || this.readyState === "closing") {
      this.emitReserved("packet", packet);
      this.emitReserved("heartbeat");
      switch (packet.type) {
        case "open":
          this.onHandshake(JSON.parse(packet.data));
          break;
        case "ping":
          this.resetPingTimeout();
          this.sendPacket("pong");
          this.emitReserved("ping");
          this.emitReserved("pong");
          break;
        case "error":
          const err = new Error("server error");
          err.code = packet.data;
          this.onError(err);
          break;
        case "message":
          this.emitReserved("data", packet.data);
          this.emitReserved("message", packet.data);
          break;
      }
    }
  }
  onHandshake(data) {
    this.emitReserved("handshake", data);
    this.id = data.sid;
    this.transport.query.sid = data.sid;
    this.upgrades = this.filterUpgrades(data.upgrades);
    this.pingInterval = data.pingInterval;
    this.pingTimeout = data.pingTimeout;
    this.maxPayload = data.maxPayload;
    this.onOpen();
    if (this.readyState === "closed")
      return;
    this.resetPingTimeout();
  }
  resetPingTimeout() {
    this.clearTimeoutFn(this.pingTimeoutTimer);
    this.pingTimeoutTimer = this.setTimeoutFn(() => {
      this.onClose("ping timeout");
    }, this.pingInterval + this.pingTimeout);
    if (this.opts.autoUnref) {
      this.pingTimeoutTimer.unref();
    }
  }
  onDrain() {
    this.writeBuffer.splice(0, this.prevBufferLen);
    this.prevBufferLen = 0;
    if (this.writeBuffer.length === 0) {
      this.emitReserved("drain");
    } else {
      this.flush();
    }
  }
  flush() {
    if (this.readyState !== "closed" && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
      const packets = this.getWritablePackets();
      this.transport.send(packets);
      this.prevBufferLen = packets.length;
      this.emitReserved("flush");
    }
  }
  getWritablePackets() {
    const shouldCheckPayloadSize = this.maxPayload && this.transport.name === "polling" && this.writeBuffer.length > 1;
    if (!shouldCheckPayloadSize) {
      return this.writeBuffer;
    }
    let payloadSize = 1;
    for (let i = 0; i < this.writeBuffer.length; i++) {
      const data = this.writeBuffer[i].data;
      if (data) {
        payloadSize += byteLength(data);
      }
      if (i > 0 && payloadSize > this.maxPayload) {
        return this.writeBuffer.slice(0, i);
      }
      payloadSize += 2;
    }
    return this.writeBuffer;
  }
  write(msg, options, fn) {
    this.sendPacket("message", msg, options, fn);
    return this;
  }
  send(msg, options, fn) {
    this.sendPacket("message", msg, options, fn);
    return this;
  }
  sendPacket(type, data, options, fn) {
    if (typeof data === "function") {
      fn = data;
      data = void 0;
    }
    if (typeof options === "function") {
      fn = options;
      options = null;
    }
    if (this.readyState === "closing" || this.readyState === "closed") {
      return;
    }
    options = options || {};
    options.compress = options.compress !== false;
    const packet = {
      type,
      data,
      options
    };
    this.emitReserved("packetCreate", packet);
    this.writeBuffer.push(packet);
    if (fn)
      this.once("flush", fn);
    this.flush();
  }
  close() {
    const close = () => {
      this.onClose("forced close");
      this.transport.close();
    };
    const cleanupAndClose = () => {
      this.off("upgrade", cleanupAndClose);
      this.off("upgradeError", cleanupAndClose);
      close();
    };
    const waitForUpgrade = () => {
      this.once("upgrade", cleanupAndClose);
      this.once("upgradeError", cleanupAndClose);
    };
    if (this.readyState === "opening" || this.readyState === "open") {
      this.readyState = "closing";
      if (this.writeBuffer.length) {
        this.once("drain", () => {
          if (this.upgrading) {
            waitForUpgrade();
          } else {
            close();
          }
        });
      } else if (this.upgrading) {
        waitForUpgrade();
      } else {
        close();
      }
    }
    return this;
  }
  onError(err) {
    Socket.priorWebsocketSuccess = false;
    this.emitReserved("error", err);
    this.onClose("transport error", err);
  }
  onClose(reason, description) {
    if (this.readyState === "opening" || this.readyState === "open" || this.readyState === "closing") {
      this.clearTimeoutFn(this.pingTimeoutTimer);
      this.transport.removeAllListeners("close");
      this.transport.close();
      this.transport.removeAllListeners();
      if (typeof removeEventListener === "function") {
        removeEventListener("offline", this.offlineEventListener, false);
      }
      this.readyState = "closed";
      this.id = null;
      this.emitReserved("close", reason, description);
      this.writeBuffer = [];
      this.prevBufferLen = 0;
    }
  }
  filterUpgrades(upgrades) {
    const filteredUpgrades = [];
    let i = 0;
    const j = upgrades.length;
    for (; i < j; i++) {
      if (~this.transports.indexOf(upgrades[i]))
        filteredUpgrades.push(upgrades[i]);
    }
    return filteredUpgrades;
  }
};
Socket.protocol = protocol;
function url(uri, path = "", loc) {
  let obj = uri;
  loc = loc || typeof location !== "undefined" && location;
  if (uri == null)
    uri = loc.protocol + "//" + loc.host;
  if (typeof uri === "string") {
    if (uri.charAt(0) === "/") {
      if (uri.charAt(1) === "/") {
        uri = loc.protocol + uri;
      } else {
        uri = loc.host + uri;
      }
    }
    if (!/^(https?|wss?):\/\//.test(uri)) {
      if (typeof loc !== "undefined") {
        uri = loc.protocol + "//" + uri;
      } else {
        uri = "https://" + uri;
      }
    }
    obj = parse(uri);
  }
  if (!obj.port) {
    if (/^(http|ws)$/.test(obj.protocol)) {
      obj.port = "80";
    } else if (/^(http|ws)s$/.test(obj.protocol)) {
      obj.port = "443";
    }
  }
  obj.path = obj.path || "/";
  const ipv6 = obj.host.indexOf(":") !== -1;
  const host = ipv6 ? "[" + obj.host + "]" : obj.host;
  obj.id = obj.protocol + "://" + host + ":" + obj.port + path;
  obj.href = obj.protocol + "://" + host + (loc && loc.port === obj.port ? "" : ":" + obj.port);
  return obj;
}
var withNativeArrayBuffer$2 = typeof ArrayBuffer === "function";
var isView$1 = (obj) => {
  return typeof ArrayBuffer.isView === "function" ? ArrayBuffer.isView(obj) : obj.buffer instanceof ArrayBuffer;
};
var toString = Object.prototype.toString;
var withNativeBlob$1 = typeof Blob === "function" || typeof Blob !== "undefined" && toString.call(Blob) === "[object BlobConstructor]";
var withNativeFile = typeof File === "function" || typeof File !== "undefined" && toString.call(File) === "[object FileConstructor]";
function isBinary(obj) {
  return withNativeArrayBuffer$2 && (obj instanceof ArrayBuffer || isView$1(obj)) || withNativeBlob$1 && obj instanceof Blob || withNativeFile && obj instanceof File;
}
function hasBinary(obj, toJSON) {
  if (!obj || typeof obj !== "object") {
    return false;
  }
  if (Array.isArray(obj)) {
    for (let i = 0, l = obj.length; i < l; i++) {
      if (hasBinary(obj[i])) {
        return true;
      }
    }
    return false;
  }
  if (isBinary(obj)) {
    return true;
  }
  if (obj.toJSON && typeof obj.toJSON === "function" && arguments.length === 1) {
    return hasBinary(obj.toJSON(), true);
  }
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
      return true;
    }
  }
  return false;
}
function deconstructPacket(packet) {
  const buffers = [];
  const packetData = packet.data;
  const pack = packet;
  pack.data = _deconstructPacket(packetData, buffers);
  pack.attachments = buffers.length;
  return {packet: pack, buffers};
}
function _deconstructPacket(data, buffers) {
  if (!data)
    return data;
  if (isBinary(data)) {
    const placeholder = {_placeholder: true, num: buffers.length};
    buffers.push(data);
    return placeholder;
  } else if (Array.isArray(data)) {
    const newData = new Array(data.length);
    for (let i = 0; i < data.length; i++) {
      newData[i] = _deconstructPacket(data[i], buffers);
    }
    return newData;
  } else if (typeof data === "object" && !(data instanceof Date)) {
    const newData = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        newData[key] = _deconstructPacket(data[key], buffers);
      }
    }
    return newData;
  }
  return data;
}
function reconstructPacket(packet, buffers) {
  packet.data = _reconstructPacket(packet.data, buffers);
  packet.attachments = void 0;
  return packet;
}
function _reconstructPacket(data, buffers) {
  if (!data)
    return data;
  if (data && data._placeholder) {
    return buffers[data.num];
  } else if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      data[i] = _reconstructPacket(data[i], buffers);
    }
  } else if (typeof data === "object") {
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        data[key] = _reconstructPacket(data[key], buffers);
      }
    }
  }
  return data;
}
var protocol$1 = 5;
var PacketType;
(function(PacketType2) {
  PacketType2[PacketType2["CONNECT"] = 0] = "CONNECT";
  PacketType2[PacketType2["DISCONNECT"] = 1] = "DISCONNECT";
  PacketType2[PacketType2["EVENT"] = 2] = "EVENT";
  PacketType2[PacketType2["ACK"] = 3] = "ACK";
  PacketType2[PacketType2["CONNECT_ERROR"] = 4] = "CONNECT_ERROR";
  PacketType2[PacketType2["BINARY_EVENT"] = 5] = "BINARY_EVENT";
  PacketType2[PacketType2["BINARY_ACK"] = 6] = "BINARY_ACK";
})(PacketType || (PacketType = {}));
var Encoder = class {
  constructor(replacer) {
    this.replacer = replacer;
  }
  encode(obj) {
    if (obj.type === PacketType.EVENT || obj.type === PacketType.ACK) {
      if (hasBinary(obj)) {
        obj.type = obj.type === PacketType.EVENT ? PacketType.BINARY_EVENT : PacketType.BINARY_ACK;
        return this.encodeAsBinary(obj);
      }
    }
    return [this.encodeAsString(obj)];
  }
  encodeAsString(obj) {
    let str = "" + obj.type;
    if (obj.type === PacketType.BINARY_EVENT || obj.type === PacketType.BINARY_ACK) {
      str += obj.attachments + "-";
    }
    if (obj.nsp && obj.nsp !== "/") {
      str += obj.nsp + ",";
    }
    if (obj.id != null) {
      str += obj.id;
    }
    if (obj.data != null) {
      str += JSON.stringify(obj.data, this.replacer);
    }
    return str;
  }
  encodeAsBinary(obj) {
    const deconstruction = deconstructPacket(obj);
    const pack = this.encodeAsString(deconstruction.packet);
    const buffers = deconstruction.buffers;
    buffers.unshift(pack);
    return buffers;
  }
};
var Decoder = class extends Emitter {
  constructor(reviver) {
    super();
    this.reviver = reviver;
  }
  add(obj) {
    let packet;
    if (typeof obj === "string") {
      packet = this.decodeString(obj);
      if (packet.type === PacketType.BINARY_EVENT || packet.type === PacketType.BINARY_ACK) {
        this.reconstructor = new BinaryReconstructor(packet);
        if (packet.attachments === 0) {
          super.emitReserved("decoded", packet);
        }
      } else {
        super.emitReserved("decoded", packet);
      }
    } else if (isBinary(obj) || obj.base64) {
      if (!this.reconstructor) {
        throw new Error("got binary data when not reconstructing a packet");
      } else {
        packet = this.reconstructor.takeBinaryData(obj);
        if (packet) {
          this.reconstructor = null;
          super.emitReserved("decoded", packet);
        }
      }
    } else {
      throw new Error("Unknown type: " + obj);
    }
  }
  decodeString(str) {
    let i = 0;
    const p = {
      type: Number(str.charAt(0))
    };
    if (PacketType[p.type] === void 0) {
      throw new Error("unknown packet type " + p.type);
    }
    if (p.type === PacketType.BINARY_EVENT || p.type === PacketType.BINARY_ACK) {
      const start = i + 1;
      while (str.charAt(++i) !== "-" && i != str.length) {
      }
      const buf = str.substring(start, i);
      if (buf != Number(buf) || str.charAt(i) !== "-") {
        throw new Error("Illegal attachments");
      }
      p.attachments = Number(buf);
    }
    if (str.charAt(i + 1) === "/") {
      const start = i + 1;
      while (++i) {
        const c = str.charAt(i);
        if (c === ",")
          break;
        if (i === str.length)
          break;
      }
      p.nsp = str.substring(start, i);
    } else {
      p.nsp = "/";
    }
    const next = str.charAt(i + 1);
    if (next !== "" && Number(next) == next) {
      const start = i + 1;
      while (++i) {
        const c = str.charAt(i);
        if (c == null || Number(c) != c) {
          --i;
          break;
        }
        if (i === str.length)
          break;
      }
      p.id = Number(str.substring(start, i + 1));
    }
    if (str.charAt(++i)) {
      const payload = this.tryParse(str.substr(i));
      if (Decoder.isPayloadValid(p.type, payload)) {
        p.data = payload;
      } else {
        throw new Error("invalid payload");
      }
    }
    return p;
  }
  tryParse(str) {
    try {
      return JSON.parse(str, this.reviver);
    } catch (e) {
      return false;
    }
  }
  static isPayloadValid(type, payload) {
    switch (type) {
      case PacketType.CONNECT:
        return typeof payload === "object";
      case PacketType.DISCONNECT:
        return payload === void 0;
      case PacketType.CONNECT_ERROR:
        return typeof payload === "string" || typeof payload === "object";
      case PacketType.EVENT:
      case PacketType.BINARY_EVENT:
        return Array.isArray(payload) && payload.length > 0;
      case PacketType.ACK:
      case PacketType.BINARY_ACK:
        return Array.isArray(payload);
    }
  }
  destroy() {
    if (this.reconstructor) {
      this.reconstructor.finishedReconstruction();
    }
  }
};
var BinaryReconstructor = class {
  constructor(packet) {
    this.packet = packet;
    this.buffers = [];
    this.reconPack = packet;
  }
  takeBinaryData(binData) {
    this.buffers.push(binData);
    if (this.buffers.length === this.reconPack.attachments) {
      const packet = reconstructPacket(this.reconPack, this.buffers);
      this.finishedReconstruction();
      return packet;
    }
    return null;
  }
  finishedReconstruction() {
    this.reconPack = null;
    this.buffers = [];
  }
};
var parser = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  protocol: protocol$1,
  get PacketType() {
    return PacketType;
  },
  Encoder,
  Decoder
});
function on(obj, ev, fn) {
  obj.on(ev, fn);
  return function subDestroy() {
    obj.off(ev, fn);
  };
}
var RESERVED_EVENTS = Object.freeze({
  connect: 1,
  connect_error: 1,
  disconnect: 1,
  disconnecting: 1,
  newListener: 1,
  removeListener: 1
});
var Socket$1 = class extends Emitter {
  constructor(io, nsp, opts) {
    super();
    this.connected = false;
    this.receiveBuffer = [];
    this.sendBuffer = [];
    this.ids = 0;
    this.acks = {};
    this.flags = {};
    this.io = io;
    this.nsp = nsp;
    if (opts && opts.auth) {
      this.auth = opts.auth;
    }
    if (this.io._autoConnect)
      this.open();
  }
  get disconnected() {
    return !this.connected;
  }
  subEvents() {
    if (this.subs)
      return;
    const io = this.io;
    this.subs = [
      on(io, "open", this.onopen.bind(this)),
      on(io, "packet", this.onpacket.bind(this)),
      on(io, "error", this.onerror.bind(this)),
      on(io, "close", this.onclose.bind(this))
    ];
  }
  get active() {
    return !!this.subs;
  }
  connect() {
    if (this.connected)
      return this;
    this.subEvents();
    if (!this.io["_reconnecting"])
      this.io.open();
    if (this.io._readyState === "open")
      this.onopen();
    return this;
  }
  open() {
    return this.connect();
  }
  send(...args) {
    args.unshift("message");
    this.emit.apply(this, args);
    return this;
  }
  emit(ev, ...args) {
    if (RESERVED_EVENTS.hasOwnProperty(ev)) {
      throw new Error('"' + ev + '" is a reserved event name');
    }
    args.unshift(ev);
    const packet = {
      type: PacketType.EVENT,
      data: args
    };
    packet.options = {};
    packet.options.compress = this.flags.compress !== false;
    if (typeof args[args.length - 1] === "function") {
      const id = this.ids++;
      const ack = args.pop();
      this._registerAckCallback(id, ack);
      packet.id = id;
    }
    const isTransportWritable = this.io.engine && this.io.engine.transport && this.io.engine.transport.writable;
    const discardPacket = this.flags.volatile && (!isTransportWritable || !this.connected);
    if (discardPacket)
      ;
    else if (this.connected) {
      this.notifyOutgoingListeners(packet);
      this.packet(packet);
    } else {
      this.sendBuffer.push(packet);
    }
    this.flags = {};
    return this;
  }
  _registerAckCallback(id, ack) {
    const timeout = this.flags.timeout;
    if (timeout === void 0) {
      this.acks[id] = ack;
      return;
    }
    const timer = this.io.setTimeoutFn(() => {
      delete this.acks[id];
      for (let i = 0; i < this.sendBuffer.length; i++) {
        if (this.sendBuffer[i].id === id) {
          this.sendBuffer.splice(i, 1);
        }
      }
      ack.call(this, new Error("operation has timed out"));
    }, timeout);
    this.acks[id] = (...args) => {
      this.io.clearTimeoutFn(timer);
      ack.apply(this, [null, ...args]);
    };
  }
  packet(packet) {
    packet.nsp = this.nsp;
    this.io._packet(packet);
  }
  onopen() {
    if (typeof this.auth == "function") {
      this.auth((data) => {
        this.packet({type: PacketType.CONNECT, data});
      });
    } else {
      this.packet({type: PacketType.CONNECT, data: this.auth});
    }
  }
  onerror(err) {
    if (!this.connected) {
      this.emitReserved("connect_error", err);
    }
  }
  onclose(reason, description) {
    this.connected = false;
    delete this.id;
    this.emitReserved("disconnect", reason, description);
  }
  onpacket(packet) {
    const sameNamespace = packet.nsp === this.nsp;
    if (!sameNamespace)
      return;
    switch (packet.type) {
      case PacketType.CONNECT:
        if (packet.data && packet.data.sid) {
          const id = packet.data.sid;
          this.onconnect(id);
        } else {
          this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
        }
        break;
      case PacketType.EVENT:
      case PacketType.BINARY_EVENT:
        this.onevent(packet);
        break;
      case PacketType.ACK:
      case PacketType.BINARY_ACK:
        this.onack(packet);
        break;
      case PacketType.DISCONNECT:
        this.ondisconnect();
        break;
      case PacketType.CONNECT_ERROR:
        this.destroy();
        const err = new Error(packet.data.message);
        err.data = packet.data.data;
        this.emitReserved("connect_error", err);
        break;
    }
  }
  onevent(packet) {
    const args = packet.data || [];
    if (packet.id != null) {
      args.push(this.ack(packet.id));
    }
    if (this.connected) {
      this.emitEvent(args);
    } else {
      this.receiveBuffer.push(Object.freeze(args));
    }
  }
  emitEvent(args) {
    if (this._anyListeners && this._anyListeners.length) {
      const listeners = this._anyListeners.slice();
      for (const listener of listeners) {
        listener.apply(this, args);
      }
    }
    super.emit.apply(this, args);
  }
  ack(id) {
    const self2 = this;
    let sent = false;
    return function(...args) {
      if (sent)
        return;
      sent = true;
      self2.packet({
        type: PacketType.ACK,
        id,
        data: args
      });
    };
  }
  onack(packet) {
    const ack = this.acks[packet.id];
    if (typeof ack === "function") {
      ack.apply(this, packet.data);
      delete this.acks[packet.id];
    }
  }
  onconnect(id) {
    this.id = id;
    this.connected = true;
    this.emitBuffered();
    this.emitReserved("connect");
  }
  emitBuffered() {
    this.receiveBuffer.forEach((args) => this.emitEvent(args));
    this.receiveBuffer = [];
    this.sendBuffer.forEach((packet) => {
      this.notifyOutgoingListeners(packet);
      this.packet(packet);
    });
    this.sendBuffer = [];
  }
  ondisconnect() {
    this.destroy();
    this.onclose("io server disconnect");
  }
  destroy() {
    if (this.subs) {
      this.subs.forEach((subDestroy) => subDestroy());
      this.subs = void 0;
    }
    this.io["_destroy"](this);
  }
  disconnect() {
    if (this.connected) {
      this.packet({type: PacketType.DISCONNECT});
    }
    this.destroy();
    if (this.connected) {
      this.onclose("io client disconnect");
    }
    return this;
  }
  close() {
    return this.disconnect();
  }
  compress(compress) {
    this.flags.compress = compress;
    return this;
  }
  get volatile() {
    this.flags.volatile = true;
    return this;
  }
  timeout(timeout) {
    this.flags.timeout = timeout;
    return this;
  }
  onAny(listener) {
    this._anyListeners = this._anyListeners || [];
    this._anyListeners.push(listener);
    return this;
  }
  prependAny(listener) {
    this._anyListeners = this._anyListeners || [];
    this._anyListeners.unshift(listener);
    return this;
  }
  offAny(listener) {
    if (!this._anyListeners) {
      return this;
    }
    if (listener) {
      const listeners = this._anyListeners;
      for (let i = 0; i < listeners.length; i++) {
        if (listener === listeners[i]) {
          listeners.splice(i, 1);
          return this;
        }
      }
    } else {
      this._anyListeners = [];
    }
    return this;
  }
  listenersAny() {
    return this._anyListeners || [];
  }
  onAnyOutgoing(listener) {
    this._anyOutgoingListeners = this._anyOutgoingListeners || [];
    this._anyOutgoingListeners.push(listener);
    return this;
  }
  prependAnyOutgoing(listener) {
    this._anyOutgoingListeners = this._anyOutgoingListeners || [];
    this._anyOutgoingListeners.unshift(listener);
    return this;
  }
  offAnyOutgoing(listener) {
    if (!this._anyOutgoingListeners) {
      return this;
    }
    if (listener) {
      const listeners = this._anyOutgoingListeners;
      for (let i = 0; i < listeners.length; i++) {
        if (listener === listeners[i]) {
          listeners.splice(i, 1);
          return this;
        }
      }
    } else {
      this._anyOutgoingListeners = [];
    }
    return this;
  }
  listenersAnyOutgoing() {
    return this._anyOutgoingListeners || [];
  }
  notifyOutgoingListeners(packet) {
    if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
      const listeners = this._anyOutgoingListeners.slice();
      for (const listener of listeners) {
        listener.apply(this, packet.data);
      }
    }
  }
};
function Backoff(opts) {
  opts = opts || {};
  this.ms = opts.min || 100;
  this.max = opts.max || 1e4;
  this.factor = opts.factor || 2;
  this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
  this.attempts = 0;
}
Backoff.prototype.duration = function() {
  var ms = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var rand = Math.random();
    var deviation = Math.floor(rand * this.jitter * ms);
    ms = (Math.floor(rand * 10) & 1) == 0 ? ms - deviation : ms + deviation;
  }
  return Math.min(ms, this.max) | 0;
};
Backoff.prototype.reset = function() {
  this.attempts = 0;
};
Backoff.prototype.setMin = function(min) {
  this.ms = min;
};
Backoff.prototype.setMax = function(max) {
  this.max = max;
};
Backoff.prototype.setJitter = function(jitter) {
  this.jitter = jitter;
};
var Manager = class extends Emitter {
  constructor(uri, opts) {
    var _a;
    super();
    this.nsps = {};
    this.subs = [];
    if (uri && typeof uri === "object") {
      opts = uri;
      uri = void 0;
    }
    opts = opts || {};
    opts.path = opts.path || "/socket.io";
    this.opts = opts;
    installTimerFunctions(this, opts);
    this.reconnection(opts.reconnection !== false);
    this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
    this.reconnectionDelay(opts.reconnectionDelay || 1e3);
    this.reconnectionDelayMax(opts.reconnectionDelayMax || 5e3);
    this.randomizationFactor((_a = opts.randomizationFactor) !== null && _a !== void 0 ? _a : 0.5);
    this.backoff = new Backoff({
      min: this.reconnectionDelay(),
      max: this.reconnectionDelayMax(),
      jitter: this.randomizationFactor()
    });
    this.timeout(opts.timeout == null ? 2e4 : opts.timeout);
    this._readyState = "closed";
    this.uri = uri;
    const _parser = opts.parser || parser;
    this.encoder = new _parser.Encoder();
    this.decoder = new _parser.Decoder();
    this._autoConnect = opts.autoConnect !== false;
    if (this._autoConnect)
      this.open();
  }
  reconnection(v) {
    if (!arguments.length)
      return this._reconnection;
    this._reconnection = !!v;
    return this;
  }
  reconnectionAttempts(v) {
    if (v === void 0)
      return this._reconnectionAttempts;
    this._reconnectionAttempts = v;
    return this;
  }
  reconnectionDelay(v) {
    var _a;
    if (v === void 0)
      return this._reconnectionDelay;
    this._reconnectionDelay = v;
    (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMin(v);
    return this;
  }
  randomizationFactor(v) {
    var _a;
    if (v === void 0)
      return this._randomizationFactor;
    this._randomizationFactor = v;
    (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setJitter(v);
    return this;
  }
  reconnectionDelayMax(v) {
    var _a;
    if (v === void 0)
      return this._reconnectionDelayMax;
    this._reconnectionDelayMax = v;
    (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMax(v);
    return this;
  }
  timeout(v) {
    if (!arguments.length)
      return this._timeout;
    this._timeout = v;
    return this;
  }
  maybeReconnectOnOpen() {
    if (!this._reconnecting && this._reconnection && this.backoff.attempts === 0) {
      this.reconnect();
    }
  }
  open(fn) {
    if (~this._readyState.indexOf("open"))
      return this;
    this.engine = new Socket(this.uri, this.opts);
    const socket = this.engine;
    const self2 = this;
    this._readyState = "opening";
    this.skipReconnect = false;
    const openSubDestroy = on(socket, "open", function() {
      self2.onopen();
      fn && fn();
    });
    const errorSub = on(socket, "error", (err) => {
      self2.cleanup();
      self2._readyState = "closed";
      this.emitReserved("error", err);
      if (fn) {
        fn(err);
      } else {
        self2.maybeReconnectOnOpen();
      }
    });
    if (this._timeout !== false) {
      const timeout = this._timeout;
      if (timeout === 0) {
        openSubDestroy();
      }
      const timer = this.setTimeoutFn(() => {
        openSubDestroy();
        socket.close();
        socket.emit("error", new Error("timeout"));
      }, timeout);
      if (this.opts.autoUnref) {
        timer.unref();
      }
      this.subs.push(function subDestroy() {
        clearTimeout(timer);
      });
    }
    this.subs.push(openSubDestroy);
    this.subs.push(errorSub);
    return this;
  }
  connect(fn) {
    return this.open(fn);
  }
  onopen() {
    this.cleanup();
    this._readyState = "open";
    this.emitReserved("open");
    const socket = this.engine;
    this.subs.push(on(socket, "ping", this.onping.bind(this)), on(socket, "data", this.ondata.bind(this)), on(socket, "error", this.onerror.bind(this)), on(socket, "close", this.onclose.bind(this)), on(this.decoder, "decoded", this.ondecoded.bind(this)));
  }
  onping() {
    this.emitReserved("ping");
  }
  ondata(data) {
    this.decoder.add(data);
  }
  ondecoded(packet) {
    this.emitReserved("packet", packet);
  }
  onerror(err) {
    this.emitReserved("error", err);
  }
  socket(nsp, opts) {
    let socket = this.nsps[nsp];
    if (!socket) {
      socket = new Socket$1(this, nsp, opts);
      this.nsps[nsp] = socket;
    }
    return socket;
  }
  _destroy(socket) {
    const nsps = Object.keys(this.nsps);
    for (const nsp of nsps) {
      const socket2 = this.nsps[nsp];
      if (socket2.active) {
        return;
      }
    }
    this._close();
  }
  _packet(packet) {
    const encodedPackets = this.encoder.encode(packet);
    for (let i = 0; i < encodedPackets.length; i++) {
      this.engine.write(encodedPackets[i], packet.options);
    }
  }
  cleanup() {
    this.subs.forEach((subDestroy) => subDestroy());
    this.subs.length = 0;
    this.decoder.destroy();
  }
  _close() {
    this.skipReconnect = true;
    this._reconnecting = false;
    this.onclose("forced close");
    if (this.engine)
      this.engine.close();
  }
  disconnect() {
    return this._close();
  }
  onclose(reason, description) {
    this.cleanup();
    this.backoff.reset();
    this._readyState = "closed";
    this.emitReserved("close", reason, description);
    if (this._reconnection && !this.skipReconnect) {
      this.reconnect();
    }
  }
  reconnect() {
    if (this._reconnecting || this.skipReconnect)
      return this;
    const self2 = this;
    if (this.backoff.attempts >= this._reconnectionAttempts) {
      this.backoff.reset();
      this.emitReserved("reconnect_failed");
      this._reconnecting = false;
    } else {
      const delay = this.backoff.duration();
      this._reconnecting = true;
      const timer = this.setTimeoutFn(() => {
        if (self2.skipReconnect)
          return;
        this.emitReserved("reconnect_attempt", self2.backoff.attempts);
        if (self2.skipReconnect)
          return;
        self2.open((err) => {
          if (err) {
            self2._reconnecting = false;
            self2.reconnect();
            this.emitReserved("reconnect_error", err);
          } else {
            self2.onreconnect();
          }
        });
      }, delay);
      if (this.opts.autoUnref) {
        timer.unref();
      }
      this.subs.push(function subDestroy() {
        clearTimeout(timer);
      });
    }
  }
  onreconnect() {
    const attempt = this.backoff.attempts;
    this._reconnecting = false;
    this.backoff.reset();
    this.emitReserved("reconnect", attempt);
  }
};
var cache = {};
function lookup$1(uri, opts) {
  if (typeof uri === "object") {
    opts = uri;
    uri = void 0;
  }
  opts = opts || {};
  const parsed = url(uri, opts.path || "/socket.io");
  const source = parsed.source;
  const id = parsed.id;
  const path = parsed.path;
  const sameNamespace = cache[id] && path in cache[id]["nsps"];
  const newConnection = opts.forceNew || opts["force new connection"] || opts.multiplex === false || sameNamespace;
  let io;
  if (newConnection) {
    io = new Manager(source, opts);
  } else {
    if (!cache[id]) {
      cache[id] = new Manager(source, opts);
    }
    io = cache[id];
  }
  if (parsed.query && !opts.query) {
    opts.query = parsed.queryKey;
  }
  return io.socket(parsed.path, opts);
}
Object.assign(lookup$1, {
  Manager,
  Socket: Socket$1,
  io: lookup$1,
  connect: lookup$1
});

// docs/dist/enums.js
var MessageProtocols;
(function(MessageProtocols2) {
  MessageProtocols2["DIRECT"] = "direct";
  MessageProtocols2["ALL_MACHINES"] = "all_machines";
  MessageProtocols2["ALL_JOBS"] = "all_jobs";
  MessageProtocols2["MESSAGE_ERROR"] = "message_error";
  MessageProtocols2["CONNECT"] = "connect";
  MessageProtocols2["CONNECT_ERROR"] = "connect_error";
  MessageProtocols2["STATS"] = "stats";
})(MessageProtocols || (MessageProtocols = {}));
var MachineTypes;
(function(MachineTypes2) {
  MachineTypes2["PRUSA_MINI"] = "PRUSA_MINI";
  MachineTypes2["PRUSA_MK3S"] = "PRUSA_MK3S";
  MachineTypes2["UM3E"] = "UM3E";
  MachineTypes2["UMS3"] = "UMS3";
  MachineTypes2["DUMMY"] = "DUMMY";
})(MachineTypes || (MachineTypes = {}));
var MachineConnectionTypes;
(function(MachineConnectionTypes2) {
  MachineConnectionTypes2["ULTIMAKER_API"] = "ULTIMAKER_API";
  MachineConnectionTypes2["USB"] = "USB";
  MachineConnectionTypes2["OCTOPRINT"] = "OCTOPRINT";
  MachineConnectionTypes2["DUMMY"] = "DUMMY";
})(MachineConnectionTypes || (MachineConnectionTypes = {}));
var JobStates;
(function(JobStates2) {
  JobStates2["AVAILABLE"] = "available";
  JobStates2["SELECTED"] = "selected";
  JobStates2["NOT_ONLINE"] = "not_online";
})(JobStates || (JobStates = {}));
var MessageSubjects;
(function(MessageSubjects2) {
  MessageSubjects2["JOB_IS_AVAILABLE"] = "job_is_available";
  MessageSubjects2["MACHINE_IS_LOOKING_FOR_JOBS"] = "machine_is_looking_for_jobs";
  MessageSubjects2["MACHINE_HAS_CHOSEN_A_JOB"] = "machine_has_chosen_a_job";
  MessageSubjects2["JOB_HAS_ACCEPTED_MACHINES_OFFER"] = "job_has_accepted_machines_offer";
  MessageSubjects2["JOB_HAS_DECLINED_MACHINES_OFFER"] = "job_has_declined_machines_offer";
})(MessageSubjects || (MessageSubjects = {}));

// docs/dist/Job.svelte.js
function get_each_context2(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[26] = list[i][0];
  child_ctx[27] = list[i][1];
  return child_ctx;
}
function get_each_context_1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[30] = list[i];
  child_ctx[32] = i;
  return child_ctx;
}
function create_default_slot_18(ctx) {
  let t0_value = ctx[30] + "";
  let t0;
  let t1;
  let a;
  let a_href_value;
  let mounted;
  let dispose;
  function click_handler() {
    return ctx[14](ctx[32]);
  }
  return {
    c() {
      t0 = text(t0_value);
      t1 = text(" |\n			");
      a = element("a");
      a.textContent = "delete";
      attr(a, "href", a_href_value = "#");
    },
    m(target, anchor) {
      insert(target, t0, anchor);
      insert(target, t1, anchor);
      insert(target, a, anchor);
      if (!mounted) {
        dispose = listen(a, "click", click_handler);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty[0] & 1024 && t0_value !== (t0_value = ctx[30] + ""))
        set_data(t0, t0_value);
    },
    d(detaching) {
      if (detaching)
        detach(t0);
      if (detaching)
        detach(t1);
      if (detaching)
        detach(a);
      mounted = false;
      dispose();
    }
  };
}
function create_each_block_1(ctx) {
  let listgroupitem;
  let current;
  listgroupitem = new ListGroupItem({
    props: {
      $$slots: {default: [create_default_slot_18]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      create_component(listgroupitem.$$.fragment);
    },
    m(target, anchor) {
      mount_component(listgroupitem, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const listgroupitem_changes = {};
      if (dirty[0] & 1024 | dirty[1] & 4) {
        listgroupitem_changes.$$scope = {dirty, ctx: ctx2};
      }
      listgroupitem.$set(listgroupitem_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(listgroupitem.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(listgroupitem.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(listgroupitem, detaching);
    }
  };
}
function create_default_slot_17(ctx) {
  let each_1_anchor;
  let current;
  let each_value_1 = ctx[10];
  let each_blocks = [];
  for (let i = 0; i < each_value_1.length; i += 1) {
    each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  return {
    c() {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      each_1_anchor = empty();
    },
    m(target, anchor) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(target, anchor);
      }
      insert(target, each_1_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty[0] & 9216) {
        each_value_1 = ctx2[10];
        let i;
        for (i = 0; i < each_value_1.length; i += 1) {
          const child_ctx = get_each_context_1(ctx2, each_value_1, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block_1(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
          }
        }
        group_outros();
        for (i = each_value_1.length; i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value_1.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      destroy_each(each_blocks, detaching);
      if (detaching)
        detach(each_1_anchor);
    }
  };
}
function create_default_slot_16(ctx) {
  let t;
  return {
    c() {
      t = text("Access Key");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot_15(ctx) {
  let inputgrouptext;
  let t;
  let input;
  let updating_value;
  let current;
  inputgrouptext = new InputGroupText({
    props: {
      $$slots: {default: [create_default_slot_16]},
      $$scope: {ctx}
    }
  });
  function input_value_binding(value2) {
    ctx[15](value2);
  }
  let input_props = {
    type: "text",
    invalid: !ctx[0],
    feedback: "Access Key Required"
  };
  if (ctx[0] !== void 0) {
    input_props.value = ctx[0];
  }
  input = new Input({props: input_props});
  binding_callbacks.push(() => bind(input, "value", input_value_binding));
  return {
    c() {
      create_component(inputgrouptext.$$.fragment);
      t = space();
      create_component(input.$$.fragment);
    },
    m(target, anchor) {
      mount_component(inputgrouptext, target, anchor);
      insert(target, t, anchor);
      mount_component(input, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const inputgrouptext_changes = {};
      if (dirty[1] & 4) {
        inputgrouptext_changes.$$scope = {dirty, ctx: ctx2};
      }
      inputgrouptext.$set(inputgrouptext_changes);
      const input_changes = {};
      if (dirty[0] & 1)
        input_changes.invalid = !ctx2[0];
      if (!updating_value && dirty[0] & 1) {
        updating_value = true;
        input_changes.value = ctx2[0];
        add_flush_callback(() => updating_value = false);
      }
      input.$set(input_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(inputgrouptext.$$.fragment, local);
      transition_in(input.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(inputgrouptext.$$.fragment, local);
      transition_out(input.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(inputgrouptext, detaching);
      if (detaching)
        detach(t);
      destroy_component(input, detaching);
    }
  };
}
function create_default_slot_14(ctx) {
  let inputgroup;
  let current;
  inputgroup = new InputGroup({
    props: {
      $$slots: {default: [create_default_slot_15]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      create_component(inputgroup.$$.fragment);
    },
    m(target, anchor) {
      mount_component(inputgroup, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const inputgroup_changes = {};
      if (dirty[0] & 1 | dirty[1] & 4) {
        inputgroup_changes.$$scope = {dirty, ctx: ctx2};
      }
      inputgroup.$set(inputgroup_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(inputgroup.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(inputgroup.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(inputgroup, detaching);
    }
  };
}
function create_default_slot_13(ctx) {
  let t;
  return {
    c() {
      t = text("Group");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot_12(ctx) {
  let inputgrouptext;
  let t;
  let input;
  let updating_value;
  let current;
  inputgrouptext = new InputGroupText({
    props: {
      $$slots: {default: [create_default_slot_13]},
      $$scope: {ctx}
    }
  });
  function input_value_binding_1(value2) {
    ctx[16](value2);
  }
  let input_props = {
    type: "text",
    invalid: !ctx[1],
    feedback: "Group Required"
  };
  if (ctx[1] !== void 0) {
    input_props.value = ctx[1];
  }
  input = new Input({props: input_props});
  binding_callbacks.push(() => bind(input, "value", input_value_binding_1));
  return {
    c() {
      create_component(inputgrouptext.$$.fragment);
      t = space();
      create_component(input.$$.fragment);
    },
    m(target, anchor) {
      mount_component(inputgrouptext, target, anchor);
      insert(target, t, anchor);
      mount_component(input, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const inputgrouptext_changes = {};
      if (dirty[1] & 4) {
        inputgrouptext_changes.$$scope = {dirty, ctx: ctx2};
      }
      inputgrouptext.$set(inputgrouptext_changes);
      const input_changes = {};
      if (dirty[0] & 2)
        input_changes.invalid = !ctx2[1];
      if (!updating_value && dirty[0] & 2) {
        updating_value = true;
        input_changes.value = ctx2[1];
        add_flush_callback(() => updating_value = false);
      }
      input.$set(input_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(inputgrouptext.$$.fragment, local);
      transition_in(input.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(inputgrouptext.$$.fragment, local);
      transition_out(input.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(inputgrouptext, detaching);
      if (detaching)
        detach(t);
      destroy_component(input, detaching);
    }
  };
}
function create_default_slot_11(ctx) {
  let inputgroup;
  let current;
  inputgroup = new InputGroup({
    props: {
      $$slots: {default: [create_default_slot_12]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      create_component(inputgroup.$$.fragment);
    },
    m(target, anchor) {
      mount_component(inputgroup, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const inputgroup_changes = {};
      if (dirty[0] & 2 | dirty[1] & 4) {
        inputgroup_changes.$$scope = {dirty, ctx: ctx2};
      }
      inputgroup.$set(inputgroup_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(inputgroup.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(inputgroup.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(inputgroup, detaching);
    }
  };
}
function create_default_slot_10(ctx) {
  let t;
  return {
    c() {
      t = text("Job Name");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot_9(ctx) {
  let inputgrouptext;
  let t;
  let input;
  let updating_value;
  let current;
  inputgrouptext = new InputGroupText({
    props: {
      $$slots: {default: [create_default_slot_10]},
      $$scope: {ctx}
    }
  });
  function input_value_binding_2(value2) {
    ctx[17](value2);
  }
  let input_props = {
    type: "text",
    invalid: !ctx[2],
    feedback: "Job Name Required"
  };
  if (ctx[2] !== void 0) {
    input_props.value = ctx[2];
  }
  input = new Input({props: input_props});
  binding_callbacks.push(() => bind(input, "value", input_value_binding_2));
  return {
    c() {
      create_component(inputgrouptext.$$.fragment);
      t = space();
      create_component(input.$$.fragment);
    },
    m(target, anchor) {
      mount_component(inputgrouptext, target, anchor);
      insert(target, t, anchor);
      mount_component(input, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const inputgrouptext_changes = {};
      if (dirty[1] & 4) {
        inputgrouptext_changes.$$scope = {dirty, ctx: ctx2};
      }
      inputgrouptext.$set(inputgrouptext_changes);
      const input_changes = {};
      if (dirty[0] & 4)
        input_changes.invalid = !ctx2[2];
      if (!updating_value && dirty[0] & 4) {
        updating_value = true;
        input_changes.value = ctx2[2];
        add_flush_callback(() => updating_value = false);
      }
      input.$set(input_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(inputgrouptext.$$.fragment, local);
      transition_in(input.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(inputgrouptext.$$.fragment, local);
      transition_out(input.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(inputgrouptext, detaching);
      if (detaching)
        detach(t);
      destroy_component(input, detaching);
    }
  };
}
function create_default_slot_8(ctx) {
  let inputgroup;
  let current;
  inputgroup = new InputGroup({
    props: {
      $$slots: {default: [create_default_slot_9]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      create_component(inputgroup.$$.fragment);
    },
    m(target, anchor) {
      mount_component(inputgroup, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const inputgroup_changes = {};
      if (dirty[0] & 4 | dirty[1] & 4) {
        inputgroup_changes.$$scope = {dirty, ctx: ctx2};
      }
      inputgroup.$set(inputgroup_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(inputgroup.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(inputgroup.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(inputgroup, detaching);
    }
  };
}
function create_default_slot_7(ctx) {
  let t;
  return {
    c() {
      t = text("Add G-Code");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot_6(ctx) {
  let label;
  let t;
  let input;
  let current;
  let mounted;
  let dispose;
  label = new Label({
    props: {
      $$slots: {default: [create_default_slot_7]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      create_component(label.$$.fragment);
      t = space();
      input = element("input");
      attr(input, "class", "form-control");
      attr(input, "type", "file");
    },
    m(target, anchor) {
      mount_component(label, target, anchor);
      insert(target, t, anchor);
      insert(target, input, anchor);
      ctx[19](input);
      current = true;
      if (!mounted) {
        dispose = listen(input, "change", ctx[18]);
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      const label_changes = {};
      if (dirty[1] & 4) {
        label_changes.$$scope = {dirty, ctx: ctx2};
      }
      label.$set(label_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(label.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(label.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(label, detaching);
      if (detaching)
        detach(t);
      if (detaching)
        detach(input);
      ctx[19](null);
      mounted = false;
      dispose();
    }
  };
}
function create_default_slot_5(ctx) {
  let t;
  return {
    c() {
      t = text("Connect");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot_4(ctx) {
  let t;
  return {
    c() {
      t = text("Disconnect");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot_3(ctx) {
  let button0;
  let updating_disabled;
  let t;
  let button1;
  let updating_disabled_1;
  let current;
  function button0_disabled_binding(value2) {
    ctx[20](value2);
  }
  let button0_props = {
    color: "primary",
    $$slots: {default: [create_default_slot_5]},
    $$scope: {ctx}
  };
  if (ctx[7] !== void 0) {
    button0_props.disabled = ctx[7];
  }
  button0 = new Button({props: button0_props});
  binding_callbacks.push(() => bind(button0, "disabled", button0_disabled_binding));
  button0.$on("click", ctx[11]);
  function button1_disabled_binding(value2) {
    ctx[21](value2);
  }
  let button1_props = {
    color: "danger",
    $$slots: {default: [create_default_slot_4]},
    $$scope: {ctx}
  };
  if (ctx[8] !== void 0) {
    button1_props.disabled = ctx[8];
  }
  button1 = new Button({props: button1_props});
  binding_callbacks.push(() => bind(button1, "disabled", button1_disabled_binding));
  button1.$on("click", ctx[12]);
  return {
    c() {
      create_component(button0.$$.fragment);
      t = space();
      create_component(button1.$$.fragment);
    },
    m(target, anchor) {
      mount_component(button0, target, anchor);
      insert(target, t, anchor);
      mount_component(button1, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const button0_changes = {};
      if (dirty[1] & 4) {
        button0_changes.$$scope = {dirty, ctx: ctx2};
      }
      if (!updating_disabled && dirty[0] & 128) {
        updating_disabled = true;
        button0_changes.disabled = ctx2[7];
        add_flush_callback(() => updating_disabled = false);
      }
      button0.$set(button0_changes);
      const button1_changes = {};
      if (dirty[1] & 4) {
        button1_changes.$$scope = {dirty, ctx: ctx2};
      }
      if (!updating_disabled_1 && dirty[0] & 256) {
        updating_disabled_1 = true;
        button1_changes.disabled = ctx2[8];
        add_flush_callback(() => updating_disabled_1 = false);
      }
      button1.$set(button1_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(button0.$$.fragment, local);
      transition_in(button1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button0.$$.fragment, local);
      transition_out(button1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(button0, detaching);
      if (detaching)
        detach(t);
      destroy_component(button1, detaching);
    }
  };
}
function create_if_block_23(ctx) {
  let t_value = ctx[5].connected + "";
  let t;
  return {
    c() {
      t = text(t_value);
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & 32 && t_value !== (t_value = ctx2[5].connected + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_if_block_110(ctx) {
  let t_value = ctx[5].id + "";
  let t;
  return {
    c() {
      t = text(t_value);
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & 32 && t_value !== (t_value = ctx2[5].id + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_else_block2(ctx) {
  let listgroupitem;
  let current;
  listgroupitem = new ListGroupItem({
    props: {
      $$slots: {default: [create_default_slot_2]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      create_component(listgroupitem.$$.fragment);
    },
    m(target, anchor) {
      mount_component(listgroupitem, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const listgroupitem_changes = {};
      if (dirty[0] & 64 | dirty[1] & 4) {
        listgroupitem_changes.$$scope = {dirty, ctx: ctx2};
      }
      listgroupitem.$set(listgroupitem_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(listgroupitem.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(listgroupitem.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(listgroupitem, detaching);
    }
  };
}
function create_if_block2(ctx) {
  let listgroupitem;
  let current;
  listgroupitem = new ListGroupItem({
    props: {
      $$slots: {default: [create_default_slot_19]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      create_component(listgroupitem.$$.fragment);
    },
    m(target, anchor) {
      mount_component(listgroupitem, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const listgroupitem_changes = {};
      if (dirty[0] & 64 | dirty[1] & 4) {
        listgroupitem_changes.$$scope = {dirty, ctx: ctx2};
      }
      listgroupitem.$set(listgroupitem_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(listgroupitem.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(listgroupitem.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(listgroupitem, detaching);
    }
  };
}
function create_default_slot_2(ctx) {
  let t0_value = ctx[26] + "";
  let t0;
  let t1;
  return {
    c() {
      t0 = text(t0_value);
      t1 = text(": False");
    },
    m(target, anchor) {
      insert(target, t0, anchor);
      insert(target, t1, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & 64 && t0_value !== (t0_value = ctx2[26] + ""))
        set_data(t0, t0_value);
    },
    d(detaching) {
      if (detaching)
        detach(t0);
      if (detaching)
        detach(t1);
    }
  };
}
function create_default_slot_19(ctx) {
  let t0_value = ctx[26] + "";
  let t0;
  let t1;
  return {
    c() {
      t0 = text(t0_value);
      t1 = text(": True");
    },
    m(target, anchor) {
      insert(target, t0, anchor);
      insert(target, t1, anchor);
    },
    p(ctx2, dirty) {
      if (dirty[0] & 64 && t0_value !== (t0_value = ctx2[26] + ""))
        set_data(t0, t0_value);
    },
    d(detaching) {
      if (detaching)
        detach(t0);
      if (detaching)
        detach(t1);
    }
  };
}
function create_each_block2(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block2, create_else_block2];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (ctx2[27])
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx, [-1, -1]);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2, dirty);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if_blocks[current_block_type_index].d(detaching);
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
function create_default_slot2(ctx) {
  let each_1_anchor;
  let current;
  let each_value = Object.entries(ctx[6]);
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block2(get_each_context2(ctx, each_value, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  return {
    c() {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      each_1_anchor = empty();
    },
    m(target, anchor) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(target, anchor);
      }
      insert(target, each_1_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty[0] & 64) {
        each_value = Object.entries(ctx2[6]);
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context2(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block2(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
          }
        }
        group_outros();
        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
    },
    i(local) {
      if (current)
        return;
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      destroy_each(each_blocks, detaching);
      if (detaching)
        detach(each_1_anchor);
    }
  };
}
function create_fragment2(ctx) {
  let h50;
  let t1;
  let listgroup0;
  let t2;
  let hr0;
  let t3;
  let h51;
  let t5;
  let formgroup0;
  let t6;
  let formgroup1;
  let t7;
  let formgroup2;
  let t8;
  let formgroup3;
  let t9;
  let formgroup4;
  let t10;
  let hr1;
  let t11;
  let h52;
  let t13;
  let dl;
  let dt0;
  let dd0;
  let t15;
  let dt1;
  let dd1;
  let t17;
  let dt2;
  let dd2;
  let t19;
  let p;
  let t21;
  let listgroup1;
  let current;
  listgroup0 = new ListGroup({
    props: {
      $$slots: {default: [create_default_slot_17]},
      $$scope: {ctx}
    }
  });
  formgroup0 = new FormGroup({
    props: {
      $$slots: {default: [create_default_slot_14]},
      $$scope: {ctx}
    }
  });
  formgroup1 = new FormGroup({
    props: {
      $$slots: {default: [create_default_slot_11]},
      $$scope: {ctx}
    }
  });
  formgroup2 = new FormGroup({
    props: {
      $$slots: {default: [create_default_slot_8]},
      $$scope: {ctx}
    }
  });
  formgroup3 = new FormGroup({
    props: {
      $$slots: {default: [create_default_slot_6]},
      $$scope: {ctx}
    }
  });
  formgroup4 = new FormGroup({
    props: {
      $$slots: {default: [create_default_slot_3]},
      $$scope: {ctx}
    }
  });
  let if_block0 = ctx[5] && create_if_block_23(ctx);
  let if_block1 = ctx[5] && create_if_block_110(ctx);
  listgroup1 = new ListGroup({
    props: {
      $$slots: {default: [create_default_slot2]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      h50 = element("h5");
      h50.textContent = "Messages";
      t1 = space();
      create_component(listgroup0.$$.fragment);
      t2 = space();
      hr0 = element("hr");
      t3 = space();
      h51 = element("h5");
      h51.textContent = "Submit Job to BAM";
      t5 = space();
      create_component(formgroup0.$$.fragment);
      t6 = space();
      create_component(formgroup1.$$.fragment);
      t7 = space();
      create_component(formgroup2.$$.fragment);
      t8 = space();
      create_component(formgroup3.$$.fragment);
      t9 = space();
      create_component(formgroup4.$$.fragment);
      t10 = space();
      hr1 = element("hr");
      t11 = space();
      h52 = element("h5");
      h52.textContent = "Details";
      t13 = space();
      dl = element("dl");
      dt0 = element("dt");
      dt0.textContent = "Job Status:";
      dd0 = element("dd");
      t15 = text(ctx[3]);
      dt1 = element("dt");
      dt1.textContent = "Socket Status:";
      dd1 = element("dd");
      if (if_block0)
        if_block0.c();
      t17 = space();
      dt2 = element("dt");
      dt2.textContent = "Socket Id:";
      dd2 = element("dd");
      if (if_block1)
        if_block1.c();
      t19 = space();
      p = element("p");
      p.innerHTML = `<strong>Machine G-Codes</strong>`;
      t21 = space();
      create_component(listgroup1.$$.fragment);
      attr(dt0, "class", "col-2");
      attr(dd0, "class", "col-10");
      attr(dt1, "class", "col-2");
      attr(dd1, "class", "col-10");
      attr(dt2, "class", "col-3");
      attr(dd2, "class", "col-3");
      attr(dl, "class", "row");
    },
    m(target, anchor) {
      insert(target, h50, anchor);
      insert(target, t1, anchor);
      mount_component(listgroup0, target, anchor);
      insert(target, t2, anchor);
      insert(target, hr0, anchor);
      insert(target, t3, anchor);
      insert(target, h51, anchor);
      insert(target, t5, anchor);
      mount_component(formgroup0, target, anchor);
      insert(target, t6, anchor);
      mount_component(formgroup1, target, anchor);
      insert(target, t7, anchor);
      mount_component(formgroup2, target, anchor);
      insert(target, t8, anchor);
      mount_component(formgroup3, target, anchor);
      insert(target, t9, anchor);
      mount_component(formgroup4, target, anchor);
      insert(target, t10, anchor);
      insert(target, hr1, anchor);
      insert(target, t11, anchor);
      insert(target, h52, anchor);
      insert(target, t13, anchor);
      insert(target, dl, anchor);
      append(dl, dt0);
      append(dl, dd0);
      append(dd0, t15);
      append(dl, dt1);
      append(dl, dd1);
      if (if_block0)
        if_block0.m(dd1, null);
      append(dd1, t17);
      append(dl, dt2);
      append(dl, dd2);
      if (if_block1)
        if_block1.m(dd2, null);
      insert(target, t19, anchor);
      insert(target, p, anchor);
      insert(target, t21, anchor);
      mount_component(listgroup1, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const listgroup0_changes = {};
      if (dirty[0] & 1024 | dirty[1] & 4) {
        listgroup0_changes.$$scope = {dirty, ctx: ctx2};
      }
      listgroup0.$set(listgroup0_changes);
      const formgroup0_changes = {};
      if (dirty[0] & 1 | dirty[1] & 4) {
        formgroup0_changes.$$scope = {dirty, ctx: ctx2};
      }
      formgroup0.$set(formgroup0_changes);
      const formgroup1_changes = {};
      if (dirty[0] & 2 | dirty[1] & 4) {
        formgroup1_changes.$$scope = {dirty, ctx: ctx2};
      }
      formgroup1.$set(formgroup1_changes);
      const formgroup2_changes = {};
      if (dirty[0] & 4 | dirty[1] & 4) {
        formgroup2_changes.$$scope = {dirty, ctx: ctx2};
      }
      formgroup2.$set(formgroup2_changes);
      const formgroup3_changes = {};
      if (dirty[0] & 528 | dirty[1] & 4) {
        formgroup3_changes.$$scope = {dirty, ctx: ctx2};
      }
      formgroup3.$set(formgroup3_changes);
      const formgroup4_changes = {};
      if (dirty[0] & 384 | dirty[1] & 4) {
        formgroup4_changes.$$scope = {dirty, ctx: ctx2};
      }
      formgroup4.$set(formgroup4_changes);
      if (!current || dirty[0] & 8)
        set_data(t15, ctx2[3]);
      if (ctx2[5]) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
        } else {
          if_block0 = create_if_block_23(ctx2);
          if_block0.c();
          if_block0.m(dd1, t17);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (ctx2[5]) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
        } else {
          if_block1 = create_if_block_110(ctx2);
          if_block1.c();
          if_block1.m(dd2, null);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
      const listgroup1_changes = {};
      if (dirty[0] & 64 | dirty[1] & 4) {
        listgroup1_changes.$$scope = {dirty, ctx: ctx2};
      }
      listgroup1.$set(listgroup1_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(listgroup0.$$.fragment, local);
      transition_in(formgroup0.$$.fragment, local);
      transition_in(formgroup1.$$.fragment, local);
      transition_in(formgroup2.$$.fragment, local);
      transition_in(formgroup3.$$.fragment, local);
      transition_in(formgroup4.$$.fragment, local);
      transition_in(listgroup1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(listgroup0.$$.fragment, local);
      transition_out(formgroup0.$$.fragment, local);
      transition_out(formgroup1.$$.fragment, local);
      transition_out(formgroup2.$$.fragment, local);
      transition_out(formgroup3.$$.fragment, local);
      transition_out(formgroup4.$$.fragment, local);
      transition_out(listgroup1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(h50);
      if (detaching)
        detach(t1);
      destroy_component(listgroup0, detaching);
      if (detaching)
        detach(t2);
      if (detaching)
        detach(hr0);
      if (detaching)
        detach(t3);
      if (detaching)
        detach(h51);
      if (detaching)
        detach(t5);
      destroy_component(formgroup0, detaching);
      if (detaching)
        detach(t6);
      destroy_component(formgroup1, detaching);
      if (detaching)
        detach(t7);
      destroy_component(formgroup2, detaching);
      if (detaching)
        detach(t8);
      destroy_component(formgroup3, detaching);
      if (detaching)
        detach(t9);
      destroy_component(formgroup4, detaching);
      if (detaching)
        detach(t10);
      if (detaching)
        detach(hr1);
      if (detaching)
        detach(t11);
      if (detaching)
        detach(h52);
      if (detaching)
        detach(t13);
      if (detaching)
        detach(dl);
      if (if_block0)
        if_block0.d();
      if (if_block1)
        if_block1.d();
      if (detaching)
        detach(t19);
      if (detaching)
        detach(p);
      if (detaching)
        detach(t21);
      destroy_component(listgroup1, detaching);
    }
  };
}
function instance2($$self, $$props, $$invalidate) {
  let token = "";
  let group = "";
  let name = "";
  let gcodes = {};
  for (const machineType in MachineTypes) {
    gcodes[machineType] = "";
  }
  let status = JobStates.NOT_ONLINE;
  let isConnectDisabled = true;
  let isDisconnectDisabled = true;
  let files2;
  let fileInput;
  let socket;
  let notifications = [`${new Date().toISOString()}: Welcome to BAM`];
  const connect2 = () => {
    console.log("Connecting to BAM");
    if (!token || !group || !name) {
      console.log("Information Missing");
      return;
    }
    let isThereGCode = false;
    for (const [_, value2] of Object.entries(gcodes)) {
      if (value2)
        isThereGCode = true;
    }
    if (!isThereGCode) {
      console.log("No gcode present");
      return;
    }
    notifications.push(`${new Date().toISOString()}: Connecting to BAM`);
    $$invalidate(10, notifications);
    const url2 = "https://www.workshop-jobs.com";
    const ioConfig = {
      auth: {token},
      extraHeaders: {"agent-type": "job", "group-key": group},
      path: "/socket/"
    };
    $$invalidate(5, socket = lookup$1(url2, ioConfig).on(MessageProtocols.CONNECT, handleConnect).on(MessageProtocols.ALL_JOBS, handleAllJobs).on(MessageProtocols.DIRECT, handleDirect).on(MessageProtocols.MESSAGE_ERROR, (msg) => console.log(msg)).on(MessageProtocols.CONNECT_ERROR, handleConnectionError));
  };
  const disconnect2 = () => {
    socket.close();
    $$invalidate(7, isConnectDisabled = false);
    $$invalidate(8, isDisconnectDisabled = true);
    $$invalidate(5, socket = void 0);
  };
  const handleConnect = function() {
    $$invalidate(7, isConnectDisabled = true);
    $$invalidate(8, isDisconnectDisabled = false);
    $$invalidate(3, status = JobStates.AVAILABLE);
    $$invalidate(5, socket = this);
  };
  const handleConnectionError = function(err) {
    console.log(`Connection Error: ${err}`);
    $$invalidate(7, isConnectDisabled = false);
    $$invalidate(8, isDisconnectDisabled = true);
    this.close();
    $$invalidate(5, socket = void 0);
  };
  const handleAllJobs = function(msg) {
    console.log("|- JobAgent: received ALL_JOBS message");
    console.log(`|- JobAgent: status - ${status}`);
    if (msg.subject == MessageSubjects.MACHINE_IS_LOOKING_FOR_JOBS && status == JobStates.AVAILABLE && gcodes[msg.body.machineType]) {
      const response = {
        toId: msg.fromId,
        fromId: socket.id,
        subject: MessageSubjects.JOB_IS_AVAILABLE,
        body: {}
      };
      socket.emit(MessageProtocols.DIRECT, response);
    }
  };
  const handleDirect = async function(msg) {
    console.log("|- Job received DIRECT message");
    if (msg.subject == MessageSubjects.MACHINE_HAS_CHOSEN_A_JOB && status == JobStates.AVAILABLE) {
      console.log("|- Job responding with accept");
      if (gcodes[msg.body.machineType]) {
        const response = {
          toId: msg.fromId,
          fromId: socket.id,
          subject: MessageSubjects.JOB_HAS_ACCEPTED_MACHINES_OFFER,
          body: {gcode: gcodes[msg.body.machineType]}
        };
        socket.emit(MessageProtocols.DIRECT, response);
        $$invalidate(3, status = JobStates.SELECTED);
        notifications.push(`${new Date().toISOString()}: Job has been accepted`);
        $$invalidate(10, notifications);
      } else {
        console.log("|- Job responding with decline");
        const response = {
          toId: msg.fromId,
          fromId: socket.id,
          subject: MessageSubjects.JOB_HAS_DECLINED_MACHINES_OFFER,
          body: {}
        };
        socket.emit(MessageProtocols.DIRECT, response);
      }
      return;
    }
    if (msg.subject == MessageSubjects.MACHINE_HAS_CHOSEN_A_JOB) {
      console.log("|- Job responding with decline");
      const response = {
        toId: msg.fromId,
        fromId: socket.id,
        subject: MessageSubjects.JOB_HAS_DECLINED_MACHINES_OFFER,
        body: {}
      };
      socket.emit(MessageProtocols.DIRECT, response);
      return;
    }
  };
  const removeNotification = (idx) => {
    notifications.splice(idx, 1);
    $$invalidate(10, notifications);
  };
  const click_handler = (i) => removeNotification(i);
  function input_value_binding(value2) {
    token = value2;
    $$invalidate(0, token);
  }
  function input_value_binding_1(value2) {
    group = value2;
    $$invalidate(1, group);
  }
  function input_value_binding_2(value2) {
    name = value2;
    $$invalidate(2, name);
  }
  function input_change_handler() {
    files2 = this.files;
    $$invalidate(4, files2);
  }
  function input_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      fileInput = $$value;
      $$invalidate(9, fileInput), $$invalidate(4, files2);
    });
  }
  function button0_disabled_binding(value2) {
    isConnectDisabled = value2;
    $$invalidate(7, isConnectDisabled), $$invalidate(2, name), $$invalidate(1, group), $$invalidate(0, token), $$invalidate(3, status);
  }
  function button1_disabled_binding(value2) {
    isDisconnectDisabled = value2;
    $$invalidate(8, isDisconnectDisabled), $$invalidate(5, socket);
  }
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & 16) {
      $: {
        if (files2) {
          const reader = new FileReader();
          reader.onload = function(event) {
            let g = event.target.result;
            if (g.includes("Ultimaker 3 Extended")) {
              $$invalidate(6, gcodes[MachineTypes.UM3E] = g, gcodes);
            }
            if (g.includes("PRINTER_MODEL_MINI")) {
              $$invalidate(6, gcodes[MachineTypes.PRUSA_MINI] = g, gcodes);
            }
            if (g.includes("Ultimaker S3")) {
              $$invalidate(6, gcodes[MachineTypes.UMS3] = g, gcodes);
            }
            $$invalidate(6, gcodes[MachineTypes.DUMMY] = g, gcodes);
            $$invalidate(9, fileInput.value = "", fileInput);
          };
          reader.readAsText(files2[0]);
        }
      }
    }
    if ($$self.$$.dirty[0] & 15) {
      $: {
        if (name && group && token && status == JobStates.NOT_ONLINE) {
          $$invalidate(7, isConnectDisabled = false);
        } else {
          $$invalidate(7, isConnectDisabled = true);
        }
      }
    }
    if ($$self.$$.dirty[0] & 32) {
      $: {
        if (socket) {
          $$invalidate(8, isDisconnectDisabled = false);
        } else {
          $$invalidate(8, isDisconnectDisabled = true);
        }
      }
    }
  };
  return [
    token,
    group,
    name,
    status,
    files2,
    socket,
    gcodes,
    isConnectDisabled,
    isDisconnectDisabled,
    fileInput,
    notifications,
    connect2,
    disconnect2,
    removeNotification,
    click_handler,
    input_value_binding,
    input_value_binding_1,
    input_value_binding_2,
    input_change_handler,
    input_binding,
    button0_disabled_binding,
    button1_disabled_binding
  ];
}
var Job = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance2, create_fragment2, safe_not_equal, {}, null, [-1, -1]);
  }
};
var Job_svelte_default = Job;

// docs/dist/stores/machine-store.js
var machine_store_default = writable({
  machineType: null,
  connectionType: null,
  available: false,
  gcode: ""
});

// docs/dist/connectors/Dummy.svelte.js
function create_default_slot3(ctx) {
  let input;
  let updating_checked;
  let current;
  function input_checked_binding(value2) {
    ctx[2](value2);
  }
  let input_props = {
    type: "switch",
    label: "Toggle to make available"
  };
  if (ctx[0].available !== void 0) {
    input_props.checked = ctx[0].available;
  }
  input = new Input({props: input_props});
  binding_callbacks.push(() => bind(input, "checked", input_checked_binding));
  return {
    c() {
      create_component(input.$$.fragment);
    },
    m(target, anchor) {
      mount_component(input, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const input_changes = {};
      if (!updating_checked && dirty & 1) {
        updating_checked = true;
        input_changes.checked = ctx2[0].available;
        add_flush_callback(() => updating_checked = false);
      }
      input.$set(input_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(input.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(input.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(input, detaching);
    }
  };
}
function create_fragment3(ctx) {
  let hr0;
  let t0;
  let h5;
  let t2;
  let dl;
  let dt0;
  let dd0;
  let t4;
  let dt1;
  let dd1;
  let t6_value = ctx[0].available + "";
  let t6;
  let t7;
  let formgroup;
  let t8;
  let hr1;
  let current;
  formgroup = new FormGroup({
    props: {
      $$slots: {default: [create_default_slot3]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      hr0 = element("hr");
      t0 = space();
      h5 = element("h5");
      h5.textContent = "Dummy Machine";
      t2 = space();
      dl = element("dl");
      dt0 = element("dt");
      dt0.textContent = "Machine Status:";
      dd0 = element("dd");
      t4 = text(ctx[1]);
      dt1 = element("dt");
      dt1.textContent = "Machine Available:";
      dd1 = element("dd");
      t6 = text(t6_value);
      t7 = space();
      create_component(formgroup.$$.fragment);
      t8 = space();
      hr1 = element("hr");
      attr(dt0, "class", "col-3");
      attr(dd0, "class", "col-3");
      attr(dt1, "class", "col-3");
      attr(dd1, "class", "col-3");
      attr(dl, "class", "row");
    },
    m(target, anchor) {
      insert(target, hr0, anchor);
      insert(target, t0, anchor);
      insert(target, h5, anchor);
      insert(target, t2, anchor);
      insert(target, dl, anchor);
      append(dl, dt0);
      append(dl, dd0);
      append(dd0, t4);
      append(dl, dt1);
      append(dl, dd1);
      append(dd1, t6);
      insert(target, t7, anchor);
      mount_component(formgroup, target, anchor);
      insert(target, t8, anchor);
      insert(target, hr1, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (!current || dirty & 2)
        set_data(t4, ctx2[1]);
      if ((!current || dirty & 1) && t6_value !== (t6_value = ctx2[0].available + ""))
        set_data(t6, t6_value);
      const formgroup_changes = {};
      if (dirty & 9) {
        formgroup_changes.$$scope = {dirty, ctx: ctx2};
      }
      formgroup.$set(formgroup_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(formgroup.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(formgroup.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(hr0);
      if (detaching)
        detach(t0);
      if (detaching)
        detach(h5);
      if (detaching)
        detach(t2);
      if (detaching)
        detach(dl);
      if (detaching)
        detach(t7);
      destroy_component(formgroup, detaching);
      if (detaching)
        detach(t8);
      if (detaching)
        detach(hr1);
    }
  };
}
function instance3($$self, $$props, $$invalidate) {
  let $machine;
  component_subscribe($$self, machine_store_default, ($$value) => $$invalidate(0, $machine = $$value));
  let status = "idle";
  function input_checked_binding(value2) {
    if ($$self.$$.not_equal($machine.available, value2)) {
      $machine.available = value2;
      machine_store_default.set($machine);
    }
  }
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 1) {
      $: {
        if ($machine.gcode) {
          set_store_value(machine_store_default, $machine.available = false, $machine);
          $$invalidate(1, status = "printing");
          setTimeout(() => {
            $$invalidate(1, status = "idle");
            set_store_value(machine_store_default, $machine.gcode = "", $machine);
          }, 5e3);
        }
      }
    }
  };
  return [$machine, status, input_checked_binding];
}
var Dummy = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance3, create_fragment3, safe_not_equal, {});
  }
};
var Dummy_svelte_default = Dummy;

// docs/dist/MachineAgent.svelte.js
function create_if_block_111(ctx) {
  let t_value = ctx[2].connected + "";
  let t;
  return {
    c() {
      t = text(t_value);
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & 4 && t_value !== (t_value = ctx2[2].connected + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_if_block3(ctx) {
  let t_value = ctx[2].id + "";
  let t;
  return {
    c() {
      t = text(t_value);
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & 4 && t_value !== (t_value = ctx2[2].id + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot_82(ctx) {
  let t;
  return {
    c() {
      t = text("Access Key");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot_72(ctx) {
  let inputgrouptext;
  let t;
  let input;
  let updating_value;
  let current;
  inputgrouptext = new InputGroupText({
    props: {
      $$slots: {default: [create_default_slot_82]},
      $$scope: {ctx}
    }
  });
  function input_value_binding(value2) {
    ctx[6](value2);
  }
  let input_props = {
    type: "text",
    invalid: !ctx[0],
    feedback: "Access Key Required"
  };
  if (ctx[0] !== void 0) {
    input_props.value = ctx[0];
  }
  input = new Input({props: input_props});
  binding_callbacks.push(() => bind(input, "value", input_value_binding));
  return {
    c() {
      create_component(inputgrouptext.$$.fragment);
      t = space();
      create_component(input.$$.fragment);
    },
    m(target, anchor) {
      mount_component(inputgrouptext, target, anchor);
      insert(target, t, anchor);
      mount_component(input, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const inputgrouptext_changes = {};
      if (dirty & 32768) {
        inputgrouptext_changes.$$scope = {dirty, ctx: ctx2};
      }
      inputgrouptext.$set(inputgrouptext_changes);
      const input_changes = {};
      if (dirty & 1)
        input_changes.invalid = !ctx2[0];
      if (!updating_value && dirty & 1) {
        updating_value = true;
        input_changes.value = ctx2[0];
        add_flush_callback(() => updating_value = false);
      }
      input.$set(input_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(inputgrouptext.$$.fragment, local);
      transition_in(input.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(inputgrouptext.$$.fragment, local);
      transition_out(input.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(inputgrouptext, detaching);
      if (detaching)
        detach(t);
      destroy_component(input, detaching);
    }
  };
}
function create_default_slot_62(ctx) {
  let inputgroup;
  let current;
  inputgroup = new InputGroup({
    props: {
      $$slots: {default: [create_default_slot_72]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      create_component(inputgroup.$$.fragment);
    },
    m(target, anchor) {
      mount_component(inputgroup, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const inputgroup_changes = {};
      if (dirty & 32769) {
        inputgroup_changes.$$scope = {dirty, ctx: ctx2};
      }
      inputgroup.$set(inputgroup_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(inputgroup.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(inputgroup.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(inputgroup, detaching);
    }
  };
}
function create_default_slot_52(ctx) {
  let t;
  return {
    c() {
      t = text("Group");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot_42(ctx) {
  let inputgrouptext;
  let t;
  let input;
  let updating_value;
  let current;
  inputgrouptext = new InputGroupText({
    props: {
      $$slots: {default: [create_default_slot_52]},
      $$scope: {ctx}
    }
  });
  function input_value_binding_1(value2) {
    ctx[7](value2);
  }
  let input_props = {
    type: "text",
    invalid: !ctx[1],
    feedback: "Group Required"
  };
  if (ctx[1] !== void 0) {
    input_props.value = ctx[1];
  }
  input = new Input({props: input_props});
  binding_callbacks.push(() => bind(input, "value", input_value_binding_1));
  return {
    c() {
      create_component(inputgrouptext.$$.fragment);
      t = space();
      create_component(input.$$.fragment);
    },
    m(target, anchor) {
      mount_component(inputgrouptext, target, anchor);
      insert(target, t, anchor);
      mount_component(input, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const inputgrouptext_changes = {};
      if (dirty & 32768) {
        inputgrouptext_changes.$$scope = {dirty, ctx: ctx2};
      }
      inputgrouptext.$set(inputgrouptext_changes);
      const input_changes = {};
      if (dirty & 2)
        input_changes.invalid = !ctx2[1];
      if (!updating_value && dirty & 2) {
        updating_value = true;
        input_changes.value = ctx2[1];
        add_flush_callback(() => updating_value = false);
      }
      input.$set(input_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(inputgrouptext.$$.fragment, local);
      transition_in(input.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(inputgrouptext.$$.fragment, local);
      transition_out(input.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(inputgrouptext, detaching);
      if (detaching)
        detach(t);
      destroy_component(input, detaching);
    }
  };
}
function create_default_slot_32(ctx) {
  let inputgroup;
  let current;
  inputgroup = new InputGroup({
    props: {
      $$slots: {default: [create_default_slot_42]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      create_component(inputgroup.$$.fragment);
    },
    m(target, anchor) {
      mount_component(inputgroup, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const inputgroup_changes = {};
      if (dirty & 32770) {
        inputgroup_changes.$$scope = {dirty, ctx: ctx2};
      }
      inputgroup.$set(inputgroup_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(inputgroup.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(inputgroup.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(inputgroup, detaching);
    }
  };
}
function create_default_slot_22(ctx) {
  let t;
  return {
    c() {
      t = text("Connect");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot_110(ctx) {
  let t;
  return {
    c() {
      t = text("Disconnect");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot4(ctx) {
  let button0;
  let t;
  let button1;
  let current;
  button0 = new Button({
    props: {
      color: "primary",
      disabled: ctx[3],
      $$slots: {default: [create_default_slot_22]},
      $$scope: {ctx}
    }
  });
  button0.$on("click", ctx[4]);
  button1 = new Button({
    props: {
      color: "danger",
      disabled: !ctx[3],
      $$slots: {default: [create_default_slot_110]},
      $$scope: {ctx}
    }
  });
  button1.$on("click", ctx[5]);
  return {
    c() {
      create_component(button0.$$.fragment);
      t = space();
      create_component(button1.$$.fragment);
    },
    m(target, anchor) {
      mount_component(button0, target, anchor);
      insert(target, t, anchor);
      mount_component(button1, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const button0_changes = {};
      if (dirty & 8)
        button0_changes.disabled = ctx2[3];
      if (dirty & 32768) {
        button0_changes.$$scope = {dirty, ctx: ctx2};
      }
      button0.$set(button0_changes);
      const button1_changes = {};
      if (dirty & 8)
        button1_changes.disabled = !ctx2[3];
      if (dirty & 32768) {
        button1_changes.$$scope = {dirty, ctx: ctx2};
      }
      button1.$set(button1_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(button0.$$.fragment, local);
      transition_in(button1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button0.$$.fragment, local);
      transition_out(button1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(button0, detaching);
      if (detaching)
        detach(t);
      destroy_component(button1, detaching);
    }
  };
}
function create_fragment4(ctx) {
  let h5;
  let t1;
  let dl;
  let dt0;
  let dd0;
  let t3;
  let dt1;
  let dd1;
  let t5;
  let formgroup0;
  let t6;
  let formgroup1;
  let t7;
  let formgroup2;
  let current;
  let if_block0 = ctx[2] && create_if_block_111(ctx);
  let if_block1 = ctx[2] && create_if_block3(ctx);
  formgroup0 = new FormGroup({
    props: {
      $$slots: {default: [create_default_slot_62]},
      $$scope: {ctx}
    }
  });
  formgroup1 = new FormGroup({
    props: {
      $$slots: {default: [create_default_slot_32]},
      $$scope: {ctx}
    }
  });
  formgroup2 = new FormGroup({
    props: {
      $$slots: {default: [create_default_slot4]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      h5 = element("h5");
      h5.textContent = "Broker Machine";
      t1 = space();
      dl = element("dl");
      dt0 = element("dt");
      dt0.textContent = "Socket Status:";
      dd0 = element("dd");
      if (if_block0)
        if_block0.c();
      t3 = space();
      dt1 = element("dt");
      dt1.textContent = "Socket Id:";
      dd1 = element("dd");
      if (if_block1)
        if_block1.c();
      t5 = space();
      create_component(formgroup0.$$.fragment);
      t6 = space();
      create_component(formgroup1.$$.fragment);
      t7 = space();
      create_component(formgroup2.$$.fragment);
      attr(dt0, "class", "col-3");
      attr(dd0, "class", "col-3");
      attr(dt1, "class", "col-3");
      attr(dd1, "class", "col-3");
      attr(dl, "class", "row");
    },
    m(target, anchor) {
      insert(target, h5, anchor);
      insert(target, t1, anchor);
      insert(target, dl, anchor);
      append(dl, dt0);
      append(dl, dd0);
      if (if_block0)
        if_block0.m(dd0, null);
      append(dd0, t3);
      append(dl, dt1);
      append(dl, dd1);
      if (if_block1)
        if_block1.m(dd1, null);
      insert(target, t5, anchor);
      mount_component(formgroup0, target, anchor);
      insert(target, t6, anchor);
      mount_component(formgroup1, target, anchor);
      insert(target, t7, anchor);
      mount_component(formgroup2, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (ctx2[2]) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
        } else {
          if_block0 = create_if_block_111(ctx2);
          if_block0.c();
          if_block0.m(dd0, t3);
        }
      } else if (if_block0) {
        if_block0.d(1);
        if_block0 = null;
      }
      if (ctx2[2]) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
        } else {
          if_block1 = create_if_block3(ctx2);
          if_block1.c();
          if_block1.m(dd1, null);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
      const formgroup0_changes = {};
      if (dirty & 32769) {
        formgroup0_changes.$$scope = {dirty, ctx: ctx2};
      }
      formgroup0.$set(formgroup0_changes);
      const formgroup1_changes = {};
      if (dirty & 32770) {
        formgroup1_changes.$$scope = {dirty, ctx: ctx2};
      }
      formgroup1.$set(formgroup1_changes);
      const formgroup2_changes = {};
      if (dirty & 32776) {
        formgroup2_changes.$$scope = {dirty, ctx: ctx2};
      }
      formgroup2.$set(formgroup2_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(formgroup0.$$.fragment, local);
      transition_in(formgroup1.$$.fragment, local);
      transition_in(formgroup2.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(formgroup0.$$.fragment, local);
      transition_out(formgroup1.$$.fragment, local);
      transition_out(formgroup2.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(h5);
      if (detaching)
        detach(t1);
      if (detaching)
        detach(dl);
      if (if_block0)
        if_block0.d();
      if (if_block1)
        if_block1.d();
      if (detaching)
        detach(t5);
      destroy_component(formgroup0, detaching);
      if (detaching)
        detach(t6);
      destroy_component(formgroup1, detaching);
      if (detaching)
        detach(t7);
      destroy_component(formgroup2, detaching);
    }
  };
}
function instance4($$self, $$props, $$invalidate) {
  let $machine;
  component_subscribe($$self, machine_store_default, ($$value) => $$invalidate(10, $machine = $$value));
  let token = "";
  let group = "";
  let socket;
  let isConnected = false;
  let interval;
  let jobs = [];
  const connect2 = () => {
    if (!token || !group) {
      return;
    }
    const url2 = "https://www.workshop-jobs.com";
    const ioConfig = {
      auth: {token},
      extraHeaders: {
        "agent-type": "machine",
        "group-key": group
      },
      path: "/socket/"
    };
    $$invalidate(2, socket = lookup$1(url2, ioConfig).on(MessageProtocols.CONNECT, handleConnect).on(MessageProtocols.DIRECT, handleDirect).on(MessageProtocols.MESSAGE_ERROR, (msg) => console.log(msg)).on(MessageProtocols.CONNECT_ERROR, handleConnectionError));
  };
  const disconnect2 = () => {
    socket.close();
    $$invalidate(3, isConnected = false);
    $$invalidate(2, socket = void 0);
    clearInterval(interval);
  };
  const handleConnect = function() {
    console.log("Handling Connect");
    $$invalidate(3, isConnected = true);
    $$invalidate(2, socket = this);
    interval = setInterval(() => {
      console.log(`|- MachineAgent: loop, Available: ${$machine.available}`);
      if ($machine.available) {
        const msg = {
          fromId: socket.id,
          toId: "",
          subject: MessageSubjects.MACHINE_IS_LOOKING_FOR_JOBS,
          body: {machineType: $machine.machineType}
        };
        socket.emit(MessageProtocols.ALL_JOBS, msg);
        setTimeout(() => {
          selectJob();
        }, 3e3);
      }
    }, 5e3);
  };
  const handleDirect = function(msg) {
    console.log("|- MachineAgent: Received a direct message");
    if (msg.subject == MessageSubjects.JOB_IS_AVAILABLE) {
      jobs.push(msg);
    }
    if (msg.subject == MessageSubjects.JOB_HAS_ACCEPTED_MACHINES_OFFER) {
      console.log("|- MachineAgent: Passing on the GCode");
      jobs = [];
      set_store_value(machine_store_default, $machine.gcode = msg.body.gcode, $machine);
    }
    if (msg.subject == MessageSubjects.JOB_HAS_DECLINED_MACHINES_OFFER) {
      jobs = [];
    }
  };
  const handleConnectionError = function() {
    console.log("Connection Error");
  };
  const selectJob = () => {
    if (jobs.length > 0) {
      const job2 = jobs[0];
      const msg = {
        fromId: socket.id,
        toId: job2.fromId,
        subject: MessageSubjects.MACHINE_HAS_CHOSEN_A_JOB,
        body: {machineType: $machine.machineType}
      };
      socket.emit(MessageProtocols.DIRECT, msg);
    }
  };
  function input_value_binding(value2) {
    token = value2;
    $$invalidate(0, token);
  }
  function input_value_binding_1(value2) {
    group = value2;
    $$invalidate(1, group);
  }
  return [
    token,
    group,
    socket,
    isConnected,
    connect2,
    disconnect2,
    input_value_binding,
    input_value_binding_1
  ];
}
var MachineAgent = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance4, create_fragment4, safe_not_equal, {});
  }
};
var MachineAgent_svelte_default = MachineAgent;

// docs/_snowpack/pkg/common/browser-1714d5e6.js
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function createCommonjsModule(fn, basedir, module) {
  return module = {
    path: basedir,
    exports: {},
    require: function(path, base2) {
      return commonjsRequire(path, base2 === void 0 || base2 === null ? module.path : base2);
    }
  }, fn(module, module.exports), module.exports;
}
function commonjsRequire() {
  throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");
}
var browserPonyfill = createCommonjsModule(function(module, exports) {
  var global2 = typeof self !== "undefined" ? self : commonjsGlobal;
  var __self__ = function() {
    function F() {
      this.fetch = false;
      this.DOMException = global2.DOMException;
    }
    F.prototype = global2;
    return new F();
  }();
  (function(self2) {
    var irrelevant = function(exports2) {
      var support = {
        searchParams: "URLSearchParams" in self2,
        iterable: "Symbol" in self2 && "iterator" in Symbol,
        blob: "FileReader" in self2 && "Blob" in self2 && function() {
          try {
            new Blob();
            return true;
          } catch (e) {
            return false;
          }
        }(),
        formData: "FormData" in self2,
        arrayBuffer: "ArrayBuffer" in self2
      };
      function isDataView(obj) {
        return obj && DataView.prototype.isPrototypeOf(obj);
      }
      if (support.arrayBuffer) {
        var viewClasses = [
          "[object Int8Array]",
          "[object Uint8Array]",
          "[object Uint8ClampedArray]",
          "[object Int16Array]",
          "[object Uint16Array]",
          "[object Int32Array]",
          "[object Uint32Array]",
          "[object Float32Array]",
          "[object Float64Array]"
        ];
        var isArrayBufferView = ArrayBuffer.isView || function(obj) {
          return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
        };
      }
      function normalizeName(name) {
        if (typeof name !== "string") {
          name = String(name);
        }
        if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
          throw new TypeError("Invalid character in header field name");
        }
        return name.toLowerCase();
      }
      function normalizeValue(value2) {
        if (typeof value2 !== "string") {
          value2 = String(value2);
        }
        return value2;
      }
      function iteratorFor(items) {
        var iterator = {
          next: function() {
            var value2 = items.shift();
            return {done: value2 === void 0, value: value2};
          }
        };
        if (support.iterable) {
          iterator[Symbol.iterator] = function() {
            return iterator;
          };
        }
        return iterator;
      }
      function Headers(headers) {
        this.map = {};
        if (headers instanceof Headers) {
          headers.forEach(function(value2, name) {
            this.append(name, value2);
          }, this);
        } else if (Array.isArray(headers)) {
          headers.forEach(function(header) {
            this.append(header[0], header[1]);
          }, this);
        } else if (headers) {
          Object.getOwnPropertyNames(headers).forEach(function(name) {
            this.append(name, headers[name]);
          }, this);
        }
      }
      Headers.prototype.append = function(name, value2) {
        name = normalizeName(name);
        value2 = normalizeValue(value2);
        var oldValue = this.map[name];
        this.map[name] = oldValue ? oldValue + ", " + value2 : value2;
      };
      Headers.prototype["delete"] = function(name) {
        delete this.map[normalizeName(name)];
      };
      Headers.prototype.get = function(name) {
        name = normalizeName(name);
        return this.has(name) ? this.map[name] : null;
      };
      Headers.prototype.has = function(name) {
        return this.map.hasOwnProperty(normalizeName(name));
      };
      Headers.prototype.set = function(name, value2) {
        this.map[normalizeName(name)] = normalizeValue(value2);
      };
      Headers.prototype.forEach = function(callback, thisArg) {
        for (var name in this.map) {
          if (this.map.hasOwnProperty(name)) {
            callback.call(thisArg, this.map[name], name, this);
          }
        }
      };
      Headers.prototype.keys = function() {
        var items = [];
        this.forEach(function(value2, name) {
          items.push(name);
        });
        return iteratorFor(items);
      };
      Headers.prototype.values = function() {
        var items = [];
        this.forEach(function(value2) {
          items.push(value2);
        });
        return iteratorFor(items);
      };
      Headers.prototype.entries = function() {
        var items = [];
        this.forEach(function(value2, name) {
          items.push([name, value2]);
        });
        return iteratorFor(items);
      };
      if (support.iterable) {
        Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
      }
      function consumed(body) {
        if (body.bodyUsed) {
          return Promise.reject(new TypeError("Already read"));
        }
        body.bodyUsed = true;
      }
      function fileReaderReady(reader) {
        return new Promise(function(resolve, reject) {
          reader.onload = function() {
            resolve(reader.result);
          };
          reader.onerror = function() {
            reject(reader.error);
          };
        });
      }
      function readBlobAsArrayBuffer(blob) {
        var reader = new FileReader();
        var promise = fileReaderReady(reader);
        reader.readAsArrayBuffer(blob);
        return promise;
      }
      function readBlobAsText(blob) {
        var reader = new FileReader();
        var promise = fileReaderReady(reader);
        reader.readAsText(blob);
        return promise;
      }
      function readArrayBufferAsText(buf) {
        var view = new Uint8Array(buf);
        var chars2 = new Array(view.length);
        for (var i = 0; i < view.length; i++) {
          chars2[i] = String.fromCharCode(view[i]);
        }
        return chars2.join("");
      }
      function bufferClone(buf) {
        if (buf.slice) {
          return buf.slice(0);
        } else {
          var view = new Uint8Array(buf.byteLength);
          view.set(new Uint8Array(buf));
          return view.buffer;
        }
      }
      function Body() {
        this.bodyUsed = false;
        this._initBody = function(body) {
          this._bodyInit = body;
          if (!body) {
            this._bodyText = "";
          } else if (typeof body === "string") {
            this._bodyText = body;
          } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
            this._bodyBlob = body;
          } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
            this._bodyFormData = body;
          } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
            this._bodyText = body.toString();
          } else if (support.arrayBuffer && support.blob && isDataView(body)) {
            this._bodyArrayBuffer = bufferClone(body.buffer);
            this._bodyInit = new Blob([this._bodyArrayBuffer]);
          } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
            this._bodyArrayBuffer = bufferClone(body);
          } else {
            this._bodyText = body = Object.prototype.toString.call(body);
          }
          if (!this.headers.get("content-type")) {
            if (typeof body === "string") {
              this.headers.set("content-type", "text/plain;charset=UTF-8");
            } else if (this._bodyBlob && this._bodyBlob.type) {
              this.headers.set("content-type", this._bodyBlob.type);
            } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
              this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
            }
          }
        };
        if (support.blob) {
          this.blob = function() {
            var rejected = consumed(this);
            if (rejected) {
              return rejected;
            }
            if (this._bodyBlob) {
              return Promise.resolve(this._bodyBlob);
            } else if (this._bodyArrayBuffer) {
              return Promise.resolve(new Blob([this._bodyArrayBuffer]));
            } else if (this._bodyFormData) {
              throw new Error("could not read FormData body as blob");
            } else {
              return Promise.resolve(new Blob([this._bodyText]));
            }
          };
          this.arrayBuffer = function() {
            if (this._bodyArrayBuffer) {
              return consumed(this) || Promise.resolve(this._bodyArrayBuffer);
            } else {
              return this.blob().then(readBlobAsArrayBuffer);
            }
          };
        }
        this.text = function() {
          var rejected = consumed(this);
          if (rejected) {
            return rejected;
          }
          if (this._bodyBlob) {
            return readBlobAsText(this._bodyBlob);
          } else if (this._bodyArrayBuffer) {
            return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
          } else if (this._bodyFormData) {
            throw new Error("could not read FormData body as text");
          } else {
            return Promise.resolve(this._bodyText);
          }
        };
        if (support.formData) {
          this.formData = function() {
            return this.text().then(decode2);
          };
        }
        this.json = function() {
          return this.text().then(JSON.parse);
        };
        return this;
      }
      var methods2 = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
      function normalizeMethod(method) {
        var upcased = method.toUpperCase();
        return methods2.indexOf(upcased) > -1 ? upcased : method;
      }
      function Request2(input, options) {
        options = options || {};
        var body = options.body;
        if (input instanceof Request2) {
          if (input.bodyUsed) {
            throw new TypeError("Already read");
          }
          this.url = input.url;
          this.credentials = input.credentials;
          if (!options.headers) {
            this.headers = new Headers(input.headers);
          }
          this.method = input.method;
          this.mode = input.mode;
          this.signal = input.signal;
          if (!body && input._bodyInit != null) {
            body = input._bodyInit;
            input.bodyUsed = true;
          }
        } else {
          this.url = String(input);
        }
        this.credentials = options.credentials || this.credentials || "same-origin";
        if (options.headers || !this.headers) {
          this.headers = new Headers(options.headers);
        }
        this.method = normalizeMethod(options.method || this.method || "GET");
        this.mode = options.mode || this.mode || null;
        this.signal = options.signal || this.signal;
        this.referrer = null;
        if ((this.method === "GET" || this.method === "HEAD") && body) {
          throw new TypeError("Body not allowed for GET or HEAD requests");
        }
        this._initBody(body);
      }
      Request2.prototype.clone = function() {
        return new Request2(this, {body: this._bodyInit});
      };
      function decode2(body) {
        var form = new FormData();
        body.trim().split("&").forEach(function(bytes) {
          if (bytes) {
            var split = bytes.split("=");
            var name = split.shift().replace(/\+/g, " ");
            var value2 = split.join("=").replace(/\+/g, " ");
            form.append(decodeURIComponent(name), decodeURIComponent(value2));
          }
        });
        return form;
      }
      function parseHeaders(rawHeaders) {
        var headers = new Headers();
        var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
        preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
          var parts2 = line.split(":");
          var key = parts2.shift().trim();
          if (key) {
            var value2 = parts2.join(":").trim();
            headers.append(key, value2);
          }
        });
        return headers;
      }
      Body.call(Request2.prototype);
      function Response(bodyInit, options) {
        if (!options) {
          options = {};
        }
        this.type = "default";
        this.status = options.status === void 0 ? 200 : options.status;
        this.ok = this.status >= 200 && this.status < 300;
        this.statusText = "statusText" in options ? options.statusText : "OK";
        this.headers = new Headers(options.headers);
        this.url = options.url || "";
        this._initBody(bodyInit);
      }
      Body.call(Response.prototype);
      Response.prototype.clone = function() {
        return new Response(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new Headers(this.headers),
          url: this.url
        });
      };
      Response.error = function() {
        var response = new Response(null, {status: 0, statusText: ""});
        response.type = "error";
        return response;
      };
      var redirectStatuses = [301, 302, 303, 307, 308];
      Response.redirect = function(url2, status) {
        if (redirectStatuses.indexOf(status) === -1) {
          throw new RangeError("Invalid status code");
        }
        return new Response(null, {status, headers: {location: url2}});
      };
      exports2.DOMException = self2.DOMException;
      try {
        new exports2.DOMException();
      } catch (err) {
        exports2.DOMException = function(message, name) {
          this.message = message;
          this.name = name;
          var error = Error(message);
          this.stack = error.stack;
        };
        exports2.DOMException.prototype = Object.create(Error.prototype);
        exports2.DOMException.prototype.constructor = exports2.DOMException;
      }
      function fetch(input, init2) {
        return new Promise(function(resolve, reject) {
          var request = new Request2(input, init2);
          if (request.signal && request.signal.aborted) {
            return reject(new exports2.DOMException("Aborted", "AbortError"));
          }
          var xhr = new XMLHttpRequest();
          function abortXhr() {
            xhr.abort();
          }
          xhr.onload = function() {
            var options = {
              status: xhr.status,
              statusText: xhr.statusText,
              headers: parseHeaders(xhr.getAllResponseHeaders() || "")
            };
            options.url = "responseURL" in xhr ? xhr.responseURL : options.headers.get("X-Request-URL");
            var body = "response" in xhr ? xhr.response : xhr.responseText;
            resolve(new Response(body, options));
          };
          xhr.onerror = function() {
            reject(new TypeError("Network request failed"));
          };
          xhr.ontimeout = function() {
            reject(new TypeError("Network request failed"));
          };
          xhr.onabort = function() {
            reject(new exports2.DOMException("Aborted", "AbortError"));
          };
          xhr.open(request.method, request.url, true);
          if (request.credentials === "include") {
            xhr.withCredentials = true;
          } else if (request.credentials === "omit") {
            xhr.withCredentials = false;
          }
          if ("responseType" in xhr && support.blob) {
            xhr.responseType = "blob";
          }
          request.headers.forEach(function(value2, name) {
            xhr.setRequestHeader(name, value2);
          });
          if (request.signal) {
            request.signal.addEventListener("abort", abortXhr);
            xhr.onreadystatechange = function() {
              if (xhr.readyState === 4) {
                request.signal.removeEventListener("abort", abortXhr);
              }
            };
          }
          xhr.send(typeof request._bodyInit === "undefined" ? null : request._bodyInit);
        });
      }
      fetch.polyfill = true;
      if (!self2.fetch) {
        self2.fetch = fetch;
        self2.Headers = Headers;
        self2.Request = Request2;
        self2.Response = Response;
      }
      exports2.Headers = Headers;
      exports2.Request = Request2;
      exports2.Response = Response;
      exports2.fetch = fetch;
      Object.defineProperty(exports2, "__esModule", {value: true});
      return exports2;
    }({});
  })(__self__);
  __self__.fetch.ponyfill = true;
  delete __self__.fetch.polyfill;
  var ctx = __self__;
  exports = ctx.fetch;
  exports.default = ctx.fetch;
  exports.fetch = ctx.fetch;
  exports.Headers = ctx.Headers;
  exports.Request = ctx.Request;
  exports.Response = ctx.Response;
  module.exports = exports;
});
var browser = typeof self == "object" ? self.FormData : window.FormData;

// docs/_snowpack/pkg/octoprint-client.js
var base = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.Base = exports.ResponseError = void 0;
  class ResponseError extends Error {
    constructor(response) {
      super("Check error.response for the response from the server.");
      this.name = "ResponseError";
      this.message = "Check error.response for the response from the server.";
      this.response = response;
    }
  }
  exports.ResponseError = ResponseError;
  class Base {
    constructor(baseURL, apiKey) {
      this.baseURL = baseURL;
      this.apiKey = apiKey;
    }
    async get(url2, bodyArgs) {
      if (typeof bodyArgs != "undefined") {
        bodyArgs = {};
      }
      return (0, browserPonyfill.fetch)(url2, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Api-Key": this.apiKey
        },
        body: JSON.stringify(bodyArgs)
      }).then((r) => {
        if (r.ok) {
          return r.json();
        }
        throw new ResponseError(r);
      });
    }
  }
  exports.Base = Base;
});
var applyMixins_1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.applyMixins = void 0;
  function applyMixins(derivedCtor, constructors) {
    constructors.forEach((baseCtor) => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
        Object.defineProperty(derivedCtor.prototype, name, Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || Object.create(null));
      });
    });
  }
  exports.applyMixins = applyMixins;
});
var general = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.General = void 0;
  class General extends base.Base {
    getVersionInformation() {
      const url2 = `${this.baseURL}/api/version`;
      return this.get(url2);
    }
  }
  exports.General = General;
});
var files = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.Files = void 0;
  class Files extends base.Base {
    getFiles() {
      const url2 = `${this.baseURL}/api/files`;
      return this.get(url2);
    }
    async selectFileAndPrint(file) {
      const url2 = `${this.baseURL}/api/files/local/${file}`;
      const config = {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Api-Key": this.apiKey
        },
        body: JSON.stringify({
          command: "select",
          print: true
        })
      };
      return (0, browserPonyfill.fetch)(url2, config).then((r) => {
        if (r.ok) {
          return true;
        }
        throw new base.ResponseError(r);
      });
    }
    async uploadFileToLocal(gcode) {
      const url2 = `${this.baseURL}/api/files/local`;
      let formData;
      if (typeof window === "undefined") {
        const FormData2 = browser;
        formData = new FormData2();
        formData.append("file", gcode, "octoprint-client.gcode");
      } else {
        const blob = new Blob([gcode], {type: "text/plain"});
        formData = new FormData();
        formData.append("file", blob, "octoprint-client.gcode");
      }
      const config = {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "X-Api-Key": this.apiKey
        },
        body: formData
      };
      return (0, browserPonyfill.fetch)(url2, config).then((r) => {
        if (r.ok) {
          return r.json();
        }
        throw new base.ResponseError(r);
      });
    }
    async uploadFileToSDCard(gcode) {
      const url2 = `${this.baseURL}/api/files/sdcard`;
      let formData;
      if (typeof window === "undefined") {
        const FormData2 = browser;
        formData = new FormData2();
        formData.append("file", gcode, "octoprint-client.gcode");
      } else {
        const blob = new Blob([gcode], {type: "text/plain"});
        formData = new FormData();
        formData.append("file", blob, "octoprint-client.gcode");
      }
      const config = {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "X-Api-Key": this.apiKey
        },
        body: formData
      };
      return (0, browserPonyfill.fetch)(url2, config).then((r) => {
        if (r.ok) {
          return r.json();
        }
        throw new base.ResponseError(r);
      });
    }
  }
  exports.Files = Files;
});
var job = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.Job = void 0;
  class Job2 extends base.Base {
    async issueJobCommand(cmd) {
      const url2 = `${this.baseURL}/api/job`;
      const config = {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Api-Key": this.apiKey
        },
        body: JSON.stringify({
          command: cmd
        })
      };
      return (0, browserPonyfill.fetch)(url2, config).then((r) => {
        if (r.ok) {
          return true;
        }
        throw new base.ResponseError(r);
      });
    }
  }
  exports.Job = Job2;
});
var printer = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.Printer = void 0;
  class Printer extends base.Base {
    getStatus() {
      const url2 = `${this.baseURL}/api/printer`;
      return this.get(url2);
    }
  }
  exports.Printer = Printer;
});
var interfaces = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
});
var interfaces$1 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
});
var enums = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.JobCommands = void 0;
  (function(JobCommands2) {
    JobCommands2["START"] = "start";
    JobCommands2["CANCEL"] = "cancel";
    JobCommands2["RESTART"] = "restart";
  })(exports.JobCommands || (exports.JobCommands = {}));
});
var dist = createCommonjsModule(function(module, exports) {
  var __createBinding = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = {enumerable: true, get: function() {
        return m[k];
      }};
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    o[k2] = m[k];
  });
  var __exportStar = commonjsGlobal && commonjsGlobal.__exportStar || function(m, exports2) {
    for (var p in m)
      if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
        __createBinding(exports2, m, p);
  };
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.ResponseError = exports.OctoPrintClient = void 0;
  class OctoPrintClient2 extends base.Base {
  }
  exports.OctoPrintClient = OctoPrintClient2;
  (0, applyMixins_1.applyMixins)(OctoPrintClient2, [general.General, files.Files, job.Job, printer.Printer]);
  var base_2 = base;
  Object.defineProperty(exports, "ResponseError", {enumerable: true, get: function() {
    return base_2.ResponseError;
  }});
  __exportStar(interfaces, exports);
  __exportStar(interfaces$1, exports);
  __exportStar(enums, exports);
});
var JobCommands = dist.JobCommands;
var OctoPrintClient = dist.OctoPrintClient;

// docs/dist/connectors/Octoprint.svelte.js
function create_default_slot_132(ctx) {
  let t;
  return {
    c() {
      t = text("URL");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot_122(ctx) {
  let inputgrouptext;
  let t;
  let input;
  let updating_value;
  let current;
  inputgrouptext = new InputGroupText({
    props: {
      $$slots: {default: [create_default_slot_132]},
      $$scope: {ctx}
    }
  });
  function input_value_binding(value2) {
    ctx[10](value2);
  }
  let input_props = {
    type: "text",
    invalid: !ctx[0],
    feedback: "URL Required"
  };
  if (ctx[0] !== void 0) {
    input_props.value = ctx[0];
  }
  input = new Input({props: input_props});
  binding_callbacks.push(() => bind(input, "value", input_value_binding));
  return {
    c() {
      create_component(inputgrouptext.$$.fragment);
      t = space();
      create_component(input.$$.fragment);
    },
    m(target, anchor) {
      mount_component(inputgrouptext, target, anchor);
      insert(target, t, anchor);
      mount_component(input, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const inputgrouptext_changes = {};
      if (dirty & 65536) {
        inputgrouptext_changes.$$scope = {dirty, ctx: ctx2};
      }
      inputgrouptext.$set(inputgrouptext_changes);
      const input_changes = {};
      if (dirty & 1)
        input_changes.invalid = !ctx2[0];
      if (!updating_value && dirty & 1) {
        updating_value = true;
        input_changes.value = ctx2[0];
        add_flush_callback(() => updating_value = false);
      }
      input.$set(input_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(inputgrouptext.$$.fragment, local);
      transition_in(input.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(inputgrouptext.$$.fragment, local);
      transition_out(input.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(inputgrouptext, detaching);
      if (detaching)
        detach(t);
      destroy_component(input, detaching);
    }
  };
}
function create_default_slot_112(ctx) {
  let inputgroup;
  let current;
  inputgroup = new InputGroup({
    props: {
      $$slots: {default: [create_default_slot_122]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      create_component(inputgroup.$$.fragment);
    },
    m(target, anchor) {
      mount_component(inputgroup, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const inputgroup_changes = {};
      if (dirty & 65537) {
        inputgroup_changes.$$scope = {dirty, ctx: ctx2};
      }
      inputgroup.$set(inputgroup_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(inputgroup.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(inputgroup.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(inputgroup, detaching);
    }
  };
}
function create_default_slot_102(ctx) {
  let t;
  return {
    c() {
      t = text("API Key");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot_92(ctx) {
  let inputgrouptext;
  let t;
  let input;
  let updating_value;
  let current;
  inputgrouptext = new InputGroupText({
    props: {
      $$slots: {default: [create_default_slot_102]},
      $$scope: {ctx}
    }
  });
  function input_value_binding_1(value2) {
    ctx[11](value2);
  }
  let input_props = {
    type: "text",
    invalid: !ctx[1],
    feedback: "API Key Required"
  };
  if (ctx[1] !== void 0) {
    input_props.value = ctx[1];
  }
  input = new Input({props: input_props});
  binding_callbacks.push(() => bind(input, "value", input_value_binding_1));
  return {
    c() {
      create_component(inputgrouptext.$$.fragment);
      t = space();
      create_component(input.$$.fragment);
    },
    m(target, anchor) {
      mount_component(inputgrouptext, target, anchor);
      insert(target, t, anchor);
      mount_component(input, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const inputgrouptext_changes = {};
      if (dirty & 65536) {
        inputgrouptext_changes.$$scope = {dirty, ctx: ctx2};
      }
      inputgrouptext.$set(inputgrouptext_changes);
      const input_changes = {};
      if (dirty & 2)
        input_changes.invalid = !ctx2[1];
      if (!updating_value && dirty & 2) {
        updating_value = true;
        input_changes.value = ctx2[1];
        add_flush_callback(() => updating_value = false);
      }
      input.$set(input_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(inputgrouptext.$$.fragment, local);
      transition_in(input.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(inputgrouptext.$$.fragment, local);
      transition_out(input.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(inputgrouptext, detaching);
      if (detaching)
        detach(t);
      destroy_component(input, detaching);
    }
  };
}
function create_default_slot_83(ctx) {
  let inputgroup;
  let current;
  inputgroup = new InputGroup({
    props: {
      $$slots: {default: [create_default_slot_92]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      create_component(inputgroup.$$.fragment);
    },
    m(target, anchor) {
      mount_component(inputgroup, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const inputgroup_changes = {};
      if (dirty & 65538) {
        inputgroup_changes.$$scope = {dirty, ctx: ctx2};
      }
      inputgroup.$set(inputgroup_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(inputgroup.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(inputgroup.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(inputgroup, detaching);
    }
  };
}
function create_default_slot_73(ctx) {
  let input0;
  let updating_checked;
  let t;
  let input1;
  let updating_checked_1;
  let current;
  function input0_checked_binding(value2) {
    ctx[12](value2);
  }
  let input0_props = {
    type: "switch",
    label: "Toggle to connect/disconnect printer"
  };
  if (ctx[2] !== void 0) {
    input0_props.checked = ctx[2];
  }
  input0 = new Input({props: input0_props});
  binding_callbacks.push(() => bind(input0, "checked", input0_checked_binding));
  function input1_checked_binding(value2) {
    ctx[13](value2);
  }
  let input1_props = {
    type: "switch",
    label: "Toggle to make available to network"
  };
  if (ctx[3].available !== void 0) {
    input1_props.checked = ctx[3].available;
  }
  input1 = new Input({props: input1_props});
  binding_callbacks.push(() => bind(input1, "checked", input1_checked_binding));
  return {
    c() {
      create_component(input0.$$.fragment);
      t = space();
      create_component(input1.$$.fragment);
    },
    m(target, anchor) {
      mount_component(input0, target, anchor);
      insert(target, t, anchor);
      mount_component(input1, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const input0_changes = {};
      if (!updating_checked && dirty & 4) {
        updating_checked = true;
        input0_changes.checked = ctx2[2];
        add_flush_callback(() => updating_checked = false);
      }
      input0.$set(input0_changes);
      const input1_changes = {};
      if (!updating_checked_1 && dirty & 8) {
        updating_checked_1 = true;
        input1_changes.checked = ctx2[3].available;
        add_flush_callback(() => updating_checked_1 = false);
      }
      input1.$set(input1_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(input0.$$.fragment, local);
      transition_in(input1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(input0.$$.fragment, local);
      transition_out(input1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(input0, detaching);
      if (detaching)
        detach(t);
      destroy_component(input1, detaching);
    }
  };
}
function create_default_slot_63(ctx) {
  let input;
  let mounted;
  let dispose;
  return {
    c() {
      input = element("input");
      attr(input, "class", "form-control");
      attr(input, "type", "file");
    },
    m(target, anchor) {
      insert(target, input, anchor);
      if (!mounted) {
        dispose = listen(input, "change", ctx[14]);
        mounted = true;
      }
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(input);
      mounted = false;
      dispose();
    }
  };
}
function create_default_slot_53(ctx) {
  let formgroup;
  let current;
  formgroup = new FormGroup({
    props: {
      $$slots: {default: [create_default_slot_63]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      create_component(formgroup.$$.fragment);
    },
    m(target, anchor) {
      mount_component(formgroup, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const formgroup_changes = {};
      if (dirty & 65568) {
        formgroup_changes.$$scope = {dirty, ctx: ctx2};
      }
      formgroup.$set(formgroup_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(formgroup.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(formgroup.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(formgroup, detaching);
    }
  };
}
function create_default_slot_43(ctx) {
  let t;
  return {
    c() {
      t = text("Submit G-Code");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot_33(ctx) {
  let t;
  return {
    c() {
      t = text("Cancel Print");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot_23(ctx) {
  let button0;
  let t;
  let button1;
  let current;
  button0 = new Button({
    props: {
      color: "primary",
      $$slots: {default: [create_default_slot_43]},
      $$scope: {ctx}
    }
  });
  button0.$on("click", ctx[6]);
  button1 = new Button({
    props: {
      color: "danger",
      $$slots: {default: [create_default_slot_33]},
      $$scope: {ctx}
    }
  });
  button1.$on("click", ctx[7]);
  return {
    c() {
      create_component(button0.$$.fragment);
      t = space();
      create_component(button1.$$.fragment);
    },
    m(target, anchor) {
      mount_component(button0, target, anchor);
      insert(target, t, anchor);
      mount_component(button1, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const button0_changes = {};
      if (dirty & 65536) {
        button0_changes.$$scope = {dirty, ctx: ctx2};
      }
      button0.$set(button0_changes);
      const button1_changes = {};
      if (dirty & 65536) {
        button1_changes.$$scope = {dirty, ctx: ctx2};
      }
      button1.$set(button1_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(button0.$$.fragment, local);
      transition_in(button1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button0.$$.fragment, local);
      transition_out(button1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(button0, detaching);
      if (detaching)
        detach(t);
      destroy_component(button1, detaching);
    }
  };
}
function create_default_slot_111(ctx) {
  let formgroup;
  let current;
  formgroup = new FormGroup({
    props: {
      $$slots: {default: [create_default_slot_23]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      create_component(formgroup.$$.fragment);
    },
    m(target, anchor) {
      mount_component(formgroup, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const formgroup_changes = {};
      if (dirty & 65536) {
        formgroup_changes.$$scope = {dirty, ctx: ctx2};
      }
      formgroup.$set(formgroup_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(formgroup.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(formgroup.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(formgroup, detaching);
    }
  };
}
function create_default_slot5(ctx) {
  let col0;
  let t;
  let col1;
  let current;
  col0 = new Col({
    props: {
      $$slots: {default: [create_default_slot_53]},
      $$scope: {ctx}
    }
  });
  col1 = new Col({
    props: {
      $$slots: {default: [create_default_slot_111]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      create_component(col0.$$.fragment);
      t = space();
      create_component(col1.$$.fragment);
    },
    m(target, anchor) {
      mount_component(col0, target, anchor);
      insert(target, t, anchor);
      mount_component(col1, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const col0_changes = {};
      if (dirty & 65568) {
        col0_changes.$$scope = {dirty, ctx: ctx2};
      }
      col0.$set(col0_changes);
      const col1_changes = {};
      if (dirty & 65536) {
        col1_changes.$$scope = {dirty, ctx: ctx2};
      }
      col1.$set(col1_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(col0.$$.fragment, local);
      transition_in(col1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(col0.$$.fragment, local);
      transition_out(col1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(col0, detaching);
      if (detaching)
        detach(t);
      destroy_component(col1, detaching);
    }
  };
}
function create_fragment5(ctx) {
  let h50;
  let t1;
  let hr0;
  let t2;
  let dl;
  let dt0;
  let dd0;
  let t4_value = ctx[4].state.text + "";
  let t4;
  let dt1;
  let dd1;
  let t6_value = ctx[3].available + "";
  let t6;
  let dt2;
  let dd2;
  let t8_value = ctx[4].temperature.bed.actual + "";
  let t8;
  let t9;
  let t10_value = ctx[4].temperature.bed.target + "";
  let t10;
  let t11;
  let dt3;
  let dd3;
  let t13_value = ctx[4].temperature.tool0.actual + "";
  let t13;
  let t14;
  let t15_value = ctx[4].temperature.tool0.target + "";
  let t15;
  let t16;
  let t17;
  let h51;
  let t19;
  let formgroup0;
  let t20;
  let formgroup1;
  let t21;
  let formgroup2;
  let t22;
  let hr1;
  let t23;
  let h52;
  let t25;
  let row;
  let current;
  formgroup0 = new FormGroup({
    props: {
      $$slots: {default: [create_default_slot_112]},
      $$scope: {ctx}
    }
  });
  formgroup1 = new FormGroup({
    props: {
      $$slots: {default: [create_default_slot_83]},
      $$scope: {ctx}
    }
  });
  formgroup2 = new FormGroup({
    props: {
      $$slots: {default: [create_default_slot_73]},
      $$scope: {ctx}
    }
  });
  row = new Row({
    props: {
      $$slots: {default: [create_default_slot5]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      h50 = element("h5");
      h50.textContent = "Summary";
      t1 = space();
      hr0 = element("hr");
      t2 = space();
      dl = element("dl");
      dt0 = element("dt");
      dt0.textContent = "Machine Status:";
      dd0 = element("dd");
      t4 = text(t4_value);
      dt1 = element("dt");
      dt1.textContent = "Machine Available:";
      dd1 = element("dd");
      t6 = text(t6_value);
      dt2 = element("dt");
      dt2.textContent = "Bed Temperature:";
      dd2 = element("dd");
      t8 = text(t8_value);
      t9 = text(" (");
      t10 = text(t10_value);
      t11 = text(")\n	");
      dt3 = element("dt");
      dt3.textContent = "Extruder Temperature:";
      dd3 = element("dd");
      t13 = text(t13_value);
      t14 = text(" (");
      t15 = text(t15_value);
      t16 = text(")");
      t17 = space();
      h51 = element("h5");
      h51.textContent = "Connect";
      t19 = space();
      create_component(formgroup0.$$.fragment);
      t20 = space();
      create_component(formgroup1.$$.fragment);
      t21 = space();
      create_component(formgroup2.$$.fragment);
      t22 = space();
      hr1 = element("hr");
      t23 = space();
      h52 = element("h5");
      h52.textContent = "Controls";
      t25 = space();
      create_component(row.$$.fragment);
      attr(dt0, "class", "col-3");
      attr(dd0, "class", "col-3");
      attr(dt1, "class", "col-3");
      attr(dd1, "class", "col-3");
      attr(dt2, "class", "col-3");
      attr(dd2, "class", "col-3");
      attr(dt3, "class", "col-3");
      attr(dd3, "class", "col-3");
      attr(dl, "class", "row");
    },
    m(target, anchor) {
      insert(target, h50, anchor);
      insert(target, t1, anchor);
      insert(target, hr0, anchor);
      insert(target, t2, anchor);
      insert(target, dl, anchor);
      append(dl, dt0);
      append(dl, dd0);
      append(dd0, t4);
      append(dl, dt1);
      append(dl, dd1);
      append(dd1, t6);
      append(dl, dt2);
      append(dl, dd2);
      append(dd2, t8);
      append(dd2, t9);
      append(dd2, t10);
      append(dd2, t11);
      append(dl, dt3);
      append(dl, dd3);
      append(dd3, t13);
      append(dd3, t14);
      append(dd3, t15);
      append(dd3, t16);
      insert(target, t17, anchor);
      insert(target, h51, anchor);
      insert(target, t19, anchor);
      mount_component(formgroup0, target, anchor);
      insert(target, t20, anchor);
      mount_component(formgroup1, target, anchor);
      insert(target, t21, anchor);
      mount_component(formgroup2, target, anchor);
      insert(target, t22, anchor);
      insert(target, hr1, anchor);
      insert(target, t23, anchor);
      insert(target, h52, anchor);
      insert(target, t25, anchor);
      mount_component(row, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      if ((!current || dirty & 16) && t4_value !== (t4_value = ctx2[4].state.text + ""))
        set_data(t4, t4_value);
      if ((!current || dirty & 8) && t6_value !== (t6_value = ctx2[3].available + ""))
        set_data(t6, t6_value);
      if ((!current || dirty & 16) && t8_value !== (t8_value = ctx2[4].temperature.bed.actual + ""))
        set_data(t8, t8_value);
      if ((!current || dirty & 16) && t10_value !== (t10_value = ctx2[4].temperature.bed.target + ""))
        set_data(t10, t10_value);
      if ((!current || dirty & 16) && t13_value !== (t13_value = ctx2[4].temperature.tool0.actual + ""))
        set_data(t13, t13_value);
      if ((!current || dirty & 16) && t15_value !== (t15_value = ctx2[4].temperature.tool0.target + ""))
        set_data(t15, t15_value);
      const formgroup0_changes = {};
      if (dirty & 65537) {
        formgroup0_changes.$$scope = {dirty, ctx: ctx2};
      }
      formgroup0.$set(formgroup0_changes);
      const formgroup1_changes = {};
      if (dirty & 65538) {
        formgroup1_changes.$$scope = {dirty, ctx: ctx2};
      }
      formgroup1.$set(formgroup1_changes);
      const formgroup2_changes = {};
      if (dirty & 65548) {
        formgroup2_changes.$$scope = {dirty, ctx: ctx2};
      }
      formgroup2.$set(formgroup2_changes);
      const row_changes = {};
      if (dirty & 65568) {
        row_changes.$$scope = {dirty, ctx: ctx2};
      }
      row.$set(row_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(formgroup0.$$.fragment, local);
      transition_in(formgroup1.$$.fragment, local);
      transition_in(formgroup2.$$.fragment, local);
      transition_in(row.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(formgroup0.$$.fragment, local);
      transition_out(formgroup1.$$.fragment, local);
      transition_out(formgroup2.$$.fragment, local);
      transition_out(row.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(h50);
      if (detaching)
        detach(t1);
      if (detaching)
        detach(hr0);
      if (detaching)
        detach(t2);
      if (detaching)
        detach(dl);
      if (detaching)
        detach(t17);
      if (detaching)
        detach(h51);
      if (detaching)
        detach(t19);
      destroy_component(formgroup0, detaching);
      if (detaching)
        detach(t20);
      destroy_component(formgroup1, detaching);
      if (detaching)
        detach(t21);
      destroy_component(formgroup2, detaching);
      if (detaching)
        detach(t22);
      if (detaching)
        detach(hr1);
      if (detaching)
        detach(t23);
      if (detaching)
        detach(h52);
      if (detaching)
        detach(t25);
      destroy_component(row, detaching);
    }
  };
}
function instance5($$self, $$props, $$invalidate) {
  let $machine;
  component_subscribe($$self, machine_store_default, ($$value) => $$invalidate(3, $machine = $$value));
  const defaultStats = () => {
    return {
      state: {text: "Not Connected"},
      temperature: {
        bed: {actual: 0, target: 0},
        tool0: {actual: 0, target: 0}
      }
    };
  };
  let url2 = "";
  let token = "";
  let stats = defaultStats();
  let statsInterval;
  let client = null;
  let connect2 = false;
  let files2;
  const submitGcode = () => {
    if (files2) {
      const reader = new FileReader();
      reader.onload = function(event) {
        let g = event.target.result;
        client.uploadFileToLocal(g).then(() => {
          console.log("gcode uploaded");
          client.selectFileAndPrint("octoprint-client.gcode").then(() => {
            console.log("print command issued");
          });
        });
      };
      reader.readAsText(files2[0]);
    }
  };
  const cancel = () => {
    if (client) {
      client.issueJobCommand(JobCommands.CANCEL);
    }
  };
  function input_value_binding(value2) {
    url2 = value2;
    $$invalidate(0, url2);
  }
  function input_value_binding_1(value2) {
    token = value2;
    $$invalidate(1, token);
  }
  function input0_checked_binding(value2) {
    connect2 = value2;
    $$invalidate(2, connect2);
  }
  function input1_checked_binding(value2) {
    if ($$self.$$.not_equal($machine.available, value2)) {
      $machine.available = value2;
      machine_store_default.set($machine);
    }
  }
  function input_change_handler() {
    files2 = this.files;
    $$invalidate(5, files2);
  }
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 519) {
      $:
        if (connect2 && !client) {
          console.log("|- Connecting to Octoprint");
          $$invalidate(9, client = new OctoPrintClient(url2, token));
          $$invalidate(8, statsInterval = setInterval(async () => {
            $$invalidate(4, stats = await client.getStatus());
          }, 1e3));
        }
    }
    if ($$self.$$.dirty & 772) {
      $:
        if (!connect2 && client) {
          console.log("|- Disconnecting from Octoprint");
          $$invalidate(9, client = null);
          clearInterval(statsInterval);
          $$invalidate(4, stats = defaultStats());
        }
    }
    if ($$self.$$.dirty & 520) {
      $:
        if ($machine.gcode) {
          set_store_value(machine_store_default, $machine.available = false, $machine);
          client.uploadFileToLocal($machine.gcode).then(() => {
            console.log("gcode uploaded");
            client.selectFileAndPrint("octoprint-client.gcode").then(() => {
              console.log("print command issued");
              set_store_value(machine_store_default, $machine.gcode = "", $machine);
            });
          });
        }
    }
  };
  return [
    url2,
    token,
    connect2,
    $machine,
    stats,
    files2,
    submitGcode,
    cancel,
    statsInterval,
    client,
    input_value_binding,
    input_value_binding_1,
    input0_checked_binding,
    input1_checked_binding,
    input_change_handler
  ];
}
var Octoprint = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance5, create_fragment5, safe_not_equal, {});
  }
};
var Octoprint_svelte_default = Octoprint;

// docs/_snowpack/pkg/@jamesgopsill/ultimaker-client.js
var word = "[a-fA-F\\d:]";
var b = (options) => options && options.includeBoundaries ? `(?:(?<=\\s|^)(?=${word})|(?<=${word})(?=\\s|$))` : "";
var v4 = "(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}";
var v6seg = "[a-fA-F\\d]{1,4}";
var v6 = `
(?:
(?:${v6seg}:){7}(?:${v6seg}|:)|                                    // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8
(?:${v6seg}:){6}(?:${v4}|:${v6seg}|:)|                             // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4
(?:${v6seg}:){5}(?::${v4}|(?::${v6seg}){1,2}|:)|                   // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4
(?:${v6seg}:){4}(?:(?::${v6seg}){0,1}:${v4}|(?::${v6seg}){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4
(?:${v6seg}:){3}(?:(?::${v6seg}){0,2}:${v4}|(?::${v6seg}){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4
(?:${v6seg}:){2}(?:(?::${v6seg}){0,3}:${v4}|(?::${v6seg}){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4
(?:${v6seg}:){1}(?:(?::${v6seg}){0,4}:${v4}|(?::${v6seg}){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4
(?::(?:(?::${v6seg}){0,5}:${v4}|(?::${v6seg}){1,7}|:))             // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4
)(?:%[0-9a-zA-Z]{1,})?                                             // %eth0            %1
`.replace(/\s*\/\/.*$/gm, "").replace(/\n/g, "").trim();
var v46Exact = new RegExp(`(?:^${v4}$)|(?:^${v6}$)`);
var v4exact = new RegExp(`^${v4}$`);
var v6exact = new RegExp(`^${v6}$`);
var ip = (options) => options && options.exact ? v46Exact : new RegExp(`(?:${b(options)}${v4}${b(options)})|(?:${b(options)}${v6}${b(options)})`, "g");
ip.v4 = (options) => options && options.exact ? v4exact : new RegExp(`${b(options)}${v4}${b(options)}`, "g");
ip.v6 = (options) => options && options.exact ? v6exact : new RegExp(`${b(options)}${v6}${b(options)}`, "g");
var ipRegex = ip;
var isIp = (string) => ipRegex({exact: true}).test(string);
isIp.v4 = (string) => ipRegex.v4({exact: true}).test(string);
isIp.v6 = (string) => ipRegex.v6({exact: true}).test(string);
isIp.version = (string) => isIp(string) ? isIp.v4(string) ? 4 : 6 : void 0;
var isIp_1 = isIp;
var methods = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.getObjectMethods = exports.getMethods = void 0;
  exports.getMethods = [
    {
      name: "getAirManager",
      endpoint: "api/v1/airmanager",
      expects: "object"
    },
    {
      name: "getEventHistory",
      endpoint: "api/v1/history/events",
      expects: "object"
    },
    {
      name: "getJobHistory",
      endpoint: "api/v1/history/print_jobs",
      expects: "object"
    },
    {
      name: "getJob",
      endpoint: "api/v1/print_job",
      expects: "object"
    },
    {
      name: "getJobUUID",
      endpoint: "api/v1/print_job/uuid",
      expects: "string"
    },
    {
      name: "getJobTimeTotal",
      endpoint: "api/v1/print_job/time_total",
      expects: "number"
    },
    {
      name: "getJobTimeElapsed",
      endpoint: "api/v1/print_job/time_elapsed",
      expects: "number"
    },
    {
      name: "getJobState",
      endpoint: "api/v1/print_job/state",
      expects: "string"
    },
    {
      name: "getJobSource",
      endpoint: "api/v1/print_job/source",
      expects: "string"
    },
    {
      name: "getJobSourceUser",
      endpoint: "api/v1/print_job/source_user",
      expects: "string"
    },
    {
      name: "getJobSourceApplication",
      endpoint: "api/v1/print_job/source_application",
      expects: "string"
    },
    {
      name: "getJobResult",
      endpoint: "api/v1/print_job/result",
      expects: "string"
    },
    {
      name: "getJobReprintOriginalUUID",
      endpoint: "api/v1/print_job/reprint_original_uuid",
      expects: "string"
    },
    {
      name: "getJobProgress",
      endpoint: "api/v1/print_job/progress",
      expects: "number"
    },
    {
      name: "getJobPauseSource",
      endpoint: "api/v1/print_job/pause_source",
      expects: "string"
    },
    {
      name: "getJobName",
      endpoint: "api/v1/print_job/name",
      expects: "string"
    },
    {
      name: "getJobDateTimeStarted",
      endpoint: "api/v1/print_job/datetime_started",
      expects: "string"
    },
    {
      name: "getJobDateTimeFinished",
      endpoint: "api/v1/print_job/datetime_finished",
      expects: "string"
    },
    {
      name: "getJobDateTimeCleaned",
      endpoint: "api/v1/print_job/datetime_cleaned",
      expects: "string"
    },
    {
      name: "getMaterials",
      endpoint: "api/v1/materials",
      expects: "object"
    },
    {
      name: "getPrinter",
      endpoint: "api/v1/printer",
      expects: "object"
    },
    {
      name: "getPrinterStatus",
      endpoint: "api/v1/printer/status",
      expects: "string"
    },
    {
      name: "getPrinterLED",
      endpoint: "api/v1/printer/led",
      expects: "object"
    },
    {
      name: "getPrinterLEDHue",
      endpoint: "api/v1/printer/led/hue",
      expects: "number"
    },
    {
      name: "getPrinterLEDSaturation",
      endpoint: "api/v1/printer/led/saturation",
      expects: "number"
    },
    {
      name: "getPrinterLEDBrightness",
      endpoint: "api/v1/printer/led/brightness",
      expects: "number"
    },
    {
      name: "getPrinterHeads",
      endpoint: "api/v1/printer/heads",
      expects: "object"
    },
    {
      name: "getPrinterBedTemperature",
      endpoint: "api/v1/printer/bed/temperature",
      expects: "object"
    },
    {
      name: "getPrinterBedPreHeat",
      endpoint: "api/v1/printer/bed/pre_heat",
      expects: "object"
    },
    {
      name: "getPrinterBedType",
      endpoint: "api/v1/printer/bed/type",
      expects: "string"
    },
    {
      name: "getSystem",
      endpoint: "api/v1/system",
      expects: "object"
    },
    {
      name: "getSystemPlatform",
      endpoint: "api/v1/system/platform",
      expects: "string"
    },
    {
      name: "getSystemPlatform",
      endpoint: "api/v1/system/platform",
      expects: "string"
    },
    {
      name: "getSystemFirmware",
      endpoint: "api/v1/system/firmware",
      expects: "string"
    },
    {
      name: "getSystemFirmwareStatus",
      endpoint: "api/v1/system/status",
      expects: "string"
    },
    {
      name: "getSystemFirmwareStable",
      endpoint: "api/v1/system/firmware/stable",
      expects: "string"
    },
    {
      name: "getSystemFirmwareTesting",
      endpoint: "api/v1/system/firmware/testing",
      expects: "string"
    },
    {
      name: "getSystemMemory",
      endpoint: "api/v1/system/memory",
      expects: "object"
    },
    {
      name: "getSystemTime",
      endpoint: "api/v1/system/time",
      expects: "object"
    },
    {
      name: "getSystemName",
      endpoint: "api/v1/system/name",
      expects: "string"
    },
    {
      name: "getSystemCountry",
      endpoint: "api/v1/system/country",
      expects: "string"
    },
    {
      name: "getSystemLanguage",
      endpoint: "api/v1/system/language",
      expects: "string"
    },
    {
      name: "getSystemUptime",
      endpoint: "api/v1/system/uptime",
      expects: "number"
    },
    {
      name: "getSystemType",
      endpoint: "api/v1/system/type",
      expects: "string"
    },
    {
      name: "getSystemVariant",
      endpoint: "api/v1/system/variant",
      expects: "string"
    },
    {
      name: "getSystemHardware",
      endpoint: "api/v1/system/hardware",
      expects: "object"
    },
    {
      name: "getSystemHardwareRevision",
      endpoint: "api/v1/system/hardware/revision",
      expects: "number"
    },
    {
      name: "getSystemHardwareTypeId",
      endpoint: "api/v1/system/hardware/typeid",
      expects: "number"
    },
    {
      name: "getSystemGUID",
      endpoint: "api/v1/system/guid",
      expects: "string"
    }
  ];
  exports.getObjectMethods = [
    {
      name: "getSingleJobHistory",
      endpoint: "api/v1/history/print_jobs"
    },
    {
      name: "getMaterial",
      endpoint: "api/v1/materials"
    },
    {
      name: "getPrinterHead",
      endpoint: "api/v1/printer/heads"
    }
  ];
});
var responseError = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.ResponseError = void 0;
  class ResponseError extends Error {
    constructor(response) {
      super("Check error.response for the response from the server.");
      this.name = "ResponseError";
      this.message = "Check error.response for the response from the server.";
      this.response = response;
    }
  }
  exports.ResponseError = ResponseError;
});
var post = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.postJob = void 0;
  const postJob = async function(jobname, gcode) {
    let formData;
    if (typeof window === "undefined") {
      const FormData2 = browser;
      formData = new FormData2();
      formData.append("jobname", jobname);
      formData.append("file", gcode, "client.gcode");
    } else {
      const blob = new Blob([gcode], {type: "text/plain"});
      formData = new FormData();
      formData.append("jobname", jobname);
      formData.append("file", blob, "client.gcode");
    }
    const url2 = `${this.baseUrl}/api/v1/print_job`;
    return (0, browserPonyfill.fetch)(url2, {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json"
      },
      body: formData
    }).then(async (r) => {
      if (r.ok) {
        return r.json();
      }
      throw new responseError.ResponseError(r);
    });
  };
  exports.postJob = postJob;
});
var put = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.putLED = exports.putJobState = void 0;
  const putJobState = async function(target) {
    const url2 = `${this.baseUrl}/api/v1/print_job/state`;
    const bodyArgs = {
      target
    };
    return this.put(url2, bodyArgs);
  };
  exports.putJobState = putJobState;
  const putLED = async function(hsv) {
    const url2 = `${this.baseUrl}/api/v1/printer/led`;
    const bodyArgs = hsv;
    return this.put(url2, bodyArgs);
  };
  exports.putLED = putLED;
});
var interfaces2 = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.SystemUpdateType = exports.PrinterHeadPosition = exports.UltimakerJobSource = exports.UltimakerJobTargetState = void 0;
  (function(UltimakerJobTargetState2) {
    UltimakerJobTargetState2["ABORT"] = "abort";
    UltimakerJobTargetState2["PAUSE"] = "pause";
    UltimakerJobTargetState2["PRINT"] = "print";
  })(exports.UltimakerJobTargetState || (exports.UltimakerJobTargetState = {}));
  (function(UltimakerJobSource) {
    UltimakerJobSource[UltimakerJobSource["WEB_API"] = 0] = "WEB_API";
    UltimakerJobSource[UltimakerJobSource["CALIBRATION_MENU"] = 1] = "CALIBRATION_MENU";
  })(exports.UltimakerJobSource || (exports.UltimakerJobSource = {}));
  (function(PrinterHeadPosition) {
    PrinterHeadPosition["HOME"] = "home";
  })(exports.PrinterHeadPosition || (exports.PrinterHeadPosition = {}));
  (function(SystemUpdateType) {
    SystemUpdateType["TESTING"] = "testing";
    SystemUpdateType["STABLE"] = "stable";
  })(exports.SystemUpdateType || (exports.SystemUpdateType = {}));
});
var ledColors = createCommonjsModule(function(module, exports) {
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.UltimakerLEDColors = void 0;
  exports.UltimakerLEDColors = {
    RED: {
      hue: 0,
      saturation: 100,
      brightness: 100
    },
    BLUE: {
      hue: 240,
      saturation: 100,
      brightness: 100
    },
    WHITE: {
      hue: 0,
      saturation: 0,
      brightness: 100
    },
    GREEN: {
      hue: 120,
      saturation: 100,
      brightness: 100
    },
    YELLOW: {
      hue: 60,
      saturation: 100,
      brightness: 100
    },
    MAGENTA: {
      hue: 300,
      saturation: 100,
      brightness: 100
    },
    CYAN: {
      hue: 180,
      saturation: 100,
      brightness: 100
    }
  };
});
var dist2 = createCommonjsModule(function(module, exports) {
  var __createBinding = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    Object.defineProperty(o, k2, {enumerable: true, get: function() {
      return m[k];
    }});
  } : function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    o[k2] = m[k];
  });
  var __setModuleDefault = commonjsGlobal && commonjsGlobal.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {enumerable: true, value: v});
  } : function(o, v) {
    o["default"] = v;
  });
  var __importStar = commonjsGlobal && commonjsGlobal.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  var __exportStar = commonjsGlobal && commonjsGlobal.__exportStar || function(m, exports2) {
    for (var p in m)
      if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
        __createBinding(exports2, m, p);
  };
  var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {default: mod};
  };
  Object.defineProperty(exports, "__esModule", {value: true});
  exports.UltimakerClient = exports.ResponseError = exports.UltimakerLEDColors = void 0;
  const is_ip_1 = __importDefault(isIp_1);
  const post$1 = __importStar(post);
  const put$1 = __importStar(put);
  __exportStar(interfaces2, exports);
  Object.defineProperty(exports, "UltimakerLEDColors", {enumerable: true, get: function() {
    return ledColors.UltimakerLEDColors;
  }});
  var response_error_2 = responseError;
  Object.defineProperty(exports, "ResponseError", {enumerable: true, get: function() {
    return response_error_2.ResponseError;
  }});
  class UltimakerClient2 {
    constructor(ip2) {
      if (!is_ip_1.default.v4(ip2)) {
        throw new TypeError("[UltimakerClient] Invalid IP address");
      }
      this.ip = ip2;
      this.baseUrl = "http://" + this.ip;
      for (const method of methods.getMethods) {
        this[method.name] = () => {
          return this.get(`${this.baseUrl}/${method.endpoint}`);
        };
      }
      for (const method of methods.getObjectMethods) {
        this[method.name] = (id) => {
          const url2 = `${this.baseUrl}/${method.endpoint}/${id}`;
          return this.get(url2);
        };
      }
      for (const key of Object.keys(put$1)) {
        this[key] = put$1[key];
      }
      for (const key of Object.keys(post$1)) {
        this[key] = post$1[key];
      }
    }
    async get(url2, bodyArgs) {
      return (0, browserPonyfill.fetch)(url2, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(bodyArgs)
      }).then(async (r) => {
        if (r.ok) {
          const json = await r.json();
          return json;
        }
        throw new responseError.ResponseError(r);
      });
    }
    async put(url2, bodyArgs) {
      return (0, browserPonyfill.fetch)(url2, {
        method: "PUT",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(bodyArgs)
      }).then(async (r) => {
        if (r.ok) {
          const json = await r.json();
          return json;
        }
        throw new responseError.ResponseError(r);
      });
    }
  }
  exports.UltimakerClient = UltimakerClient2;
});
var UltimakerClient = dist2.UltimakerClient;
var UltimakerJobTargetState = dist2.UltimakerJobTargetState;

// docs/dist/connectors/Ultimaker.svelte.js
function create_default_slot_103(ctx) {
  let t;
  return {
    c() {
      t = text("IP Address");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot_93(ctx) {
  let inputgrouptext;
  let t;
  let input;
  let updating_value;
  let current;
  inputgrouptext = new InputGroupText({
    props: {
      $$slots: {default: [create_default_slot_103]},
      $$scope: {ctx}
    }
  });
  function input_value_binding(value2) {
    ctx[11](value2);
  }
  let input_props = {
    type: "text",
    invalid: !ctx[0],
    feedback: "IP Address Required"
  };
  if (ctx[0] !== void 0) {
    input_props.value = ctx[0];
  }
  input = new Input({props: input_props});
  binding_callbacks.push(() => bind(input, "value", input_value_binding));
  return {
    c() {
      create_component(inputgrouptext.$$.fragment);
      t = space();
      create_component(input.$$.fragment);
    },
    m(target, anchor) {
      mount_component(inputgrouptext, target, anchor);
      insert(target, t, anchor);
      mount_component(input, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const inputgrouptext_changes = {};
      if (dirty & 65536) {
        inputgrouptext_changes.$$scope = {dirty, ctx: ctx2};
      }
      inputgrouptext.$set(inputgrouptext_changes);
      const input_changes = {};
      if (dirty & 1)
        input_changes.invalid = !ctx2[0];
      if (!updating_value && dirty & 1) {
        updating_value = true;
        input_changes.value = ctx2[0];
        add_flush_callback(() => updating_value = false);
      }
      input.$set(input_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(inputgrouptext.$$.fragment, local);
      transition_in(input.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(inputgrouptext.$$.fragment, local);
      transition_out(input.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(inputgrouptext, detaching);
      if (detaching)
        detach(t);
      destroy_component(input, detaching);
    }
  };
}
function create_default_slot_84(ctx) {
  let inputgroup;
  let current;
  inputgroup = new InputGroup({
    props: {
      $$slots: {default: [create_default_slot_93]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      create_component(inputgroup.$$.fragment);
    },
    m(target, anchor) {
      mount_component(inputgroup, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const inputgroup_changes = {};
      if (dirty & 65537) {
        inputgroup_changes.$$scope = {dirty, ctx: ctx2};
      }
      inputgroup.$set(inputgroup_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(inputgroup.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(inputgroup.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(inputgroup, detaching);
    }
  };
}
function create_default_slot_74(ctx) {
  let input0;
  let updating_checked;
  let t;
  let input1;
  let updating_checked_1;
  let current;
  function input0_checked_binding(value2) {
    ctx[12](value2);
  }
  let input0_props = {
    type: "switch",
    label: "Toggle to connect/disconnect printer"
  };
  if (ctx[1] !== void 0) {
    input0_props.checked = ctx[1];
  }
  input0 = new Input({props: input0_props});
  binding_callbacks.push(() => bind(input0, "checked", input0_checked_binding));
  function input1_checked_binding(value2) {
    ctx[13](value2);
  }
  let input1_props = {
    type: "switch",
    label: "Toggle to make available to network"
  };
  if (ctx[2].available !== void 0) {
    input1_props.checked = ctx[2].available;
  }
  input1 = new Input({props: input1_props});
  binding_callbacks.push(() => bind(input1, "checked", input1_checked_binding));
  return {
    c() {
      create_component(input0.$$.fragment);
      t = space();
      create_component(input1.$$.fragment);
    },
    m(target, anchor) {
      mount_component(input0, target, anchor);
      insert(target, t, anchor);
      mount_component(input1, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const input0_changes = {};
      if (!updating_checked && dirty & 2) {
        updating_checked = true;
        input0_changes.checked = ctx2[1];
        add_flush_callback(() => updating_checked = false);
      }
      input0.$set(input0_changes);
      const input1_changes = {};
      if (!updating_checked_1 && dirty & 4) {
        updating_checked_1 = true;
        input1_changes.checked = ctx2[2].available;
        add_flush_callback(() => updating_checked_1 = false);
      }
      input1.$set(input1_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(input0.$$.fragment, local);
      transition_in(input1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(input0.$$.fragment, local);
      transition_out(input1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(input0, detaching);
      if (detaching)
        detach(t);
      destroy_component(input1, detaching);
    }
  };
}
function create_default_slot_64(ctx) {
  let input;
  let mounted;
  let dispose;
  return {
    c() {
      input = element("input");
      attr(input, "class", "form-control");
      attr(input, "type", "file");
    },
    m(target, anchor) {
      insert(target, input, anchor);
      if (!mounted) {
        dispose = listen(input, "change", ctx[14]);
        mounted = true;
      }
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(input);
      mounted = false;
      dispose();
    }
  };
}
function create_default_slot_54(ctx) {
  let formgroup;
  let current;
  formgroup = new FormGroup({
    props: {
      $$slots: {default: [create_default_slot_64]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      create_component(formgroup.$$.fragment);
    },
    m(target, anchor) {
      mount_component(formgroup, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const formgroup_changes = {};
      if (dirty & 65600) {
        formgroup_changes.$$scope = {dirty, ctx: ctx2};
      }
      formgroup.$set(formgroup_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(formgroup.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(formgroup.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(formgroup, detaching);
    }
  };
}
function create_default_slot_44(ctx) {
  let t;
  return {
    c() {
      t = text("Submit G-Code");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot_34(ctx) {
  let t;
  return {
    c() {
      t = text("Cancel Print");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot_24(ctx) {
  let button0;
  let t;
  let button1;
  let current;
  button0 = new Button({
    props: {
      color: "primary",
      $$slots: {default: [create_default_slot_44]},
      $$scope: {ctx}
    }
  });
  button0.$on("click", ctx[7]);
  button1 = new Button({
    props: {
      color: "danger",
      $$slots: {default: [create_default_slot_34]},
      $$scope: {ctx}
    }
  });
  button1.$on("click", ctx[8]);
  return {
    c() {
      create_component(button0.$$.fragment);
      t = space();
      create_component(button1.$$.fragment);
    },
    m(target, anchor) {
      mount_component(button0, target, anchor);
      insert(target, t, anchor);
      mount_component(button1, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const button0_changes = {};
      if (dirty & 65536) {
        button0_changes.$$scope = {dirty, ctx: ctx2};
      }
      button0.$set(button0_changes);
      const button1_changes = {};
      if (dirty & 65536) {
        button1_changes.$$scope = {dirty, ctx: ctx2};
      }
      button1.$set(button1_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(button0.$$.fragment, local);
      transition_in(button1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button0.$$.fragment, local);
      transition_out(button1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(button0, detaching);
      if (detaching)
        detach(t);
      destroy_component(button1, detaching);
    }
  };
}
function create_default_slot_113(ctx) {
  let formgroup;
  let current;
  formgroup = new FormGroup({
    props: {
      $$slots: {default: [create_default_slot_24]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      create_component(formgroup.$$.fragment);
    },
    m(target, anchor) {
      mount_component(formgroup, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const formgroup_changes = {};
      if (dirty & 65536) {
        formgroup_changes.$$scope = {dirty, ctx: ctx2};
      }
      formgroup.$set(formgroup_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(formgroup.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(formgroup.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(formgroup, detaching);
    }
  };
}
function create_default_slot6(ctx) {
  let col0;
  let t;
  let col1;
  let current;
  col0 = new Col({
    props: {
      $$slots: {default: [create_default_slot_54]},
      $$scope: {ctx}
    }
  });
  col1 = new Col({
    props: {
      $$slots: {default: [create_default_slot_113]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      create_component(col0.$$.fragment);
      t = space();
      create_component(col1.$$.fragment);
    },
    m(target, anchor) {
      mount_component(col0, target, anchor);
      insert(target, t, anchor);
      mount_component(col1, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const col0_changes = {};
      if (dirty & 65600) {
        col0_changes.$$scope = {dirty, ctx: ctx2};
      }
      col0.$set(col0_changes);
      const col1_changes = {};
      if (dirty & 65536) {
        col1_changes.$$scope = {dirty, ctx: ctx2};
      }
      col1.$set(col1_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(col0.$$.fragment, local);
      transition_in(col1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(col0.$$.fragment, local);
      transition_out(col1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(col0, detaching);
      if (detaching)
        detach(t);
      destroy_component(col1, detaching);
    }
  };
}
function create_fragment6(ctx) {
  let hr0;
  let t0;
  let h50;
  let t2;
  let dl;
  let dt0;
  let dd0;
  let t4;
  let dt1;
  let dd1;
  let t6;
  let dt2;
  let dd2;
  let t8_value = ctx[5].current + "";
  let t8;
  let t9;
  let t10_value = ctx[5].target + "";
  let t10;
  let t11;
  let t12;
  let formgroup0;
  let t13;
  let formgroup1;
  let t14;
  let hr1;
  let t15;
  let h51;
  let t17;
  let row;
  let current;
  formgroup0 = new FormGroup({
    props: {
      $$slots: {default: [create_default_slot_84]},
      $$scope: {ctx}
    }
  });
  formgroup1 = new FormGroup({
    props: {
      $$slots: {default: [create_default_slot_74]},
      $$scope: {ctx}
    }
  });
  row = new Row({
    props: {
      $$slots: {default: [create_default_slot6]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      hr0 = element("hr");
      t0 = space();
      h50 = element("h5");
      h50.textContent = "Ultimaker";
      t2 = space();
      dl = element("dl");
      dt0 = element("dt");
      dt0.textContent = "Machine Name:";
      dd0 = element("dd");
      t4 = text(ctx[3]);
      dt1 = element("dt");
      dt1.textContent = "Machine Status:";
      dd1 = element("dd");
      t6 = text(ctx[4]);
      dt2 = element("dt");
      dt2.textContent = "Bed Temperature:";
      dd2 = element("dd");
      t8 = text(t8_value);
      t9 = text(" (");
      t10 = text(t10_value);
      t11 = text(")");
      t12 = space();
      create_component(formgroup0.$$.fragment);
      t13 = space();
      create_component(formgroup1.$$.fragment);
      t14 = space();
      hr1 = element("hr");
      t15 = space();
      h51 = element("h5");
      h51.textContent = "Controls";
      t17 = space();
      create_component(row.$$.fragment);
      attr(dt0, "class", "col-3");
      attr(dd0, "class", "col-3");
      attr(dt1, "class", "col-3");
      attr(dd1, "class", "col-3");
      attr(dt2, "class", "col-3");
      attr(dd2, "class", "col-3");
      attr(dl, "class", "row");
    },
    m(target, anchor) {
      insert(target, hr0, anchor);
      insert(target, t0, anchor);
      insert(target, h50, anchor);
      insert(target, t2, anchor);
      insert(target, dl, anchor);
      append(dl, dt0);
      append(dl, dd0);
      append(dd0, t4);
      append(dl, dt1);
      append(dl, dd1);
      append(dd1, t6);
      append(dl, dt2);
      append(dl, dd2);
      append(dd2, t8);
      append(dd2, t9);
      append(dd2, t10);
      append(dd2, t11);
      insert(target, t12, anchor);
      mount_component(formgroup0, target, anchor);
      insert(target, t13, anchor);
      mount_component(formgroup1, target, anchor);
      insert(target, t14, anchor);
      insert(target, hr1, anchor);
      insert(target, t15, anchor);
      insert(target, h51, anchor);
      insert(target, t17, anchor);
      mount_component(row, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (!current || dirty & 8)
        set_data(t4, ctx2[3]);
      if (!current || dirty & 16)
        set_data(t6, ctx2[4]);
      if ((!current || dirty & 32) && t8_value !== (t8_value = ctx2[5].current + ""))
        set_data(t8, t8_value);
      if ((!current || dirty & 32) && t10_value !== (t10_value = ctx2[5].target + ""))
        set_data(t10, t10_value);
      const formgroup0_changes = {};
      if (dirty & 65537) {
        formgroup0_changes.$$scope = {dirty, ctx: ctx2};
      }
      formgroup0.$set(formgroup0_changes);
      const formgroup1_changes = {};
      if (dirty & 65542) {
        formgroup1_changes.$$scope = {dirty, ctx: ctx2};
      }
      formgroup1.$set(formgroup1_changes);
      const row_changes = {};
      if (dirty & 65600) {
        row_changes.$$scope = {dirty, ctx: ctx2};
      }
      row.$set(row_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(formgroup0.$$.fragment, local);
      transition_in(formgroup1.$$.fragment, local);
      transition_in(row.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(formgroup0.$$.fragment, local);
      transition_out(formgroup1.$$.fragment, local);
      transition_out(row.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(hr0);
      if (detaching)
        detach(t0);
      if (detaching)
        detach(h50);
      if (detaching)
        detach(t2);
      if (detaching)
        detach(dl);
      if (detaching)
        detach(t12);
      destroy_component(formgroup0, detaching);
      if (detaching)
        detach(t13);
      destroy_component(formgroup1, detaching);
      if (detaching)
        detach(t14);
      if (detaching)
        detach(hr1);
      if (detaching)
        detach(t15);
      if (detaching)
        detach(h51);
      if (detaching)
        detach(t17);
      destroy_component(row, detaching);
    }
  };
}
function instance6($$self, $$props, $$invalidate) {
  let $machine;
  component_subscribe($$self, machine_store_default, ($$value) => $$invalidate(2, $machine = $$value));
  let ip2 = "";
  let connect2 = false;
  let client = null;
  let interval = null;
  let name = "-";
  let status = "-";
  let bedTemp = {current: 0, target: 0};
  let files2;
  const getSystemDetails = async () => {
    const system = await client.getSystem();
    $$invalidate(3, name = system.name);
  };
  const submitGcode = () => {
    if (files2 && client) {
      const reader = new FileReader();
      reader.onload = function(event) {
        let g = event.target.result;
        client.postJob("bam", g);
        $$invalidate(6, files2 = null);
      };
      reader.readAsText(files2[0]);
    }
  };
  const cancel = () => {
    if (client) {
      client.putJobState(UltimakerJobTargetState.ABORT);
    }
  };
  function input_value_binding(value2) {
    ip2 = value2;
    $$invalidate(0, ip2);
  }
  function input0_checked_binding(value2) {
    connect2 = value2;
    $$invalidate(1, connect2);
  }
  function input1_checked_binding(value2) {
    if ($$self.$$.not_equal($machine.available, value2)) {
      $machine.available = value2;
      machine_store_default.set($machine);
    }
  }
  function input_change_handler() {
    files2 = this.files;
    $$invalidate(6, files2);
  }
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 515) {
      $:
        if (connect2 && !client) {
          console.log("|- Connecting to Ultimaker");
          $$invalidate(9, client = new UltimakerClient(ip2));
          getSystemDetails();
          $$invalidate(10, interval = setInterval(async () => {
            $$invalidate(5, bedTemp = await client.getPrinterBedTemperature());
            $$invalidate(4, status = await client.getPrinterStatus());
          }, 1e3));
        }
    }
    if ($$self.$$.dirty & 1538) {
      $:
        if (!connect2 && client) {
          $$invalidate(9, client = null);
          $$invalidate(3, name = "-");
          $$invalidate(4, status = "-");
          $$invalidate(5, bedTemp = {current: 0, target: 0});
          clearInterval(interval);
        }
    }
    if ($$self.$$.dirty & 516) {
      $:
        if ($machine.gcode && client) {
          set_store_value(machine_store_default, $machine.available = false, $machine);
          client.postJob("bam", $machine.gcode).then(() => {
            set_store_value(machine_store_default, $machine.gcode = "", $machine);
          });
        }
    }
  };
  return [
    ip2,
    connect2,
    $machine,
    name,
    status,
    bedTemp,
    files2,
    submitGcode,
    cancel,
    client,
    interval,
    input_value_binding,
    input0_checked_binding,
    input1_checked_binding,
    input_change_handler
  ];
}
var Ultimaker = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance6, create_fragment6, safe_not_equal, {});
  }
};
var Ultimaker_svelte_default = Ultimaker;

// docs/dist/web-serial-printer/connect.js
var connect = async function() {
  if (!("serial" in navigator)) {
    alert("This browser does not support Web Serial.");
    return;
  }
  this.port = await navigator.serial.requestPort().catch((err) => console.log(err));
  await this.port.open({baudRate: this.baud});
  const decoder = new TextDecoderStream();
  this.readableStreamClosed = this.port.readable.pipeTo(decoder.writable);
  const inputStream = decoder.readable;
  this.reader = inputStream.getReader();
  this.read();
  const encoder = new TextEncoderStream();
  this.writableStreamClosed = encoder.readable.pipeTo(this.port.writable);
  this.writer = encoder.writable.getWriter();
  if (this.printerType == "PRUSA_MINI") {
    await this.writer.write("M115\n");
    await this.writer.write("M105\n");
  }
  if (this.printerType == "PRUSA_MK3S") {
    setTimeout(async () => {
      console.log("Prusa MK3S commands");
      await this.writer.write("M115\n");
    }, 2e3);
  }
  this.status.update((v) => "connected");
  this.isConnected = true;
};

// docs/dist/web-serial-printer/disconnect.js
var disconnect = async function() {
  this.reader.cancel();
  await this.readableStreamClosed.catch(() => {
  });
  this.writer.close();
  await this.writableStreamClosed;
  this.port.close();
  this.firmware.update((v) => "");
  this.sourceCodeUrl.update((v) => "");
  this.status.update((v) => "");
  this.protocolVersion.update((v) => "");
  this.uuid.update((v) => "");
  this.machineType.update((v) => "");
};

// docs/dist/web-serial-printer/eval-string.js
var evalString = async function(line) {
  line = line.trim();
  line = line.replace("\r", "");
  console.log("Response:", line);
  if (line.includes("ok")) {
    this.ok = true;
  }
  if (this.printerType == "PRUSA_MINI") {
    if (line.startsWith("FIRMWARE_NAME")) {
      const firmware = line.match(/(?<=FIRMWARE_NAME:).*(?=SOURCE_CODE_URL)/g);
      console.log(firmware);
      this.firmware.update((_) => firmware[0].trim());
      const sourceCodeUrl = line.match(/(?<=SOURCE_CODE_URL:).*(?=PROTO)/g);
      this.sourceCodeUrl.update((_) => sourceCodeUrl[0].trim());
      const protocolVersion = line.match(/(?<=PROTOCOL_VERSION:).*(?=MACHINE_TYPE)/g);
      this.protocolVersion.update((_) => protocolVersion[0].trim());
      const machineType = line.match(/(?<=MACHINE_TYPE:).*(?=EXTRUDER_COUNT)/g);
      this.machineType.update((_) => machineType[0].trim());
      const uuid = line.match(/(?<=UUID:).*/g);
      this.uuid.update((_) => uuid[0].trim());
      return;
    }
    if (line.startsWith("ok T") || line.startsWith("T")) {
      const extruderTempActual = line.match(/(?<=T:).*(?=\/)/g);
      this.extruderTempActual.update((_) => parseFloat(extruderTempActual[0].trim()));
      const extruderTempDemand = line.match(/(?<=\/).*(?=B)/g);
      this.extruderTempDemand.update((_) => parseFloat(extruderTempDemand[0].trim()));
      const bedTempActual = line.match(/(?<=B:).*(?=\/)/g);
      this.bedTempActual.update((_) => parseFloat(bedTempActual[0].trim()));
      const bedTempDemand = line.match(/[0-9.\s]+(?=A:)/g);
      this.bedTempDemand.update((_) => parseFloat(bedTempDemand[0].trim()));
      return;
    }
  }
  if (this.printerType == "PRUSA_MK3S") {
    if (line.startsWith("FIRMWARE_NAME")) {
      const firmware = line.match(/(?<=FIRMWARE_NAME:).*(?=FIRMWARE_URL)/g);
      console.log(firmware);
      this.firmware.update((_) => firmware[0].trim());
      const sourceCodeUrl = line.match(/(?<=FIRMWARE_URL:).*(?=PROTO)/g);
      this.sourceCodeUrl.update((_) => sourceCodeUrl[0].trim());
      const protocolVersion = line.match(/(?<=PROTOCOL_VERSION:).*(?=MACHINE_TYPE)/g);
      this.protocolVersion.update((_) => protocolVersion[0].trim());
      const machineType = line.match(/(?<=MACHINE_TYPE:).*(?=EXTRUDER_COUNT)/g);
      this.machineType.update((_) => machineType[0].trim());
      const uuid = line.match(/(?<=UUID:).*/g);
      this.uuid.update((_) => uuid[0].trim());
      return;
    }
  }
};

// docs/dist/web-serial-printer/read.js
var read = async function() {
  while (true) {
    console.log("Reading the Serial Port");
    const {value: value2, done} = await this.reader.read();
    if (done) {
      this.reader.releaseLock();
      break;
    }
    if (value2) {
      const lines = value2.split("\n");
      let linesAdded = 0;
      this.log[this.log.length - 1] += lines.shift();
      for (const line of lines) {
        linesAdded += 1;
        this.log.push(line);
      }
      for (let i = this.log.length - (linesAdded + 1); i < this.log.length - 1; i++) {
        this.evalString(this.log[i]);
      }
    } else {
      console.log("No carriage return in value");
      this.log[this.log.length - 1] += value2;
    }
    if (this.log.length > 100) {
      this.log.splice(0, this.log.length - 100);
    }
  }
  return;
};

// docs/dist/web-serial-printer/print.js
var print = async function(gcode) {
  console.log("Starting Test Print");
  this.status.update((v) => "printing");
  let gcodeLines = gcode.split("\n");
  for (const line of gcodeLines) {
    if (this.cancel)
      break;
    if (!line.startsWith(";") && line) {
      while (true) {
        if (this.cancel)
          break;
        if (this.ok) {
          console.log("Sending:", line);
          this.writer.write(line + "\n");
          this.ok = false;
          break;
        }
        await this.wait(10);
      }
    }
  }
  if (this.cancel) {
    this.cancelPrint();
  } else {
    this.status.update((v) => "connected");
    console.log("Serial Print Complete");
  }
};

// docs/dist/web-serial-printer/cancel-print.js
var cancelPrint = async function() {
  this.status.update((v) => "canceling");
  console.log("CANCELLING THE PRINT");
  const resetLines = [
    "M108 ; interrupts the printer to listen for gcode",
    "G91 ; use relative positioning",
    "M104 S0 ; Turn off extruder heater",
    "M140 S0 ; Turn off bed heater",
    "G1 X0 Y0 Z20 F1000 ; park print head",
    "M107 ; Turn off fan",
    "M84 ; disable motors"
  ];
  this.ok = true;
  for (const line of resetLines) {
    while (true) {
      if (this.ok) {
        console.log("Canceling:", line);
        this.writer.write(line + "\n");
        this.ok = false;
        break;
      }
      await this.wait(10);
    }
  }
  this.status.update((_) => "connected");
  this.cancel = false;
  return;
};

// docs/dist/web-serial-printer/send-gcode.js
var sendGcode = async function(gcode) {
  for (const line of gcode) {
    if (!line.startsWith(";") && line) {
      while (true) {
        if (this.cancel)
          break;
        if (this.ok) {
          console.log("Sending:", line);
          this.writer.write(line + "\n");
          this.ok = false;
          break;
        }
        await this.wait(10);
      }
    }
  }
};

// docs/dist/web-serial-printer/index.js
var WebSerialPrinter = class {
  constructor(type) {
    this.status = writable("disconnected");
    this.firmware = writable("");
    this.sourceCodeUrl = writable("");
    this.uuid = writable("");
    this.protocolVersion = writable("");
    this.machineType = writable("");
    this.extruderTempActual = writable(0);
    this.extruderTempDemand = writable(0);
    this.bedTempActual = writable(0);
    this.bedTempDemand = writable(0);
    this.isConnected = false;
    this.port = void 0;
    this.writer = void 0;
    this.reader = void 0;
    this.ok = true;
    this.cancel = false;
    this.log = ["", ""];
    this.connect = connect;
    this.disconnect = disconnect;
    this.read = read;
    this.evalString = evalString;
    this.wait = (ms) => new Promise((r, _) => setTimeout(r, ms));
    this.print = print;
    this.cancelPrint = cancelPrint;
    this.sendGcode = sendGcode;
    this.printerType = type;
  }
};

// docs/dist/connectors/WebSerialPrusaMini.svelte.js
function create_default_slot_162(ctx) {
  let t;
  return {
    c() {
      t = text("Baud Rate");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot_152(ctx) {
  let inputgrouptext;
  let t;
  let input;
  let updating_value;
  let current;
  inputgrouptext = new InputGroupText({
    props: {
      $$slots: {default: [create_default_slot_162]},
      $$scope: {ctx}
    }
  });
  function input_value_binding(value2) {
    ctx[26](value2);
  }
  let input_props = {
    type: "text",
    invalid: !ctx[0].baud,
    feedback: "Baud Rate Required"
  };
  if (ctx[0].baud !== void 0) {
    input_props.value = ctx[0].baud;
  }
  input = new Input({props: input_props});
  binding_callbacks.push(() => bind(input, "value", input_value_binding));
  return {
    c() {
      create_component(inputgrouptext.$$.fragment);
      t = space();
      create_component(input.$$.fragment);
    },
    m(target, anchor) {
      mount_component(inputgrouptext, target, anchor);
      insert(target, t, anchor);
      mount_component(input, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const inputgrouptext_changes = {};
      if (dirty[1] & 64) {
        inputgrouptext_changes.$$scope = {dirty, ctx: ctx2};
      }
      inputgrouptext.$set(inputgrouptext_changes);
      const input_changes = {};
      if (dirty[0] & 1)
        input_changes.invalid = !ctx2[0].baud;
      if (!updating_value && dirty[0] & 1) {
        updating_value = true;
        input_changes.value = ctx2[0].baud;
        add_flush_callback(() => updating_value = false);
      }
      input.$set(input_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(inputgrouptext.$$.fragment, local);
      transition_in(input.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(inputgrouptext.$$.fragment, local);
      transition_out(input.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(inputgrouptext, detaching);
      if (detaching)
        detach(t);
      destroy_component(input, detaching);
    }
  };
}
function create_default_slot_142(ctx) {
  let inputgroup;
  let current;
  inputgroup = new InputGroup({
    props: {
      $$slots: {default: [create_default_slot_152]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      create_component(inputgroup.$$.fragment);
    },
    m(target, anchor) {
      mount_component(inputgroup, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const inputgroup_changes = {};
      if (dirty[0] & 1 | dirty[1] & 64) {
        inputgroup_changes.$$scope = {dirty, ctx: ctx2};
      }
      inputgroup.$set(inputgroup_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(inputgroup.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(inputgroup.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(inputgroup, detaching);
    }
  };
}
function create_default_slot_133(ctx) {
  let input0;
  let updating_checked;
  let t;
  let input1;
  let updating_checked_1;
  let current;
  function input0_checked_binding(value2) {
    ctx[27](value2);
  }
  let input0_props = {
    type: "switch",
    label: "Toggle switch to connect/disconnect printer"
  };
  if (ctx[0].isConnected !== void 0) {
    input0_props.checked = ctx[0].isConnected;
  }
  input0 = new Input({props: input0_props});
  binding_callbacks.push(() => bind(input0, "checked", input0_checked_binding));
  input0.$on("change", ctx[23]);
  function input1_checked_binding(value2) {
    ctx[28](value2);
  }
  let input1_props = {
    type: "switch",
    label: "Toggle to make available"
  };
  if (ctx[1].available !== void 0) {
    input1_props.checked = ctx[1].available;
  }
  input1 = new Input({props: input1_props});
  binding_callbacks.push(() => bind(input1, "checked", input1_checked_binding));
  return {
    c() {
      create_component(input0.$$.fragment);
      t = space();
      create_component(input1.$$.fragment);
    },
    m(target, anchor) {
      mount_component(input0, target, anchor);
      insert(target, t, anchor);
      mount_component(input1, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const input0_changes = {};
      if (!updating_checked && dirty[0] & 1) {
        updating_checked = true;
        input0_changes.checked = ctx2[0].isConnected;
        add_flush_callback(() => updating_checked = false);
      }
      input0.$set(input0_changes);
      const input1_changes = {};
      if (!updating_checked_1 && dirty[0] & 2) {
        updating_checked_1 = true;
        input1_changes.checked = ctx2[1].available;
        add_flush_callback(() => updating_checked_1 = false);
      }
      input1.$set(input1_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(input0.$$.fragment, local);
      transition_in(input1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(input0.$$.fragment, local);
      transition_out(input1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(input0, detaching);
      if (detaching)
        detach(t);
      destroy_component(input1, detaching);
    }
  };
}
function create_default_slot_123(ctx) {
  let icon;
  let current;
  icon = new Icon({props: {name: "house-fill"}});
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function create_default_slot_114(ctx) {
  let icon;
  let current;
  icon = new Icon({props: {name: "arrow-left"}});
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function create_default_slot_104(ctx) {
  let icon;
  let current;
  icon = new Icon({props: {name: "arrow-up"}});
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function create_default_slot_94(ctx) {
  let icon;
  let current;
  icon = new Icon({props: {name: "arrow-down"}});
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function create_default_slot_85(ctx) {
  let icon;
  let current;
  icon = new Icon({props: {name: "arrow-right"}});
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function create_default_slot_75(ctx) {
  let icon;
  let current;
  icon = new Icon({props: {name: "arrow-bar-up"}});
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function create_default_slot_65(ctx) {
  let icon;
  let current;
  icon = new Icon({props: {name: "arrow-bar-down"}});
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function create_default_slot_55(ctx) {
  let button0;
  let t0;
  let button1;
  let t1;
  let button2;
  let t2;
  let button3;
  let t3;
  let button4;
  let t4;
  let button5;
  let t5;
  let button6;
  let current;
  button0 = new Button({
    props: {
      color: "primary",
      $$slots: {default: [create_default_slot_123]},
      $$scope: {ctx}
    }
  });
  button0.$on("click", ctx[29]);
  button1 = new Button({
    props: {
      color: "primary",
      $$slots: {default: [create_default_slot_114]},
      $$scope: {ctx}
    }
  });
  button1.$on("click", ctx[30]);
  button2 = new Button({
    props: {
      color: "primary",
      $$slots: {default: [create_default_slot_104]},
      $$scope: {ctx}
    }
  });
  button2.$on("click", ctx[31]);
  button3 = new Button({
    props: {
      color: "primary",
      $$slots: {default: [create_default_slot_94]},
      $$scope: {ctx}
    }
  });
  button3.$on("click", ctx[32]);
  button4 = new Button({
    props: {
      color: "primary",
      $$slots: {default: [create_default_slot_85]},
      $$scope: {ctx}
    }
  });
  button4.$on("click", ctx[33]);
  button5 = new Button({
    props: {
      color: "primary",
      $$slots: {default: [create_default_slot_75]},
      $$scope: {ctx}
    }
  });
  button5.$on("click", ctx[34]);
  button6 = new Button({
    props: {
      color: "primary",
      $$slots: {default: [create_default_slot_65]},
      $$scope: {ctx}
    }
  });
  button6.$on("click", ctx[35]);
  return {
    c() {
      create_component(button0.$$.fragment);
      t0 = space();
      create_component(button1.$$.fragment);
      t1 = space();
      create_component(button2.$$.fragment);
      t2 = space();
      create_component(button3.$$.fragment);
      t3 = space();
      create_component(button4.$$.fragment);
      t4 = space();
      create_component(button5.$$.fragment);
      t5 = space();
      create_component(button6.$$.fragment);
    },
    m(target, anchor) {
      mount_component(button0, target, anchor);
      insert(target, t0, anchor);
      mount_component(button1, target, anchor);
      insert(target, t1, anchor);
      mount_component(button2, target, anchor);
      insert(target, t2, anchor);
      mount_component(button3, target, anchor);
      insert(target, t3, anchor);
      mount_component(button4, target, anchor);
      insert(target, t4, anchor);
      mount_component(button5, target, anchor);
      insert(target, t5, anchor);
      mount_component(button6, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const button0_changes = {};
      if (dirty[1] & 64) {
        button0_changes.$$scope = {dirty, ctx: ctx2};
      }
      button0.$set(button0_changes);
      const button1_changes = {};
      if (dirty[1] & 64) {
        button1_changes.$$scope = {dirty, ctx: ctx2};
      }
      button1.$set(button1_changes);
      const button2_changes = {};
      if (dirty[1] & 64) {
        button2_changes.$$scope = {dirty, ctx: ctx2};
      }
      button2.$set(button2_changes);
      const button3_changes = {};
      if (dirty[1] & 64) {
        button3_changes.$$scope = {dirty, ctx: ctx2};
      }
      button3.$set(button3_changes);
      const button4_changes = {};
      if (dirty[1] & 64) {
        button4_changes.$$scope = {dirty, ctx: ctx2};
      }
      button4.$set(button4_changes);
      const button5_changes = {};
      if (dirty[1] & 64) {
        button5_changes.$$scope = {dirty, ctx: ctx2};
      }
      button5.$set(button5_changes);
      const button6_changes = {};
      if (dirty[1] & 64) {
        button6_changes.$$scope = {dirty, ctx: ctx2};
      }
      button6.$set(button6_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(button0.$$.fragment, local);
      transition_in(button1.$$.fragment, local);
      transition_in(button2.$$.fragment, local);
      transition_in(button3.$$.fragment, local);
      transition_in(button4.$$.fragment, local);
      transition_in(button5.$$.fragment, local);
      transition_in(button6.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button0.$$.fragment, local);
      transition_out(button1.$$.fragment, local);
      transition_out(button2.$$.fragment, local);
      transition_out(button3.$$.fragment, local);
      transition_out(button4.$$.fragment, local);
      transition_out(button5.$$.fragment, local);
      transition_out(button6.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(button0, detaching);
      if (detaching)
        detach(t0);
      destroy_component(button1, detaching);
      if (detaching)
        detach(t1);
      destroy_component(button2, detaching);
      if (detaching)
        detach(t2);
      destroy_component(button3, detaching);
      if (detaching)
        detach(t3);
      destroy_component(button4, detaching);
      if (detaching)
        detach(t4);
      destroy_component(button5, detaching);
      if (detaching)
        detach(t5);
      destroy_component(button6, detaching);
    }
  };
}
function create_default_slot_45(ctx) {
  let t;
  return {
    c() {
      t = text("Submit G-Code Directly");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot_35(ctx) {
  let label;
  let t;
  let input;
  let current;
  let mounted;
  let dispose;
  label = new Label({
    props: {
      $$slots: {default: [create_default_slot_45]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      create_component(label.$$.fragment);
      t = space();
      input = element("input");
      attr(input, "class", "form-control");
      attr(input, "type", "file");
    },
    m(target, anchor) {
      mount_component(label, target, anchor);
      insert(target, t, anchor);
      insert(target, input, anchor);
      current = true;
      if (!mounted) {
        dispose = listen(input, "change", ctx[36]);
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      const label_changes = {};
      if (dirty[1] & 64) {
        label_changes.$$scope = {dirty, ctx: ctx2};
      }
      label.$set(label_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(label.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(label.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(label, detaching);
      if (detaching)
        detach(t);
      if (detaching)
        detach(input);
      mounted = false;
      dispose();
    }
  };
}
function create_default_slot_25(ctx) {
  let t;
  return {
    c() {
      t = text("Submit");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot_115(ctx) {
  let t;
  return {
    c() {
      t = text("Cancel");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot7(ctx) {
  let button0;
  let t;
  let button1;
  let current;
  button0 = new Button({
    props: {
      color: "primary",
      $$slots: {default: [create_default_slot_25]},
      $$scope: {ctx}
    }
  });
  button0.$on("click", ctx[24]);
  button1 = new Button({
    props: {
      color: "danger",
      $$slots: {default: [create_default_slot_115]},
      $$scope: {ctx}
    }
  });
  button1.$on("click", ctx[25]);
  return {
    c() {
      create_component(button0.$$.fragment);
      t = space();
      create_component(button1.$$.fragment);
    },
    m(target, anchor) {
      mount_component(button0, target, anchor);
      insert(target, t, anchor);
      mount_component(button1, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const button0_changes = {};
      if (dirty[1] & 64) {
        button0_changes.$$scope = {dirty, ctx: ctx2};
      }
      button0.$set(button0_changes);
      const button1_changes = {};
      if (dirty[1] & 64) {
        button1_changes.$$scope = {dirty, ctx: ctx2};
      }
      button1.$set(button1_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(button0.$$.fragment, local);
      transition_in(button1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button0.$$.fragment, local);
      transition_out(button1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(button0, detaching);
      if (detaching)
        detach(t);
      destroy_component(button1, detaching);
    }
  };
}
function create_fragment7(ctx) {
  let h50;
  let t1;
  let dl;
  let dt0;
  let dd0;
  let t3;
  let dt1;
  let dd1;
  let t5;
  let dt2;
  let dd2;
  let t7;
  let dt3;
  let dd3;
  let t9;
  let dt4;
  let dd4;
  let t11;
  let dt5;
  let dd5;
  let t13;
  let dt6;
  let dd6;
  let t15;
  let t16;
  let t17;
  let dt7;
  let dd7;
  let t19;
  let t20;
  let t21;
  let t22;
  let formgroup0;
  let t23;
  let formgroup1;
  let t24;
  let h51;
  let t26;
  let formgroup2;
  let t27;
  let formgroup3;
  let t28;
  let formgroup4;
  let current;
  formgroup0 = new FormGroup({
    props: {
      $$slots: {default: [create_default_slot_142]},
      $$scope: {ctx}
    }
  });
  formgroup1 = new FormGroup({
    props: {
      $$slots: {default: [create_default_slot_133]},
      $$scope: {ctx}
    }
  });
  formgroup2 = new FormGroup({
    props: {
      $$slots: {default: [create_default_slot_55]},
      $$scope: {ctx}
    }
  });
  formgroup3 = new FormGroup({
    props: {
      $$slots: {default: [create_default_slot_35]},
      $$scope: {ctx}
    }
  });
  formgroup4 = new FormGroup({
    props: {
      $$slots: {default: [create_default_slot7]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      h50 = element("h5");
      h50.textContent = "Prusa through WebUSB (Chrome or Edge required)";
      t1 = space();
      dl = element("dl");
      dt0 = element("dt");
      dt0.textContent = "Firmware:";
      dd0 = element("dd");
      t3 = text(ctx[3]);
      dt1 = element("dt");
      dt1.textContent = "Source Code URL:";
      dd1 = element("dd");
      t5 = text(ctx[4]);
      dt2 = element("dt");
      dt2.textContent = "Status:";
      dd2 = element("dd");
      t7 = text(ctx[5]);
      dt3 = element("dt");
      dt3.textContent = "Protocol Version:";
      dd3 = element("dd");
      t9 = text(ctx[6]);
      dt4 = element("dt");
      dt4.textContent = "UUID:";
      dd4 = element("dd");
      t11 = text(ctx[7]);
      dt5 = element("dt");
      dt5.textContent = "Machine Type:";
      dd5 = element("dd");
      t13 = text(ctx[8]);
      dt6 = element("dt");
      dt6.textContent = "Extruder Temp:";
      dd6 = element("dd");
      t15 = text(ctx[9]);
      t16 = text(" | ");
      t17 = text(ctx[10]);
      dt7 = element("dt");
      dt7.textContent = "Bed Temp:";
      dd7 = element("dd");
      t19 = text(ctx[11]);
      t20 = text(" | ");
      t21 = text(ctx[12]);
      t22 = space();
      create_component(formgroup0.$$.fragment);
      t23 = space();
      create_component(formgroup1.$$.fragment);
      t24 = space();
      h51 = element("h5");
      h51.textContent = "Controls";
      t26 = space();
      create_component(formgroup2.$$.fragment);
      t27 = space();
      create_component(formgroup3.$$.fragment);
      t28 = space();
      create_component(formgroup4.$$.fragment);
      attr(dt0, "class", "col-sm-3");
      attr(dd0, "class", "col-sm-3");
      attr(dt1, "class", "col-sm-3");
      attr(dd1, "class", "col-sm-3");
      attr(dt2, "class", "col-sm-3");
      attr(dd2, "class", "col-sm-3");
      attr(dt3, "class", "col-sm-3");
      attr(dd3, "class", "col-sm-3");
      attr(dt4, "class", "col-sm-3");
      attr(dd4, "class", "col-sm-3");
      attr(dt5, "class", "col-sm-3");
      attr(dd5, "class", "col-sm-3");
      attr(dt6, "class", "col-sm-3");
      attr(dd6, "class", "col-sm-3");
      attr(dt7, "class", "col-sm-3");
      attr(dd7, "class", "col-sm-3");
      attr(dl, "class", "row");
    },
    m(target, anchor) {
      insert(target, h50, anchor);
      insert(target, t1, anchor);
      insert(target, dl, anchor);
      append(dl, dt0);
      append(dl, dd0);
      append(dd0, t3);
      append(dl, dt1);
      append(dl, dd1);
      append(dd1, t5);
      append(dl, dt2);
      append(dl, dd2);
      append(dd2, t7);
      append(dl, dt3);
      append(dl, dd3);
      append(dd3, t9);
      append(dl, dt4);
      append(dl, dd4);
      append(dd4, t11);
      append(dl, dt5);
      append(dl, dd5);
      append(dd5, t13);
      append(dl, dt6);
      append(dl, dd6);
      append(dd6, t15);
      append(dd6, t16);
      append(dd6, t17);
      append(dl, dt7);
      append(dl, dd7);
      append(dd7, t19);
      append(dd7, t20);
      append(dd7, t21);
      insert(target, t22, anchor);
      mount_component(formgroup0, target, anchor);
      insert(target, t23, anchor);
      mount_component(formgroup1, target, anchor);
      insert(target, t24, anchor);
      insert(target, h51, anchor);
      insert(target, t26, anchor);
      mount_component(formgroup2, target, anchor);
      insert(target, t27, anchor);
      mount_component(formgroup3, target, anchor);
      insert(target, t28, anchor);
      mount_component(formgroup4, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (!current || dirty[0] & 8)
        set_data(t3, ctx2[3]);
      if (!current || dirty[0] & 16)
        set_data(t5, ctx2[4]);
      if (!current || dirty[0] & 32)
        set_data(t7, ctx2[5]);
      if (!current || dirty[0] & 64)
        set_data(t9, ctx2[6]);
      if (!current || dirty[0] & 128)
        set_data(t11, ctx2[7]);
      if (!current || dirty[0] & 256)
        set_data(t13, ctx2[8]);
      if (!current || dirty[0] & 512)
        set_data(t15, ctx2[9]);
      if (!current || dirty[0] & 1024)
        set_data(t17, ctx2[10]);
      if (!current || dirty[0] & 2048)
        set_data(t19, ctx2[11]);
      if (!current || dirty[0] & 4096)
        set_data(t21, ctx2[12]);
      const formgroup0_changes = {};
      if (dirty[0] & 1 | dirty[1] & 64) {
        formgroup0_changes.$$scope = {dirty, ctx: ctx2};
      }
      formgroup0.$set(formgroup0_changes);
      const formgroup1_changes = {};
      if (dirty[0] & 3 | dirty[1] & 64) {
        formgroup1_changes.$$scope = {dirty, ctx: ctx2};
      }
      formgroup1.$set(formgroup1_changes);
      const formgroup2_changes = {};
      if (dirty[0] & 1 | dirty[1] & 64) {
        formgroup2_changes.$$scope = {dirty, ctx: ctx2};
      }
      formgroup2.$set(formgroup2_changes);
      const formgroup3_changes = {};
      if (dirty[0] & 4 | dirty[1] & 64) {
        formgroup3_changes.$$scope = {dirty, ctx: ctx2};
      }
      formgroup3.$set(formgroup3_changes);
      const formgroup4_changes = {};
      if (dirty[1] & 64) {
        formgroup4_changes.$$scope = {dirty, ctx: ctx2};
      }
      formgroup4.$set(formgroup4_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(formgroup0.$$.fragment, local);
      transition_in(formgroup1.$$.fragment, local);
      transition_in(formgroup2.$$.fragment, local);
      transition_in(formgroup3.$$.fragment, local);
      transition_in(formgroup4.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(formgroup0.$$.fragment, local);
      transition_out(formgroup1.$$.fragment, local);
      transition_out(formgroup2.$$.fragment, local);
      transition_out(formgroup3.$$.fragment, local);
      transition_out(formgroup4.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(h50);
      if (detaching)
        detach(t1);
      if (detaching)
        detach(dl);
      if (detaching)
        detach(t22);
      destroy_component(formgroup0, detaching);
      if (detaching)
        detach(t23);
      destroy_component(formgroup1, detaching);
      if (detaching)
        detach(t24);
      if (detaching)
        detach(h51);
      if (detaching)
        detach(t26);
      destroy_component(formgroup2, detaching);
      if (detaching)
        detach(t27);
      destroy_component(formgroup3, detaching);
      if (detaching)
        detach(t28);
      destroy_component(formgroup4, detaching);
    }
  };
}
function instance7($$self, $$props, $$invalidate) {
  let $machine;
  let $firmware;
  let $sourceCodeUrl;
  let $status;
  let $protocolVersion;
  let $uuid;
  let $machineType;
  let $extruderTempActual;
  let $extruderTempDemand;
  let $bedTempActual;
  let $bedTempDemand;
  component_subscribe($$self, machine_store_default, ($$value) => $$invalidate(1, $machine = $$value));
  let files2;
  let printer2 = new WebSerialPrinter("PRUSA_MINI");
  printer2.baud = 115200;
  let {firmware, sourceCodeUrl, status, protocolVersion, uuid, machineType, extruderTempActual, extruderTempDemand, bedTempActual, bedTempDemand} = printer2;
  component_subscribe($$self, firmware, (value2) => $$invalidate(3, $firmware = value2));
  component_subscribe($$self, sourceCodeUrl, (value2) => $$invalidate(4, $sourceCodeUrl = value2));
  component_subscribe($$self, status, (value2) => $$invalidate(5, $status = value2));
  component_subscribe($$self, protocolVersion, (value2) => $$invalidate(6, $protocolVersion = value2));
  component_subscribe($$self, uuid, (value2) => $$invalidate(7, $uuid = value2));
  component_subscribe($$self, machineType, (value2) => $$invalidate(8, $machineType = value2));
  component_subscribe($$self, extruderTempActual, (value2) => $$invalidate(9, $extruderTempActual = value2));
  component_subscribe($$self, extruderTempDemand, (value2) => $$invalidate(10, $extruderTempDemand = value2));
  component_subscribe($$self, bedTempActual, (value2) => $$invalidate(11, $bedTempActual = value2));
  component_subscribe($$self, bedTempDemand, (value2) => $$invalidate(12, $bedTempDemand = value2));
  const toggle = () => {
    if (printer2.isConnected) {
      printer2.disconnect();
    } else {
      printer2.connect();
    }
  };
  const submit = () => {
    if (files2) {
      const reader = new FileReader();
      reader.onload = function(event) {
        let g = event.target.result;
        printer2.print(g);
      };
      reader.readAsText(files2[0]);
    }
  };
  const cancel = () => {
    $$invalidate(0, printer2.cancel = true, printer2);
  };
  function input_value_binding(value2) {
    if ($$self.$$.not_equal(printer2.baud, value2)) {
      printer2.baud = value2;
      $$invalidate(0, printer2);
    }
  }
  function input0_checked_binding(value2) {
    if ($$self.$$.not_equal(printer2.isConnected, value2)) {
      printer2.isConnected = value2;
      $$invalidate(0, printer2);
    }
  }
  function input1_checked_binding(value2) {
    if ($$self.$$.not_equal($machine.available, value2)) {
      $machine.available = value2;
      machine_store_default.set($machine);
    }
  }
  const click_handler = () => {
    if (printer2.writer)
      printer2.sendGcode(["G28"]);
  };
  const click_handler_1 = () => {
    if (printer2.writer)
      printer2.sendGcode(["G91", "G1 X-5"]);
  };
  const click_handler_2 = () => {
    if (printer2.writer)
      printer2.sendGcode(["G91", "G1 Y5"]);
  };
  const click_handler_3 = () => {
    if (printer2.writer)
      printer2.sendGcode(["G91", "G1 Y-5"]);
  };
  const click_handler_4 = () => {
    if (printer2.writer)
      printer2.sendGcode(["G91", "G1 X5"]);
  };
  const click_handler_5 = () => {
    if (printer2.writer)
      printer2.sendGcode(["G91", "G1 Z5"]);
  };
  const click_handler_6 = () => {
    if (printer2.writer)
      printer2.sendGcode(["G91", "G1 Z-5"]);
  };
  function input_change_handler() {
    files2 = this.files;
    $$invalidate(2, files2);
  }
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & 3) {
      $:
        if ($machine.gcode) {
          set_store_value(machine_store_default, $machine.available = false, $machine);
          printer2.print($machine.gcode);
          set_store_value(machine_store_default, $machine.gcode = "", $machine);
        }
    }
  };
  return [
    printer2,
    $machine,
    files2,
    $firmware,
    $sourceCodeUrl,
    $status,
    $protocolVersion,
    $uuid,
    $machineType,
    $extruderTempActual,
    $extruderTempDemand,
    $bedTempActual,
    $bedTempDemand,
    firmware,
    sourceCodeUrl,
    status,
    protocolVersion,
    uuid,
    machineType,
    extruderTempActual,
    extruderTempDemand,
    bedTempActual,
    bedTempDemand,
    toggle,
    submit,
    cancel,
    input_value_binding,
    input0_checked_binding,
    input1_checked_binding,
    click_handler,
    click_handler_1,
    click_handler_2,
    click_handler_3,
    click_handler_4,
    click_handler_5,
    click_handler_6,
    input_change_handler
  ];
}
var WebSerialPrusaMini = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance7, create_fragment7, safe_not_equal, {}, null, [-1, -1]);
  }
};
var WebSerialPrusaMini_svelte_default = WebSerialPrusaMini;

// docs/dist/connectors/WebSerialPrusaMK3S.svelte.js
function create_default_slot_163(ctx) {
  let t;
  return {
    c() {
      t = text("Baud Rate");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot_153(ctx) {
  let inputgrouptext;
  let t;
  let input;
  let updating_value;
  let current;
  inputgrouptext = new InputGroupText({
    props: {
      $$slots: {default: [create_default_slot_163]},
      $$scope: {ctx}
    }
  });
  function input_value_binding(value2) {
    ctx[18](value2);
  }
  let input_props = {
    type: "text",
    invalid: !ctx[0].baud,
    feedback: "Baud Rate Required"
  };
  if (ctx[0].baud !== void 0) {
    input_props.value = ctx[0].baud;
  }
  input = new Input({props: input_props});
  binding_callbacks.push(() => bind(input, "value", input_value_binding));
  return {
    c() {
      create_component(inputgrouptext.$$.fragment);
      t = space();
      create_component(input.$$.fragment);
    },
    m(target, anchor) {
      mount_component(inputgrouptext, target, anchor);
      insert(target, t, anchor);
      mount_component(input, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const inputgrouptext_changes = {};
      if (dirty[1] & 4) {
        inputgrouptext_changes.$$scope = {dirty, ctx: ctx2};
      }
      inputgrouptext.$set(inputgrouptext_changes);
      const input_changes = {};
      if (dirty[0] & 1)
        input_changes.invalid = !ctx2[0].baud;
      if (!updating_value && dirty[0] & 1) {
        updating_value = true;
        input_changes.value = ctx2[0].baud;
        add_flush_callback(() => updating_value = false);
      }
      input.$set(input_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(inputgrouptext.$$.fragment, local);
      transition_in(input.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(inputgrouptext.$$.fragment, local);
      transition_out(input.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(inputgrouptext, detaching);
      if (detaching)
        detach(t);
      destroy_component(input, detaching);
    }
  };
}
function create_default_slot_143(ctx) {
  let inputgroup;
  let current;
  inputgroup = new InputGroup({
    props: {
      $$slots: {default: [create_default_slot_153]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      create_component(inputgroup.$$.fragment);
    },
    m(target, anchor) {
      mount_component(inputgroup, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const inputgroup_changes = {};
      if (dirty[0] & 1 | dirty[1] & 4) {
        inputgroup_changes.$$scope = {dirty, ctx: ctx2};
      }
      inputgroup.$set(inputgroup_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(inputgroup.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(inputgroup.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(inputgroup, detaching);
    }
  };
}
function create_default_slot_134(ctx) {
  let input0;
  let updating_checked;
  let t;
  let input1;
  let updating_checked_1;
  let current;
  function input0_checked_binding(value2) {
    ctx[19](value2);
  }
  let input0_props = {
    type: "switch",
    label: "Toggle switch to connect/disconnect printer"
  };
  if (ctx[0].isConnected !== void 0) {
    input0_props.checked = ctx[0].isConnected;
  }
  input0 = new Input({props: input0_props});
  binding_callbacks.push(() => bind(input0, "checked", input0_checked_binding));
  input0.$on("change", ctx[15]);
  function input1_checked_binding(value2) {
    ctx[20](value2);
  }
  let input1_props = {
    type: "switch",
    label: "Toggle to make available"
  };
  if (ctx[1].available !== void 0) {
    input1_props.checked = ctx[1].available;
  }
  input1 = new Input({props: input1_props});
  binding_callbacks.push(() => bind(input1, "checked", input1_checked_binding));
  return {
    c() {
      create_component(input0.$$.fragment);
      t = space();
      create_component(input1.$$.fragment);
    },
    m(target, anchor) {
      mount_component(input0, target, anchor);
      insert(target, t, anchor);
      mount_component(input1, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const input0_changes = {};
      if (!updating_checked && dirty[0] & 1) {
        updating_checked = true;
        input0_changes.checked = ctx2[0].isConnected;
        add_flush_callback(() => updating_checked = false);
      }
      input0.$set(input0_changes);
      const input1_changes = {};
      if (!updating_checked_1 && dirty[0] & 2) {
        updating_checked_1 = true;
        input1_changes.checked = ctx2[1].available;
        add_flush_callback(() => updating_checked_1 = false);
      }
      input1.$set(input1_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(input0.$$.fragment, local);
      transition_in(input1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(input0.$$.fragment, local);
      transition_out(input1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(input0, detaching);
      if (detaching)
        detach(t);
      destroy_component(input1, detaching);
    }
  };
}
function create_default_slot_124(ctx) {
  let icon;
  let current;
  icon = new Icon({props: {name: "house-fill"}});
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function create_default_slot_116(ctx) {
  let icon;
  let current;
  icon = new Icon({props: {name: "arrow-left"}});
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function create_default_slot_105(ctx) {
  let icon;
  let current;
  icon = new Icon({props: {name: "arrow-up"}});
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function create_default_slot_95(ctx) {
  let icon;
  let current;
  icon = new Icon({props: {name: "arrow-down"}});
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function create_default_slot_86(ctx) {
  let icon;
  let current;
  icon = new Icon({props: {name: "arrow-right"}});
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function create_default_slot_76(ctx) {
  let icon;
  let current;
  icon = new Icon({props: {name: "arrow-bar-up"}});
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function create_default_slot_66(ctx) {
  let icon;
  let current;
  icon = new Icon({props: {name: "arrow-bar-down"}});
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function create_default_slot_56(ctx) {
  let button0;
  let t0;
  let button1;
  let t1;
  let button2;
  let t2;
  let button3;
  let t3;
  let button4;
  let t4;
  let button5;
  let t5;
  let button6;
  let current;
  button0 = new Button({
    props: {
      color: "primary",
      $$slots: {default: [create_default_slot_124]},
      $$scope: {ctx}
    }
  });
  button0.$on("click", ctx[21]);
  button1 = new Button({
    props: {
      color: "primary",
      $$slots: {default: [create_default_slot_116]},
      $$scope: {ctx}
    }
  });
  button1.$on("click", ctx[22]);
  button2 = new Button({
    props: {
      color: "primary",
      $$slots: {default: [create_default_slot_105]},
      $$scope: {ctx}
    }
  });
  button2.$on("click", ctx[23]);
  button3 = new Button({
    props: {
      color: "primary",
      $$slots: {default: [create_default_slot_95]},
      $$scope: {ctx}
    }
  });
  button3.$on("click", ctx[24]);
  button4 = new Button({
    props: {
      color: "primary",
      $$slots: {default: [create_default_slot_86]},
      $$scope: {ctx}
    }
  });
  button4.$on("click", ctx[25]);
  button5 = new Button({
    props: {
      color: "primary",
      $$slots: {default: [create_default_slot_76]},
      $$scope: {ctx}
    }
  });
  button5.$on("click", ctx[26]);
  button6 = new Button({
    props: {
      color: "primary",
      $$slots: {default: [create_default_slot_66]},
      $$scope: {ctx}
    }
  });
  button6.$on("click", ctx[27]);
  return {
    c() {
      create_component(button0.$$.fragment);
      t0 = space();
      create_component(button1.$$.fragment);
      t1 = space();
      create_component(button2.$$.fragment);
      t2 = space();
      create_component(button3.$$.fragment);
      t3 = space();
      create_component(button4.$$.fragment);
      t4 = space();
      create_component(button5.$$.fragment);
      t5 = space();
      create_component(button6.$$.fragment);
    },
    m(target, anchor) {
      mount_component(button0, target, anchor);
      insert(target, t0, anchor);
      mount_component(button1, target, anchor);
      insert(target, t1, anchor);
      mount_component(button2, target, anchor);
      insert(target, t2, anchor);
      mount_component(button3, target, anchor);
      insert(target, t3, anchor);
      mount_component(button4, target, anchor);
      insert(target, t4, anchor);
      mount_component(button5, target, anchor);
      insert(target, t5, anchor);
      mount_component(button6, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const button0_changes = {};
      if (dirty[1] & 4) {
        button0_changes.$$scope = {dirty, ctx: ctx2};
      }
      button0.$set(button0_changes);
      const button1_changes = {};
      if (dirty[1] & 4) {
        button1_changes.$$scope = {dirty, ctx: ctx2};
      }
      button1.$set(button1_changes);
      const button2_changes = {};
      if (dirty[1] & 4) {
        button2_changes.$$scope = {dirty, ctx: ctx2};
      }
      button2.$set(button2_changes);
      const button3_changes = {};
      if (dirty[1] & 4) {
        button3_changes.$$scope = {dirty, ctx: ctx2};
      }
      button3.$set(button3_changes);
      const button4_changes = {};
      if (dirty[1] & 4) {
        button4_changes.$$scope = {dirty, ctx: ctx2};
      }
      button4.$set(button4_changes);
      const button5_changes = {};
      if (dirty[1] & 4) {
        button5_changes.$$scope = {dirty, ctx: ctx2};
      }
      button5.$set(button5_changes);
      const button6_changes = {};
      if (dirty[1] & 4) {
        button6_changes.$$scope = {dirty, ctx: ctx2};
      }
      button6.$set(button6_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(button0.$$.fragment, local);
      transition_in(button1.$$.fragment, local);
      transition_in(button2.$$.fragment, local);
      transition_in(button3.$$.fragment, local);
      transition_in(button4.$$.fragment, local);
      transition_in(button5.$$.fragment, local);
      transition_in(button6.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button0.$$.fragment, local);
      transition_out(button1.$$.fragment, local);
      transition_out(button2.$$.fragment, local);
      transition_out(button3.$$.fragment, local);
      transition_out(button4.$$.fragment, local);
      transition_out(button5.$$.fragment, local);
      transition_out(button6.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(button0, detaching);
      if (detaching)
        detach(t0);
      destroy_component(button1, detaching);
      if (detaching)
        detach(t1);
      destroy_component(button2, detaching);
      if (detaching)
        detach(t2);
      destroy_component(button3, detaching);
      if (detaching)
        detach(t3);
      destroy_component(button4, detaching);
      if (detaching)
        detach(t4);
      destroy_component(button5, detaching);
      if (detaching)
        detach(t5);
      destroy_component(button6, detaching);
    }
  };
}
function create_default_slot_46(ctx) {
  let t;
  return {
    c() {
      t = text("Submit G-Code Directly");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot_36(ctx) {
  let label;
  let t;
  let input;
  let current;
  let mounted;
  let dispose;
  label = new Label({
    props: {
      $$slots: {default: [create_default_slot_46]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      create_component(label.$$.fragment);
      t = space();
      input = element("input");
      attr(input, "class", "form-control");
      attr(input, "type", "file");
    },
    m(target, anchor) {
      mount_component(label, target, anchor);
      insert(target, t, anchor);
      insert(target, input, anchor);
      current = true;
      if (!mounted) {
        dispose = listen(input, "change", ctx[28]);
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      const label_changes = {};
      if (dirty[1] & 4) {
        label_changes.$$scope = {dirty, ctx: ctx2};
      }
      label.$set(label_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(label.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(label.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(label, detaching);
      if (detaching)
        detach(t);
      if (detaching)
        detach(input);
      mounted = false;
      dispose();
    }
  };
}
function create_default_slot_26(ctx) {
  let t;
  return {
    c() {
      t = text("Submit");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot_117(ctx) {
  let t;
  return {
    c() {
      t = text("Cancel");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot8(ctx) {
  let button0;
  let t;
  let button1;
  let current;
  button0 = new Button({
    props: {
      color: "primary",
      $$slots: {default: [create_default_slot_26]},
      $$scope: {ctx}
    }
  });
  button0.$on("click", ctx[16]);
  button1 = new Button({
    props: {
      color: "danger",
      $$slots: {default: [create_default_slot_117]},
      $$scope: {ctx}
    }
  });
  button1.$on("click", ctx[17]);
  return {
    c() {
      create_component(button0.$$.fragment);
      t = space();
      create_component(button1.$$.fragment);
    },
    m(target, anchor) {
      mount_component(button0, target, anchor);
      insert(target, t, anchor);
      mount_component(button1, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const button0_changes = {};
      if (dirty[1] & 4) {
        button0_changes.$$scope = {dirty, ctx: ctx2};
      }
      button0.$set(button0_changes);
      const button1_changes = {};
      if (dirty[1] & 4) {
        button1_changes.$$scope = {dirty, ctx: ctx2};
      }
      button1.$set(button1_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(button0.$$.fragment, local);
      transition_in(button1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button0.$$.fragment, local);
      transition_out(button1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(button0, detaching);
      if (detaching)
        detach(t);
      destroy_component(button1, detaching);
    }
  };
}
function create_fragment8(ctx) {
  let h50;
  let t1;
  let dl;
  let dt0;
  let dd0;
  let t3;
  let dt1;
  let dd1;
  let t5;
  let dt2;
  let dd2;
  let t7;
  let dt3;
  let dd3;
  let t9;
  let dt4;
  let dd4;
  let t11;
  let dt5;
  let dd5;
  let t13;
  let t14;
  let formgroup0;
  let t15;
  let formgroup1;
  let t16;
  let h51;
  let t18;
  let formgroup2;
  let t19;
  let formgroup3;
  let t20;
  let formgroup4;
  let current;
  formgroup0 = new FormGroup({
    props: {
      $$slots: {default: [create_default_slot_143]},
      $$scope: {ctx}
    }
  });
  formgroup1 = new FormGroup({
    props: {
      $$slots: {default: [create_default_slot_134]},
      $$scope: {ctx}
    }
  });
  formgroup2 = new FormGroup({
    props: {
      $$slots: {default: [create_default_slot_56]},
      $$scope: {ctx}
    }
  });
  formgroup3 = new FormGroup({
    props: {
      $$slots: {default: [create_default_slot_36]},
      $$scope: {ctx}
    }
  });
  formgroup4 = new FormGroup({
    props: {
      $$slots: {default: [create_default_slot8]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      h50 = element("h5");
      h50.textContent = "Prusa Mini through WebUSB (Chrome or Edge required)";
      t1 = space();
      dl = element("dl");
      dt0 = element("dt");
      dt0.textContent = "Firmware:";
      dd0 = element("dd");
      t3 = text(ctx[3]);
      dt1 = element("dt");
      dt1.textContent = "Source Code URL:";
      dd1 = element("dd");
      t5 = text(ctx[4]);
      dt2 = element("dt");
      dt2.textContent = "Status:";
      dd2 = element("dd");
      t7 = text(ctx[5]);
      dt3 = element("dt");
      dt3.textContent = "Protocol Version:";
      dd3 = element("dd");
      t9 = text(ctx[6]);
      dt4 = element("dt");
      dt4.textContent = "UUID:";
      dd4 = element("dd");
      t11 = text(ctx[7]);
      dt5 = element("dt");
      dt5.textContent = "Machine Type:";
      dd5 = element("dd");
      t13 = text(ctx[8]);
      t14 = space();
      create_component(formgroup0.$$.fragment);
      t15 = space();
      create_component(formgroup1.$$.fragment);
      t16 = space();
      h51 = element("h5");
      h51.textContent = "Controls";
      t18 = space();
      create_component(formgroup2.$$.fragment);
      t19 = space();
      create_component(formgroup3.$$.fragment);
      t20 = space();
      create_component(formgroup4.$$.fragment);
      attr(dt0, "class", "col-sm-3");
      attr(dd0, "class", "col-sm-3");
      attr(dt1, "class", "col-sm-3");
      attr(dd1, "class", "col-sm-3");
      attr(dt2, "class", "col-sm-3");
      attr(dd2, "class", "col-sm-3");
      attr(dt3, "class", "col-sm-3");
      attr(dd3, "class", "col-sm-3");
      attr(dt4, "class", "col-sm-3");
      attr(dd4, "class", "col-sm-3");
      attr(dt5, "class", "col-sm-3");
      attr(dd5, "class", "col-sm-3");
      attr(dl, "class", "row");
    },
    m(target, anchor) {
      insert(target, h50, anchor);
      insert(target, t1, anchor);
      insert(target, dl, anchor);
      append(dl, dt0);
      append(dl, dd0);
      append(dd0, t3);
      append(dl, dt1);
      append(dl, dd1);
      append(dd1, t5);
      append(dl, dt2);
      append(dl, dd2);
      append(dd2, t7);
      append(dl, dt3);
      append(dl, dd3);
      append(dd3, t9);
      append(dl, dt4);
      append(dl, dd4);
      append(dd4, t11);
      append(dl, dt5);
      append(dl, dd5);
      append(dd5, t13);
      insert(target, t14, anchor);
      mount_component(formgroup0, target, anchor);
      insert(target, t15, anchor);
      mount_component(formgroup1, target, anchor);
      insert(target, t16, anchor);
      insert(target, h51, anchor);
      insert(target, t18, anchor);
      mount_component(formgroup2, target, anchor);
      insert(target, t19, anchor);
      mount_component(formgroup3, target, anchor);
      insert(target, t20, anchor);
      mount_component(formgroup4, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (!current || dirty[0] & 8)
        set_data(t3, ctx2[3]);
      if (!current || dirty[0] & 16)
        set_data(t5, ctx2[4]);
      if (!current || dirty[0] & 32)
        set_data(t7, ctx2[5]);
      if (!current || dirty[0] & 64)
        set_data(t9, ctx2[6]);
      if (!current || dirty[0] & 128)
        set_data(t11, ctx2[7]);
      if (!current || dirty[0] & 256)
        set_data(t13, ctx2[8]);
      const formgroup0_changes = {};
      if (dirty[0] & 1 | dirty[1] & 4) {
        formgroup0_changes.$$scope = {dirty, ctx: ctx2};
      }
      formgroup0.$set(formgroup0_changes);
      const formgroup1_changes = {};
      if (dirty[0] & 3 | dirty[1] & 4) {
        formgroup1_changes.$$scope = {dirty, ctx: ctx2};
      }
      formgroup1.$set(formgroup1_changes);
      const formgroup2_changes = {};
      if (dirty[0] & 1 | dirty[1] & 4) {
        formgroup2_changes.$$scope = {dirty, ctx: ctx2};
      }
      formgroup2.$set(formgroup2_changes);
      const formgroup3_changes = {};
      if (dirty[0] & 4 | dirty[1] & 4) {
        formgroup3_changes.$$scope = {dirty, ctx: ctx2};
      }
      formgroup3.$set(formgroup3_changes);
      const formgroup4_changes = {};
      if (dirty[1] & 4) {
        formgroup4_changes.$$scope = {dirty, ctx: ctx2};
      }
      formgroup4.$set(formgroup4_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(formgroup0.$$.fragment, local);
      transition_in(formgroup1.$$.fragment, local);
      transition_in(formgroup2.$$.fragment, local);
      transition_in(formgroup3.$$.fragment, local);
      transition_in(formgroup4.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(formgroup0.$$.fragment, local);
      transition_out(formgroup1.$$.fragment, local);
      transition_out(formgroup2.$$.fragment, local);
      transition_out(formgroup3.$$.fragment, local);
      transition_out(formgroup4.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(h50);
      if (detaching)
        detach(t1);
      if (detaching)
        detach(dl);
      if (detaching)
        detach(t14);
      destroy_component(formgroup0, detaching);
      if (detaching)
        detach(t15);
      destroy_component(formgroup1, detaching);
      if (detaching)
        detach(t16);
      if (detaching)
        detach(h51);
      if (detaching)
        detach(t18);
      destroy_component(formgroup2, detaching);
      if (detaching)
        detach(t19);
      destroy_component(formgroup3, detaching);
      if (detaching)
        detach(t20);
      destroy_component(formgroup4, detaching);
    }
  };
}
function instance8($$self, $$props, $$invalidate) {
  let $machine;
  let $firmware;
  let $sourceCodeUrl;
  let $status;
  let $protocolVersion;
  let $uuid;
  let $machineType;
  component_subscribe($$self, machine_store_default, ($$value) => $$invalidate(1, $machine = $$value));
  let files2;
  let printer2 = new WebSerialPrinter("PRUSA_MK3S");
  printer2.baud = 115200;
  let {firmware, sourceCodeUrl, status, protocolVersion, uuid, machineType, extruderTempActual, extruderTempDemand, bedTempActual, bedTempDemand} = printer2;
  component_subscribe($$self, firmware, (value2) => $$invalidate(3, $firmware = value2));
  component_subscribe($$self, sourceCodeUrl, (value2) => $$invalidate(4, $sourceCodeUrl = value2));
  component_subscribe($$self, status, (value2) => $$invalidate(5, $status = value2));
  component_subscribe($$self, protocolVersion, (value2) => $$invalidate(6, $protocolVersion = value2));
  component_subscribe($$self, uuid, (value2) => $$invalidate(7, $uuid = value2));
  component_subscribe($$self, machineType, (value2) => $$invalidate(8, $machineType = value2));
  const toggle = () => {
    if (printer2.isConnected) {
      printer2.disconnect();
    } else {
      printer2.connect();
    }
  };
  const submit = () => {
    if (files2) {
      const reader = new FileReader();
      reader.onload = function(event) {
        let g = event.target.result;
        printer2.print(g);
      };
      reader.readAsText(files2[0]);
    }
  };
  const cancel = () => {
    $$invalidate(0, printer2.cancel = true, printer2);
  };
  function input_value_binding(value2) {
    if ($$self.$$.not_equal(printer2.baud, value2)) {
      printer2.baud = value2;
      $$invalidate(0, printer2);
    }
  }
  function input0_checked_binding(value2) {
    if ($$self.$$.not_equal(printer2.isConnected, value2)) {
      printer2.isConnected = value2;
      $$invalidate(0, printer2);
    }
  }
  function input1_checked_binding(value2) {
    if ($$self.$$.not_equal($machine.available, value2)) {
      $machine.available = value2;
      machine_store_default.set($machine);
    }
  }
  const click_handler = () => {
    if (printer2.writer)
      printer2.sendGcode(["G28"]);
  };
  const click_handler_1 = () => {
    if (printer2.writer)
      printer2.sendGcode(["G91", "G1 X-5"]);
  };
  const click_handler_2 = () => {
    if (printer2.writer)
      printer2.sendGcode(["G91", "G1 Y5"]);
  };
  const click_handler_3 = () => {
    if (printer2.writer)
      printer2.sendGcode(["G91", "G1 Y-5"]);
  };
  const click_handler_4 = () => {
    if (printer2.writer)
      printer2.sendGcode(["G91", "G1 X5"]);
  };
  const click_handler_5 = () => {
    if (printer2.writer)
      printer2.sendGcode(["G91", "G1 Z5"]);
  };
  const click_handler_6 = () => {
    if (printer2.writer)
      printer2.sendGcode(["G91", "G1 Z-5"]);
  };
  function input_change_handler() {
    files2 = this.files;
    $$invalidate(2, files2);
  }
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & 3) {
      $:
        if ($machine.gcode) {
          set_store_value(machine_store_default, $machine.available = false, $machine);
          printer2.print($machine.gcode);
          set_store_value(machine_store_default, $machine.gcode = "", $machine);
        }
    }
  };
  return [
    printer2,
    $machine,
    files2,
    $firmware,
    $sourceCodeUrl,
    $status,
    $protocolVersion,
    $uuid,
    $machineType,
    firmware,
    sourceCodeUrl,
    status,
    protocolVersion,
    uuid,
    machineType,
    toggle,
    submit,
    cancel,
    input_value_binding,
    input0_checked_binding,
    input1_checked_binding,
    click_handler,
    click_handler_1,
    click_handler_2,
    click_handler_3,
    click_handler_4,
    click_handler_5,
    click_handler_6,
    input_change_handler
  ];
}
var WebSerialPrusaMK3S = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance8, create_fragment8, safe_not_equal, {}, null, [-1, -1]);
  }
};
var WebSerialPrusaMK3S_svelte_default = WebSerialPrusaMK3S;

// docs/dist/Machine.svelte.js
function create_default_slot_37(ctx) {
  let t;
  return {
    c() {
      t = text("Select the machine/connection type");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot_27(ctx) {
  let option0;
  let t1;
  let option1;
  let t3;
  let option2;
  let t5;
  let option3;
  let t7;
  let option4;
  let t9;
  let option5;
  return {
    c() {
      option0 = element("option");
      option0.textContent = "Ultimaker 3 Extended (Ultimaker API)";
      t1 = space();
      option1 = element("option");
      option1.textContent = "Ultimaker S3 (Ultimaker API)";
      t3 = space();
      option2 = element("option");
      option2.textContent = "Prusa Mini (WebUSB)";
      t5 = space();
      option3 = element("option");
      option3.textContent = "Prusa (Octoprint)";
      t7 = space();
      option4 = element("option");
      option4.textContent = "Prusa MK3S (WebUSB) [NOT COMPLETE]";
      t9 = space();
      option5 = element("option");
      option5.textContent = "Dummy Printer";
      option0.__value = "1";
      option0.value = option0.__value;
      option1.__value = "2";
      option1.value = option1.__value;
      option2.__value = "3";
      option2.value = option2.__value;
      option3.__value = "4";
      option3.value = option3.__value;
      option4.__value = "5";
      option4.value = option4.__value;
      option5.__value = "6";
      option5.value = option5.__value;
    },
    m(target, anchor) {
      insert(target, option0, anchor);
      insert(target, t1, anchor);
      insert(target, option1, anchor);
      insert(target, t3, anchor);
      insert(target, option2, anchor);
      insert(target, t5, anchor);
      insert(target, option3, anchor);
      insert(target, t7, anchor);
      insert(target, option4, anchor);
      insert(target, t9, anchor);
      insert(target, option5, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(option0);
      if (detaching)
        detach(t1);
      if (detaching)
        detach(option1);
      if (detaching)
        detach(t3);
      if (detaching)
        detach(option2);
      if (detaching)
        detach(t5);
      if (detaching)
        detach(option3);
      if (detaching)
        detach(t7);
      if (detaching)
        detach(option4);
      if (detaching)
        detach(t9);
      if (detaching)
        detach(option5);
    }
  };
}
function create_default_slot_118(ctx) {
  let inputgrouptext;
  let t;
  let input;
  let current;
  inputgrouptext = new InputGroupText({
    props: {
      $$slots: {default: [create_default_slot_37]},
      $$scope: {ctx}
    }
  });
  input = new Input({
    props: {
      type: "select",
      name: "select",
      $$slots: {default: [create_default_slot_27]},
      $$scope: {ctx}
    }
  });
  input.$on("change", ctx[1]);
  return {
    c() {
      create_component(inputgrouptext.$$.fragment);
      t = space();
      create_component(input.$$.fragment);
    },
    m(target, anchor) {
      mount_component(inputgrouptext, target, anchor);
      insert(target, t, anchor);
      mount_component(input, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const inputgrouptext_changes = {};
      if (dirty & 4) {
        inputgrouptext_changes.$$scope = {dirty, ctx: ctx2};
      }
      inputgrouptext.$set(inputgrouptext_changes);
      const input_changes = {};
      if (dirty & 4) {
        input_changes.$$scope = {dirty, ctx: ctx2};
      }
      input.$set(input_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(inputgrouptext.$$.fragment, local);
      transition_in(input.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(inputgrouptext.$$.fragment, local);
      transition_out(input.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(inputgrouptext, detaching);
      if (detaching)
        detach(t);
      destroy_component(input, detaching);
    }
  };
}
function create_default_slot9(ctx) {
  let inputgroup;
  let current;
  inputgroup = new InputGroup({
    props: {
      $$slots: {default: [create_default_slot_118]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      create_component(inputgroup.$$.fragment);
    },
    m(target, anchor) {
      mount_component(inputgroup, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const inputgroup_changes = {};
      if (dirty & 4) {
        inputgroup_changes.$$scope = {dirty, ctx: ctx2};
      }
      inputgroup.$set(inputgroup_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(inputgroup.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(inputgroup.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(inputgroup, detaching);
    }
  };
}
function create_if_block_42(ctx) {
  let dummy;
  let t;
  let machineagent;
  let current;
  dummy = new Dummy_svelte_default({});
  machineagent = new MachineAgent_svelte_default({});
  return {
    c() {
      create_component(dummy.$$.fragment);
      t = space();
      create_component(machineagent.$$.fragment);
    },
    m(target, anchor) {
      mount_component(dummy, target, anchor);
      insert(target, t, anchor);
      mount_component(machineagent, target, anchor);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(dummy.$$.fragment, local);
      transition_in(machineagent.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(dummy.$$.fragment, local);
      transition_out(machineagent.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(dummy, detaching);
      if (detaching)
        detach(t);
      destroy_component(machineagent, detaching);
    }
  };
}
function create_if_block_32(ctx) {
  let octoprint;
  let t0;
  let hr;
  let t1;
  let machineagent;
  let current;
  octoprint = new Octoprint_svelte_default({});
  machineagent = new MachineAgent_svelte_default({});
  return {
    c() {
      create_component(octoprint.$$.fragment);
      t0 = space();
      hr = element("hr");
      t1 = space();
      create_component(machineagent.$$.fragment);
    },
    m(target, anchor) {
      mount_component(octoprint, target, anchor);
      insert(target, t0, anchor);
      insert(target, hr, anchor);
      insert(target, t1, anchor);
      mount_component(machineagent, target, anchor);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(octoprint.$$.fragment, local);
      transition_in(machineagent.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(octoprint.$$.fragment, local);
      transition_out(machineagent.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(octoprint, detaching);
      if (detaching)
        detach(t0);
      if (detaching)
        detach(hr);
      if (detaching)
        detach(t1);
      destroy_component(machineagent, detaching);
    }
  };
}
function create_if_block_24(ctx) {
  let webserialprusamk3s;
  let t0;
  let hr;
  let t1;
  let machineagent;
  let current;
  webserialprusamk3s = new WebSerialPrusaMK3S_svelte_default({});
  machineagent = new MachineAgent_svelte_default({});
  return {
    c() {
      create_component(webserialprusamk3s.$$.fragment);
      t0 = space();
      hr = element("hr");
      t1 = space();
      create_component(machineagent.$$.fragment);
    },
    m(target, anchor) {
      mount_component(webserialprusamk3s, target, anchor);
      insert(target, t0, anchor);
      insert(target, hr, anchor);
      insert(target, t1, anchor);
      mount_component(machineagent, target, anchor);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(webserialprusamk3s.$$.fragment, local);
      transition_in(machineagent.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(webserialprusamk3s.$$.fragment, local);
      transition_out(machineagent.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(webserialprusamk3s, detaching);
      if (detaching)
        detach(t0);
      if (detaching)
        detach(hr);
      if (detaching)
        detach(t1);
      destroy_component(machineagent, detaching);
    }
  };
}
function create_if_block_112(ctx) {
  let webserialprusamini;
  let t0;
  let hr;
  let t1;
  let machineagent;
  let current;
  webserialprusamini = new WebSerialPrusaMini_svelte_default({});
  machineagent = new MachineAgent_svelte_default({});
  return {
    c() {
      create_component(webserialprusamini.$$.fragment);
      t0 = space();
      hr = element("hr");
      t1 = space();
      create_component(machineagent.$$.fragment);
    },
    m(target, anchor) {
      mount_component(webserialprusamini, target, anchor);
      insert(target, t0, anchor);
      insert(target, hr, anchor);
      insert(target, t1, anchor);
      mount_component(machineagent, target, anchor);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(webserialprusamini.$$.fragment, local);
      transition_in(machineagent.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(webserialprusamini.$$.fragment, local);
      transition_out(machineagent.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(webserialprusamini, detaching);
      if (detaching)
        detach(t0);
      if (detaching)
        detach(hr);
      if (detaching)
        detach(t1);
      destroy_component(machineagent, detaching);
    }
  };
}
function create_if_block4(ctx) {
  let ultimaker;
  let t0;
  let hr;
  let t1;
  let machineagent;
  let current;
  ultimaker = new Ultimaker_svelte_default({});
  machineagent = new MachineAgent_svelte_default({});
  return {
    c() {
      create_component(ultimaker.$$.fragment);
      t0 = space();
      hr = element("hr");
      t1 = space();
      create_component(machineagent.$$.fragment);
    },
    m(target, anchor) {
      mount_component(ultimaker, target, anchor);
      insert(target, t0, anchor);
      insert(target, hr, anchor);
      insert(target, t1, anchor);
      mount_component(machineagent, target, anchor);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(ultimaker.$$.fragment, local);
      transition_in(machineagent.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(ultimaker.$$.fragment, local);
      transition_out(machineagent.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(ultimaker, detaching);
      if (detaching)
        detach(t0);
      if (detaching)
        detach(hr);
      if (detaching)
        detach(t1);
      destroy_component(machineagent, detaching);
    }
  };
}
function create_fragment9(ctx) {
  let br;
  let t0;
  let formgroup;
  let t1;
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  formgroup = new FormGroup({
    props: {
      $$slots: {default: [create_default_slot9]},
      $$scope: {ctx}
    }
  });
  const if_block_creators = [
    create_if_block4,
    create_if_block_112,
    create_if_block_24,
    create_if_block_32,
    create_if_block_42
  ];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (ctx2[0].connectionType == MachineConnectionTypes.ULTIMAKER_API)
      return 0;
    if (ctx2[0].connectionType == MachineConnectionTypes.USB && ctx2[0].machineType == MachineTypes.PRUSA_MINI)
      return 1;
    if (ctx2[0].connectionType == MachineConnectionTypes.USB && ctx2[0].machineType == MachineTypes.PRUSA_MK3S)
      return 2;
    if (ctx2[0].connectionType == MachineConnectionTypes.OCTOPRINT)
      return 3;
    if (ctx2[0].connectionType == MachineConnectionTypes.DUMMY)
      return 4;
    return -1;
  }
  if (~(current_block_type_index = select_block_type(ctx, -1))) {
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  }
  return {
    c() {
      br = element("br");
      t0 = space();
      create_component(formgroup.$$.fragment);
      t1 = space();
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      insert(target, br, anchor);
      insert(target, t0, anchor);
      mount_component(formgroup, target, anchor);
      insert(target, t1, anchor);
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].m(target, anchor);
      }
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const formgroup_changes = {};
      if (dirty & 4) {
        formgroup_changes.$$scope = {dirty, ctx: ctx2};
      }
      formgroup.$set(formgroup_changes);
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2, dirty);
      if (current_block_type_index !== previous_block_index) {
        if (if_block) {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
        }
        if (~current_block_type_index) {
          if_block = if_blocks[current_block_type_index];
          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block.c();
          } else {
          }
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        } else {
          if_block = null;
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(formgroup.$$.fragment, local);
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(formgroup.$$.fragment, local);
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(br);
      if (detaching)
        detach(t0);
      destroy_component(formgroup, detaching);
      if (detaching)
        detach(t1);
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].d(detaching);
      }
      if (detaching)
        detach(if_block_anchor);
    }
  };
}
function instance9($$self, $$props, $$invalidate) {
  let $machine;
  component_subscribe($$self, machine_store_default, ($$value) => $$invalidate(0, $machine = $$value));
  const changeMachine = (event) => {
    console.log(event.target.value);
    switch (event.target.value) {
      case "1":
        console.log("test1");
        set_store_value(machine_store_default, $machine.machineType = MachineTypes.UM3E, $machine);
        set_store_value(machine_store_default, $machine.connectionType = MachineConnectionTypes.ULTIMAKER_API, $machine);
        break;
      case "2":
        set_store_value(machine_store_default, $machine.machineType = MachineTypes.UMS3, $machine);
        set_store_value(machine_store_default, $machine.connectionType = MachineConnectionTypes.ULTIMAKER_API, $machine);
        break;
      case "3":
        set_store_value(machine_store_default, $machine.machineType = MachineTypes.PRUSA_MINI, $machine);
        set_store_value(machine_store_default, $machine.connectionType = MachineConnectionTypes.USB, $machine);
        break;
      case "4":
        set_store_value(machine_store_default, $machine.machineType = MachineTypes.PRUSA_MINI, $machine);
        set_store_value(machine_store_default, $machine.connectionType = MachineConnectionTypes.OCTOPRINT, $machine);
        break;
      case "5":
        set_store_value(machine_store_default, $machine.machineType = MachineTypes.PRUSA_MK3S, $machine);
        set_store_value(machine_store_default, $machine.connectionType = MachineConnectionTypes.USB, $machine);
        break;
      case "6":
        set_store_value(machine_store_default, $machine.machineType = MachineTypes.DUMMY, $machine);
        set_store_value(machine_store_default, $machine.connectionType = MachineConnectionTypes.DUMMY, $machine);
        break;
      default:
        break;
    }
  };
  return [$machine, changeMachine];
}
var Machine = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance9, create_fragment9, safe_not_equal, {});
  }
};
var Machine_svelte_default = Machine;

// docs/dist/App.svelte.js
function create_default_slot_57(ctx) {
  let t;
  return {
    c() {
      t = text("BAM Living Lab");
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(t);
    }
  };
}
function create_default_slot_47(ctx) {
  let navbarbrand;
  let current;
  navbarbrand = new NavbarBrand({
    props: {
      href: "#",
      $$slots: {default: [create_default_slot_57]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      create_component(navbarbrand.$$.fragment);
    },
    m(target, anchor) {
      mount_component(navbarbrand, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const navbarbrand_changes = {};
      if (dirty & 1) {
        navbarbrand_changes.$$scope = {dirty, ctx: ctx2};
      }
      navbarbrand.$set(navbarbrand_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(navbarbrand.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(navbarbrand.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(navbarbrand, detaching);
    }
  };
}
function create_default_slot_38(ctx) {
  let job2;
  let current;
  job2 = new Job_svelte_default({});
  return {
    c() {
      create_component(job2.$$.fragment);
    },
    m(target, anchor) {
      mount_component(job2, target, anchor);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(job2.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(job2.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(job2, detaching);
    }
  };
}
function create_default_slot_28(ctx) {
  let machine;
  let current;
  machine = new Machine_svelte_default({});
  return {
    c() {
      create_component(machine.$$.fragment);
    },
    m(target, anchor) {
      mount_component(machine, target, anchor);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(machine.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(machine.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(machine, detaching);
    }
  };
}
function create_default_slot_119(ctx) {
  let tabpane0;
  let t;
  let tabpane1;
  let current;
  tabpane0 = new TabPane({
    props: {
      class: "mt-1",
      tabId: "job",
      tab: "Submit Job",
      active: true,
      $$slots: {default: [create_default_slot_38]},
      $$scope: {ctx}
    }
  });
  tabpane1 = new TabPane({
    props: {
      class: "mt-1",
      tabId: "machine",
      tab: "Connect a Machine",
      $$slots: {default: [create_default_slot_28]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      create_component(tabpane0.$$.fragment);
      t = space();
      create_component(tabpane1.$$.fragment);
    },
    m(target, anchor) {
      mount_component(tabpane0, target, anchor);
      insert(target, t, anchor);
      mount_component(tabpane1, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const tabpane0_changes = {};
      if (dirty & 1) {
        tabpane0_changes.$$scope = {dirty, ctx: ctx2};
      }
      tabpane0.$set(tabpane0_changes);
      const tabpane1_changes = {};
      if (dirty & 1) {
        tabpane1_changes.$$scope = {dirty, ctx: ctx2};
      }
      tabpane1.$set(tabpane1_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(tabpane0.$$.fragment, local);
      transition_in(tabpane1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(tabpane0.$$.fragment, local);
      transition_out(tabpane1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(tabpane0, detaching);
      if (detaching)
        detach(t);
      destroy_component(tabpane1, detaching);
    }
  };
}
function create_default_slot10(ctx) {
  let tabcontent;
  let current;
  tabcontent = new TabContent({
    props: {
      $$slots: {default: [create_default_slot_119]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      create_component(tabcontent.$$.fragment);
    },
    m(target, anchor) {
      mount_component(tabcontent, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const tabcontent_changes = {};
      if (dirty & 1) {
        tabcontent_changes.$$scope = {dirty, ctx: ctx2};
      }
      tabcontent.$set(tabcontent_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(tabcontent.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(tabcontent.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(tabcontent, detaching);
    }
  };
}
function create_fragment10(ctx) {
  let navbar;
  let t;
  let container;
  let current;
  navbar = new Navbar({
    props: {
      color: "light",
      light: true,
      expand: "md",
      class: "mb-1",
      $$slots: {default: [create_default_slot_47]},
      $$scope: {ctx}
    }
  });
  container = new Container({
    props: {
      $$slots: {default: [create_default_slot10]},
      $$scope: {ctx}
    }
  });
  return {
    c() {
      create_component(navbar.$$.fragment);
      t = space();
      create_component(container.$$.fragment);
    },
    m(target, anchor) {
      mount_component(navbar, target, anchor);
      insert(target, t, anchor);
      mount_component(container, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const navbar_changes = {};
      if (dirty & 1) {
        navbar_changes.$$scope = {dirty, ctx: ctx2};
      }
      navbar.$set(navbar_changes);
      const container_changes = {};
      if (dirty & 1) {
        container_changes.$$scope = {dirty, ctx: ctx2};
      }
      container.$set(container_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(navbar.$$.fragment, local);
      transition_in(container.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(navbar.$$.fragment, local);
      transition_out(container.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(navbar, detaching);
      if (detaching)
        detach(t);
      destroy_component(container, detaching);
    }
  };
}
var App = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, null, create_fragment10, safe_not_equal, {});
  }
};
var App_svelte_default = App;

// docs/dist/index.js
new App_svelte_default({
  target: document.body
});
//# sourceMappingURL=index.js.map
