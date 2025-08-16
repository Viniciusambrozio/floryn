// ================= CART CUSTOM JAVASCRIPT =================

// Verificar compatibilidade do navegador e polyfills
(function() {
  'use strict';
  
  // Polyfill para CustomEvent (IE11)
  if (typeof window.CustomEvent !== 'function') {
    function CustomEvent(event, params) {
      params = params || { bubbles: false, cancelable: false, detail: undefined };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    }
    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
  }
  
  // Polyfill para Element.closest (IE11)
  if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
      var el = this;
      do {
        if (Element.prototype.matches.call(el, s)) return el;
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);
      return null;
    };
  }
  
  // Polyfill para Element.matches (IE11)
  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
  }
})();

document.addEventListener('DOMContentLoaded', function() {
  
  // Função para atualizar a barra de progresso de frete grátis
  function updateFreeShippingProgress() {
    const cartTotal = parseFloat(document.querySelector('.cart__subtotal .money')?.textContent.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    const freeShippingThreshold = 300.00; // R$ 300,00
    const progressBar = document.querySelector('.progress-bar');
    const freeShippingText = document.querySelector('.free-shipping-text');
    
    if (progressBar && freeShippingText) {
      const remaining = Math.max(0, freeShippingThreshold - cartTotal);
      const progress = Math.min(100, (cartTotal / freeShippingThreshold) * 100);
      
      progressBar.style.width = progress + '%';
      progressBar.setAttribute('aria-valuenow', progress);
      progressBar.setAttribute('aria-valuemin', '0');
      progressBar.setAttribute('aria-valuemax', '100');
      
      if (remaining > 0) {
        const remainingFormatted = `R$ ${remaining.toFixed(2).replace('.', ',')}`;
        freeShippingText.textContent = `Faltam ${remainingFormatted} para ganhar frete grátis!`;
        freeShippingText.classList.remove('achieved');
        progressBar.setAttribute('aria-label', `Progresso do frete grátis: ${progress.toFixed(0)}% completo`);
      } else {
        freeShippingText.textContent = 'VOCÊ GANHOU FRETE GRÁTIS!';
        freeShippingText.classList.add('achieved');
        progressBar.setAttribute('aria-label', 'Frete grátis conquistado!');
      }
    }
  }
  
  // Função para atualizar quantidade com debounce
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Atualizar quantidade do produto
  const quantityInputs = document.querySelectorAll('.cart__qty-input');
  quantityInputs.forEach(input => {
    const debouncedUpdate = debounce(function() {
      const form = input.closest('form');
      if (form) {
        form.submit();
      }
    }, 1000);
    
    input.addEventListener('change', debouncedUpdate);
  });
  
  // Botão limpar carrinho
  const clearCartBtn = document.querySelector('.clear-cart');
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      if (confirm('Tem certeza que deseja limpar o carrinho?')) {
        fetch('/cart/clear.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        })
        .then(response => response.json())
        .then(data => {
          window.location.reload();
        })
        .catch(error => {
          console.error('Erro ao limpar carrinho:', error);
        });
      }
    });
  }
  
  // Melhorar acessibilidade dos botões e adicionar feedback
  const buttons = document.querySelectorAll('.checkout_btn, .cart__update, .cart__remove, .cart__continue--large');
  buttons.forEach(button => {
    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
  
  // Melhorar acessibilidade específica dos botões de carrinho
  document.querySelectorAll('.cart__update, .cart__remove').forEach(button => {
    // Adicionar atributos de acessibilidade
    if (!button.getAttribute('aria-label')) {
      const action = button.classList.contains('cart__remove') ? 'Remover item' : 'Atualizar quantidade';
      button.setAttribute('aria-label', action);
    }
    
    // Adicionar feedback visual ao clicar
    button.addEventListener('click', function(e) {
      const isRemove = this.classList.contains('cart__remove');
      const isUpdate = this.classList.contains('cart__update');
      
      if (isRemove) {
        this.setAttribute('aria-busy', 'true');
        this.textContent = 'Removendo...';
        setTimeout(() => {
          showSuccessMessage('Item removido do carrinho', 'success');
        }, 500);
      } else if (isUpdate) {
        this.setAttribute('aria-busy', 'true');
        this.disabled = true;
        this.textContent = 'Atualizando...';
        setTimeout(() => {
          this.setAttribute('aria-busy', 'false');
          this.disabled = false;
          this.textContent = 'Atualizar';
          showSuccessMessage('Item atualizado com sucesso', 'success');
        }, 1000);
      }
    });
    
    // Tooltip para melhor UX
    button.addEventListener('mouseenter', function() {
      const tooltip = document.createElement('div');
      tooltip.className = 'button-tooltip';
      tooltip.textContent = this.getAttribute('aria-label') || this.textContent;
      tooltip.style.cssText = `
        position: absolute;
        background: #333;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 1000;
        pointer-events: none;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      `;
      
      document.body.appendChild(tooltip);
      
      const rect = this.getBoundingClientRect();
      tooltip.style.left = rect.left + 'px';
      tooltip.style.top = (rect.top - tooltip.offsetHeight - 8) + 'px';
      
      this.addEventListener('mouseleave', function() {
        if (tooltip.parentNode) {
          tooltip.parentNode.removeChild(tooltip);
        }
      }, { once: true });
    });
  });
  
  // Animações suaves para os itens do carrinho
  const cartRows = document.querySelectorAll('.cart__row');
  cartRows.forEach((row, index) => {
    row.style.animationDelay = `${index * 0.1}s`;
  });
  
  // Atualizar progresso na carga da página
  updateFreeShippingProgress();
  
  // Observar mudanças no DOM do carrinho para atualizar automaticamente
  const cartObserver = new MutationObserver(function(mutations) {
    let shouldUpdate = false;
    
    mutations.forEach(function(mutation) {
      // Verificar se houve mudanças relevantes
      if (mutation.type === 'childList') {
        // Itens adicionados ou removidos
        shouldUpdate = true;
      } else if (mutation.type === 'attributes') {
        // Atributos de preço ou quantidade alterados
        if (mutation.attributeName === 'data-total-price' || 
            mutation.attributeName === 'value' ||
            mutation.target.classList.contains('cart__qty-input')) {
          shouldUpdate = true;
        }
      } else if (mutation.type === 'characterData') {
        // Texto de preços alterado
        const parent = mutation.target.parentElement;
        if (parent && (parent.classList.contains('money') || parent.classList.contains('cart__subtotal'))) {
          shouldUpdate = true;
        }
      }
    });
    
    if (shouldUpdate) {
      // Debounce para evitar múltiplas atualizações
      clearTimeout(window.cartUpdateTimeout);
      window.cartUpdateTimeout = setTimeout(() => {
        updateFreeShippingProgress();
        // Disparar evento customizado para outros scripts
        document.dispatchEvent(new CustomEvent('cart:progress-updated', {
          detail: { timestamp: Date.now() }
        }));
      }, 100);
    }
  });
  
  const cartContainer = document.querySelector('.cart');
  if (cartContainer) {
    cartObserver.observe(cartContainer, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
      attributeFilter: ['data-total-price', 'value', 'data-quantity']
    });
  }
  
  // Observar especificamente os inputs de quantidade
  document.querySelectorAll('.cart__qty-input').forEach(input => {
    input.addEventListener('input', debounce(() => {
      updateFreeShippingProgress();
    }, 300));
    
    input.addEventListener('change', () => {
      updateFreeShippingProgress();
    });
  });
  
  // Interceptar requisições AJAX do carrinho
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const url = args[0];
    if (typeof url === 'string' && (url.includes('/cart') || url.includes('cart.js'))) {
      return originalFetch.apply(this, args).then(response => {
        if (response.ok) {
          setTimeout(() => {
            updateFreeShippingProgress();
          }, 200);
        }
        return response;
      });
    }
    return originalFetch.apply(this, args);
  };
  
  // Melhorar experiência mobile
  if (window.innerWidth <= 749) {
    // Adicionar swipe gestures para remover itens (opcional)
    let startX = 0;
    let currentX = 0;
    
    cartRows.forEach(row => {
      row.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
      });
      
      row.addEventListener('touchmove', function(e) {
        currentX = e.touches[0].clientX;
        const diff = startX - currentX;
        
        if (diff > 50) {
          this.style.transform = `translateX(-${Math.min(diff, 100)}px)`;
        }
      });
      
      row.addEventListener('touchend', function(e) {
        const diff = startX - currentX;
        if (diff > 100) {
          // Mostrar opção de remover
          const removeBtn = this.querySelector('.cart__remove');
          if (removeBtn) {
            removeBtn.style.display = 'block';
          }
        }
        this.style.transform = '';
      });
    });
  }
  
  // Adicionar loading states
  const checkoutBtn = document.querySelector('.checkout_btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
      this.disabled = true;
      this.innerHTML = '<span>Processando...</span>';
    });
  }
  
  // Melhorar feedback visual
  const updateBtns = document.querySelectorAll('.cart__update');
  updateBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const originalText = this.textContent;
      this.textContent = 'Atualizando...';
      this.disabled = true;
      
      setTimeout(() => {
        this.textContent = originalText;
        this.disabled = false;
      }, 2000);
    });
  });
  
  // Adicionar tooltips para melhor UX
  const tooltipElements = document.querySelectorAll('[data-tooltip]');
  tooltipElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = this.getAttribute('data-tooltip');
      tooltip.style.cssText = `
        position: absolute;
        background: #333;
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 1000;
        pointer-events: none;
      `;
      
      document.body.appendChild(tooltip);
      
      const rect = this.getBoundingClientRect();
      tooltip.style.left = rect.left + 'px';
      tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
      
      this.addEventListener('mouseleave', function() {
        if (tooltip.parentNode) {
          tooltip.parentNode.removeChild(tooltip);
        }
      }, { once: true });
    });
  });
  
  // Adicionar contador de itens no título da página
  function updatePageTitle() {
    const cartCount = document.querySelector('#CartCount span');
    if (cartCount) {
      const count = parseInt(cartCount.textContent) || 0;
      if (count > 0) {
        document.title = `Carrinho (${count} itens) - ${document.title.split(' - ').pop()}`;
      } else {
        document.title = document.title.replace(/Carrinho \(\d+ itens\) - /, '');
      }
    }
  }
  
  updatePageTitle();
  
  // Adicionar evento para atualizar título quando carrinho mudar
  document.addEventListener('cart:updated', updatePageTitle);
  
  // Melhorar performance com Intersection Observer
  const lazyImages = document.querySelectorAll('.cart__image');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  });
  
  lazyImages.forEach(img => {
    if (img.dataset.src) {
      imageObserver.observe(img);
    }
  });
  
  // Adicionar feedback de sucesso para ações
  function showSuccessMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `cart-message cart-message--${type}`;
    messageDiv.textContent = message;
    messageDiv.setAttribute('role', 'alert');
    messageDiv.setAttribute('aria-live', 'assertive');
    
    const bgColor = type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8';
    messageDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${bgColor};
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      max-width: 300px;
      font-size: 14px;
      line-height: 1.4;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
      messageDiv.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        if (messageDiv.parentNode) {
          messageDiv.parentNode.removeChild(messageDiv);
        }
      }, 300);
    }, 3000);
  }
  
  // Adicionar estilos CSS para animações
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  
  // Função debounce para otimizar performance
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Expor funções globalmente para uso em outros scripts
  window.cartCustom = {
    updateFreeShippingProgress,
    showSuccessMessage,
    updatePageTitle,
    debounce
  };
  
});
