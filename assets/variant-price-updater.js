// Script específico para atualizar preços das variantes
(function() {
  'use strict';
  
  console.log('🚀 Variant Price Updater carregado');
  
  // Função para formatar preço em Real brasileiro
  function formatPrice(price) {
    return 'R$ ' + (price / 100).toFixed(2).replace('.', ',');
  }
  
  // Função para atualizar preços na tela
  function updatePrices(variant, sectionId) {
    console.log('💰 Atualizando preços para variante:', variant.title, 'Preço:', variant.price);
    
    // Buscar elementos de preço de forma mais ampla
    var priceSelectors = [
      '#ProductPrice-' + sectionId,
      '.product-price__price',
      '.price',
      '[id*="ProductPrice"]'
    ];
    
    var priceElement = null;
    for (var i = 0; i < priceSelectors.length; i++) {
      priceElement = document.querySelector(priceSelectors[i]);
      if (priceElement) break;
    }
    
    if (priceElement) {
      priceElement.innerHTML = formatPrice(variant.price);
      console.log('✅ Preço principal atualizado:', formatPrice(variant.price));
    } else {
      console.log('❌ Elemento de preço não encontrado');
    }
    
    // Buscar elementos de preço comparativo
    var compareSelectors = [
      '#ComparePrice-' + sectionId,
      '.product-price__compare',
      '.compare-price',
      '[id*="ComparePrice"]'
    ];
    
    var comparePriceElement = null;
    for (var i = 0; i < compareSelectors.length; i++) {
      comparePriceElement = document.querySelector(compareSelectors[i]);
      if (comparePriceElement) break;
    }
    
    if (comparePriceElement) {
      if (variant.compare_at_price && variant.compare_at_price > variant.price) {
        comparePriceElement.innerHTML = formatPrice(variant.compare_at_price);
        comparePriceElement.style.display = 'inline';
        console.log('✅ Preço comparativo atualizado:', formatPrice(variant.compare_at_price));
      } else {
        comparePriceElement.style.display = 'none';
        console.log('🔄 Preço comparativo ocultado');
      }
    }
    
    // Atualizar botão de adicionar ao carrinho
    var buttonSelectors = [
      '#AddToCart',
      '.btn-addtocart',
      '.add-to-cart',
      '[type="submit"]'
    ];
    
    var addButton = null;
    for (var i = 0; i < buttonSelectors.length; i++) {
      addButton = document.querySelector(buttonSelectors[i]);
      if (addButton) break;
    }
    
    if (addButton) {
      if (variant.available) {
        addButton.disabled = false;
        console.log('✅ Botão habilitado - produto disponível');
      } else {
        addButton.disabled = true;
        console.log('❌ Botão desabilitado - produto esgotado');
      }
    }
  }
  
  // Função para encontrar variante baseada nas opções
  function findVariant(productData, selectedOptions) {
    console.log('🔍 Procurando variante para opções:', selectedOptions);
    
    for (var i = 0; i < productData.variants.length; i++) {
      var variant = productData.variants[i];
      var match = true;
      
      for (var j = 0; j < selectedOptions.length; j++) {
        if (variant.options[j] !== selectedOptions[j]) {
          match = false;
          break;
        }
      }
      
      if (match) {
        console.log('✅ Variante encontrada:', variant.title);
        return variant;
      }
    }
    
    console.log('❌ Nenhuma variante encontrada');
    return null;
  }
  
  // Função principal para processar mudança de variante
  function handleVariantChange() {
    console.log('🔄 Processando mudança de variante...');
    
    // Encontrar dados do produto
    var productJsonElement = document.querySelector('[id^="ProductJson-"]');
    if (!productJsonElement) {
      console.log('❌ JSON do produto não encontrado');
      return;
    }
    
    var sectionId = productJsonElement.id.replace('ProductJson-', '');
    var productData = JSON.parse(productJsonElement.innerHTML);
    console.log('📦 Produto carregado:', productData.title);
    
    // Coletar opções selecionadas de múltiplas formas
    var selectedOptions = [];
    
    // Método 1: Swatch (botões de rádio)
    var swatchInputs = document.querySelectorAll('.swatch input[type="radio"]:checked');
    if (swatchInputs.length > 0) {
      swatchInputs.forEach(function(input) {
        selectedOptions.push(input.value);
      });
      console.log('📋 Opções do swatch:', selectedOptions);
    }
    
    // Método 2: Selects tradicionais
    if (selectedOptions.length === 0) {
      var selects = document.querySelectorAll('.single-option-selector');
      selects.forEach(function(select) {
        selectedOptions.push(select.value);
      });
      console.log('📋 Opções dos selects:', selectedOptions);
    }
    
    // Método 3: Qualquer input/select com name contendo "option"
    if (selectedOptions.length === 0) {
      var optionInputs = document.querySelectorAll('input[name*="option"]:checked, select[name*="option"]');
      optionInputs.forEach(function(input) {
        selectedOptions.push(input.value);
      });
      console.log('📋 Opções genéricas:', selectedOptions);
    }
    
    // Se ainda não encontrou opções, usar a primeira variante
    if (selectedOptions.length === 0 && productData.variants.length > 0) {
      console.log('⚠️ Nenhuma opção encontrada, usando primeira variante');
      updatePrices(productData.variants[0], sectionId);
      return;
    }
    
    // Encontrar variante correspondente
    var selectedVariant = findVariant(productData, selectedOptions);
    
    if (selectedVariant) {
      // Atualizar select principal se existir
      var mainSelect = document.querySelector('select[name="id"]');
      if (mainSelect) {
        mainSelect.value = selectedVariant.id;
      }
      
      // Atualizar preços
      updatePrices(selectedVariant, sectionId);
    }
  }
  
  // Aguardar DOM carregar
  function init() {
    console.log('🎯 Inicializando variant price updater...');
    
    // Listener universal para mudanças
    document.addEventListener('change', function(e) {
      var target = e.target;
      
      // Verificar se é um elemento relacionado a variantes
      if (target.matches('.swatch input[type="radio"]') ||
          target.matches('.single-option-selector') ||
          target.matches('select[name*="option"]') ||
          target.matches('input[name*="option"]')) {
        
        console.log('🎯 Mudança detectada:', target.tagName, target.value);
        setTimeout(handleVariantChange, 100);
      }
    });
    
    // Listener para cliques em elementos que podem ser botões de variante
    document.addEventListener('click', function(e) {
      var target = e.target;
      
      // Verificar se clicou em algo que pode ser um botão de variante
      if (target.textContent && 
          (target.textContent.includes('ML') || 
           target.textContent.includes('ml') ||
           target.closest('.swatch') ||
           target.closest('.variant-option'))) {
        
        console.log('🖱️ Clique detectado em possível variante:', target.textContent);
        setTimeout(handleVariantChange, 200);
      }
    });
    
    // Debug e inicialização
    setTimeout(function() {
      console.log('=== 🔍 DEBUG INFO ===');
      console.log('Swatches:', document.querySelectorAll('.swatch').length);
      console.log('Selects:', document.querySelectorAll('.single-option-selector').length);
      console.log('Formulários:', document.querySelectorAll('form[data-product-id]').length);
      console.log('JSONs:', document.querySelectorAll('[id^="ProductJson-"]').length);
      console.log('Elementos com ML:', document.querySelectorAll('*').length);
      
      // Listar todos os elementos que contêm "ML"
      var mlElements = [];
      document.querySelectorAll('*').forEach(function(el) {
        if (el.textContent && el.textContent.includes('ML')) {
          mlElements.push(el.tagName + ': ' + el.textContent.trim());
        }
      });
      console.log('Elementos com ML encontrados:', mlElements);
      
      // Processar variante inicial
      handleVariantChange();
    }, 1500);
  }
  
  // Inicializar quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();