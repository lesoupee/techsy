// Funcionalidad para el menú móvil
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Animar las barras del menú hamburguesa
            const spans = menuToggle.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
        });
        
        // Cerrar menú al hacer clic en un enlace
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                
                const spans = menuToggle.querySelectorAll('span');
                spans.forEach(span => span.classList.remove('active'));
            });
        });
    }
    
    // Animación de scroll suave para los enlaces de navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Efecto de aparición al hacer scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar secciones para animaciones
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
    
    // Cambiar estilo de navegación al hacer scroll
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('nav');
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    
    // Funcionalidad para los botones de productos
    document.querySelectorAll('.btn-secondary').forEach(button => {
        button.addEventListener('click', function() {
            // Simular añadir al carrito
            const productName = this.parentElement.querySelector('h3').textContent;
            alert(`${productName} añadido al carrito`);
        });
    });
    
    // Validación simple del formulario de contacto
    const contactForm = document.querySelector('.contacto-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const mensaje = document.getElementById('mensaje').value;
            
            if (nombre && email && mensaje) {
                alert('¡Gracias por tu mensaje! Te contactaremos pronto.');
                contactForm.reset();
            } else {
                alert('Por favor completa todos los campos.');
            }
        });
    }
});

// Añadir estilos adicionales para mejorar la experiencia móvil
document.addEventListener('DOMContentLoaded', function() {
    // Detectar si es dispositivo móvil
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
        document.body.classList.add('mobile-device');
    }
    
    // Ajustar altura de hero en móviles
    function adjustHeroHeight() {
        const hero = document.querySelector('.hero');
        if (hero && window.innerWidth < 768) {
            hero.style.height = `${window.innerHeight - 70}px`;
        } else if (hero) {
            hero.style.height = '';
        }
    }
    
    adjustHeroHeight();
    window.addEventListener('resize', adjustHeroHeight);
});
