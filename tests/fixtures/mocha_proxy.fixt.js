import chai from 'chai';

let expectReal = chai.expect;

// not sure whether this still works in es6 semantics
function expect(...args) {
  // remove assertion expandos
  if (args[0] instanceof Array) {
    delete args[0]._trace;
  }

  // call real chai.expect
  return expectReal.apply(this, args);
}

export default expect;
export {
  expectReal,
};
