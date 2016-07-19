/* global PLUGIN_VERSION */
// node
// vendors
import Clappr from 'clappr';
import Mousetrap from 'mousetrap';
// project
import PlaybackControlHTML from './view.html';
import PlaybackControlCSS from './style.scss';

// locals
const SCALE_FRAMES = 'frames';
const SCALE_SECONDS = 'seconds';
const BUTTON_STATE_DOWN = 'down';
const BUTTON_STATE_UP = 'up';

const defaults = {
  fps: 29
};

class PlaybackControl extends Clappr.UICorePlugin {
  // properties
  get name() { return 'playback_control'; }
  get version() { return PLUGIN_VERSION; }
  get template() { return Clappr.template(PlaybackControlHTML); }
  get attributes() { return { class: 'playback-control' }; }
  get mediaControl() { return this.core.mediaControl; }
  get player() { return this.mediaControl.container; }
  get config() { return this.core.options.playbackControlConfig || defaults; }
  get userInputActionsMap() {
    const actions = {
      // frame navigation
      'nav-second-dec': {
        keys: ['down'],
        events: {
          keydown: () => this.highlightButton(SCALE_SECONDS, -1, BUTTON_STATE_DOWN),
          keyup: () => {
            this.highlightButton(SCALE_SECONDS, -1, BUTTON_STATE_UP);
            this.seekRelativeSeconds(-1);
          }
        }
      },
      'nav-second-inc': {
        keys: ['up'],
        events: {
          keydown: () => this.highlightButton(SCALE_SECONDS, +1, BUTTON_STATE_DOWN),
          keyup: () => {
            this.highlightButton(SCALE_SECONDS, +1, BUTTON_STATE_UP);
            this.seekRelativeSeconds(+1);
          }
        }
      },
      // time(second) nagiation
      'nav-frame-dec': {
        keys: ['left'],
        events: {
          keydown: () => this.highlightButton(SCALE_FRAMES, -1, BUTTON_STATE_DOWN),
          keyup: () => {
            this.highlightButton(SCALE_FRAMES, -1, BUTTON_STATE_UP);
            this.seekRelativeFrames(-1);
          }
        }
      },
      'nav-frame-inc': {
        keys: ['right'],
        events: {
          keydown: () => this.highlightButton(SCALE_FRAMES, +1, BUTTON_STATE_DOWN),
          keyup: () => {
            this.highlightButton(SCALE_FRAMES, +1, BUTTON_STATE_UP);
            this.seekRelativeFrames(+1);
          }
        }
      },
      // playback control
      'playback-pauseresume': {
        keys: ['p'],
        events: {
          keypress: () => {
            if (this.player.isPlaying()) {
              this.player.pause();
            } else {
              this.player.play();
            }
          }
        }
      },
      'playback-switchrate': {
        keys: [
          'ctrl+shift+alt+2',
          'ctrl+shift+alt+3',
          'ctrl+shift+alt+4',
          'ctrl+shift+alt+5',
          'ctrl+shift+alt+6',
          'ctrl+shift+alt+7',
          'ctrl+shift+alt+8',
          'ctrl+shift+1',
          'ctrl+shift+2',
          'ctrl+shift+3',
          'ctrl+shift+4',
          'ctrl+shift+5',
          'ctrl+shift+6',
          'ctrl+shift+7',
          'ctrl+shift+8'
        ],
        events: {
          keydown: (e) => {
            var value = String.fromCharCode(e.keyCode);
            var sign = e.altKey ? -1 : 1;
            var rate = (Number(value) - 1) * sign;
            // console.log(e, 'switched playback rate to', e.keyCode, value, rate);
            this.mediaControl.trigger('playbackRate', rate);
          }
        }
      }
    };
    return actions;
  }
  // methods
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
    // discard default clappr events
    // const config = this.config;
    this.listenTo(this.mediaControl, Clappr.Events.MEDIACONTROL_RENDERED, this.render);
    this.listenTo(this.mediaControl, Clappr.Events.MEDIACONTROL_CONTAINERCHANGED, this.onContainerChanged);
    // non-clappr events
    Mousetrap.reset();
    for (let [, userAction] of Object.entries(this.userInputActionsMap)) {
      for (let [event, callback] of Object.entries(userAction.events)) {
        Mousetrap.bind(userAction.keys, callback, event);
      }
    }
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
    let fps = defaults.fps;
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
