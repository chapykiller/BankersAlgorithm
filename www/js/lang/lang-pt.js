get_string = {
	page_title: "Algoritmo do Banqueiro",
	header_text: "Algoritmo do Banqueiro",
	home_button: "Página Inicial",
	tutorial_button: "Tutorial",
	theory_button: "Teoria",
	credits_button: "Créditos",
	ack_button: "Agradecimentos",
	html5_error: "Seu navegador não fornece suporte a HTML5",
	authors_header_1: "Quem fez este trabalho?",
	authors_title_1: "Trabalho desenvolvido em 2015 pelos seguintes alunos de Sistemas Operacionais do curso de Engenharia de computação (ICMC/EESC) na Universidade de São Paulo - Campus São Carlos:",
	authors_1: "Caio César A. Guimarães (Devaneio)",
	authors_2: "Helder de Melo Mendes (Iraque)",
	authors_3: "Henrique Cintra (Oito)",
	authors_4: "Lucas Eduardo C. de Mello (Cabelo) / https://github.com/chapykiller",
	ack_header: "Quem nos ajudou?",
	ack_1: "Agradecimentos ao Prof. Dr. Paulo Sérgio Lopes que nos lecionou as disciplinas de Organização de Computadores Digitais e Sistemas Operacionais. Graças à sua grande ajuda foi possível a realização desse trabalho.",
	ack_2: "Obrigado a Carolina Prado pelas dicas de cores e de layout.",
	allocated_table: "Alocados",
	m_claim_table: "Necessários",
	allocated_array: "Alocados",
	available_array: "Disponíveis",
	maximum_array: "Existentes",
	banker_init1: "Clique nas posições do vetor de",
	banker_init2: "existentes e das duas tabelas",
	banker_init3: "para alterar os valores.",
	banker_iteract: "            Iteração ",
	banker_11: "Passo 1: Encontrar uma linha cujas",
	banker_12: "necessidades de recursos até",
	banker_13: "finalizar a execução sejam",
	banker_14: "menores ou iguais ao vetor de",
	banker_15: "disponíveis.",
	banker_1_succ1: "A linha (processo) encontrado",
	banker_1_succ2: "está representada em vermelho.",
	banker_1_fail1: "Não foi possível achar",
	banker_1_fail2: "um processo assim, logo:",
	banker_1_fail3: "Estado Inseguro",
	banker_21: "Passo 2: Todos os recursos foram",
	banker_22: "alocados e o processo executa.",
	banker_31: "Passo 3: O processo executou",
	banker_32: "até o fim.",
	banker_33: "Repetir os passos anteriores.",
	banker_imp1: "Você tentou alocar mais",
	banker_imp2: "recursos do que a quantidade",
	banker_imp3: "disponível.",
	banker_end1: "O algoritmo conseguiu fornecer",
	banker_end2: "recursos para todos os processos",
	banker_end3: "executarem. Esse é um estado",
	banker_end4: "seguro, e os recursos podem ser",
	banker_end5: "fornecidos.",
	
	tutorial_header_1: "Como isto funciona?",
	tutorial_title_1: "Interface",
	tutorial_paragraph_1: "A interface de nossa simulação é organizada como pode ver a seguir.",
	tutorial_subtitle_11: "As tabelas",
	tutorial_paragraph_11: "Nas tabelas, as linhas representam 3 processos diferentes e as colunas mostram o respectivo número de recursos de cada tipo que estão alocados (ou reivindicados) no momento.",
	tutorial_subtitle_12: "Os vetores",
	tutorial_paragraph_12: "Esta seção mostra a quantidade de recursos de cada tipo (colunas) dada a situação em que se encontram, mostrada pela legenda.",
	tutorial_subtitle_13: "Os botões",
	tutorial_paragraph_13: "Os botões interativos e suas respectivas funções são mostradas abaixo.",
	tutorial_title_2: "Aprendendo a utilizar",
	tutorial_paragraph_21: "Para comecar a utilizar clique em uma das colunas do vetor de 'Existentes' para adicionar recursos. ",
	tutorial_paragraph_22: "A seguir clique na tabela de de 'Necessários' para definir quantos recursos de cada tipo cada processo irá precisar para ser executado.",
	tutorial_paragraph_23: "Defina quantos recursos cada processo vai tentar alocar, acrescentando valores na tabela de 'Alocados'.",
	tutorial_paragraph_24: "Para começar a simulação clique no botão de próximo.",

	theory_header: "Conceitos envolvidos",
	theory_title_1: "Impasses",
	theory_title_2: "Estados seguros e inseguros",
	theory_title_3: "Evitando impasses - O algoritmo do banqueiro",
	theory_paragraph_1: "Um conjunto de processos está em impasse se cada processo no conjunto está aguardando por um evento que somente outro processo no conjunto pode causar. ",
	theory_paragraph_2: "Um estado é dito seguro quando a partir deste é possível alocar os recursos de forma a garantir que todos os processos serão executados até o fim. Um estado seguro nunca leva a impasses. Caso contrário, temos um estado inseguro, que pode levar a um impasse, mas não necessariamente irá.",
	theory_paragraph_31: "Algoritmo criado por Dijkstra e publicado em 1965. Pode ser utilizado para evitar impasses. Sempre que recursos são solicitados, o algoritmo avalia se atender à solicitação levará a um estado inseguro e se isso ocorrer, ela não é atendida.",
	theory_paragraph_32_title: "Representação",
	theory_paragraph_32: "Os dados necessários para o algoritmo podem ser representados em matrizes, aonde cada linha está associada a um processo, cada coluna está associada a um recurso e os elementos são a quantidade do recurso alocada ao processo.",
	theory_paragraph_33_title: "Hipóteses e entrada",
	theory_paragraph_33: "O algoritmo assume que o sistema tem a informação da quantidade máxima de cada recurso a ser solicitada por cada processo. A entrada é uma solicitação de recursos. Sempre que ocorre uma solicitação, os passos abaixo são executados.",
	theory_paragraph_34_def1_title: "Passo 1",
	theory_paragraph_34_def2_title: "Passo 2",
	theory_paragraph_34_def3_title: "Passo 3",
	theory_paragraph_34_def1: "Buscar um processo (linha) cuja demanda por cada recurso seja menor ou igual à disponiblidade do recurso. Se nenhum processo for encontrado, temos um estado inseguro e poderá ocorrer um impasse, portanto, a solicitação é negada.",
	theory_paragraph_34_def2: "Assumir que todos os recursos solicitados pelo proceso encontrado são fornecidos a ele e que é executado até sua conclusão. Os recursos desse processo são então liberados, para serem utilizados por outros processos.",
	theory_paragraph_34_def3: "Repetir os passos anteriores até que todos os processos tenham sido executados até a conclusão ou que não seja possível fornecer recursos para que algum dos processos execute. Se todos os processos foram executados, o estado é seguro e os recursos podem ser alocados como solicitado. Caso contrário, o estado é inseguro e a solicitação não será atendida.",
	theory_paragraph_35_title: "Considerações finais",
	theory_paragraph_35: "Enquanto teoricamente o algoritmo do banqueiro é suficiente para evitar os impasses, na prática a hipótese necesária para seu funcionamento mostra-se insatisfazível na maioria dos sistemas, dado que não há informação da quantidade máxima de recursos que cada processo irá solicitar ao longo da sua execução.",
	theory_reference_header: "Referências:",
	theory_reference: "TANENBAUM, A. S. Modern Operating Systems: 3rd Edition - Pearson Education (2008) - United Kingdom"
};
