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
    const main = PlaybackControl;
    expect(main).to.not.be(null);
  });
});
