# Relatório — Criação do Ambiente de Homologação GSEG

Data: 2026-07-16

## 1. Resumo da operação

Criado um ambiente de homologação independente para revisão do refinamento visual do site da GSEG, publicado em um segundo link do GitHub Pages, sem qualquer alteração no repositório, branch ou Pages já entregues à cliente (Lívia Poliane).

## 2. Repositório oficial

`riarleydias/gseg-site` — https://github.com/riarleydias/gseg-site

## 3. Commit oficial preservado

`3ca6b06002868e3258ff52d4f959d74e9e48912e` (branch `main`) — inalterado do início ao fim da operação.

**Achado relevante do diagnóstico:** o GitHub Pages oficial não publica a partir de `main`, e sim da branch `codex/gseg-mobile`. Essa é a branch que efetivamente está no ar para a cliente; foi tratada com o mesmo cuidado (nenhum comando de escrita a tocou).

## 4. URL oficial preservada

https://riarleydias.github.io/gseg-site/ — `status: built`, `cname: null`, `source.branch: codex/gseg-mobile` (idêntico ao capturado no pré-voo).

## 5. Repositório de homologação criado

`riarleydias/gseg-site-homologacao` — https://github.com/riarleydias/gseg-site-homologacao (público, criado vazio via `gh repo create`, sem README/gitignore/license automáticos).

## 6. Remote adicionado

`homologacao` → `https://github.com/riarleydias/gseg-site-homologacao.git`, adicionado no worktree `site-worktrees/home-refinamento`. `origin` permaneceu apontando para `gseg-site` o tempo todo.

## 7. Branch publicada

`main` (no repositório de homologação), criada a partir do push de `homologacao/publicacao-inicial` local.

## 8. Commit publicado

`da7ca1042f150b6b4ac64bc9cd946de2e871a974` — "chore: preparar versão de homologação do refinamento visual GSEG".

Histórico local relevante (worktree, branch `refactor/gseg-refinamento-visual`): commit adicional `f927dbd` persistiu o refinamento pendente (CSS/HTML/imagens v02) que já estava no worktree antes desta operação — permanece **só local**, não foi enviado a `origin` nem a `homologacao` diretamente (a branch de homologação foi criada a partir dele, mas com commit próprio por cima).

## 9. URL de homologação

https://riarleydias.github.io/gseg-site-homologacao/

## 10. Configuração do GitHub Pages

Ativado via API (`POST /repos/riarleydias/gseg-site-homologacao/pages`), `build_type: legacy`, `source.branch: main`, `source.path: /`. Status final: `built`.

## 11. Confirmação: ausência de CNAME

Confirmado — `git ls-tree` da branch publicada não retorna nenhum arquivo `CNAME`. Salvaguarda adicional: `CNAME` incluído no `.gitignore` (só na branch de homologação).

## 12. Confirmação: noindex em todas as páginas + robots.txt ativo

Confirmado nas 8 páginas (`404, beneficios, contato, faq, index, segmentos, servicos, sobre`) — todas contêm `<meta name="robots" content="noindex, nofollow">` no `<head>`, verificado diretamente no conteúdo do commit publicado (`git show homologacao/publicacao-inicial:<arquivo>`). `robots.txt` publicado contém `User-agent: * / Disallow: /`.

## 13. Confirmação: ausência de chave real do Web3Forms

Confirmado — `contato.html` publicado mantém o placeholder `[CHAVE_WEB3FORMS]`. Nenhuma chave real foi manuseada ou exposta nesta operação.

## 14. Testes básicos executados

- `gh api .../pages` → `status: built` nos dois repositórios, sem mudança na configuração oficial.
- Captura visual via protocolo Eyes (Playwright CLI) da nova URL em dois breakpoints — evidências em `docs/homologacao/evidencias/home-desktop.png` (1280×900) e `home-mobile.png` (375×812). Header, hero, CTAs, WhatsApp flutuante, tipografia e imagem de fundo carregaram corretamente nos dois formatos, sem quebra visual aparente.
- Não foi submetido nenhum dado real pelo formulário de contato (chave é placeholder, não haveria envio de qualquer forma).

## 15. Problemas encontrados

Nenhum bloqueador. Único ponto de atenção (não é um problema desta operação, é uma observação para o próximo passo): a branch oficialmente publicada é `codex/gseg-mobile`, não `main` — relevante para quando a homologação for promovida a produção, o destino correto do merge precisa ser essa branch, não `main`.

## 16. Confirmação de independência

- `git log --oneline -1` do repositório oficial: ainda `3ca6b06`, sem novos commits.
- `gh api repos/riarleydias/gseg-site/pages` idêntico ao capturado no pré-voo.
- `git ls-remote origin` (refs/heads/main) = `3ca6b06...`; `git ls-remote homologacao` (refs/heads/main) = `da7ca104...` — hashes distintos, ambientes seguem trilhas independentes.
- Nenhuma automação, workflow ou webhook criado entre os dois repositórios.

## 17. Próximos passos

- Riarley revisar visualmente https://riarleydias.github.io/gseg-site-homologacao/ e decidir o que do refinamento visual vai para produção.
- Quando aprovado: promoção manual e auditada — mesclar/portar as mudanças aprovadas para a branch real de produção (`codex/gseg-mobile`, não `main`), com chave real do Web3Forms e sem herdar o `noindex`/`robots.txt` de bloqueio.
- Avaliar consolidar em algum momento qual branch (`main` vs `codex/gseg-mobile`) deve ser a fonte de verdade do repositório oficial, para evitar confusão futura — só registro, nenhuma ação tomada agora.
