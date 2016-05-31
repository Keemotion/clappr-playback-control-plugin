# Clappr Playback Control Plugin

<img src="https://raw.githubusercontent.com/Keemotion/clappr-playback-control-plugin/master/screenshot.png"/>

## Usage

```
npm install --save clappr-playback-control-plugin
```

Add both Clappr and Playback Rate plugin scripts:

```html
<head>
  <script type="text/javascript" src="//cdn.clappr.io/0.2.52/clappr.min.js"></script>
  <script type="text/javascript" src="dist/clappr-playback-control-plugin.js"></script>
</head>
```
or
```javascript
import Clappr from 'clappr';
import PlaybackControlPlugin from 'clappr-playback-control-plugin';
```

Then just add `PlaybackControlPlugin` into the list of plugins of your player instance:

```javascript
var player = new Clappr.Player({
  source: "http://your.video/here.m3u8",
  plugins: {
    'core': [PlaybackControlPlugin]
  }
});
```

You can also customize the labels and title:

```javascript
var player = new Clappr.Player({
  source: "http://your.video/here.m3u8",
  plugins: {
    'core': [PlaybackControlPlugin]
  },
  playbackControlConfig: {
  },
});
```
