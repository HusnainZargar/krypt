   // Custom Cursor
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    window.addEventListener('mousemove', e => {
      cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      cursorRing.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.style.width = '16px'; cursorDot.style.height = '16px';
        cursorRing.style.opacity = '1';
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.style.width = '10px'; cursorDot.style.height = '10px';
        cursorRing.style.opacity = '';
      });
    });

    // Particles
    function createParticles(count = 40) {
      const container = document.getElementById('particles');
      for(let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.top = Math.random() * 100 + 'vh';
        p.style.opacity = 0.1 + Math.random() * 0.3;
        p.style.animationDelay = Math.random() * 10 + 's';
        p.style.animationDuration = 10 + Math.random() * 15 + 's';
        container.appendChild(p);
      }
    }
    createParticles(50);

    // Card entrance animation
    setTimeout(() => {
      document.querySelectorAll('.card-anim').forEach(el => el.classList.add('show'));
    }, 100);