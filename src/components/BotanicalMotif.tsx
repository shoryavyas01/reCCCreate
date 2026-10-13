/** Original ornaments drawn from Rajasthan's floral block-print vocabulary. */
export default function BotanicalMotif({ className = "", variant = "marigold" }: { className?: string; variant?: "marigold" | "sprout" }) {
  if (variant === "sprout") return <svg viewBox="0 0 240 400" className={className} fill="none" aria-hidden="true">
    <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M121 365C132 266 110 155 120 67M123 268L65 220M124 218L178 172M120 165L76 125M120 123L156 91" /><path d="M61 351Q120 335 181 351M42 371Q120 352 198 371M30 389H210" /></g>
    <g fill="currentColor"><path d="M65 220C15 221 7 172 15 148C61 150 77 185 65 220ZM124 269C135 226 186 219 216 230C207 271 162 285 124 269ZM178 172C176 126 211 104 229 113C234 150 214 173 178 172ZM120 218C70 229 36 205 39 176C75 168 104 188 120 218ZM76 125C41 127 21 95 27 71C61 69 80 94 76 125ZM121 165C133 126 172 125 188 139C177 167 150 177 121 165ZM156 91C147 62 166 43 190 44C194 68 179 88 156 91ZM120 76C84 61 89 26 104 13C130 26 137 49 120 76Z" /></g>
    <g stroke="#d6bc7b" strokeWidth="1.2" opacity=".65"><path d="M65 211L24 161M133 264L203 239M78 119L37 83M176 166L220 124M119 64L104 24" /></g>
  </svg>;
  return <svg viewBox="0 0 240 400" className={className} fill="none" aria-hidden="true">
    <path d="M120 380V170M120 302C88 288 61 250 58 209M120 260C151 245 181 210 186 171M120 220C93 208 80 179 78 153" stroke="currentColor" strokeWidth="2" />
    <g fill="currentColor">
      <path d="M119 323C66 328 38 297 34 269C76 265 106 291 119 323ZM119 289C164 302 206 274 211 249C173 240 140 262 119 289ZM83 262C39 261 21 232 24 210C56 212 78 236 83 262ZM158 228C192 240 220 215 220 191C189 188 169 204 158 228ZM109 208C68 207 49 187 49 168C80 162 100 187 109 208Z" opacity=".8" />
      {Array.from({ length: 12 }, (_, i) => <ellipse key={i} cx="120" cy="74" rx="10" ry="26" transform={`rotate(${i * 30} 120 118)`} />)}
      {Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx="120" cy="91" rx="7" ry="18" transform={`rotate(${i * 45 + 15} 120 118)`} opacity=".8" />)}
      <circle cx="120" cy="118" r="15" />
    </g>
    <g stroke="currentColor" strokeWidth="2"><path d="M105 170L120 182L135 170M93 164Q120 176 147 164" /><path d="M47 371Q120 352 193 371M40 380H200" /></g>
  </svg>;
}
