const nomesDias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const nomesMes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

//Inserir os médicos e vínculos. 

const medicos = [];

const plantoesManuais = {};
let diasSelecionados = [];

function atualizarCores(td, dataStr) {
  td.classList.remove('branco', 'azul', 'amarelo', 'verde', 'rosa', 'laranja', 'selected');
  const pl = plantoesManuais[dataStr];

  const temDiurno = pl?.diurno ? 1 : 0;
  const temNoturno = pl?.noturno ? 1 : 0;
  const temEletiva = pl?.eletiva ? 1 : 0;

  const total = temDiurno + temNoturno + temEletiva;

  if (total === 0) {
    td.classList.add('branco');
  } else if (total === 1) {
    if (temDiurno) td.classList.add('azul');
    else if (temNoturno) td.classList.add('amarelo');
    else if (temEletiva) td.classList.add('rosa');
  } else if (total === 2) {
    td.classList.add('laranja');
  } else if (total === 3) {
    td.classList.add('verde');
  }
}


function renderizarCalendario() {
  const mes = parseInt(document.getElementById('mes').value);
  const ano = parseInt(document.getElementById('ano').value);
  const primeiroDia = new Date(ano, mes, 1);
  const ultimoDia = new Date(ano, mes + 1, 0);
  const calendario = document.getElementById('calendario');
  calendario.innerHTML = '';

  diasSelecionados = [];

  const header = document.createElement('tr');
  nomesDias.forEach(d => {
    const th = document.createElement('th');
    th.innerText = d;
    header.appendChild(th);
  });
  calendario.appendChild(header);

  let tr = document.createElement('tr');
  for (let i = 0; i < primeiroDia.getDay(); i++) {
    tr.appendChild(document.createElement('td'));
  }

  for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
    const data = new Date(ano, mes, dia);
    const dataStr = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    const td = document.createElement('td');
    td.setAttribute('data-dia', dataStr);
    td.onclick = () => selecionarDia(td);

    // Atualiza a cor do dia
    atualizarCores(td, dataStr);

    // Preenche o número do dia e os médicos atribuídos
    td.innerHTML = `<strong>${dia}</strong>`;
    const pl = plantoesManuais[dataStr];
    if (pl) {
      if (pl.diurno) td.innerHTML += `<div class="plantao-info">D: ${pl.diurno}</div>`;
      if (pl.noturno) td.innerHTML += `<div class="plantao-info">N: ${pl.noturno}</div>`;
      if (pl.eletiva) td.innerHTML += `<div class="plantao-info">E: ${pl.eletiva}</div>`;
    }

    tr.appendChild(td);

    if (data.getDay() === 6) {
      calendario.appendChild(tr);
      tr = document.createElement('tr');
    }
  }

  if (tr.children.length > 0) {
    calendario.appendChild(tr);
  }

  atualizarSelectMedicoGlobal();
}


function atualizarSelectMedicoGlobal() {
  const sel = document.getElementById('medico-global');
  sel.innerHTML = '<option value="">-- Escolha o médico --</option>';
  medicos.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m.nome;
    opt.innerText = `${m.nome} (${m.vinculo})`;
    sel.appendChild(opt);
  });
}


function selecionarDia(td) {
  const dataStr = td.getAttribute('data-dia');
  const index = diasSelecionados.indexOf(dataStr);
  if (index === -1) {
    diasSelecionados.push(dataStr);
    td.classList.add('selected');
  } else {
    diasSelecionados.splice(index, 1);
    td.classList.remove('selected');
  }
}

function aplicarSelecao() {
  const medico = document.getElementById('medico-global').value;
  const turno = document.getElementById('turno-global').value;

  if (!medico || !turno) {
    alert("Selecione um médico e um turno.");
    return;
  }

  diasSelecionados.forEach(dataStr => {
    if (!plantoesManuais[dataStr]) plantoesManuais[dataStr] = {};
    plantoesManuais[dataStr][turno] = medico;

    const td = document.querySelector(`td[data-dia='${dataStr}']`);
    if (td) {
      atualizarCores(td, dataStr);

      // Atualiza o conteúdo do dia com nomes dos médicos
      const dia = parseInt(dataStr.split('-')[2], 10);
      td.innerHTML = `<strong>${dia}</strong>`;

      const pl = plantoesManuais[dataStr];
      if (pl) {
        if (pl.diurno) td.innerHTML += `<div class="plantao-info">D: ${pl.diurno}</div>`;
        if (pl.noturno) td.innerHTML += `<div class="plantao-info">N: ${pl.noturno}</div>`;
        if (pl.eletiva) td.innerHTML += `<div class="plantao-info">E: ${pl.eletiva}</div>`;
      }

      td.classList.remove('selected');
    }
  });

  diasSelecionados = [];
}


