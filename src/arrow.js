const arrow = (function _arrow() {
  console.log($$)
  const _dumpBones = (context, bezier, width) => {
    context.save();
    context.strokeStyle = "#000";
    context.beginPath();
    context.moveTo(bezier.p0.x, bezier.p0.y);
    context.bezierCurveTo(
      bezier.p1.x,
      bezier.p1.y,
      bezier.p2.x,
      bezier.p2.y,
      bezier.p3.x,
      bezier.p3.y
    );
    context.stroke();
    const len = $$.bezier__cubic__curveLength(bezier);
    const h = Math.min(width * 1.8, len * 0.5);
    const t = $$.bezier__cubic__tByLength(bezier, len - h);
    const pH = $$.bezier__cubic__getPoint(bezier, t);
    context.fillStyle = "#000";
    context.fillRect(pH.x - 2, pH.y - 2, 4, 4);
    context.restore();
  };

  const _bezierLeft = (bezier, width, A) => {
    const bezierLeft = {
      p0: {
        x: bezier.p0.x,
        y: bezier.p0.y
      },
      p1: {
        x: bezier.p1.x,
        y: bezier.p1.y
      },
      p2: {
        x: bezier.p2.x,
        y: bezier.p2.y
      },
      p3: {
        x: bezier.p3.x,
        y: bezier.p3.y
      }
    };
    // поворачиваем первую ручку на A (see http://en.wikipedia.org/wiki/Rotation_matrix for details)
    let dx = bezierLeft.p1.x - bezierLeft.p0.x;
    let dy = bezierLeft.p1.y - bezierLeft.p0.y;
    let dxNew = dx * Math.cos(A) + dy * Math.sin(A);
    let dyNew = -dx * Math.sin(A) + dy * Math.cos(A);
    // уменьшаем/увеличиваем длину первой ручки в зависимости от кривизны направляющей в начале оси
    let r = $$.bezier__cubic__bezierCurvature(bezier, 0);
    let L = Math.sqrt(dxNew * dxNew + dyNew * dyNew);
    // <-- длина ручки
    let e = {
      x: dxNew / L,
      y: dyNew / L
    };
    // <-- нормированный вектор ручки
    if (r) {
      const gamma = Math.atan(L / Math.abs(r));
      // <-- угол между вертикалью и направлением на конец ручки
      const p = Math.abs(r) * Math.sin(gamma);
      // <-- длина перпендикуляра из начала ручки на направление
      L = p / Math.cos(gamma + A * $$.m__sign(r));
    }
    // <-- новая длина ручки
    // обновляем ручку
    bezierLeft.p1.x = bezierLeft.p0.x + e.x * L;
    bezierLeft.p1.y = bezierLeft.p0.y + e.y * L;
    // сдвигаем вторую ручку на width/2 перпердикулярно второй ручке "вверх" (B - угол наклона второй ручки к оси x).
    const sinB = (bezierLeft.p2.y - bezierLeft.p3.y) / $$.m__distance(bezierLeft.p3, bezierLeft.p2);
    const cosB = (bezierLeft.p2.x - bezierLeft.p3.x) / $$.m__distance(bezierLeft.p3, bezierLeft.p2);
    bezierLeft.p2.x -= width / 2 * sinB; // <--|
    bezierLeft.p2.y += width / 2 * cosB; // <--| такая комбинация синусов, косинусов и знаков
    bezierLeft.p3.x -= width / 2 * sinB; // <--| так как мы сдвигаем перпендикулярно ручке
    bezierLeft.p3.y += width / 2 * cosB; // <--|
    // поворачиваем вторую ручку тоже на A
    dx = bezierLeft.p2.x - bezierLeft.p3.x;
    dy = bezierLeft.p2.y - bezierLeft.p3.y;
    dxNew = dx * Math.cos(A) + dy * Math.sin(A);
    dyNew = -dx * Math.sin(A) + dy * Math.cos(A);
    // уменьшаем/увеличиваем длину второй ручки в зависимости от кривизны направляющей в конце оси
    r = $$.bezier__cubic__bezierCurvature(bezier, 1);
    L = Math.sqrt(dxNew * dxNew + dyNew * dyNew);
    e = {
      x: dxNew / L,
      y: dyNew / L
    };
    if (r) {
      const gamma = Math.atan(L / Math.abs(r));
      const p = Math.abs(r) * Math.sin(gamma);
      L = p / Math.cos(gamma + A * $$.m__sign(r));
    }
    bezierLeft.p2.x = bezierLeft.p3.x + e.x * L;
    bezierLeft.p2.y = bezierLeft.p3.y + e.y * L;
    return bezierLeft;
  };

  const _bezierRight = (bezier, width, A) => {
    const bezierRight = {
      p0: {
        x: bezier.p0.x,
        y: bezier.p0.y
      },
      p1: {
        x: bezier.p1.x,
        y: bezier.p1.y
      },
      p2: {
        x: bezier.p2.x,
        y: bezier.p2.y
      },
      p3: {
        x: bezier.p3.x,
        y: bezier.p3.y
      }
    };

    // поворачиваем первую ручку на -A
    let dx = bezierRight.p1.x - bezierRight.p0.x;
    let dy = bezierRight.p1.y - bezierRight.p0.y;
    let dxNew = dx * Math.cos(-A) + dy * Math.sin(-A);
    let dyNew = -dx * Math.sin(-A) + dy * Math.cos(-A);
    // уменьшаем/увеличиваем длину первой ручки в зависимости от кривизны направляющей в начале оси
    let r = $$.bezier__cubic__bezierCurvature(bezier, 0);
    let L = Math.sqrt(dxNew * dxNew + dyNew * dyNew);
    let e = {
      x: dxNew / L,
      y: dyNew / L
    };
    if (r) {
      const gamma = Math.atan(L / Math.abs(r));
      const p = Math.abs(r) * Math.sin(gamma);
      L = p / Math.cos(gamma + -A * $$.m__sign(r));
    }
    bezierRight.p1.x = bezierRight.p0.x + e.x * L;
    bezierRight.p1.y = bezierRight.p0.y + e.y * L;
    // сдвигаем вторую ручку на width/2 перпердикулярно второй ручке "вниз".
    const sinB =
      (bezierRight.p2.y - bezierRight.p3.y) / $$.m__distance(bezierRight.p3, bezierRight.p2);
    const cosB =
      (bezierRight.p2.x - bezierRight.p3.x) / $$.m__distance(bezierRight.p3, bezierRight.p2);
    bezierRight.p2.x += width / 2 * sinB; // <--|
    bezierRight.p2.y -= width / 2 * cosB; // <--| такая комбинация синусов, косинусов и знаков
    bezierRight.p3.x += width / 2 * sinB; // <--| так как мы сдвигаем перпендикулярно ручке
    bezierRight.p3.y -= width / 2 * cosB; // <--|
    // поворачиваем вторую ручку тоже на -A
    dx = bezierRight.p2.x - bezierRight.p3.x;
    dy = bezierRight.p2.y - bezierRight.p3.y;
    dxNew = dx * Math.cos(-A) + dy * Math.sin(-A);
    dyNew = -dx * Math.sin(-A) + dy * Math.cos(-A);
    // уменьшаем/увеличиваем длину второй ручки в зависимости от кривизны направляющей в конце оси
    r = $$.bezier__cubic__bezierCurvature(bezier, 1);
    L = Math.sqrt(dxNew * dxNew + dyNew * dyNew);
    e = {
      x: dxNew / L,
      y: dyNew / L
    };
    if (r) {
      const gamma = Math.atan(L / Math.abs(r));
      const p = Math.abs(r) * Math.sin(gamma);
      L = p / Math.cos(gamma + -A * $$.m__sign(r));
    }
    bezierRight.p2.x = bezierRight.p3.x + e.x * L;
    bezierRight.p2.y = bezierRight.p3.y + e.y * L;
    return bezierRight;
  };

  const _bezierBottom = (bezier, width) => {
    const C = 22 * Math.PI / 180; // Угол раствора шляпки 2*C радиан
    const len = $$.bezier__cubic__curveLength(bezier);
    const h = Math.min(width * 3, len * 1.5); // Высота шляпки
    const l = h / Math.cos(C); // Длина направляющей шляпки

    const t = $$.bezier__cubic__tByLength(bezier, len - h);
    const pH = $$.bezier__cubic__getPoint(bezier, t); // точка, немного ниже середины основания шляпки
    let e0 = $$.m__sub(pH, bezier.p3);
    if (!($$.m__len(e0) > 0)) {
      e0 = $$.m__sub(bezier.p2, bezier.p3); // вектор второй ручки
    }
    const e = $$.m__normalize(e0);

    const p0 = {
      x: bezier.p3.x,
      y: bezier.p3.y
    };
    // Верхушка шляпки
    // "Верхний" угол стрелки - нормированный вектор `e`, умноженный на `l`
    // (длина направляющей шляпки), повернуть на C по часовой
    const pTop = {
      x: p0.x + e.x * l * Math.cos(-C) + e.y * l * Math.sin(-C),
      y: p0.y - e.x * l * Math.sin(-C) + e.y * l * Math.cos(-C)
    };
    // "Нижний" угол стрелки - нормированный вектор `e`, умноженный на `l`
    // (длина направляющей шляпки), повернуть на C против часовой
    const pBottom = {
      x: p0.x + e.x * l * Math.cos(C) + e.y * l * Math.sin(C),
      y: p0.y - e.x * l * Math.sin(C) + e.y * l * Math.cos(C) + 1
    };
    // Рассчитаем ручечки для кривой Безье донца шляпки. Возьмем их длиной в одну треть от расстояния
    // между углами стрелки и повернем их на угол D внутрь шляпки.
    const D = 22 * Math.PI / 180;
    const f = $$.m__sub(pTop, pBottom);

    // Первая контрольная точка кривой Безье донца шляпки.
    const p1 = {
      x: pBottom.x + f.x / 3 * Math.cos(-D) + f.y / 3 * Math.sin(-D),
      y: pBottom.y - f.x / 3 * Math.sin(-D) + f.y / 3 * Math.cos(-D)
    };
    // Вторая контрольная точка кривой Безье донца шляпки (1/3 вектора поворачиваем внутрь).
    const p2 = {
      x: pTop.x + -f.x / 3 * Math.cos(D) + -f.y / 3 * Math.sin(D),
      y: pTop.y - -f.x / 3 * Math.sin(D) + -f.y / 3 * Math.cos(D)
    };
    const bezierBottom = {
      p0: pBottom,
      p1,
      p2,
      p3: pTop
    };
    return bezierBottom;
  };

  // Отрисовывает анимированную канвасную стрелку

  // ==== Параметры
  // * context     - 2д-контекст канваса
  // * context_w   - ширина канваса (нужно для очистки между кадрами анимации)
  // * context_h   - высота канваса (нужно для очистки между кадрами анимации)
  // * bezier      - осевая линия стрелки в виде Безье 3-го порядка, например:
  // {
  // "p0": {"x":   0, "y":  0},
  // "p1": {"x":   0, "y": 50},
  // "p2": {"x": 100, "y": 50},
  // "p3": {"x": 100, "y":  0}
  // }
  // * width   - ширина тела стрелочки в широкой части (попробуйте 10 например)
  // * color   - цвет стрелки
  // * delay   - задержка в начале отрисовки (можно задать 0, чтобы отрисовать сразу же) в миллисекундах
  // * time    - время на отрисовку, в миллисекундах
  // * callback - (опционально) метод, который будет вызван по завершению анимации

  $$.animateArrow = (context, bezier, width, color, duration) => {
    const startTime = Date.now();
    const dfd = $.Deferred();

    const draw = () => {
      const now = Date.now();
      const delta = (now - startTime) / duration;
      if (delta < 1) {
        if (delta !== 0) {
          context.clearRect(0, 0, context.canvas.clientWidth, context.canvas.clientHeight);
          $$.drawArrow(context, $$.bezier__cubic__cutCurve(bezier, 0, delta), width, color);
        }
        requestAnimationFrame(draw);
      } else {
        dfd.resolve();
      }
    };

    requestAnimationFrame(draw);

    dfd.promise();
  };

  // Отрисовывает одну красивую канвасную стрелку

  // ==== Параметры
  // * context    - 2д-контекст канваса
  // * bezier     - осевая линия стрелки в виде Безье 3-го порядка
  // * width     - ширина тела стрелочки в широкой части (попробуйте 10 например)
  // * color     - цвет стрелки
  // * fill      - залить под стрелкой (default: false)
  // * fillColor - цвет заливки под стрелкой (если fill == true)

  $$.drawArrow = (context, bezier, width, color, fill, fillColor) => {
    // Если вытянуть Безье линию в прямую, то угол с раствором 2*A как раз нарисует тело стрелки,
    // с шириной width в
    // самой широкой части. Зная `len` мы можем посчитать угол половины раствора стрелки A.
    const len = $$.bezier__cubic__curveLength(bezier);
    let widthSelf = width;
    if (widthSelf > len * 0.1) {
      widthSelf = len * 0.1;
    }
    const A = Math.asin(widthSelf / 2 / Math.sqrt(len * len + widthSelf * widthSelf / 4));
    // Чтобы нарисовать тело стрелки нам нужно постоить две Безье, чуть-чуть подвигав соответвующие
    // точки. Точка p0 у
    // вспомогательных Безье совпадает с p0 направляющей Безье, так как стрелка растет из точки.

    // Кривизна Безье изменяется при изменении контрольных точек p1 и p2.
    // Назовем первой ручкой кривой отрезок (p0, p1), и второй
    // ручкой соответсвенно отрезок (p3, p2). Двигая ручки мы меняем кривизну.

    // Для начала построим "левую" направляющую. Чтобы стрелка была приятно полненькой без
    // сужений и расширений необходимо взять направляющую Безье, повернуть первую ручку на A против
    // часовой стрелки, точку p3 передвинуть вверх на полширины width и вторую ручку повернуть на
    // A тоже против часовой.
    // Чтобы понять почему это делается вспомните как выглядит стрелка, когда ее вытягивают вдоль прямой.

    // Более того, в зависимости от кривизны кривой длину ручки нужно изменить.
    // К сожалению рисунок в код не вставишь,
    // но представьте круг радиуса R, и ручку длиной L. поворачивая ручку на A, нужно чтобы длина уменьшилась
    // или увеличилась так, чтобы крайняя точка ручка осталась на одной прямой с центром окружности.

    // Note: Олег советует сделать стрелку интерполяцией на ребрах.
    const bezierLeft = _bezierLeft(bezier, widthSelf, A);
    // Аналогично строим "правую" направляющую.
    const bezierRight = _bezierRight(bezier, widthSelf, A);
    // Теперь нарисуем шляпку стрелки - треугольник с вдавленным дном, где он крепится c телом стрелки.
    const bezierBottom = _bezierBottom(bezier, width);
    // Безье кривая дна
    // Находим точки пересечения дна шляпки и направляющих, перестраиваем кривые
    const intersection1 = $$.bezier__cubic__curvesIntersection(bezierLeft, bezierBottom);
    const intersection2 = $$.bezier__cubic__curvesIntersection(bezierRight, bezierBottom);
    if (intersection1 && intersection2) {
      const bezierLeftCutted = $$.bezier__cubic__reverseCurve(
        $$.bezier__cubic__cutCurve(bezierLeft, 0, intersection1[0])
      );
      const bezierRightCutted = $$.bezier__cubic__cutCurve(bezierRight, 0, intersection2[0]);
      const bezierBottomCutted1 = $$.bezier__cubic__reverseCurve(
        $$.bezier__cubic__cutCurve(bezierBottom, intersection1[1], 1)
      );
      const bezierBottomCutted2 = $$.bezier__cubic__reverseCurve(
        $$.bezier__cubic__cutCurve(bezierBottom, 0, intersection2[1])
      );
      context.save();
      // Залить под стрелкой если нужно
      if (fill) {
        context.save();
        context.fillStyle = fillColor;
        context.beginPath();
        context.moveTo(bezier.p0.x, bezier.p0.y);
        context.bezierCurveTo(
          bezier.p1.x,
          bezier.p1.y,
          bezier.p2.x,
          bezier.p2.y,
          bezier.p3.x,
          bezier.p3.y
        );
        context.fill();
        context.restore();
      }
      // Отрисовка стрелки по точкам начиная с носика шляпки
      context.save();
      context.fillStyle = color;
      context.beginPath();
      context.moveTo(bezier.p3.x, bezier.p3.y);
      context.lineTo(bezierBottom.p3.x, bezierBottom.p3.y);
      context.bezierCurveTo(
        bezierBottomCutted1.p1.x,
        bezierBottomCutted1.p1.y,
        bezierBottomCutted1.p2.x,
        bezierBottomCutted1.p2.y,
        bezierBottomCutted1.p3.x,
        bezierBottomCutted1.p3.y
      );
      context.bezierCurveTo(
        bezierLeftCutted.p1.x,
        bezierLeftCutted.p1.y,
        bezierLeftCutted.p2.x,
        bezierLeftCutted.p2.y,
        bezierLeftCutted.p3.x,
        bezierLeftCutted.p3.y
      );
      context.bezierCurveTo(
        bezierRightCutted.p1.x,
        bezierRightCutted.p1.y,
        bezierRightCutted.p2.x,
        bezierRightCutted.p2.y,
        bezierRightCutted.p3.x,
        bezierRightCutted.p3.y
      );
      context.bezierCurveTo(
        bezierBottomCutted2.p1.x,
        bezierBottomCutted2.p1.y,
        bezierBottomCutted2.p2.x,
        bezierBottomCutted2.p2.y,
        bezierBottomCutted2.p3.x,
        bezierBottomCutted2.p3.y
      );
      context.fill();
      context.strokeStyle = color;
      context.stroke();
      context.restore();
      // _dumpBones(context, bezier, width)
      context.restore();
    }
  };
})();

export { arrow };
