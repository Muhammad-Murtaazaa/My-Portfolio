document.addEventListener('DOMContentLoaded', function () {
  const el = document.querySelector('.typewriter');
  if (!el) return;
  const taglines = [
    "I architect immersive digital worlds.",
    "Web wizardry meets creative vision.",
    "Building stellar user experiences.",
    "Let's create the extraordinary together."
  ];
  let line = 0, char = 0, isDeleting = false;

  function type() {
    const text = taglines[line].substring(0, char);
    el.innerHTML = text + '<span class="border-r-2 border-slate-300 animate-blink ml-1"></span>';

    if (!isDeleting && char < taglines[line].length) {
      char++;
      setTimeout(type, 55 + Math.random() * 30);
    } else if (!isDeleting && char === taglines[line].length) {
      setTimeout(() => { isDeleting = true; type(); }, 1600); // Hold full line before deleting
    } else if (isDeleting && char > 0) {
      char--;
      setTimeout(type, 22);
    } else if (isDeleting && char === 0) {
      isDeleting = false;
      line = (line + 1) % taglines.length;
      setTimeout(type, 600); // Pause on empty before next line
    }
  }
  type();
});

// You may want this CSS for a blinking caret style:
const style = document.createElement('style');
style.innerHTML = `
@keyframes blink {
  0%, 100% { opacity: 1 }
  50% { opacity: 0 }
}
.animate-blink {
  animation: blink .9s infinite step-end;
}
`;
document.head.appendChild(style);
