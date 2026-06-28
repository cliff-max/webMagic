# particle-image — 图片 3D 粒子云

将上传图片实时转为高质量、可交互、可自由观察的 3D 粒子云。

## 技术栈
React 19 + TypeScript + Vite + three + @react-three/fiber + @react-three/drei + GLSL。

## 目录
- `src/components/ParticleImage/` — 主组件、粒子渲染、交互平面、HUD
- `src/core/` — 图片加载、粒子/深度生成、GPGPU、相机、性能监控
- `src/shaders/` — GPGPU 与渲染着色器
- `src/hooks/` — 数据流编排与指针 3D 投射

## 开发
`npm run dev` 启动；`npm test` 运行单元测试。

## 数据流

```
用户上传图片 / 默认图
  → imageLoader 校验并加载为 HTMLImageElement
    → useImageParticles 调用 ParticleGenerator + DepthGenerator + textureEncode
      → 粒子数据（position / color / index）+ 原始纹理 + GPGPU 纹理
        → useGPGPU 每帧计算 velocity → position
          → Particles 渲染（从 positionTexture 采样）
```

HUD 滑块通过 App.tsx state → ParticleImage props → useEffect / useFrame 写入 GPGPU uniforms / 材质参数。

## 关键参数

| 参数 | 默认值 | 范围 | 说明 |
|------|--------|------|------|
| `particleSize` | 2 | 0.5–6 | 粒子渲染半径 |
| `depthScale` | 40 | 0–120 | 亮度映射到 z 轴的缩放因子 |
| `samplingStep` | 3 | 2–6 | 采样间隔（值越大粒子越少、性能越好） |
| `interactionRadius` | 30 | 5–80 | 鼠标排斥作用半径 |
| `interactionStrength` | 120 | 0–300 | 排斥力度 |
| `returnSpeed` | 8 | 1–20 | 弹簧恢复速度 |
| `damping` | 0.92 | 0.8–0.99 | 速度衰减系数 |
| `opacity` | 1 | 0.1–1 | 全局透明度 |
| `autoRotate` | false | — | 自动旋转开关 |

性能自适应（PerformanceMonitor）：FPS 滑窗 < 45 时自动增大 samplingStep，> 58 且稳定 3 窗后恢复。手动调节与自适应共存。

## 扩展点

- **音乐 uniform**：ShaderSystem 已预留 uniform 注入点，可注入音频频谱数据驱动粒子运动。
- **深度图替换**：DepthGenerator 支持传入自定义深度图（`DepthMapGenerator`），实现法线/深度相机输入。
- **后处理**：在 Particles 组件外层包裹 `@react-three/postprocessing` EffectComposer，添加 Bloom / DOF 等效果。
