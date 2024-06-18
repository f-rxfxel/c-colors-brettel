import { useState } from 'react'
import Menu from './components/Menu'
import { BrettelImage } from './components'

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