# Pré-voo — Criação do ambiente de homologação GSEG

Registro de segurança feito **antes** de qualquer alteração de escrita (push/remote), conforme protocolo do prompt operacional `PROMPT_HOMOLOGACAO_GSEG_FINAL.md`.

Repositório oficial: https://github.com/riarleydias/gseg-site.git
Remote oficial: `origin` (fetch/push) — https://github.com/riarleydias/gseg-site.git
Branch oficial local: `main` — limpa, sincronizada com `origin/main`
Commit oficial atual: `3ca6b06` (Merge feature/gseg-beneficios-sobre-refinamento)

**GitHub Pages oficial (achado crítico):** publica a partir da branch `codex/gseg-mobile`, **não** de `main` — confirmado via `gh api repos/riarleydias/gseg-site/pages`:

```
url: https://api.github.com/repos/riarleydias/gseg-site/pages
status: built
cname: null
custom_404: true
build_type: legacy
source.branch: codex/gseg-mobile
source.path: /
public: true
```

URL oficial publicada: https://riarleydias.github.io/gseg-site/
Branch local refinada: `refactor/gseg-refinamento-visual` (commit `668e3da` no início desta operação)
Worktree refinado: `C:\trabalho\entregaveis\clientes\gseg\site-worktrees\home-refinamento`

Estado do worktree refinado antes desta operação:
- Modificados (não commitados): `css/refinamento-home.css`, `index.html`
- Novos (não rastreados): `assets/images/refinement/backgrounds/gseg-cta-atmosfera-1600-v02.png`, `assets/images/refinement/backgrounds/gseg-cta-atmosfera-mobile-1024-v02.png`, `assets/images/refinement/segments/gseg-seg-agroindustrias-800-v02.png`, `assets/images/refinement/segments/gseg-seg-empresas-800-v02.png`, `assets/images/refinement/segments/gseg-seg-fazendas-800-v02.png`, `assets/images/refinement/segments/gseg-seg-industrias-800-v02.jpg`

Remotes existentes no worktree antes desta operação: só `origin`. Nenhum remote `homologacao` pré-existente.

Verificações de segurança já feitas:
- `CNAME`: ausente em todo o worktree (busca recursiva, fora de `.git/`).
- `access_key` do Web3Forms em `contato.html`: placeholder `[CHAVE_WEB3FORMS]`, nenhuma chave real exposta.
- `robots.txt` atual do worktree: orientado a produção (`Allow: /`, referenciando `gsegengenharia.com.br`) — será sobrescrito **só na branch de homologação**.
- Nenhuma das 8 páginas HTML (`404, beneficios, contato, faq, index, segmentos, servicos, sobre`) tem tag `noindex` hoje.
- `gh auth status`: autenticado como `riarleydias`, conta pessoal (não organização).
- Nome `gseg-site-homologacao` disponível no GitHub (confirmado — repo inexistente).

Data da operação: 2026-07-16
Responsável: Coordenador técnico (execução via Claude Code, a pedido do Riarley)
