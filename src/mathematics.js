// mathematics helpers

(function _math() {
  const EPS = 1.0e-10;

  $$.m__sign = x => {
    if (x === 0) {
      return 0;
    } else if (x > 0) {
      return 1;
    }
    return -1;
  };

  $$.m__sub = (v0, v1) => ({ x: v0.x - v1.x, y: v0.y - v1.y });

  $$.m__add = (v0, v1) => ({ x: v0.x + v1.x, y: v0.y + v1.y });

  $$.m__mul = (v, a) => ({ x: v.x * a, y: v.y * a });

  $$.m__negate = v => ({ x: -v.x, y: -v.y });

  $$.m__len = v => Math.sqrt(v.x * v.x + v.y * v.y);

  $$.m__distance = (p0, p1) => $$.m__len($$.m__sub(p1, p0));

  $$.m__normalize = v => {
    yLen = $$.m__len(v);
    return { x: v.x / yLen, y: v.y / yLen };
  };

  $$.m__dot = (v0, v1) => v0.x * v1.x + v0.y * v1.y;

  $$.m__rect_inset = (rect, dx, dy) => ({
    x: rect.x + dx,
    y: rect.y + dy,
    width: rect.width - dx - dx,
    height: rect.height - dy - dy,
  });

  $$.m__rect_integral = rect => ({
    x: Math.ceil(rect.x),
    y: Math.ceil(rect.y),
    width: Math.floor(rect.width),
    height: Math.floor(rect.height),
  });

  $$.m__rect_contain_point = (rect, p) =>
    rect.x <= p.x && p.x <= rect.x + rect.width && rect.y <= p.y && p.y <= rect.y + rect.height;

  $$.m__center = rect => ({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 });

  $$.m__clip = (n, lower, upper) => Math.max(lower, Math.min(n, upper));
  $$.m__clip_via_rect = (p, rect) => ({
    x: $$.m__clip(p.x, rect.x, rect.x + rect.width),
    y: $$.m__clip(p.y, rect.y, rect.y + rect.height),
  });

  $$.m__is_multiple_of = (num, divider) =>
    Math.abs(num / divider - Math.floor(num / divider + EPS)) < EPS;

  $$.m__vec2_interpolate = (v0, v1, t) => $$.m__add($$.m__mul(v0, 1 - t), $$.m__mul(v1, t));

  $$.m__normalize_angle = angle => {
    let a = angle % (2 * Math.PI);
    if (a < 0) {
      a += 2 * Math.PI;
    }
    return a;
  };
})();
