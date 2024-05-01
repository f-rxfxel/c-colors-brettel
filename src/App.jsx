import { useState, useEffect, useRef } from 'react'
import { brettelFunctions } from './brettel.js'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

function App() {
  const [colorblindType, setColorblindType] = useState('Normal')
  const [imageCache, setImageCache] = useState({})
  const [urlCache, setUrlCache] = useState({})
  const [showOriginalImage, setShowOriginalImage] = useState(true)
  // atualizar o estado dessa variavel
  const [currentImage, setCurrentImage] = useState(null)
  const outCanvas = useRef(null)
  const myImage = useRef(null)

  var panZoomImage = {
    canvas: outCanvas.current,
    lastX: 0,
    lastY: 0,
    translateX: 0,
    translateY: 0,
    scale: 1.0,
    dragged: false,
    lens: 0,
    displayImage: function displayImage(img) {
      this.ctx = this.canvas.getContext('2d')
      this.currentImage = img
      this.onresize()
      this.redraw()
    },

    onresize: function () {
      this.canvas.style.width = "370"
      this.canvas.style.height = "655px"
      // this.canvas.style.width = currentImage.naturalWidth
      // this.canvas.style.height = currentImage.naturalHeight
      this.canvas.width = this.canvas.offsetWidth
      this.canvas.height = this.canvas.offsetHeight
      console.log(currentImage.naturalWidth)
      console.log(currentImage.naturalHeight)
      this.redraw()
    },

    getFullImage: function getFullImage() {
      return this.currentImage
    },

    clearImage: function clearImage() {
      if (this.currentImage) {
        this.ctx.clearRect(
          this.translateX,
          this.translateY,
          this.scale * this.currentImage.width,
          this.scale * this.currentImage.height
        )
      }
    },
    drawImageAndLens: function drawImageAndLens() {
      if (!this.currentImage) {
        return
      }
      var fullImage = this.getFullImage()
      this.ctx.drawImage(
        fullImage,
        0,
        0,
        this.currentImage.width,
        this.currentImage.height,
        this.translateX,
        this.translateY,
        this.currentImage.width * this.scale,
        this.currentImage.height * this.scale
      )
      if (this.lens === 1 || this.lens === 2) {
        this.drawLens()
      }
    },
    clearLens: function clearLens() {
      if (!this.currentImage) {
        return
      }

      this.ctx.drawImage(
        this.getFullImage(),
        (this.lastX - this.translateX - 50) / this.scale,
        (this.lastY - this.translateY - 50) / this.scale,
        100 / this.scale,
        100 / this.scale,
        this.lastX - 50,
        this.lastY - 50,
        100,
        100
      )
    },
    drawLens: function drawLens() {
      if (!this.currentImage || this.lens === 0) {
        return
      }
      this.ctx.save()
      this.ctx.beginPath()
      this.ctx.arc(this.lastX, this.lastY, 50, 0, 2 * Math.PI)
      this.ctx.clip()
      this.ctx.drawImage(
        this.getLensImage(),
        (this.lastX - this.translateX - 50) / this.scale,
        (this.lastY - this.translateY - 50) / this.scale,
        100 / this.scale,
        100 / this.scale,
        this.lastX - 50,
        this.lastY - 50,
        100,
        100
      )
      this.ctx.restore()
    },
    redraw: function redraw() {
      if (this.currentImage) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.drawImageAndLens()
      }
    },
  }

  useEffect(() => {
    setCurrentImage(myImage.current)
    clearImageCache()
    filterOrImageChanged()
  }, [])

  useEffect(() => {
    if (currentImage) {
      filterOrImageChanged()
    }
  }, [colorblindType, currentImage])

  function getFilterFunction(type) {
    var lib = brettelFunctions
    type = type.substring(5)
    if (type in lib) {
      return lib[type]
    } else {
      throw 'Library does not support Filter Type: ' + type
    }
  }

  function createFilteredImage(img, type, callback) {
    var filterFunction = getFilterFunction(type)
    var canvas = document.createElement('canvas')
    var w = img.naturalWidth
    var h = img.naturalHeight
    canvas.setAttribute('width', w)
    canvas.setAttribute('height', h)
    var ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    var pixels = ctx.getImageData(0, 0, w, h)
    // Split the work into 5 chunks
    var chunkSize = Math.max(Math.floor(pixels.data.length / 5), 1)
    var i = 0

    function doWork() {
      var chunkEnd = Math.min(i + chunkSize, pixels.data.length)
      for (; i < chunkEnd; i += 4) {
        var rgb = [pixels.data[i], pixels.data[i + 1], pixels.data[i + 2]]
        var filteredRGB = filterFunction(rgb)
        pixels.data[i] = filteredRGB[0]
        pixels.data[i + 1] = filteredRGB[1]
        pixels.data[i + 2] = filteredRGB[2]
      }
      if (i < pixels.data.length) {
        doWork() // Self reference
      } else {
        // Work is done
        ctx.putImageData(pixels, 0, 0)
        var url = canvas.toDataURL()
        var filteredImage = new Image()

        filteredImage.onload = function () {
          callback(this, url)
        }
        filteredImage.src = url
        setShowOriginalImage(false)
      }
    }

    doWork()
  }

  function getFilteredImage(img, type, callback) {
    if (type in imageCache) {
      callback(imageCache[type], urlCache[type])
    } else {
      if (type === 'brettNormal') {
        imageCache[type] = img
        urlCache[type] = '#'
        callback(img, '#')
      } else {
        createFilteredImage(img, type, function (filtered, url) {
          imageCache[type] = filtered
          urlCache[type] = url
          callback(filtered, url)
        })
      }
    }
  }

  function filterOrImageChanged() {
    var filterName = 'brett' + colorblindType
    if (currentImage) {
      getFilteredImage(currentImage, filterName, function (filteredImage) {
        panZoomImage.displayImage(filteredImage)
      })
    }
  }

  const handleChange = (event) => {
    setColorblindType(event)
  }

  function clearImageCache() {
    setImageCache({})
    setUrlCache({})
  }

  const deficiencies = [
    'Normal',
    'Protanopia',
    'Protanomaly',
    'Deuteranopia',
    'Deuteranomaly',
    'Tritanopia',
    'Tritanomaly',
  ]

  const AccessibilityIcon = () => {
    return (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='18'
        height='18'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className='mr-3'
      >
        <path d='M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z' />
        <circle cx='12' cy='12' r='3' />
      </svg>
    )
  }

  const SelectDaltonism = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='flex items-center'>
          <AccessibilityIcon />
          Acessibilidade
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel>Daltonism</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={colorblindType}
          onValueChange={handleChange}
        >
          {deficiencies.map((deficiency) => (
            <DropdownMenuRadioItem key={deficiency} value={deficiency}>
              {deficiency}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
  
/* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling
const AccessibleImage = ({ src }) => (
  <div>
        {showOriginalImage && (
        <img
          // className='hidden'
          ref={myImage}
          src={src}
          alt=''
        />
      )}
  </div>
)

  return (
    <main>
      <SelectDaltonism />
      <AccessibleImage src='/src/assets/imagem.png' />
      <canvas ref={outCanvas}>
        Your browser does not support the HTML5 canvas element.
      </canvas>
    </main>
  )
}

export default App
