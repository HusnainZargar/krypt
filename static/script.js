    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    window.addEventListener('mousemove', e => {
      cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      cursorRing.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
    document.querySelectorAll('button, input, select').forEach(el=>{
      el.addEventListener('mouseenter', ()=> { cursorDot.style.transform += ' scale(1.2)'; cursorDot.style.width='14px'; cursorDot.style.height='14px'; cursorRing.style.opacity='1'; });
      el.addEventListener('mouseleave', ()=> { cursorDot.style.transform = cursorDot.style.transform.replace(' scale(1.2)',''); cursorDot.style.width='10px'; cursorDot.style.height='10px'; cursorRing.style.opacity=''; });
    });

    function createParticles(count=40){
      const container = document.getElementById('particles');
      for(let i=0;i<count;i++){
        const d = document.createElement('div');
        d.className='particle';
        d.style.left = (Math.random()*100)+'vw';
        d.style.top = (Math.random()*100)+'vh';
        d.style.opacity = (0.12 + Math.random()*0.25).toString();
        d.style.transform = `scale(${0.6+Math.random()*1.4})`;
        d.style.animationDelay = (Math.random()*6)+'s';
        container.appendChild(d);
      }
    }
    createParticles(40);

    setTimeout(()=>{ document.querySelectorAll('.card-anim').forEach(x=>x.classList.add('show')); }, 120);

    /* Mobile menu */
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = document.getElementById('menuIcon');
    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('show');
        const expanded = mobileMenu.classList.contains('show');
        menuBtn.setAttribute('aria-expanded', expanded);
        menuIcon.classList.toggle('fa-bars', !expanded);
        menuIcon.classList.toggle('fa-times', expanded);
      });
    }

    /* Page switching */
    const pwnedPage = document.getElementById('pwnedPage');
    const bruteforcePage = document.getElementById('bruteforcePage');
    const pwnedNav = document.getElementById('pwnedNav');
    const bruteforceNav = document.getElementById('bruteforceNav');

    function updatePage() {
      const hash = window.location.hash.slice(1);
      if (hash === 'bruteforce') {
        pwnedPage.classList.add('hidden');
        bruteforcePage.classList.remove('hidden');
        pwnedNav.classList.remove('active');
        bruteforceNav.classList.add('active');
      } else {
        pwnedPage.classList.remove('hidden');
        bruteforcePage.classList.add('hidden');
        pwnedNav.classList.add('active');
        bruteforceNav.classList.remove('active');
      }

      /* FIX 2: Reset everything when coming back to pwned page or on refresh */
      document.body.className = '';
      document.getElementById('pwnedPassword').value = '';
      document.getElementById('pwnedResult').innerHTML = '';
      document.getElementById('pwnedResult').classList.remove('pwned-pwned');
    }
    window.addEventListener('hashchange', updatePage);
    updatePage();   // run on load

    /* Show/hide password */
    function toggleShow(inputEl, toggleBtn){
      if(inputEl.type === 'password'){ inputEl.type = 'text'; toggleBtn.innerText = 'Hide'; }
      else { inputEl.type = 'password'; toggleBtn.innerText = 'Show'; }
    }
    document.getElementById('pwnedShow').addEventListener('click', ()=> toggleShow(document.getElementById('pwnedPassword'), document.getElementById('pwnedShow')));
    document.getElementById('bruteShow').addEventListener('click', ()=> toggleShow(document.getElementById('brutePassword'), document.getElementById('bruteShow')));

    /* HIBP check */
    async function checkPasswordPwned(password){
      try{
        const sha1 = s => CryptoJS.SHA1(s).toString(CryptoJS.enc.Hex).toUpperCase();
        const h = sha1(password);
        const prefix = h.slice(0,5);
        const suffix = h.slice(5);
        const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
        if(!res.ok) throw new Error('HIBP network error');
        const txt = await res.text();
        const lines = txt.split('\n');
        for(const line of lines){
          const [suf, count] = line.trim().split(':');
          if(!suf) continue;
          if(suf.toUpperCase() === suffix.toUpperCase()){
            return { pwned:true, count: parseInt(count || '0', 10) };
          }
        }
        return { pwned:false, count:0 };
      }catch(err){
        console.error('HIBP error', err);
        return { pwned:false, count:0, error:true };
      }
    }

    document.getElementById('pwnedCheckBtn').addEventListener('click', async (e)=>{
      e.preventDefault();
      const pwd = document.getElementById('pwnedPassword').value || '';
      const resultEl = document.getElementById('pwnedResult');
      if(!pwd){ resultEl.innerHTML = '<div class="text-sm muted">Enter a password first.</div>'; return; }
      resultEl.innerHTML = '<div class="muted">Checking securely, Please wait…</div>';
      resultEl.classList.remove('pwned-pwned');
      const r = await checkPasswordPwned(pwd);
      if(r.error){
        resultEl.innerHTML = '<div class="text-sm text-yellow-300">Unable to check (network/API). Try again.</div>';
        document.body.className = '';
      } else if(r.pwned){
        resultEl.innerHTML = `<div class="text-sm text-red-400">Uh‑oh — this password has been exposed ${r.count.toLocaleString()} time(s) before. Time to change it ASAP!</div>`;
        resultEl.classList.add('pwned-pwned');
        document.body.classList.add('pwned');   // smooth transition thanks to CSS
      } else {
        resultEl.innerHTML = `<div class="text-sm text-emerald-300">All clear! This password doesn’t appear in known leaks. Nice job.</div>`;
        document.body.classList.add('safe');    // smooth transition
      }
    });

    /* Brute-force estimator */
    const combosText = document.getElementById('combosText');
    const timeText = document.getElementById('timeText');
    const timeBreakdown = document.getElementById('timeBreakdown');
    const gpuSelect = document.getElementById('gpuSelect');
    const estimateBtn = document.getElementById('estimateBtn');

    const log10 = x => Math.log(x) / Math.LN10;

    function niceScientificMantissa(log10v){
      const exponent = Math.floor(log10v);
      const mant = Math.pow(10, log10v - exponent);
      return `${mant.toFixed(3)} × 10^${exponent}`;
    }

    function humanTimeFromLog10Seconds(log10Seconds){
      if(!isFinite(log10Seconds)) return { label:'unknown', breakdown:'—' };
      const thresholds = {
        sec: 0,
        min: log10(60),
        hour: log10(60*60),
        day: log10(60*60*24),
        year: log10(60*60*24*365)
      };
      if(log10Seconds < thresholds.min) return { label: `${Math.pow(10,log10Seconds).toFixed(2)} seconds`, breakdown: `${niceScientificMantissa(log10Seconds)} s` };
      if(log10Seconds < thresholds.hour) return { label: `${(Math.pow(10,log10Seconds)/60).toFixed(2)} minutes`, breakdown: `${niceScientificMantissa(log10Seconds)} s` };
      if(log10Seconds < thresholds.day) return { label: `${(Math.pow(10,log10Seconds)/(60*60)).toFixed(2)} hours`, breakdown: `${niceScientificMantissa(log10Seconds)} s` };
      if(log10Seconds < thresholds.year) return { label: `${(Math.pow(10,log10Seconds)/(60*60*24)).toFixed(2)} days`, breakdown: `${niceScientificMantissa(log10Seconds)} s` };
      const years = Math.pow(10, log10Seconds - thresholds.year);
      if(log10Seconds - thresholds.year < 6) return { label: `${years.toFixed(2)} years`, breakdown: `${niceScientificMantissa(log10Seconds)} s` };
      return { label: `> ${niceScientificMantissa(log10Seconds - thresholds.year + thresholds.year)} years`, breakdown: `${niceScientificMantissa(log10Seconds)} s` };
    }

    function estimateCombosAndTime(charsetSize, length, ratePerSec){
      const log10Combos = length * Math.log10(charsetSize);
      const log10Rate = Math.log10(ratePerSec);
      const log10Seconds = log10Combos - log10Rate;
      const combosHuman = log10Combos < 6 ? Math.round(Math.pow(10, log10Combos)).toLocaleString() : niceScientificMantissa(log10Combos);
      return { log10Combos, combosHuman, log10Seconds };
    }

    function updateEstimateUI(){
      const p = document.getElementById('brutePassword').value;
      if (!p) {
        combosText.innerText = '—';
        timeText.innerText = '—';
        timeBreakdown.innerText = '—';
        return;
      }
      let charsetSize = 0;
      if(/[a-z]/.test(p)) charsetSize += 26;
      if(/[A-Z]/.test(p)) charsetSize += 26;
      if(/[0-9]/.test(p)) charsetSize += 10;
      if(/[^a-zA-Z0-9]/.test(p)) charsetSize += 30;
      if(charsetSize === 0) charsetSize = 1;
      const length = p.length;
      const rate = parseFloat(gpuSelect.value) || 1e9;
      const { combosHuman, log10Seconds } = estimateCombosAndTime(charsetSize, length, rate);
      combosText.innerText = combosHuman;
      const human = humanTimeFromLog10Seconds(log10Seconds);
      timeText.innerText = human.label;
      timeBreakdown.innerText = `Rate: ${Number(rate).toLocaleString()} tries/sec`;
    }

    estimateBtn.addEventListener('click', updateEstimateUI);