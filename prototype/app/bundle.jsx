/* GENERATED BUNDLE — do not edit directly. Edit app/*.jsx + the source files, then re-run the concat. */

/* === ios-frame.jsx === */

/* BEGIN USAGE */
// iOS.jsx — Simplified iOS 26 (Liquid Glass) device frame
// Based on the iOS 26 UI Kit + Figma status bar spec. No assets, no deps.
// Exports (to window): IOSDevice, IOSStatusBar, IOSNavBar, IOSGlassPill, IOSList, IOSListRow, IOSKeyboard
//
// Usage — wrap your screen content in <IOSDevice> to get the bezel, status bar
// and home indicator (props: title, dark, keyboard):
//
//   <IOSDevice title="Settings">
//     ...your screen content...
//   </IOSDevice>
//   <IOSDevice dark title="Search" keyboard>…</IOSDevice>
/* END USAGE */

// ─────────────────────────────────────────────────────────────
// Status bar
// ─────────────────────────────────────────────────────────────
function IOSStatusBar({ dark = false, time = '9:41' }) {
  const c = dark ? '#fff' : '#000';
  return (
    <div style={{
      display: 'flex', gap: 154, alignItems: 'center', justifyContent: 'center',
      padding: '21px 24px 19px', boxSizing: 'border-box',
      position: 'relative', zIndex: 20, width: '100%',
    }}>
      <div style={{ flex: 1, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 1.5 }}>
        <span style={{
          fontFamily: '-apple-system, "SF Pro", system-ui', fontWeight: 590,
          fontSize: 17, lineHeight: '22px', color: c,
        }}>{time}</span>
      </div>
      <div style={{ flex: 1, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, paddingTop: 1, paddingRight: 1 }}>
        <svg width="19" height="12" viewBox="0 0 19 12">
          <rect x="0" y="7.5" width="3.2" height="4.5" rx="0.7" fill={c}/>
          <rect x="4.8" y="5" width="3.2" height="7" rx="0.7" fill={c}/>
          <rect x="9.6" y="2.5" width="3.2" height="9.5" rx="0.7" fill={c}/>
          <rect x="14.4" y="0" width="3.2" height="12" rx="0.7" fill={c}/>
        </svg>
        <svg width="17" height="12" viewBox="0 0 17 12">
          <path d="M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z" fill={c}/>
          <path d="M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z" fill={c}/>
          <circle cx="8.5" cy="10.5" r="1.5" fill={c}/>
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke={c} strokeOpacity="0.35" fill="none"/>
          <rect x="2" y="2" width="20" height="9" rx="2" fill={c}/>
          <path d="M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z" fill={c} fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Liquid glass pill — blur + tint + shine
// ─────────────────────────────────────────────────────────────
function IOSGlassPill({ children, dark = false, style = {} }) {
  return (
    <div style={{
      height: 44, minWidth: 44, borderRadius: 9999,
      position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: dark
        ? '0 2px 6px rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.2)'
        : '0 1px 3px rgba(0,0,0,0.07), 0 3px 10px rgba(0,0,0,0.06)',
      ...style,
    }}>
      {/* blur + tint */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 9999,
        backdropFilter: 'blur(12px) saturate(180%)',
        WebkitBackdropFilter: 'blur(12px) saturate(180%)',
        background: dark ? 'rgba(120,120,128,0.28)' : 'rgba(255,255,255,0.5)',
      }} />
      {/* shine */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 9999,
        boxShadow: dark
          ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15), inset -1px -1px 1px rgba(255,255,255,0.08)'
          : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
        border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)',
      }} />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', padding: '0 4px' }}>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Navigation bar — glass pills + large title
// ─────────────────────────────────────────────────────────────
function IOSNavBar({ title = 'Title', dark = false, trailingIcon = true }) {
  const muted = dark ? 'rgba(255,255,255,0.6)' : '#404040';
  const text = dark ? '#fff' : '#000';
  const pillIcon = (content) => (
    <IOSGlassPill dark={dark}>
      <div style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {content}
      </div>
    </IOSGlassPill>
  );
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 10,
      paddingTop: 62, paddingBottom: 10, position: 'relative', zIndex: 5,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px',
      }}>
        {/* back chevron */}
        {pillIcon(
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none" style={{ marginLeft: -1 }}>
            <path d="M10 2L2 10l8 8" stroke={muted} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        {/* trailing ellipsis */}
        {trailingIcon && pillIcon(
          <svg width="22" height="6" viewBox="0 0 22 6">
            <circle cx="3" cy="3" r="2.5" fill={muted}/>
            <circle cx="11" cy="3" r="2.5" fill={muted}/>
            <circle cx="19" cy="3" r="2.5" fill={muted}/>
          </svg>
        )}
      </div>
      {/* large title */}
      <div style={{
        padding: '0 16px',
        fontFamily: '-apple-system, system-ui',
        fontSize: 34, fontWeight: 700, lineHeight: '41px',
        color: text, letterSpacing: 0.4,
      }}>{title}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Grouped list (inset card, r:26) + row (52px)
// ─────────────────────────────────────────────────────────────
function IOSListRow({ title, detail, icon, chevron = true, isLast = false, dark = false }) {
  const text = dark ? '#fff' : '#000';
  const sec = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const ter = dark ? 'rgba(235,235,245,0.3)' : 'rgba(60,60,67,0.3)';
  const sep = dark ? 'rgba(84,84,88,0.65)' : 'rgba(60,60,67,0.12)';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', minHeight: 52,
      padding: '0 16px', position: 'relative',
      fontFamily: '-apple-system, system-ui', fontSize: 17,
      letterSpacing: -0.43,
    }}>
      {icon && (
        <div style={{
          width: 30, height: 30, borderRadius: 7, background: icon,
          marginRight: 12, flexShrink: 0,
        }} />
      )}
      <div style={{ flex: 1, color: text }}>{title}</div>
      {detail && <span style={{ color: sec, marginRight: 6 }}>{detail}</span>}
      {chevron && (
        <svg width="8" height="14" viewBox="0 0 8 14" style={{ flexShrink: 0 }}>
          <path d="M1 1l6 6-6 6" stroke={ter} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {!isLast && (
        <div style={{
          position: 'absolute', bottom: 0, right: 0,
          left: icon ? 58 : 16, height: 0.5, background: sep,
        }} />
      )}
    </div>
  );
}

function IOSList({ header, children, dark = false }) {
  const hc = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const bg = dark ? '#1C1C1E' : '#fff';
  return (
    <div>
      {header && (
        <div style={{
          fontFamily: '-apple-system, system-ui', fontSize: 13,
          color: hc, textTransform: 'uppercase',
          padding: '8px 36px 6px', letterSpacing: -0.08,
        }}>{header}</div>
      )}
      <div style={{
        background: bg, borderRadius: 26,
        margin: '0 16px', overflow: 'hidden',
      }}>{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Device frame
// ─────────────────────────────────────────────────────────────
function IOSDevice({
  children, width = 402, height = 874, dark = false,
  title, keyboard = false,
}) {
  return (
    <div style={{
      width, height, borderRadius: 48, overflow: 'hidden',
      position: 'relative', background: dark ? '#000' : '#F2F2F7',
      boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)',
      fontFamily: '-apple-system, system-ui, sans-serif',
      WebkitFontSmoothing: 'antialiased',
    }}>
      {/* dynamic island */}
      <div style={{
        position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
        width: 126, height: 37, borderRadius: 24, background: '#000', zIndex: 50,
      }} />
      {/* status bar (absolute) */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
        <IOSStatusBar dark={dark} />
      </div>
      {/* nav + content */}
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {title !== undefined && <IOSNavBar title={title} dark={dark} />}
        <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
        {keyboard && <IOSKeyboard dark={dark} />}
      </div>
      {/* home indicator — always on top */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 60,
        height: 34, display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
        paddingBottom: 8, pointerEvents: 'none',
      }}>
        <div style={{
          width: 139, height: 5, borderRadius: 100,
          background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.25)',
        }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Keyboard — iOS 26 liquid glass
// ─────────────────────────────────────────────────────────────
function IOSKeyboard({ dark = false }) {
  const glyph = dark ? 'rgba(255,255,255,0.7)' : '#595959';
  const sugg = dark ? 'rgba(255,255,255,0.6)' : '#333';
  const keyBg = dark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.85)';

  // special-key icons
  const icons = {
    shift: <svg width="19" height="17" viewBox="0 0 19 17"><path d="M9.5 1L1 9.5h4.5V16h8V9.5H18L9.5 1z" fill={glyph}/></svg>,
    del: <svg width="23" height="17" viewBox="0 0 23 17"><path d="M7 1h13a2 2 0 012 2v11a2 2 0 01-2 2H7l-6-7.5L7 1z" fill="none" stroke={glyph} strokeWidth="1.6" strokeLinejoin="round"/><path d="M10 5l7 7M17 5l-7 7" stroke={glyph} strokeWidth="1.6" strokeLinecap="round"/></svg>,
    ret: <svg width="20" height="14" viewBox="0 0 20 14"><path d="M18 1v6H4m0 0l4-4M4 7l4 4" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  };

  const key = (content, { w, flex, ret, fs = 25, k } = {}) => (
    <div key={k} style={{
      height: 42, borderRadius: 8.5,
      flex: flex ? 1 : undefined, width: w, minWidth: 0,
      background: ret ? '#08f' : keyBg,
      boxShadow: '0 1px 0 rgba(0,0,0,0.075)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: '-apple-system, "SF Compact", system-ui',
      fontSize: fs, fontWeight: 458, color: ret ? '#fff' : glyph,
    }}>{content}</div>
  );

  const row = (keys, pad = 0) => (
    <div style={{ display: 'flex', gap: 6.5, justifyContent: 'center', padding: `0 ${pad}px` }}>
      {keys.map(l => key(l, { flex: true, k: l }))}
    </div>
  );

  return (
    <div style={{
      position: 'relative', zIndex: 15, borderRadius: 27, overflow: 'hidden',
      padding: '11px 0 2px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      boxShadow: dark
        ? '0 -2px 20px rgba(0,0,0,0.09)'
        : '0 -1px 6px rgba(0,0,0,0.018), 0 -3px 20px rgba(0,0,0,0.012)',
    }}>
      {/* liquid glass bg — same recipe as nav pills */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 27,
        backdropFilter: 'blur(12px) saturate(180%)',
        WebkitBackdropFilter: 'blur(12px) saturate(180%)',
        background: dark ? 'rgba(120,120,128,0.14)' : 'rgba(255,255,255,0.25)',
      }} />
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 27,
        boxShadow: dark
          ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15)'
          : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
        border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)',
        pointerEvents: 'none',
      }} />

      {/* autocorrect bar */}
      <div style={{
        display: 'flex', gap: 20, alignItems: 'center',
        padding: '8px 22px 13px', width: '100%', boxSizing: 'border-box',
        position: 'relative',
      }}>
        {['"The"', 'the', 'to'].map((w, i) => (
          <React.Fragment key={i}>
            {i > 0 && <div style={{ width: 1, height: 25, background: '#ccc', opacity: 0.3 }} />}
            <div style={{
              flex: 1, textAlign: 'center',
              fontFamily: '-apple-system, system-ui', fontSize: 17,
              color: sugg, letterSpacing: -0.43, lineHeight: '22px',
            }}>{w}</div>
          </React.Fragment>
        ))}
      </div>

      {/* key layout */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 13,
        padding: '0 6.5px', width: '100%', boxSizing: 'border-box',
        position: 'relative',
      }}>
        {row(['q','w','e','r','t','y','u','i','o','p'])}
        {row(['a','s','d','f','g','h','j','k','l'], 20)}
        <div style={{ display: 'flex', gap: 14.25, alignItems: 'center' }}>
          {key(icons.shift, { w: 45, k: 'shift' })}
          <div style={{ display: 'flex', gap: 6.5, flex: 1 }}>
            {['z','x','c','v','b','n','m'].map(l => key(l, { flex: true, k: l }))}
          </div>
          {key(icons.del, { w: 45, k: 'del' })}
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {key('ABC', { w: 92.25, fs: 18, k: 'abc' })}
          {key('', { flex: true, k: 'space' })}
          {key(icons.ret, { w: 92.25, ret: true, k: 'ret' })}
        </div>
      </div>

      {/* bottom spacer (emoji+mic area, icons omitted) */}
      <div style={{ height: 56, width: '100%', position: 'relative' }} />
    </div>
  );
}

Object.assign(window, {
  IOSDevice, IOSStatusBar, IOSNavBar, IOSGlassPill, IOSList, IOSListRow, IOSKeyboard,
});


/* === tweaks-panel.jsx === */

