export function stringToArr(color: string, isRgb: boolean) {
  const formatted = isRgb ? color.replace(/^rgba?\(|\)$/g, '') : color.replace(/^hsla?\(|\)$/g, '');
  const separator = formatted.includes(",") ? "," : " ";
  let rgba = formatted.split(separator);
  if (rgba.includes("/")) rgba.splice(3, 1);
  if (!isRgb) return rgba;
  for (let R in rgba) {
    const r = rgba[R];
    if (r.includes("%")) {
      const p = (+r.substr(0, r.length - 1)) / 100;
      if (+R < 3) {
        rgba[R] = Math.round(p * 255).toString();
      } else {
        rgba[R] = p.toString();
      }
    }
  }
  return rgba;
}

export function hslaToHex(h: number, s: number, l: number, a: number) {
  const { r, g, b } = hslaToRgba(h, s, l);
  return rgbToHex([
    r.toString(),
    g.toString(),
    b.toString(),
    a.toString(),
  ]);
}

export function rgbToHex(rgba: string[]) {
  let r = (+rgba[0]).toString(16);
  let g = (+rgba[1]).toString(16);
  let b = (+rgba[2]).toString(16);
  if (r.length === 1)
    r = "0" + r;
  if (g.length === 1)
    g = "0" + g;
  if (b.length === 1)
    b = "0" + b;
  let a = '';
  if (rgba[3]) {
    a = Math.round((+rgba[3]) * 255).toString(16);
    if (a.length === 1) a = "0" + a;
  }
  return "#" + r + g + b + a;
}

export function hslaToRgba(h: number, s: number, l: number) {
  h = h % 360;
  s = s / 100;
  l = l / 100;
  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const hueSegment = h / 60;
  const x = chroma * (1 - Math.abs(hueSegment % 2 - 1));
  let r, g, b;

  if (hueSegment >= 0 && hueSegment < 1) {
    r = chroma;
    g = x;
    b = 0;
  } else if (hueSegment >= 1 && hueSegment < 2) {
    r = x;
    g = chroma;
    b = 0;
  } else if (hueSegment >= 2 && hueSegment < 3) {
    r = 0;
    g = chroma;
    b = x;
  } else if (hueSegment >= 3 && hueSegment < 4) {
    r = 0;
    g = x;
    b = chroma;
  } else if (hueSegment >= 4 && hueSegment < 5) {
    r = x;
    g = 0;
    b = chroma;
  } else {
    r = chroma;
    g = 0;
    b = x;
  }

  const lightnessAdjustment = l - chroma / 2;
  r += lightnessAdjustment;
  g += lightnessAdjustment;
  b += lightnessAdjustment;

  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);

  return { r, g, b };
}

