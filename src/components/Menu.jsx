function Menu({ onChange }){
  return (
    <ul>
      <li onClick={() => { onChange("Normal") }}>Normal</li>
      <li onClick={() => { onChange("Protanopia") }}>Protanopia</li>
      <li onClick={() => { onChange("Tritanopia") }}>Tritanopia</li>
      <li onClick={() => { onChange("Deuteranopia") }}>Deuteranopia</li>
    </ul>
  )
}

export default Menu