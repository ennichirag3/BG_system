import { useEffect, useRef } from "react";

export default function Interactive3DScene({
  density = 1400,
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
      initGalaxy();
    };
    window.addEventListener("resize", handleResize);

    // Camera and Mouse tracking with smooth spring inertia
    const camera = {
      pitch: 0.55, // inclination angle of galaxy disc
      targetPitch: 0.55,
      yaw: 0,
      targetYaw: 0,
      zoom: 1,
      targetZoom: 1,
      focalLength: 550,
    };

    const handleMouseMove = (e) => {
      const nx = (e.clientX - width / 2) / (width / 2);
      const ny = (e.clientY - height / 2) / (height / 2);
      // Subtle 3D tilt reaction
      camera.targetPitch = 0.55 + ny * 0.35;
      camera.targetYaw = nx * 0.45;
    };

    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    // 1. GENERATE 3D SPIRAL GALAXY VORTEX ("Build Beyond Flat")
    let galaxyStars = [];
    const arms = 3;
    const armSeparation = (Math.PI * 2) / arms;
    const maxRadius = Math.min(width, height) * 0.85;

    function initGalaxy() {
      galaxyStars = [];
      const starCount = Math.min(density, 1600);

      for (let i = 0; i < starCount; i++) {
        // Logarithmic spiral distribution
        const r = Math.pow(Math.random(), 1.8) * maxRadius;
        const armIndex = i % arms;
        const spiralAngle = r * 0.007 + armIndex * armSeparation;
        const spread = (1 - r / maxRadius) * 45 + 15;
        const angle = spiralAngle + (Math.random() - 0.5) * (spread / (r + 10));

        // Thickness of galaxy disc (thicker at center)
        const discHeight = (1 - r / maxRadius) * 90 + 8;
        const z = (Math.random() - 0.5) * discHeight;

        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;

        // Color temperature
        const isCore = r < maxRadius * 0.2;
        const colorRatio = Math.random();
        let color;
        if (isCore) {
          color = { r: 240, g: 245, b: 255 }; // Bright white/cyan core
        } else if (colorRatio < 0.45) {
          color = { r: 99, g: 102, b: 241 }; // Electric Indigo
        } else if (colorRatio < 0.8) {
          color = { r: 6, g: 182, b: 212 }; // Cyber Cyan
        } else {
          color = { r: 168, g: 85, b: 247 }; // Purple Glow
        }

        galaxyStars.push({
          x,
          y,
          z,
          baseRadius: isCore ? Math.random() * 2.2 + 1.2 : Math.random() * 1.5 + 0.6,
          color,
          speed: 0.0018 + (1 / (r + 40)) * 0.12, // Keplerian rotational speed
          angle,
          dist: r,
          alpha: Math.random() * 0.6 + 0.35,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
    }
    initGalaxy();

    // 2. 3D FLOATING GEOMETRIC MESH / TORUS KNOT NODES
    const torusNodes = [];
    const torusCount = 64;
    const torusR = 120;
    const torusTube = 45;
    const pParam = 2; // Torus knot (p, q)
    const qParam = 3;

    for (let i = 0; i < torusCount; i++) {
      const phi = (i / torusCount) * Math.PI * 2;
      const r = torusR + torusTube * Math.cos(qParam * phi);
      const x = r * Math.cos(pParam * phi);
      const y = r * Math.sin(pParam * phi);
      const z = -torusTube * Math.sin(qParam * phi);
      torusNodes.push({ x, y, z, originalX: x, originalY: y, originalZ: z });
    }

    // 3. SHOOTING STARS / METEORS
    const meteors = [];
    const spawnMeteor = () => {
      meteors.push({
        x: Math.random() * width * 0.8 + width * 0.1,
        y: Math.random() * height * 0.3,
        length: Math.random() * 80 + 60,
        speed: Math.random() * 12 + 10,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
        opacity: 1,
        decay: Math.random() * 0.02 + 0.015,
      });
    };

    let meteorTimer = 0;
    let time = 0;

    // RENDER LOOP
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      time += 0.01;
      meteorTimer++;
      if (meteorTimer > 240 && Math.random() < 0.03) {
        spawnMeteor();
        meteorTimer = 0;
      }

      // Smooth camera interpolation
      camera.pitch += (camera.targetPitch - camera.pitch) * 0.05;
      camera.yaw += (camera.targetYaw - camera.yaw) * 0.05;
      camera.zoom += (camera.targetZoom - camera.zoom) * 0.05;

      const cosPitch = Math.cos(camera.pitch);
      const sinPitch = Math.sin(camera.pitch);
      const cosYaw = Math.cos(camera.yaw);
      const sinYaw = Math.sin(camera.yaw);

      const centerX = width * 0.5;
      const centerY = height * 0.48;

      // Deep Space Galactic Glow Backing
      const gradCore = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        maxRadius * 0.65
      );
      gradCore.addColorStop(0, "rgba(99, 102, 241, 0.16)");
      gradCore.addColorStop(0.2, "rgba(6, 182, 212, 0.08)");
      gradCore.addColorStop(0.5, "rgba(139, 92, 246, 0.035)");
      gradCore.addColorStop(1, "rgba(6, 8, 18, 0)");
      ctx.fillStyle = gradCore;
      ctx.fillRect(0, 0, width, height);

      // RENDER 3D SPIRAL GALAXY STARS
      const projectedStars = [];

      for (let i = 0; i < galaxyStars.length; i++) {
        const star = galaxyStars[i];

        // Orbit update
        star.angle += star.speed;
        const curX = Math.cos(star.angle) * star.dist;
        const curY = Math.sin(star.angle) * star.dist;
        const curZ = star.z;

        // 3D Rotation: Pitch (X-axis) then Yaw (Y-axis)
        // 1. Pitch around X-axis
        const y1 = curY * cosPitch - curZ * sinPitch;
        const z1 = curY * sinPitch + curZ * cosPitch;

        // 2. Yaw around Y-axis
        const x2 = curX * cosYaw + z1 * sinYaw;
        const z2 = -curX * sinYaw + z1 * cosYaw;
        const y2 = y1;

        // Perspective Projection
        const distance = camera.focalLength + z2;
        if (distance <= 10) continue;

        const scale = (camera.focalLength / distance) * camera.zoom;
        const px = centerX + x2 * scale;
        const py = centerY + y2 * scale;

        // Twinkle factor
        const twinkle = Math.sin(time * 30 * star.twinkleSpeed + star.twinklePhase);
        const dynamicAlpha = Math.max(0.1, Math.min(1, star.alpha + twinkle * 0.2));

        projectedStars.push({
          px,
          py,
          z: z2,
          scale,
          radius: star.baseRadius * scale,
          color: star.color,
          alpha: dynamicAlpha * Math.min(1.2, scale * 1.3),
        });
      }

      // Sort stars back-to-front for proper depth perception
      projectedStars.sort((a, b) => b.z - a.z);

      for (let i = 0; i < projectedStars.length; i++) {
        const p = projectedStars[i];
        if (p.px < -20 || p.px > width + 20 || p.py < -20 || p.py > height + 20) continue;

        ctx.beginPath();
        ctx.arc(p.px, p.py, Math.max(0.6, p.radius), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha})`;

        if (p.radius > 2.2) {
          ctx.shadowBlur = p.radius * 3.5;
          ctx.shadowColor = `rgb(${p.color.r}, ${p.color.g}, ${p.color.b})`;
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          ctx.fill();
        }
      }

      // 3D FLOATING GEOMETRIC ORBITAL RINGS IN CORE
      ctx.save();
      ctx.translate(centerX, centerY);
      const ringCount = 3;
      for (let r = 0; r < ringCount; r++) {
        const ringTime = time * (0.6 + r * 0.4);
        const ringRadius = 130 + r * 65;

        ctx.save();
        ctx.rotate(ringTime * 0.3 + (r * Math.PI) / 3);
        ctx.scale(1, 0.38 + 0.1 * Math.sin(ringTime));

        ctx.beginPath();
        ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle =
          r === 0
            ? "rgba(6, 182, 212, 0.16)"
            : r === 1
            ? "rgba(99, 102, 241, 0.14)"
            : "rgba(168, 85, 247, 0.10)";
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 6]);
        ctx.stroke();

        // Glowing orbital beacon node
        const beaconAngle = ringTime * 1.5;
        const bx = Math.cos(beaconAngle) * ringRadius;
        const by = Math.sin(beaconAngle) * ringRadius;
        ctx.beginPath();
        ctx.arc(bx, by, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#38bdf8";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#38bdf8";
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();
      }
      ctx.restore();

      // RENDER SHOOTING METEORS
      for (let m = meteors.length - 1; m >= 0; m--) {
        const meteor = meteors[m];
        meteor.x += Math.cos(meteor.angle) * meteor.speed;
        meteor.y += Math.sin(meteor.angle) * meteor.speed;
        meteor.opacity -= meteor.decay;

        if (meteor.opacity <= 0 || meteor.x > width || meteor.y > height) {
          meteors.splice(m, 1);
          continue;
        }

        const tailX = meteor.x - Math.cos(meteor.angle) * meteor.length;
        const tailY = meteor.y - Math.sin(meteor.angle) * meteor.length;

        const meteorGrad = ctx.createLinearGradient(tailX, tailY, meteor.x, meteor.y);
        meteorGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
        meteorGrad.addColorStop(0.7, "rgba(6, 182, 212, " + meteor.opacity * 0.7 + ")");
        meteorGrad.addColorStop(1, "rgba(255, 255, 255, " + meteor.opacity + ")");

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(meteor.x, meteor.y);
        ctx.strokeStyle = meteorGrad;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (interactive) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [density, interactive]);

  return <canvas ref={canvasRef} className={className} />;
}