/* BEGIN USAGE */
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
// Exports (to window): useTweaks, TweaksPanel, TweakSection, TweakRow, TweakSlider,
//   TweakToggle, TweakRadio, TweakSelect, TweakText, TweakNumber, TweakColor, TweakButton.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// TweakRadio is the segmented control for 2–3 short options (auto-falls-back to
// TweakSelect past ~16/~10 chars per label); reach for TweakSelect directly when
// options are many or long. For color tweaks always curate 3-4 options rather than
// a free picker; an option can also be a whole 2–5 color palette (the stored value
// is the array). The Tweak* controls are a floor, not a ceiling — build custom
// controls inside the panel if a tweak calls for UI they don't cover.
/* END USAGE */
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null
      ? keyOrEdits : { [keyOrEdits]: val };
    setValues((prev) => ({ ...prev, ...edits }));
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', { detail: edits }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({ title = 'Tweaks', children }) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({ x: 16, y: 16 });
  const PAD = 16;

  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth, h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y)),
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);

  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);

  React.useEffect(() => {
    const onMsg = (e) => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);
      else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
  };

  const onDragStart = (e) => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = (ev) => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy),
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  if (!open) return null;
  return (
    <>
      <style>{__TWEAKS_STYLE}</style>
      <div ref={dragRef} className="twk-panel" data-omelette-chrome=""
           style={{ right: offsetRef.current.x, bottom: offsetRef.current.y }}>
        <div className="twk-hd" onMouseDown={onDragStart}>
          <b>{title}</b>
          <button className="twk-x" aria-label="Close tweaks"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={dismiss}>✕</button>
        </div>
        <div className="twk-body">
          {children}
        </div>
      </div>
    </>
  );
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({ label, children }) {
  return (
    <>
      <div className="twk-sect">{label}</div>
      {children}
    </>
  );
}

function TweakRow({ label, value, children, inline = false }) {
  return (
    <div className={inline ? 'twk-row twk-row-h' : 'twk-row'}>
      <div className="twk-lbl">
        <span>{label}</span>
        {value != null && <span className="twk-val">{value}</span>}
      </div>
      {children}
    </div>
  );
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({ label, value, min = 0, max = 100, step = 1, unit = '', onChange }) {
  return (
    <TweakRow label={label} value={`${value}${unit}`}>
      <input type="range" className="twk-slider" min={min} max={max} step={step}
             value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </TweakRow>
  );
}

function TweakToggle({ label, value, onChange }) {
  return (
    <div className="twk-row twk-row-h">
      <div className="twk-lbl"><span>{label}</span></div>
      <button type="button" className="twk-toggle" data-on={value ? '1' : '0'}
              role="switch" aria-checked={!!value}
              onClick={() => onChange(!value)}><i /></button>
    </div>
  );
}

function TweakRadio({ label, value, options, onChange }) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = (o) => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({ 2: 16, 3: 10 }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = (s) => {
      const m = options.find((o) => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return <TweakSelect label={label} value={value} options={options}
                        onChange={(s) => onChange(resolve(s))} />;
  }
  const opts = options.map((o) => (typeof o === 'object' ? o : { value: o, label: o }));
  const idx = Math.max(0, opts.findIndex((o) => o.value === value));
  const n = opts.length;

  const segAt = (clientX) => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor(((clientX - r.left - 2) / inner) * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };

  const onPointerDown = (e) => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = (ev) => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <TweakRow label={label}>
      <div ref={trackRef} role="radiogroup" onPointerDown={onPointerDown}
           className={dragging ? 'twk-seg dragging' : 'twk-seg'}>
        <div className="twk-seg-thumb"
             style={{ left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
                      width: `calc((100% - 4px) / ${n})` }} />
        {opts.map((o) => (
          <button key={o.value} type="button" role="radio" aria-checked={o.value === value}>
            {o.label}
          </button>
        ))}
      </div>
    </TweakRow>
  );
}

function TweakSelect({ label, value, options, onChange }) {
  return (
    <TweakRow label={label}>
      <select className="twk-field" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => {
          const v = typeof o === 'object' ? o.value : o;
          const l = typeof o === 'object' ? o.label : o;
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
    </TweakRow>
  );
}

function TweakText({ label, value, placeholder, onChange }) {
  return (
    <TweakRow label={label}>
      <input className="twk-field" type="text" value={value} placeholder={placeholder}
             onChange={(e) => onChange(e.target.value)} />
    </TweakRow>
  );
}

function TweakNumber({ label, value, min, max, step = 1, unit = '', onChange }) {
  const clamp = (n) => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({ x: 0, val: 0 });
  const onScrubStart = (e) => {
    e.preventDefault();
    startRef.current = { x: e.clientX, val: value };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = (ev) => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return (
    <div className="twk-num">
      <span className="twk-num-lbl" onPointerDown={onScrubStart}>{label}</span>
      <input type="number" value={value} min={min} max={max} step={step}
             onChange={(e) => onChange(clamp(Number(e.target.value)))} />
      {unit && <span className="twk-num-unit">{unit}</span>}
    </div>
  );
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, (c) => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}

const __TwkCheck = ({ light }) => (
  <svg viewBox="0 0 14 14" aria-hidden="true">
    <path d="M3 7.2 5.8 10 11 4.2" fill="none" strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round"
          stroke={light ? 'rgba(0,0,0,.78)' : '#fff'} />
  </svg>
);

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({ label, value, options, onChange }) {
  if (!options || !options.length) {
    return (
      <div className="twk-row twk-row-h">
        <div className="twk-lbl"><span>{label}</span></div>
        <input type="color" className="twk-swatch" value={value}
               onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = (o) => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return (
    <TweakRow label={label}>
      <div className="twk-chips" role="radiogroup">
        {options.map((o, i) => {
          const colors = Array.isArray(o) ? o : [o];
          const [hero, ...rest] = colors;
          const sup = rest.slice(0, 4);
          const on = key(o) === cur;
          return (
            <button key={i} type="button" className="twk-chip" role="radio"
                    aria-checked={on} data-on={on ? '1' : '0'}
                    aria-label={colors.join(', ')} title={colors.join(' · ')}
                    style={{ background: hero }}
                    onClick={() => onChange(o)}>
              {sup.length > 0 && (
                <span>
                  {sup.map((c, j) => <i key={j} style={{ background: c }} />)}
                </span>
              )}
              {on && <__TwkCheck light={__twkIsLight(hero)} />}
            </button>
          );
        })}
      </div>
    </TweakRow>
  );
}

function TweakButton({ label, onClick, secondary = false }) {
  return (
    <button type="button" className={secondary ? 'twk-btn secondary' : 'twk-btn'}
            onClick={onClick}>{label}</button>
  );
}

Object.assign(window, {
  useTweaks, TweaksPanel, TweakSection, TweakRow,
  TweakSlider, TweakToggle, TweakRadio, TweakSelect,
  TweakText, TweakNumber, TweakColor, TweakButton,
});


/* === app/icons.jsx === */
/* icons.jsx — íconos de línea (stroke), 24×24, currentColor.
   <Icon name="home" size={24} stroke={2} /> */
(function () {
  const P = {
    home: 'M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5',
    users: 'M16 20v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM22 20v-1.5a4 4 0 0 0-3-3.87M16 4.13a4 4 0 0 1 0 7.75',
    calc: 'M6 2.5h12a1.5 1.5 0 0 1 1.5 1.5v16a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 20V4A1.5 1.5 0 0 1 6 2.5ZM8 6.5h8M8 11h0M12 11h0M16 11h0M8 14.5h0M12 14.5h0M16 14.5v3.5M8 18h4',
    calendar: 'M5 4.5h14a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1ZM4 9h16M8 3v3M16 3v3M8.5 14l2 2 4-4',
    history: 'M3.5 12a8.5 8.5 0 1 0 2.6-6.1M4 4.5V8h3.5M12 7.5V12l3 2',
    tag: 'M11 3H5a2 2 0 0 0-2 2v6l9.5 9.5a1.5 1.5 0 0 0 2.1 0l5.9-5.9a1.5 1.5 0 0 0 0-2.1L11 3ZM7.5 8.5h0',
    plus: 'M12 5v14M5 12h14',
    minus: 'M5 12h14',
    chevL: 'M15 5l-7 7 7 7',
    chevR: 'M9 5l7 7-7 7',
    chevD: 'M6 9l6 6 6-6',
    chevU: 'M6 15l6-6 6 6',
    check: 'M5 12.5l4.5 4.5L19 6.5',
    x: 'M6 6l12 12M18 6L6 18',
    search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM20 20l-4-4',
    edit: 'M4 20h4L18.5 9.5a2 2 0 0 0 0-2.8l-1.2-1.2a2 2 0 0 0-2.8 0L4 16v4ZM13.5 6.5l4 4',
    trash: 'M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7v13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7M10 11v6M14 11v6',
    phone: 'M6.5 3.5h-2A1.5 1.5 0 0 0 3 5c0 8.5 7.5 16 16 16a1.5 1.5 0 0 0 1.5-1.5v-2a1 1 0 0 0-.8-1l-3.4-.7a1 1 0 0 0-1 .4l-1 1.3a13 13 0 0 1-6-6l1.3-1a1 1 0 0 0 .4-1l-.7-3.4a1 1 0 0 0-1-.8Z',
    pin: 'M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11ZM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
    idcard: 'M3 5.5h18a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1ZM7.5 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM4.5 16c.5-1.6 2-2.5 3-2.5s2.5.9 3 2.5M14 9.5h5M14 12.5h5M14 15.5h3',
    camera: 'M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1ZM12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z',
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20a7.5 7.5 0 0 1 15 0',
    gear: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19.4 13a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 0 1-4 0v-.2A1.6 1.6 0 0 0 7 19.3a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H1a2 2 0 0 1 0-4h.2A1.6 1.6 0 0 0 2.7 7a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 8 2.7h.1A1.6 1.6 0 0 0 9 1.2V1a2 2 0 0 1 4 0v.2A1.6 1.6 0 0 0 16.9 2.4a1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8v.1A1.6 1.6 0 0 0 22.8 9H23a2 2 0 0 1 0 4h-.2a1.6 1.6 0 0 0-1.4 1Z',
    logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
    arrowR: 'M5 12h14M13 6l6 6-6 6',
    arrowL: 'M19 12H5M11 18l-6-6 6-6',
    coins: 'M8 14.5a6 3 0 1 0 0-6 6 3 0 0 0 0 6ZM2 8.5v3c0 1.7 2.7 3 6 3s6-1.3 6-3v-3M14 11.2c2.8-.2 5-1.4 5-2.9s-2.5-2.8-5.5-2.8c-1.4 0-2.7.3-3.6.7M16 13.8c1.8-.4 3-1.3 3-2.3',
    receipt: 'M6 3h12a1 1 0 0 1 1 1v17l-2.5-1.5L14 21l-2-1.5L10 21l-2.5-1.5L5 21V4a1 1 0 0 1 1-1ZM8.5 8h7M8.5 12h7M8.5 16h4',
    wheat: 'M12 22V8M12 8c0-2 1.5-3.5 3.5-3.5M12 8c0-2-1.5-3.5-3.5-3.5M12 12.5c0-1.6 1.3-3 3-3M12 12.5c0-1.6-1.3-3-3-3M12 17c0-1.6 1.3-3 3-3M12 17c0-1.6-1.3-3-3-3',
    sun: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
    lock: 'M6 10.5h12a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8.5a1 1 0 0 1 1-1ZM8 10.5V8a4 4 0 0 1 8 0v2.5',
    sliders: 'M4 6h10M18 6h2M4 12h2M10 12h10M4 18h8M16 18h4M14 4v4M6 10v4M12 16v4',
    info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v5M12 7.5h0',
    eye: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    eyeoff: 'M9.9 5.2A9.5 9.5 0 0 1 12 5c6 0 9.5 6.5 9.5 6.5a16 16 0 0 1-2.3 3M6.3 7.3A15 15 0 0 0 2.5 12S6 18.5 12 18.5c1 0 1.9-.1 2.7-.4M3 3l18 18M10 10a3 3 0 0 0 4 4',
  };

  function Icon({ name, size = 24, stroke = 1.9, fill = 'none', style, ...rest }) {
    const d = P[name];
    if (!d) return null;
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
        stroke="currentColor" strokeWidth={stroke} strokeLinecap="round"
        strokeLinejoin="round" style={style} {...rest}>
        {d.split('|').map((seg, i) => <path key={i} d={seg} />)}
      </svg>
    );
  }

  window.Icon = Icon;
})();


/* === app/ui.jsx === */
/* ui.jsx — primitivas de interfaz compartidas. Exporta a window.UI */
(function () {
  const { useState, useEffect, useRef } = React;

  const TIPO_COLOR = {
    Panadero: { bg: 'var(--amber-soft)', fg: 'var(--amber-ink)', dot: 'var(--amber)' },
    Tortillero: { bg: 'var(--brown-soft)', fg: 'var(--brown-ink)', dot: 'var(--brown)' },
    Mostrador: { bg: 'var(--green-soft)', fg: 'var(--green-ink)', dot: 'var(--green)' },
  };

  // ── Botón ────────────────────────────────────────────────
  function Button({ children, variant = 'primary', size = 'md', full, icon, style, ...rest }) {
    const base = {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      fontFamily: 'var(--font)', fontWeight: 600, cursor: 'pointer',
      border: '1px solid transparent', borderRadius: 'var(--r-btn)',
      transition: 'transform .12s ease, background .15s ease, box-shadow .15s ease',
      width: full ? '100%' : undefined, whiteSpace: 'nowrap',
      WebkitTapHighlightColor: 'transparent',
    };
    const sizes = {
      sm: { height: 38, padding: '0 14px', fontSize: 14 },
      md: { height: 50, padding: '0 18px', fontSize: 16 },
      lg: { height: 58, padding: '0 22px', fontSize: 17.5 },
    };
    const variants = {
      primary: { background: 'var(--primary)', color: 'var(--on-primary)', boxShadow: '0 1px 2px rgba(80,50,10,.18), 0 6px 16px -8px rgba(120,75,20,.45)' },
      soft: { background: 'var(--primary-soft)', color: 'var(--primary-ink)' },
      ghost: { background: 'transparent', color: 'var(--ink)' },
      outline: { background: 'var(--surface)', color: 'var(--ink)', borderColor: 'var(--line)' },
      danger: { background: 'var(--red-soft)', color: 'var(--red)' },
      dark: { background: 'var(--ink)', color: 'var(--surface)' },
    };
    return (
      <button className="ta-btn" style={{ ...base, ...sizes[size], ...variants[variant], ...style }} {...rest}>
        {icon && <Icon name={icon} size={size === 'sm' ? 17 : 19} stroke={2.1} />}
        {children}
      </button>
    );
  }

  function IconButton({ name, size = 44, stroke = 2, variant = 'plain', style, iconSize, ...rest }) {
    const variants = {
      plain: { background: 'transparent', color: 'var(--ink-2)' },
      surface: { background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--line)' },
      soft: { background: 'var(--primary-soft)', color: 'var(--primary-ink)' },
    };
    return (
      <button className="ta-btn" style={{
        width: size, height: size, borderRadius: 12, flexShrink: 0,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', WebkitTapHighlightColor: 'transparent', ...variants[variant], ...style,
      }} {...rest}>
        <Icon name={name} size={iconSize || Math.round(size * 0.46)} stroke={stroke} />
      </button>
    );
  }

  // ── Avatar ───────────────────────────────────────────────
  function Avatar({ emp, size = 44 }) {
    const initials = (emp.nombre || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
    const c = TIPO_COLOR[emp.tipo] || TIPO_COLOR.Panadero;
    if (emp.foto) return <img src={emp.foto} alt="" style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />;
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%', flexShrink: 0,
        background: c.bg, color: c.fg, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontWeight: 700, fontSize: size * 0.36, letterSpacing: 0.3,
      }}>{initials}</div>
    );
  }

  function TipoBadge({ tipo, size = 'md' }) {
    const c = TIPO_COLOR[tipo] || TIPO_COLOR.Panadero;
    const sm = size === 'sm';
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: c.bg, color: c.fg, borderRadius: 999,
        padding: sm ? '3px 9px' : '5px 11px', fontSize: sm ? 11.5 : 13, fontWeight: 600,
      }}>
        <span style={{ width: sm ? 5 : 6, height: sm ? 5 : 6, borderRadius: 99, background: c.dot }} />
        {tipo}
      </span>
    );
  }

  // ── Campo de texto ───────────────────────────────────────
  function Field({ label, hint, icon, suffix, prefix, style, inputRef, ...rest }) {
    return (
      <label style={{ display: 'block', ...style }}>
        {label && <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 7, paddingLeft: 2 }}>{label}</div>}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface)',
          border: '1px solid var(--line)', borderRadius: 'var(--r-field)', padding: '0 14px',
          height: 52, transition: 'border-color .15s, box-shadow .15s',
        }} className="ta-field">
          {icon && <span style={{ color: 'var(--ink-3)', display: 'flex' }}><Icon name={icon} size={19} /></span>}
          {prefix && <span style={{ color: 'var(--ink-3)', fontSize: 16, fontWeight: 600 }}>{prefix}</span>}
          <input ref={inputRef} style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            fontFamily: 'var(--font)', fontSize: 16.5, color: 'var(--ink)', minWidth: 0, height: '100%',
          }} {...rest} />
          {suffix && <span style={{ color: 'var(--ink-3)', fontSize: 14.5, fontWeight: 600 }}>{suffix}</span>}
        </div>
        {hint && <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 6, paddingLeft: 2 }}>{hint}</div>}
      </label>
    );
  }

  // ── Stepper numérico (+ / −) ─────────────────────────────
  function Stepper({ value, onChange, step = 1, min = 0, max = 999999, big }) {
    const v = +value || 0;
    const dim = big ? 52 : 44;
    const set = (nv) => onChange(Math.max(min, Math.min(max, nv)));
    const btn = (dir) => (
      <button className="ta-btn" onClick={() => set(v + dir * step)} style={{
        width: dim, height: dim, borderRadius: 12, flexShrink: 0, cursor: 'pointer',
        background: 'var(--primary-soft)', color: 'var(--primary-ink)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={dir > 0 ? 'plus' : 'minus'} size={big ? 22 : 19} stroke={2.4} />
      </button>
    );
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {btn(-1)}
        <input inputMode="numeric" value={v === 0 ? '' : v} placeholder="0"
          onChange={(e) => set(parseInt(e.target.value.replace(/\D/g, '')) || 0)}
          style={{
            flex: 1, minWidth: 0, textAlign: 'center', height: dim,
            border: '1px solid var(--line)', borderRadius: 12, background: 'var(--surface)',
            fontFamily: 'var(--font)', fontVariantNumeric: 'tabular-nums',
            fontSize: big ? 24 : 19, fontWeight: 700, color: 'var(--ink)', outline: 'none',
          }} />
        {btn(1)}
      </div>
    );
  }

  // ── Segmented control ────────────────────────────────────
  function Segmented({ value, onChange, options, full }) {
    return (
      <div style={{
        display: 'flex', gap: 4, background: 'var(--surface-2)', border: '1px solid var(--line)',
        borderRadius: 13, padding: 4, width: full ? '100%' : undefined,
      }}>
        {options.map(o => {
          const val = typeof o === 'string' ? o : o.value;
          const lbl = typeof o === 'string' ? o : o.label;
          const on = val === value;
          return (
            <button key={val} className="ta-btn" onClick={() => onChange(val)} style={{
              flex: full ? 1 : undefined, padding: '9px 13px', borderRadius: 10, cursor: 'pointer',
              fontFamily: 'var(--font)', fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap',
              background: on ? 'var(--surface)' : 'transparent',
              color: on ? 'var(--ink)' : 'var(--ink-3)',
              boxShadow: on ? '0 1px 3px rgba(0,0,0,.1)' : 'none',
              transition: 'all .15s ease',
            }}>{lbl}</button>
          );
        })}
      </div>
    );
  }

  // ── Card ─────────────────────────────────────────────────
  function Card({ children, style, pad = 16, onClick }) {
    return (
      <div onClick={onClick} style={{
        background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-card)',
        padding: pad, boxShadow: '0 1px 2px rgba(60,40,10,.04)',
        cursor: onClick ? 'pointer' : undefined, ...style,
      }}>{children}</div>
    );
  }

  function SectionLabel({ children, action }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '4px 4px 10px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 0.6 }}>{children}</div>
        {action}
      </div>
    );
  }

  // ── Bottom sheet / modal ─────────────────────────────────
  function Sheet({ open, onClose, children, title, full }) {
    const [mounted, setMounted] = useState(open);
    const [show, setShow] = useState(false);
    useEffect(() => {
      if (open) { setMounted(true); requestAnimationFrame(() => requestAnimationFrame(() => setShow(true))); }
      else { setShow(false); const t = setTimeout(() => setMounted(false), 260); return () => clearTimeout(t); }
    }, [open]);
    if (!mounted) return null;
    return (
      <div style={{
        position: 'absolute', inset: 0, zIndex: 200, display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
        <div onClick={onClose} style={{
          position: 'absolute', inset: 0, background: 'rgba(40,28,12,.4)',
          opacity: show ? 1 : 0, transition: 'opacity .26s ease', backdropFilter: 'blur(1px)',
        }} />
        <div style={{
          position: 'relative', background: 'var(--bg)', borderRadius: '26px 26px 0 0',
          maxHeight: full ? '94%' : '88%', display: 'flex', flexDirection: 'column',
          transform: show ? 'translateY(0)' : 'translateY(102%)',
          transition: 'transform .3s cubic-bezier(.32,.72,0,1)',
          boxShadow: '0 -10px 40px rgba(40,28,12,.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 4px' }}>
            <div style={{ width: 40 }} />
            <div style={{ position: 'absolute', left: 0, right: 0, top: 8, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
              <div style={{ width: 38, height: 5, borderRadius: 99, background: 'var(--line)' }} />
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)', marginTop: 4 }}>{title}</div>
            <IconButton name="x" size={40} variant="surface" onClick={onClose} iconSize={20} />
          </div>
          <div style={{ overflow: 'auto', padding: '8px 16px 20px', WebkitOverflowScrolling: 'touch' }}>{children}</div>
        </div>
      </div>
    );
  }

  // ── Toast ────────────────────────────────────────────────
  function Toast({ msg }) {
    if (!msg) return null;
    return (
      <div style={{
        position: 'absolute', left: '50%', bottom: 104, transform: 'translateX(-50%)',
        background: 'var(--ink)', color: 'var(--surface)', padding: '12px 20px',
        borderRadius: 999, fontSize: 14.5, fontWeight: 600, zIndex: 300, whiteSpace: 'nowrap',
        boxShadow: '0 8px 24px rgba(0,0,0,.25)', display: 'flex', alignItems: 'center', gap: 8,
        animation: 'taToast .3s ease',
      }}>
        <Icon name="check" size={17} stroke={2.6} /> {msg}
      </div>
    );
  }

  function EmptyState({ icon = 'info', title, sub, action }) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--ink-3)' }}>
        <div style={{ display: 'inline-flex', padding: 18, borderRadius: 20, background: 'var(--surface-2)', color: 'var(--ink-3)', marginBottom: 14 }}>
          <Icon name={icon} size={28} stroke={1.7} />
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink-2)', marginBottom: 6 }}>{title}</div>
        {sub && <div style={{ fontSize: 14, lineHeight: 1.5, maxWidth: 260, margin: '0 auto' }}>{sub}</div>}
        {action && <div style={{ marginTop: 18 }}>{action}</div>}
      </div>
    );
  }

  window.UI = { Button, IconButton, Avatar, TipoBadge, Field, Stepper, Segmented, Card, SectionLabel, Sheet, Toast, EmptyState, TIPO_COLOR };
})();