function limparSelecao() {
  diasSelecionados.forEach(dataStr => {
    // Remove os plantões daquele dia (se houver)
    delete plantoesManuais[dataStr];

    // Atualiza visualmente a célula
    const td = document.querySelector(`td[data-dia='${dataStr}']`);
    if (td) {
      td.classList.remove('selected');
      td.innerHTML = `<strong>${parseInt(dataStr.split('-')[2], 10)}</strong>`;
      atualizarCores(td, dataStr);
    }
  });

  diasSelecionados = [];
}



function limparTodosPlantoes() {
  for (const dataStr in plantoesManuais) {
    delete plantoesManuais[dataStr];
  }
  diasSelecionados = [];
  renderizarCalendario();
}


function adicionarMedico() {
  const nome = document.getElementById('nome-medico').value.trim();
  const vinculo = document.getElementById('vinculo-medico').value;

  if (!nome || !vinculo) {
    alert("Preencha o nome e selecione o vínculo.");
    return;
  }

  if (medicos.find(m => m.nome === nome && m.vinculo === vinculo)) {
    alert("Esse médico já está cadastrado com esse vínculo.");
    return;
  }

  medicos.push({ nome, vinculo});
  atualizarSelectMedicoGlobal();
  atualizarListaMedicos();
  document.getElementById('nome-medico').value = '';
  document.getElementById('vinculo-medico').value = '';
  alert("Médico adicionado com sucesso!");
}



