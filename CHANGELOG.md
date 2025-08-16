# Changelog - Tema Floryn Shopify

## [1.1.0] - 2025-01-17

### ✨ Melhorias Implementadas

#### 🛒 Carrinho de Compras
- **Barra de Progresso de Frete Grátis**: Implementada barra de progresso dinâmica que mostra o valor restante para alcançar o frete grátis (R$ 300,00)
- **Feedback Visual**: Mensagens dinâmicas informando o valor restante ou confirmação quando o frete grátis é alcançado
- **Responsividade**: Interface totalmente responsiva para dispositivos móveis e desktop

#### 🧹 Limpeza de Código
- **Remoção de Chaves de Tradução Não Utilizadas**:
  - Removida chave `shipping_at_checkout` de todos os arquivos de localização (11 idiomas)
  - Removida chave `free_shipping_discount_label` do arquivo pt-BR
  - Melhoria na manutenibilidade do código

#### 📁 Arquivos Modificados

**Templates:**
- `sections/cart-template.liquid` - Implementação da barra de progresso de frete grátis

**Estilos:**
- `assets/cart-custom.css` - Estilos específicos para a barra de progresso

**JavaScript:**
- `assets/cart-custom.js` - Lógica de atualização dinâmica da barra de progresso

**Localizações (11 arquivos):**
- `locales/pt-BR.json` - Adicionadas traduções para frete grátis + limpeza
- `locales/da.json` - Limpeza de chaves não utilizadas
- `locales/de.json` - Limpeza de chaves não utilizadas
- `locales/en.default.json` - Limpeza de chaves não utilizadas
- `locales/es.json` - Limpeza de chaves não utilizadas
- `locales/fr.json` - Limpeza de chaves não utilizadas
- `locales/it.json` - Limpeza de chaves não utilizadas
- `locales/ja.json` - Limpeza de chaves não utilizadas
- `locales/nl.json` - Limpeza de chaves não utilizadas
- `locales/pt-PT.json` - Limpeza de chaves não utilizadas
- `locales/pt.json` - Limpeza de chaves não utilizadas

#### 🔧 Funcionalidades Técnicas

**Barra de Progresso de Frete Grátis:**
- Limite configurável (atualmente R$ 300,00)
- Atualização em tempo real baseada no total do carrinho
- Compatibilidade com IE11 (polyfills incluídos)
- Mensagens contextuais em português brasileiro

**Traduções Implementadas:**
```json
"free_shipping_progress": {
  "remaining": "Faltam {{amount}} para o frete grátis!",
  "achieved": "🎉 Você ganhou frete grátis!",
  "goal_label": "Meta: {{amount}}",
  "progress_label": "Progresso do frete grátis"
}
```

#### 🎯 Benefícios
- **UX Melhorada**: Incentiva compras maiores através do feedback visual
- **Código Limpo**: Remoção de elementos não utilizados melhora a performance
- **Manutenibilidade**: Código organizado e bem documentado
- **Escalabilidade**: Estrutura preparada para futuras expansões

---

### 📝 Notas de Desenvolvimento
- Todas as mudanças foram testadas e validadas
- Compatibilidade mantida com versões anteriores
- Código segue as melhores práticas do Shopify Liquid
- Implementação responsiva e acessível

### 🔗 Repositório
- **GitHub**: https://github.com/Viniciusambrozio/floryn.git
- **Branch**: main
- **Commit**: fe58285 - feat: Remove unused translation keys from locale files