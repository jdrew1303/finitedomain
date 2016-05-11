import expect from '../fixtures/mocha_proxy.fixt';
import {
  specDomainCreateRange,
  specDomainCreateValue,
} from '../fixtures/domain.fixt';

import {
  config_addConstant,
  //config_addPropagator,
  config_addVar,
  config_addVarValue,
  //config_addVarAnon,
  config_addVarsA,
  config_addVarsO,
  config_clone,
  config_create,
  config_generateVars,
  //config_getUnknownVars,
  //config_setDefaults,
  config_setOptions,
} from '../../src/config';
import {
  SUB,
  SUP,
} from '../../src/helpers';
import {
  fdvar_createRange,
} from '../../src/fdvar';
import {
  domain_createRange,
} from '../../src/domain';
import {
  space_createRoot,
  space_initFromConfig,
} from '../../src/space';

describe('config.spec', function() {

  describe('config_create', function() {

    it('should return an object', function() {
      expect(config_create()).to.be.an('object');
    });

  });

  describe('config_generateVars', function() {

    it('should exist', function() {
      expect(config_generateVars).to.be.a('function');
    });

    it('should not require a vars object', function() {
      let config = config_create();

      config_generateVars(config);
      expect(true, 'no throw').to.equal(true);
    });

    it('should return an object if no vars obj was given', function() {
      let config = config_create();
      let out = config_generateVars(config);

      expect(out).to.be.an('object');
    });

    it('should work with empty object', function() {
      let config = config_create();

      config_generateVars(config, {});
      expect(true, 'no throw').to.equal(true);
    });

    it('should return given vars object', function() {
      let config = config_create();
      let obj = {};
      let out = config_generateVars(config, obj);

      expect(out).to.equal(obj);
    });

    it('should create a constant', function() {
      let config = config_create();
      let name = config_addConstant(config, 10);
      let vars = config_generateVars(config);

      expect(vars[name]).to.eql(fdvar_createRange(name, 10, 10));
    });

    it('should create a full width var', function() {
      let config = config_create();
      let name = config_addVar(config);
      let vars = config_generateVars(config);

      expect(vars[name]).to.eql(fdvar_createRange(name, SUB, SUP));
    });

    it('should clone a domained var', function() {
      let config = config_create();
      let name = config_addVar(config, undefined, 32, 55);
      let vars = config_generateVars(config);

      expect(vars[name]).to.eql(fdvar_createRange(name, 32, 55));
    });
  });

  describe('config_addConstant', function() {

    it('should add the value', function() {
      let config = config_create();
      let name = config_addConstant(config, 15);

      expect(config.all_var_names.indexOf(name)).to.be.at.least(0);
      expect(config.constant_uid).to.be.above(0);
      expect(config.initial_vars[name]).to.equal(15);
    });

    it('should populate the constant cache', function() {
      let config = config_create();
      let name = config_addConstant(config, 15);

      expect(config.constant_cache[15]).to.equal(name);
    });

    it('should reuse the constant cache if available', function() {
      let config = config_create();
      let name1 = config_addConstant(config, 1);
      let name2 = config_addConstant(config, 2);
      let name3 = config_addConstant(config, 1);

      expect(name1).to.not.equal(name2);
      expect(name1).to.equal(name3);
    });
  });

  describe('config_addVar', function() {

    it('should accept domain as param', function() {
      let config = config_create();
      config_addVar(config, 'A', [0, 1]);

      expect(config.initial_vars.A).to.eql([0, 1]);
    });

    it('should clone the input domains', function() {
      let d = [0, 1];
      let config = config_create();
      config_addVar(config, 'A', d);

      expect(config.initial_vars.A).to.eql(d);
      expect(config.initial_vars.A).not.to.equal(d);
    });

    it('should accept a number', function() {
      let config = config_create();
      config_addVar(config, 'A', 5);

      expect(config.initial_vars.A).to.eql(5);
    });

    it('should accept two numbers', function() {
      let config = config_create();
      config_addVar(config, 'A', 5, 20);

      expect(config.initial_vars.A).to.eql([5, 20]);
    });

    it('should accept undefined', function() {
      let config = config_create();
      config_addVar(config, 'A');

      expect(config.initial_vars.A).to.eql(undefined);
    });

    it('should return a constant for an anonymous solved domain', function() {
      let config = config_create();
      let A = config_addVar(config, undefined, [1, 1]);
      let B = config_addConstant(config, 1);

      expect(A).to.equal(B);
    });

    it('should return a constant for an anonymous var with two numbers', function() {
      let config = config_create();
      let A = config_addVar(config, undefined, 50, 50);
      let B = config_addConstant(config, 50);

      expect(A).to.equal(B);

    });
  });

  describe('config_addVarValue', function() {

    it('should accept domain as param', function() {
      let config = config_create();
      config_addVarValue(config, 'A', [0, 1]);

      expect(config.initial_vars.A).to.eql([0, 1]);
    });

    it('should not clone the input domains', function() {
      let d = [0, 1];
      let config = config_create();
      config_addVarValue(config, 'A', d);

      expect(config.initial_vars.A).to.eql(d);
      expect(config.initial_vars.A).to.equal(d);
    });

    it('should accept a number', function() {
      let config = config_create();
      config_addVarValue(config, 'A', 5);

      expect(config.initial_vars.A).to.eql(5);
    });

    it('should throw if given lo, hi', function() {
      let config = config_create();

      expect(() => config_addVarValue(config, 'A', 5, 20)).to.throw();
    });

    it('should accept undefined', function() {
      let config = config_create();
      config_addVarValue(config, 'A');

      expect(config.initial_vars.A).to.eql(undefined);
      expect(config.all_var_names).to.contain('A');
    });

    it('should throw if the name is already registered', function() {
      // either prevents you from double registering vars or internal sanity protection

      let config = config_create();
      config_addVarValue(config, 'A');

      expect(config.initial_vars.A).to.eql(undefined);
      expect(config.all_var_names).to.contain('A');
      expect(_ => config_addVarValue(config, 'A')).to.throw('Var name already part of this config. Probably a bug?');
    });

    it('should only add an unkown constant once', function() {
      let config = config_create();
      config_addVarValue(config, 'A', [34, 34]);
      config_addVarValue(config, 'B', [34, 34]);

      expect(config.constant_cache[34]).to.equal('A');
    });
  });

  describe('config_addVarsA', function() {

    it('should add all vars in the array with domain', function() {
      let config = config_create();
      config_addVarsA(config, [
        'A', 'B', 'C',
      ], [0, 1]);

      expect(config.initial_vars.A).to.eql([0, 1]);
      expect(config.initial_vars.B).to.eql([0, 1]);
      expect(config.initial_vars.C).to.eql([0, 1]);
    });

    it('should add all vars in the array with lo', function() {
      let config = config_create();
      config_addVarsA(config, [
        'A', 'B', 'C',
      ], 0);

      expect(config.initial_vars.A).to.eql(0);
      expect(config.initial_vars.B).to.eql(0);
      expect(config.initial_vars.C).to.eql(0);
    });


    it('should add all vars in the array with lo, hi', function() {
      let config = config_create();
      config_addVarsA(config, [
        'A', 'B', 'C',
      ], 10, 20);

      expect(config.initial_vars.A).to.eql([10, 20]);
      expect(config.initial_vars.B).to.eql([10, 20]);
      expect(config.initial_vars.C).to.eql([10, 20]);
      expect(config.initial_vars.A).to.not.equal(config.initial_vars.B);
      expect(config.initial_vars.B).to.not.equal(config.initial_vars.C);
    });

    it('should add all vars with the array with no domain', function() {
      let config = config_create();
      config_addVarsA(config, [
        'A', 'B', 'C',
      ]);

      expect(config.initial_vars.A).to.eql(undefined);
      expect(config.initial_vars.B).to.eql(undefined);
      expect(config.initial_vars.C).to.eql(undefined);
      expect(config.all_var_names).to.contain('A');
      expect(config.all_var_names).to.contain('B');
      expect(config.all_var_names).to.contain('C');
    });
  });

  describe('config_setOptions', function() {

    it('should exist', function() {
      expect(config_setOptions).to.be.a('function');
    });

    it('should not require an object', function() {
      let config = config_create();
      config_setOptions(config);

      expect(true, 'no crash').to.equal(true);
    });

    it('should copy the filter', function() {
      let config = config_create();
      config_setOptions(config, {filter: 'A'});

      expect(config.var_filter_func).to.equal('A');
    });

    it('should copy the var', function() {
      let config = config_create();
      config_setOptions(config, {var: 'A'});

      expect(config.next_var_func).to.equal('A');
    });

    it('should init the var config of a single level without priority_list', function() {
      let config = config_create();
      let opt = {
        dist_name: 'max',
      };
      config_setOptions(config, {
        var: opt,
      });

      expect(config.next_var_func).to.eql({dist_name: 'max'});
      expect(opt.priority_hash).to.equal(undefined);
    });

    it('should init the var config of a single level and a priority_list', function() {
      let config = config_create();
      let opt = {
        dist_name: 'list',
        priority_list: ['B_list', 'A_list'],
      };
      config_setOptions(config, {
        var: opt,
      });

      expect(config.next_var_func, 'next var func').to.equal(opt);
      expect(opt.priority_hash, 'priority hash').to.eql({B_list: 2, A_list: 1});
    });

    it('should init the var config with a fallback level', function() {
      let config = config_create();
      let opt = {
        dist_name: 'list',
        priority_list: ['B_list', 'A_list'],
        fallback_config: {
          dist_name: 'markov',
          fallback_config: 'size',
        },
      };
      config_setOptions(config, {var: opt});

      expect(config.next_var_func).to.equal(opt);
      expect(opt.priority_hash).to.eql({B_list: 2, A_list: 1});
    });

    it('should put the priority hash on the var opts even if fallback', function() {
      let config = config_create();
      let opt = {
        dist_name: 'max',
        fallback_config: {
          dist_name: 'list',
          priority_list: ['B_list', 'A_list'],
        },
      };
      config_setOptions(config, {var: opt});

      expect(config.next_var_func).to.equal(opt);
      expect(opt.priority_hash).to.eql(undefined);
      expect(opt.fallback_config.priority_hash).to.eql({B_list: 2, A_list: 1});
    });

    it('should copy the targeted var names', function() {
      let config = config_create();
      config_setOptions(config, {targeted_var_names: 'A'});

      expect(config.targetedVars).to.equal('A');
    });

    it('should copy the var distribution config', function() {
      let config = config_create();
      config_setOptions(config, {var_dist_config: 'A'});

      expect(config.var_dist_options).to.equal('A');
    });

    it('should copy the timeout callback', function() {
      let config = config_create();
      config_setOptions(config, {timeout_callback: 'A'});

      expect(config.timeout_callback).to.equal('A');
    });
  });

  describe('config_addVarsO', function() {

    it('should add all vars in the array with domain', function() {
      let config = config_create();
      config_addVarsO(config, {
        A: [0, 1],
        B: [0, 1],
        C: [0, 1],
      });

      expect(config.initial_vars.A).to.eql([0, 1]);
      expect(config.initial_vars.B).to.eql([0, 1]);
      expect(config.initial_vars.C).to.eql([0, 1]);
    });

    it('should add all vars in the array with lo', function() {
      let config = config_create();
      config_addVarsO(config, {
        A: 20,
        B: 30,
        C: 40,
      });

      expect(config.initial_vars.A).to.eql(20);
      expect(config.initial_vars.B).to.eql(30);
      expect(config.initial_vars.C).to.eql(40);
    });

    it('should add all vars with the array with no domain', function() {
      let config = config_create();
      config_addVarsO(config, {
        A: undefined,
        B: undefined,
        C: undefined,
      });

      expect(config.initial_vars.A).to.eql(undefined);
      expect(config.initial_vars.B).to.eql(undefined);
      expect(config.initial_vars.C).to.eql(undefined);
      expect(config.all_var_names).to.contain('A');
      expect(config.all_var_names).to.contain('B');
      expect(config.all_var_names).to.contain('C');
    });

    describe('config_addVar', function() {

      describe('through config api', function() {

        it('should accept full parameters', function() {
          let space = space_createRoot();
          config_addVar(space.config, 'A', 0, 1);
          space_initFromConfig(space);

          expect(space.vars.A).to.eql(fdvar_createRange('A', 0, 1));
        });

        it('should accept only lo and assume [lo,lo] for domain', function() {
          let space = space_createRoot();
          config_addVar(space.config, 'A', 0);
          space_initFromConfig(space);

          expect(space.vars.A).to.eql(fdvar_createRange('A', 0, 0));
        });

        it('should accept lo as the domain if array', function() {
          let input_domain = [0, 1];
          let space = space_createRoot();
          config_addVar(space.config, 'A', input_domain);
          space_initFromConfig(space);

          expect(space.vars.A).to.eql(fdvar_createRange('A', 0, 1));
          expect(space.vars.A.dom).to.not.equal(input_domain); // should clone
        });

        it('should create a full wide domain for var without lo/hi', function() {
          let space = space_createRoot();
          config_addVar(space.config, 'A');
          space_initFromConfig(space);

          expect(space.vars.A).to.eql(fdvar_createRange('A', SUB, SUP));
        });

        it('should create a full wide domain for anonymous var', function() {
          let space = space_createRoot();
          config_addVar(space.config);
          space_initFromConfig(space);

          expect(space.vars[space.config.all_var_names[0]].dom).to.eql(domain_createRange(SUB, SUP));
        });

        it('should create a new var', function() {
          let space = space_createRoot();
          config_addVar(space.config, 'foo', 100);
          space_initFromConfig(space);

          expect(space.config.all_var_names).to.eql(['foo']);
          expect(space.unsolvedVarNames).to.eql(['foo']);
          expect((space.vars.foo != null)).to.equal(true);
        });

        it('should set var to domain', function() {
          let space = space_createRoot();
          config_addVar(space.config, 'foo', 100);
          space_initFromConfig(space);

          expect(space.vars.foo.dom).to.eql(domain_createRange(100, 100));
        });

        it('should set var to full domain if none given', function() {
          let space = space_createRoot();
          config_addVar(space.config, 'foo');
          space_initFromConfig(space);

          expect(space.vars.foo.dom).to.eql(specDomainCreateRange(SUB, SUP));
        });

        it('should throw if var already exists', function() {
          // this should throw an error instead. when would you _want_ to do this?
          let space = space_createRoot();
          config_addVar(space.config, 'foo', 100);
          space_initFromConfig(space);

          expect(space.vars.foo.dom).to.eql(specDomainCreateValue(100));
          expect(() => config_addVar(space.config, 'foo', 200)).to.throw();
        });

        it('should create a var without domain', function() {
          let config = config_create();
          config_addVar(config, 'A', undefined);

          expect(config.all_var_names).to.eql(['A']);
          expect(config.initial_vars.foo).to.eql(undefined);
        });
      });

      describe('through space api', function() {

        it('should return the name', function() {
          let space = space_createRoot();
          space_initFromConfig(space);

          expect(config_addVar(space.config, 'foo', 100)).to.equal('foo');
        });

        it('should create a new var', function() {
          let space = space_createRoot();
          space_initFromConfig(space);
          expect(space.config.all_var_names.length, 'before decl').to.eql(0); // no vars... right? :)
          expect(space.unsolvedVarNames.length, 'before decl').to.eql(0); // no vars... right? :)

          config_addVar(space.config, 'foop', 22);
          space_initFromConfig(space);
          expect(space.config.all_var_names.length, 'after decl').to.eql(1);
          expect(space.unsolvedVarNames.length, 'after decl').to.eql(1);
        });

        it('should throw if value is OOB', function() {
          let space = space_createRoot();
          space_initFromConfig(space);

          expect(() => config_addVar(space.config, SUB - 100)).to.throw();
          expect(() => config_addVar(space.config, SUP + 100)).to.throw();
        });

        it('should create a full range var if no name and no domain is given', function() {
          let space = space_createRoot();
          let name = config_addVar(space.config);
          space_initFromConfig(space);

          expect(space.vars[name].dom).to.eql(specDomainCreateRange(SUB, SUP));
        });

        it('should create a var without domain', function() {
          let space = space_createRoot();
          let name = config_addVar(space.config, 'A', undefined);
          space_initFromConfig(space);

          expect(name).to.equal('A');
          expect(space.config.all_var_names).to.eql(['A']);
          expect(space.config.initial_vars.foo).to.eql(undefined);
        });
      });
    });

    describe('config_addVarsA', function() {
      // to migrate

      it('should create some new vars', function() {
        let space = space_createRoot();
        let names = ['foo', 'bar', 'baz'];
        config_addVarsA(space.config, names, 100);
        space_initFromConfig(space);

        expect(space.config.all_var_names).to.eql(names);
        expect(space.unsolvedVarNames).to.eql(names);

        for (let i = 0; i < names.length; ++i) {
          let name = names[i];
          expect(space.vars[name]).to.be.an('object');
          expect(space.vars[name].id).to.equal(name);
          expect(space.vars[name].dom).to.eql([100, 100]);
        }
      });

      it('should set to given domain', function() {
        let space = space_createRoot();
        let names = ['foo', 'bar', 'baz'];
        let domain = specDomainCreateValue(100);
        config_addVarsA(space.config, names, domain);
        space_initFromConfig(space);

        expect(space.config.all_var_names).to.eql(names);
        expect(space.unsolvedVarNames).to.eql(names);
        for (let i = 0; i < names.length; ++i) {
          let name = names[i];
          expect((space.vars[name] != null)).to.equal(true);
          expect(space.vars[name].dom, 'domain should be cloned').not.to.equal(domain);
          expect(space.vars[name].dom).to.eql(domain);
        }
      });
      //for name2 in names
      //  expect(space.vars[name].dom, 'domains should be cloned').not.to.equal space.vars[name2]

      it.skip('should be set to full domain if none given', function() {
        // TOFIX: this test is broken. the inner loop is checking the wrong thing (dom === var) and therefor always passes
        let space = space_createRoot();
        let names = ['foo', 'bar', 'baz'];
        let domain = specDomainCreateRange(SUB, SUP);
        config_addVarsA(space.config, names);
        space_initFromConfig(space);

        expect(space.config.all_var_names).to.eql(names);
        expect(space.unsolvedVarNames).to.eql(names);
        for (let i = 0; i < names.length; ++i) {
          let name = names[i];
          expect((space.vars[name] != null)).to.equal(true);
          expect(space.vars[name].dom).to.eql(domain);
          for (let j = 0; j < names.length; ++j) {
            let name2 = names[j];
            expect(space.vars[name].dom, 'domains should be cloned').not.to.equal(space.vars[name2]);
          }
        }
      });
    });
  });

  describe('config_clone', function() {

    it('should exist', function() {
      expect(config_clone).to.be.a('function');
    });

    it('should clone a config', function() {
      let config = config_create();
      let clone = config_clone(config);

      expect(clone).to.eql(config);
    });

    it('should clone a config with targetedVars as an array', function() {
      let config = config_create();
      let vars = ['a', 'b'];
      config.targetedVars = vars;
      let clone = config_clone(config);

      expect(clone.targetedVars).to.eql(vars);
    });

    it('should clone a config with targetedVars as a string', function() {
      let config = config_create();
      let vars = 'foobala';
      config.targetedVars = vars;
      let clone = config_clone(config);

      expect(clone.targetedVars).to.eql(vars);
    });

    it('should clone a config with targetedVars as an undefined', function() {
      let config = config_create();
      config.targetedVars = undefined;
      let clone = config_clone(config);

      expect(clone.targetedVars).to.eql(undefined);
    });

    it('should accept a new set of new vars', function() {
      let config = config_create();
      let newVars = {};
      let clone = config_clone(config, newVars);

      expect(clone.initial_vars).to.eql(newVars);
    });
  });
});
