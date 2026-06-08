# assets/images — fotos reais (aguardando a cliente)

> **Status:** 🟡 vazio. O site está publicado com **placeholders** (blocos verde-musgo
> com ícone de câmera e o texto "Foto — aguardando cliente"). Substituir assim que a
> Lívia enviar o acervo. Nenhuma foto de banco de imagens foi usada.

## Fotos necessárias (por onde aparecem nos mockups)

| Arquivo sugerido | Onde é usado | Proporção / orientação |
|---|---|---|
| `hero-campo.webp` | Início — fundo do hero (LCP) | paisagem, ~16:9, ≥ 1920px de largura |
| `livia-retrato.webp` | Sobre — foto da Lívia | retrato, ~4:5 |
| `livia-faq.webp` | FAQ — coluna lateral | retrato, ~3:4 |
| `contato-ambiente.webp` | Contato — painel esquerdo (com overlay verde) | paisagem/retrato, ≥ 1200px |
| `segmentos-campo.webp` | Segmentos — faixa de números (com overlay verde) | paisagem, ≥ 1600px |
| `og-card.jpg` | **Imagem social** — `og:image` no `<head>` de **todas** as páginas | **1200×630 exatos** (paisagem) |

> As mesmas fotos podem ser reaproveitadas entre seções. Priorize a foto do **hero** e o
> **retrato da Lívia** — são as que mais pesam na identidade.

> **`og-card.jpg` (imagem de compartilhamento):** hoje o `og:image` aponta para o
> favicon 256² — ao compartilhar o link no WhatsApp/redes, aparece um ícone pequeno.
> Criar um card **1200×630** (logo + tagline sobre fundo verde, por ex.) e atualizar a
> tag `<meta property="og:image" ...>` nas 8 páginas. Recomendação da revisão técnica.

## Como substituir um placeholder

1. Exporte a imagem em **`.webp`** (qualidade ~80) e, opcionalmente, um `.jpg` de fallback.
2. Coloque o arquivo nesta pasta (`assets/images/`).
3. No HTML, troque o bloco placeholder…

   ```html
   <div class="ph-foto hero__ph">
     <i class="ph ph-camera" aria-hidden="true"></i>
     <span>Foto — aguardando cliente</span>
   </div>
   ```

   …por uma imagem real:

   ```html
   <img class="hero__ph" src="assets/images/hero-campo.webp"
        alt="Profissional em ambiente de trabalho seguro no campo"
        width="1920" height="1080" loading="eager" fetchpriority="high">
   ```

   - **Hero** (1ª dobra): use `loading="eager"` + `fetchpriority="high"`.
   - **Demais imagens** (abaixo da dobra): use `loading="lazy"`.
   - Sempre defina `width` e `height` (evita layout shift / CLS).
   - Escreva um `alt` descritivo e específico (acessibilidade + SEO).

4. Rode o sync com o Drive após substituir.
