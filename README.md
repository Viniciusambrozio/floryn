# 🌸 Floryn - Tema Shopify

Tema Shopify moderno e responsivo com funcionalidades avançadas de e-commerce, incluindo barra de progresso de frete grátis e interface otimizada para conversão.

## 🚀 Funcionalidades Principais

### 🛒 Carrinho Inteligente
- **Barra de Progresso de Frete Grátis**: Incentiva compras maiores com feedback visual em tempo real
- **Interface Responsiva**: Experiência otimizada para todos os dispositivos
- **Atualização Dinâmica**: JavaScript vanilla para performance máxima

### 🌍 Suporte Multilíngue
Suporte completo para 11 idiomas:
- Português (Brasil) - `pt-BR`
- Português (Portugal) - `pt-PT`
- Português - `pt`
- Inglês - `en.default`
- Espanhol - `es`
- Francês - `fr`
- Alemão - `de`
- Italiano - `it`
- Holandês - `nl`
- Dinamarquês - `da`
- Japonês - `ja`

## 📁 Estrutura do Projeto

```
floryn-main/
├── assets/                 # Arquivos CSS, JS e imagens
│   ├── cart-custom.css    # Estilos específicos do carrinho
│   ├── cart-custom.js     # Lógica do carrinho e frete grátis
│   └── ...
├── config/                # Configurações do tema
├── layout/                # Templates de layout
├── locales/              # Arquivos de tradução
│   ├── pt-BR.json        # Português brasileiro (principal)
│   ├── en.default.json   # Inglês (padrão)
│   └── ...
├── sections/             # Seções do tema
│   ├── cart-template.liquid  # Template do carrinho
│   └── ...
├── snippets/             # Snippets reutilizáveis
├── templates/            # Templates de páginas
├── CHANGELOG.md          # Histórico de mudanças
└── README.md            # Este arquivo
```

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Shopify Liquid**: Template engine nativo do Shopify
- **CSS3**: Estilos modernos com Flexbox e Grid
- **JavaScript ES5+**: Compatível com IE11+
- **SCSS**: Pré-processador CSS (arquivos .scss.liquid)

### Dependências
- **Shopify Theme Kit**: Para desenvolvimento local
- **Git**: Controle de versão
- **Navegadores Suportados**: IE11+, Chrome, Firefox, Safari, Edge

## 🚀 Instalação e Configuração

### Pré-requisitos
- Conta Shopify com acesso de desenvolvedor
- Node.js 14+ (para ferramentas de desenvolvimento)
- Git instalado
- Shopify CLI ou Theme Kit

### Instalação

1. **Clone o repositório**:
```bash
git clone https://github.com/Viniciusambrozio/floryn.git
cd floryn
```

2. **Configure o Shopify CLI**:
```bash
shopify theme dev
```

3. **Ou use o Theme Kit**:
```bash
theme watch --allow-live
```

## ⚙️ Configuração da Barra de Frete Grátis

### Personalização do Limite
Para alterar o valor do frete grátis, edite o arquivo `assets/cart-custom.js`:

```javascript
// Linha ~45
const freeShippingThreshold = 30000; // R$ 300,00 em centavos
```

### Traduções
As mensagens da barra de progresso estão em `locales/pt-BR.json`:

```json
"free_shipping_progress": {
  "remaining": "Faltam {{amount}} para o frete grátis!",
  "achieved": "🎉 Você ganhou frete grátis!",
  "goal_label": "Meta: {{amount}}",
  "progress_label": "Progresso do frete grátis"
}
```

## 🎨 Customização de Estilos

### CSS do Carrinho
Os estilos da barra de progresso estão em `assets/cart-custom.css`:

```css
.cart__free-shipping-progress {
  /* Estilos personalizáveis */
}

.progress-bar {
  /* Barra de progresso */
}
```

## 📱 Responsividade

O tema é totalmente responsivo com breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Desenvolvimento

### Estrutura de Arquivos Importantes

**Template do Carrinho** (`sections/cart-template.liquid`):
- Estrutura HTML do carrinho
- Integração com a barra de progresso
- Lógica Liquid para cálculos

**JavaScript** (`assets/cart-custom.js`):
- Polyfills para IE11
- Função `updateFreeShippingProgress()`
- Event listeners para atualizações

**CSS** (`assets/cart-custom.css`):
- Estilos da barra de progresso
- Animações e transições
- Responsividade

### Boas Práticas
- Use sempre `{{ 'string' | t }}` para textos traduzíveis
- Mantenha JavaScript vanilla para performance
- Teste em múltiplos dispositivos e navegadores
- Valide HTML e CSS regularmente

## 🐛 Solução de Problemas

### Problemas Comuns

**Barra de progresso não aparece**:
- Verifique se `cart-custom.css` e `cart-custom.js` estão incluídos
- Confirme se as traduções estão no arquivo de locale correto

**JavaScript não funciona**:
- Verifique console do navegador para erros
- Confirme compatibilidade com IE11 se necessário

**Estilos não aplicados**:
- Limpe cache do navegador
- Verifique se arquivos CSS estão sendo carregados

## 📊 Performance

### Otimizações Implementadas
- JavaScript vanilla (sem jQuery)
- CSS otimizado com seletores eficientes
- Lazy loading para imagens
- Minificação automática pelo Shopify

## 🔒 Segurança

- Validação de entrada no frontend e backend
- Sanitização de dados do usuário
- HTTPS obrigatório
- Conformidade com GDPR/LGPD

## 📈 Versioning

Usamos [Semantic Versioning](https://semver.org/) para versionamento. Para versões disponíveis, veja as [tags neste repositório](https://github.com/Viniciusambrozio/floryn/tags).

## 👥 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

- **GitHub Issues**: [Reportar problemas](https://github.com/Viniciusambrozio/floryn/issues)
- **Documentação**: Este README e `CHANGELOG.md`
- **Shopify Partners**: [Documentação oficial](https://shopify.dev/themes)

---

**Desenvolvido com ❤️ para a plataforma Shopify**