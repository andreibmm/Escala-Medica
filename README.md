# 🏥 Escala Médica Interativa

Este é um sistema interativo de escala médica em formato de calendário. O objetivo é facilitar a organização de plantões médicos com interface intuitiva, definição de turnos, vínculos e exportação dos dados em Excel.

## 🚀 Funcionalidades

- Seleção de mês e ano para montar a escala.
- Cores personalizadas para turnos:
  - ⚪ Branco: sem médico.
  - 🔵 Azul: plantão apenas diurno.
  - 🟡 Amarelo: plantão apenas noturno.
  - 🟣 Rosa: plantão eletiva.
  - 🟠 Laranja: dois turnos preenchidos (ex: diurno + noturno).
  - 🟢 Verde: todos os turnos preenchidos.
- Cadastro de médicos com vínculo ("Efetivo" ou "Particular").
- Definição de plantões para múltiplos dias com um único clique.
- Cálculo automático de valores conforme o tipo de vínculo e fim de semana.
- Exportação da escala completa em formato `.xlsx`.

## 💰 Regras de Valor

- Médicos com vínculo **Efetivo**: R$ 1000 (valor fixo).
- Médicos com vínculo **SPM**:
  - Dias úteis: R$ 1375
  - Fins de semana (sábado/domingo): R$ 1500
- Eletivas:
  - Efetivo: R$ 1000
  - SPM: R$ 1800

## 📦 Exportação

A planilha gerada contém as colunas:

- `Data`
- `Turno` (Diurno, Noturno, Eletiva)
- `Médico`
- `Vínculo`
- `Valor`

## 🛠 Como usar

1. Abra o arquivo `index.html` em qualquer navegador moderno.
2. Cadastre os médicos informando nome e vínculo.
3. Selecione os dias desejados no calendário.
4. Escolha o médico e o turno (diurno, noturno ou eletiva) e clique em **Aplicar**.
5. Para remover um plantão, basta usar o botão **Limpar todos os plantões** ou selecionar individualmente.
6. Exporte a escala para Excel clicando em **Exportar para Excel**.

## 📋 Tecnologias utilizadas

<div>
  <img src="https://img.shields.io/badge/HTML-239120?style=for-the-badge&logo=html5&logoColor=white">
  <img src="https://img.shields.io/badge/CSS-239120?&style=for-the-badge&logo=css3&logoColor=white">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
</div>
- [SheetJS (xlsx)](https://github.com/SheetJS/sheetjs) para exportação em Excel

## 👨‍⚕️ Contribuição

Sinta-se livre para sugerir melhorias, corrigir bugs ou adaptar este sistema para sua realidade.

---

🧠 Projeto idealizado para fins administrativos de controle de escalas médicas.
