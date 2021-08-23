## Como buildar

- Execute ```npm install``` para instalar as dependências
- Verifique se a pasta dist ainda não foi criada
  - Se foi criada delete usando ```npm run clean```
- Rode ```npm run build``` para criar a pasta de destino.

**Obs.: O game não funciona se não for hospedado devido ao fetch do mapa, então após buildar é necessário rodar um live-server dentro da pasta dist/client ou jogar a pasta dentro de um servidor apache, nginx tanto faz...**

### TODO:
- Criar gulp para desenvolvimento
- melhorar colisao
- multiplayer
- chat
- desenhar as sprites proprias
- teleports
- player events
- monsters & npcs
- itens
- batalha

