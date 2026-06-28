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
