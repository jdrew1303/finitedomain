import expect from '../fixtures/mocha_proxy.fixt';

import {
  EMPTY,
  SMALL_MAX_FLAG,

  ASSERT,
} from '../../src/helpers';
import {
  ZERO,
  ONE,
  TWO,
  THREE,
  FOUR,
  FIVE,
  SIX,
  SEVEN,
  EIGHT,
  NINE,
  TEN,
  ELEVEN,
  TWELVE,
  THIRTEEN,
  FOURTEEN,
  FIFTEEN,
  SIXTEEN,
  SEVENTEEN,
  EIGHTEEN,
  NINETEEN,
  TWENTY,
  TWENTYONE,
  TWENTYTWO,
  TWENTYTHREE,
  TWENTYFOUR,
  TWENTYFIVE,
  TWENTYSIX,
  TWENTYSEVEN,
  TWENTYEIGHT,
  TWENTYNINE,
  THIRTY,
} from '../../src/domain';

describe('src/helpers.spec', function() {

  describe('SMALL_MAX_FLAG', function() {

    it('should equal the value of all flags enabled', function() {
      let start = EMPTY;

      start |= ZERO;
      start |= ONE;
      start |= TWO;
      start |= THREE;
      start |= FOUR;
      start |= FIVE;
      start |= SIX;
      start |= SEVEN;
      start |= EIGHT;
      start |= NINE;
      start |= TEN;
      start |= ELEVEN;
      start |= TWELVE;
      start |= THIRTEEN;
      start |= FOURTEEN;
      start |= FIFTEEN;
      start |= SIXTEEN;
      start |= SEVENTEEN;
      start |= EIGHTEEN;
      start |= NINETEEN;
      start |= TWENTY;
      start |= TWENTYONE;
      start |= TWENTYTWO;
      start |= TWENTYTHREE;
      start |= TWENTYFOUR;
      start |= TWENTYFIVE;
      start |= TWENTYSIX;
      start |= TWENTYSEVEN;
      start |= TWENTYEIGHT;
      start |= TWENTYNINE;
      start |= THIRTY;

      expect(start, '\n' + start.toString(2) + '\n' + SMALL_MAX_FLAG.toString(2)).to.equal(SMALL_MAX_FLAG);
    });
  });

  describe('ASSERT', function() {

    it('should exist', function() {
      expect(ASSERT).to.be.a('function');
    });

    it('should do nothing when you pass true', function() {
      expect(ASSERT(true)).to.equal(undefined);
    });

    it('should throw if you pass on false', function() {
      expect(() => ASSERT(false)).to.throw('Assertion fail: ');
    });
  });
});
