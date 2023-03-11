
(function() {
	const faculdades = [{
			"nome": "Nutrição",
			"sigla": "NUTRI",
			"area": "Biológicas/Saúde"
		},
		{
			"nome": "Biomedicina",
			"sigla": "BIOMED",
			"area": "Biológicas/Saúde"
		},
		{
			"nome": "Educação Física",
			"sigla": "ED.FIS",
			"area": "Humanas"
		},
		{
			"nome": "Enfermagem",
			"sigla": "ENF",
			"area": "Biológicas/Saúde"
		},
		{
			"nome": "Farmácia",
			"sigla": "FAM",
			"area": "Biológicas/Saúde"
		},
		{
			"nome": "Medicina",
			"sigla": "MED",
			"area": "Biológicas/Saúde"
		},
		{
			"nome": "Fisioterapia",
			"sigla": "FISIO",
			"area": "Biológicas/Saúde"
		},
		{
			"nome": "Fonoaudiologia",
			"sigla": "FONO",
			"area": "Biológicas/Saúde"
		},
		{
			"nome": "Odontologia",
			"sigla": "ODONTO",
			"area": "Biológicas/Saúde"
		},
		{
			"nome": "Publicidade e Propaganda",
			"sigla": "PUBLI",
			"area": "Humanas"
		},
		{
			"nome": "Psicologia",
			"sigla": "PSIC",
			"area": "Humanas"
		},
		{
			"nome": "Administração",
			"sigla": "ADM",
			"area": "Humanas"
		},
		{
			"nome": "Direito",
			"sigla": "DIR",
			"area": "Humanas"
		},
		{
			"nome": "Música",
			"sigla": "MUS",
			"area": "Humanas"
		},
		{
			"nome": "Relações Internacionais",
			"sigla": "RI",
			"area": "Humanas"
		},
		{
			"nome": "Letras",
			"sigla": "LERAS",
			"area": "Humanas"
		},
		{
			"nome": "Moda",
			"sigla": "MODA",
			"area": "Humanas"
		},
		{
			"nome": "Pedagogia",
			"sigla": "PEDAG",
			"area": "Humanas"
		},
		{
			"nome": "Contabilidade",
			"sigla": "CON",
			"area": "Exatas"
		},
		{
			"nome": "Arquitetura",
			"sigla": "ARQUI",
			"area": "Exatas"
		},
		{
			"nome": "Computação/Sitemas",
			"sigla": "TI",
			"area": "Exatas"
		},
		{
			"nome": "Matemática",
			"sigla": "MAT",
			"area": "Exatas"
		},
		{
			"nome": "Química",
			"sigla": "QUIM",
			"area": "Exatas"
		},
		{
			"nome": "Engenharia Civil",
			"sigla": "Eng. Civil",
			"area": "Exatas"
		},
		{
			"nome": "Engenharia Mecânica",
			"sigla": "Eng. Mecanica",
			"area": "Exatas"
		},
		{
			"nome": "Engenharia Elétrica",
			"sigla": "Eng. Elétrica",
			"area": "Exatas"
		}
	]
	const store = (name) => {
		return {
			get: function () {
				return window.localStorage.getItem(name)
			},
			set: function (dado) {
				window.localStorage.setItem(name, dado)
			}
		}
	}

	const contadorDeVotos = ()=>{
		const resultados = {}
		const votosHandler = store('votos');
		let votos = votosHandler.get() ?? ''

		const setupVotacao= ()=>{
			faculdades.map(({sigla})=>{
				resultados[sigla] = (votos.match(new RegExp(sigla,'g')) || []).length
			})

			const form$ = document.querySelector('.votacao form')
			form$.addEventListener('submit',(event)=>{
				event.preventDefault()
				
				const input$ = form$.querySelector('input:checked')
				if(input$){
					votar(input$.value)
					input$.checked = false

					input$.parentElement.classList.remove('votou')
					setTimeout(()=>{
						input$.parentElement.classList.add('votou')
					},1)
					
					lockButton()
				}
			})

			const btn$ = form$.querySelector('button')
			const lockButton = ()=>{
				btn$.disabled = true
				setTimeout(()=>{
					btn$.disabled = false
				},5000)
			}
		}

		function votar(curso){
			resultados[curso] += 1;
			const voto = curso + '-' + Date.now() + '\n' 

			votos += voto
			votosHandler.set(votos);
			window.dispatchEvent(new CustomEvent('vote',{detail:curso}))

		}

		const getResultados = ()=>{
			return {...resultados}
		}

		return {
			setupVotacao, getResultados
		}
	}

	const contadorDeResultados = (resultados)=>{
		const resultados$ = {}
		const eventoDeVoto = (event)=>{
			const sigla = event.detail
			
			if(!resultados$.hasOwnProperty(sigla)){
				resultados$[sigla] = document.querySelector('.contagem ol [data-curso="'+sigla+'"]')
			}
			const resutlado$ = resultados$[sigla];
			resutlado$.dataset.contagem = parseInt(resutlado$.dataset.contagem) +1
			resutlado$.style.order = resutlado$.dataset.contagem;
		}
		
		const montarListaDeResultados = (resultados)=>{
			const lista$ = document.querySelector('.contagem ol')
			let _html = ''
			for (const curso in resultados) {
				if (Object.hasOwnProperty.call(resultados, curso)) {
					const contagem = resultados[curso];
					_html += '<li data-curso="'+curso+'" data-contagem="'+contagem+'" style="order:'+contagem+'">'
					_html += faculdades.find(_curso=>_curso.sigla == curso).nome
					_html += '</li>'
				}
			}
			lista$.insertAdjacentHTML('afterbegin',_html)
		}
		
		montarListaDeResultados(resultados)
		return {eventoDeVoto}
	}
	const montarFormulario = ()=>{
		const cursos$ = document.querySelector('.votacao .cursos')
		const cursosPorArea = {}
		let _html = ''
		faculdades.forEach((curso)=>{
			if(!cursosPorArea.hasOwnProperty(curso.area)){
				cursosPorArea[curso.area] = []
			}
			cursosPorArea[curso.area].push(curso)
		})

		for (const area in cursosPorArea) {
			if (Object.hasOwnProperty.call(cursosPorArea, area)) {
				const cursos = cursosPorArea[area];
				
				_html += '<div data-area="'+ area +'">';
				_html += '<h3 class="titulo">'+ area +'</h3>';

				cursos.forEach(curso=>{
					_html += '<label>'
					_html += '<input type=radio name=curso value="'+curso.sigla+'"/>'
					_html += '<span >'+curso.nome+'</span>'
					_html += '</label>'
				})
				_html += '</div >';
			}
		}

		cursos$.insertAdjacentHTML('afterbegin',_html)
	}

	// SETUP
	const {setupVotacao,getResultados} = contadorDeVotos()

	window.addEventListener('load',()=>{
		setupVotacao();
		montarFormulario();
		const {eventoDeVoto} = contadorDeResultados(getResultados())
		window.addEventListener('vote',eventoDeVoto)
	})
})();