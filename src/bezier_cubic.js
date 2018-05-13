import _ from 'underscore';

const bezier = (function _bezierCubic() {
  window.$$ = {};
  $$.bezier__cubic__dump = (elem, name = 'Cubic Bezier') => _dumpBezier(name, elem);
  $$.bezier__cubic__getPoint = (elem, t) => _getPoint(elem, t);
  $$.bezier__cubic__getDerivative = (elem, t) => _getDerivative(elem, t);
  $$.bezier__cubic__getSecondDerivative = (elem, t) => _getSecondDerivative(elem, t);
  $$.bezier__cubic__curveLength = elem => _curveLength(elem);
  $$.bezier__cubic__tByLength = (elem, l) => _tByLength(elem, l);

  $$.bezier__cubic__reverseCurve = elem => _reverseCurve(elem);
  $$.bezier__cubic__cutCurve = (elem, t0, t1) => _cutCurve(elem, t0, t1);
  $$.bezier__cubic__bezierBoundingBox = elem => _bezierBoundingBox(elem);
  $$.bezier__cubic__boundingBoxesIntersect = (bb1, bb2) => _boundingBoxesIntersect(bb1, bb2);
  $$.bezier__cubic__curvesIntersection = (elem, intersectWith) =>
    _curvesIntersection(elem, intersectWith);
  $$.bezier__cubic__bezierCurvature = (elem, t) => _bezierCurvature(elem, t);
  $$.bezier__cubic__getNormal = (elem, t) => _getNormal(elem, t);

  // Для отладки выводит Безье красиво в консоль
  const _dumpBezier = (name, bezier) => {
    console.log(
      name,
      sprintf(
        'p0: (%.1f, %.1f), p1: (%.1f, %.1f), p2: (%.1f, %.1f), p3: (%.1f, %.1f)',
        bezier.p0.x,
        bezier.p0.y,
        bezier.p1.x,
        bezier.p1.y,
        bezier.p2.x,
        bezier.p2.y,
        bezier.p3.x,
        bezier.p3.y
      )
    );
  };

  // Возвращает координаты точки на кривой Безье 3-го порядка по параметру t (t = 0 - начало кривой, t = 1 - конец)

  // ==== Параметры
  // * b  - совпадает с аналогичными параметром из `drawArrow`
  // * t       - параметр t
  const _getPoint = (b, t) => {
    if (t < 0 || t > 1) {
      throw new Error('t must be between 0 and 1');
    }
    return {
      x:
        (1 - 3 * t + 3 * t * t - t * t * t) * b.p0.x +
        (3 * t - 6 * t * t + 3 * t * t * t) * b.p1.x +
        (3 * t * t - 3 * t * t * t) * b.p2.x +
        t * t * t * b.p3.x,
      y:
        (1 - 3 * t + 3 * t * t - t * t * t) * b.p0.y +
        (3 * t - 6 * t * t + 3 * t * t * t) * b.p1.y +
        (3 * t * t - 3 * t * t * t) * b.p2.y +
        t * t * t * b.p3.y,
    };
  };

  // Первая производная
  const _getDerivative = (b, t) => {
    if (t < 0 || t > 1) {
      throw new Error('t must be between 0 and 1');
    }
    return {
      x:
        (-3 + 6 * t - 3 * t * t) * b.p0.x +
        (3 - 12 * t + 9 * t * t) * b.p1.x +
        (6 * t - 9 * t * t) * b.p2.x +
        3 * t * t * b.p3.x,
      y:
        (-3 + 6 * t - 3 * t * t) * b.p0.y +
        (3 - 12 * t + 9 * t * t) * b.p1.y +
        (6 * t - 9 * t * t) * b.p2.y +
        3 * t * t * b.p3.y,
    };
  };

  // Вторая производная
  const _getSecondDerivative = (b, t) => {
    if (t < 0 || t > 1) {
      throw new Error('t must be between 0 and 1');
    }
    return {
      x: (6 - 6 * t) * b.p0.x + (-12 + 18 * t) * b.p1.x + (6 - 18 * t) * b.p2.x + 6 * t * b.p3.x,
      y: (6 - 6 * t) * b.p0.y + (-12 + 18 * t) * b.p1.y + (6 - 18 * t) * b.p2.y + 6 * t * b.p3.y,
    };
  };

  // Возвращает полную длину кривой Безье 3-го порядка.
  // Note: Кривая апроксимируется N отрезками (отрезки равномерны по параметру t, однако длины отрезков разные).
  // ==== Параметры
  // * bezier  - совпадает с аналогичными параметром из `drawArrow`
  const _curveLength = bezier => {
    const N = 20;
    // <-- для большинства случаев достаточно 20 отрезков
    let p1 = bezier.p0;
    let len = 0;
    let i = 1;
    while (i <= N) {
      const p2 = _getPoint(bezier, i / N);
      len += $$.m__distance(p1, p2);
      p1 = p2;
      i++;
    }
    return len;
  };

  const _tByLength = (bezier, l) => {
    if (l <= 0) {
      return 0;
    }
    const N = 20;
    let p1 = bezier.p0;
    let len = 0;
    let i = 1;
    while (i <= N) {
      const p2 = _getPoint(bezier, i / N);
      len += $$.m__distance(p1, p2);
      if (len > l) {
        return (i - 0.5) / N;
      }
      p1 = p2;
      i++;
    }
    return 1;
  };

  // Переворачивает кривую Безье наоборот
  const _reverseCurve = bezier => {
    return {
      p0: {
        x: bezier.p3.x,
        y: bezier.p3.y,
      },
      p1: {
        x: bezier.p2.x,
        y: bezier.p2.y,
      },
      p2: {
        x: bezier.p1.x,
        y: bezier.p1.y,
      },
      p3: {
        x: bezier.p0.x,
        y: bezier.p0.y,
      },
    };
  };

  // Отрезает кривую Безье по параметру `t`, пересчитывая все контрольные точки.
  // Возвращает параметры для новой кривой.
  // Для рассчетов используется De Casteljau's algorithm:
  // http://en.wikipedia.org/wiki/De_Casteljau%27s_algorithm
  //
  // ==== Параметры
  // * b        - кривая Безье 3-го порядка
  // * [t0, t1] - значение параметра `t` по которому необходимо обрезать кривую
  const _cutCurve = (b, t0, t1) => {
    if (t0 < 0 || t0 > t1 || t1 > 1) {
      throw new Error(`Error t0 = ${t0}, t1 = ${t1}`);
    }
    const u0 = 1 - t0;
    const u1 = 1 - t1;
    return {
      p0: {
        x:
          u0 * u0 * u0 * b.p0.x +
          (t0 * u0 * u0 + u0 * t0 * u0 + u0 * u0 * t0) * b.p1.x +
          (t0 * t0 * u0 + u0 * t0 * t0 + t0 * u0 * t0) * b.p2.x +
          t0 * t0 * t0 * b.p3.x,
        y:
          u0 * u0 * u0 * b.p0.y +
          (t0 * u0 * u0 + u0 * t0 * u0 + u0 * u0 * t0) * b.p1.y +
          (t0 * t0 * u0 + u0 * t0 * t0 + t0 * u0 * t0) * b.p2.y +
          t0 * t0 * t0 * b.p3.y,
      },
      p1: {
        x:
          u0 * u0 * u1 * b.p0.x +
          (t0 * u0 * u1 + u0 * t0 * u1 + u0 * u0 * t1) * b.p1.x +
          (t0 * t0 * u1 + u0 * t0 * t1 + t0 * u0 * t1) * b.p2.x +
          t0 * t0 * t1 * b.p3.x,
        y:
          u0 * u0 * u1 * b.p0.y +
          (t0 * u0 * u1 + u0 * t0 * u1 + u0 * u0 * t1) * b.p1.y +
          (t0 * t0 * u1 + u0 * t0 * t1 + t0 * u0 * t1) * b.p2.y +
          t0 * t0 * t1 * b.p3.y,
      },
      p2: {
        x:
          u0 * u1 * u1 * b.p0.x +
          (t0 * u1 * u1 + u0 * t1 * u1 + u0 * u1 * t1) * b.p1.x +
          (t0 * t1 * u1 + u0 * t1 * t1 + t0 * u1 * t1) * b.p2.x +
          t0 * t1 * t1 * b.p3.x,
        y:
          u0 * u1 * u1 * b.p0.y +
          (t0 * u1 * u1 + u0 * t1 * u1 + u0 * u1 * t1) * b.p1.y +
          (t0 * t1 * u1 + u0 * t1 * t1 + t0 * u1 * t1) * b.p2.y +
          t0 * t1 * t1 * b.p3.y,
      },
      p3: {
        x:
          u1 * u1 * u1 * b.p0.x +
          (t1 * u1 * u1 + u1 * t1 * u1 + u1 * u1 * t1) * b.p1.x +
          (t1 * t1 * u1 + u1 * t1 * t1 + t1 * u1 * t1) * b.p2.x +
          t1 * t1 * t1 * b.p3.x,
        y:
          u1 * u1 * u1 * b.p0.y +
          (t1 * u1 * u1 + u1 * t1 * u1 + u1 * u1 * t1) * b.p1.y +
          (t1 * t1 * u1 + u1 * t1 * t1 + t1 * u1 * t1) * b.p2.y +
          t1 * t1 * t1 * b.p3.y,
      },
    };
  };

  // Возвращает гарантированный bounding box для кривой Безье
  const _bezierBoundingBox = bezier => {
    const out = {
      x0: _.min([bezier.p0.x, bezier.p1.x, bezier.p2.x, bezier.p3.x]),
      y0: _.min([bezier.p0.y, bezier.p1.y, bezier.p2.y, bezier.p3.y]),
      x1: _.max([bezier.p0.x, bezier.p1.x, bezier.p2.x, bezier.p3.x]),
      y1: _.max([bezier.p0.y, bezier.p1.y, bezier.p2.y, bezier.p3.y]),
    };
    return out;
  };

  // Возвращает true, если 2 отрезка [a1, b1] и [a2, b2] пересекаются
  const _segmentsIntersect = (a1, b1, a2, b2) => {
    if (a1 > b1) {
      throw new Error('a1 must be smaller or equal to b1');
    }
    if (a2 > b2) {
      throw new Error('a2 must be smaller or equal to b2');
    }
    if (a1 < a2) {
      return b1 > a2;
    }
    return b2 > a1;
  };

  // Возвращает true, если 2 bounding box'а пересекаются.
  const _boundingBoxesIntersect = (bb1, bb2) =>
    _segmentsIntersect(bb1.x0, bb1.x1, bb2.x0, bb2.x1) &&
    _segmentsIntersect(bb1.y0, bb1.y1, bb2.y0, bb2.y1);

  // Среднее арифметическое массива из двух чисел
  const _avg = range => {
    if (range.length !== 2) {
      throw new Error('the length of range must be 2');
    }
    return (range[0] + range[1]) / 2;
  };

  const _curvesIntersectionImpl = (bezier1, range1, bezier2, range2, deep) => {
    // кривые
    const c1 = _cutCurve(bezier1, range1[0], range1[1]);
    const c2 = _cutCurve(bezier2, range2[0], range2[1]);

    // bounding boxes
    const b1 = _bezierBoundingBox(c1);
    const b2 = _bezierBoundingBox(c2);

    // В бинарном деление 15 шагов более чем достаточно (2**15 = 32k), страхуемся от рекурсии или добиваемся
    // точности в пол-пикселя.
    if (deep > 15 || (b1.x1 - b1.x0 + b1.y1 - b1.y0 < 0.5 && b2.x1 - b2.x0 + b2.y1 - b2.y0 < 0.5)) {
      if (_boundingBoxesIntersect(b1, b2)) {
        return [_avg(range1), _avg(range2)];
      }
      return null;
    }
    // считаем новые интервалы для каждой половинки кривой
    const r11 = [range1[0], _avg(range1)];
    const r12 = [_avg(range1), range1[1]];
    const r21 = [range2[0], _avg(range2)];
    const r22 = [_avg(range2), range2[1]];

    // делим каждую кривую пополам
    const c11 = _cutCurve(bezier1, r11[0], r11[1]);
    const c12 = _cutCurve(bezier1, r12[0], r12[1]);
    const c21 = _cutCurve(bezier2, r21[0], r21[1]);
    const c22 = _cutCurve(bezier2, r22[0], r22[1]);

    // подсчитываем для каждой кривой bounding box
    const b11 = _bezierBoundingBox(c11);
    const b12 = _bezierBoundingBox(c12);
    const b21 = _bezierBoundingBox(c21);
    const b22 = _bezierBoundingBox(c22);

    // попарно проверяем пересечения bounding box'ов
    if (_boundingBoxesIntersect(b11, b21)) {
      const tParameters = _curvesIntersectionImpl(bezier1, r11, bezier2, r21, deep + 1);
      if (tParameters) {
        return tParameters;
      }
    }
    if (_boundingBoxesIntersect(b11, b22)) {
      const tParameters = _curvesIntersectionImpl(bezier1, r11, bezier2, r22, deep + 1);
      if (tParameters) {
        return tParameters;
      }
    }
    if (_boundingBoxesIntersect(b12, b21)) {
      const tParameters = _curvesIntersectionImpl(bezier1, r12, bezier2, r21, deep + 1);
      if (tParameters) {
        return tParameters;
      }
    }
    if (_boundingBoxesIntersect(b12, b22)) {
      const tParameters = _curvesIntersectionImpl(bezier1, r12, bezier2, r22, deep + 1);
      if (tParameters) {
        return tParameters;
      }
    }

    // ничего не пересекается
    return null;
  };

  // Находит точку пересечения двух кривых Безье 3-го порядка (если их несколько, он найдет одну из них).
  //
  // ==== Параметры
  // * bezier1 - первая кривая
  // * bezier2 - вторая кривая
  //
  // ==== Возращаемое значение
  // Возвращает массив из двух значений, параметров t1 и t2, для точки пересечения или null, если пересечения нет.
  const _curvesIntersection = (bezier1, bezier2) =>
    _curvesIntersectionImpl(bezier1, [0.0, 1.0], bezier2, [0.0, 1.0], 0);

  // Подсчитывает кривизну (радиус круга) кривой Безье в точке с параметром t.
  // Если ответ больше нуля, то кривая выпукла вверх, иначе выпукла вниз.
  // Null - означает, что радиус круга бесконечен.
  const _bezierCurvature = (bezier, t) => {
    // See http://en.wikipedia.org/wiki/Curvature#Local_expressions for details
    const p1 = _getDerivative(bezier, t);
    const p2 = _getSecondDerivative(bezier, t);
    const d = p1.x * p1.x + p1.y * p1.y;
    const num = Math.sqrt(d * d * d);
    const den = p1.x * p2.y - p1.y * p2.x;
    if (Math.abs(den) <= 0.00001) {
      return null;
    }
    return num / den;
  };

  // Возвращает нормаль к кривой
  const _getNormal = (bezier, t) => {
    const tao = _getDerivative(bezier, t);
    $$.m__normalize({ x: -tao.y, y: tao.x });
  };
})();

export { bezier };
