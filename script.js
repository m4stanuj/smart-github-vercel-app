const simulationButton = document.getElementById('btn-deploy');
const simulationResult = document.getElementById('simulation-result');
const stepStatuses = document.querySelectorAll('#features .status-indicator');

simulationButton.addEventListener('click', async () => {
    if (simulationButton.getAttribute('aria-disabled') === 'true') {
        return;
    }

    simulationButton.setAttribute('aria-disabled', 'true');
    simulationResult.textContent = 'Deployment simulation running.';
    for (const status of stepStatuses) {
        status.textContent = 'Waiting';
        status.classList.remove('success');
    }

    for (const status of stepStatuses) {
        status.textContent = 'Simulating';
        await new Promise((resolve) => setTimeout(resolve, 800));
        status.textContent = 'Simulation complete';
        status.classList.add('success');
    }

    simulationResult.textContent = 'Simulation complete. All three demo steps finished.';
    simulationButton.removeAttribute('aria-disabled');
});

simulationButton.disabled = false;
