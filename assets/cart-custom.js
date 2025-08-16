// ================= CART CUSTOM JAVASCRIPT =================

document.addEventListener('DOMContentLoaded', function() {
  
  // Função para atualizar a barra de progresso do frete grátis
  function updateFreeShippingProgress() {
    const cartTotal = {{ cart.total_price | divided_by: 100.0 }};
    const freeShippingThreshold = 300;
    const remainingAmount = Math.max(0, freeShippingThreshold - cartTotal);
    const progressPercentage = Math.min(100, (cartTotal / freeShippingThreshold) * 100);
    
    const messageElement = document.getElementById('free-shipping-message');
    const remainingElement = document.getElementById('remaining-amount');
    const progressBar = document.getElementById('progress-bar');
    const textContainer = document.querySelector('.free-shipping-text');
    
    if (messageElement && progressBar && textContainer) {
      if (cartTotal >= freeShippingThreshold) {
        messageElement.innerHTML = 'VOCÊ GANHOU FRETE GRÁTIS!';
        textContainer.classList.add('achieved');
        progressBar.style.width = '100%';
      } else {
        const formattedRemaining = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(remainingAmount);
        
        messageElement.innerHTML = `Faltam <span id="remaining-amount">${formattedRemaining}</span> para ganhar frete grátis!`;
        textContainer.classList.remove('achieved');
        progressBar.style.width = progressPercentage + '%';
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
  
  // Melhorar acessibilidade dos botões
  const buttons = document.querySelectorAll('.checkout_btn, .cart__update, .cart__remove, .cart__continue--large');
  buttons.forEach(button => {
    button.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
  
  // Animações suaves para os itens do carrinho
  const cartRows = document.querySelectorAll('.cart__row');
  cartRows.forEach((row, index) => {
    row.style.animationDelay = `${index * 0.1}s`;
  });
  
  // Atualizar progresso na carga da página
  updateFreeShippingProgress();
  
  // Observar mudanças no DOM para atualizações do carrinho
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList' || mutation.type === 'subtree') {
        updateFreeShippingProgress();
      }
    });
  });
  
  const cartElement = document.querySelector('.cart');
  if (cartElement) {
    observer.observe(cartElement, {
      childList: true,
      subtree: true
    });
  }
  
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
  function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 15px 20px;
      border-radius: 4px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
      successDiv.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => {
        if (successDiv.parentNode) {
          successDiv.parentNode.removeChild(successDiv);
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
  
  // Expor funções globalmente para uso em outros scripts
  window.cartCustom = {
    updateFreeShippingProgress,
    showSuccessMessage,
    updatePageTitle
  };
  
});
