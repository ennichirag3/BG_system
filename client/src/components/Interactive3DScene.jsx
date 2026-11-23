import { useEffect, useRef } from "react";

export default function Interactive3DScene({
  density = 60,
  interactive = true,
  className = "fixed inset-0 pointer-events-none z-0",
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Mouse tracking with 3D parallax easing
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    // Scroll parallax tracking
    let scrollY = window.scrollY;
    let targetScrollY = window.scrollY;
    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Multi-depth 3D Particles & Bokeh Orbs (Indigo, Cyan, Violet, Emerald)
    const particles = [];
    const colorPalette = [
      { r: 99, g: 102, b: 241 },   // Indigo
      { r: 6, g: 182, b: 212 },    // Cyan
      { r: 139, g: 92, b: 246 },   // Violet
      { r: 16, g: 185, b: 129 },   // Emerald
      { r: 129, g: 140, b: 248 },  // Soft Indigo
    ];

    for (let i = 0; i < density; i++) {
      const depth = Math.random(); // 0: far background bokeh, 1: foreground sharp
      const isBokeh = depth < 0.32; // Large out-of-focus bokeh disc
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: depth,
        radius: isBokeh ? Math.random() * 26 + 14 : Math.random() * 3 + 1,
        color,
        baseAlpha: isBokeh ? Math.random() * 0.16 + 0.04 : Math.random() * 0.6 + 0.2,
        vx: (Math.random() - 0.5) * (0.3 + depth * 0.35),
        vy: (Math.random() - 0.5) * (0.3 + depth * 0.35),
        pulseSpeed: Math.random() * 0.02 + 0.008,
        pulseOffset: Math.random() * Math.PI * 2,
        isBokeh,
      });
    }

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse & scroll easing
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;
      scrollY += (targetScrollY - scrollY) * 0.06;

      const mouseNormX = (mouse.x - width / 2) / (width / 2);
      const mouseNormY = (mouse.y - height / 2) / (height / 2);

      time += 0.015;

      // Soft ambient radial glow
      const cx = width * 0.5 + mouseNormX * 35;
      const cy = height * 0.45 + mouseNormY * 35;
      const bgGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, width * 0.7);
      bgGrad.addColorStop(0, "rgba(99, 102, 241, 0.06)");
      bgGrad.addColorStop(0.5, "rgba(6, 182, 212, 0.03)");
      bgGrad.addColorStop(1, "rgba(7, 9, 19, 0)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Sort particles by depth for correct 3D perspective layering
      particles.sort((a, b) => a.z - b.z);

      // Draw and update 3D particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around viewport edges
        if (p.x < -60) p.x = width + 60;
        if (p.x > width + 60) p.x = -60;
        if (p.y < -60) p.y = height + 60;
        if (p.y > height + 60) p.y = -60;

        // 3D Parallax offset based on depth (z)
        const parallaxX = mouseNormX * p.z * 50;
        const parallaxY = mouseNormY * p.z * 50 - (scrollY * p.z * 0.22) % height;

        let drawX = p.x + parallaxX;
        let drawY = p.y + parallaxY;

        if (drawY < -50) drawY += height + 100;
        if (drawY > height + 50) drawY -= height + 100;

        const pulse = Math.sin(time * p.pulseSpeed * 60 + p.pulseOffset);
        const currentAlpha = Math.max(0.02, p.baseAlpha + pulse * 0.12);

        ctx.beginPath();

        if (p.isBokeh) {
          // Large soft bokeh disc with radial gradient falloff
          const rad = p.radius * (1 + pulse * 0.08);
          const grad = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, rad);
          grad.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${currentAlpha * 1.5})`);
          grad.addColorStop(0.4, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${currentAlpha * 0.7})`);
          grad.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`);
          ctx.fillStyle = grad;
          ctx.arc(drawX, drawY, rad, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Sharp glowing particle with neon core
          const rad = p.radius * (1 + p.z * 0.5);
          ctx.arc(drawX, drawY, rad, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${currentAlpha})`;
          ctx.shadowBlur = 8 * p.z;
          ctx.shadowColor = `rgb(${p.color.r}, ${p.color.g}, ${p.color.b})`;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Draw connections between nearby mid/foreground particles
        if (!p.isBokeh && p.z > 0.45) {
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            if (!p2.isBokeh && p2.z > 0.45) {
              const dx = drawX - (p2.x + mouseNormX * p2.z * 50);
              const dy = drawY - (p2.y + mouseNormY * p2.z * 50 - (scrollY * p2.z * 0.22) % height);
              const dist = Math.hypot(dx, dy);

              if (dist < 85) {
                const connAlpha = (1 - dist / 85) * 0.15 * p.z;
                ctx.beginPath();
                ctx.moveTo(drawX, drawY);
                ctx.lineTo(drawX - dx, drawY - dy);
                ctx.strokeStyle = `rgba(99, 102, 241, ${connAlpha})`;
                ctx.lineWidth = 0.7;
                ctx.stroke();
              }
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (interactive) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, [density, interactive]);

  return <canvas ref={canvasRef} className={className} />;
}
