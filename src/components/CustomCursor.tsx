import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot  = dotRef.current;
    if (!dot) return;

    let mouseX = 0, mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    };

    const TARGETS = 'a, button, input, textarea, select, label, [role="button"], [onclick], [tabindex]';

    const bindHover = (el: Element) => {
      el.addEventListener('mouseenter', () => {
        dot.classList.add('is-hover');
      });
      el.addEventListener('mouseleave', () => {
        dot.classList.remove('is-hover');
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
      dot.classList.add('is-clicking');
      dot.classList.remove('is-hover');
    };
    const onMouseUp = () => {
      dot.classList.remove('is-clicking');
    };
    const onMouseLeave = () => { dot.style.opacity = '0'; };
    const onMouseEnter = () => { dot.style.opacity = '1'; };

    document.addEventListener('mousemove',  onMouseMove);
    document.addEventListener('mousedown',  onMouseDown);
    document.addEventListener('mouseup',    onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
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
    </>
  );
}
