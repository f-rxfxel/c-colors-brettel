```markdown
# c-colors

c-colors é uma biblioteca que fornece utilitários e componentes para processamento de imagens em aplicativos React. Ele inclui filtros de correção de daltonismo baseados no algoritmo de Brettel, permitindo que os desenvolvedores criem aplicativos acessíveis para pessoas com diferentes tipos de daltonismo.

## Instalação

Para instalar a biblioteca, você pode usar o npm:

```bash
npm install c-colors
```

## Uso

A biblioteca fornece dois componentes: 
```<SelectDaltonism />```
e
```<ColorBlindImage />```

O componente ```<SelectDaltonism />```, opcionalmente espera propriedades de estilização em Tailwind. Caso estas propriedades existam, o estilo default do componente é substituído.
Este componente expande um menu ao ser clicado, exibindo os tipos disponíveis de daltonismo.

O componente ```<ColorBlindImage />```, obrigatoriamente espera propriedades de uma tag HTML do tipo ```<img />```, ou seja, src (caminho da imagem) e alt (texto alternativo).
Este componente, por debaixo dos panos, reescreve a imagem pixel a pixel, aplicando uma correção aos valores RGB de cada pixel.

Aqui está um exemplo básico de como usar os filtros de correção de daltonismo em um componente React:

```jsx
import React from 'react';
import { ColorBlindImage } from 'c-colors-brettel';

const MyComponent = () => {
  return (
    <div className='flex flex-col gap-4 items-center'>
      <SelectDaltonism />
      <h1>Paisagem de uma floresta:</h1>
      <ColorBlindImage src="imagem-floresta.jpg" alt="Imagem de uma floresta" />
    </div>
  );
}

export default MyComponent;
```

## Contribuição

Se você quiser contribuir para este projeto, sinta-se à vontade para abrir problemas ou enviar solicitações de recebimento no [GitHub](https://github.com/f-rxfxel/ccolors).
