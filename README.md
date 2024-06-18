## Uso

A biblioteca fornece o componente: 
```<BrettelImage />```

O componente ```<SelectDaltonism />``` espera as propriedades dos tipos de daltonismo (```Normal```, ```Deuteranopia```, ```Protanopia```, ```Tritanopia```, ```Deuteranomalia```, ```Protanomalia``` ou ```Tritanomalia```) por meio da prop ```colorblindType```, o caminho da imagem por meio da prop ```src```, o texto alternativo por meio da prop ```alt```.

O componente ```<SelectDaltonism />```, por debaixo dos panos, utiliza a tag ```<img />``` juntamente com o ```<canvas></canvas>``` do HTML para reescrever a imagem pixel a pixel, aplicando uma correção aos valores RGB, usando JavaScript.

Os valores, parâmetros e funçõesde conversão descritos no artigo por Brettel, H., Vienot, F. & Mollon, J. D. (1997) são necessários para a correção de imagem, e graças ao [MaPePeR](https://github.com/MaPePeR), não tive o trabalho de reescreve-los. Reitero também sua solução também usada nesta biblioteca de dividir a imagem em blocos para melhorar a performance da aplicação.

Aqui está um exemplo básico de como usar os filtros de correção de daltonismo em um componente React:

```jsx
import { BrettelImage } from 'c-colors';

<BrettelImage
  colorblindType="Deuteranopia"
  src="/my-image.jpg"
  alt="A beautiful landscape"
/>
```