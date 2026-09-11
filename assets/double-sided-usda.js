import fs from 'node:fs';
import zlib from 'node:zlib';

export const CARD_W = 0.091; // 91mm
export const CARD_H = 0.055; // 55mm
export const CARD_D = 0.001; // 1mm card thickness
const W = CARD_W / 2;
const H = CARD_H / 2;
const D = CARD_D / 2;

// 12 Triangles (6 faces box: Front, Back, Top, Bottom, Left, Right)
// Box coordinates: -W to +W, -H to +H, -D to +D
// Front Face (+Z): Z = +D
// Back Face (-Z): Z = -D

function p(n) { return n.toFixed(6); }

// Front Face (+Z) & Back Face (-Z) Points
const frontPts = `[(${p(-W)}, ${p(-H)}, ${p(D)}), (${p(W)}, ${p(-H)}, ${p(D)}), (${p(W)}, ${p(H)}, ${p(D)}), (${p(-W)}, ${p(H)}, ${p(D)})]`;
const backPts = `[(${p(W)}, ${p(-H)}, ${p(-D)}), (${p(-W)}, ${p(-H)}, ${p(-D)}), (${p(-W)}, ${p(H)}, ${p(-D)}), (${p(W)}, ${p(H)}, ${p(-D)})]`;

export function generateDoubleSidedUsda() {
  return `#usda 1.0
(
    defaultPrim = "Card"
    metersPerUnit = 1
    upAxis = "Y"
)

def Xform "Card"
{
    def Mesh "FrontFace"
    {
        uniform bool doubleSided = 0
        int[] faceVertexCounts = [3, 3]
        int[] faceVertexIndices = [0, 1, 2, 0, 2, 3]
        point3f[] points = ${frontPts}
        texCoord2f[] primvars:st = [(0, 0.5), (1, 0.5), (1, 1), (0, 1)] (
            interpolation = "vertex"
        )
        uniform token subdivisionScheme = "none"
        rel material:binding = </Card/Materials/MatFront>
    }

    def Mesh "BackFace"
    {
        uniform bool doubleSided = 0
        int[] faceVertexCounts = [3, 3]
        int[] faceVertexIndices = [0, 1, 2, 0, 2, 3]
        point3f[] points = ${backPts}
        texCoord2f[] primvars:st = [(0, 0), (1, 0), (1, 0.5), (0, 0.5)] (
            interpolation = "vertex"
        )
        uniform token subdivisionScheme = "none"
        rel material:binding = </Card/Materials/MatBack>
    }

    def Scope "Materials"
    {
        def Material "MatFront"
        {
            token outputs:surface.connect = </Card/Materials/MatFront/Surface.outputs:surface>
            def Shader "Surface"
            {
                uniform token info:id = "UsdPreviewSurface"
                color3f inputs:diffuseColor.connect = </Card/Materials/MatFront/Texture.outputs:rgb>
                float inputs:roughness = 0.35
                float inputs:metallic = 0.1
                token outputs:surface
            }
            def Shader "Texture"
            {
                uniform token info:id = "UsdUVTexture"
                asset inputs:file = @card.png@
                float2 inputs:st.connect = </Card/Materials/MatFront/Reader.outputs:result>
                float3 outputs:rgb
            }
            def Shader "Reader"
            {
                uniform token info:id = "UsdPrimvarReader_float2"
                token inputs:varname = "st"
                float2 outputs:result
            }
        }

        def Material "MatBack"
        {
            token outputs:surface.connect = </Card/Materials/MatBack/Surface.outputs:surface>
            def Shader "Surface"
            {
                uniform token info:id = "UsdPreviewSurface"
                color3f inputs:diffuseColor.connect = </Card/Materials/MatBack/Texture.outputs:rgb>
                float inputs:roughness = 0.35
                float inputs:metallic = 0.1
                token outputs:surface
            }
            def Shader "Texture"
            {
                uniform token info:id = "UsdUVTexture"
                asset inputs:file = @card.png@
                float2 inputs:st.connect = </Card/Materials/MatBack/Reader.outputs:result>
                float3 outputs:rgb
            }
            def Shader "Reader"
            {
                uniform token info:id = "UsdPrimvarReader_float2"
                token inputs:varname = "st"
                float2 outputs:result
            }
        }
    }
}
`;
}
