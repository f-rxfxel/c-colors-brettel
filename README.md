```markdown
# c-colors

c-colors é uma biblioteca que fornece utilitários e componentes para processamento de imagens em aplicativos React. Ele inclui filtros de correção de daltonismo baseados no algoritmo de Brettel, permitindo que os desenvolvedores criem aplicativos acessíveis para pessoas com diferentes tipos de daltonismo.

## Instalação

Para instalar a biblioteca, você pode usar o npm ou o yarn:

```bash
npm install c-colors
```

## Uso

Aqui está um exemplo básico de como usar os filtros de correção de daltonismo em um componente React:

```jsx
import React from 'react';
import { ColorBlindImage } from 'react-image-processing';

const MyComponent = () => {
  return (
    <div>
      <h1>Minha Imagem</h1>
      <ColorBlindImage src="minha-imagem.jpg" type="Protanopia" />
    </div>
  );
}

export default MyComponent;
```

## Contribuição

Se você quiser contribuir para este projeto, sinta-se à vontade para abrir problemas ou enviar solicitações de recebimento no [GitHub](https://github.com/f-rxfxel/ccolors).
