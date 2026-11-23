import { useEffect, useRef } from "react";

export default function Interactive3DScene({
  density = 65,
  accent = "#00ff88",
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

    // Mouse tracking with 3D easing
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

    // Multi-depth 3D Particles & Bokeh Orbs
    const particles = [];
    const colorPalette = [
      "rgba(0, 255, 136, ",
      "rgba(16, 185, 129, ",
      "rgba(5, 240, 160, ",
      "rgba(52, 211, 153, ",
      "rgba(0, 229, 117, ",
    ];

    for (let i = 0; i < density; i++) {
      // Depth layer: 0 (deep background bokeh) to 1 (sharp foreground)
      const depth = Math.random();
      const isBokeh = depth < 0.28; // Large out-of-focus bokeh disc

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        z: depth,
        radius: isBokeh ? Math.random() * 22 + 12 : Math.random() * 2.8 + 1.2,
        colorBase: colorPalette[Math.floor(Math.random() * colorPalette.length)],
        baseAlpha: isBokeh ? Math.random() * 0.14 + 0.05 : Math.random() * 0.55 + 0.25,
        vx: (Math.random() - 0.5) * (0.35 + depth * 0.4),
        vy: (Math.random() - 0.5) * (0.35 + depth * 0.4),
        pulseSpeed: Math.random() * 0.02 + 0.01,
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

      time += 0.02;

      // Draw subtle background radial glow
      const cx = width * 0.5 + mouseNormX * 40;
      const cy = height * 0.4 + mouseNormY * 40;
      const bgGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, width * 0.65);
      bgGrad.addColorStop(0, "rgba(0, 255, 136, 0.045)");
      bgGrad.addColorStop(0.5, "rgba(5, 15, 10, 0.2)");
      bgGrad.addColorStop(1, "rgba(4, 8, 6, 0)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Sort particles by depth for correct 3D perspective layering
      particles.sort((a, b) => a.z - b.z);

      // Draw and update 3D particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Drift motion
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around viewport edges
        if (p.x < -60) p.x = width + 60;
        if (p.x > width + 60) p.x = -60;
        if (p.y < -60) p.y = height + 60;
        if (p.y > height + 60) p.y = -60;

        // 3D Parallax offset based on depth (z)
        const parallaxX = mouseNormX * p.z * 55;
        const parallaxY = mouseNormY * p.z * 55 - (scrollY * p.z * 0.25) % height;

        let drawX = p.x + parallaxX;
        let drawY = p.y + parallaxY;

        // Keep inside screen bounds smoothly
        if (drawY < -50) drawY += height + 100;
        if (drawY > height + 50) drawY -= height + 100;

        // Pulsing glow alpha
        const pulse = Math.sin(time * p.pulseSpeed * 60 + p.pulseOffset);
        const currentAlpha = Math.max(0.02, p.baseAlpha + pulse * 0.15);

        ctx.beginPath();

        if (p.isBokeh) {
          // Large soft bokeh disc with radial gradient falloff
          const rad = p.radius * (1 + pulse * 0.1);
          const grad = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, rad);
          grad.addColorStop(0, `${p.colorBase}${currentAlpha * 1.4})`);
          grad.addColorStop(0.4, `${p.colorBase}${currentAlpha * 0.7})`);
          grad.addColorStop(1, `${p.colorBase}0)`);
          ctx.fillStyle = grad;
          ctx.arc(drawX, drawY, rad, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Sharp glowing particle with neon core
          const rad = p.radius * (1 + p.z * 0.6);
          ctx.arc(drawX, drawY, rad, 0, Math.PI * 2);
          ctx.fillStyle = `${p.colorBase}${currentAlpha})`;
          ctx.shadowBlur = 10 * p.z;
          ctx.shadowColor = accent;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        // Draw connections between nearby mid/foreground particles
        if (!p.isBokeh && p.z > 0.4) {
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            if (!p2.isBokeh && p2.z > 0.4) {
              const dx = drawX - (p2.x + mouseNormX * p2.z * 55);
              const dy = drawY - (p2.y + mouseNormY * p2.z * 55 - (scrollY * p2.z * 0.25) % height);
              const dist = Math.hypot(dx, dy);

              if (dist < 90) {
                const connAlpha = (1 - dist / 90) * 0.12 * p.z;
                ctx.beginPath();
                ctx.moveTo(drawX, drawY);
                ctx.lineTo(drawX - dx, drawY - dy);
                ctx.strokeStyle = `rgba(0, 255, 136, ${connAlpha})`;
                ctx.lineWidth = 0.8;
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
  }, [density, accent, interactive]);

  return <canvas ref={canvasRef} className={className} />;
}
