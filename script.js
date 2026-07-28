function triggerDeployAnimation() {
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');
    const btn = document.getElementById('btn-deploy');

    btn.innerHTML = '⏳ Syncing Git & Vercel...';
    btn.disabled = true;

    setTimeout(() => {
        const ind2 = step2.querySelector('.status-indicator');
        ind2.textContent = 'Synced';
        ind2.className = 'status-indicator success';
        step2.classList.add('active');
    }, 1200);

    setTimeout(() => {
        const ind3 = step3.querySelector('.status-indicator');
        ind3.textContent = 'Live Deployed';
        ind3.className = 'status-indicator success';
        step3.classList.add('active');

        btn.innerHTML = '✅ Deployed Successfully!';
        btn.style.background = 'linear-gradient(135deg, #1f6beb, #388bfd)';
    }, 2500);
}
