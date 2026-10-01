/* ============================================
   ANKUR TIWARI — PORTFOLIO SCRIPTS
   Particles | Typing | Scroll Animations | Theme
   Performance-optimized: CSS transforms, IntersectionObserver, rAF
   ============================================ */

(function () {
  'use strict';

  // ─── THEME TOGGLE ────────────────────────────────────
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const sunIcon = document.getElementById('sunIcon');
  const moonIcon = document.getElementById('moonIcon');

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (theme === 'light') {
      sunIcon.style.display = 'none';
      moonIcon.style.display = 'block';
    } else {
      sunIcon.style.display = 'block';
      moonIcon.style.display = 'none';
    }
  }

  // Initialize theme from localStorage or system preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    setTheme('light');
  }

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  // ─── NAVBAR SCROLL EFFECT ────────────────────────────
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');
  let lastScroll = 0;
  let ticking = false;

  function onScroll() {
    const scrollY = window.scrollY;

    // Navbar background
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top button
    if (scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    lastScroll = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─── SCROLL SPY (Active nav link) ───────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('[data-nav]');

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinksAll.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  });

  sections.forEach(section => spyObserver.observe(section));

  // ─── MOBILE MENU ────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navOverlay = document.getElementById('navOverlay');
  const mobileLinks = document.querySelectorAll('[data-nav-mobile]');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navOverlay.classList.toggle('active');
    document.body.style.overflow = navOverlay.classList.contains('active') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ─── SCROLL REVEAL ANIMATIONS ───────────────────────
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target); // Only animate once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ─── TYPING EFFECT ──────────────────────────────────
  const typedTextEl = document.getElementById('typedText');
  const roles = [
    'Backend Developer',
    'AI / LLM Integrator',
    'Python Enthusiast',
    'Problem Solver',
    'B.Tech CSE — Final Year'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingTimeout;

  function typeEffect() {
    const currentRole = roles[roleIndex];
    
    if (!isDeleting) {
      typedTextEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      
      if (charIndex === currentRole.length) {
        // Pause at full text
        typingTimeout = setTimeout(() => {
          isDeleting = true;
          typeEffect();
        }, 2000);
        return;
      }
    } else {
      typedTextEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    const speed = isDeleting ? 35 : 70;
    typingTimeout = setTimeout(typeEffect, speed);
  }

  // Start typing after hero animation
  setTimeout(typeEffect, 1200);

  // ─── COUNTER ANIMATION ──────────────────────────────
  const counters = document.querySelectorAll('[data-count]');

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const isDecimal = el.hasAttribute('data-decimal');
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;

      if (isDecimal) {
        el.textContent = current.toFixed(1) + suffix;
      } else {
        el.textContent = Math.floor(current) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        if (isDecimal) {
          el.textContent = target.toFixed(1) + suffix;
        } else {
          el.textContent = Math.floor(target) + suffix;
        }
        // Add + for LeetCode count
        if (target === 100) {
          el.textContent = target + '+';
        }
      }
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  // ─── CP TOPIC BARS ANIMATION ────────────────────────
  const topicFills = document.querySelectorAll('.cp-topic-fill');

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.cp-topic-fill');
        fills.forEach((fill, i) => {
          setTimeout(() => {
            fill.style.width = fill.getAttribute('data-width') + '%';
          }, i * 100);
        });
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const cpTopics = document.getElementById('cpTopics');
  if (cpTopics) barObserver.observe(cpTopics);

  // ─── CURSOR GLOW EFFECT ─────────────────────────────
  const cursorGlow = document.getElementById('cursorGlow');
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;
  let cursorActive = false;

  // Only enable on non-touch devices
  if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!cursorActive) {
        cursorActive = true;
        cursorGlow.classList.add('active');
        animateGlow();
      }
    });

    document.addEventListener('mouseleave', () => {
      cursorActive = false;
      cursorGlow.classList.remove('active');
    });
  }

  function animateGlow() {
    if (!cursorActive) return;
    
    // Smooth lerp for the glow position
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    
    requestAnimationFrame(animateGlow);
  }

  // ─── PROJECT CARD TILT EFFECT ───────────────────────
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });

  // ─── PARTICLE CANVAS (Neural Network Style) ────────
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let canvasWidth, canvasHeight;

    function resizeCanvas() {
      const hero = canvas.parentElement;
      canvasWidth = hero.offsetWidth;
      canvasHeight = hero.offsetHeight;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
    }

    // Debounced resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resizeCanvas();
        initParticles();
      }, 200);
    });

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around edges
        if (this.x < 0) this.x = canvasWidth;
        if (this.x > canvasWidth) this.x = 0;
        if (this.y < 0) this.y = canvasHeight;
        if (this.y > canvasHeight) this.y = 0;
      }

      draw() {
        const isDark = html.getAttribute('data-theme') !== 'light';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(0, 200, 255, ${this.opacity})`
          : `rgba(0, 85, 204, ${this.opacity * 0.6})`;
        ctx.fill();
      }
    }

    function initParticles() {
      // Adaptive particle count based on screen size
      const area = canvasWidth * canvasHeight;
      const count = Math.min(Math.floor(area / 18000), 60);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function drawConnections() {
      const isDark = html.getAttribute('data-theme') !== 'light';
      const maxDist = 150;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = isDark
              ? `rgba(0, 200, 255, ${opacity})`
              : `rgba(0, 85, 204, ${opacity * 0.5})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      drawConnections();
      animationId = requestAnimationFrame(animate);
    }

    // Pause when not visible (performance)
    const heroSection = document.getElementById('hero');
    const canvasObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!animationId) animate();
        } else {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      });
    }, { threshold: 0 });

    resizeCanvas();
    initParticles();
    animate();
    canvasObserver.observe(heroSection);

    // Mouse interaction with particles
    if (window.matchMedia('(pointer: fine)').matches) {
      canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        particles.forEach(p => {
          const dx = mx - p.x;
          const dy = my - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 120) {
            const force = (120 - dist) / 120;
            p.vx -= (dx / dist) * force * 0.2;
            p.vy -= (dy / dist) * force * 0.2;
          }
        });
      });
    }
  }

  // ─── CONTACT FORM HANDLER (FastAPI Backend) ─────────
  window.handleFormSubmit = async function (e) {
    e.preventDefault();
    const btn = document.getElementById('formSubmit');
    const originalHTML = btn.innerHTML;

    // Collect form data
    const payload = {
      name: document.getElementById('formName').value,
      email: document.getElementById('formEmail').value,
      subject: document.getElementById('formSubject').value,
      message: document.getElementById('formMessage').value,
    };

    // Show loading state
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;animation:spin 1s linear infinite;"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
      Sending...
    `;
    btn.disabled = true;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Success
        btn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="width:18px;height:18px;"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
          ${data.message || 'Sent Successfully!'}
        `;
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        document.getElementById('contactForm').reset();
      } else {
        // Validation error from FastAPI
        let errorMsg = 'Something went wrong';
        if (data.detail) {
          // Pydantic validation errors come as an array
          if (Array.isArray(data.detail)) {
            errorMsg = data.detail.map(err => err.msg).join(', ');
          } else {
            errorMsg = data.detail;
          }
        }
        btn.innerHTML = `⚠️ ${errorMsg}`;
        btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
      }
    } catch (err) {
      // Network error or server down
      btn.innerHTML = '⚠️ Could not connect to server';
      btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
      console.error('Contact form error:', err);
    }

    // Reset button after 4s
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.disabled = false;
      btn.style.background = '';
    }, 4000);
  };

  // ─── CSS SPIN KEYFRAME (injected for form button) ──
  const style = document.createElement('style');
  style.textContent = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);

  // ─── SMOOTH SCROLL FOR ALL ANCHOR LINKS ─────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ─── PERFORMANCE: Reduce motion check ──────────────
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Cancel particle animation
    if (typeof animationId !== 'undefined') {
      cancelAnimationFrame(animationId);
    }
    // Clear typing
    if (typeof typingTimeout !== 'undefined') {
      clearTimeout(typingTimeout);
    }
    if (typedTextEl) {
      typedTextEl.textContent = roles[0];
    }
  }

  // ─── LIVE LEETCODE STATS FETCH ──────────────────────
  async function updateLeetCodeStats() {
    try {
      const response = await fetch('/api/leetcode', { cache: 'no-store' });
      if (response.ok) {
        const json = await response.json();
        const matchedUser = json.data?.matchedUser;
        if (!matchedUser) return;
        
        // 1. Total Solved
        const allStats = matchedUser.submitStats?.acSubmissionNum?.find(s => s.difficulty === 'All');
        if (allStats && allStats.count) {
          const totalSolved = allStats.count;
          const lcAbout = document.getElementById('lc-about-count');
          const lcCp = document.getElementById('lc-cp-count');
          
          if (lcAbout) {
            lcAbout.setAttribute('data-count', totalSolved);
            if (lcAbout.textContent !== '0') animateCounter(lcAbout);
          }
          if (lcCp) {
            lcCp.setAttribute('data-count', totalSolved);
            if (lcCp.textContent !== '0') animateCounter(lcCp);
          }
        }
        
        // 2. Languages
        const langs = matchedUser.languageProblemCount || [];
        const langsContainer = document.getElementById('lc-langs-container');
        if (langsContainer && langs.length > 0) {
          langsContainer.innerHTML = '';
          langs.forEach(lang => {
            const span = document.createElement('span');
            span.className = 'cp-lang';
            span.textContent = `${lang.languageName} — ${lang.problemsSolved}`;
            langsContainer.appendChild(span);
          });
        }
        
        // 3. Topics
        const tagCounts = matchedUser.tagProblemCounts;
        const cpTopics = document.getElementById('cpTopics');
        if (cpTopics && tagCounts) {
          let allTags = [];
          if (tagCounts.advanced) allTags.push(...tagCounts.advanced);
          if (tagCounts.intermediate) allTags.push(...tagCounts.intermediate);
          if (tagCounts.fundamental) allTags.push(...tagCounts.fundamental);
          
          allTags.sort((a, b) => b.problemsSolved - a.problemsSolved);
          const topTags = allTags.slice(0, 8);
          const maxSolved = topTags.length > 0 ? topTags[0].problemsSolved : 1;
          
          cpTopics.innerHTML = '';
          topTags.forEach(tag => {
            const percent = Math.max(5, Math.round((tag.problemsSolved / maxSolved) * 100));
            const html = `
              <div class="cp-topic">
                <span class="cp-topic-name">${tag.tagName}</span>
                <div class="cp-topic-bar"><div class="cp-topic-fill" data-width="${percent}"></div></div>
                <span class="cp-topic-count">${tag.problemsSolved}</span>
              </div>
            `;
            cpTopics.insertAdjacentHTML('beforeend', html);
          });
          
          // Animate the new bars
          const fills = cpTopics.querySelectorAll('.cp-topic-fill');
          fills.forEach((fill, i) => {
            setTimeout(() => {
              fill.style.width = fill.getAttribute('data-width') + '%';
            }, i * 100 + 100);
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch detailed LeetCode stats:', error);
    }
  }

  updateLeetCodeStats();

})();
