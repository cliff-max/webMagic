import { useState } from 'react'

export type HUDState = {
  particleSize: number
  depthScale: number
  samplingStep: number
  interactionRadius: number
  interactionStrength: number
  returnSpeed: number
  damping: number
  opacity: number
  autoRotate: boolean
}

type Props = {
  state: HUDState
  onChange: (patch: Partial<HUDState>) => void
  onUpload: (file: File) => void
  onResetView: () => void
}

const sliderStyle: React.CSSProperties = {
  width: 120, accentColor: '#7aa2ff', background: '#1a1f2e',
}

export default function HUD({ state, onChange, onUpload, onResetView }: Props) {
  const [open, setOpen] = useState(true)

  return (
    <div style={{
      position: 'fixed', top: 16, right: 16, zIndex: 10,
      color: '#cdd6f4', fontFamily: 'system-ui, sans-serif', fontSize: 12,
      background: 'rgba(10,12,20,0.55)', backdropFilter: 'blur(10px)',
      border: '1px solid rgba(122,162,255,0.2)', borderRadius: 12, padding: 12,
      maxWidth: 220,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <strong>粒子云</strong>
        <button onClick={() => setOpen((v) => !v)} style={btnStyle}>{open ? '收起' : '展开'}</button>
      </div>
      {open && (
        <div style={{ display: 'grid', gap: 8 }}>
          <label>上传图片
            <input type="file" accept="image/jpeg,image/png,image/webp"
              onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
          </label>
          <Slider label={`粒子大小 ${state.particleSize.toFixed(1)}`} min={0.5} max={6} step={0.1}
            value={state.particleSize} onChange={(v) => onChange({ particleSize: v })} />
          <Slider label={`深度 ${state.depthScale.toFixed(0)}`} min={0} max={120} step={1}
            value={state.depthScale} onChange={(v) => onChange({ depthScale: v })} />
          <Slider label={`采样步长 ${state.samplingStep}`} min={2} max={6} step={1}
            value={state.samplingStep} onChange={(v) => onChange({ samplingStep: v })} />
          <Slider label={`排斥半径 ${state.interactionRadius.toFixed(0)}`} min={5} max={80} step={1}
            value={state.interactionRadius} onChange={(v) => onChange({ interactionRadius: v })} />
          <Slider label={`排斥强度 ${state.interactionStrength.toFixed(0)}`} min={0} max={300} step={5}
            value={state.interactionStrength} onChange={(v) => onChange({ interactionStrength: v })} />
          <Slider label={`恢复速度 ${state.returnSpeed.toFixed(1)}`} min={1} max={20} step={0.5}
            value={state.returnSpeed} onChange={(v) => onChange({ returnSpeed: v })} />
          <Slider label={`阻尼 ${state.damping.toFixed(2)}`} min={0.8} max={0.99} step={0.01}
            value={state.damping} onChange={(v) => onChange({ damping: v })} />
          <Slider label={`透明度 ${state.opacity.toFixed(2)}`} min={0.1} max={1} step={0.05}
            value={state.opacity} onChange={(v) => onChange({ opacity: v })} />
          <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input type="checkbox" checked={state.autoRotate}
              onChange={(e) => onChange({ autoRotate: e.target.checked })} /> 自动旋转
          </label>
          <button onClick={onResetView} style={btnStyle}>重置视角</button>
        </div>
      )}
    </div>
  )
}

const btnStyle: React.CSSProperties = {
  background: '#1a1f2e', color: '#cdd6f4', border: '1px solid rgba(122,162,255,0.3)',
  borderRadius: 6, padding: '4px 8px', cursor: 'pointer', fontSize: 12,
}

function Slider({ label, min, max, step, value, onChange }: {
  label: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void
}) {
  return (
    <label style={{ display: 'grid', gap: 2 }}>
      {label}
      <input type="range" min={min} max={max} step={step} value={value}
        style={sliderStyle} onChange={(e) => onChange(parseFloat(e.target.value))} />
    </label>
  )
}