/* === app/shell.jsx === */
/* shell.jsx — encabezado de pantalla + barra de navegación inferior. window.Shell */
(function () {
  const { Icon } = window;

  // Encabezado fijo (despeja la barra de estado del iPhone)
  function ScreenHeader({ title, subtitle, right, onBack, large, accessory }) {
    return (
      <div style={{
        position: 'sticky', top: 0, zIndex: 30,
        background: 'var(--header-bg)', backdropFilter: 'blur(14px) saturate(160%)',
        WebkitBackdropFilter: 'blur(14px) saturate(160%)',
        borderBottom: '1px solid var(--header-line)',
        padding: '58px 18px 12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 38 }}>
          {onBack && (
            <button className="ta-btn" onClick={onBack} style={{
              width: 38, height: 38, marginLeft: -6, borderRadius: 11, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              background: 'transparent', color: 'var(--primary-ink)',
            }}>
              <Icon name="chevL" size={24} stroke={2.4} />
            </button>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: large ? 27 : 21, color: 'var(--ink)', letterSpacing: -0.5,
              lineHeight: 1.1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{title}</div>
            {subtitle && <div style={{ fontSize: 13.5, color: 'var(--ink-3)', marginTop: 3, fontWeight: 500 }}>{subtitle}</div>}
          </div>
          {right && <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>{right}</div>}
        </div>
        {accessory && <div style={{ marginTop: 12 }}>{accessory}</div>}
      </div>
    );
  }

  const NAV = [
    { key: 'inicio', label: 'Inicio', icon: 'home' },
    { key: 'empleados', label: 'Empleados', icon: 'users' },
    { key: 'nomina', label: 'Nómina', icon: 'calc' },
    { key: 'asistencia', label: 'Asistencia', icon: 'calendar' },
    { key: 'historial', label: 'Historial', icon: 'history' },
  ];

  function BottomNav({ active, onNav }) {
    return (
      <div style={{
        flexShrink: 0, position: 'relative', zIndex: 40,
        background: 'var(--nav-bg)', backdropFilter: 'blur(18px) saturate(180%)',
        WebkitBackdropFilter: 'blur(18px) saturate(180%)',
        borderTop: '1px solid var(--header-line)',
        padding: '8px 6px 30px',
        display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start',
      }}>
        {NAV.map(n => {
          const on = active === n.key;
          const hero = n.key === 'nomina';
          return (
            <button key={n.key} className="ta-btn" onClick={() => onNav(n.key)} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              background: 'transparent', cursor: 'pointer', padding: '4px 0',
              color: on ? 'var(--primary-ink)' : 'var(--ink-3)',
              WebkitTapHighlightColor: 'transparent',
            }}>
              {hero ? (
                <div style={{
                  width: 46, height: 34, marginTop: -2, borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: on ? 'var(--primary)' : 'var(--primary-soft)',
                  color: on ? 'var(--on-primary)' : 'var(--primary-ink)',
                  boxShadow: on ? '0 4px 12px -3px rgba(120,75,20,.5)' : 'none',
                  transition: 'all .18s ease',
                }}>
                  <Icon name={n.icon} size={22} stroke={2.1} />
                </div>
              ) : (
                <Icon name={n.icon} size={24} stroke={on ? 2.3 : 1.9} />
              )}
              <span style={{ fontSize: 10.5, fontWeight: on ? 700 : 600, letterSpacing: 0.1 }}>{n.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  window.Shell = { ScreenHeader, BottomNav, NAV };
})();


/* === app/screens-core.jsx === */
/* screens-core.jsx — Login, Inicio, Empleados, Tarifas. window.Screens (core) */
(function () {
  const { useState, useMemo } = React;
  const S = window.Store, Icon = window.Icon;
  const { Button, IconButton, Avatar, TipoBadge, Field, Segmented, Card, SectionLabel, Sheet, EmptyState } = window.UI;
  const { ScreenHeader } = window.Shell;

  const BRAND = { app: 'TortiApp', negocio: 'Tortillería y Panadería León' };

  // ── Marca / logotipo simple ──────────────────────────────
  function Logo({ size = 64 }) {
    return (
      <div style={{
        width: size, height: size, borderRadius: size * 0.32, flexShrink: 0,
        background: 'linear-gradient(150deg, var(--amber) 0%, var(--brown) 115%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#FFF8EA', boxShadow: '0 8px 22px -8px rgba(120,75,20,.6)',
      }}>
        <Icon name="wheat" size={size * 0.56} stroke={2} />
      </div>
    );
  }

  // ════════════════════════════ LOGIN ════════════════════════════
  function Login({ onLogin }) {
    const [u, setU] = useState('admin');
    const [p, setP] = useState('••••••');
    const [show, setShow] = useState(false);
    return (
      <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', padding: '0 26px', background: 'var(--bg)' }}>
        <div style={{ flex: '0 0 auto', height: 92 }} />
        <div style={{ textAlign: 'center', marginBottom: 38 }}>
          <div style={{ display: 'inline-block' }}><Logo size={76} /></div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 34, color: 'var(--ink)', marginTop: 20, letterSpacing: -1 }}>{BRAND.app}</div>
          <div style={{ fontSize: 15, color: 'var(--ink-3)', marginTop: 4, fontWeight: 500 }}>{BRAND.negocio}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="Usuario" icon="user" value={u} onChange={e => setU(e.target.value)} placeholder="Tu usuario" autoCapitalize="none" />
          <Field label="Contraseña" icon="lock" type={show ? 'text' : 'password'} value={p} onChange={e => setP(e.target.value)} placeholder="Tu contraseña"
            suffix={<span onClick={() => setShow(!show)} style={{ cursor: 'pointer', display: 'flex' }}><Icon name={show ? 'eyeoff' : 'eye'} size={19} /></span>} />
          <Button size="lg" full onClick={onLogin} style={{ marginTop: 8 }}>Entrar</Button>
        </div>
        <div style={{ textAlign: 'center', marginTop: 22, fontSize: 13.5, color: 'var(--primary-ink)', fontWeight: 600 }}>¿Olvidaste tu contraseña?</div>
        <div style={{ flex: 1 }} />
        <div style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--ink-3)', paddingBottom: 30, lineHeight: 1.5 }}>
          Demo — toca <b style={{ color: 'var(--ink-2)' }}>Entrar</b> para continuar
        </div>
      </div>
    );
  }

  // ════════════════════════════ INICIO ════════════════════════════
  function Inicio({ go, onLogout, openTarifas }) {
    const db = S.useDB();
    const week = S.weekId(new Date());
    const activos = db.employees.filter(e => e.activo);
    const nominasSemana = db.nominas.filter(n => n.weekId === week);
    const pendientes = activos.length - new Set(nominasSemana.map(n => n.empId)).size;
    const totalSemana = nominasSemana.reduce((s, n) => s + n.neto, 0);
    const hora = new Date().getHours();
    const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches';

    const counts = S.TIPOS.map(t => ({ t, n: activos.filter(e => e.tipo === t).length }));

    const Quick = ({ icon, label, sub, onClick, hero }) => (
      <button className="ta-btn" onClick={onClick} style={{
        display: 'flex', alignItems: 'center', gap: 13, width: '100%', textAlign: 'left', cursor: 'pointer',
        background: hero ? 'var(--primary)' : 'var(--surface)', color: hero ? 'var(--on-primary)' : 'var(--ink)',
        border: hero ? 'none' : '1px solid var(--line)', borderRadius: 'var(--r-card)', padding: 15,
        boxShadow: hero ? '0 8px 22px -10px rgba(120,75,20,.6)' : '0 1px 2px rgba(60,40,10,.04)',
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 13, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: hero ? 'rgba(255,255,255,.18)' : 'var(--primary-soft)', color: hero ? 'var(--on-primary)' : 'var(--primary-ink)',
        }}><Icon name={icon} size={23} stroke={2} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{label}</div>
          <div style={{ fontSize: 13, marginTop: 1, opacity: hero ? 0.85 : 0.6 }}>{sub}</div>
        </div>
        <Icon name="chevR" size={20} stroke={2.2} style={{ opacity: hero ? 0.8 : 0.4 }} />
      </button>
    );

    return (
      <React.Fragment>
        <ScreenHeader
          title={`${saludo} 👋`} subtitle={S.weekLong(week)} large
          right={<IconButton name="logout" size={42} variant="surface" onClick={onLogout} iconSize={20} />}
        />
        <div style={{ padding: '16px 16px 28px', display: 'flex', flexDirection: 'column', gap: 22 }}>
          {/* Resumen semana */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Card pad={16}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--ink-3)', fontSize: 12.5, fontWeight: 600 }}>
                <Icon name="users" size={16} /> Empleados
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--ink)', marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>{activos.length}</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 2 }}>activos</div>
            </Card>
            <Card pad={16} style={{ background: 'var(--ink)', border: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'rgba(255,255,255,.6)', fontSize: 12.5, fontWeight: 600 }}>
                <Icon name="coins" size={16} /> Pagado esta semana
              </div>
              <div style={{ fontSize: 27, fontWeight: 800, color: '#fff', marginTop: 8, fontVariantNumeric: 'tabular-nums' }}>{S.money0(totalSemana)}</div>
              <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.55)', marginTop: 2 }}>{nominasSemana.length} nómina{nominasSemana.length === 1 ? '' : 's'}</div>
            </Card>
          </div>

          {/* Pendientes */}
          {pendientes > 0 && (
            <button className="ta-btn" onClick={() => go('nomina')} style={{
              display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', cursor: 'pointer',
              background: 'var(--amber-soft)', border: '1px solid var(--amber-line)', borderRadius: 'var(--r-card)', padding: '13px 15px',
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: 'var(--amber)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name="calc" size={21} stroke={2} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--amber-ink)' }}>{pendientes} nómina{pendientes === 1 ? '' : 's'} por calcular</div>
                <div style={{ fontSize: 13, color: 'var(--amber-ink)', opacity: .8 }}>Esta semana</div>
              </div>
              <Icon name="chevR" size={20} stroke={2.2} style={{ color: 'var(--amber-ink)', opacity: .6 }} />
            </button>
          )}

          {/* Accesos rápidos */}
          <div>
            <SectionLabel>Acciones</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Quick hero icon="calc" label="Calcular nómina" sub="Producción, bonos y descuentos" onClick={() => go('nomina')} />
              <Quick icon="calendar" label="Registrar asistencia" sub="Empleados de mostrador" onClick={() => go('asistencia')} />
              <Quick icon="coins" label="Préstamos" sub={`Por cobrar · ${S.money0(S.getSaldoTotal())}`} onClick={() => go('prestamos')} />
              <Quick icon="tag" label="Tarifas y precios" sub="Pan, sacos y sueldo diario" onClick={openTarifas} />
            </div>
          </div>

          {/* Plantilla */}
          <div>
            <SectionLabel action={<span onClick={() => go('empleados')} style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary-ink)', cursor: 'pointer' }}>Ver todos</span>}>Plantilla</SectionLabel>
            <Card pad={0}>
              {counts.map((c, i) => (
                <div key={c.t} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderTop: i ? '1px solid var(--line)' : 'none' }}>
                  <span style={{ width: 9, height: 9, borderRadius: 99, background: window.UI.TIPO_COLOR[c.t].dot }} />
                  <div style={{ flex: 1, fontSize: 15.5, fontWeight: 600, color: 'var(--ink)' }}>{c.t}s</div>
                  <div style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--ink-2)', fontVariantNumeric: 'tabular-nums' }}>{c.n}</div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </React.Fragment>
    );
  }

  // ════════════════════════════ EMPLEADOS ════════════════════════════
  function Empleados({ toast }) {
    const db = S.useDB();
    const [q, setQ] = useState('');
    const [filter, setFilter] = useState('Todos');
    const [editing, setEditing] = useState(null); // emp obj or {} for new or null

    const list = useMemo(() => {
      return db.employees
        .filter(e => filter === 'Todos' || e.tipo === filter)
        .filter(e => e.nombre.toLowerCase().includes(q.toLowerCase()))
        .sort((a, b) => a.nombre.localeCompare(b.nombre));
    }, [db.employees, q, filter]);

    return (
      <React.Fragment>
        <ScreenHeader
          title="Empleados" large
          right={<IconButton name="plus" size={42} variant="soft" stroke={2.4} onClick={() => setEditing({})} />}
          accessory={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Field icon="search" placeholder="Buscar por nombre" value={q} onChange={e => setQ(e.target.value)} style={{ }} />
              <Segmented full value={filter} onChange={setFilter} options={['Todos', ...S.TIPOS]} />
            </div>
          }
        />
        <div style={{ padding: '14px 16px 28px' }}>
          {list.length === 0 ? (
            <EmptyState icon="users" title="Sin empleados" sub="Agrega a tu primer empleado con el botón +"
              action={<Button icon="plus" onClick={() => setEditing({})}>Agregar empleado</Button>} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {list.map(e => (
                <Card key={e.id} pad={13} onClick={() => setEditing(e)} style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                  <Avatar emp={e} size={48} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.nombre}</div>
                    <div style={{ marginTop: 5 }}><TipoBadge tipo={e.tipo} size="sm" /></div>
                  </div>
                  <Icon name="chevR" size={20} stroke={2} style={{ color: 'var(--ink-3)', opacity: .5 }} />
                </Card>
              ))}
            </div>
          )}
        </div>
        <EmpForm emp={editing} onClose={() => setEditing(null)} toast={toast} />
      </React.Fragment>
    );
  }

  function EmpForm({ emp, onClose, toast }) {
    const open = emp != null;
    const isNew = emp && !emp.id;
    const [f, setF] = useState({});
    React.useEffect(() => { if (emp) setF({ tipo: 'Panadero', sueldoDiario: 280, ...emp }); }, [emp]);
    const upd = (k, v) => setF(p => ({ ...p, [k]: v }));
    const save = () => {
      if (!f.nombre || !f.nombre.trim()) { toast('El nombre es obligatorio'); return; }
      S.upsertEmployee(f);
      toast(isNew ? 'Empleado agregado' : 'Cambios guardados');
      onClose();
    };
    const del = () => { S.removeEmployee(f.id); toast('Empleado eliminado'); onClose(); };

    return (
      <Sheet open={open} onClose={onClose} title={isNew ? 'Nuevo empleado' : 'Editar empleado'} full>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Foto */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%', background: 'var(--surface-2)', border: '1.5px dashed var(--line)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-3)', flexShrink: 0,
            }}>
              {f.nombre ? <Avatar emp={f} size={64} /> : <Icon name="camera" size={24} />}
            </div>
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--primary-ink)' }}>Agregar foto</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>Opcional</div>
            </div>
          </div>

          <Field label="Nombre completo *" placeholder="Ej. Ramiro García" value={f.nombre || ''} onChange={e => upd('nombre', e.target.value)} />

          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 7, paddingLeft: 2 }}>Tipo de empleado</div>
            <Segmented full value={f.tipo} onChange={v => upd('tipo', v)} options={S.TIPOS} />
          </div>

          {f.tipo === 'Mostrador' && (
            <Field label="Sueldo diario" prefix="$" inputMode="decimal" value={f.sueldoDiario || ''} onChange={e => upd('sueldoDiario', e.target.value.replace(/[^\d.]/g, ''))} suffix="MXN" />
          )}

          <div style={{ height: 1, background: 'var(--line)', margin: '2px 0' }} />
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 0.6, paddingLeft: 2 }}>Datos opcionales</div>

          <Field label="Fecha de ingreso" type="date" icon="calendar" value={f.fechaIngreso || ''} onChange={e => upd('fechaIngreso', e.target.value)} />
          <Field label="Teléfono" icon="phone" inputMode="tel" placeholder="729 000 0000" value={f.telefono || ''} onChange={e => upd('telefono', e.target.value)} />
          <Field label="NSS" icon="idcard" inputMode="numeric" placeholder="11 dígitos" value={f.nss || ''} onChange={e => upd('nss', e.target.value.replace(/\D/g, ''))} />
          <Field label="Dirección" icon="pin" placeholder="Calle, número, colonia" value={f.direccion || ''} onChange={e => upd('direccion', e.target.value)} />

          <Button size="lg" full onClick={save} style={{ marginTop: 6 }}>{isNew ? 'Agregar empleado' : 'Guardar cambios'}</Button>
          {!isNew && <Button variant="danger" full icon="trash" onClick={del}>Eliminar empleado</Button>}
        </div>
      </Sheet>
    );
  }

  // ════════════════════════════ TARIFAS ════════════════════════════
  function Tarifas({ open, onClose, toast }) {
    const db = S.useDB();
    const [t, setT] = useState(null);
    React.useEffect(() => { if (open) setT(JSON.parse(JSON.stringify(db.tarifas))); }, [open]);
    if (!t) return <Sheet open={open} onClose={onClose} title="Tarifas y precios" />;
    const updPan = (k, v) => setT(p => ({ ...p, pan: { ...p.pan, [k]: v } }));
    const save = () => {
      const clean = { pan: {}, sacoHarina: +t.sacoHarina || 0, sueldoDiarioMostrador: +t.sueldoDiarioMostrador || 0 };
      S.PANES.forEach(p => clean.pan[p.k] = +t.pan[p.k] || 0);
      S.setTarifas(clean); toast('Tarifas actualizadas'); onClose();
    };
    const Money = ({ label, sub, value, onChange, dot }) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0', borderBottom: '1px solid var(--line)' }}>
        {dot && <span style={{ width: 9, height: 9, borderRadius: 99, background: dot, flexShrink: 0 }} />}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--ink)' }}>{label}</div>
          {sub && <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 1 }}>{sub}</div>}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4, background: 'var(--surface-2)', border: '1px solid var(--line)',
          borderRadius: 11, padding: '0 12px', height: 46, width: 116,
        }}>
          <span style={{ color: 'var(--ink-3)', fontWeight: 700, fontSize: 15 }}>$</span>
          <input inputMode="decimal" value={value} onChange={e => onChange(e.target.value.replace(/[^\d.]/g, ''))} style={{
            width: '100%', border: 'none', outline: 'none', background: 'transparent', textAlign: 'right',
            fontFamily: 'var(--font)', fontSize: 17, fontWeight: 700, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums',
          }} />
        </div>
      </div>
    );
    return (
      <Sheet open={open} onClose={onClose} title="Tarifas y precios" full>
        <div style={{ fontSize: 13.5, color: 'var(--ink-3)', lineHeight: 1.5, marginBottom: 14 }}>
          Estos precios se usan al calcular la nómina. Puedes editarlos en cualquier momento.
        </div>

        <SectionLabel>Pan — precio por pieza (panaderos)</SectionLabel>
        <Card pad={16} style={{ marginBottom: 20 }}>
          {S.PANES.map(p => (
            <Money key={p.k} label={p.label} dot="var(--amber)" value={t.pan[p.k]} onChange={v => updPan(p.k, v)} />
          ))}
          <div style={{ height: 0 }} />
        </Card>

        <SectionLabel>Tortilleros</SectionLabel>
        <Card pad={16} style={{ marginBottom: 20 }}>
          <Money label="Precio base por saco" sub="De harina — editable al calcular" dot="var(--brown)" value={t.sacoHarina} onChange={v => setT(p => ({ ...p, sacoHarina: v }))} />
        </Card>

        <SectionLabel>Mostrador</SectionLabel>
        <Card pad={16} style={{ marginBottom: 22 }}>
          <Money label="Sueldo diario predeterminado" sub="Se aplica a empleados nuevos" dot="var(--green)" value={t.sueldoDiarioMostrador} onChange={v => setT(p => ({ ...p, sueldoDiarioMostrador: v }))} />
        </Card>

        <Button size="lg" full onClick={save}>Guardar tarifas</Button>
      </Sheet>
    );
  }

  window.Screens = Object.assign(window.Screens || {}, { Login, Inicio, Empleados, Tarifas, Logo, BRAND });
})();


