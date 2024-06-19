## Uso

A biblioteca fornece o componente:
`<BrettelImage />`

O componente `<SelectDaltonism />` espera as propriedades dos tipos de daltonismo (`Normal`, `Deuteranopia`, `Protanopia`, `Tritanopia`, `Deuteranomaly`, `Protanomaly` ou `Tritanomaly`) por meio da prop `colorblindType`, o caminho da imagem por meio da prop `src`, o texto alternativo por meio da prop `alt`.

O componente `<SelectDaltonism />`, por debaixo dos panos, utiliza a tag `<img />` juntamente com o `<canvas></canvas>` do HTML para reescrever a imagem pixel a pixel, aplicando uma correção aos valores RGB, usando JavaScript.

Os valores, parâmetros e funçõesde conversão descritos no artigo por Brettel, H., Vienot, F. & Mollon, J. D. (1997) são necessários para a correção de imagem, e graças ao [MaPePeR](https://github.com/MaPePeR), não tive o trabalho de reescreve-los. Reitero também sua solução também usada nesta biblioteca de dividir a imagem em blocos para melhorar a performance da aplicação.

## Exemplo

```jsx
import { useState } from 'react'
import { BrettelImage } from 'c-colors-brettel'

const App = () => {
  const [daltonismo, setDaltonismo] = useState('Normal')

  return <BrettelImage
    colorblindType={daltonismo}
    src='./img.jpeg'
    alt='Alternative text for screen readers'
  />
}

export default App
```

## Controle de Estado
O gerenciamento de estado que armazena o tipo de daltonismo é uma parte crucial para o funcionamento do componente. No contexto de seu projeto, onde o tipo de daltonismo selecionado pelo usuário precisa ser gerenciado e refletido na interface, há várias abordagens possíveis para controlar esse estado. Você pode usar diferentes métodos de controle de estado, como useState, useContext, Redux, entre outros.