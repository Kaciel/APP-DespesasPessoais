class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor) {
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}

	validarDados() {
		for(let i in this) {
			if(this[i] == undefined || this[i] == '' || this[i] == null) {
				return false
			}
		}
		return true
	}
}

class Bd {

	constructor() {
		let id = localStorage.getItem('id')

		if(id === null) {
			localStorage.setItem('id', 0)
		}
	}

	getProximoId() {
		let proximoId = localStorage.getItem('id')
		return parseInt(proximoId)	+ 1
	}

	gravar(d) {
		
		let id = this.getProximoId()

		localStorage.setItem(id, JSON.stringify(d))

		localStorage.setItem('id', id)

	}


	recuperarTodosRegistros() {


		let despesas = Array()

		let id = localStorage.getItem('id')

		//recuperar todas as despesas cadastradas em localStorage
		for(let i = 1; i <= id; i++) {

			//recuperar despesa
			let despesa = JSON.parse(localStorage.getItem(i))
                

             //possibilidade de haver indices que foram pulados ou excluidos   
			if(despesa === null) {
				continue
			}

			despesa.id = i
			despesas.push(despesa)

		}	

		 return despesas
	}

	pesquisar(despesa) {
		
		let despesasFiltradas = Array()

		despesasFiltradas = this.recuperarTodosRegistros()

		

		console.log(despesa)

		console.log(despesasFiltradas)

		//ano
			
		if (despesa.ano != '') {
			console.log('filtro de ano');
			despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
		}	
		//mes
			
		if (despesa.mes != '') {
			console.log('filtro de mes');
			despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
		}
		//dia
		if (despesa.dia != '') {
			console.log('filtro de dia');
			despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
		}
		//tipo
		if (despesa.tipo != '') {
			console.log('filtro de tipo');
			despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
		}
		//descriçao
		if (despesa.descricao != '') {
			console.log('filtro de descricao');
			despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
		}
		//valor
		if (despesa.valor != '') {
			console.log('filtro de valor');
			despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
		}
		
		return despesasFiltradas


	}

	remover(id) {
		localStorage.removeItem(id)
	}
}


let bd = new Bd()





function cadastrarDespesa() {
	
	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	
	let despesa = new Despesa(
		ano.value, 
		mes.value, 
		dia.value, 
		tipo.value, 
		descricao.value,
		valor.value
		)


// O TRECHO DE CÓDIGO ABAIXO ESTÁ DIRETAMENTE
// LIGADO AO ACIONAMENTO DOS MODAIS, É ELE QUE
// DETERMINA QUAL MODAL SERÁ EXIBIDO EM CONJUNTO
// COM O 'validarDados()'. DETERMINA TAMBÉM QUE OS
// MODAIS SÃO ACIONADOS PELO BOTÃO DE REGISTRO DAS
// INFORMAÇÕES DO FORMULÁRIO.

	if(despesa.validarDados()) {
		bd.gravar(despesa)

		document.getElementById('modal-titulo').innerHTML = 'Registro inserido com sucesso'
		document.getElementById('cor-titulo').className = 'modal-header text-seccess'
		document.getElementById('modal-conteudo').innerHTML = 'Despesa registrada com sucesso!'
		document.getElementById('modal-btn').innerHTML = 'Fechar Pop-UP!'
		document.getElementById('modal-btn').className = 'btn btn-success'

		//dialog de sucesso na operação de cadastro de despesa
		$('#modalregistrodespesa').modal('show')

		ano.value = ''
		mes.value = ''
		dia.value = '' //Esse simples detalhe é o que faz com que ao gravar uma despesa o formulário automaticamente seja limpo ou zerado para inserir uma nova despesa.
		tipo.value = ''
		descricao.value = ''
		valor.value = ''

	}else {

		document.getElementById('modal-titulo').innerHTML = 'Campos obrigatórios não preenchidos'
		document.getElementById('cor-titulo').className = 'modal-header text-danger'
		document.getElementById('modal-conteudo').innerHTML = 'Volte e preencha todos os campos!'
		document.getElementById('modal-btn').innerHTML = 'Voltar e corrigir'
		document.getElementById('modal-btn').className = 'btn btn-danger'


		
		$('#modalregistrodespesa').modal('show')

		
	}
}

	
function carregaListaDespesas(despesas = Array(), filtro = false) {

	
	if(despesas.length == 0 && filtro == false) {
	despesas = bd.recuperarTodosRegistros()
	}
	//ACHO QUE ESSE ERA O ERRO / mas não era, já teste


	//Seleção programática da tabela de exibição das despesas registradas
	let listaDespesas = document.getElementById('listaDespesas')
	listaDespesas.innerHTML = ''
	/*
	<tr>

                <td>15/03/2018</td>
                <td>Alimentação</td>
                <td>Compras do mês</td>
                <td>444,59</td>


     </tr>
	*/


	//percorrer o array despesas, lisntado cada despesa de forma dinâmica
	despesas.forEach(function(d) {

		//console.log(d)

		//criando a linha (tr) dentro do't-body'
		let linha = listaDespesas.insertRow()

		//criar as colunas (td)
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
		

		//ajustar o tipo
		switch(d.tipo) {
			case '1': d.tipo = 'Alimentação'
				break
			case '2': d.tipo = 'Educação'
				break
			case '3': d.tipo = 'Lazer'	
				break
			case '4': d.tipo = 'Saúde'	
			 	break
			case '5': d.tipo = 'Transporte'
				break
		}

		linha.insertCell(1).innerHTML = d.tipo
		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = d.valor

		//criar botão de exclusão
		let btn = document.createElement("button")
		btn.className = 'btn btn-danger'	
		btn.innerHTML = '<i class="fas fa-times"></i>'
		btn.id = `id_despesa_${d.id}` 
		btn.onclick = function() {
			//remover a despesa
			

			let id = this.id.replace('id_despesa_', '')

			//alert(this.id)
			
			bd.remover(id)

			window.location.reload() //Essa linha determina que ao remover uma despesa do app automaticamente a página será recarregada para que a despesa removida não seja mais exbida.
		}
		linha.insertCell(4).append(btn)

		console.log(d)

	})
}


function pesquisarDespesa() {
	//console.log('teste')
	let ano = document.getElementById('ano').value
	let mes = document.getElementById('mes').value
	let dia = document.getElementById('dia').value
	let tipo = document.getElementById('tipo').value
	let descricao = document.getElementById('descricao').value
	let valor = document.getElementById('valor').value

	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

	//console.log(despesa)
	let despesas = bd.pesquisar(despesa)

	this.carregaListaDespesas(despesas, true)
}