export function rgbaToHsla(r: number, g: number, b: number) {
  r = r < 0 ? 0 : r > 255 ? 255 : r;
  g = g < 0 ? 0 : g > 255 ? 255 : g;
  b = b < 0 ? 0 : b > 255 ? 255 : b;

  r = r / 255;
  g = g / 255;
  b = b / 255;
  let min = Math.min(r, g, b);
  let max = Math.max(r, g, b);
  let delta = max - min;
  let h = 0;
  let s;
  let l;
  if (max == min) {
    h = 0;
  } else if (r == max) {
    h = (g - b) / delta;
  } else if (g == max) {
    h = 2 + (b - r) / delta;
  } else if (b == max) {
    h = 4 + (r - g) / delta;
  }
  h = Math.min(h * 60, 360);
  if (h < 0) h += 360;
  l = (min + max) / 2;
  if (max == min) s = 0;
  else if (l <= 0.5) s = delta / (max + min);
  else s = delta / (2 - max - min);

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export function getUnitValues(h: number, s: number, l: number, a: number) {
  return {
    h,
    s,
    l,
    a,
    ...hslaToRgba(h, s, l),
    hex: hslaToHex(h, s, l, a),
    isValid: true
  }
}

function getRgba(h: string) {
  let r: any = 0;
  let g: any = 0;
  let b: any = 0;
  let a: any = 1;
  if (h.length === 4 || h.length === 5) {
    r = "0x" + h[1] + h[1];
    g = "0x" + h[2] + h[2];
    b = "0x" + h[3] + h[3];
    if (h.length === 5)
      a = "0x" + h[4] + h[4];
  } else if (h.length === 7 || h.length == 9) {
    r = "0x" + h[1] + h[2];
    g = "0x" + h[3] + h[4];
    b = "0x" + h[5] + h[6];
    if (h.length === 9) 
      a = "0x" + h[7] + h[8];
  }
  if (a !== 1) a = +(a / 255).toFixed(3);
  return { r: +r, g: +g, b: +b, a };
}

export function convertColor(color: string) {
  let result: any = {};
  if (/^rgb/.test(color)) {
    const rgb = stringToArr(color, true);
    const r = Number(rgb[0]);
    const g = Number(rgb[1]);
    const b = Number(rgb[2]);
    const a = Number(rgb[3] ?? 1);
    result = {
      r,
      g,
      b,
      a,
      hex: rgbToHex(rgb),
      ...rgbaToHsla(r, g, b)
    }
  } else if (/^#/i.test(color)) {
    if (!isHexColorValid(color))
      return { isValid: false, hex: color };
    const { r, g, b, a } = getRgba(color);
    result = {
      hex: color,
      r,
      g,
      b,
      a,
      ...rgbaToHsla(r, g, b)
    }
  } else if (/^hsl/i.test(color)) {
    const hsla = stringToArr(color, false);
    const h = Number(hsla[0] ?? 0);
    const s = Number((hsla[1] || '').replace('%', ''));
    const l = Number((hsla[2] || '').replace('%', ''));
    const a = Number(hsla[3] ?? 1);
    result = {
      h,
      s,
      l,
      a,
      hex: hslaToHex(h, s, l, a),
      ...hslaToRgba(h, s, l)
    }
  }
  return {...result, isValid: true};
}

function isHexColorValid(color: string) {
  const hexRegex = /^#([A-Fa-f0-9]{3,4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/i;
  return hexRegex.test(color);
}

export function isRgbValid(value: string) {
  const regex = /^[0-9]{1,3}$/i;
  return regex.test(value) && +value >= 0 && +value <= 255;
}

export function isHValid(value: string) {
  const regex = /^[0-9]{1,3}$/i;
  return regex.test(value) && +value >= 0 && +value <= 360;
}

export function isPercentValid(value: string) {
  const regex = /^(\d\d?(\.\d+)?|\.\d+|100)%$/i;
  return regex.test(value);
}
export function customRound(value: number, threshold: number) {
  const roundedValue = Math.round(value);
  const decimalPart = value % 1;

  if (decimalPart > threshold) {
    return roundedValue + 1;
  } else {
    return roundedValue;
  }
}
export function hsvToHsl(h: number, s: number, v: number) {
  const _h = h;
	const _s = s / 100;
	const _v = v / 100;
	const r = Math.max(_v, 0.01);
	let o;
	let _l = ((2 - _s) * _v) / 2;
	const lmin = (2 - _s) * r;
	o = _s * r;
	o /= (lmin <= 1) ? lmin : 2 - lmin;
	o = o || 0;

	return {
    h: Math.round(_h), 
    s: Math.round(o * 100), 
    l: Math.round(_l * 100)
  };
}
export function hslToHsv(h: number, s: number, l: number) {
  const _h = h;
	let _s = s / 100;
	let _l = l / 100;
	const r = Math.max(_l, 0.01);
	let smin = _s;

	_l *= 2;
	_s *= _l <= 1 ? _l : 2 - _l;
	smin *= r <= 1 ? r : 2 - r;

	return {
    h: Math.round(_h), 
    s: Math.round((_l === 0 ? (2 * smin) / (r + smin) : (2 * _s) / (_l + _s)) * 100), 
    v: Math.round(((_l + _s) / 2) * 100)
  };
}