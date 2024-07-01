// shaders.js

const shaders = [
    {
      name: "Color Wave",
      code: `
        uniform float u_time;
        uniform vec2 u_resolution;
        
        void main() {
          vec2 st = gl_FragCoord.xy / u_resolution.xy;
          vec3 color = vec3(0.0);
          color = vec3(st.x, st.y, abs(sin(u_time)));
          gl_FragColor = vec4(color, 1.0);
        }
      `
    },
    {
      name: "Plasma",
      code: `
        uniform float u_time;
        uniform vec2 u_resolution;
        
        void main() {
          vec2 st = gl_FragCoord.xy / u_resolution.xy;
          float x = st.x * 10.0 + u_time;
          float y = st.y * 10.0 + u_time;
          
          float r = sin(x) * 0.5 + 0.5;
          float g = sin(y) * 0.5 + 0.5;
          float b = sin(x + y + u_time) * 0.5 + 0.5;
          
          gl_FragColor = vec4(r, g, b, 1.0);
        }
      `
    },
    {
      name: "Starfield",
      code: `
        uniform float u_time;
        uniform vec2 u_resolution;
        
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }
        
        void main() {
          vec2 st = gl_FragCoord.xy / u_resolution.xy;
          float star = random(floor(st * 100.0));
          star = pow(star, 20.0);
          
          float twinkle = sin(u_time * 10.0 + random(st) * 6.28) * 0.5 + 0.5;
          star *= twinkle;
          
          vec3 color = vec3(star);
          
          gl_FragColor = vec4(color, 1.0);
        }
      `
    },
    {
      name: "Rainbow Swirl",
      code: `
        uniform float u_time;
        uniform vec2 u_resolution;
        
        void main() {
          vec2 st = gl_FragCoord.xy / u_resolution.xy;
          vec2 toCenter = vec2(0.5) - st;
          float angle = atan(toCenter.y, toCenter.x);
          float radius = length(toCenter) * 2.0;
          
          float r = sin(angle * 3.0 + u_time) * 0.5 + 0.5;
          float g = sin(angle * 3.0 + u_time + 2.094) * 0.5 + 0.5;
          float b = sin(angle * 3.0 + u_time + 4.189) * 0.5 + 0.5;
          
          gl_FragColor = vec4(r, g, b, 1.0);
        }
      `
    },
    {
      name: "Ripple",
      code: `
        uniform float u_time;
        uniform vec2 u_resolution;
        
        void main() {
          vec2 st = gl_FragCoord.xy / u_resolution.xy;
          vec2 toCenter = vec2(0.5) - st;
          float dist = length(toCenter);
          
          float ripple = sin(dist * 50.0 - u_time * 5.0) * 0.5 + 0.5;
          
          gl_FragColor = vec4(vec3(ripple), 1.0);
        }
      `
    },
    {
      name: "Mosaic",
      code: `
        uniform float u_time;
        uniform vec2 u_resolution;
        
        void main() {
          vec2 st = gl_FragCoord.xy / u_resolution.xy;
          st *= 10.0; // Scale up the space by 10
          st = fract(st); // Wrap around 1.0
          
          vec3 color = vec3(st.x, st.y, abs(sin(u_time)));
          
          gl_FragColor = vec4(color, 1.0);
        }
      `
    },
    {
      name: "Kaleidoscope",
      code: `
        uniform float u_time;
        uniform vec2 u_resolution;
        
        void main() {
          vec2 st = gl_FragCoord.xy / u_resolution.xy;
          vec2 toCenter = vec2(0.5) - st;
          float angle = atan(toCenter.y, toCenter.x);
          float radius = length(toCenter);
          
          angle = mod(angle, 3.14159 / 3.0) - 3.14159 / 6.0;
          st = vec2(cos(angle), sin(angle)) * radius;
          
          vec3 color = vec3(st.x, st.y, abs(sin(u_time)));
          
          gl_FragColor = vec4(color, 1.0);
        }
      `
    },
    {
      name: "Hypnotic Spiral",
      code: `
        uniform float u_time;
        uniform vec2 u_resolution;
        
        void main() {
          vec2 st = gl_FragCoord.xy / u_resolution.xy;
          vec2 toCenter = vec2(0.5) - st;
          float angle = atan(toCenter.y, toCenter.x);
          float radius = length(toCenter);
          
          float spiral = sin(radius * 20.0 + angle * 10.0 + u_time * 2.0) * 0.5 + 0.5;
          
          gl_FragColor = vec4(vec3(spiral), 1.0);
        }
      `
    },
    {
      name: "Lava Lamp",
      code: `
        uniform float u_time;
        uniform vec2 u_resolution;
        
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }
        
        float noise(vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }
        
        void main() {
          vec2 st = gl_FragCoord.xy / u_resolution.xy;
          vec3 color = vec3(0.0);
          
          vec2 pos = vec2(st * 3.0);
          float n = noise(pos + u_time * 0.5);
          
          color = vec3(1.0, 0.2, 0.0) * (n * 2.0);
          color += vec3(0.8, 0.0, 0.0) * (1.0 - n);
          
          gl_FragColor = vec4(color, 1.0);
        }
      `
    },
    {
      name: "Electric Field",
      code: `
        uniform float u_time;
        uniform vec2 u_resolution;
        
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }
        
        void main() {
          vec2 st = gl_FragCoord.xy / u_resolution.xy;
          float r = random(st);
          
          float electric = abs(sin(st.y * 100.0 + u_time * 5.0 + r * 6.28) * sin(st.x * 100.0));
          electric = smoothstep(0.8, 0.81, electric);
          
          vec3 color = vec3(0.2, 0.5, 1.0) * electric;
          
          gl_FragColor = vec4(color, 1.0);
        }
      `
    }
  ];
  
  export default shaders;