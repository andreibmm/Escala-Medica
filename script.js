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
    td.innerText = dia;
    td.setAttribute('data-dia', dataStr);
    td.onclick = () => selecionarDia(td);

    atualizarCores(td, dataStr);
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
      td.classList.remove('selected');
    }
  });

  diasSelecionados = [];
}

function limparSelecao() {
  diasSelecionados.forEach(dataStr => {
    const td = document.querySelector(`td[data-dia='${dataStr}']`);
    if (td) td.classList.remove('selected');
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

  for (const dataStr in plantoesManuais) {
    const entry = plantoesManuais[dataStr];
    const [ano, mes, dia] = dataStr.split('-').map(Number);
    const diaDaSemana = new Date(ano, mes - 1, dia).getDay();
    const fimDeSemana = diaDaSemana === 0 || diaDaSemana === 6;

    if (entry.diurno) {
      const medico = medicos.find(m => m.nome === entry.diurno);
      const valor = medico?.vinculo === 'Efetivo' ? 0 : (fimDeSemana ? valorFimDeSemana : valorSemana);
      data.push([dataStr, 'Diurno', entry.diurno, medico?.vinculo || '', valor]);
    }

    if (entry.noturno) {
      const medico = medicos.find(m => m.nome === entry.noturno);
      const valor = medico?.vinculo === 'Efetivo' ? 0 : (fimDeSemana ? valorFimDeSemana : valorSemana);
      data.push([dataStr, 'Noturno', entry.noturno, medico?.vinculo || '', valor]);
    }

    if (entry.eletiva) {
      const medico = medicos.find(m => m.nome === entry.eletiva);
      const valor = medico?.vinculo === 'Efetivo' ? 0 : 1800; // ou outro valor padrão para eletiva
      data.push([dataStr, 'Eletiva', entry.eletiva, medico?.vinculo || '', valor]);
    }
  }

  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, 'Escala');
  XLSX.writeFile(wb, 'escala-medica.xlsx');
}


renderizarCalendario();
