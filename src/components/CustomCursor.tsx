import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    let animFrame: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top  = mouseY + 'px';
    };

    const lerp = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';
      animFrame = requestAnimationFrame(lerp);
    };
    animFrame = requestAnimationFrame(lerp);

    const TARGETS = 'a, button, input, textarea, select, label, [role="button"], [onclick], [tabindex]';

    const bindHover = (el: Element) => {
      el.addEventListener('mouseenter', () => {
        dot.classList.add('is-hover');
        ring.classList.add('is-hover');
      });
      el.addEventListener('mouseleave', () => {
        dot.classList.remove('is-hover');
        ring.classList.remove('is-hover');
      });
    };

    document.querySelectorAll(TARGETS).forEach(bindHover);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          const el = node as Element;
          if (el.matches?.(TARGETS)) bindHover(el);
          el.querySelectorAll?.(TARGETS).forEach(bindHover);
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    const onMouseDown = () => {
      dot.classList.add('is-clicking');   ring.classList.add('is-clicking');
      dot.classList.remove('is-hover');   ring.classList.remove('is-hover');
    };
    const onMouseUp = () => {
      dot.classList.remove('is-clicking'); ring.classList.remove('is-clicking');
    };
    const onMouseLeave = () => { dot.style.opacity = '0'; ring.style.opacity = '0'; };
    const onMouseEnter = () => { dot.style.opacity = '1'; ring.style.opacity = '1'; };

    document.addEventListener('mousemove',  onMouseMove);
    document.addEventListener('mousedown',  onMouseDown);
    document.addEventListener('mouseup',    onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      cancelAnimationFrame(animFrame);
      observer.disconnect();
      document.removeEventListener('mousemove',  onMouseMove);
      document.removeEventListener('mousedown',  onMouseDown);
      document.removeEventListener('mouseup',    onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  id="curDot"  />
      <div ref={ringRef} className="cursor-ring" id="curRing" />
    </>
  );
}
