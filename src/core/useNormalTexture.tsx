import * as React from 'react'
import { useTexture } from './useTexture'
import { RepeatWrapping, Texture, Vector2 } from 'three'

import { useAsset } from 'use-asset'

const NORMAL_ROOT = 'https://rawcdn.githack.com/pmndrs/drei-assets/7a3104997e1576f83472829815b00880d88b32fb'
const LIST_URL = 'https://cdn.jsdelivr.net/gh/pmndrs/drei-assets@master/normals/normals.json'

type Settings = {
  repeat?: number[]
  anisotropy?: number
  offset?: number[]
}

export function useNormalTexture(id = 0, settings: Settings = {}): [Texture, string, number] {
  const { repeat = [1, 1], anisotropy = 1, offset = [0, 0] } = settings

  const normalsList = useAsset<Record<string, string>, [string]>(
    () =>
      new Promise(async (resolve) => {
        const normalsList = await fetch(LIST_URL).then((res) => res.json())
        resolve(normalsList)
      }),
    'normalsList'
  )
  const numTot = React.useMemo(() => Object.keys(normalsList).length, [])
  const DEFAULT_NORMAL = normalsList[0]

  const imageName = normalsList[id] || DEFAULT_NORMAL
  const url = `${NORMAL_ROOT}/normals/${imageName}`

  const normalTexture = useTexture(url) as Texture

  React.useLayoutEffect(() => {
    if (!normalTexture) return
    normalTexture.wrapS = normalTexture.wrapT = RepeatWrapping
    normalTexture.repeat = new Vector2(repeat[0], repeat[1])
    normalTexture.offset = new Vector2(offset[0], offset[1])
    normalTexture.anisotropy = anisotropy
  }, [normalTexture, anisotropy, repeat, offset])

  return [normalTexture, url, numTot]
}
