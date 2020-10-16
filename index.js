const makeRequest = (val, secondAttempt) => {
  const isSucceed = !!(secondAttempt && Math.random() > 0.5);
  const rand = isSucceed ? 99 : Math.random();
  console.log(rand.toFixed(1));
  return rand > 0.5 ? Promise.resolve(val) : Promise.reject(val);
};

const errors = [];

const guardedRequest = (val) =>
  makeRequest(val).then(
    (v) => v,
    (e) => {
      errors.push("catched: " + e);
      //throw "stopped on " + val;
      return makeRequest(val, true).then(
        (r) => r,
        (e) => {
          throw "stopped on " + e;
        }
      );
    }
  );

function foo() {
  console.log("foo");
  return guardedRequest("foo");
}

function bar(arg) {
  console.log("bar, arg: " + arg);
  return guardedRequest("bar");
}

function zed(arg) {
  console.log("zed, arg: " + arg);
  return guardedRequest("zed");
}

function baz(arg) {
  console.log("baz, arg: " + arg);
  return guardedRequest("baz");
}

/* foo()
  .then(bar)
  .then(zed)
  .then(baz)
  .catch((e) => {
    console.log(e);
  })
  .then(() => console.log(errors)); */

const makeCall = async () => {
  try {
    const arg1 = await foo();
    const arg2 = await bar(arg1);
    const arg3 = await zed(arg2);
    const arg4 = await baz(arg3);
    console.log(arg4);
  } catch (e) {
    console.log(errors);
    console.log(e);
  }
};

makeCall();
