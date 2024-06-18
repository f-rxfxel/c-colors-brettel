import { useState } from 'react'
import { BrettelImage } from './components/BrettelImage'
import Menu from './components/Menu'

const App = () => {
  const [daltonismo, setDaltonismo] = useState('Normal')

  return (
    <div>
      <Menu onChange={(dalt) => setDaltonismo(dalt)}/>
      <BrettelImage colorblindType={daltonismo}/>
    </div>
  )
}

export default App