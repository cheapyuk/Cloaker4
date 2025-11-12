{
  "meta": {
    "app_name": "StereoCam VR Viewer",
    "problem_summary": "Full-screen stereoscopic camera viewer for Google Cardboard/Zapbox using iPhone camera (prefer ultrawide 0.5x), side-by-side duplication, minimal UI that auto-hides, high-contrast controls, clear permission + error states, landscape optimized, fullscreen toggle.",
    "audience": ["VR hobbyists", "developers testing AR/VR pass-through", "Zapbox/Cardboard users"],
    "brand_attributes": ["minimal", "technical", "trustworthy", "precise", "performance-first"]
  },
  "inspiration_refs": {
    "notes": "Two searches were performed per instructions.",
    "stereo_side_by_side": {
      "summary": "Stereoscopic left-right rendering and web camera access patterns.",
      "citations": [
        "https://github.com/steren/stereo-img",
        "https://dev.to/yushulx/how-to-implement-camera-access-from-web-browsers-in-5-minutes-4hop",
        "https://github.com/immersive-web/cardboard-vr-display"
      ]
    },
    "minimal_vr_ui": {
      "summary": "Google Cardboard/Zapbox emphasize minimal overlays, setup before immersion.",
      "citations": [
        "https://dribbble.com/tags/vr-mobile-app",
        "https://www.zappar.com/zapbox/quickstart/",
        "https://www.google.com/get/cardboard/"
      ]
    }
  },
  "typography": {
    "font_pairing": {
      "heading": "Space Grotesk",
      "body": "IBM Plex Sans"
    },
    "why": "Space Grotesk gives a technical, precise personality; IBM Plex Sans is highly readable on bright scenes and motion-heavy contexts.",
    "include": {
      "google_fonts": "Add to index.html <head>: <link href=\"https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=IBM+Plex+Sans:wght@400;500;700&display=swap\" rel=\"stylesheet\">",
      "tailwind": "In index.css body { font-family: 'IBM Plex Sans', system-ui, sans-serif; } headers can use class 'font-space' (see utilities below)."
    },
    "utilities": {
      "add_classes": [
        ".font-space { font-family: 'Space Grotesk', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji'; }"
      ]
    },
    "scale": {
      "h1": "text-4xl sm:text-5xl lg:text-6xl",
      "h2": "text-base md:text-lg",
      "body": "text-base md:text-base",
      "small": "text-sm"
    }
  },
  "color_system": {
    "notes": "Dark, high-contrast UI to keep focus on the video feed. Accents in cyan/teal; warnings in safety orange. Avoid purple. Respect gradient restrictions.",
    "tokens_css": """
    :root {
      --background: 220 15% 5%;          /* near-black slate */
      --foreground: 210 20% 98%;         /* off-white */
      --surface: 220 12% 10%;            /* panels */
      --surface-2: 220 12% 14%;
      --primary: 188 94% 42%;            /* ocean cyan */
      --primary-foreground: 0 0% 100%;
      --accent: 162 78% 36%;             /* mint/teal */
      --accent-foreground: 0 0% 100%;
      --warning: 28 100% 50%;            /* safety orange */
      --warning-foreground: 0 0% 6%;
      --success: 158 64% 42%;
      --danger: 0 72% 48%;
      --muted: 220 8% 26%;
      --ring: 188 94% 42%;
      --border: 220 8% 22%;
      --divider: 210 12% 30%;            /* center split line */
      --scrim: 220 15% 5% / 0.7;         /* overlay dimmer */
      --radius: 0.75rem;
    }
    """,
    "application": {
      "bg": "bg-[hsl(var(--background))]",
      "panel": "bg-[hsl(var(--surface))] border border-[hsl(var(--border))]",
      "cta": "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]",
      "accent": "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]",
      "divider": "bg-[hsl(var(--divider))] opacity-70"
    },
    "gradients": {
      "allowed_example": "from-cyan-400/20 via-teal-300/10 to-transparent",
      "usage": "Only for large section backgrounds like onboarding; never on video/content areas; max 20% viewport, per rules"
    }
  },
  "layout_and_grid": {
    "page_structure": [
      "Root container: relative w-screen h-[100dvh] overflow-hidden bg-[hsl(var(--background))]",
      "Video plane: grid grid-cols-2 w-full h-full [each cell holds a mirrored <video> or <canvas>]",
      "Center divider: absolute left-1/2 top-0 -translate-x-1/2 w-[2px] h-full bg-[hsl(var(--divider))]",
      "Overlay controls: absolute inset-0 pointer-events-none; local control groups have pointer-events-auto"
    ],
    "mobile_first": {
      "sm": "full-screen, large tap targets (min 44px)",
      "md+": "same layout; additional tooltips and text labels"
    },
    "landscape_optimization": "Show rotate overlay if in portrait. Attempt lock on entering Fullscreen via Screen Orientation API (best-effort)."
  },
  "component_path": {
    "primary": [
      "/app/frontend/src/components/ui/button.jsx",
      "/app/frontend/src/components/ui/select.jsx",
      "/app/frontend/src/components/ui/slider.jsx",
      "/app/frontend/src/components/ui/separator.jsx",
      "/app/frontend/src/components/ui/sheet.jsx",
      "/app/frontend/src/components/ui/dialog.jsx",
      "/app/frontend/src/components/ui/skeleton.jsx",
      "/app/frontend/src/components/ui/sonner.jsx",
      "/app/frontend/src/components/ui/switch.jsx",
      "/app/frontend/src/components/ui/tooltip.jsx"
    ],
    "secondary": [
      "/app/frontend/src/components/ui/progress.jsx",
      "/app/frontend/src/components/ui/alert.jsx",
      "/app/frontend/src/components/ui/alert-dialog.jsx"
    ]
  },
  "ui_components": {
    "controls_overlay": {
      "pattern": "Auto-hide minimal overlay; appears on tap. High contrast buttons, icon-first; labels on long-press or desktop hover.",
      "structure": [
        "Top-left: Back/Close (Button ghost)",
        "Top-right: Fullscreen toggle, Torch (if available)",
        "Bottom-center: Big Primary 'Start/Resume' and 'Switch Camera'",
        "Bottom-right (advanced collapsed Sheet): IPD slider, center divider toggle, barrel distortion toggle (future)"
      ],
      "tailwind": "pointer-events-none select-none [children buttons have pointer-events-auto]",
      "auto_hide": "Hide after 3s of inactivity; re-show on tap."
    },
    "divider": {
      "class": "absolute left-1/2 top-0 -translate-x-1/2 w-[2px] h-full bg-[hsl(var(--divider))]"
    },
    "video_canvas": {
      "left": "w-full h-full object-cover [image-rendering:auto]",
      "right": "w-full h-full object-cover transform scale-x-[-1] [image-rendering:auto]"
    },
    "permission_dialog": {
      "use": "Dialog/AlertDialog + Sonner toast",
      "copy": {
        "title": "Camera Permission Needed",
        "desc": "Allow camera access to enable stereoscopic view. Go to Settings > Safari > Camera and set to Allow.",
        "actions": ["Retry", "Help"]
      }
    },
    "loading": {
      "use": "Skeleton and subtle shimmer while initializing camera stream",
      "class": "bg-[hsl(var(--surface-2))]"
    }
  },
  "micro_interactions_and_motion": {
    "libraries": [
      {
        "name": "framer-motion",
        "install": "npm i framer-motion",
        "use": "Fade/slide overlays, button press scale 0.97. Avoid universal transitions; only animate opacity/scale/background-color."
      },
      {
        "name": "screenfull",
        "install": "npm i screenfull",
        "use": "Reliable fullscreen toggle across platforms."
      }
    ],
    "patterns": [
      "Overlay fade in/out 150–200ms; delay 0 on tap",
      "Buttons: hover:bg-[hsl(var(--surface-2))], active:scale-95, focus-visible:ring-2 ring-[hsl(var(--ring))]",
      "Divider: slight breathing glow on first load (opacity from 40% to 70% for 600ms)"
    ]
  },
  "accessibility": {
    "contrast": "All text meets WCAG AA on dark background; buttons use solid fills or solid borders.",
    "hit_targets": "Min 44x44px",
    "focus": "Use focus-visible rings (ring-2 ring-offset-2 ring-[hsl(var(--ring))])",
    "aria": [
      "aria-live=polite region for status toasts",
      "role='status' text for loading and permission prompts"
    ],
    "data_testid_rule": "All interactive or critical info elements MUST include data-testid in kebab-case describing role, e.g., data-testid=\"fullscreen-toggle-button\", data-testid=\"camera-select\", data-testid=\"center-divider\"."
  },
  "image_urls": [
    {
      "url": "https://images.unsplash.com/photo-1706095883120-ab0bd73faee6?crop=entropy&cs=srgb&fm=jpg&q=85",
      "category": "decorative",
      "placement": "Onboarding or permission screen background with 35% overlay scrim",
      "alt": "Dark grainy metal texture"
    },
    {
      "url": "https://images.unsplash.com/photo-1661898253201-5c28e174be47?crop=entropy&cs=srgb&fm=jpg&q=85",
      "category": "decorative",
      "placement": "Loading state background if camera not yet ready",
      "alt": "Subtle dark abstract pattern"
    },
    {
      "url": "https://images.unsplash.com/photo-1599090725706-560998776d5c?crop=entropy&cs=srgb&fm=jpg&q=85",
      "category": "decorative",
      "placement": "Help/FAQ sheet background header",
      "alt": "Black and gray concrete texture"
    }
  ],
  "buttons_and_controls": {
    "style": "Iconic / Action-First",
    "tokens": {
      "--btn-radius": "0.75rem",
      "--btn-shadow": "0 6px 16px rgba(0,0,0,0.35)",
      "--btn-focus": "0 0 0 2px hsl(var(--ring))"
    },
    "variants": {
      "primary": "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-cyan-500 focus-visible:outline-none focus-visible:ring-2 ring-[hsl(var(--ring))]",
      "secondary": "bg-[hsl(var(--surface))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--surface-2))] border border-[hsl(var(--border))]",
      "ghost": "bg-transparent text-[hsl(var(--foreground))] hover:bg-[hsl(var(--surface))]"
    },
    "sizes": {
      "lg": "h-14 px-6 text-base",
      "md": "h-11 px-5 text-sm",
      "icon": "h-12 w-12 p-0"
    }
  },
  "camera_and_fullscreen_js_scaffold": {
    "file": "src/features/vr/VRViewer.js",
    "code": """
    import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
    import screenfull from 'screenfull';
    import { toast } from '../components/ui/sonner';
    import { Button } from '../components/ui/button';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
    import { Slider } from '../components/ui/slider';
    import { Separator } from '../components/ui/separator';
    import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';

    export default function VRViewer() {
      const videoRef = useRef(null);
      const canvasLeftRef = useRef(null);
      const canvasRightRef = useRef(null);
      const [devices, setDevices] = useState([]);
      const [deviceId, setDeviceId] = useState(null);
      const [ready, setReady] = useState(false);
      const [showUI, setShowUI] = useState(true);
      const [ipd, setIpd] = useState(0); // px offset applied to right eye
      const [permissionOpen, setPermissionOpen] = useState(false);
      const [isLandscape, setIsLandscape] = useState(window.matchMedia('(orientation: landscape)').matches);

      const startCamera = useCallback(async (id) => {
        try {
          setReady(false);
          const constraints = {
            audio: false,
            video: {
              deviceId: id ? { exact: id } : undefined,
              facingMode: id ? undefined : { ideal: 'environment' },
              width: { ideal: 1920 },
              height: { ideal: 1080 },
              aspectRatio: { ideal: 16/9 }
            }
          };
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
          }
          setReady(true);
          toast.success('Camera initialized', { id: 'camera-init' });
        } catch (err) {
          console.error(err);
          setPermissionOpen(true);
          toast.error('Camera access denied or unavailable');
        }
      }, []);

      const enumerate = useCallback(async () => {
        try {
          const all = await navigator.mediaDevices.enumerateDevices();
          const cams = all.filter((d) => d.kind === 'videoinput');
          // Prefer iPhone ultra-wide by label heuristics (varies by locale)
          const ultra = cams.find((c) => /ultra|0\.5|ultra\s*wide|ultraweit/i.test(c.label));
          setDevices(cams);
          if (ultra) setDeviceId(ultra.deviceId);
        } catch (e) {
          console.warn('enumerateDevices failed', e);
        }
      }, []);

      useEffect(() => { enumerate(); }, [enumerate]);
      useEffect(() => { startCamera(deviceId); }, [deviceId, startCamera]);

      useEffect(() => {
        const onChange = () => setIsLandscape(window.matchMedia('(orientation: landscape)').matches);
        window.addEventListener('orientationchange', onChange);
        window.matchMedia('(orientation: landscape)').addEventListener('change', onChange);
        return () => {
          window.removeEventListener('orientationchange', onChange);
        };
      }, []);

      useEffect(() => {
        if (!ready) return;
        let raf;
        const draw = () => {
          const video = videoRef.current;
          const l = canvasLeftRef.current;
          const r = canvasRightRef.current;
          if (!video || !l || !r) return;
          const lw = l.width = l.clientWidth;
          const lh = l.height = l.clientHeight;
          const rw = r.width = r.clientWidth;
          const rh = r.height = r.clientHeight;
          const ctxL = l.getContext('2d');
          const ctxR = r.getContext('2d');
          // draw full frame left
          ctxL.drawImage(video, 0, 0, lw, lh);
          // draw with small IPD offset right (synthetic stereo)
          ctxR.drawImage(video, ipd, 0, rw, rh);
          raf = requestAnimationFrame(draw);
        };
        raf = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(raf);
      }, [ready, ipd]);

      // Auto-hide UI
      useEffect(() => {
        let t;
        const reset = () => {
          setShowUI(true);
          clearTimeout(t);
          t = setTimeout(() => setShowUI(false), 3000);
        };
        const el = document.getElementById('vr-root');
        if (!el) return;
        ['touchstart','mousemove','keydown'].forEach((evt) => el.addEventListener(evt, reset));
        reset();
        return () => {
          clearTimeout(t);
          ['touchstart','mousemove','keydown'].forEach((evt) => el.removeEventListener(evt, reset));
        };
      }, []);

      const onFullscreen = useCallback(() => {
        const el = document.getElementById('vr-root');
        if (!el) return;
        if (screenfull.isEnabled) {
          screenfull.request(el).then(() => {
            if (screen.orientation && screen.orientation.lock) {
              screen.orientation.lock('landscape').catch(() => {});
            }
          });
        }
      }, []);

      return (
        <div id=\"vr-root\" className=\"relative w-screen h-[100dvh] bg-[hsl(var(--background))]\" data-testid=\"vr-viewer-root\" onClick={() => setShowUI(true)}>
          {/* Video source */}
          <video ref={videoRef} className=\"hidden\" playsInline muted data-testid=\"hidden-video-el\" />

          {/* Split stereo plane */}
          <div className=\"grid grid-cols-2 w-full h-full\" data-testid=\"stereo-plane\">
            <canvas ref={canvasLeftRef} className=\"w-full h-full object-cover\" data-testid=\"left-eye-canvas\" />
            <canvas ref={canvasRightRef} className=\"w-full h-full object-cover\" data-testid=\"right-eye-canvas\" />
          </div>

          {/* Center Divider */}
          <div className=\"absolute left-1/2 top-0 -translate-x-1/2 w-[2px] h-full bg-[hsl(var(--divider))]\" aria-hidden data-testid=\"center-divider\" />

          {/* Loading Skeleton */}
          {!ready && (
            <div className=\"absolute inset-0 flex items-center justify-center bg-black/40\" data-testid=\"camera-loading-overlay\">\n              <div className=\"animate-pulse h-10 w-10 rounded-full bg-[hsl(var(--surface-2))]\" />\n            </div>
          )}

          {/* Portrait Warning */}
          {!isLandscape && (
            <div className=\"absolute inset-0 flex items-center justify-center bg-black/70 text-white text-sm px-6 text-center\" data-testid=\"rotate-device-warning\">\n              Rotate your device to landscape for VR viewing.\n            </div>
          )}

          {/* Overlay Controls */}
          {showUI && (
            <div className=\"absolute inset-0 p-4 flex flex-col justify-between pointer-events-none\" data-testid=\"overlay-ui\">
              <div className=\"flex w-full justify-between items-start pointer-events-auto\">
                <Button variant=\"ghost\" className=\"text-white/90\" data-testid=\"close-button\">Close</Button>
                <div className=\"flex gap-2\">
                  <Button variant=\"secondary\" className=\"text-white\" onClick={onFullscreen} data-testid=\"fullscreen-toggle-button\">Fullscreen</Button>
                </div>
              </div>

              <div className=\"flex w-full justify-center pointer-events-auto\">
                <div className=\"flex gap-3\">
                  <Button className=\"\" data-testid=\"start-button\" onClick={() => startCamera(deviceId)}>Start</Button>
                  <Select value={deviceId || ''} onValueChange={setDeviceId} data-testid=\"camera-select\">
                    <SelectTrigger className=\"w-56\" data-testid=\"camera-select-trigger\"><SelectValue placeholder=\"Select camera\" /></SelectTrigger>
                    <SelectContent>
                      {devices.map((d) => (
                        <SelectItem key={d.deviceId} value={d.deviceId} data-testid=\"camera-select-item\">{d.label || 'Camera'}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className=\"flex w-full justify-end pointer-events-auto\">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant=\"ghost\" className=\"text-white/80\" data-testid=\"advanced-settings-button\">Advanced</Button>
                  </SheetTrigger>
                  <SheetContent side=\"bottom\" className=\"bg-[hsl(var(--surface))]\">
                    <SheetHeader>
                      <SheetTitle className=\"font-space\">VR Tuning</SheetTitle>
                    </SheetHeader>
                    <div className=\"mt-4 space-y-4\">
                      <div>
                        <div className=\"text-xs text-white/70 mb-2\">IPD Offset (px)</div>
                        <Slider value={[ipd]} min={0} max={60} step={1} onValueChange={(v)=>setIpd(v[0])} data-testid=\"ipd-slider\" />
                      </div>
                      <Separator />
                      <div className=\"text-xs text-white/60\">More options soon</div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          )}

          <Dialog open={permissionOpen} onOpenChange={setPermissionOpen}>
            <DialogContent className=\"bg-[hsl(var(--surface))] text-[hsl(var(--foreground))]\" data-testid=\"permission-dialog\">
              <DialogHeader>
                <DialogTitle>Camera Permission Needed</DialogTitle>
                <DialogDescription>
                  Allow camera access to enable stereoscopic view. If denied, go to Settings and change Camera permissions for your browser.
                </DialogDescription>
              </DialogHeader>
              <div className=\"flex gap-3 justify-end\">
                <Button variant=\"secondary\" onClick={() => setPermissionOpen(false)} data-testid=\"permission-cancel-button\">Close</Button>
                <Button onClick={() => startCamera(deviceId)} data-testid=\"permission-retry-button\">Retry</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      );
    }
    """
  },
  "testing_and_states": {
    "data_testids_required": [
      "vr-viewer-root",
      "stereo-plane",
      "left-eye-canvas",
      "right-eye-canvas",
      "center-divider",
      "overlay-ui",
      "fullscreen-toggle-button",
      "start-button",
      "camera-select",
      "camera-select-trigger",
      "camera-select-item",
      "ipd-slider",
      "permission-dialog",
      "permission-retry-button",
      "rotate-device-warning",
      "camera-loading-overlay"
    ],
    "error_states": [
      {
        "id": "no-permission",
        "ui": "Dialog + toast.error('Camera access denied')",
        "recovery": "Retry getUserMedia or show help link"
      },
      {
        "id": "no-devices",
        "ui": "Select shows 'No cameras found' disabled state",
        "recovery": "Prompt user to reconnect or check browser permissions"
      },
      {
        "id": "stream-failed",
        "ui": "Toast with guidance; button to downgrade resolution"
      }
    ]
  },
  "responsive_rules": {
    "safe_areas": "Use p-safe for iOS notch: pb-[env(safe-area-inset-bottom)]",
    "landscape_only": "Encourage landscape with overlay; try locking on fullscreen"
  },
  "css_utilities": {
    "overlay_scrim": "bg-[hsl(var(--scrim))]",
    "no_select": "select-none",
    "tap_target": "min-h-[44px] min-w-[44px]"
  },
  "usage_notes": {
    "https_required": "getUserMedia requires HTTPS on mobile browsers",
    "ios_specific": "Use playsInline on <video>, start camera after a user gesture",
    "perf": "Prefer canvas drawImage with requestAnimationFrame; avoid heavy filters"
  },
  "instructions_to_main_agent": "Implement VRViewer.js using provided scaffold. Ensure all interactive elements include data-testid attributes. Use shadcn/ui components from src/components/ui. Add Space Grotesk/IBM Plex Sans fonts. Apply color tokens in index.css :root. Controls overlay must auto-hide after 3s of inactivity and reappear on tap. Use screenfull for fullscreen, and attempt orientation lock to landscape on entering fullscreen. Respect Gradient Restriction Rule: do not place gradients on the video plane or small UI.",
  "appendix_tokens": {
    "add_to_index_css": "Place color tokens under :root after existing tokens or adapt current tokens to these values. Keep dark theme by default for this app."
  },
  "general_guidelines": "- You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms\n    - You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text\n   - NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json\n\n **GRADIENT RESTRICTION RULE**\nNEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc\nNEVER use dark gradients for logo, testimonial, footer etc\nNEVER let gradients cover more than 20% of the viewport.\nNEVER apply gradients to text-heavy content or reading areas.\nNEVER use gradients on small UI elements (<100px width).\nNEVER stack multiple gradient layers in the same viewport.\n\n**ENFORCEMENT RULE:**\n    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors\n\n**How and where to use:**\n   • Section backgrounds (not content backgrounds)\n   • Hero section header content. Eg: dark to light to dark color\n   • Decorative overlays and accent elements only\n   • Hero section with 2-3 mild color\n   • Gradients creation can be done for any angle say horizontal, vertical or diagonal\n\n- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**\n\n</Font Guidelines>\n\n- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. \n   \n- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.\n\n- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.\n   \n- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly\n    Eg: - if it implies playful/energetic, choose a colorful scheme\n           - if it implies monochrome/minimal, choose a black–white/neutral scheme\n\n**Component Reuse:**\n\t- Prioritize using pre-existing components from src/components/ui when applicable\n\t- Create new components that match the style and conventions of existing components when needed\n\t- Examine existing components to understand the project's component patterns before creating new ones\n\n**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component\n\n**Best Practices:**\n\t- Use Shadcn/UI as the primary component library for consistency and accessibility\n\t- Import path: ./components/[component-name]\n\n**Export Conventions:**\n\t- Components MUST use named exports (export const ComponentName = ...)\n\t- Pages MUST use default exports (export default function PageName() {...})\n\n**Toasts:**\n  - Use `sonner` for toasts\"\n  - Sonner component are located in `/app/src/components/ui/sonner.tsx`\n\nUse 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals."
}
