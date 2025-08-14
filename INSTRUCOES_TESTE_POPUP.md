# 🔍 Instruções para Testar o Pop-up de Desconto no Mobile

## ⚠️ IMPORTANTE
O arquivo `snippets/discount_popup.liquid` foi temporariamente substituído por uma versão com logs de debug para identificar o problema.

## 📱 Como Testar no Mobile

### 1. Preparação
- Abra o site no navegador mobile (ou use as ferramentas de desenvolvedor para simular mobile)
- Certifique-se que o carrinho está vazio
- Abra o Console do navegador (F12 > Console)

### 2. Verificação dos Logs
No console, você verá logs detalhados como:
```
[POPUP DEBUG] === CONFIGURAÇÕES DO POPUP ===
[POPUP DEBUG] discount_popup_enable: true
[POPUP DEBUG] discount_popup_disable_mobile: false
[POPUP DEBUG] discount_popup_time: exit_popup
[POPUP DEBUG] item_count: 0
[POPUP DEBUG] Largura da tela: 375
```

### 3. Teste do Exit Popup (Mobile)
- **Para mobile (largura ≤ 749px)**: Saia da aba do navegador e volte
- **Para desktop (largura > 749px)**: Mova o mouse para fora da página pelo topo

### 4. O que Verificar nos Logs

#### ✅ Logs de Sucesso:
- `📱 Configurando para MOBILE (<=749px)`
- `Event listener adicionado: visibilitychange`
- `👁️ Evento visibilitychange disparado`
- `📱 Página ficou oculta (mobile exit)`
- `🎉 EXIBINDO POPUP MOBILE!`

#### ❌ Possíveis Problemas:
- `❌ Carrinho não está vazio (item_count=X)` - Esvazie o carrinho
- `❌ Popup já foi exibido (z=1)` - Limpe os cookies ou use aba anônima
- `❌ Condições não atendidas para exibir popup` - Verifique cookies

### 5. Limpeza de Cookies (se necessário)
No console do navegador, execute:
```javascript
// Limpar cookies do popup
document.cookie = "discount_popup_email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
document.cookie = "popup_one_time=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
document.cookie = "discount_popup=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
location.reload();
```

## 🔧 Possíveis Causas do Problema

### 1. Carrinho não vazio
- O pop-up só aparece quando `item_count == 0`
- Verifique se há itens no carrinho

### 2. Cookies já definidos
- Se `popup_one_time` existe, o pop-up não aparece novamente
- Se `discount_popup_email` está como 'no', o pop-up não aparece

### 3. Evento não suportado
- Alguns navegadores podem não suportar `visibilitychange`
- Verifique se o evento está sendo registrado nos logs

### 4. Largura da tela
- Verifique se a detecção de mobile está correta (≤ 749px)
- O evento usado é diferente para mobile e desktop

### 5. Configuração do tema
- `discount_popup_enable` deve ser `true`
- `discount_popup_disable_mobile` deve ser `false`
- `discount_popup_time` deve ser `exit_popup`

## 🔄 Restaurar Arquivo Original
Após o teste, restaure o arquivo original:
```bash
cp snippets/discount_popup_original.liquid snippets/discount_popup.liquid
```

## 📞 Relatório de Problemas
Se o pop-up ainda não funcionar, anote:
1. Todos os logs do console
2. Largura da tela detectada
3. Valores dos cookies
4. Se o evento `visibilitychange` está sendo disparado
5. Modelo do dispositivo/navegador usado

---

**Nota**: Esta versão de debug adiciona logs detalhados mas mantém toda a funcionalidade original do pop-up.