(() => {
    const form = document.getElementById('contact-form');
    if (!form) return;
    const submit = document.getElementById('contact-submit');
    const status = document.getElementById('contact-status');
    let state = 'idle';
    const messages = {
        sending: ['Enviando tu mensaje…', 'Sending your message…'],
        success: ['Mensaje enviado. Gracias por contarme tu idea; te responderé por email.', 'Message sent. Thank you for sharing your idea; I will reply by email.'],
        activation: ['La recepción de consultas todavía no está habilitada. Tu mensaje no se confirmó; intentá nuevamente más tarde.', 'Inquiry delivery is not enabled yet. Your message was not confirmed; please try again later.'],
        error: ['No pudimos confirmar el envío. Tus datos siguen en el formulario para que puedas volver a intentarlo.', 'We could not confirm delivery. Your details remain in the form so you can try again.']
    };

    function render() {
        const english = document.documentElement.lang === 'en';
        const busy = state === 'sending';
        submit.disabled = busy;
        submit.textContent = busy
            ? (english ? 'Sending…' : 'Enviando…')
            : (english ? 'Send message' : 'Enviar mensaje');
        form.setAttribute('aria-busy', String(busy));
        status.hidden = state === 'idle';
        status.dataset.state = state;
        status.textContent = messages[state]?.[english ? 1 : 0] || '';
    }

    // main.js translates shared labels; preserve the current sending/status text.
    new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    form.addEventListener('input', event => {
        event.target.setCustomValidity?.('');
        if (state !== 'sending') {
            state = 'idle';
            render();
        }
    });

    form.addEventListener('submit', async event => {
        event.preventDefault();
        if (state === 'sending') return;
        for (const field of form.querySelectorAll('[required]')) {
            field.setCustomValidity('');
            const minimum = Number(field.getAttribute('minlength')) || 1;
            if (field.value.trim().length < minimum) {
                field.setCustomValidity(document.documentElement.lang === 'en' ? `Please enter at least ${minimum} characters.` : `Ingresá al menos ${minimum} caracteres.`);
            }
        }
        if (!form.reportValidity()) return;
        const payload = Object.fromEntries(new FormData(form));
        for (const key of ['name', 'email', 'phone', 'message']) payload[key] = payload[key].trim();
        if (payload._honey) return;
        state = 'sending';
        render();
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 20000);
        try {
            const response = await fetch(form.dataset.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(payload),
                signal: controller.signal
            });
            const result = await response.json();
            if (/activat|verif|confirm.*email/i.test(String(result.message || ''))) {
                state = 'activation';
            } else if (response.ok && (result.success === true || result.success === 'true')) {
                state = 'success';
                form.reset();
            } else {
                state = 'error';
            }
        } catch {
            state = 'error';
        } finally {
            clearTimeout(timeout);
            render();
        }
    });
    render();
})();
