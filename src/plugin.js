// node
// vendors
import Clappr from 'clappr';
import MouseTrap from 'mousetrap';
// project
import PlaybackControlHTML from './view.html';
import PlaybackControlCSS from './style.scss';

// locals
const SCALE_FRAMES = 'frames';
const SCALE_SECONDS = 'seconds';
const BUTTON_STATE_DOWN = 'down';
const BUTTON_STATE_UP = 'up';

const FPS_DEFAULT = 29;

class PlaybackControl extends Clappr.UICorePlugin {
  get name() { return 'playback_control'; }
  get template() {
    return Clappr.template(PlaybackControlHTML);
  }
  get attributes() {
    return {
      class: 'playback-control',
    };
  }
  get mediaControl() {
    return this.core.mediaControl;
  }
  get player() {
    return this.mediaControl.container;
  }
  onContainerChanged() {
    this.invalidate();
  }
  seekScaleValue(scale, value) {
    switch (scale) {
      case SCALE_FRAMES:
        this.seekRelativeFrames(value);
        break;
      case SCALE_SECONDS:
        this.seekRelativeSeconds(value);
        break;
      default:
        break;
    }
  }
  findButton(scale, value) {
    const signed = value > 0 ? `+${value}` : value;
    return this.$el.find(`[data-step-scale="${scale}"][data-step-value="${signed}"]`);
  }
  highlightButton(scale, value, state) {
    const button = this.findButton(scale, value);
    switch (state) {
      case BUTTON_STATE_DOWN:
        button.children()[1].className = 'playback-control-action-highlight';
        break;
      case BUTTON_STATE_UP:
        button.children()[1].className = '';
        break;
      default:
        break;
    }
    return button;
  }
  onButtonClick(e) {
    const sender = e.currentTarget;
    const scale = sender.getAttribute('data-step-scale');
    const value = Number(sender.getAttribute('data-step-value'));
    // control player
    this.seekScaleValue(scale, value);
  }
  onActionsMouseWheel(e) {
    const sender = e.currentTarget;
    const scale = sender.getAttribute('data-step-scale');
    const value = ((e.detail < 0) || (e.wheelDelta > 0)) ? 1 : -1;
    this.seekScaleValue(scale, value);
    e.stopPropagation();
    e.preventDefault();
    return false;
  }
  bindEvents() {
    const player = this.player;
    // clappr events
    this.listenTo(this.mediaControl, Clappr.Events.MEDIACONTROL_RENDERED, this.render);
    this.listenTo(this.mediaControl, Clappr.Events.MEDIACONTROL_CONTAINERCHANGED, this.onContainerChanged);
    // non-clappr events
    MouseTrap.addKeycodes({
      144: 'numlock',
    });
    // standard keyboard shortcuts
    MouseTrap.bind('q', () => this.highlightButton(SCALE_SECONDS, -1, BUTTON_STATE_DOWN), 'keydown');
    MouseTrap.bind('q', () => {
      this.highlightButton(SCALE_SECONDS, -1, BUTTON_STATE_UP);
      this.seekRelativeSeconds(-1);
    }, 'keyup');
    MouseTrap.bind('w', () => this.highlightButton(SCALE_SECONDS, +1, BUTTON_STATE_DOWN), 'keydown');
    MouseTrap.bind('w', () => {
      this.highlightButton(SCALE_SECONDS, +1, BUTTON_STATE_UP);
      this.seekRelativeSeconds(+1);
    }, 'keyup');
    MouseTrap.bind('a', () => this.highlightButton(SCALE_FRAMES, -1, BUTTON_STATE_DOWN), 'keydown');
    MouseTrap.bind('a', () => {
      this.highlightButton(SCALE_FRAMES, -1, BUTTON_STATE_UP);
      this.seekRelativeFrames(-1);
    }, 'keyup');
    MouseTrap.bind('s', () => this.highlightButton(SCALE_FRAMES, +1, BUTTON_STATE_DOWN), 'keydown');
    MouseTrap.bind('s', () => {
      this.highlightButton(SCALE_FRAMES, +1, BUTTON_STATE_UP);
      this.seekRelativeFrames(+1);
    }, 'keyup');
    MouseTrap.bind('space', () => {
      if (player.isPlaying()) {
        player.pause();
      } else {
        player.play();
      }
    });
    // shuttle xpress - large wheel with arrow keys fallback(time control)
    MouseTrap.bind('up', () => this.seekRelativeSeconds(-1));
    MouseTrap.bind('down', () => this.seekRelativeSeconds(+1));
    // shuttle xpress - small wheel with arrow keys fallback(time control)
    MouseTrap.bind('left', () => this.seekRelativeFrames(-1));
    MouseTrap.bind('right', () => this.seekRelativeFrames(+1));
    // shuttle xpress - small wheel with ctrl +/- keys combo fallback(frame control)
    MouseTrap.bind('ctrl+-', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.seekRelativeFrames(-1);
    });
    MouseTrap.bind(['ctrl+=', 'ctrl+plus'], (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.seekRelativeFrames(+1);
    });
    // shuttle express - buttons(numeric keys fallback)
    const switchPlaybackRate = (e, rate) => {
      e.preventDefault();
      e.stopPropagation();
      this.mediaControl.trigger('playbackRate', rate);
      return false;
    };
    MouseTrap.bind('0', (e) => switchPlaybackRate(e, 0.5));
    MouseTrap.bind(['1', 'numlock+alt+left'], (e) => switchPlaybackRate(e, 1));
    MouseTrap.bind(['2', 'numlock+ctrl+h'], (e) => switchPlaybackRate(e, 2));
    MouseTrap.bind(['3', 'ctrl+shift+o', 'numlock+ctrl+i'], (e) => switchPlaybackRate(e, 3));
    MouseTrap.bind(['4', 'numlock+ctrl+t'], (e) => switchPlaybackRate(e, 4));
    MouseTrap.bind(['5', 'numlock+alt+right'], (e) => switchPlaybackRate(e, 5));
    MouseTrap.bind('6', (e) => switchPlaybackRate(e, 6));
    MouseTrap.bind('7', (e) => switchPlaybackRate(e, 7));
    MouseTrap.bind('8', (e) => switchPlaybackRate(e, 8));
    MouseTrap.bind('9', (e) => switchPlaybackRate(e, 9));
  }
  stopListening() {
    super.stopListening();
    // non-clappr events
    if (this.onMouseWheelDelegate) {
      this.onMouseWheelDelegate.unbind();
      this.onMouseWheelDelegate = null;
    }
  }
  render() {
    const style = Clappr.Styler.getStyleFor(PlaybackControlCSS);
    this.$el
      .html(this.template())
      .append(style);
    this.$el
      .find('[type="button"]')
      .off('click')
      .on('click', this.onButtonClick.bind(this));
    this.$el
      .find('.playback-control-actions')
      .off('DOMMouseScroll')
      .on('DOMMouseScroll', this.onActionsMouseWheel.bind(this));
    this.$el
      .find('.playback-control-actions')
      .off('mousewheel')
      .on('mousewheel', this.onActionsMouseWheel.bind(this));
    this.mediaControl
      .$('.media-control-left-panel[data-media-control]')
      .append(this.el);
    return this;
  }
  invalidate() {
    this.stopListening();
    this.bindEvents();
  }
  getFPS() {
    let fps = FPS_DEFAULT;
    if (this.player && this.player.options && this.player.options.playbackControl) {
      fps = this.player.options.playbackControl.fps || fps;
    }
    return fps;
  }
  seekRelativeFrames(frames) {
    const player = this.player;
    if (player.isPlaying()) {
      player.pause();
    }
    const currentTime = player.getCurrentTime();
    const targetTime = currentTime + (frames / this.getFPS());
    if ((targetTime <= 0) || (targetTime >= player.getDuration())) {
      // TODO: decide on how to norm bounds
    } else {
      const playback = this.core.getCurrentPlayback();
      player.seek(targetTime);
      // Trigger the waiting event that will buffer the video if targetTime is not buffered yet
      const bufferedTimeRange = playback.el.buffered;
      let targetFrameBuffered = false;
      for (let i = 0; i < bufferedTimeRange.length; i++) {
        if ((targetTime >= bufferedTimeRange.start(i)) && (targetTime <= bufferedTimeRange.end(i))) {
          targetFrameBuffered = true;
          break;
        }
      }
      if (!targetFrameBuffered) {
        playback.trigger('waiting');
      }
    }
  }
  seekRelativeSeconds(seconds) {
    const player = this.player;
    if (player.isPlaying()) {
      player.pause();
    }
    let position = player.getCurrentTime() + seconds;
    if (position < 0) {
      position = 0;
    } else if (position > player.getDuration()) {
      position = player.getDuration();
    }
    player.seek(position);
  }
}

export default PlaybackControl;
