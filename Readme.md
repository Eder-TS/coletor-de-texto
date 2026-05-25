# Coletor de textos

Aplicação que criei para copiar o conteúdo das aulas de Engenheiro de Software (Escola DNC) após terminá-las.

## Arquitetura

Considerando que Javascript é a linguagem que domino e que Node.js é um ambiente que pode rodar em muitas plataformas, então este ambiente foi escolhido para criar um monolito simples para rodar executando o framework Playwright (ótimo para browser automation e outras funções). 

## Funcionamento

Não há interface e os dados da platafporma a ser acessada, assim como cada matéria a ser copiada e caminho para salvar os arquivos, são inseridos diretamente no código. Dados de login devem ser inseridos como variável de ambiente. Uma série de logs é gerado a medida que o código é executado é possível observar que tudo esteja correndo bem.
A princípio a aplicação funciona bem para a plataforma que está inserida mas não foi testada em outras plataformas.

## Melhorias

Uma automação que ainda falta é alternar entre as matérias do curso. Mesmo assim estaria longe de servir a qualquer plataforma. Tendo em vista que a plataforma inserida é moderna, esta aplicação facilmente poderá ser testada em outros sites e plataformas.
É evidente que uma interface facilitaria o uso, porém necessitaria de uma definição de escopo para quê se evite um leque muito amplo de plataformas, o quê tornaria a configuração muito complexa.
Também é possível adicionar a biblioteca Turndown e transformar o texto bruto HTML em algo mais legível para humanos e buscadores.

Eder TS
Desenvolvedor full stack
24/5/26
