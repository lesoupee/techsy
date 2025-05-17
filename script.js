// NUEVO: Sistema de carrito y proceso de pago
document.addEventListener('DOMContentLoaded', function() {
    // Variables globales para el carrito
    let cart = [];
    let discountApplied = false;
    let discountCode = "PRUEBACUPÓN28653";
    let discountPercentage = 35;
    let shippingCost = 0;
    
    // Elementos del DOM
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.getElementById('close-cart');
    const cartItems = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const discountCodeInput = document.getElementById('discount-code');
    const applyDiscountBtn = document.getElementById('apply-discount');
    const discountMessage = document.getElementById('discount-message');
    
    // Elementos del checkout
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckout = document.getElementById('close-checkout');
    const cancelCheckout = document.getElementById('cancel-checkout');
    
    // Pasos del checkout
    const checkoutStep1 = document.getElementById('checkout-step-1');
    const checkoutStep2 = document.getElementById('checkout-step-2');
    const checkoutStep3 = document.getElementById('checkout-step-3');
    const checkoutStep4 = document.getElementById('checkout-step-4');
    const checkoutConfirmation = document.getElementById('checkout-confirmation');
    
    // Botones de navegación del checkout
    const nextStep1 = document.getElementById('next-step-1');
    const prevStep2 = document.getElementById('prev-step-2');
    const nextStep2 = document.getElementById('next-step-2');
    const prevStep3 = document.getElementById('prev-step-3');
    const nextStep3 = document.getElementById('next-step-3');
    const prevStep4 = document.getElementById('prev-step-4');
    const placeOrderBtn = document.getElementById('place-order');
    const continueShoppingBtn = document.getElementById('continue-shopping');
    
    // Opciones de envío
    const pickupOption = document.getElementById('pickup');
    const deliveryOption = document.getElementById('delivery');
    const deliveryAddress = document.getElementById('delivery-address');
    
    // Opciones de pago
    const creditCardOption = document.getElementById('credit-card');
    const bankTransferOption = document.getElementById('bank-transfer');
    const mercadoPagoOption = document.getElementById('mercado-pago');
    const cashOption = document.getElementById('cash');
    
    const creditCardForm = document.getElementById('credit-card-form');
    const bankTransferInfo = document.getElementById('bank-transfer-info');
    const mercadoPagoInfo = document.getElementById('mercado-pago-info');
    const cashInfo = document.getElementById('cash-info');
    
    // Funcionalidad para el menú móvil (código original)
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
    
    // NUEVO: Funcionalidad para añadir productos al carrito
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.producto-card') || this.parentElement;
            const productId = this.dataset.id || productCard.dataset.id;
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = parseFloat(this.dataset.price || productCard.dataset.price);
            
            addToCart(productId, productName, productPrice);
            updateCartIcon();
            
            // Mostrar confirmación
            const confirmMessage = document.createElement('div');
            confirmMessage.className = 'add-confirmation';
            confirmMessage.textContent = 'Producto añadido al carrito';
            document.body.appendChild(confirmMessage);
            
            setTimeout(() => {
                confirmMessage.classList.add('show');
                setTimeout(() => {
                    confirmMessage.classList.remove('show');
                    setTimeout(() => {
                        document.body.removeChild(confirmMessage);
                    }, 300);
                }, 2000);
            }, 10);
        });
    });
    
    // NUEVO: Función para añadir productos al carrito
    function addToCart(id, name, price) {
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: id,
                name: name,
                price: price,
                quantity: 1
            });
        }
        
        // Guardar carrito en localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // NUEVO: Función para actualizar el icono del carrito
    function updateCartIcon() {
        const cartCount = document.querySelector('.cart-count');
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
    
    // NUEVO: Función para renderizar los items del carrito
    function renderCartItems() {
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
            return;
        }
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-img">
                    <div class="placeholder-img">${item.name.split(' ')[0]}</div>
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                        <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                        <button class="quantity-btn increase" data-id="${item.id}">+</button>
                        <button class="remove-item" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            
            cartItems.appendChild(cartItem);
        });
        
        // Añadir event listeners a los botones de cantidad
        document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.dataset.id;
                decreaseQuantity(id);
            });
        });
        
        document.querySelectorAll('.quantity-btn.increase').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.dataset.id;
                increaseQuantity(id);
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.dataset.id;
                removeItem(id);
            });
        });
    }
    
    // NUEVO: Funciones para manipular cantidades
    function decreaseQuantity(id) {
        const item = cart.find(item => item.id === id);
        
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            removeItem(id);
            return;
        }
        
        updateCart();
    }
    
    function increaseQuantity(id) {
        const item = cart.find(item => item.id === id);
        item.quantity += 1;
        updateCart();
    }
    
    function removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        updateCart();
    }
    
    // NUEVO: Función para actualizar el carrito
    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartTotals();
        updateCartIcon();
    }
    
    // NUEVO: Función para calcular y actualizar los totales
    function updateCartTotals() {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        let discount = 0;
        
        if (discountApplied) {
            discount = subtotal * (discountPercentage / 100);
        }
        
        const total = subtotal - discount + shippingCost;
        
        cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
    
    // NUEVO: Evento para abrir el carrito
    cartIcon.addEventListener('click', function() {
        cartModal.style.display = 'flex';
        renderCartItems();
        updateCartTotals();
    });
    
    // NUEVO: Evento para cerrar el carrito
    closeCart.addEventListener('click', function() {
        cartModal.style.display = 'none';
    });
    
    // NUEVO: Cerrar el carrito al hacer clic fuera
    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    // NUEVO: Aplicar código de descuento
    applyDiscountBtn.addEventListener('click', function() {
        const code = discountCodeInput.value.trim();
        
        if (code === discountCode && !discountApplied) {
            discountApplied = true;
            discountMessage.textContent = `¡Descuento del ${discountPercentage}% aplicado!`;
            discountMessage.className = 'discount-applied';
            updateCartTotals();
        } else if (discountApplied) {
            discountMessage.textContent = 'Ya has aplicado un código de descuento';
            discountMessage.className = 'discount-error';
        } else {
            discountMessage.textContent = 'Código de descuento inválido';
            discountMessage.className = 'discount-error';
        }
    });
    
    // NUEVO: Iniciar proceso de checkout
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }
        
        cartModal.style.display = 'none';
        checkoutModal.style.display = 'flex';
        
        // Mostrar el primer paso
        showCheckoutStep(1);
    });
    
    // NUEVO: Función para mostrar pasos del checkout
    function showCheckoutStep(step) {
        // Ocultar todos los pasos
        checkoutStep1.classList.remove('active');
        checkoutStep2.classList.remove('active');
        checkoutStep3.classList.remove('active');
        checkoutStep4.classList.remove('active');
        checkoutConfirmation.classList.remove('active');
        
        // Mostrar el paso actual
        switch(step) {
            case 1:
                checkoutStep1.classList.add('active');
                break;
            case 2:
                checkoutStep2.classList.add('active');
                break;
            case 3:
                checkoutStep3.classList.add('active');
                break;
            case 4:
                checkoutStep4.classList.add('active');
                updateOrderSummary();
                break;
            case 5:
                checkoutConfirmation.classList.add('active');
                break;
        }
    }
    
    // NUEVO: Navegación entre pasos del checkout
    nextStep1.addEventListener('click', function() {
        const nombre = document.getElementById('checkout-nombre').value;
        const email = document.getElementById('checkout-email').value;
        const telefono = document.getElementById('checkout-telefono').value;
        
        if (!nombre || !email || !telefono) {
            alert('Por favor completa todos los campos');
            return;
        }
        
        showCheckoutStep(2);
    });
    
    prevStep2.addEventListener('click', function() {
        showCheckoutStep(1);
    });
    
    nextStep2.addEventListener('click', function() {
        if (deliveryOption.checked) {
            const direccion = document.getElementById('checkout-direccion').value;
            const ciudad = document.getElementById('checkout-ciudad').value;
            const codigoPostal = document.getElementById('checkout-codigo-postal').value;
            
            if (!direccion || !ciudad || !codigoPostal) {
                alert('Por favor completa la dirección de envío');
                return;
            }
        }
        
        showCheckoutStep(3);
    });
    
    prevStep3.addEventListener('click', function() {
        showCheckoutStep(2);
    });
    
    nextStep3.addEventListener('click', function() {
        if (creditCardOption.checked) {
            const cardNumber = document.getElementById('card-number').value;
            const cardExpiry = document.getElementById('card-expiry').value;
            const cardCvv = document.getElementById('card-cvv').value;
            const cardName = document.getElementById('card-name').value;
            
            if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
                alert('Por favor completa los datos de la tarjeta');
                return;
            }
        }
        
        showCheckoutStep(4);
    });
    
    prevStep4.addEventListener('click', function() {
        showCheckoutStep(3);
    });
    
    // NUEVO: Opciones de envío
    pickupOption.addEventListener('change', function() {
        if (this.checked) {
            deliveryAddress.classList.add('hidden');
            shippingCost = 0;
            updateCartTotals();
        }
    });
    
    deliveryOption.addEventListener('change', function() {
        if (this.checked) {
            deliveryAddress.classList.remove('hidden');
            shippingCost = 10;
            updateCartTotals();
        }
    });
    
    // NUEVO: Opciones de pago
    creditCardOption.addEventListener('change', function() {
        if (this.checked) {
            creditCardForm.classList.remove('hidden');
            bankTransferInfo.classList.add('hidden');
            mercadoPagoInfo.classList.add('hidden');
            cashInfo.classList.add('hidden');
        }
    });
    
    bankTransferOption.addEventListener('change', function() {
        if (this.checked) {
            creditCardForm.classList.add('hidden');
            bankTransferInfo.classList.remove('hidden');
            mercadoPagoInfo.classList.add('hidden');
            cashInfo.classList.add('hidden');
        }
    });
    
    mercadoPagoOption.addEventListener('change', function() {
        if (this.checked) {
            creditCardForm.classList.add('hidden');
            bankTransferInfo.classList.add('hidden');
            mercadoPagoInfo.classList.remove('hidden');
            cashInfo.classList.add('hidden');
        }
    });
    
    cashOption.addEventListener('change', function() {
        if (this.checked) {
            creditCardForm.classList.add('hidden');
            bankTransferInfo.classList.add('hidden');
            mercadoPagoInfo.classList.add('hidden');
            cashInfo.classList.remove('hidden');
        }
    });
    
    // NUEVO: Actualizar resumen del pedido
    function updateOrderSummary() {
        const orderItems = document.getElementById('order-items');
        const orderSubtotal = document.getElementById('order-subtotal');
        const orderDiscount = document.getElementById('order-discount');
        const orderDiscountContainer = document.getElementById('order-discount-container');
        const orderShipping = document.getElementById('order-shipping');
        const orderTotal = document.getElementById('order-total');
        
        // Información del cliente
        const summaryCustomerName = document.getElementById('summary-customer-name');
        const summaryCustomerEmail = document.getElementById('summary-customer-email');
        const summaryCustomerPhone = document.getElementById('summary-customer-phone');
        
        // Información de envío
        const summaryShippingMethod = document.getElementById('summary-shipping-method');
        const summaryShippingAddress = document.getElementById('summary-shipping-address');
        const summaryAddress = document.getElementById('summary-address');
        const summaryCityZip = document.getElementById('summary-city-zip');
        
        // Información de pago
        const summaryPaymentMethod = document.getElementById('summary-payment-method');
        
        // Renderizar items
        orderItems.innerHTML = '';
        cart.forEach(item => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <span class="order-item-name">${item.name}</span>
                <span class="order-item-quantity">x${item.quantity}</span>
                <span class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
            `;
            orderItems.appendChild(orderItem);
        });
        
        // Calcular totales
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        let discount = 0;
        
        if (discountApplied) {
            discount = subtotal * (discountPercentage / 100);
            orderDiscountContainer.classList.remove('hidden');
            orderDiscount.textContent = `-$${discount.toFixed(2)}`;
        } else {
            orderDiscountContainer.classList.add('hidden');
        }
        
        const total = subtotal - discount + shippingCost;
        
        orderSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        orderShipping.textContent = `$${shippingCost.toFixed(2)}`;
        orderTotal.textContent = `$${total.toFixed(2)}`;
        
        // Información del cliente
        const nombre = document.getElementById('checkout-nombre').value;
        const email = document.getElementById('checkout-email').value;
        const telefono = document.getElementById('checkout-telefono').value;
        
        summaryCustomerName.textContent = nombre;
        summaryCustomerEmail.textContent = email;
        summaryCustomerPhone.textContent = telefono;
        
        // Información de envío
        if (pickupOption.checked) {
            summaryShippingMethod.textContent = 'Recoger en punto';
            summaryShippingAddress.classList.add('hidden');
        } else {
            summaryShippingMethod.textContent = 'Envío a domicilio';
            summaryShippingAddress.classList.remove('hidden');
            
            const direccion = document.getElementById('checkout-direccion').value;
            const ciudad = document.getElementById('checkout-ciudad').value;
            const codigoPostal = document.getElementById('checkout-codigo-postal').value;
            
            summaryAddress.textContent = direccion;
            summaryCityZip.textContent = `${ciudad}, ${codigoPostal}`;
        }
        
        // Información de pago
        if (creditCardOption.checked) {
            summaryPaymentMethod.textContent = 'Tarjeta de Crédito';
        } else if (bankTransferOption.checked) {
            summaryPaymentMethod.textContent = 'Transferencia Bancaria';
        } else if (mercadoPagoOption.checked) {
            summaryPaymentMethod.textContent = 'Mercado Pago';
        } else {
            summaryPaymentMethod.textContent = 'Efectivo';
        }
    }
    
    // NUEVO: Confirmar pedido
    placeOrderBtn.addEventListener('click', function() {
        const orderNumber = generateOrderNumber();
        document.getElementById('order-number').textContent = orderNumber;
        document.getElementById('confirmation-email').textContent = document.getElementById('checkout-email').value;
        
        showCheckoutStep(5);
        
        // Limpiar carrito
        cart = [];
        localStorage.removeItem('cart');
        updateCartIcon();
    });
    
    // NUEVO: Generar número de pedido
    function generateOrderNumber() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        
        return `NT-${year}${month}${day}-${random}`;
    }
    
    // NUEVO: Cerrar checkout
    closeCheckout.addEventListener('click', function() {
        checkoutModal.style.display = 'none';
    });
    
    cancelCheckout.addEventListener('click', function() {
        checkoutModal.style.display = 'none';
    });
    
    continueShoppingBtn.addEventListener('click', function() {
        checkoutModal.style.display = 'none';
        window.scrollTo({
            top: document.getElementById('productos').offsetTop - 80,
            behavior: 'smooth'
        });
    });
    
    // NUEVO: Cerrar checkout al hacer clic fuera
    checkoutModal.addEventListener('click', function(e) {
        if (e.target === checkoutModal) {
            checkoutModal.style.display = 'none';
        }
    });
    
    // NUEVO: Cargar carrito desde localStorage
    function loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartIcon();
        }
    }
    
    // Cargar carrito al iniciar
    loadCart();
    
    // Animación de scroll suave para los enlaces de navegación (código original)
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
    
    // Efecto de aparición al hacer scroll (código original)
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
    
    // Observar secciones para animaciones (código original)
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
    
    // Cambiar estilo de navegación al hacer scroll (código original)
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('nav');
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    
    // Validación simple del formulario de contacto (código original)
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
    
    // Ajustar altura de hero en móviles (código original)
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