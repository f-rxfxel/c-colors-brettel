const brettel_params = {
  protan: {
    rgbCvdFromRgb_1: [
      0.1451, 1.20165, -0.34675, 0.10447, 0.85316, 0.04237, 0.00429, -0.00603,
      1.00174,
    ],
    rgbCvdFromRgb_2: [
      0.14115, 1.16782, -0.30897, 0.10495, 0.8573, 0.03776, 0.00431, -0.00586,
      1.00155,
    ],
    separationPlaneNormal: [0.00048, 0.00416, -0.00464],
  },

  deutan: {
    rgbCvdFromRgb_1: [
      0.36198, 0.86755, -0.22953, 0.26099, 0.64512, 0.09389, -0.01975, 0.02686,
      0.99289,
    ],
    rgbCvdFromRgb_2: [
      0.37009, 0.8854, -0.25549, 0.25767, 0.63782, 0.10451, -0.0195, 0.02741,
      0.99209,
    ],
    separationPlaneNormal: [-0.00293, -0.00645, 0.00938],
  },

  tritan: {
    rgbCvdFromRgb_1: [
      1.01354, 0.14268, -0.15622, -0.01181, 0.87561, 0.13619, 0.07707, 0.81208,
      0.11085,
    ],
    rgbCvdFromRgb_2: [
      0.93337, 0.19999, -0.13336, 0.05809, 0.82565, 0.11626, -0.37923, 1.13825,
      0.24098,
    ],
    separationPlaneNormal: [0.0396, -0.02831, -0.01129],
  },
};

var sRGB_to_linearRGB_Lookup = Array(256);
(function () {
  var i;
  for (i = 0; i < 256; i++) {
    sRGB_to_linearRGB_Lookup[i] = linearRGB_from_sRGB(i);
  }
})();

function linearRGB_from_sRGB(v) {
  var fv = v / 255.0;
  if (fv < 0.04045) return fv / 12.92;
  return Math.pow((fv + 0.055) / 1.055, 2.4);
}

function sRGB_from_linearRGB(v) {
  if (v <= 0) return 0;
  if (v >= 1) return 255;
  if (v < 0.0031308) return 0.5 + v * 12.92 * 255;
  return 0 + 255 * (Math.pow(v, 1.0 / 2.4) * 1.055 - 0.055);
}

function brettel(srgb, t, severity) {
  // Go from sRGB to linearRGB
  var rgb = Array(3);
  rgb[0] = sRGB_to_linearRGB_Lookup[srgb[0]];
  rgb[1] = sRGB_to_linearRGB_Lookup[srgb[1]];
  rgb[2] = sRGB_to_linearRGB_Lookup[srgb[2]];

  var params = brettel_params[t];
  var separationPlaneNormal = params["separationPlaneNormal"];
  var rgbCvdFromRgb_1 = params["rgbCvdFromRgb_1"];
  var rgbCvdFromRgb_2 = params["rgbCvdFromRgb_2"];

  // Check on which plane we should project by comparing wih the separation plane normal.
  var dotWithSepPlane =
    rgb[0] * separationPlaneNormal[0] +
    rgb[1] * separationPlaneNormal[1] +
    rgb[2] * separationPlaneNormal[2];
  var rgbCvdFromRgb = dotWithSepPlane >= 0 ? rgbCvdFromRgb_1 : rgbCvdFromRgb_2;

  // Transform to the full dichromat projection plane.
  var rgb_cvd = Array(3);
  rgb_cvd[0] =
    rgbCvdFromRgb[0] * rgb[0] +
    rgbCvdFromRgb[1] * rgb[1] +
    rgbCvdFromRgb[2] * rgb[2];
  rgb_cvd[1] =
    rgbCvdFromRgb[3] * rgb[0] +
    rgbCvdFromRgb[4] * rgb[1] +
    rgbCvdFromRgb[5] * rgb[2];
  rgb_cvd[2] =
    rgbCvdFromRgb[6] * rgb[0] +
    rgbCvdFromRgb[7] * rgb[1] +
    rgbCvdFromRgb[8] * rgb[2];

  // Apply the severity factor as a linear interpolation.
  // It's the same to do it in the RGB space or in the LMS
  // space since it's a linear transform.
  rgb_cvd[0] = rgb_cvd[0] * severity + rgb[0] * (1.0 - severity);
  rgb_cvd[1] = rgb_cvd[1] * severity + rgb[1] * (1.0 - severity);
  rgb_cvd[2] = rgb_cvd[2] * severity + rgb[2] * (1.0 - severity);

  // Go back to sRGB
  return [
    sRGB_from_linearRGB(rgb_cvd[0]),
    sRGB_from_linearRGB(rgb_cvd[1]),
    sRGB_from_linearRGB(rgb_cvd[2]),
  ];
}

const brettelFunctions = {
  Normal: function (v) {
    return v;
  },
  Protanopia: function (v) {
    return brettel(v, "protan", 1.0);
  },
  Protanomaly: function (v) {
    return brettel(v, "protan", 0.6);
  },
  Deuteranopia: function (v) {
    return brettel(v, "deutan", 1.0);
  },
  Deuteranomaly: function (v) {
    return brettel(v, "deutan", 0.6);
  },
  Tritanopia: function (v) {
    return brettel(v, "tritan", 1.0);
  },
  Tritanomaly: function (v) {
    return brettel(v, "tritan", 0.6);
  },
};

var ColorMatrixMatrixes = {
  Normal: {
    R: [100, 0, 0],
    G: [0, 100, 0],
    B: [0, 0, 100],
  },
  Protanopia: {
    R: [56.667, 43.333, 0],
    G: [55.833, 44.167, 0],
    B: [0, 24.167, 75.833],
  },
  Protanomaly: {
    R: [81.667, 18.333, 0],
    G: [33.333, 66.667, 0],
    B: [0, 12.5, 87.5],
  },
  Deuteranopia: {
    R: [62.5, 37.5, 0],
    G: [70, 30, 0],
    B: [0, 30, 70],
  },
  Deuteranomaly: {
    R: [80, 20, 0],
    G: [25.833, 74.167, 0],
    B: [0, 14.167, 85.833],
  },
  Tritanopia: {
    R: [95, 5, 0],
    G: [0, 43.333, 56.667],
    B: [0, 47.5, 52.5],
  },
  Tritanomaly: {
    R: [96.667, 3.333, 0],
    G: [0, 73.333, 26.667],
    B: [0, 18.333, 81.667],
  },
};

export { ColorMatrixMatrixes, brettelFunctions };