function atualizarListaMedicos() {
  const ul = document.getElementById('medicos-ul');
  ul.innerHTML = '';

  medicos.forEach((medico, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${medico.nome} (${medico.vinculo})
      <button onclick="removerMedico(${index})">Remover</button>
    `;
    ul.appendChild(li);
  });
}

function removerMedico(index) {
  const confirmacao = confirm(`Deseja remover ${medicos[index].nome}?`);
  if (!confirmacao) return;

  medicos.splice(index, 1);
  atualizarListaMedicos();
  atualizarSelectMedicoGlobal();
}




// Pode alterar o valor do plantão aqui 

function exportarExcel() {
  const wb = XLSX.utils.book_new();
  const data = [['Data', 'Turno', 'Médico', 'Vínculo', 'Valor']];
  const valorSemana = 1375;
  const valorFimDeSemana = 1500;

  const ordemTurno = { 'Diurno': 1, 'Noturno': 2, 'Eletiva': 3 };

  for (const dataStr in plantoesManuais) {
    const entry = plantoesManuais[dataStr];
    const [ano, mes, dia] = dataStr.split('-').map(Number);
    const diaDaSemana = new Date(ano, mes - 1, dia).getDay();
    const fimDeSemana = diaDaSemana === 0 || diaDaSemana === 6;
    const dataFormatada = `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`;

    if (entry.diurno) {
      const medico = medicos.find(m => m.nome === entry.diurno);
      const valor = medico?.vinculo === 'Efetivo' ? 0 : (fimDeSemana ? valorFimDeSemana : valorSemana);
      data.push([dataFormatada, 'Diurno', entry.diurno, medico?.vinculo || '', valor]);
    }

    if (entry.noturno) {
      const medico = medicos.find(m => m.nome === entry.noturno);
      const valor = medico?.vinculo === 'Efetivo' ? 0 : (fimDeSemana ? valorFimDeSemana : valorSemana);
      data.push([dataFormatada, 'Noturno', entry.noturno, medico?.vinculo || '', valor]);
    }

    if (entry.eletiva) {
      const medico = medicos.find(m => m.nome === entry.eletiva);
      const valor = medico?.vinculo === 'Efetivo' ? 0 : 1800;
      data.push([dataFormatada, 'Eletiva', entry.eletiva, medico?.vinculo || '', valor]);
    }
  }

  const dadosOrdenados = data.slice(1).sort((a, b) => {
    const [diaA, mesA, anoA] = a[0].split('/').map(Number);
    const [diaB, mesB, anoB] = b[0].split('/').map(Number);
    const dateA = new Date(anoA, mesA - 1, diaA);
    const dateB = new Date(anoB, mesB - 1, diaB);
    if (dateA.getTime() !== dateB.getTime()) return dateA - dateB;
    return ordemTurno[a[1]] - ordemTurno[b[1]];
  });

  const wsDados = XLSX.utils.aoa_to_sheet([data[0], ...dadosOrdenados]);
  XLSX.utils.book_append_sheet(wb, wsDados, 'Escala');

  function gerarCalendario(mes, ano, titulo, incluirEletivas = false) {
  const ws = XLSX.utils.aoa_to_sheet([]);
  XLSX.utils.sheet_add_aoa(ws, [[`${nomesMes[mes]} / ${ano}`]], { origin: -1 });
  XLSX.utils.sheet_add_aoa(ws, [[``]], { origin: -1 });
  XLSX.utils.sheet_add_aoa(ws, [['Horário', 'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']], { origin: -1 });

  const ultimaData = new Date(ano, mes + 1, 0);
  let diaAtual = new Date(ano, mes, 1);

  while (diaAtual <= ultimaData) {
    const linhaDias = [''];
    const semana = [];

    const offset = diaAtual.getDay(); // dia da semana do primeiro dia da semana atual (0 = domingo)

    // Preenche espaços em branco antes do primeiro dia da semana
    for (let i = 0; i < offset; i++) {
      linhaDias.push('');
      semana.push(null);
    }

    // Preenche os dias restantes da semana
    for (let i = offset; i < 7; i++) {
      if (diaAtual > ultimaData) {
        linhaDias.push('');
        semana.push(null);
      } else {
        linhaDias.push(diaAtual.getDate());
        semana.push(diaAtual.toISOString().split('T')[0]);
        diaAtual.setDate(diaAtual.getDate() + 1);
      }
    }

    XLSX.utils.sheet_add_aoa(ws, [linhaDias], { origin: -1 });

    // Agora monta as linhas de plantões (diurno / noturno / eletiva)
    const linhaDiurno = incluirEletivas ? ['07h-19h'] : ['07h-19h'];
    const linhaNoturno = ['19h-07h'];

    semana.forEach(dataStr => {
      const pl = plantoesManuais[dataStr] || {};
      if (incluirEletivas) {
        linhaDiurno.push(pl.eletiva || '');
      } else {
        linhaDiurno.push(pl.diurno || '');
        linhaNoturno.push(pl.noturno || '');
      }
    });

    XLSX.utils.sheet_add_aoa(ws, [linhaDiurno], { origin: -1 });
    if (!incluirEletivas) XLSX.utils.sheet_add_aoa(ws, [linhaNoturno], { origin: -1 });
  }

  // Estilização
  const range = XLSX.utils.decode_range(ws['!ref']);
  ws['!rows'] = [];
  for (let R = 0; R <= range.e.r; R++) {
    if (R === 3) {
      ws['!rows'].push({ hpt: 25 });
      for (let C = 0; C <= range.e.c; C++) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        if (ws[cellRef]) {
          ws[cellRef].s = {
            font: { bold: true, italic: true, sz: 16 }
          };
        }
      }
    } else if (R > 3) {
      ws['!rows'].push({ hpt: 20 });
      for (let C = 0; C <= range.e.c; C++) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        if (ws[cellRef] && typeof ws[cellRef].v === 'string') {
          ws[cellRef].s = {
            font: { sz: 14 }
          };
        }
      }
    } else {
      ws['!rows'].push({});
    }
  }

  XLSX.utils.book_append_sheet(wb, ws, titulo);
}


  const mes = parseInt(document.getElementById('mes').value);
  const ano = parseInt(document.getElementById('ano').value);
  gerarCalendario(mes, ano, 'Eletivas', true);
  gerarCalendario(mes, ano, 'Plantoes', false);

  XLSX.writeFile(wb, 'escala-medica.xlsx');
}


renderizarCalendario();