/* === app/screens-payroll.jsx === */
/* screens-payroll.jsx — Asistencia, Nómina (pantalla estrella, con variaciones), Historial */
(function () {
  const { useState, useMemo, useEffect } = React;
  const S = window.Store, Icon = window.Icon;
  const { Button, IconButton, Avatar, TipoBadge, Field, Stepper, Segmented, Card, SectionLabel, Sheet, EmptyState } = window.UI;
  const { ScreenHeader } = window.Shell;

  // ── Selector de semana ───────────────────────────────────
  function WeekNav({ week, setWeek, compact }) {
    const isThis = week === S.weekId(new Date());
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 13, padding: 5 }}>
        <IconButton name="chevL" size={compact ? 36 : 40} variant="plain" onClick={() => setWeek(S.addWeeks(week, -1))} iconSize={20} />
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>{S.weekLabel(week)}</div>
          <div style={{ fontSize: 11.5, color: isThis ? 'var(--green-ink)' : 'var(--ink-3)', fontWeight: 600 }}>{isThis ? 'Semana actual' : S.weekFromId(week).getFullYear()}</div>
        </div>
        <IconButton name="chevR" size={compact ? 36 : 40} variant="plain" onClick={() => setWeek(S.addWeeks(week, 1))} iconSize={20} disabled={isThis}
          style={{ opacity: isThis ? 0.3 : 1 }} />
      </div>
    );
  }

  // ════════════════════════════ ASISTENCIA ════════════════════════════
  function Asistencia({ toast }) {
    const db = S.useDB();
    const [week, setWeek] = useState(S.weekId(new Date()));
    const mostrador = db.employees.filter(e => e.activo && e.tipo === 'Mostrador');

    return (
      <React.Fragment>
        <ScreenHeader title="Asistencia" large subtitle="Empleados de mostrador"
          accessory={<WeekNav week={week} setWeek={setWeek} />} />
        <div style={{ padding: '16px 16px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mostrador.length === 0 ? (
            <EmptyState icon="calendar" title="Sin empleados de mostrador" sub="La asistencia solo aplica a empleados tipo Mostrador." />
          ) : mostrador.map(e => <AsistRow key={e.id} emp={e} week={week} toast={toast} />)}
          <div style={{ fontSize: 12.5, color: 'var(--ink-3)', textAlign: 'center', marginTop: 4, lineHeight: 1.5 }}>
            Los días marcados se usan automáticamente al calcular la nómina.
          </div>
        </div>
      </React.Fragment>
    );
  }

  function AsistRow({ emp, week, toast }) {
    const arr = S.getAsistencia(week, emp.id);
    const toggle = (i) => { const n = arr.slice(); n[i] = !n[i]; S.setAsistencia(week, emp.id, n); };
    const dias = arr.filter(Boolean).length;
    const pago = dias * (emp.sueldoDiario || 0);
    return (
      <Card pad={15}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <Avatar emp={emp} size={42} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--ink)' }}>{emp.nombre}</div>
            <div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>{S.money0(emp.sueldoDiario)} / día</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 19, fontWeight: 800, color: 'var(--green-ink)', fontVariantNumeric: 'tabular-nums' }}>{dias}/7</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', fontVariantNumeric: 'tabular-nums' }}>{S.money0(pago)}</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 5 }}>
          {S.DAYS.map((d, i) => {
            const on = arr[i];
            return (
              <button key={i} className="ta-btn" onClick={() => toggle(i)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '8px 0', borderRadius: 11, cursor: 'pointer',
                background: on ? 'var(--green)' : 'var(--surface-2)', color: on ? '#fff' : 'var(--ink-3)',
                border: on ? 'none' : '1px solid var(--line)', transition: 'all .15s',
              }}>
                <span style={{ fontSize: 10.5, fontWeight: 700 }}>{d}</span>
                {on ? <Icon name="check" size={15} stroke={3} /> : <span style={{ width: 15, height: 15, borderRadius: 99, border: '1.5px solid var(--line)' }} />}
              </button>
            );
          })}
        </div>
      </Card>
    );
  }

  // ════════════════════════════ NÓMINA (estrella) ════════════════════════════
  function Nomina({ toast, tw }) {
    const db = S.useDB();
    const layout = (tw && tw.payrollLayout) || 'todo';
    const capture = (tw && tw.captureMode) || 'teclado';
    const [week, setWeek] = useState(S.weekId(new Date()));
    const [empId, setEmpId] = useState(null);
    const [prod, setProd] = useState({});
    const [ajustes, setAjustes] = useState({ bonos: [], extras: [], abono: 0, credito: 0 });
    const [step, setStep] = useState(0);

    const emp = db.employees.find(e => e.id === empId);
    const activos = db.employees.filter(e => e.activo);
    const yaCalculada = !!(empId && S.getNomina(empId, week));

    useEffect(() => {
      if (!emp) return;
      const ex = S.getNomina(empId, week);
      if (ex) { setProd(ex.prod); setAjustes(ex.ajustes); return; }
      if (emp.tipo === 'Panadero') setProd({ panes: { dulce: 0, blanco: 0, ajonjoli: 0, galletas: 0 } });
      else if (emp.tipo === 'Tortillero') setProd({ sacos: 0, precioSaco: db.tarifas.sacoHarina });
      else { const a = S.getAsistencia(week, empId); setProd({ dias: a.filter(Boolean).length, sueldoDiario: emp.sueldoDiario || db.tarifas.sueldoDiarioMostrador }); }
      setAjustes({ bonos: [], extras: [], abono: 0, credito: 0 });
      setStep(1);
    }, [empId, week]);

    const res = emp ? S.calc({ tipo: emp.tipo, prod, ajustes, tarifas: db.tarifas }) : null;

    const save = () => {
      const snap = JSON.parse(JSON.stringify(prod));
      if (emp.tipo === 'Panadero') snap.rates = { ...db.tarifas.pan };
      const r = S.calc({ tipo: emp.tipo, prod: snap, ajustes });
      S.saveNomina({ empId, empNombre: emp.nombre, tipo: emp.tipo, weekId: week, prod: snap, ajustes, ...r });
      toast('Nómina guardada');
    };

    // ── Bloques reutilizables ──
    const pickerBlock = (
      <EmployeePicker activos={activos} empId={empId} setEmpId={setEmpId} week={week} setWeek={setWeek} />
    );
    const prodBlock = emp && <Produccion emp={emp} prod={prod} setProd={setProd} capture={capture} tarifas={db.tarifas} res={res} />;
    const ajustesBlock = emp && <Ajustes ajustes={ajustes} setAjustes={setAjustes} />;
    const resumenBlock = emp && <Resumen emp={emp} res={res} prod={prod} />;

    const props = { emp, week, setWeek, empId, layout, capture, yaCalculada, res, save, step, setStep, pickerBlock, prodBlock, ajustesBlock, resumenBlock, toast };

    return (
      <React.Fragment>
        <ScreenHeader title="Nómina semanal" large
          subtitle={emp ? `${emp.nombre} · ${S.weekLabel(week)}` : 'Selecciona un empleado'}
          right={emp ? <IconButton name="x" size={42} variant="surface" iconSize={20} onClick={() => { setEmpId(null); setStep(0); }} /> : null}
        />
        {layout === 'asistente' ? <WizardLayout {...props} /> : layout === 'acordeon' ? <AcordeonLayout {...props} /> : <TodoLayout {...props} />}
      </React.Fragment>
    );
  }

  // ── Selección de empleado + semana ──
  function EmployeePicker({ activos, empId, setEmpId, week, setWeek }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <WeekNav week={week} setWeek={setWeek} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {activos.map(e => {
            const on = e.id === empId;
            const done = !!S.getNomina(e.id, week);
            return (
              <button key={e.id} className="ta-btn" onClick={() => setEmpId(e.id)} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: 12, cursor: 'pointer', textAlign: 'left',
                background: on ? 'var(--primary-soft)' : 'var(--surface)',
                border: '1px solid ' + (on ? 'var(--amber-line)' : 'var(--line)'), borderRadius: 'var(--r-card)',
              }}>
                <Avatar emp={e} size={44} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--ink)' }}>{e.nombre}</div>
                  <div style={{ marginTop: 4 }}><TipoBadge tipo={e.tipo} size="sm" /></div>
                </div>
                {done ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12.5, fontWeight: 700, color: 'var(--green-ink)', background: 'var(--green-soft)', padding: '5px 9px', borderRadius: 99 }}>
                    <Icon name="check" size={13} stroke={3} /> Lista
                  </span>
                ) : <Icon name={on ? 'check' : 'chevR'} size={20} stroke={on ? 3 : 2} style={{ color: on ? 'var(--primary-ink)' : 'var(--ink-3)' }} />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Producción (según captureMode) ──
  function Produccion({ emp, prod, setProd, capture, tarifas, res }) {
    if (emp.tipo === 'Panadero') return <ProdPanadero prod={prod} setProd={setProd} capture={capture} tarifas={tarifas} />;
    if (emp.tipo === 'Tortillero') return <ProdTortillero prod={prod} setProd={setProd} capture={capture} tarifas={tarifas} />;
    return <ProdMostrador prod={prod} setProd={setProd} emp={emp} capture={capture} />;
  }

  function ProdPanadero({ prod, setProd, capture, tarifas }) {
    const set = (k, v) => setProd(p => ({ ...p, panes: { ...p.panes, [k]: Math.max(0, v) } }));
    const panes = prod.panes || {};
    const total = S.PANES.reduce((s, p) => s + (panes[p.k] || 0) * tarifas.pan[p.k], 0);

    if (capture === 'tabla') {
      return (
        <Card pad={0} style={{ overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 84px 92px', padding: '11px 14px', background: 'var(--surface-2)', fontSize: 11.5, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 0.4 }}>
            <span>Tipo de pan</span><span style={{ textAlign: 'center' }}>Piezas</span><span style={{ textAlign: 'right' }}>Subtotal</span>
          </div>
          {S.PANES.map((p, i) => {
            const u = panes[p.k] || 0;
            return (
              <div key={p.k} style={{ display: 'grid', gridTemplateColumns: '1fr 84px 92px', alignItems: 'center', padding: '10px 14px', borderTop: '1px solid var(--line)' }}>
                <div><div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{p.label}</div><div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{S.money(tarifas.pan[p.k])} c/u</div></div>
                <input inputMode="numeric" value={u === 0 ? '' : u} placeholder="0" onChange={e => set(p.k, parseInt(e.target.value.replace(/\D/g, '')) || 0)}
                  style={{ width: '100%', height: 40, textAlign: 'center', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--surface-2)', fontFamily: 'var(--font)', fontSize: 17, fontWeight: 700, color: 'var(--ink)', outline: 'none', fontVariantNumeric: 'tabular-nums' }} />
                <div style={{ textAlign: 'right', fontSize: 14.5, fontWeight: 700, color: u ? 'var(--ink)' : 'var(--ink-3)', fontVariantNumeric: 'tabular-nums' }}>{S.money0(u * tarifas.pan[p.k])}</div>
              </div>
            );
          })}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 14px', borderTop: '2px solid var(--line)', background: 'var(--surface-2)' }}>
            <span style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--ink-2)' }}>Total producción</span>
            <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--amber-ink)', fontVariantNumeric: 'tabular-nums' }}>{S.money(total)}</span>
          </div>
        </Card>
      );
    }
    // stepper / teclado: tarjeta por tipo
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {S.PANES.map(p => {
          const u = panes[p.k] || 0;
          return (
            <Card key={p.k} pad={14}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 11 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 99, background: 'var(--amber)', flexShrink: 0 }} />
                  <span style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap' }}>{p.label}</span>
                </div>
                <span style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 600 }}>{S.money(tarifas.pan[p.k])} c/u → <b style={{ color: 'var(--amber-ink)' }}>{S.money0(u * tarifas.pan[p.k])}</b></span>
              </div>
              {capture === 'stepper'
                ? <Stepper big value={u} step={25} onChange={v => set(p.k, v)} />
                : <BigNumber value={u} onChange={v => set(p.k, v)} suffix="piezas" />}
            </Card>
          );
        })}
      </div>
    );
  }

  function ProdTortillero({ prod, setProd, capture, tarifas }) {
    const sacos = prod.sacos || 0;
    const precio = prod.precioSaco != null ? prod.precioSaco : tarifas.sacoHarina;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Card pad={14}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 11 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: 99, background: 'var(--brown)' }} />
              <span style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--ink)' }}>Sacos producidos</span>
            </div>
            <span style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 600 }}>esta semana</span>
          </div>
          {capture === 'tabla'
            ? <TablaSingle label="Sacos de harina" sub={`${S.money(precio)} por saco`} value={sacos} onChange={v => setProd(p => ({ ...p, sacos: v }))} sub2={S.money0(sacos * precio)} />
            : capture === 'stepper'
              ? <Stepper big value={sacos} step={1} onChange={v => setProd(p => ({ ...p, sacos: v }))} />
              : <BigNumber value={sacos} onChange={v => setProd(p => ({ ...p, sacos: v }))} suffix="sacos" />}
        </Card>
        <Card pad={14}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--ink)' }}>Precio por saco</div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 1 }}>Editable solo para esta nómina</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 11, padding: '0 12px', height: 48, width: 118 }}>
              <span style={{ color: 'var(--ink-3)', fontWeight: 700 }}>$</span>
              <input inputMode="decimal" value={precio} onChange={e => setProd(p => ({ ...p, precioSaco: e.target.value.replace(/[^\d.]/g, '') }))}
                style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', textAlign: 'right', fontFamily: 'var(--font)', fontSize: 17, fontWeight: 700, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }} />
            </div>
          </div>
        </Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 6px', fontSize: 14.5 }}>
          <span style={{ fontWeight: 600, color: 'var(--ink-2)' }}>{sacos} sacos × {S.money(precio)}</span>
          <span style={{ fontWeight: 800, color: 'var(--brown-ink)', fontVariantNumeric: 'tabular-nums' }}>{S.money(sacos * precio)}</span>
        </div>
      </div>
    );
  }

  function ProdMostrador({ prod, setProd, emp, capture }) {
    const dias = prod.dias || 0;
    const sd = prod.sueldoDiario != null ? prod.sueldoDiario : emp.sueldoDiario;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Card pad={14}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 11 }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: 'var(--green)' }} />
            <span style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--ink)' }}>Días asistidos</span>
            <span style={{ marginLeft: 'auto', fontSize: 11.5, color: 'var(--green-ink)', background: 'var(--green-soft)', padding: '3px 8px', borderRadius: 99, fontWeight: 700 }}>desde asistencia</span>
          </div>
          {capture === 'stepper'
            ? <Stepper big value={dias} step={1} min={0} max={7} onChange={v => setProd(p => ({ ...p, dias: v }))} />
            : <BigNumber value={dias} max={7} onChange={v => setProd(p => ({ ...p, dias: Math.min(7, v) }))} suffix="de 7 días" />}
        </Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 6px', fontSize: 14.5 }}>
          <span style={{ fontWeight: 600, color: 'var(--ink-2)' }}>{dias} días × {S.money(sd)}</span>
          <span style={{ fontWeight: 800, color: 'var(--green-ink)', fontVariantNumeric: 'tabular-nums' }}>{S.money(dias * sd)}</span>
        </div>
      </div>
    );
  }

  // input numérico grande (teclado)
  function BigNumber({ value, onChange, suffix, max }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 13, padding: '0 16px', height: 60 }}>
        <input inputMode="numeric" value={value === 0 ? '' : value} placeholder="0"
          onChange={e => { let v = parseInt(e.target.value.replace(/\D/g, '')) || 0; if (max) v = Math.min(max, v); onChange(v); }}
          style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font)', fontSize: 30, fontWeight: 800, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }} />
        <span style={{ fontSize: 14, color: 'var(--ink-3)', fontWeight: 600, flexShrink: 0 }}>{suffix}</span>
      </div>
    );
  }

  function TablaSingle({ label, sub, value, onChange, sub2 }) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 84px 92px', alignItems: 'center', gap: 8 }}>
        <div><div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{label}</div><div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{sub}</div></div>
        <input inputMode="numeric" value={value === 0 ? '' : value} placeholder="0" onChange={e => onChange(parseInt(e.target.value.replace(/\D/g, '')) || 0)}
          style={{ width: '100%', height: 40, textAlign: 'center', border: '1px solid var(--line)', borderRadius: 10, background: 'var(--surface-2)', fontFamily: 'var(--font)', fontSize: 17, fontWeight: 700, color: 'var(--ink)', outline: 'none', fontVariantNumeric: 'tabular-nums' }} />
        <div style={{ textAlign: 'right', fontSize: 14.5, fontWeight: 700, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>{sub2}</div>
      </div>
    );
  }

  // ── Ajustes (bonos / extras / descuentos) ──
  function Ajustes({ ajustes, setAjustes }) {
    const addItem = (key) => setAjustes(a => ({ ...a, [key]: [...(a[key] || []), { desc: '', monto: '' }] }));
    const updItem = (key, i, field, v) => setAjustes(a => { const arr = a[key].slice(); arr[i] = { ...arr[i], [field]: v }; return { ...a, [key]: arr }; });
    const delItem = (key, i) => setAjustes(a => ({ ...a, [key]: a[key].filter((_, j) => j !== i) }));

    const ItemList = ({ keyName, label, icon, color, placeholder }) => (
      <Card pad={14}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: (ajustes[keyName] || []).length ? 12 : 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ display: 'inline-flex', width: 26, height: 26, borderRadius: 8, background: color.soft, color: color.ink, alignItems: 'center', justifyContent: 'center' }}><Icon name={icon} size={16} stroke={2.2} /></span>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{label}</span>
          </div>
          <button className="ta-btn" onClick={() => addItem(keyName)} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13.5, fontWeight: 700, color: 'var(--primary-ink)', background: 'transparent', cursor: 'pointer' }}>
            <Icon name="plus" size={16} stroke={2.4} /> Agregar
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {(ajustes[keyName] || []).map((it, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input placeholder={placeholder} value={it.desc} onChange={e => updItem(keyName, i, 'desc', e.target.value)}
                style={{ flex: 1, minWidth: 0, height: 46, border: '1px solid var(--line)', borderRadius: 11, background: 'var(--surface-2)', padding: '0 12px', fontFamily: 'var(--font)', fontSize: 15, color: 'var(--ink)', outline: 'none' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 11, padding: '0 10px', height: 46, width: 100, flexShrink: 0 }}>
                <span style={{ color: 'var(--ink-3)', fontWeight: 700, fontSize: 14 }}>$</span>
                <input inputMode="decimal" placeholder="0" value={it.monto} onChange={e => updItem(keyName, i, 'monto', e.target.value.replace(/[^\d.]/g, ''))}
                  style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', textAlign: 'right', fontFamily: 'var(--font)', fontSize: 15.5, fontWeight: 700, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }} />
              </div>
              <button className="ta-btn" onClick={() => delItem(keyName, i)} style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: 'transparent', color: 'var(--ink-3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="x" size={18} /></button>
            </div>
          ))}
        </div>
      </Card>
    );

    const Deduc = ({ keyName, label, sub }) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0', borderBottom: keyName === 'abono' ? '1px solid var(--line)' : 'none' }}>
        <span style={{ display: 'inline-flex', width: 26, height: 26, borderRadius: 8, background: 'var(--red-soft)', color: 'var(--red)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="minus" size={16} stroke={2.6} /></span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{label}</div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{sub}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 11, padding: '0 11px', height: 46, width: 110 }}>
          <span style={{ color: 'var(--red)', fontWeight: 700, fontSize: 14 }}>−$</span>
          <input inputMode="decimal" placeholder="0" value={ajustes[keyName] || ''} onChange={e => setAjustes(a => ({ ...a, [keyName]: e.target.value.replace(/[^\d.]/g, '') }))}
            style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', textAlign: 'right', fontFamily: 'var(--font)', fontSize: 16, fontWeight: 700, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }} />
        </div>
      </div>
    );

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <SectionLabel>Ingresos adicionales</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <ItemList keyName="bonos" label="Bonos" icon="plus" color={{ soft: 'var(--green-soft)', ink: 'var(--green-ink)' }} placeholder="Ej. Bono de puntualidad" />
            <ItemList keyName="extras" label="Conceptos extra" icon="plus" color={{ soft: 'var(--green-soft)', ink: 'var(--green-ink)' }} placeholder="Ej. Hora extra domingo" />
          </div>
        </div>
        <div>
          <SectionLabel>Descuentos</SectionLabel>
          <Card pad={14}>
            <Deduc keyName="abono" label="Abono a préstamo" sub="Monto variable cada semana" />
            <Deduc keyName="credito" label="Crédito de tienda" sub="Lo que tomó de la tienda" />
          </Card>
        </div>
      </div>
    );
  }

  // ── Resumen / desglose ──
  function Resumen({ emp, res, prod }) {
    const Row = ({ label, val, neg, strong, sub }) => (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0' }}>
        <div><span style={{ fontSize: strong ? 15.5 : 14.5, fontWeight: strong ? 700 : 500, color: strong ? 'var(--ink)' : 'var(--ink-2)' }}>{label}</span>{sub && <span style={{ fontSize: 12.5, color: 'var(--ink-3)', marginLeft: 7 }}>{sub}</span>}</div>
        <span style={{ fontSize: 15, fontWeight: 700, color: neg ? 'var(--red)' : 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>{neg ? '−' : ''}{S.money(Math.abs(val))}</span>
      </div>
    );
    return (
      <Card pad={16}>
        <div style={{ borderBottom: '1px solid var(--line)', paddingBottom: 4 }}>
          {res.baseLineas.filter(l => l.qty > 0).map((l, i) => (
            <Row key={i} label={l.label} sub={`${S.num(l.qty)} × ${S.money(l.rate)}`} val={l.sub} />
          ))}
          {res.base === 0 && <div style={{ fontSize: 13.5, color: 'var(--ink-3)', padding: '6px 0' }}>Sin producción registrada</div>}
        </div>
        {res.bonos > 0 && <Row label="Bonos" val={res.bonos} />}
        {res.extras > 0 && <Row label="Conceptos extra" val={res.extras} />}
        {res.abono > 0 && <Row label="Abono a préstamo" val={res.abono} neg />}
        {res.credito > 0 && <Row label="Crédito de tienda" val={res.credito} neg />}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, paddingTop: 14, borderTop: '2px solid var(--line)' }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>Total neto</span>
          <span style={{ fontSize: 27, fontWeight: 800, color: 'var(--primary-ink)', fontVariantNumeric: 'tabular-nums' }}>{S.money(res.neto)}</span>
        </div>
      </Card>
    );
  }

  // ── Barra fija de total ──
  function TotalBar({ res, save, yaCalculada, extra }) {
    return (
      <div style={{ position: 'sticky', bottom: 0, zIndex: 20, background: 'var(--nav-bg)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderTop: '1px solid var(--header-line)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: extra ? '0 0 auto' : 1 }}>
          <div style={{ fontSize: 11.5, color: 'var(--ink-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>Total neto</div>
          <div style={{ fontSize: 23, fontWeight: 800, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>{S.money(res.neto)}</div>
        </div>
        {extra}
        {!extra && <Button size="lg" icon={yaCalculada ? 'check' : 'receipt'} onClick={save} style={{ flexShrink: 0 }}>{yaCalculada ? 'Actualizar' : 'Guardar'}</Button>}
      </div>
    );
  }

  function StepTitle({ n, total, title, sub }) {
    return (
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--primary-ink)', letterSpacing: 0.4 }}>PASO {n} DE {total}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 21, fontWeight: 800, color: 'var(--ink)', marginTop: 3 }}>{title}</div>
        {sub && <div style={{ fontSize: 13.5, color: 'var(--ink-3)', marginTop: 2 }}>{sub}</div>}
      </div>
    );
  }

  function SecHead({ icon, title, right }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, margin: '4px 4px 12px' }}>
        <span style={{ display: 'inline-flex', width: 30, height: 30, borderRadius: 9, background: 'var(--primary-soft)', color: 'var(--primary-ink)', alignItems: 'center', justifyContent: 'center' }}><Icon name={icon} size={18} stroke={2.1} /></span>
        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{title}</span>
        {right && <span style={{ marginLeft: 'auto' }}>{right}</span>}
      </div>
    );
  }

  // ════ LAYOUT A — Todo en uno ════
  function TodoLayout({ emp, pickerBlock, prodBlock, ajustesBlock, resumenBlock, res, save, yaCalculada }) {
    if (!emp) return <div style={{ padding: '16px 16px 28px' }}><EmployeePickerWrap>{pickerBlock}</EmployeePickerWrap></div>;
    return (
      <React.Fragment>
        <div style={{ padding: '16px 16px 24px', display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div><SecHead icon={emp.tipo === 'Tortillero' ? 'tag' : 'coins'} title="Producción" />{prodBlock}</div>
          <div>{ajustesBlock}</div>
          <div><SecHead icon="receipt" title="Resumen" />{resumenBlock}</div>
        </div>
        <TotalBar res={res} save={save} yaCalculada={yaCalculada} />
      </React.Fragment>
    );
  }

  function EmployeePickerWrap({ children }) {
    return <React.Fragment><SecHead icon="users" title="¿De quién es la nómina?" />{children}</React.Fragment>;
  }

  // ════ LAYOUT B — Asistente (wizard) ════
  function WizardLayout({ emp, step, setStep, pickerBlock, prodBlock, ajustesBlock, resumenBlock, res, save, yaCalculada, empId }) {
    const steps = ['Empleado', 'Producción', 'Ajustes', 'Resumen'];
    const cur = !empId ? 0 : step;
    const canNext = cur === 0 ? !!empId : true;

    return (
      <React.Fragment>
        {/* progreso */}
        <div style={{ display: 'flex', gap: 6, padding: '14px 16px 4px' }}>
          {steps.map((s, i) => (
            <div key={i} style={{ flex: 1, height: 5, borderRadius: 99, background: i <= cur ? 'var(--primary)' : 'var(--line)', transition: 'background .2s' }} />
          ))}
        </div>
        <div style={{ padding: '12px 16px 24px' }}>
          {cur === 0 && <React.Fragment><StepTitle n={1} total={4} title="¿De quién es la nómina?" sub="Elige la semana y el empleado" />{pickerBlock}</React.Fragment>}
          {cur === 1 && <React.Fragment><StepTitle n={2} total={4} title="Producción" sub={emp && emp.tipo === 'Panadero' ? 'Piezas producidas por tipo' : emp && emp.tipo === 'Tortillero' ? 'Sacos de harina' : 'Días asistidos'} />{prodBlock}</React.Fragment>}
          {cur === 2 && <React.Fragment><StepTitle n={3} total={4} title="Bonos y descuentos" sub="Opcional" />{ajustesBlock}</React.Fragment>}
          {cur === 3 && <React.Fragment><StepTitle n={4} total={4} title="Resumen" sub="Revisa antes de guardar" />{resumenBlock}</React.Fragment>}
        </div>
        {/* footer */}
        <div style={{ position: 'sticky', bottom: 0, zIndex: 20, background: 'var(--nav-bg)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', borderTop: '1px solid var(--header-line)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          {cur > 0 && <Button variant="outline" size="lg" icon="chevL" onClick={() => setStep(cur - 1)} style={{ flexShrink: 0 }}>Atrás</Button>}
          {cur < 3
            ? <Button size="lg" full onClick={() => canNext && setStep(cur + 1)} style={{ opacity: canNext ? 1 : 0.5 }}>Continuar</Button>
            : <Button size="lg" full icon={yaCalculada ? 'check' : 'receipt'} onClick={save}>{yaCalculada ? 'Actualizar nómina' : 'Guardar nómina'} · {S.money0(res.neto)}</Button>}
        </div>
      </React.Fragment>
    );
  }

  // ════ LAYOUT C — Acordeón ════
  function AcordeonLayout({ emp, pickerBlock, prodBlock, ajustesBlock, resumenBlock, res, save, yaCalculada, empId }) {
    const [openSec, setOpenSec] = useState('emp');
    useEffect(() => { if (empId) setOpenSec('prod'); }, [empId]);

    const Acc = ({ id, icon, title, summary, children }) => {
      const on = openSec === id;
      return (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 'var(--r-card)', overflow: 'hidden' }}>
          <button className="ta-btn" onClick={() => setOpenSec(on ? '' : id)} style={{ display: 'flex', alignItems: 'center', gap: 11, width: '100%', padding: 15, cursor: 'pointer', background: 'transparent', textAlign: 'left' }}>
            <span style={{ display: 'inline-flex', width: 32, height: 32, borderRadius: 9, background: 'var(--primary-soft)', color: 'var(--primary-ink)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name={icon} size={18} stroke={2.1} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--ink)' }}>{title}</div>
              {summary && <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{summary}</div>}
            </div>
            <Icon name="chevD" size={20} stroke={2.2} style={{ color: 'var(--ink-3)', transform: on ? 'rotate(180deg)' : 'none', transition: 'transform .2s', flexShrink: 0 }} />
          </button>
          {on && <div style={{ padding: '0 14px 16px' }}>{children}</div>}
        </div>
      );
    };

    return (
      <React.Fragment>
        <div style={{ padding: '16px 16px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Acc id="emp" icon="users" title="Empleado y semana" summary={emp ? emp.nombre : 'Sin seleccionar'}>{pickerBlock}</Acc>
          {emp && <Acc id="prod" icon="coins" title="Producción" summary={S.money(res.base) + ' en producción'}>{prodBlock}</Acc>}
          {emp && <Acc id="ajustes" icon="sliders" title="Bonos y descuentos" summary={`+${S.money0(res.bonos + res.extras)} · −${S.money0(res.deducciones)}`}>{ajustesBlock}</Acc>}
          {emp && <Acc id="resumen" icon="receipt" title="Resumen" summary={'Neto ' + S.money(res.neto)}>{resumenBlock}</Acc>}
        </div>
        {emp && <TotalBar res={res} save={save} yaCalculada={yaCalculada} />}
      </React.Fragment>
    );
  }

  // ════════════════════════════ HISTORIAL ════════════════════════════
  function Historial() {
    const db = S.useDB();
    const [mode, setMode] = useState('semana'); // semana | empleado
    const [detail, setDetail] = useState(null);

    const sorted = [...db.nominas].sort((a, b) => (a.weekId < b.weekId ? 1 : a.weekId > b.weekId ? -1 : a.empNombre.localeCompare(b.empNombre)));
    const groups = useMemo(() => {
      const m = {};
      sorted.forEach(n => { const k = mode === 'semana' ? n.weekId : n.empId; (m[k] = m[k] || []).push(n); });
      return Object.entries(m);
    }, [sorted, mode]);

    return (
      <React.Fragment>
        <ScreenHeader title="Historial" large
          accessory={<Segmented full value={mode} onChange={setMode} options={[{ value: 'semana', label: 'Por semana' }, { value: 'empleado', label: 'Por empleado' }]} />} />
        <div style={{ padding: '16px 16px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {groups.length === 0 ? (
            <EmptyState icon="history" title="Sin nóminas aún" sub="Las nóminas que guardes aparecerán aquí, filtrables por semana o empleado." />
          ) : groups.map(([key, items]) => {
            const total = items.reduce((s, n) => s + n.neto, 0);
            const head = mode === 'semana' ? S.weekLabel(key) : (db.employees.find(e => e.id === key) || {}).nombre || items[0].empNombre;
            const sub = mode === 'semana' ? `${items.length} pago${items.length === 1 ? '' : 's'}` : `${items.length} semana${items.length === 1 ? '' : 's'}`;
            return (
              <div key={key}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '0 4px 10px' }}>
                  <div><div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap' }}>{head}</div><div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 1 }}>{sub}</div></div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink-2)', fontVariantNumeric: 'tabular-nums' }}>{S.money0(total)}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {items.map(n => {
                    const emp = db.employees.find(e => e.id === n.empId) || { nombre: n.empNombre, tipo: n.tipo };
                    return (
                      <Card key={n.id} pad={13} onClick={() => setDetail(n)} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Avatar emp={emp} size={42} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{mode === 'semana' ? n.empNombre : S.weekLabel(n.weekId)}</div>
                          <div style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>{n.tipo}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>{S.money(n.neto)}</div>
                          {n.deducciones > 0 && <div style={{ fontSize: 11.5, color: 'var(--red)', fontVariantNumeric: 'tabular-nums' }}>−{S.money0(n.deducciones)} desc.</div>}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <DetailSheet n={detail} onClose={() => setDetail(null)} db={db} />
      </React.Fragment>
    );
  }

  function DetailSheet({ n, onClose, db }) {
    const emp = n && (db.employees.find(e => e.id === n.empId) || { nombre: n.empNombre, tipo: n.tipo });
    return (
      <Sheet open={!!n} onClose={onClose} title="Detalle de nómina">
        {n && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
              <Avatar emp={emp} size={52} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)' }}>{n.empNombre}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>{n.tipo} · {S.weekLong(n.weekId)}</div>
              </div>
            </div>
            <Resumen emp={emp} res={n} prod={n.prod} />
          </div>
        )}
      </Sheet>
    );
  }

  window.Screens = Object.assign(window.Screens || {}, { Asistencia, Nomina, Historial });
})();


/* === app/screens-prestamos.jsx === */
/* screens-prestamos.jsx — Préstamos: libro de adeudos por empleado. */
(function () {
  const { useState } = React;
  const S = window.Store, Icon = window.Icon;
  const { Button, IconButton, Avatar, TipoBadge, Field, Segmented, Card, SectionLabel, Sheet, EmptyState } = window.UI;
  const { ScreenHeader } = window.Shell;

  const fmtDate = (iso) => { const d = new Date(iso); return `${d.getDate()} ${S.MONTHS[d.getMonth()]} ${d.getFullYear()}`; };

  function Prestamos({ onBack, toast }) {
    const db = S.useDB();
    const [detailId, setDetailId] = useState(null);
    const [form, setForm] = useState(null); // { empId, tipo } or null

    const total = S.getSaldoTotal();
    const conDeuda = db.employees.filter(e => S.getSaldo(e.id) > 0.005)
      .sort((a, b) => S.getSaldo(b.id) - S.getSaldo(a.id));

    return (
      <React.Fragment>
        <ScreenHeader title="Préstamos" subtitle="Adeudos de empleados" large onBack={onBack}
          right={<IconButton name="plus" size={42} variant="soft" stroke={2.4} onClick={() => setForm({ empId: '', tipo: 'prestamo' })} />} />
        <div style={{ padding: '16px 16px 28px', display: 'flex', flexDirection: 'column', gap: 22 }}>
          {/* Resumen */}
          <Card pad={18} style={{ background: 'var(--ink)', border: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'rgba(255,255,255,.6)', fontSize: 12.5, fontWeight: 600 }}>
              <Icon name="coins" size={16} /> Total por cobrar
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginTop: 8, fontVariantNumeric: 'tabular-nums' }}>{S.money(total)}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', marginTop: 2 }}>{conDeuda.length} empleado{conDeuda.length === 1 ? '' : 's'} con adeudo</div>
          </Card>

          {conDeuda.length === 0 ? (
            <EmptyState icon="coins" title="Nadie debe nada" sub="Cuando registres un préstamo aparecerá aquí su saldo pendiente."
              action={<Button icon="plus" onClick={() => setForm({ empId: '', tipo: 'prestamo' })}>Registrar préstamo</Button>} />
          ) : (
            <div>
              <SectionLabel>Con adeudo</SectionLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {conDeuda.map(e => {
                  const saldo = S.getSaldo(e.id);
                  return (
                    <Card key={e.id} pad={14} onClick={() => setDetailId(e.id)} style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                      <Avatar emp={e} size={46} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--ink)' }}>{e.nombre}</div>
                        <div style={{ marginTop: 4 }}><TipoBadge tipo={e.tipo} size="sm" /></div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.3 }}>Debe</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--amber-ink)', fontVariantNumeric: 'tabular-nums' }}>{S.money0(saldo)}</div>
                      </div>
                    </Card>
                  );
                })}
              </div>
              <Button full icon="plus" variant="outline" onClick={() => setForm({ empId: '', tipo: 'prestamo' })} style={{ marginTop: 14 }}>Registrar préstamo o abono</Button>
            </div>
          )}

          <div style={{ fontSize: 12.5, color: 'var(--ink-3)', textAlign: 'center', lineHeight: 1.5 }}>
            Los abonos hechos en la nómina se descuentan aquí automáticamente.
          </div>
        </div>

        <EmpDetail empId={detailId} onClose={() => setDetailId(null)} onRegister={(tipo) => setForm({ empId: detailId, tipo })} toast={toast} />
        <MovForm form={form} onClose={() => setForm(null)} employees={db.employees.filter(e => e.activo)} toast={toast} />
      </React.Fragment>
    );
  }

  // ── Detalle por empleado ──
  function EmpDetail({ empId, onClose, onRegister, toast }) {
    const db = S.useDB();
    const emp = empId && db.employees.find(e => e.id === empId);
    const movs = empId ? S.getMovimientos(empId) : [];
    const saldo = empId ? S.getSaldo(empId) : 0;
    return (
      <Sheet open={!!empId} onClose={onClose} title="Préstamos del empleado" full>
        {emp && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
              <Avatar emp={emp} size={52} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)' }}>{emp.nombre}</div>
                <div style={{ marginTop: 4 }}><TipoBadge tipo={emp.tipo} size="sm" /></div>
              </div>
            </div>

            <Card pad={16} style={{ background: 'var(--amber-soft)', border: '1px solid var(--amber-line)' }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--amber-ink)', textTransform: 'uppercase', letterSpacing: 0.4 }}>Saldo pendiente</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: 'var(--amber-ink)', marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>{S.money(Math.max(0, saldo))}</div>
            </Card>

            <div style={{ display: 'flex', gap: 10 }}>
              <Button full variant="soft" icon="plus" onClick={() => onRegister('prestamo')}>Prestar</Button>
              <Button full variant="outline" icon="minus" onClick={() => onRegister('abono')}>Abonar</Button>
            </div>

            <div>
              <SectionLabel>Movimientos</SectionLabel>
              {movs.length === 0 ? (
                <div style={{ fontSize: 13.5, color: 'var(--ink-3)', textAlign: 'center', padding: '24px 0' }}>Sin movimientos</div>
              ) : (
                <Card pad={0}>
                  {movs.map((m, i) => {
                    const ab = m.tipo === 'abono';
                    return (
                      <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', borderTop: i ? '1px solid var(--line)' : 'none' }}>
                        <span style={{ display: 'inline-flex', width: 34, height: 34, borderRadius: 10, flexShrink: 0, alignItems: 'center', justifyContent: 'center',
                          background: ab ? 'var(--green-soft)' : 'var(--amber-soft)', color: ab ? 'var(--green-ink)' : 'var(--amber-ink)' }}>
                          <Icon name={ab ? 'arrowL' : 'arrowR'} size={18} stroke={2.2} style={{ transform: ab ? 'rotate(90deg)' : 'rotate(-90deg)' }} />
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.motivo}</div>
                          <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{fmtDate(m.fecha)}</div>
                        </div>
                        <div style={{ fontSize: 15.5, fontWeight: 800, color: ab ? 'var(--green-ink)' : 'var(--amber-ink)', fontVariantNumeric: 'tabular-nums' }}>{ab ? '−' : '+'}{S.money0(m.monto)}</div>
                        {!m.nominaId && (
                          <button className="ta-btn" onClick={() => { S.removeMovimiento(m.id); toast('Movimiento eliminado'); }}
                            style={{ width: 32, height: 32, borderRadius: 9, flexShrink: 0, background: 'transparent', color: 'var(--ink-3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon name="x" size={16} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </Card>
              )}
            </div>
          </div>
        )}
      </Sheet>
    );
  }

  // ── Formulario de movimiento ──
  function MovForm({ form, onClose, employees, toast }) {
    const open = !!form;
    const [empId, setEmpId] = useState('');
    const [tipo, setTipo] = useState('prestamo');
    const [monto, setMonto] = useState('');
    const [motivo, setMotivo] = useState('');
    const [fecha, setFecha] = useState('');
    React.useEffect(() => {
      if (form) { setEmpId(form.empId || ''); setTipo(form.tipo || 'prestamo'); setMonto(''); setMotivo(''); setFecha(new Date().toISOString().slice(0, 10)); }
    }, [form]);

    const save = () => {
      if (!empId) { toast('Elige un empleado'); return; }
      if (!(+monto > 0)) { toast('Ingresa un monto válido'); return; }
      S.addMovimiento({ empId, tipo, monto: +monto, motivo: motivo.trim(), fecha });
      toast(tipo === 'abono' ? 'Abono registrado' : 'Préstamo registrado');
      onClose();
    };
    const lockEmp = form && form.empId;

    return (
      <Sheet open={open} onClose={onClose} title={tipo === 'abono' ? 'Registrar abono' : 'Registrar préstamo'} full>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Segmented full value={tipo} onChange={setTipo} options={[{ value: 'prestamo', label: '+ Préstamo' }, { value: 'abono', label: '− Abono' }]} />

          {!lockEmp && (
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink-2)', marginBottom: 7, paddingLeft: 2 }}>Empleado</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {employees.map(e => {
                  const on = e.id === empId; const saldo = S.getSaldo(e.id);
                  return (
                    <button key={e.id} className="ta-btn" onClick={() => setEmpId(e.id)} style={{
                      display: 'flex', alignItems: 'center', gap: 11, padding: 10, cursor: 'pointer', textAlign: 'left',
                      background: on ? 'var(--primary-soft)' : 'var(--surface)', border: '1px solid ' + (on ? 'var(--amber-line)' : 'var(--line)'), borderRadius: 13,
                    }}>
                      <Avatar emp={e} size={38} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--ink)' }}>{e.nombre}</div>
                        {saldo > 0.005 && <div style={{ fontSize: 12, color: 'var(--amber-ink)' }}>Debe {S.money0(saldo)}</div>}
                      </div>
                      {on && <Icon name="check" size={19} stroke={3} style={{ color: 'var(--primary-ink)' }} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <Field label="Monto" prefix="$" inputMode="decimal" placeholder="0.00" value={monto} onChange={e => setMonto(e.target.value.replace(/[^\d.]/g, ''))} suffix="MXN" />
          <Field label="Motivo / nota" placeholder={tipo === 'abono' ? 'Ej. Abono en efectivo' : 'Ej. Préstamo personal'} value={motivo} onChange={e => setMotivo(e.target.value)} />
          <Field label="Fecha" type="date" icon="calendar" value={fecha} onChange={e => setFecha(e.target.value)} />

          <Button size="lg" full onClick={save} style={{ marginTop: 6 }}>{tipo === 'abono' ? 'Registrar abono' : 'Registrar préstamo'}</Button>
        </div>
      </Sheet>
    );
  }

  window.Screens = Object.assign(window.Screens || {}, { Prestamos });
})();


/* === app/App.jsx === */
/* App.jsx — raíz: tema, navegación, sesión y panel de Tweaks. */
(function () {
  const { useState, useEffect, useRef } = React;
  const S = window.Store, Icon = window.Icon;
  const { Toast } = window.UI;
  const { BottomNav } = window.Shell;
  const Sc = window.Screens;
  const { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakSelect, TweakColor } = window;

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "tema": "ambar",
    "tipografia": "Hanken Grotesk",
    "esquinas": "suaves",
    "payrollLayout": "todo",
    "captureMode": "teclado"
  }/*EDITMODE-END*/;

  const TEMAS = {
    ambar:    { '--primary': '#B5740F', '--primary-ink': '#8A5A0C', '--primary-soft': '#F6E7C8', '--on-primary': '#FFFDF7' },
    mezquite: { '--primary': '#7A4A1E', '--primary-ink': '#6B3F18', '--primary-soft': '#ECE0CE', '--on-primary': '#FBF6EF' },
    comal:    { '--primary': '#B0532A', '--primary-ink': '#934323', '--primary-soft': '#F6E0D4', '--on-primary': '#FFF8F3' },
  };
  const ESQUINAS = {
    redondeadas: { '--r-card': '20px', '--r-field': '14px', '--r-btn': '14px' },
    suaves:      { '--r-card': '16px', '--r-field': '12px', '--r-btn': '12px' },
    rectas:      { '--r-card': '9px',  '--r-field': '9px',  '--r-btn': '9px' },
  };

  const LS = {
    get auth() { try { return localStorage.getItem('tortiapp_auth') === '1'; } catch (e) { return false; } },
    set auth(v) { try { localStorage.setItem('tortiapp_auth', v ? '1' : '0'); } catch (e) {} },
    get tab() { try { return localStorage.getItem('tortiapp_tab') || 'inicio'; } catch (e) { return 'inicio'; } },
    set tab(v) { try { localStorage.setItem('tortiapp_tab', v); } catch (e) {} },
  };

  function Stage({ children }) {
    const [scale, setScale] = useState(1);
    useEffect(() => {
      const fit = () => {
        setScale(Math.min(window.innerWidth / 402, window.innerHeight / 874, 1));
      };
      fit();
      window.addEventListener('resize', fit);
      return () => window.removeEventListener('resize', fit);
    }, []);
    // Sin transform cuando el dispositivo ya cabe (mejor captura/render).
    const scaled = scale < 0.999;
    return (
      <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--stage)', overflow: 'hidden' }}>
        <div style={scaled ? { transform: `scale(${scale})`, transformOrigin: 'center' } : undefined}>{children}</div>
      </div>
    );
  }

  function App() {
    const [tw, setTweak] = useTweaks(TWEAK_DEFAULTS);
    const [authed, setAuthed] = useState(LS.auth);
    const [tab, setTab] = useState(LS.tab);
    const [toast, setToastMsg] = useState('');
    const [tarifasOpen, setTarifasOpen] = useState(false);
    const tRef = useRef(null);

    const showToast = (m) => { setToastMsg(m); clearTimeout(tRef.current); tRef.current = setTimeout(() => setToastMsg(''), 2200); };
    const go = (t) => { setTab(t); LS.tab = t; };
    const login = () => { setAuthed(true); LS.auth = true; };
    const logout = () => { setAuthed(false); LS.auth = false; };

    const themeVars = { ...TEMAS[tw.tema] || TEMAS.ambar, ...ESQUINAS[tw.esquinas] || ESQUINAS.suaves, '--font': `'${tw.tipografia}', system-ui, sans-serif`, '--font-display': `'${tw.tipografia}', system-ui, sans-serif` };

    const screen = () => {
      if (tab === 'inicio') return <Sc.Inicio go={go} onLogout={logout} openTarifas={() => setTarifasOpen(true)} />;
      if (tab === 'empleados') return <Sc.Empleados toast={showToast} />;
      if (tab === 'nomina') return <Sc.Nomina toast={showToast} tw={{ payrollLayout: tw.payrollLayout, captureMode: tw.captureMode }} />;
      if (tab === 'asistencia') return <Sc.Asistencia toast={showToast} />;
      if (tab === 'historial') return <Sc.Historial />;
      if (tab === 'prestamos') return <Sc.Prestamos onBack={() => go('inicio')} toast={showToast} />;
      return null;
    };

    return (
      <Stage>
        <div className="ta-root" style={themeVars}>
          <window.IOSDevice>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', fontFamily: 'var(--font)' }}>
              {!authed ? (
                <div style={{ flex: 1, overflow: 'auto' }}><Sc.Login onLogin={login} /></div>
              ) : (
                <React.Fragment>
                  <div key={tab} className="ta-scroll" style={{ flex: 1, overflow: 'auto', position: 'relative' }}>{screen()}</div>
                  <BottomNav active={tab} onNav={go} />
                </React.Fragment>
              )}
              <Sc.Tarifas open={tarifasOpen} onClose={() => setTarifasOpen(false)} toast={showToast} />
              <Toast msg={toast} />
            </div>
          </window.IOSDevice>
        </div>

        <TweaksPanel>
          <TweakSection label="Pantalla de nómina" />
          <TweakRadio label="Layout" value={tw.payrollLayout} onChange={v => setTweak('payrollLayout', v)}
            options={[{ value: 'todo', label: 'Todo' }, { value: 'asistente', label: 'Asistente' }, { value: 'acordeon', label: 'Acordeón' }]} />
          <TweakRadio label="Captura" value={tw.captureMode} onChange={v => setTweak('captureMode', v)}
            options={[{ value: 'teclado', label: 'Teclado' }, { value: 'stepper', label: '+ / −' }, { value: 'tabla', label: 'Tabla' }]} />
          <TweakSection label="Estilo" />
          <TweakColor label="Tema" value={(TEMAS[tw.tema] || TEMAS.ambar)['--primary']}
            options={Object.keys(TEMAS).map(k => TEMAS[k]['--primary'])}
            onChange={hex => setTweak('tema', Object.keys(TEMAS).find(k => TEMAS[k]['--primary'] === hex) || 'ambar')} />
          <TweakSelect label="Tipografía" value={tw.tipografia} onChange={v => setTweak('tipografia', v)}
            options={['Hanken Grotesk', 'Albert Sans', 'IBM Plex Sans']} />
          <TweakRadio label="Esquinas" value={tw.esquinas} onChange={v => setTweak('esquinas', v)}
            options={[{ value: 'redondeadas', label: 'Redond.' }, { value: 'suaves', label: 'Suaves' }, { value: 'rectas', label: 'Rectas' }]} />
        </TweaksPanel>
      </Stage>
    );
  }

  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App />);
})();

