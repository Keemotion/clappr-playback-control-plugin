// node
// vendors
import chai from 'chai';
// project
import PlaybackControl from 'plugin';
// locals
chai.should();
const expect = chai.expect;

describe('EntryPoint', () => {
  beforeEach(() => {
    expect(PlaybackControl).not.toBe(null);
  });
});
