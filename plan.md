# Plan: Stereoscopic Camera Viewer (Cardboard/Zapbox)

Context: Frontend-focused React app that lists all iPhone cameras, lets users select one, and renders the chosen camera feed duplicated side-by-side on a canvas for simple stereoscopic viewing, with a full-screen TikTok-style UI. No external integrations.

## 1) Objectives
- Enumerate all available iPhone video inputs and present a clear selector.
- On user permission, start/stop the selected camera reliably and switch seamlessly.
- Duplicate the single camera feed to a canvas in a side-by-side layout (left/right eyes).
- Provide full-screen immersive viewing optimized for Google Cardboard/Zapbox (landscape, center divider, minimal UI).
- Handle iOS/Safari constraints gracefully (first permission, device labels after grant, HTTPS requirement, autoplay policies).
- Ship a polished V1 with robust error states and clear guidance.

Complexity decision: No POC required. Camera + canvas + fullscreen are standard browser APIs. Proceed directly to Phase 2 (V1 App Development).

## 2) Implementation Steps (Phased)

### Phase 1: Core POC Decision and Constraints (Skipped)
- Rationale: No external APIs or complex integrations. Browser camera APIs are stable; proceed directly to app.
- Key constraints to address in V1:
  - iOS Safari requires a user gesture before getUserMedia; device labels appear only after permission.
  - Selecting ultrawide (0.5x) is not guaranteed programmatically; expose all cameras and let user choose.
  - Fullscreen API and orientation behavior differ on iOS; implement graceful fallbacks.

User Stories (Phase 1, for readiness consideration):
1. As a user, I understand why I must tap to start the camera (permission gating).
2. As a user, I am informed if my browser blocks camera access and what to try.
3. As a user, I see HTTPS requirement info if permission fails due to context.
4. As a user, I get a fallback message if enumerateDevices returns no labels pre-permission.
5. As a user, I can proceed to the main app without extra setup.

---

### Phase 2: V1 App Development (Core Features)
Frontend (React):
- Build a single-page full-viewport layout (TikTok-style: immersive, minimal chrome).
- Camera Permission Flow:
  - On "Start" click: request default rear camera (facingMode: environment) to unlock labels.
  - Re-enumerate devices; populate a dropdown of videoinputs with best-effort labels.
- Camera Selection:
  - On selection change: stop previous tracks; request stream with deviceId exact match.
  - Fallback to facingMode if deviceId fails.
- Rendering Pipeline:
  - Hidden <video> element receives the stream.
  - requestAnimationFrame loop draws to a single <canvas>.
  - Duplicate the frame: left half and right half; add a slim center divider.
  - Responsive sizing: on resize/orientation change, recompute canvas size to fill viewport.
- Fullscreen & Orientation:
  - Fullscreen toggle button using standard API and iOS-friendly fallbacks.
  - Prefer landscape orientation guidance for headset use.
- Error & State Handling:
  - Loading, no-permission, no devices, and stream-failed states with clear messages.
  - Safe stop on unmount; prevent memory leaks.
- Styling:
  - Minimal UI controls overlay (top or bottom) that auto-hides after a few seconds.
  - High-contrast buttons sized for touch.

Testing (end of Phase 2):
- Automated: Load, render, basic UI visibility, error-state injection (skip real camera/FS in automation).
- Manual checklist (for you):
  - iPhone Safari: Grant permission → camera list populates → select ultrawide if available → fullscreen OK.
  - Switch cameras without refresh; verify canvas shows duplicated feed.

User Stories (Phase 2):
1. As a user, I can tap a Start button to grant camera permission and begin using the app.
2. As a user, I can see all available cameras and select the one I want (e.g., ultrawide 0.5x).
3. As a user, I can enter fullscreen and view a side-by-side stereoscopic feed suitable for Cardboard/Zapbox.
4. As a user, I receive clear error messages if permission is denied or a stream fails to start.
5. As a user, I can switch cameras seamlessly without reloading the page.

---

### Phase 3: Enhancements and Optimization
- Visual Tweaks:
  - Adjustable center divider thickness and color.
  - Optional padding/cropping sliders per eye to refine lens overlap.
- UX Improvements:
  - Auto-hide controls; tap to show.
  - Remember last-selected camera and UI preferences via localStorage.
- Device Aids:
  - On-screen alignment grid toggle.
  - "Keep screen awake" hint using Wake Lock API where available.
- Performance:
  - Frame throttling on low battery; handle background tab visibilitychange.
- Documentation:
  - Quick tips for iOS Safari and Cardboard alignment.

Testing (end of Phase 3):
- Automated UI regressions for controls and preferences (no camera dependency).
- Manual verification of divider/grid and persistence on iPhone Safari.

User Stories (Phase 3):
1. As a user, I can adjust the center divider to match my headset preference.
2. As a user, I can toggle an alignment grid to fine-tune my view.
3. As a user, my camera choice and settings persist between sessions.
4. As a user, the UI stays hidden during viewing and appears on tap.
5. As a user, the app stays smooth even as battery gets low (graceful degradation).

---

## 3) Next Actions (for Implementation)
- Implement Phase 2 V1 app in a single pass (frontend only), integrating:
  - Permission gating → enumerate devices → selector → stream attach → canvas render → fullscreen.
  - Robust error and state handling; minimal, polished UI.
- Run automated frontend tests (skip camera/fullscreen in automation); then guide manual tests on iPhone.
- Share preview URL and manual test checklist.

Time: 20–30 minutes for initial V1 delivery after starting implementation.

## 4) Success Criteria
- Device enumeration works after permission; selector shows all videoinputs with usable labels.
- Selected camera starts reliably; switching cameras releases previous tracks without leaks.
- Canvas shows a duplicated, side-by-side view with a visible center divider; fills the viewport responsively.
- Fullscreen works or falls back gracefully on iOS; user receives helpful guidance if restricted.
- Smooth rendering (target 30–60 fps) with stable UI and no console errors.
- Clear, friendly error states for denied permission, no devices, or stream errors.
- Phase 2: All user stories covered in development and testing.
- Phase 3: Enhancements ship without breaking the core workflow.
