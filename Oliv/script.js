// Configurações do EmailJS
const EMAILJS_PUBLIC_KEY = 'STisO86eEpTljPbr7';
const EMAILJS_SERVICE_ID = 'service_0d76amq';
const EMAILJS_TEMPLATE_ID = 'template_vgdr6tb';

document.addEventListener('DOMContentLoaded', () => {

    if (window.emailjs) {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    /* --- Hero slideshow (slow, non-interactive) --- */
    const heroSlides = document.querySelectorAll('.hero-slide');
    if (heroSlides.length > 1) {
        let heroIndex = 0;
        const showSlide = (idx) => {
            heroSlides.forEach((s) => s.classList.remove('is-active'));
            heroSlides[idx].classList.add('is-active');
        };

        showSlide(heroIndex);
        setInterval(() => {
            heroIndex = (heroIndex + 1) % heroSlides.length;
            showSlide(heroIndex);
        }, 4500);
    }

    /* --- Scroll Header Effect --- */
    const header = document.getElementById('header');

    // Using IntersectionObserver for better performance vs scroll event
    // However, for the header specific scroll position, passive event listener is best.
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });

    /* --- Scroll Reveal Animation --- */
    // Completely replaced legacy scroll handler with high-performance IntersectionObserver
    const revealElements = document.querySelectorAll('.reveal, .reveal-mission');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px', // trigger slightly before it comes into view
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing once revealed for static content
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    /* --- Modal & WhatsApp Form Logic --- */
    const modal = document.getElementById('contactModal');
    const ctaButtons = document.querySelectorAll('.cta-button');
    const closeModalBtn = document.querySelector('.close-modal');
    const form = document.getElementById('whatsappForm');
    const successBlock = document.getElementById('contactSuccess');
    const whatsappButton = document.getElementById('whatsappButton');
    let contactSentThisSession = false;
    let lastWhatsappUrl = '';

    // Open modal
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
            if (contactSentThisSession) {
                if (form) {
                    form.classList.add('hidden');
                }
                if (successBlock) {
                    successBlock.classList.remove('hidden');
                }
                if (whatsappButton && lastWhatsappUrl) {
                    whatsappButton.onclick = () => {
                        window.open(lastWhatsappUrl, '_blank');
                    };
                }
            }
            // Slight delay to apply opacity smoothly
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    modal.classList.add('show');
                });
            });
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });

    // Close modal function
    const closeModal = () => {
        modal.classList.remove('show');
        // Reset only if contact wasn't sent in this session
        if (!contactSentThisSession) {
            if (form) {
                form.reset();
                form.classList.remove('hidden');
            }
            if (successBlock) {
                successBlock.classList.add('hidden');
            }
        }
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
        }, 400); // match css transition
    };

    // Close on X
    closeModalBtn.addEventListener('click', closeModal);

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    /* --- Esc key to close modal --- */
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    /* --- Format Phone Number visually --- */
    const phoneInput = document.getElementById('telefone');
    phoneInput.addEventListener('input', (e) => {
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
        e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    });

    /* --- Handle WhatsApp / E-mail style Submit --- */
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (contactSentThisSession) {
            if (form) {
                form.classList.add('hidden');
            }
            if (successBlock) {
                successBlock.classList.remove('hidden');
            }
            if (whatsappButton && lastWhatsappUrl) {
                whatsappButton.onclick = () => {
                    window.open(lastWhatsappUrl, '_blank');
                };
            }
            return;
        }

        const nomeInput = document.getElementById('nome');
        const telefoneInput = document.getElementById('telefone');
        const emailInput = document.getElementById('email');
        const interesseSelect = document.getElementById('interesse');

        // Clear previous error state
        [nomeInput, telefoneInput, emailInput, interesseSelect].forEach((el) => {
            el.classList.remove('error');
        });

        const nome = nomeInput.value.trim();
        const telefone = telefoneInput.value.trim();
        const email = emailInput.value.trim();
        const interesse = interesseSelect.value;

        // Validation (subtle visual feedback)
        let hasError = false;
        if (!nome) {
            nomeInput.classList.add('error');
            hasError = true;
        }
        if (!telefone) {
            telefoneInput.classList.add('error');
            hasError = true;
        }
        if (!email) {
            emailInput.classList.add('error');
            hasError = true;
        }
        if (!interesse) {
            interesseSelect.classList.add('error');
            hasError = true;
        }

        if (hasError) {
            return;
        }

        // WhatsApp Number for the team
        const waNumber = "5519971687978";

        // Build the base message
        let mensagem = `Olá, equipe OLIV creative!\n\n`;
        mensagem += `Gostaria de solicitar um contato para projeto.\n`;
        mensagem += `*Nome:* ${nome}\n`;
        mensagem += `*E-mail:* ${email}\n`;
        mensagem += `*Telefone:* ${telefone}\n`;
        mensagem += `*Interesse:* ${interesse}\n\n`;
        mensagem += `Aguardo o retorno!`;

        // Envio real via EmailJS
        if (window.emailjs) {
            const page = window.location.href;
            const formatTitle = (text) => text
                .split(' ')
                .map((w) => w
                    .split('-')
                    .map((p) => p ? (p[0].toUpperCase() + p.slice(1)) : p)
                    .join('-')
                )
                .join(' ');

            const formatSaoPauloTime = (date) => {
                const tz = 'America/Sao_Paulo';

                const dateFmt = new Intl.DateTimeFormat('pt-BR', {
                    timeZone: tz,
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                });

                const timeFmt = new Intl.DateTimeFormat('pt-BR', {
                    timeZone: tz,
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                });

                const dateParts = dateFmt.formatToParts(date);
                const get = (type) => dateParts.find((p) => p.type === type)?.value || '';

                const weekday = formatTitle(get('weekday'));
                const day = get('day');
                const month = formatTitle(get('month'));
                const year = get('year');
                const hm = timeFmt.format(date);

                return `${weekday}, ${day} de ${month} de ${year} às ${hm}`;
            };

            const time = formatSaoPauloTime(new Date());

            const templateParams = {
                nome,
                email,
                interesse,
                telefone,
                page,
                time,
                ip: 'indisponível',
            };

            // Melhor esforço: tenta pegar IP público (se falhar, envia sem IP)
            try {
                const ipRes = await fetch('https://api.ipify.org?format=json', { cache: 'no-store' });
                if (ipRes.ok) {
                    const ipJson = await ipRes.json();
                    if (ipJson && typeof ipJson.ip === 'string') {
                        templateParams.ip = ipJson.ip;
                    }
                }
            } catch (_) { }

            try {
                await emailjs.send(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_TEMPLATE_ID,
                    templateParams,
                    EMAILJS_PUBLIC_KEY
                );
            } catch (err) {
                console.error('EmailJS send error:', err);
                const details =
                    (err && typeof err === 'object' && ('text' in err) && err.text) ||
                    (err && typeof err === 'object' && ('message' in err) && err.message) ||
                    String(err);
                alert(`Falha ao enviar e-mail. Detalhes: ${details}`);
                return;
            }

            // URL para WhatsApp (opcional, via botão)
            const encodedMessage = encodeURIComponent(mensagem);
            const whatsappUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;
            contactSentThisSession = true;
            lastWhatsappUrl = whatsappUrl;

            if (whatsappButton) {
                whatsappButton.onclick = () => {
                    window.open(whatsappUrl, '_blank');
                };
            }

            if (form) {
                form.classList.add('hidden');
            }
            if (successBlock) {
                successBlock.classList.remove('hidden');
            }
        } else {
            // Se EmailJS não estiver configurado, mantém apenas o fluxo visual
            const encodedMessage = encodeURIComponent(mensagem);
            const whatsappUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;
            contactSentThisSession = true;
            lastWhatsappUrl = whatsappUrl;

            if (whatsappButton) {
                whatsappButton.onclick = () => {
                    window.open(whatsappUrl, '_blank');
                };
            }

            if (form) {
                form.classList.add('hidden');
            }
            if (successBlock) {
                successBlock.classList.remove('hidden');
            }
        }
    });
});
