/** Original vector ornament inspired by Rajasthan's floral block prints. */
export default function BotanicalMotif({ className = "" }: { className?: string }) {
  return <svg viewBox="0 0 240 400" className={className} fill="none" aria-hidden="true">
    <path d="M120 380V170M120 302C88 288 61 250 58 209M120 260C151 245 181 210 186 171M120 220C93 208 80 179 78 153" stroke="currentColor" strokeWidth="2" />
    <g fill="currentColor">
      <path d="M119 323C66 328 38 297 34 269C76 265 106 291 119 323ZM119 289C164 302 206 274 211 249C173 240 140 262 119 289ZM83 262C39 261 21 232 24 210C56 212 78 236 83 262ZM158 228C192 240 220 215 220 191C189 188 169 204 158 228ZM109 208C68 207 49 187 49 168C80 162 100 187 109 208Z" opacity=".65" />
      {Array.from({ length: 12 }, (_, i) => <ellipse key={i} cx="120" cy="74" rx="10" ry="26" transform={`rotate(${i * 30} 120 118)`} />)}
      {Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx="120" cy="91" rx="7" ry="18" transform={`rotate(${i * 45 + 15} 120 118)`} opacity=".8" />)}
      <circle cx="120" cy="118" r="15" />
    </g>
    <path d="M105 170L120 182L135 170M93 164Q120 176 147 164" stroke="currentColor" strokeWidth="2" />
  </svg>;
}
