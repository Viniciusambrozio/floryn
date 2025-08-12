// Script específico para atualizar preços das variantes
(function() {
  'use strict';
  
  console.log('Variant Price Updater carregado');
  
  // Função para formatar preço em Real brasileiro
  function formatPrice(price) {
    return 'R$ ' + (price / 100).toFixed(2).replace('.', ',');
  }
  
  // Função para atualizar preços na tela
  function updatePrices(variant, sectionId) {
    console.log('Atualizando preços para variante:', variant);
    
    // Atualizar preço principal
    var priceElement = document.getElementById('ProductPrice-' + sectionId);
    if (priceElement) {
      priceElement.innerHTML = formatPrice(variant.price);
      console.log('Preço principal atualizado:', formatPrice(variant.price));
    }
    
    // Atualizar preço comparativo
    var comparePriceElement = document.getElementById('ComparePrice-' + sectionId);
    if (comparePriceElement) {
      if (variant.compare_at_price && variant.compare_at_price > variant.price) {
        comparePriceElement.innerHTML = formatPrice(variant.compare_at_price);
        comparePriceElement.style.display = 'inline';
        console.log('Preço comparativo atualizado:', formatPrice(variant.compare_at_price));
      } else {
        comparePriceElement.style.display = 'none';
      }
    }
    
    // Atualizar botão de adicionar ao carrinho
    var addButton = document.getElementById('AddToCart');
    if (addButton) {
      if (variant.available) {
        addButton.disabled = false;
        addButton.innerHTML = addButton.innerHTML.replace(/Esgotado|Sold Out/gi, 'Adicionar ao carrinho');
      } else {
        addButton.disabled = true;
        addButton.innerHTML = addButton.innerHTML.replace(/Adicionar ao carrinho|Add to cart/gi, 'Esgotado');
      }
    }
  }
  
  // Função para encontrar variante baseada nas opções
  function findVariant(productData, selectedOptions) {
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
        return variant;
      }
    }
    return null;
  }
  
  // Função principal para processar mudança de variante
  function handleVariantChange() {
    console.log('Processando mudança de variante...');
    
    // Encontrar o formulário do produto
    var productForm = document.querySelector('form[data-product-id]');
    if (!productForm) {
      console.log('Formulário do produto não encontrado');
      return;
    }
    
    var sectionId = productForm.getAttribute('data-section');
    if (!sectionId) {
      console.log('Section ID não encontrado');
      return;
    }
    
    // Obter dados do produto
    var productJsonElement = document.getElementById('ProductJson-' + sectionId);
    if (!productJsonElement) {
      console.log('JSON do produto não encontrado');
      return;
    }
    
    var productData = JSON.parse(productJsonElement.innerHTML);
    console.log('Dados do produto carregados:', productData.title);
    
    // Coletar opções selecionadas
    var selectedOptions = [];
    
    // Verificar swatch (botões de rádio)
    var swatchInputs = document.querySelectorAll('.swatch input[type="radio"]:checked');
    if (swatchInputs.length > 0) {
      swatchInputs.forEach(function(input) {
        selectedOptions.push(input.value);
      });
      console.log('Opções do swatch:', selectedOptions);
    } else {
      // Fallback para selects
      var selects = productForm.querySelectorAll('.single-option-selector');
      selects.forEach(function(select) {
        selectedOptions.push(select.value);
      });
      console.log('Opções dos selects:', selectedOptions);
    }
    
    // Encontrar variante correspondente
    var selectedVariant = findVariant(productData, selectedOptions);
    
    if (selectedVariant) {
      console.log('Variante encontrada:', selectedVariant.title, selectedVariant.price);
      
      // Atualizar select principal
      var mainSelect = productForm.querySelector('select[name="id"]');
      if (mainSelect) {
        mainSelect.value = selectedVariant.id;
      }
      
      // Atualizar preços
      updatePrices(selectedVariant, sectionId);
    } else {
      console.log('Variante não encontrada para as opções:', selectedOptions);
    }
  }
  
  // Aguardar DOM carregar
  function init() {
    console.log('Inicializando variant price updater...');
    
    // Listener para swatch
    document.addEventListener('change', function(e) {
      if (e.target.matches('.swatch input[type="radio"]')) {
        console.log('Swatch mudou:', e.target.value);
        setTimeout(handleVariantChange, 100);
      }
    });
    
    // Listener para selects
    document.addEventListener('change', function(e) {
      if (e.target.matches('.single-option-selector')) {
        console.log('Select mudou:', e.target.value);
        setTimeout(handleVariantChange, 100);
      }
    });
    
    // Debug inicial
    setTimeout(function() {
      console.log('=== DEBUG INFO ===');
      console.log('Swatches encontrados:', document.querySelectorAll('.swatch').length);
      console.log('Selects encontrados:', document.querySelectorAll('.single-option-selector').length);
      console.log('Formulários encontrados:', document.querySelectorAll('form[data-product-id]').length);
      console.log('JSONs encontrados:', document.querySelectorAll('[id^="ProductJson-"]').length);
      
      // Tentar processar variante inicial
      handleVariantChange();
    }, 1000);
  }
  
  // Inicializar quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();