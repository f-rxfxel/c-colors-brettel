import React, { useState, useEffect, useRef } from 'react'
import { brettelFunctions } from '../utils/brettel'

export default function BrettelImage({
  colorblindType = 'Normal',
  src = '/src/img.jpeg',
  alt = 'Alternative text for screen readers',
}) {
  const imageCache = {}
  const urlCache = {}
  const [showOriginalImage, setShowOriginalImage] = useState(true)
  const [currentImage, setCurrentImage] = useState(null)
  const outCanvas = useRef(null)
  const oriImage = useRef(null)
  const [height, setHeight] = useState(1)
  const [width, setWidth] = useState(1)

  useEffect(() => {
    if (currentImage) {
      setHeight(currentImage.naturalHeight)
      setWidth(currentImage.naturalWidth)
    }
  }, [currentImage])

  useEffect(() => {
    if (currentImage) {
      filterOrImageChanged()
    }
  }, [colorblindType])

  // objeto com todas as funções para recriar a imagem
  var accessibleImage = {
    canvas: outCanvas.current,
    translateX: 0,
    translateY: 0,
    scale: 1.0,

    displayImage: function displayImage(img) {
      this.ctx = this.canvas.getContext('2d')
      this.currentImage = img
      this.redraw()
    },

    redraw: function redraw() {
      if (this.currentImage) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.drawImageAndLens()
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
    },

    getFullImage: function getFullImage() {
      return this.currentImage
    },
  }

  function getFilterFunction(type) {
    var lib = brettelFunctions
    type = type.substring(5)
    if (type in lib) {
      return lib[type]
    } else {
      throw 'Invalid CVD: ' + type
    }
  }

  function createFilteredImage(img, type, callback) {
    var filterFunction = getFilterFunction(type)
    var canvas = document.createElement('canvas')
    canvas.setAttribute('width', width)
    canvas.setAttribute('height', height)
    var ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    var pixels = ctx.getImageData(0, 0, width, height)

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
        accessibleImage.displayImage(filteredImage)
      })
    }
  }

  return (
    <div>
      {showOriginalImage && (
        <img
          ref={oriImage}
          src={src}
          alt={alt}
          onLoad={() => setCurrentImage(oriImage.current)}
        />
      )}
      <canvas
        style={showOriginalImage ? { display: 'none' } : { display: 'block' }}
        width={width}
        height={height}
        ref={outCanvas}
      >
        Your browser does not support the HTML5 canvas element.
      </canvas>
    </div>
  )
}
