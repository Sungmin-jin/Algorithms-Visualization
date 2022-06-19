const curry = (f) => (a, ...bs) =>
  bs.length ? f(a, ...bs) : (...bs) => f(a, ...bs);

export const filter = curry(function* (f, iter) {
  for (const a of iter) {
    if (f(a)) yield a;
  }
});

export const map = curry(function* (f, iter) {
  for (const a of iter) {
    yield f(a);
  }
});

export const take = curry(function (length, iter) {
  let res = [];
  for (const a of iter) {
    res.push(a);
    if (res.length === length) return res;
  }
});

export const reduce = curry(function (f, acc, iter) {
  if (arguments.length === 2) {
    iter = acc[Symbol.iterator]();
    acc = iter.next().value;
  }
  for (const a of iter) {
    acc = f(acc, a);
  }
  return acc;
});

export const flat = function* (iter) {
  for (const a of iter) {
    if (a && a[Symbol.iterator]) {
      for (const b of a) {
        yield b;
      }
    } else {
      yield a;
    }
  }
};

export const go = (...as) => reduce((a, f) => f(a), as);
