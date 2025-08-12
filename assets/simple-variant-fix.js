// Fix simples e direto para atualização de preços das variantes
console.log('🔧 Simple Variant Fix carregado');

// Dados de exemplo das variantes (você pode ajustar conforme necessário)
var variantPrices = {
  '100 ML': 80000, // R$ 800,00 em centavos
  '3 ML': 15000,   // R$ 150,00 em centavos  
  '5 ML': 25000,   // R$ 250,00 em centavos
  '10 ML': 40000   // R$ 400,00 em centavos
};

// Função para formatar preço
function formatPrice(priceInCents) {
  return 'R$ ' + (priceInCents / 100).toFixed(2).replace('.', ',');
}

// Função para atualizar preço na tela
function updateDisplayPrice(newPrice) {
  console.log('💰 Atualizando preço para:', formatPrice(newPrice));
  
  // Buscar elemento de preço de várias formas
  var priceSelectors = [
    '.product-single__price span',
    '.product-price__price span',
    '#ProductPrice',
    '[id*="ProductPrice"]',
    '.price',
    '.money'
  ];
  
  for (var i = 0; i < priceSelectors.length; i++) {
    var elements = document.querySelectorAll(priceSelectors[i]);
    for (var j = 0; j < elements.length; j++) {
      var element = elements[j];
      if (element && element.textContent.includes('R$')) {
        element.textContent = formatPrice(newPrice);
        console.log('✅ Preço atualizado no elemento:', priceSelectors[i]);
        return true;
      }
    }
  }
  
  console.log('❌ Elemento de preço não encontrado');
  return false;
}

// Função para detectar variante selecionada
function detectSelectedVariant() {
  // Procurar por elementos que contenham os tamanhos
  var sizes = ['100 ML', '3 ML', '5 ML', '10 ML'];
  
  for (var i = 0; i < sizes.length; i++) {
    var size = sizes[i];
    
    // Procurar por elementos selecionados/ativos
    var selectors = [
      '*[class*="selected"]',
      '*[class*="active"]',
      '*[class*="current"]',
      'input:checked',
      'option:selected'
    ];
    
    for (var j = 0; j < selectors.length; j++) {
      var elements = document.querySelectorAll(selectors[j]);
      for (var k = 0; k < elements.length; k++) {
        var element = elements[k];
        if (element.textContent && element.textContent.includes(size)) {
          console.log('🎯 Variante detectada:', size);
          return size;
        }
      }
    }
  }
  
  // Se não encontrou nada, procurar por qualquer elemento com os tamanhos
  for (var i = 0; i < sizes.length; i++) {
    var size = sizes[i];
    var elements = document.querySelectorAll('*');
    
    for (var j = 0; j < elements.length; j++) {
      var element = elements[j];
      if (element.textContent && 
          element.textContent.trim() === size &&
          element.style.backgroundColor === 'black') {
        console.log('🎯 Variante detectada por cor:', size);
        return size;
      }
    }
  }
  
  console.log('⚠️ Nenhuma variante detectada, usando padrão');
  return '100 ML'; // Padrão
}

// Função principal
function handleVariantChange() {
  var selectedVariant = detectSelectedVariant();
  var newPrice = variantPrices[selectedVariant] || variantPrices['100 ML'];
  
  updateDisplayPrice(newPrice);
}

// Função para monitorar mudanças
function startMonitoring() {
  console.log('👀 Iniciando monitoramento...');
  
  // Listener para cliques em qualquer lugar
  document.addEventListener('click', function(e) {
    var target = e.target;
    var text = target.textContent;
    
    if (text && (text.includes('ML') || text.includes('ml'))) {
      console.log('🖱️ Clique detectado em:', text);
      setTimeout(handleVariantChange, 100);
    }
  });
  
  // Listener para mudanças em inputs
  document.addEventListener('change', function(e) {
    console.log('🔄 Mudança detectada');
    setTimeout(handleVariantChange, 100);
  });
  
  // Monitoramento por intervalo (fallback)
  setInterval(function() {
    var currentVariant = detectSelectedVariant();
    if (window.lastDetectedVariant !== currentVariant) {
      console.log('⏰ Mudança detectada por intervalo:', currentVariant);
      window.lastDetectedVariant = currentVariant;
      handleVariantChange();
    }
  }, 2000);
  
  // Processar estado inicial
  setTimeout(function() {
    console.log('🚀 Processando estado inicial...');
    handleVariantChange();
    
    // Debug: mostrar todos os elementos que contêm ML
    var mlElements = [];
    document.querySelectorAll('*').forEach(function(el) {
      if (el.textContent && el.textContent.includes('ML') && el.children.length === 0) {
        mlElements.push({
          text: el.textContent.trim(),
          tag: el.tagName,
          classes: el.className,
          style: el.style.cssText
        });
      }
    });
    console.log('📋 Elementos ML encontrados:', mlElements);
  }, 1000);
}

// Inicializar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startMonitoring);
} else {
  startMonitoring();
}

// Expor função globalmente para teste manual
window.testVariantUpdate = function(variant) {
  console.log('🧪 Teste manual para:', variant);
  var price = variantPrices[variant] || variantPrices['100 ML'];
  updateDisplayPrice(price);
};

console.log('💡 Para testar manualmente, use: testVariantUpdate("3 ML")');