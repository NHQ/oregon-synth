const createSynth = require('./plumbing/synth')

module.exports = function ({regl, audioContext, keyboard}) {
  createSynth({
    regl,
    audioContext,
    keyboard,
    shader: `
    float pcm(float t, float keys[NUM_KEYS]) {
      float result = 0.0;
      float k, x, m = 0.0;
      float tt = ${2.0 * Math.PI} * t;
      for (int i = 0; i < NUM_KEYS; ++i) {
        k = step(0.01, keys[i]);
        m += k;
        x = pow(2.0, float(i) / 12.0);
        result += k * sin(t * tt * 200.0 * x);
      }
      return result;
    }`,
    filter: `
    float filter(float keys[NUM_KEYS]) {
      float result = sample(0.0);
      for (int i = 1; i < 40; i++) {
        result += sample(float(i)) * exp(-0.25 * float(i * i)) / 4.0;
      }
      return result;
    }
    `
  }).connect(audioContext.destination)
}
