export function animateColorModeOne(fill, percent) {
  fill.style.backgroundColor = "red";
  setTimeout(() => {
    fill.style.transition = "width 2s ease, background-color 2s ease";
    fill.style.width = percent + "%";
    fill.style.backgroundColor = getColorGradientColor(percent);
  }, 100);
}

export function animateColorModeTwoWithGradient(fill, percent) {
  setTimeout(() => {
    fill.style.width = percent + "%";
  }, 100);

  const duration = 2000;
  let startTime = null;

  function animateBackgroundGradient(time) {
    if (!startTime) startTime = time;
    let elapsed = time - startTime;
    let progress = Math.min(elapsed / duration, 1);
    let currentPercent = progress * percent;

    const startColor = getColorGradientColor(0);
    const midColor = getColorGradientColor(currentPercent / 2);
    const endColor = getColorGradientColor(currentPercent);

    fill.style.background = `linear-gradient(to right, ${startColor} 0%, ${midColor} 50%, ${endColor} 100%)`;

    if (progress < 1) {
      requestAnimationFrame(animateBackgroundGradient);
    } else {
      fill.style.background = `linear-gradient(to right, ${startColor} 0%, ${midColor} 50%, ${endColor} 100%)`;
    }
  }

  requestAnimationFrame(animateBackgroundGradient);
}

export function animateDefaultRedBar(fill, percent) {

  fill.style.transition = "width 2s ease";
  fill.style.background = getColorGradientColor(percent);
  fill.style.backgroundColor = getColorGradientColor(percent);
  setTimeout(() => {
    fill.style.width = percent + "%";
  }, 100);
}

export function getColorGradientColor(p) {
  let r, g;
  if (p < 50) {
    r = 255;
    g = Math.floor(5.1 * p);
  } else {
    g = 255;
    r = Math.floor(255 - 5.1 * (p - 50));
  }
  return `rgb(${r},${g},0)`;
}
